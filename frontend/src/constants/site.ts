/**
 * Brand + public API base for browser requests.
 * `NEXT_PUBLIC_API_URL` must be set on Vercel (Render API URL including `/api`).
 */
import { getBrowserApiBaseUrl } from "@/lib/public-env";

export const SITE_NAME = "Drive Luxury Wheels";
export const SITE_TAGLINE = "Curated velocity. Bespoke ownership.";
export const API_URL = getBrowserApiBaseUrl();
