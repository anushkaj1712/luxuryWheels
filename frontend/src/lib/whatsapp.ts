/** Build WhatsApp deep link with prefilled copy (handles URLs that already include query params). */
export function buildWhatsAppHref(base: string, text: string): string {
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}text=${encodeURIComponent(text)}`;
}
