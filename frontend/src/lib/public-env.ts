/**
 * Centralized public environment resolution for Next.js (Vercel + local dev).
 *
 * RULES:
 * - Never rely on hardcoded production URLs — use `NEXT_PUBLIC_*` on Vercel.
 * - On Vercel, `VERCEL_URL` is a safe fallback for **server-side** absolute URLs when
 *   `NEXT_PUBLIC_SITE_URL` is not yet set (e.g. preview deployments).
 * - On Vercel (`VERCEL=1`), missing `NEXT_PUBLIC_*` throws so misconfigured deploys fail in CI.
 * - Local `next build` (NODE_ENV=production without Vercel) uses loopback fallbacks for prerender only.
 */

const TRAILING_SLASH = /\/+$/;

function isVercelDeployment(): boolean {
  return process.env.VERCEL === "1";
}

function stripTrailingSlash(url: string): string {
  return url.replace(TRAILING_SLASH, "");
}

/** Ensures API base ends with `/api` (matches Express mount). */
export function normalizeApiBaseUrl(base: string): string {
  const trimmed = stripTrailingSlash(base.trim());
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

/**
 * Canonical public site URL (metadata, OG, sitemap). Server-only usage recommended.
 */
export function getPublicSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return stripTrailingSlash(configured);

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${stripTrailingSlash(vercel)}`;

  if (isVercelDeployment()) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is not set. In Vercel → Settings → Environment Variables, add NEXT_PUBLIC_SITE_URL (your public https:// domain).",
    );
  }

  // Local `next build` uses NODE_ENV=production without Vercel env — use loopback for prerender only.
  return "http://127.0.0.1:3000";
}

/**
 * API base for server components / Route Handlers / `fetch` to Render.
 */
export function getServerApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) return normalizeApiBaseUrl(configured);

  if (isVercelDeployment()) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Add it in Vercel (e.g. https://your-api.onrender.com/api).",
    );
  }

  return normalizeApiBaseUrl("http://127.0.0.1:5000");
}

/**
 * API base for the browser (Axios). Inlined at build time from `NEXT_PUBLIC_API_URL`.
 */
export function getBrowserApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) return normalizeApiBaseUrl(configured);

  if (isVercelDeployment()) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is required on Vercel (Settings → Environment Variables).",
    );
  }

  return normalizeApiBaseUrl("http://127.0.0.1:5000");
}
