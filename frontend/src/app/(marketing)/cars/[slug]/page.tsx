import { Suspense } from "react";
import { notFound } from "next/navigation";
import CarDetailClient, { type CarDetail } from "@/components/cars/CarDetailClient";
import { getDemoCarDetailBySlug } from "@/lib/demo-data/cars";
import { fetchApiOrDemo } from "@/lib/server-fetch";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const json = await fetchApiOrDemo<CarDetail>(
    `/cars/${slug}`,
    { next: { revalidate: 60 } },
    () => ({ data: getDemoCarDetailBySlug(slug) ?? undefined }),
  );
  const c = json.data;
  if (!c) return { title: "Vehicle" };
  return {
    title: `${c.brand} ${c.model}`,
    description: c.description?.slice(0, 160),
    openGraph: { images: c.images?.[0]?.url ? [c.images[0].url] : [] },
  };
}

export default async function CarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const json = await fetchApiOrDemo<CarDetail>(
    `/cars/${slug}`,
    { next: { revalidate: 30 } },
    () => ({ data: getDemoCarDetailBySlug(slug) ?? undefined }),
  );
  const car = json.data;
  if (!car) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${car.brand} ${car.model}`,
    description: car.description,
    image: car.images?.map((i) => i.url),
    brand: { "@type": "Brand", name: car.brand },
    offers: { "@type": "Offer", priceCurrency: "INR", price: car.price, availability: "https://schema.org/InStock" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Suspense fallback={<div className="mx-auto max-w-6xl animate-pulse px-4 py-24 text-white/40">Loading…</div>}>
        <CarDetailClient initial={car} />
      </Suspense>
    </>
  );
}
