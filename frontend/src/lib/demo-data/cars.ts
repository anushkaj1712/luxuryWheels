/**
 * Curated demo inventory — mirrors `CarService` list/detail JSON shape.
 * Used when the live API is unreachable (Vercel showcase / offline).
 */

import type { ApiCar, ListingCondition } from "@/lib/types/home";
import type { CarDetail } from "@/components/cars/CarDetailClient";
import { filterDemoCars, type CarListFilters } from "@/lib/car-filters";

type DemoCar = ApiCar & { listingCondition: ListingCondition; horsepower: number };

function car(
  partial: Omit<DemoCar, "listingCondition" | "horsepower"> & {
    listingCondition: ListingCondition;
    horsepower: number;
  },
): DemoCar {
  return partial;
}

export const DEMO_FEATURED_CARS: DemoCar[] = [
  car({
    id: "demo-1",
    slug: "lamborghini-huracan-sto-2023",
    brand: "Lamborghini",
    model: "Huracán STO",
    year: 2023,
    price: 48500000,
    mileage: 1200,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    listingCondition: "NEW",
    horsepower: 640,
    thumbnail: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=75",
  }),
  car({
    id: "demo-2",
    slug: "rolls-phantom-extended-2024",
    brand: "Rolls-Royce",
    model: "Phantom Extended",
    year: 2024,
    price: 92000000,
    mileage: 400,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    listingCondition: "NEW",
    horsepower: 563,
    thumbnail: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=75",
  }),
  car({
    id: "demo-3",
    slug: "porsche-911-turbo-s-2023",
    brand: "Porsche",
    model: "911 Turbo S",
    year: 2023,
    price: 24500000,
    mileage: 3100,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    listingCondition: "USED",
    horsepower: 650,
    thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=75",
  }),
  car({
    id: "demo-4",
    slug: "bentley-continental-gt-2022",
    brand: "Bentley",
    model: "Continental GT Speed",
    year: 2022,
    price: 31200000,
    mileage: 5200,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    listingCondition: "USED",
    horsepower: 659,
    thumbnail: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?auto=format&fit=crop&w=1200&q=75",
  }),
  car({
    id: "demo-5",
    slug: "ferrari-roma-2023",
    brand: "Ferrari",
    model: "Roma",
    year: 2023,
    price: 27800000,
    mileage: 2100,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    listingCondition: "USED",
    horsepower: 612,
    thumbnail: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=75",
  }),
  car({
    id: "demo-6",
    slug: "mercedes-maybach-s680-2024",
    brand: "Mercedes-Maybach",
    model: "S680",
    year: 2024,
    price: 36500000,
    mileage: 900,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    listingCondition: "NEW",
    horsepower: 621,
    thumbnail: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=75",
  }),
  car({
    id: "demo-7",
    slug: "ferrari-sf90-stradale-2024",
    brand: "Ferrari",
    model: "SF90 Stradale",
    year: 2024,
    price: 89000000,
    mileage: 150,
    fuel: "HYBRID",
    transmission: "AUTOMATIC",
    listingCondition: "NEW",
    horsepower: 986,
    thumbnail: "https://images.unsplash.com/photo-1592198784042-85c4e7b1f0b0?auto=format&fit=crop&w=1200&q=75",
  }),
  car({
    id: "demo-8",
    slug: "lamborghini-aventador-svj-2022",
    brand: "Lamborghini",
    model: "Aventador SVJ",
    year: 2022,
    price: 125000000,
    mileage: 2800,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    listingCondition: "USED",
    horsepower: 770,
    thumbnail: "https://images.unsplash.com/photo-1544829099-b9a0c530fd83?auto=format&fit=crop&w=1200&q=75",
  }),
  car({
    id: "demo-9",
    slug: "bmw-m8-competition-2023",
    brand: "BMW",
    model: "M8 Competition",
    year: 2023,
    price: 18500000,
    mileage: 4500,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    listingCondition: "USED",
    horsepower: 617,
    thumbnail: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=75",
  }),
  car({
    id: "demo-10",
    slug: "audi-r8-v10-performance-2022",
    brand: "Audi",
    model: "R8 V10 Performance",
    year: 2022,
    price: 22000000,
    mileage: 6100,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    listingCondition: "USED",
    horsepower: 602,
    thumbnail: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=75",
  }),
  car({
    id: "demo-11",
    slug: "rolls-ghost-black-badge-2023",
    brand: "Rolls-Royce",
    model: "Ghost Black Badge",
    year: 2023,
    price: 68000000,
    mileage: 1800,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    listingCondition: "USED",
    horsepower: 592,
    thumbnail: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=75",
  }),
  car({
    id: "demo-12",
    slug: "porsche-cayenne-turbo-gt-2024",
    brand: "Porsche",
    model: "Cayenne Turbo GT",
    year: 2024,
    price: 29800000,
    mileage: 800,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    listingCondition: "NEW",
    horsepower: 631,
    thumbnail: "https://images.unsplash.com/photo-1614162692292-7a1a0e7e8f4e?auto=format&fit=crop&w=1200&q=75",
  }),
  car({
    id: "demo-13",
    slug: "mclaren-720s-spider-2021",
    brand: "McLaren",
    model: "720S Spider",
    year: 2021,
    price: 42000000,
    mileage: 8900,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    listingCondition: "USED",
    horsepower: 710,
    thumbnail: "https://images.unsplash.com/photo-1621135802929-ef897b12a0a8?auto=format&fit=crop&w=1200&q=75",
  }),
  car({
    id: "demo-14",
    slug: "lamborghini-urus-performante-demo",
    brand: "Lamborghini",
    model: "Urus Performante",
    year: 2024,
    price: 52000000,
    mileage: 0,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    listingCondition: "DEMO",
    horsepower: 666,
    thumbnail: "https://images.unsplash.com/photo-1614162692292-7a1a0e7e8f4e?auto=format&fit=crop&w=1200&q=75",
  }),
  car({
    id: "demo-15",
    slug: "ferrari-296-gtb-demo",
    brand: "Ferrari",
    model: "296 GTB",
    year: 2024,
    price: 61000000,
    mileage: 0,
    fuel: "HYBRID",
    transmission: "AUTOMATIC",
    listingCondition: "DEMO",
    horsepower: 819,
    thumbnail: "https://images.unsplash.com/photo-1592198784042-85c4e7b1f0b0?auto=format&fit=crop&w=1200&q=75",
  }),
];

