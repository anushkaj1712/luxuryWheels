import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

/**
 * Central error handler — never leak stack traces in production.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: process.env.NODE_ENV === "development" ? err.details : undefined,
    });
  }

  // eslint-disable-next-line no-console
  console.error("Unhandled error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
