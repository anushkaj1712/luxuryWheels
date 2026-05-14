import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth.middleware";

const r = Router();

/** POST /api/reviews — authenticated user submits review for a car. */
r.post("/", requireAuth, async (req, res, next) => {
  try {
    const { carId, rating, title, content } = req.body ?? {};
    if (!carId || !rating || !content) return res.status(400).json({ message: "Missing fields" });
    const review = await prisma.review.upsert({
      where: { userId_carId: { userId: req.user!.sub, carId } },
      create: {
        userId: req.user!.sub,
        carId,
        rating: Number(rating),
        title,
        content,
      },
      update: { rating: Number(rating), title, content },
    });
    res.json({ success: true, data: review });
  } catch (e) {
    next(e);
  }
});

/** GET /api/reviews/car/:carId */
r.get("/car/:carId", async (req, res, next) => {
  try {
    const data = await prisma.review.findMany({
      where: { carId: req.params.carId },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, avatarUrl: true } } },
    });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

export const reviewRouter = r;
