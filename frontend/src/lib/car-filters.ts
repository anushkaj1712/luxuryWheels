import type { ApiCar } from "@/lib/types/home";

/** Mirrors backend `GET /api/cars` query params for type-safe filtering. */
export type CarListFilters = {
  search: string;
  sort: "price_desc" | "price_asc" | "year_desc" | "mileage_asc";
  brand: string;
  fuel: string;
  transmission: string;
  bodyType: string;
  minPrice: string;
  maxPrice: string;
  year: string;
};

export const DEFAULT_CAR_FILTERS: CarListFilters = {
  search: "",
  sort: "price_desc",
  brand: "",
  fuel: "",
  transmission: "",
  bodyType: "",
  minPrice: "",
  maxPrice: "",
  year: "",
};

export const BRAND_OPTIONS = [
  "Lamborghini",
  "Rolls-Royce",
  "Porsche",
  "Bentley",
  "Ferrari",
  "McLaren",
  "Mercedes-Maybach",
];

export const BODY_TYPE_OPTIONS = ["Coupe", "Sedan", "SUV", "Convertible", "Grand Tourer"];

/** Demo-only body tags until schema adds `bodyType`. */
export const DEMO_BODY_BY_SLUG: Record<string, string> = {
  "lamborghini-huracan-sto-2023": "Coupe",
  "rolls-phantom-extended-2024": "Sedan",
  "porsche-911-turbo-s-2023": "Coupe",
  "bentley-continental-gt-2022": "Coupe",
  "ferrari-roma-2023": "Coupe",
  "mercedes-maybach-s680-2024": "Sedan",
};

export function filtersToSearchParams(filters: CarListFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (filters.search.trim()) p.set("search", filters.search.trim());
  if (filters.sort) p.set("sort", filters.sort);
  if (filters.brand) p.set("brand", filters.brand);
  if (filters.fuel) p.set("fuel", filters.fuel);
  if (filters.transmission) p.set("transmission", filters.transmission);
  if (filters.bodyType) p.set("bodyType", filters.bodyType);
  if (filters.minPrice) p.set("minPrice", filters.minPrice);
  if (filters.maxPrice) p.set("maxPrice", filters.maxPrice);
  if (filters.year) p.set("year", filters.year);
  return p;
}

export function searchParamsToFilters(sp: URLSearchParams): CarListFilters {
  return {
    search: sp.get("search") ?? "",
    sort: (sp.get("sort") as CarListFilters["sort"]) || "price_desc",
    brand: sp.get("brand") ?? "",
    fuel: sp.get("fuel") ?? "",
    transmission: sp.get("transmission") ?? "",
    bodyType: sp.get("bodyType") ?? "",
    minPrice: sp.get("minPrice") ?? "",
    maxPrice: sp.get("maxPrice") ?? "",
    year: sp.get("year") ?? "",
  };
}

export function filtersToApiParams(filters: CarListFilters, cursor?: string) {
  return {
    search: filters.search.trim() || undefined,
    sort: filters.sort,
    brand: filters.brand || undefined,
    fuel: filters.fuel || undefined,
    transmission: filters.transmission || undefined,
    bodyType: filters.bodyType || undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    year: filters.year ? Number(filters.year) : undefined,
    cursor,
    take: 12,
  };
}

function sortItems(items: ApiCar[], sort: CarListFilters["sort"]) {
  const list = [...items];
  switch (sort) {
    case "price_asc":
      return list.sort((a, b) => a.price - b.price);
    case "price_desc":
      return list.sort((a, b) => b.price - a.price);
    case "year_desc":
      return list.sort((a, b) => b.year - a.year);
    case "mileage_asc":
      return list.sort((a, b) => a.mileage - b.mileage);
    default:
      return list;
  }
}

/** Client-side filter for demo/offline dataset — mirrors backend rules. */
export function filterDemoCars(items: ApiCar[], filters: CarListFilters): ApiCar[] {
  const q = filters.search.trim().toLowerCase();
  const out = items.filter((car) => {
    if (filters.brand && car.brand.toLowerCase() !== filters.brand.toLowerCase()) return false;
    if (filters.fuel && car.fuel !== filters.fuel) return false;
    if (filters.transmission && car.transmission !== filters.transmission) return false;
    if (filters.year && car.year !== Number(filters.year)) return false;
    if (filters.minPrice && car.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && car.price > Number(filters.maxPrice)) return false;
    if (filters.bodyType && DEMO_BODY_BY_SLUG[car.slug] !== filters.bodyType) return false;
    if (!q) return true;
    const hay = `${car.brand} ${car.model} ${car.year} ${car.fuel}`.toLowerCase();
    return hay.includes(q);
  });
  return sortItems(out, filters.sort);
}
