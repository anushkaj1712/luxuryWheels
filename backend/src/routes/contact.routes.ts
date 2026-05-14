import { Router } from "express";
import { prisma } from "../lib/prisma";

const r = Router();

/** POST /api/contact — simple contact form (maps to ContactMessage table). */
r.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body ?? {};
    if (!name || !email || !message) return res.status(400).json({ message: "Missing fields" });
    const row = await prisma.contactMessage.create({ data: { name, email, phone, message } });
    res.json({ success: true, data: { id: row.id } });
  } catch (e) {
    next(e);
  }
});

export const contactRouter = r;
