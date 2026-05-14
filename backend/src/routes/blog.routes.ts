import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware";

const r = Router();

/** GET /api/blogs — published posts with optional category + search. */
r.get("/", async (req, res, next) => {
  try {
    const where: any = { published: true };
    if (req.query.category) where.category = { slug: String(req.query.category) };
    if (req.query.search) {
      where.OR = [
        { title: { contains: String(req.query.search), mode: "insensitive" } },
        { excerpt: { contains: String(req.query.search), mode: "insensitive" } },
      ];
    }
    const data = await prisma.blog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

/** GET /api/blogs/:slug */
r.get("/:slug", async (req, res, next) => {
  try {
    const post = await prisma.blog.findFirst({
      where: { slug: req.params.slug, published: true },
      include: { category: true },
    });
    if (!post) return res.status(404).json({ message: "Not found" });
    const related = await prisma.blog.findMany({
      where: { published: true, categoryId: post.categoryId ?? undefined, NOT: { id: post.id } },
      take: 3,
    });
    res.json({ success: true, data: { post, related } });
  } catch (e) {
    next(e);
  }
});

/** POST /api/blogs — admin create (minimal body). */
r.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { slug, title, excerpt, contentHtml, coverImageUrl, categoryId, published } = req.body ?? {};
    if (!slug || !title || !contentHtml) return res.status(400).json({ message: "Missing fields" });
    const blog = await prisma.blog.create({
      data: {
        slug,
        title,
        excerpt,
        contentHtml,
        coverImageUrl,
        categoryId,
        published: Boolean(published),
      },
    });
    res.json({ success: true, data: blog });
  } catch (e) {
    next(e);
  }
});

export const blogRouter = r;
