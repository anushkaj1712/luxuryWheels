import type { MetadataRoute } from "next";
import { getPublicSiteUrl, getServerApiBaseUrl } from "@/lib/public-env";

const siteBase = () => getPublicSiteUrl();
const apiBase = () => getServerApiBaseUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/cars", "/about", "/services", "/blog", "/contact", "/login", "/signup", "/compare", "/configurator"].map((path) => ({
    url: `${siteBase()}${path}`,
    lastModified: new Date(),
  }));

  let cars: { slug: string }[] = [];
  try {
    const res = await fetch(`${apiBase()}/cars?take=100`, { next: { revalidate: 120 } });
    const json = await res.json();
    cars = (json.data?.items ?? []).map((c: { slug: string }) => ({ slug: c.slug }));
  } catch {
    cars = [];
  }

  return [...routes, ...cars.map((c) => ({ url: `${siteBase()}/cars/${c.slug}`, lastModified: new Date() }))];
}
