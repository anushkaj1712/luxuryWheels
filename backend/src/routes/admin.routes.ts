import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware";
import { bookingService } from "../services/booking.service";

const r = Router();

r.use(requireAuth, requireAdmin);

/** GET /api/admin/analytics — lightweight counts for dashboard charts. */
r.get("/analytics", async (_req, res, next) => {
  try {
    const [cars, bookings, users, revenue] = await Promise.all([
      prisma.car.count(),
      prisma.booking.count(),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.payment.aggregate({
        where: { status: "SUCCEEDED" },
        _sum: { amount: true },
      }),
    ]);
    res.json({
      success: true,
      data: {
        cars,
        bookings,
        users,
        revenueTotal: Number(revenue._sum.amount ?? 0),
      },
    });
  } catch (e) {
    next(e);
  }
});

/** GET /api/admin/bookings */
r.get("/bookings", async (_req, res, next) => {
  try {
    const data = await bookingService.listAllAdmin();
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

/** CRUD cars — POST create */
r.post("/cars", async (req, res, next) => {
  try {
    const body = req.body ?? {};
    const car = await prisma.car.create({ data: mapCarInput(body) });
    res.json({ success: true, data: car });
  } catch (e) {
    next(e);
  }
});

/** PATCH /api/admin/cars/:id */
r.patch("/cars/:id", async (req, res, next) => {
  try {
    const car = await prisma.car.update({ where: { id: req.params.id }, data: mapCarInput(req.body ?? {}, true) });
    res.json({ success: true, data: car });
  } catch (e) {
    next(e);
  }
});

/** DELETE /api/admin/cars/:id */
r.delete("/cars/:id", async (req, res, next) => {
  try {
    await prisma.car.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** Testimonials */
r.get("/testimonials", async (_req, res, next) => {
  try {
    const data = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

r.post("/testimonials", async (req, res, next) => {
  try {
    const { name, role, quote, rating, featured, avatarUrl } = req.body ?? {};
    if (!name || !quote) return res.status(400).json({ message: "Missing fields" });
    const row = await prisma.testimonial.create({
      data: { name, role, quote, rating: Number(rating ?? 5), featured: Boolean(featured), avatarUrl },
    });
    res.json({ success: true, data: row });
  } catch (e) {
    next(e);
  }
});

/** Users list (PII — keep admin-only). */
r.get("/users", async (_req, res, next) => {
  try {
    const data = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      take: 500,
    });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

function mapCarInput(body: any, partial = false) {
  const base: any = {
    slug: body.slug,
    brand: body.brand,
    model: body.model,
    year: body.year != null ? Number(body.year) : undefined,
    price: body.price != null ? Number(body.price) : undefined,
    mileage: body.mileage != null ? Number(body.mileage) : undefined,
    fuel: body.fuel,
    transmission: body.transmission,
    engine: body.engine,
    horsepower: body.horsepower != null ? Number(body.horsepower) : undefined,
    torqueNm: body.torqueNm != null ? Number(body.torqueNm) : undefined,
    color: body.color,
    description: body.description ?? "Premium luxury vehicle.",
    features: Array.isArray(body.features) ? body.features : [],
    vin: body.vin,
    locationCity: body.locationCity,
    isFeatured: body.isFeatured,
    isAvailable: body.isAvailable,
    brochureUrl: body.brochureUrl,
    videoUrl: body.videoUrl,
    model3dUrl: body.model3dUrl,
  };
  if (partial) {
    Object.keys(base).forEach((k) => base[k] === undefined && delete base[k]);
    return base;
  }
  return base;
}

export const adminRouter = r;
