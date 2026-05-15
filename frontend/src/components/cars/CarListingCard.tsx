"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SafeImage } from "@/components/media/SafeImage";
import type { ApiCar } from "@/lib/types/home";
import { resolveCarImageUrl } from "@/lib/image-utils";

type Props = {
  car: ApiCar;
  view: "grid" | "list";
  index?: number;
};

/** Reusable listing tile — optimized image + premium hover motion. */
export function CarListingCard({ car, view, index = 0 }: Props) {
  const price = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(car.price);

  if (view === "list") {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
        <Link href={`/cars/${car.slug}`} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-3 transition duration-300 hover:border-white/25">
          <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl">
            <SafeImage src={resolveCarImageUrl(car.thumbnail)} alt={`${car.brand} ${car.model}`} fill className="object-cover" sizes="128px" />
          </div>
          <motion.div>
            <p className="text-sm text-white">
              {car.brand} {car.model}
            </p>
            <p className="text-xs text-white/45">
              {car.year} · {car.mileage.toLocaleString()} km
            </p>
          </motion.div>
          <p className="ml-auto text-sm text-white/80">{price}</p>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04, duration: 0.5 }}>
      <Link href={`/cars/${car.slug}`} className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition duration-500 hover:-translate-y-1 hover:border-white/25">
        <motion.div className="relative aspect-[5/3] overflow-hidden">
          <SafeImage
            src={resolveCarImageUrl(car.thumbnail)}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
            sizes="(max-width:640px) 100vw, 400px"
          />
          <motion.div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
        </motion.div>
        <motion.div className="p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">{car.brand}</p>
          <p className="font-display text-lg text-white">
            {car.model} · {car.year}
          </p>
          <p className="mt-2 text-sm text-white/55">{price}</p>
          <p className="mt-1 text-xs text-white/40">
            {car.mileage.toLocaleString()} km · {car.fuel}
          </p>
        </motion.div>
      </Link>
    </motion.div>
  );
}
