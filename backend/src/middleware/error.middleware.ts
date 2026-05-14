import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { logger } from "../lib/logger";

/**
 * Central error handler — never leak stack traces in production.
 * Responses follow `{ success, message, data? }` for predictable clients.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null as null,
      details: process.env.NODE_ENV === "development" ? err.details : undefined,
    });
  }

  logger.error("Unhandled error", { err: String(err) });
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    data: null as null,
  });
}
