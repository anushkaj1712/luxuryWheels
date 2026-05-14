import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth.middleware";

const r = Router();

/** POST /api/inquiries — public lead capture (optionally links logged-in user). */
r.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, subject, message, source } = req.body ?? {};
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const inquiry = await prisma.inquiry.create({
      data: { name, email, phone, subject, message, source },
    });
    res.json({ success: true, data: { id: inquiry.id } });
  } catch (e) {
    next(e);
  }
});

/** GET /api/inquiries — admin list */
r.get("/", requireAuth, async (req, res, next) => {
  try {
    if (req.user?.role !== "ADMIN" && req.user?.role !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const data = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

export const inquiryRouter = r;
