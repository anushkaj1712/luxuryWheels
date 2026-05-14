import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth.middleware";

const r = Router();

/** GET /api/wishlist — list saved cars. */
r.get("/", requireAuth, async (req, res, next) => {
  try {
    const items = await prisma.wishlist.findMany({
      where: { userId: req.user!.sub },
      include: { car: { include: { images: { take: 1, orderBy: { sortOrder: "asc" } } } } },
    });
    res.json({ success: true, data: items });
  } catch (e) {
    next(e);
  }
});

/** POST /api/wishlist — add car id. */
r.post("/", requireAuth, async (req, res, next) => {
  try {
    const { carId } = req.body ?? {};
    if (!carId) return res.status(400).json({ message: "carId required" });
    await prisma.wishlist.upsert({
      where: { userId_carId: { userId: req.user!.sub, carId } },
      create: { userId: req.user!.sub, carId },
      update: {},
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** DELETE /api/wishlist/:carId */
r.delete("/:carId", requireAuth, async (req, res, next) => {
  try {
    await prisma.wishlist.deleteMany({
      where: { userId: req.user!.sub, carId: String(req.params.carId) },
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

export const wishlistRouter = r;
