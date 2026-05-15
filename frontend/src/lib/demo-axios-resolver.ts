/**
 * Maps failed Axios requests to synthetic success payloads that mirror the real Express API.
 * Keeps the same `{ success, data }` envelope so UI code stays unchanged when you wire production keys.
 */

import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { DEMO_ADMIN_ANALYTICS } from "@/lib/demo-data/admin";
import { DEMO_BLOG_LIST, getDemoBlogPost } from "@/lib/demo-data/blogs";
import { buildDemoBookingCreateResponse, DEMO_BOOKINGS_ME } from "@/lib/demo-data/bookings";
import { DEMO_FEATURED_CARS, getDemoCarDetailBySlug, getDemoCarsListPage } from "@/lib/demo-data/cars";
import type { CarListFilters } from "@/lib/car-filters";

function pathOnly(config: InternalAxiosRequestConfig): string {
  let p = config.url ?? "";
  const q = p.indexOf("?");
  if (q >= 0) p = p.slice(0, q);
  if (!p.startsWith("/")) p = `/${p}`;
  return p;
}

function parseJsonBody(config: InternalAxiosRequestConfig): Record<string, unknown> {
  const raw = config.data;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw as Record<string, unknown>;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return {};
}

/**
 * Auth / validation failures must surface to the user — never mask as demo success.
 */
export function shouldAttemptDemoFallback(error: AxiosError): boolean {
  const status = error.response?.status;
  if (status === 400 || status === 401 || status === 403 || status === 422) return false;
  return true;
}

function ok<T>(config: InternalAxiosRequestConfig, data: T, status = 200): AxiosResponse<{ success: boolean; data: T }> {
  return {
    data: { success: true, data },
    status,
    statusText: "OK",
    headers: {},
    config,
  };
}

export function buildDemoAxiosResponse(
  config: InternalAxiosRequestConfig,
  error: AxiosError,
): AxiosResponse | null {
  if (!shouldAttemptDemoFallback(error)) return null;

  const method = (config.method ?? "get").toUpperCase();
  const p = pathOnly(config);

  if (method === "GET" && p === "/cars/featured") {
    return ok(config, DEMO_FEATURED_CARS);
  }

  if (method === "GET" && p === "/cars") {
    const params = config.params as Record<string, string | number | undefined> | undefined;
    const idsRaw = params?.ids;
    return ok(
      config,
      getDemoCarsListPage({
        search: params?.search != null ? String(params.search) : "",
        sort: (params?.sort as CarListFilters["sort"]) ?? "price_desc",
        brand: params?.brand != null ? String(params.brand) : "",
        fuel: params?.fuel != null ? String(params.fuel) : "",
        transmission: params?.transmission != null ? String(params.transmission) : "",
        bodyType: params?.bodyType != null ? String(params.bodyType) : "",
        minPrice: params?.minPrice != null ? String(params.minPrice) : "",
        maxPrice: params?.maxPrice != null ? String(params.maxPrice) : "",
        year: params?.year != null ? String(params.year) : "",
        ids: idsRaw ? String(idsRaw).split(",").filter(Boolean) : undefined,
      }),
    );
  }

  if (method === "GET" && p.startsWith("/cars/")) {
    const slug = p.slice("/cars/".length);
    if (!slug || slug.includes("/")) return null;
    const detail = getDemoCarDetailBySlug(slug);
    if (!detail) return null;
    return ok(config, detail);
  }

  if (method === "GET" && p === "/blogs") {
    return ok(config, DEMO_BLOG_LIST);
  }

  if (method === "GET" && p.startsWith("/blogs/")) {
    const slug = p.slice("/blogs/".length);
    const post = getDemoBlogPost(slug);
    if (!post) return null;
    return ok(config, post);
  }

  if (method === "GET" && p === "/admin/analytics") {
    return ok(config, DEMO_ADMIN_ANALYTICS);
  }

  if (method === "GET" && p === "/bookings/me") {
    return ok(config, DEMO_BOOKINGS_ME);
  }

  if (method === "POST" && p === "/auth/login") {
    const b = parseJsonBody(config);
    const email = String(b.email ?? "collector@demo.dlw");
    const local = email.split("@")[0] ?? "Collector";
    return ok(config, {
      token: "demo-jwt-token",
      user: { id: "demo-user", email, name: local.replace(/[._]/g, " "), role: "ADMIN" },
    });
  }

  if (method === "POST" && p === "/auth/register") {
    const b = parseJsonBody(config);
    const email = String(b.email ?? "collector@demo.dlw");
    const name = String(b.name ?? "New collector");
    return ok(config, {
      token: "demo-jwt-token",
      user: { id: "demo-user", email, name, role: "USER" },
    });
  }

  if (method === "POST" && p === "/bookings") {
    return ok(config, buildDemoBookingCreateResponse());
  }

  if (method === "POST" && p === "/bookings/demo-confirm") {
    return ok(config, {} as Record<string, never>);
  }

  if (method === "POST" && (p === "/wishlist" || p === "/contact")) {
    return ok(config, {} as Record<string, never>);
  }

  return null;
}
