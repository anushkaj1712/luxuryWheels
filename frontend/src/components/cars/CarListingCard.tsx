"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GitCompare } from "lucide-react";
import { toast } from "sonner";
import { SafeImage } from "@/components/media/SafeImage";
import type { ApiCar } from "@/lib/types/home";
import { resolveCarImageUrl, FALLBACK_CAR } from "@/lib/image-utils";
import { useCompareStore } from "@/store/compare-store";
import { getDemoHorsepower } from "@/lib/demo-data/cars";
import { cn } from "@/lib/utils";

type Props = {
  car: ApiCar;
  view: "grid" | "list";
  index?: number;
};

/** Listing tile — glass card, compare control, premium hover. */
export function CarListingCard({ car, view, index = 0 }: Props) {
  const price = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(car.price);
  const add = useCompareStore((s) => s.add);
  const remove = useCompareStore((s) => s.remove);
  const has = useCompareStore((s) => s.has);
  const inCompare = has(car.id);

  const onCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      remove(car.id);
      toast.message("Removed from compare");
      return;
    }
    add({
      id: car.id,
      slug: car.slug,
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      fuel: car.fuel,
      transmission: car.transmission,
      thumbnail: car.thumbnail,
      horsepower: car.horsepower ?? getDemoHorsepower(car.id),
      features: [],
    });
    toast.success("Added to compare");
  };

  const conditionBadge =
    car.listingCondition === "NEW" ? (
      <span className="rounded-full border border-dlw-red/40 bg-dlw-red/15 px-2 py-0.5 text-[9px] uppercase tracking-widest text-dlw-red">New</span>
    ) : car.listingCondition === "DEMO" ? (
      <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[9px] uppercase tracking-widest text-white/70">Demo</span>
    ) : null;

  if (view === "list") {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
        <Link href={`/cars/${car.slug}`} className="dlw-glass group flex items-center gap-4 p-3 transition duration-300 hover:border-dlw-red/30 hover:shadow-dlw-red">
          <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl">
            <SafeImage src={resolveCarImageUrl(car.thumbnail)} alt={`${car.brand} ${car.model}`} fill className="object-cover" sizes="128px" fallbackSrc={FALLBACK_CAR} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">{conditionBadge}</div>
            <p className="text-sm text-white">
              {car.brand} {car.model}
            </p>
            <p className="text-xs text-white/45">
              {car.year} · {car.mileage.toLocaleString()} km
            </p>
          </div>
          <p className="text-sm text-white/80">{price}</p>
          <button type="button" onClick={onCompare} className={cn("rounded-full border p-2", inCompare ? "border-dlw-red text-dlw-red" : "border-white/15 text-white/50")} aria-label="Compare">
            <GitCompare className="h-4 w-4" />
          </button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.04, 0.24), duration: 0.45 }}>
      <Link href={`/cars/${car.slug}`} className="dlw-card group relative block overflow-hidden transition duration-500 hover:-translate-y-1 hover:border-dlw-red/35 hover:shadow-dlw-red">
        <button
          type="button"
          onClick={onCompare}
          className={cn(
            "absolute right-3 top-3 z-10 rounded-full border p-2 backdrop-blur-md transition",
            inCompare ? "border-dlw-red bg-dlw-red/20 text-white" : "border-white/15 bg-black/50 text-white/60 hover:text-white",
          )}
          aria-label={inCompare ? "Remove from compare" : "Add to compare"}
        >
          <GitCompare className="h-4 w-4" />
        </button>
        <div className="relative aspect-[5/3] overflow-hidden">
          <SafeImage
            src={resolveCarImageUrl(car.thumbnail)}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
            sizes="(max-width:640px) 100vw, 400px"
            fallbackSrc={FALLBACK_CAR}
          />
          <motion.div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-white/5" />
          <span className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
            <span className="absolute inset-0 w-1/3 -translate-x-full animate-dlw-shine bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </span>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">{car.brand}</p>
            {conditionBadge}
          </div>
          <p className="font-display text-lg text-white">
            {car.model} · {car.year}
          </p>
          <p className="mt-2 text-sm text-white/55">{price}</p>
          <p className="mt-1 text-xs text-white/40">
            {car.mileage.toLocaleString()} km · {car.fuel}
            {car.horsepower ? ` · ${car.horsepower} hp` : ""}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
