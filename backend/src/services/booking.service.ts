/**
 * BookingService + PaymentService — reservation flow:
 * 1) User selects token amount
 * 2) Backend creates Booking (PENDING_PAYMENT) + Payment (PENDING)
 * 3) Client completes Stripe/Razorpay checkout
 * 4) Webhook or client confirmation updates Payment + Booking to SUCCEEDED / RESERVED
 *
 * Demo mode: when gateway keys are missing, returns mock clientSecret / orderId for UI wiring.
 */

import type { BookingStatus, PaymentProvider, PaymentStatus } from "@prisma/client";
import Stripe from "stripe";
import Razorpay from "razorpay";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { sendMail } from "../utils/mailer";

export class BookingService {
  async createReservation(input: {
    userId: string;
    carId: string;
    tokenAmount: number;
    currency?: string;
    provider: PaymentProvider;
  }) {
    const car = await prisma.car.findUnique({ where: { id: input.carId } });
    if (!car?.isAvailable) throw new AppError(400, "Car not available");

    const receiptNumber = `DLW-${Date.now().toString(36).toUpperCase()}`;

    const booking = await prisma.booking.create({
      data: {
        userId: input.userId,
        carId: input.carId,
        status: "PENDING_PAYMENT",
        tokenAmount: input.tokenAmount,
        currency: input.currency ?? "INR",
        receiptNumber,
      },
    });

    const payment = await prisma.payment.create({
      data: {
        userId: input.userId,
        bookingId: booking.id,
        provider: input.provider,
        amount: input.tokenAmount,
        currency: input.currency ?? "INR",
        status: "PENDING",
      },
    });

    const gateway = await createGatewayPayload({
      provider: input.provider,
      amount: input.tokenAmount,
      currency: input.currency ?? "INR",
      metadata: { bookingId: booking.id, paymentId: payment.id },
    });

    return { booking, payment, gateway };
  }

  async markPaid(input: { paymentId: string; providerPaymentId: string; raw?: unknown }) {
    const payment = await prisma.payment.update({
      where: { id: input.paymentId },
      data: {
        status: "SUCCEEDED" as PaymentStatus,
        providerPaymentId: input.providerPaymentId,
        rawPayload: input.raw as object | undefined,
      },
      include: { booking: true, user: true },
    });

    if (payment.bookingId) {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: "RESERVED" as BookingStatus },
      });
    }

    await prisma.notification.create({
      data: {
        userId: payment.userId,
        type: "BOOKING",
        title: "Reservation confirmed",
        body: "Your token payment was received. Our concierge will contact you shortly.",
        link: "/dashboard",
      },
    });

    if (payment.user?.email) {
      await sendMail({
        to: payment.user.email,
        subject: "Drive Luxury Wheels — Reservation confirmed",
        html: `<p>Hi ${payment.user.name},</p><p>Your booking is confirmed. Receipt: ${payment.booking?.receiptNumber ?? ""}</p>`,
      });
    }

    return payment;
  }

  async listForUser(userId: string) {
    return prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { car: { include: { images: { take: 1 } } }, payments: true },
    });
  }

  async listAllAdmin() {
    return prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: { car: true, user: { select: { id: true, name: true, email: true } }, payments: true },
    });
  }
}

async function createGatewayPayload(input: {
  provider: PaymentProvider;
  amount: number;
  currency: string;
  metadata: Record<string, string>;
}) {
  if (input.provider === "STRIPE") {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return {
        mode: "demo",
        clientSecret: "demo_client_secret",
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY_PLACEHOLDER ?? "pk_test_placeholder",
      };
    }
    // Stripe SDK pins a compatible default API version for the installed major version.
    const stripe = new Stripe(secret);
    const pi = await stripe.paymentIntents.create({
      amount: Math.round(input.amount * 100),
      currency: input.currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: input.metadata,
    });
    return { mode: "stripe", clientSecret: pi.client_secret, paymentIntentId: pi.id };
  }

  if (input.provider === "RAZORPAY") {
    const key = process.env.RAZORPAY_KEY_ID;
    const sec = process.env.RAZORPAY_KEY_SECRET;
    if (!key || !sec) {
      return { mode: "demo", orderId: "demo_order", amount: input.amount, currency: input.currency };
    }
    const rp = new Razorpay({ key_id: key, key_secret: sec });
    const order = await rp.orders.create({
      amount: Math.round(input.amount * 100),
      currency: input.currency,
      receipt: input.metadata.bookingId,
      notes: input.metadata,
    });
    return { mode: "razorpay", orderId: order.id, amount: order.amount, currency: order.currency, keyId: key };
  }

  throw new AppError(400, "Unsupported provider");
}

export const bookingService = new BookingService();
