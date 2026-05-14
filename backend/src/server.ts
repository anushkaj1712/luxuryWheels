/**
 * HTTP server bootstrap — production-hardened for Render:
 * - Loads env from repo root `.env` then `backend/.env`
 * - Validates configuration (`loadEnv`)
 * - Connects Prisma before accepting traffic
 * - Sets sensible HTTP timeouts behind reverse proxies
 * - Graceful shutdown on SIGTERM / SIGINT (Render sends SIGTERM)
 */

import path from "path";
import fs from "fs";
import http from "http";
import dotenv from "dotenv";
import { createApp } from "./app";
import { prisma } from "./lib/prisma";
import { logger } from "./lib/logger";
import { loadEnv } from "./config/env";

const rootEnv = path.resolve(process.cwd(), "../.env");
if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
}
dotenv.config();

async function bootstrap() {
  let env;
  try {
    env = loadEnv();
  } catch (e) {
    logger.error("Environment validation failed — fix variables and restart", {
      err: String(e),
    });
    process.exit(1);
  }

  try {
    await prisma.$connect();
    logger.info("Prisma connected to database");
  } catch (e) {
    logger.error("Prisma failed to connect — check DATABASE_URL / network / SSL", {
      err: String(e),
    });
    process.exit(1);
  }

  const app = createApp();
  const port = env.PORT;
  const server = http.createServer(app);

  // Render / nginx: avoid 502s on slow clients — values in ms (Node defaults are often too low).
  server.keepAliveTimeout = 65_000;
  server.headersTimeout = 70_000;
  server.requestTimeout = env.API_REQUEST_TIMEOUT_MS;

  server.listen(port, () => {
    const addr = server.address();
    const where =
      typeof addr === "object" && addr && "port" in addr
        ? `port ${addr.port}`
        : JSON.stringify(addr);
    logger.info("Drive Luxury Wheels API listening", { bind: where, nodeEnv: env.NODE_ENV });
  });

  async function shutdown(signal: string) {
    logger.info("Shutdown signal received", { signal });
    server.close((err) => {
      if (err) logger.error("HTTP server close error", { err: String(err) });
    });
    try {
      await prisma.$disconnect();
      logger.info("Prisma disconnected cleanly");
    } catch (e) {
      logger.error("Prisma disconnect error", { err: String(e) });
    }
    process.exit(0);
  }

  process.once("SIGTERM", () => void shutdown("SIGTERM"));
  process.once("SIGINT", () => void shutdown("SIGINT"));
}

void bootstrap();
