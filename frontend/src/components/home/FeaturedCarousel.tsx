"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/animations/reveal";
import type { ApiCar } from "@/lib/types/home";
import { Skeleton } from "@/components/ui/skeleton";

const SwiperCarousel = dynamic(() => import("./FeaturedSwiper").then((m) => m.FeaturedSwiper), {
  ssr: false,
  loading: () => <FeaturedCarouselSkeleton />,
});

type Props = { cars: ApiCar[] };

export function FeaturedCarousel({ cars }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 md:px-8">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-15%" }}
        className="mb-12"
      >
        <motion.p variants={fadeUp} custom={0} className="text-xs uppercase tracking-[0.4em] text-white/40">
          Signature inventory
        </motion.p>
        <motion.h2 variants={fadeUp} custom={1} className="mt-3 font-display text-3xl text-white md:text-4xl">
          Featured arrivals
        </motion.h2>
      </motion.div>
      <SwiperCarousel cars={cars} />
    </section>
  );
}

export function FeaturedCarouselSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="aspect-[16/10] w-full rounded-2xl" />
      ))}
    </div>
  );
}

