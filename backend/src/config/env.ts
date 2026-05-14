/**
 * =============================================================================
 * ENVIRONMENT VARIABLES — Drive Luxury Wheels API
 * =============================================================================
 * Prefer repo root `.env` (see root `.env.example`). You may also use `backend/.env`.
 *
 * DEPLOYMENT (Vercel + Render + Neon/Supabase):
 * - Render: set all secrets in the dashboard; never commit `.env`.
 * - `CLIENT_URL` = exact Vercel site origin (https://…), used for CORS.
 * - Optional `CORS_ORIGINS` = comma-separated extra origins (preview deploys).
 * - `DATABASE_URL` = pooled connection string (Neon pooler or Supabase pooler recommended).
 *
 * WHERE TO CREATE ACCOUNTS (step-by-step):
 *
 * 1) DATABASE (Supabase OR Neon PostgreSQL)
 *    - Supabase: https://supabase.com → New project → Settings → Database → URI
 *    - Neon: https://neon.tech → Create project → copy connection string
 *    - Set `DATABASE_URL` (add ?schema=public if required)
 *
 * 2) Cloudinary (image/video CDN)
 *    - https://cloudinary.com → Sign up → Dashboard shows:
 *      CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *
 * 3) Stripe (cards, global)
 *    - https://dashboard.stripe.com → Developers → API keys
 *      STRIPE_SECRET_KEY (sk_test_...), STRIPE_WEBHOOK_SECRET for webhooks
 *
 * 4) Razorpay (India — UPI, cards, netbanking)
 *    - https://dashboard.razorpay.com → Settings → API Keys
 *      RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
 *
 * 5) Google OAuth
 *    - https://console.cloud.google.com → APIs & Services → Credentials
 *      Create OAuth Client (Web) → Authorized redirect URIs must match backend callback
 *      GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
 *
 * 6) Gmail App Password (Nodemailer)
 *    - Google Account → Security → 2-Step Verification ON → App passwords
 *      Generate app password for "Mail"
 *      EMAIL_HOST=smtp.gmail.com, EMAIL_PORT=587, EMAIL_USER=you@gmail.com, EMAIL_PASS=app-password
 *
 * 7) Render (API hosting) — https://render.com → Web Service → connect repo → set env vars
 * 8) Vercel (frontend) — import monorepo root, set root directory to `frontend`, set NEXT_PUBLIC_* vars
 *
 * Demo mode: leave payment keys blank; API returns mock payment intents for local UX testing.
 * =============================================================================
 */

import { z } from "zod";

function isLoopbackUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
  } catch {
    return false;
  }
}

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(5000),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    JWT_SECRET: z.string().min(16, "JWT_SECRET must be strong (16+ chars)"),
    JWT_EXPIRES_IN: z.string().default("7d"),
    /** Canonical browser origin for your deployed Next.js app (Vercel production URL). */
    CLIENT_URL: z.string().url().default("http://localhost:3000"),
    /** Comma-separated extra allowed origins (e.g. Vercel preview URLs). */
    CORS_ORIGINS: z.string().optional(),
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).optional(),
    API_REQUEST_TIMEOUT_MS: z.coerce.number().min(1000).max(120_000).default(30_000),
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    RAZORPAY_KEY_ID: z.string().optional(),
    RAZORPAY_KEY_SECRET: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CALLBACK_URL: z.string().optional(),
    EMAIL_HOST: z.string().optional(),
    EMAIL_PORT: z.coerce.number().optional(),
    EMAIL_USER: z.string().optional(),
    EMAIL_PASS: z.string().optional(),
    EMAIL_FROM: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV !== "production") return;
    if (isLoopbackUrl(data.CLIENT_URL)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "CLIENT_URL must be your public frontend origin (https://…) on Render, not localhost.",
        path: ["CLIENT_URL"],
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
}
