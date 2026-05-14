/**
 * Express application factory — middleware + route mounting.
 *
 * DEPLOYMENT: behind Render’s reverse proxy, `trust proxy` is enabled in production
 * so `req.secure` / IP limits behave correctly.
 *
 * CSRF note: JWT in Authorization header is not vulnerable to classic CSRF.
 * If you add cookie-based sessions later, add CSRF tokens or SameSite=strict cookies.
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { buildCorsOptions } from "./config/cors";
import { apiLimiter } from "./middleware/rateLimit.middleware";
import { errorHandler } from "./middleware/error.middleware";
import { requestTimeoutMiddleware } from "./middleware/timeout.middleware";
import { authRouter } from "./routes/auth.routes";
import { carRouter } from "./routes/car.routes";
import { bookingRouter } from "./routes/booking.routes";
import { blogRouter } from "./routes/blog.routes";
import { wishlistRouter } from "./routes/wishlist.routes";
import { reviewRouter } from "./routes/review.routes";
import { inquiryRouter } from "./routes/inquiry.routes";
import { adminRouter } from "./routes/admin.routes";
import { uploadRouter } from "./routes/upload.routes";
import { healthRouter } from "./routes/health.routes";
import { contactRouter } from "./routes/contact.routes";

const requestTimeoutMs = Number(process.env.API_REQUEST_TIMEOUT_MS) || 30_000;

export function createApp() {
  const app = express();

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  app.use(helmet());
  app.use(cors(buildCorsOptions()));
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: "2mb" }));
  app.use(requestTimeoutMiddleware(requestTimeoutMs));

  app.use("/api", apiLimiter);

  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/cars", carRouter);
  app.use("/api/bookings", bookingRouter);
  app.use("/api/blogs", blogRouter);
  app.use("/api/wishlist", wishlistRouter);
  app.use("/api/reviews", reviewRouter);
  app.use("/api/inquiries", inquiryRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/upload", uploadRouter);
  app.use("/api/contact", contactRouter);

  app.use(errorHandler);
  return app;
}
