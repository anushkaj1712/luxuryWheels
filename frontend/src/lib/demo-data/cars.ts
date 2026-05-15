/**
 * Curated demo inventory — mirrors `CarService` list/detail JSON shape.
 * Used only when the live API is unreachable (Vercel showcase / offline).
 */

import type { ApiCar } from "@/lib/types/home";
import type { CarDetail } from "@/components/cars/CarDetailClient";

export const DEMO_FEATURED_CARS: ApiCar[] = [
  {
    id: "demo-1",
    slug: "lamborghini-huracan-sto-2023",
    brand: "Lamborghini",
    model: "Huracán STO",
    year: 2023,
    price: 485000,
    mileage: 1200,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    thumbnail: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "demo-2",
    slug: "rolls-phantom-extended-2024",
    brand: "Rolls-Royce",
    model: "Phantom Extended",
    year: 2024,
    price: 920000,
    mileage: 400,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    thumbnail: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "demo-3",
    slug: "porsche-911-turbo-s-2023",
    brand: "Porsche",
    model: "911 Turbo S",
    year: 2023,
    price: 245000,
    mileage: 3100,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "demo-4",
    slug: "bentley-continental-gt-2022",
    brand: "Bentley",
    model: "Continental GT Speed",
    year: 2022,
    price: 312000,
    mileage: 5200,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    thumbnail: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "demo-5",
    slug: "ferrari-roma-2023",
    brand: "Ferrari",
    model: "Roma",
    year: 2023,
    price: 278000,
    mileage: 2100,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    thumbnail: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "demo-6",
    slug: "mercedes-maybach-s680-2024",
    brand: "Mercedes-Maybach",
    model: "S680",
    year: 2024,
    price: 365000,
    mileage: 900,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    thumbnail: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
  },
];

/** Paginated list body — matches `GET /api/cars` `data` field. */
export function getDemoCarsListPage(): { items: ApiCar[]; nextCursor?: string } {
  return { items: DEMO_FEATURED_CARS, nextCursor: undefined };
}

function detailFromList(car: ApiCar): CarDetail {
  return {
    ...car,
    description:
      "Demonstrator listing — connect your Render API and Neon database to replace this copy with live inventory. Provenance, inspection, and concierge delivery workflows stay identical in production.",
    features: ["Ceramic brakes", "Bespoke interior", "Night vision", "Air suspension", "Signature audio"],
    images: car.thumbnail
      ? [{ id: `${car.id}-img`, url: car.thumbnail, alt: car.model, is360: false }]
      : [],
    similar: DEMO_FEATURED_CARS.filter((c) => c.id !== car.id).slice(0, 3),
    ratingAvg: 4.9,
    locationCity: "New Delhi · By appointment",
    locationLat: 28.6139,
    locationLng: 77.209,
  };
}

const DETAIL_BY_SLUG: Record<string, CarDetail> = Object.fromEntries(
  DEMO_FEATURED_CARS.map((c) => [c.slug, detailFromList(c)]),
);

export function getDemoCarDetailBySlug(slug: string): CarDetail | null {
  return DETAIL_BY_SLUG[slug] ?? null;
}
