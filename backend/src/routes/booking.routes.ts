import { Router } from "express";
import type { PaymentProvider } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth.middleware";
import { bookingService } from "../services/booking.service";

const r = Router();

/** POST /api/bookings — create reservation + payment shell (auth). */
r.post("/", requireAuth, async (req, res, next) => {
  try {
    const { carId, tokenAmount, currency, provider } = req.body ?? {};
    if (!carId || !tokenAmount || !provider) {
      return res.status(400).json({ message: "carId, tokenAmount, provider required" });
    }
    const { booking, payment, gateway } = await bookingService.createReservation({
      userId: req.user!.sub,
      carId,
      tokenAmount: Number(tokenAmount),
      currency,
      provider: provider as PaymentProvider,
    });
    res.json({
      success: true,
      data: {
        bookingId: booking.id,
        paymentId: payment.id,
        receiptNumber: booking.receiptNumber,
        gateway,
      },
    });
  } catch (e) {
    next(e);
  }
});

/** GET /api/bookings/me — user's bookings. */
r.get("/me", requireAuth, async (req, res, next) => {
  try {
    const data = await bookingService.listForUser(req.user!.sub);
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/bookings/demo-confirm — development-only: marks payment succeeded without gateway.
 * Remove or protect in production (admin-only or webhook-only).
 */
r.post("/demo-confirm", requireAuth, async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({ message: "Not available in production" });
    }
    const { paymentId } = req.body ?? {};
    if (!paymentId) return res.status(400).json({ message: "paymentId required" });
    const pay = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!pay || pay.userId !== req.user!.sub) return res.status(403).json({ message: "Forbidden" });
    await bookingService.markPaid({
      paymentId,
      providerPaymentId: `demo_${Date.now()}`,
      raw: { demo: true },
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

export const bookingRouter = r;