const HORSEPOWER_BY_ID = Object.fromEntries(DEMO_FEATURED_CARS.map((c) => [c.id, c.horsepower]));

/** Paginated list body — matches `GET /api/cars` `data` field (filters applied offline). */
export function getDemoCarsListPage(filters?: Partial<CarListFilters> & { ids?: string[] }) {
  if (filters?.ids?.length) {
    const items = filters.ids
      .map((id) => DEMO_FEATURED_CARS.find((c) => c.id === id))
      .filter((c): c is DemoCar => Boolean(c));
    return { items, nextCursor: undefined };
  }

  const merged: CarListFilters = {
    search: filters?.search ?? "",
    sort: filters?.sort ?? "price_desc",
    category: filters?.category ?? "ALL",
    brand: filters?.brand ?? "",
    fuel: filters?.fuel ?? "",
    transmission: filters?.transmission ?? "",
    bodyType: filters?.bodyType ?? "",
    minPrice: filters?.minPrice ?? "",
    maxPrice: filters?.maxPrice ?? "",
    year: filters?.year ?? "",
  };

  return { items: filterDemoCars(DEMO_FEATURED_CARS, merged), nextCursor: undefined };
}

function detailFromList(car: DemoCar): CarDetail {
  return {
    ...car,
    description:
      "Demonstrator listing — connect your Render API and Neon database to replace this copy with live inventory. Provenance, inspection, and concierge delivery workflows stay identical in production.",
    features: ["Ceramic brakes", "Bespoke interior", "Night vision", "Air suspension", "Signature audio", "Carbon ceramic"],
    horsepower: car.horsepower,
    torqueNm: Math.round(car.horsepower * 0.88),
    engine: car.horsepower > 700 ? "V12 / V8 Hybrid" : "V8 Twin-Turbo",
    images: car.thumbnail
      ? [{ id: `${car.id}-img`, url: car.thumbnail, alt: car.model, is360: false }]
      : [],
    similar: DEMO_FEATURED_CARS.filter((c) => c.id !== car.id && c.brand === car.brand)
      .slice(0, 2)
      .concat(DEMO_FEATURED_CARS.filter((c) => c.id !== car.id && c.brand !== car.brand).slice(0, 2)),
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

export function getDemoHorsepower(id: string): number | null {
  return HORSEPOWER_BY_ID[id] ?? null;
}
