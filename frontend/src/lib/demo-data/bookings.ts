/** Matches `GET /api/bookings/me` array items (subset used by dashboard UI). */
export const DEMO_BOOKINGS_ME = [
  {
    id: "demo-b1",
    status: "CONFIRMED",
    receiptNumber: "DLW-DEMO-001",
    car: { brand: "Lamborghini", model: "Huracán STO" },
  },
];

/** Matches `POST /api/bookings` success payload. */
export function buildDemoBookingCreateResponse() {
  return {
    bookingId: "demo-booking-id",
    paymentId: "demo-payment-id",
    receiptNumber: "DLW-DEMO-PENDING",
    gateway: { mode: "demo" as const, url: null as string | null },
  };
}
