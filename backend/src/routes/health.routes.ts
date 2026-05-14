import { Router } from "express";
import { prisma } from "../lib/prisma";
import { logger } from "../lib/logger";

/**
 * Health checks for Render / load balancers / uptime monitors.
 *
 * - `GET /api/health` — quick JSON (process up).
 * - `GET /api/health/live` — liveness (no DB); use when DB may be briefly unavailable during deploy.
 * - `GET /api/health/ready` — readiness (PostgreSQL reachable); use after migrations for traffic routing.
 */
export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "ok",
    data: {
      service: "drive-luxury-wheels-api",
      uptimeSec: Math.round(process.uptime()),
      env: process.env.NODE_ENV ?? "development",
    },
  });
});

healthRouter.get("/live", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "live",
    data: { live: true },
  });
});

healthRouter.get("/ready", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      message: "ready",
      data: { database: "connected" },
    });
  } catch (err) {
    logger.error("Readiness check failed", { err: String(err) });
    res.status(503).json({
      success: false,
      message: "Database unavailable",
      data: null as null,
    });
  }
});
