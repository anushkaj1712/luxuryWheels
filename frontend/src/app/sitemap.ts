import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/public-env";
import { getDemoCarsListPage } from "@/lib/demo-data/cars";
import { fetchApiOrDemo } from "@/lib/server-fetch";

const siteBase = () => getPublicSiteUrl();

type CarsListEnvelope = { items: { slug: string }[] };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/cars", "/about", "/services", "/blog", "/contact", "/login", "/signup", "/compare", "/configurator"].map((path) => ({
    url: `${siteBase()}${path}`,
    lastModified: new Date(),
  }));

  const json = await fetchApiOrDemo<CarsListEnvelope>(
    "/cars?take=100",
    { next: { revalidate: 120 } },
    () => ({ data: getDemoCarsListPage() }),
  );
  const cars = (json.data?.items ?? []).map((c) => ({ slug: c.slug }));

  return [...routes, ...cars.map((c) => ({ url: `${siteBase()}/cars/${c.slug}`, lastModified: new Date() }))];
}
