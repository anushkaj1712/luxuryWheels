/**
 * Server-side fetch helper — tries the live Render API first, then returns a demo-shaped JSON body.
 * Keeps RSC pages resilient when `NEXT_PUBLIC_API_URL` is missing or the API is cold/down.
 */

import { getServerApiBaseUrl } from "@/lib/public-env";

export type ApiEnvelope<T> = { success?: boolean; data?: T; message?: string };

export async function fetchApiOrDemo<T>(
  path: string,
  init: RequestInit | undefined,
  buildDemo: () => ApiEnvelope<T>,
): Promise<ApiEnvelope<T>> {
  const base = getServerApiBaseUrl();
  if (!base) return buildDemo();
  try {
    const res = await fetch(`${base}${path}`, init);
    if (!res.ok) return buildDemo();
    return (await res.json()) as ApiEnvelope<T>;
  } catch {
    return buildDemo();
  }
}
