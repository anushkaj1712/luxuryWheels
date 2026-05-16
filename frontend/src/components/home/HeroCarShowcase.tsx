"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { DEMO_FEATURED_CARS } from "@/lib/demo-data/cars";
import { resolveCarImageUrl } from "@/lib/image-utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Cinematic hero runway — limited nodes for performance (no WebGL). */
const SHOWCASE = DEMO_FEATURED_CARS.slice(0, 5);

export function HeroCarShowcase() {
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const parallax = useTransform(mx, [-120, 120], [-8, 8]);

  if (reduced) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-60 md:opacity-80"
      aria-hidden
      onMouseMove={(e) => mx.set(e.clientX - window.innerWidth / 2)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,0,0.08),transparent_55%)]" />
      <motion.div style={{ x: parallax }} className="absolute inset-y-0 left-0 flex w-max items-center gap-8 py-28 md:gap-12 animate-dlw-marquee">
        {[...SHOWCASE, ...SHOWCASE].map((car, i) => (
          <div key={`${car.id}-${i}`} className="relative w-[min(65vw,380px)] shrink-0">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/15 shadow-dlw-glass">
              <Image
                src={resolveCarImageUrl(car.thumbnail)}
                alt=""
                fill
                className="object-cover"
                sizes="380px"
                priority={i < 2}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-white/10" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-dlw-red to-transparent opacity-80" />
            </div>
            <p className="mt-2 text-center text-[10px] uppercase tracking-[0.35em] text-white/35">{car.brand}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
