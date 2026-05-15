/** Shared homepage data shapes (safe for server + client imports). */

export type BlogPreview = { slug: string; title: string; excerpt?: string };

export type ApiCar = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  thumbnail: string | null;
};
