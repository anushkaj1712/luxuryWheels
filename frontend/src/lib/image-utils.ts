const FALLBACK_CAR =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80";

/** Normalizes listing media URLs for next/image (http absolute or Cloudinary). */
export function resolveCarImageUrl(url?: string | null): string {
  if (!url) return FALLBACK_CAR;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ?? "";
  if (base) return `${base}${url.startsWith("/") ? url : `/${url}`}`;
  return FALLBACK_CAR;
}

export { FALLBACK_CAR };
