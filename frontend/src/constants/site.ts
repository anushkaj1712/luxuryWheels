/**
 * Public site + API wiring for the browser bundle.
 * `NEXT_PUBLIC_API_URL` optional: when absent, Axios uses an unroutable placeholder and demo fallbacks apply.
 */
import { getBrowserApiBaseUrl, isPublicDemoDataset } from "@/lib/public-env";

export const SITE_NAME = "Drive Luxury Wheels";
export const SITE_TAGLINE = "LUXURY | LEGACY | LIFESTYLE";
export const SITE_TAGLINE_PARTS = ["LUXURY", "LEGACY", "LIFESTYLE"] as const;
export const LOGO_PATH = "/logo.png";
export const API_URL = getBrowserApiBaseUrl();

/** Hide the subtle demo ribbon only when explicitly disabled. */
export const SHOW_DEMO_RIBBON = isPublicDemoDataset() && process.env.NEXT_PUBLIC_HIDE_DEMO_RIBBON !== "1";

/** Optional WhatsApp deep link for concierge handoff after a demo reservation. */
export const DEMO_WHATSAPP_URL =
  process.env.NEXT_PUBLIC_DEMO_WHATSAPP_URL?.trim() || "https://wa.me/919000000000";
