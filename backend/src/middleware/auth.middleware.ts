import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import type { UserRole } from "@prisma/client";

export interface AuthPayload {
  sub: string;
  role: UserRole;
}

/**
 * Express request augmentation — JWT user context after `requireAuth`.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/**
 * Verifies `Authorization: Bearer <jwt>` and attaches `req.user`.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AppError(401, "Unauthorized"));
  }
  const token = header.slice("Bearer ".length);
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET missing");
    const decoded = jwt.verify(token, secret) as AuthPayload;
    req.user = decoded;
    return next();
  } catch {
    return next(new AppError(401, "Invalid or expired token"));
  }
}

/**
 * Admin guard — use after `requireAuth`.
 */
export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) return next(new AppError(401, "Unauthorized"));
  if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
    return next(new AppError(403, "Forbidden"));
  }
  return next();
}
