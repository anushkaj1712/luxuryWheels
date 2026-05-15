"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { DEMO_FEATURED_CARS } from "@/lib/demo-data/cars";
import { resolveCarImageUrl } from "@/lib/image-utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const SHOWCASE = [...DEMO_FEATURED_CARS, ...DEMO_FEATURED_CARS];

/** Cinematic hero vehicle runway — CSS + Framer (no WebGL) for premium motion at low cost. */
export function HeroCarShowcase() {
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const parallax = useTransform(mx, [-120, 120], [-12, 12]);

  if (reduced) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-70 md:opacity-90"
      aria-hidden
      onMouseMove={(e) => mx.set(e.clientX - window.innerWidth / 2)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_55%)]" />
      <motion.div style={{ x: parallax }} className="absolute inset-y-0 left-0 flex w-max items-center gap-10 py-24 animate-dlw-marquee">
        {SHOWCASE.map((car, i) => (
          <motion.div
            key={`${car.id}-${i}`}
            className="relative w-[min(72vw,420px)] shrink-0"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (i % DEMO_FEATURED_CARS.length) * 0.08, duration: 0.9 }}
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.85)]">
              <Image
                src={resolveCarImageUrl(car.thumbnail)}
                alt=""
                fill
                className="object-cover"
                sizes="420px"
                priority={i < 2}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/5" />
              <motion.div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.35)_50%,transparent_60%)] animate-dlw-shimmer" />
            </div>
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.35em] text-white/35">{car.brand}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
