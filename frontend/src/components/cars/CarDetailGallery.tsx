"use client";

import * as React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { motion, useScroll, useTransform } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { SafeImage } from "@/components/media/SafeImage";
import { resolveCarImageUrl, FALLBACK_CAR } from "@/lib/image-utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Img = { id: string; url: string; alt?: string | null; is360: boolean };

type Props = {
  images: Img[];
  title: string;
};

/**
 * Cinematic detail gallery — entrance motion, light sweep, subtle float (GPU-friendly).
 */
export function CarDetailGallery({ images, title }: Props) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -24]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, reduced ? 1 : 1.02]);

  return (
    <motion.div
      ref={ref}
      style={{ y, scale }}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* Spotlight + wheel accent (decorative) */}
      <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,0,0,0.12),transparent_60%)]" aria-hidden />
      {!reduced ? (
        <motion.div
          className="pointer-events-none absolute -right-6 top-1/2 z-0 h-24 w-24 rounded-full border border-white/10 opacity-30"
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          aria-hidden
        >
          <motion.div className="absolute inset-2 rounded-full border border-dashed border-dlw-red/40" />
        </motion.div>
      ) : null}

      <motion.div
        animate={reduced ? undefined : { y: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 overflow-hidden rounded-3xl border border-white/15 shadow-dlw-glass"
      >
        <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} className="overflow-hidden">
          {images.map((img, i) => (
            <SwiperSlide key={img.id}>
              <div className="relative aspect-[16/10] bg-dlw-metal">
                <SafeImage
                  src={resolveCarImageUrl(img.url)}
                  alt={img.alt ?? title}
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 60vw"
                  priority={i === 0}
                  fallbackSrc={FALLBACK_CAR}
                />
                {!reduced ? (
                  <motion.div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                    animate={{ x: ["-100%", "120%"] }}
                    transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                  />
                ) : null}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </motion.div>
  );
}
