import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });
const r = Router();

/**
 * POST /api/upload/image — multipart file → Cloudinary secure URL.
 * Configure CLOUDINARY_* env vars; otherwise returns instructions (501).
 */
r.post("/image", requireAuth, requireAdmin, upload.single("file"), async (req, res) => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(501).json({
      message: "Cloudinary not configured",
      hint: "Create account at https://cloudinary.com and set CLOUDINARY_* in .env",
    });
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
  if (!req.file?.buffer) return res.status(400).json({ message: "file required" });
  const b64 = Buffer.from(req.file.buffer).toString("base64");
  const dataUri = `data:${req.file.mimetype};base64,${b64}`;
  const result = await cloudinary.uploader.upload(dataUri, { folder: "dlw/cars" });
  res.json({ success: true, data: { url: result.secure_url, publicId: result.public_id } });
});

export const uploadRouter = r;
