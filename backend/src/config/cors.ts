import type { CorsOptions } from "cors";
import { logger } from "../lib/logger";

/**
 * Production-safe CORS for Vercel frontend + Render API.
 *
 * - Set `CLIENT_URL` to your canonical browser origin (e.g. https://app.vercel.app).
 * - Optional `CORS_ORIGINS`: comma-separated extra origins (preview URLs, staging).
 * - In development, common loopback origins are allowed when `NODE_ENV !== "production"`.
 */

function normalizeOrigin(url: string): string | null {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

function collectAllowedOrigins(): Set<string> {
  const set = new Set<string>();

  const primary = process.env.CLIENT_URL?.trim();
  if (primary) {
    const o = normalizeOrigin(primary);
    if (o) set.add(o);
  }

  const extras = process.env.CORS_ORIGINS?.split(",") ?? [];
  for (const raw of extras) {
    const t = raw.trim();
    if (!t) continue;
    const o = normalizeOrigin(t);
    if (o) set.add(o);
  }

  if (process.env.NODE_ENV !== "production") {
    set.add("http://localhost:3000");
    set.add("http://127.0.0.1:3000");
  }

  return set;
}

/**
 * Express `cors` options: credentials + explicit allow-list in production.
 */
export function buildCorsOptions(): CorsOptions {
  const allowed = collectAllowedOrigins();
  const list = [...allowed];

  return {
    credentials: true,
    origin: (origin, callback) => {
      // Same-origin / server-to-server / curl often send no Origin header
      if (!origin) {
        return callback(null, true);
      }
      if (list.includes(origin)) {
        return callback(null, true);
      }
      logger.warn("CORS request rejected", { origin });
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    maxAge: 86400,
  };
}
