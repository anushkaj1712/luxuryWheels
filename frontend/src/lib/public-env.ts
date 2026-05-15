/**
 * Centralized public environment resolution for Next.js (Vercel + local dev + offline demo).
 *
 * RULES:
 * - **Never throw during `next build`** — missing `NEXT_PUBLIC_*` must not break static generation.
 * - When `NEXT_PUBLIC_API_URL` is absent, the browser Axios client targets a non-routable placeholder host;
 *   `src/lib/demo-axios-resolver.ts` turns failed requests into curated demo payloads.
 * - On Vercel, `VERCEL_URL` supplies a safe server-side absolute URL when `NEXT_PUBLIC_SITE_URL` is absent.
 */

const TRAILING_SLASH = /\/+$/;

/**
 * Intentionally unroutable host (RFC 6761 `.invalid`) so failed DNS never hits a real third party.
 * Axios + demo resolver then serve synthetic JSON identical to the Express API envelope.
 */
export const OFFLINE_API_PLACEHOLDER_BASE = "https://offline.api.invalid/api";

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

  return "http://127.0.0.1:3000";
}

/**
 * Live API base for server components, or `null` when unset (caller should use demo fallbacks).
 */
export function getServerApiBaseUrl(): string | null {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) return normalizeApiBaseUrl(configured);
  return null;
}

/**
 * Axios `baseURL` — always a string: real API or offline placeholder (demo resolver handles responses).
 */
export function getBrowserApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) return normalizeApiBaseUrl(configured);
  return OFFLINE_API_PLACEHOLDER_BASE;
}

/** `true` when no public API URL was provided at build time (showcase / Vercel demo). */
export function isPublicDemoDataset(): boolean {
  return !process.env.NEXT_PUBLIC_API_URL?.trim();
}
