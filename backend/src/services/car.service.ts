/**
 * CarService — listing, filters, detail by slug, featured cars for homepage.
 * Uses Prisma for efficient indexed queries; supports cursor pagination.
 */

import type { FuelType, Prisma, TransmissionType } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

export type CarFilters = {
  search?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  year?: number;
  fuel?: string;
  transmission?: string;
  bodyType?: string;
  ids?: string[];
  sort?: "price_asc" | "price_desc" | "year_desc" | "mileage_asc";
  cursor?: string;
  take?: number;
};

export class CarService {
  async list(filters: CarFilters) {
    const take = Math.min(filters.take ?? 12, 48);
    const where: Prisma.CarWhereInput = { isAvailable: true };

    if (filters.ids?.length) {
      const cars = await prisma.car.findMany({
        where: { id: { in: filters.ids }, isAvailable: true },
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      });
      const ordered = filters.ids.map((id) => cars.find((c) => c.id === id)).filter(Boolean) as typeof cars;
      return { items: ordered.map(serializeCarListItem), nextCursor: undefined };
    }

    if (filters.brand) where.brand = { equals: filters.brand, mode: "insensitive" };
    if (filters.year) where.year = filters.year;
    if (filters.minPrice != null || filters.maxPrice != null) {
      where.price = {};
      if (filters.minPrice != null) where.price.gte = filters.minPrice;
      if (filters.maxPrice != null) where.price.lte = filters.maxPrice;
    }
    if (filters.fuel) where.fuel = filters.fuel as FuelType;
    if (filters.transmission) where.transmission = filters.transmission as TransmissionType;
    if (filters.bodyType) where.features = { has: filters.bodyType };
    if (filters.search) {
      where.OR = [
        { brand: { contains: filters.search, mode: "insensitive" } },
        { model: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    let orderBy: Prisma.CarOrderByWithRelationInput = { createdAt: "desc" };
    if (filters.sort === "price_asc") orderBy = { price: "asc" };
    if (filters.sort === "price_desc") orderBy = { price: "desc" };
    if (filters.sort === "year_desc") orderBy = { year: "desc" };
    if (filters.sort === "mileage_asc") orderBy = { mileage: "asc" };

    const cars = await prisma.car.findMany({
      where,
      take: take + 1,
      skip: filters.cursor ? 1 : 0,
      cursor: filters.cursor ? { id: filters.cursor } : undefined,
      orderBy,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
    });

    let nextCursor: string | undefined;
    if (cars.length > take) {
      const next = cars.pop();
      nextCursor = next?.id;
    }

    return { items: cars.map(serializeCarListItem), nextCursor };
  }

  async featured(limit = 8) {
    const cars = await prisma.car.findMany({
      where: { isFeatured: true, isAvailable: true },
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    });
    return cars.map(serializeCarListItem);
  }

  async bySlug(slug: string) {
    const car = await prisma.car.findFirst({
      where: { slug, isAvailable: true },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        reviews: { take: 10, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, avatarUrl: true } } } },
      },
    });
    if (!car) throw new AppError(404, "Car not found");
    return serializeCarDetail(car);
  }

  async similar(carId: string, brand: string, limit = 4) {
    const cars = await prisma.car.findMany({
      where: { brand, isAvailable: true, NOT: { id: carId } },
      take: limit,
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    });
    return cars.map(serializeCarListItem);
  }
}

function serializeCarListItem(car: {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price: unknown;
  mileage: number;
  fuel: string;
  transmission: string;
  images: { url: string }[];
}) {
  return {
    id: car.id,
    slug: car.slug,
    brand: car.brand,
    model: car.model,
    year: car.year,
    price: Number(car.price),
    mileage: car.mileage,
    fuel: car.fuel,
    transmission: car.transmission,
    thumbnail: car.images[0]?.url ?? null,
  };
}

function serializeCarDetail(car: any) {
  const avg =
    car.reviews?.length > 0
      ? car.reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / car.reviews.length
      : null;
  return {
    ...serializeCarListItem(car),
    description: car.description,
    features: car.features,
    horsepower: car.horsepower,
    torqueNm: car.torqueNm,
    engine: car.engine,
    color: car.color,
    locationCity: car.locationCity,
    locationLat: car.locationLat,
    locationLng: car.locationLng,
    brochureUrl: car.brochureUrl,
    videoUrl: car.videoUrl,
    model3dUrl: car.model3dUrl,
    images: car.images?.map((i: { id: string; url: string; alt: string | null; is360: boolean }) => ({
      id: i.id,
      url: i.url,
      alt: i.alt,
      is360: i.is360,
    })),
    reviews: car.reviews,
    ratingAvg: avg,
  };
}
