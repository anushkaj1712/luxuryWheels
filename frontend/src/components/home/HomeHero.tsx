"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandTagline } from "@/components/brand/BrandTagline";
import { fadeUp } from "@/animations/reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useIsMobile } from "@/hooks/use-is-mobile";

const HeroCarShowcase = dynamic(
  () => import("@/components/home/HeroCarShowcase").then((m) => m.HeroCarShowcase),
  { ssr: false, loading: () => null },
);

const HERO_POSTER =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=70";

/**
 * Cinematic hero — tagline with glass legibility layer, deferred car showcase for fast FCP.
 */
export function HomeHero() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const [query, setQuery] = React.useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/cars?search=${encodeURIComponent(q)}` : "/cars");
  };

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-dlw-hero">
      <Image
        src={HERO_POSTER}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-40"
        aria-hidden
      />

      <motion.div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-dlw-charcoal/50 via-black/80 to-dlw-black"
        aria-hidden
        animate={reduced ? undefined : { opacity: [0.88, 1, 0.88] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="pointer-events-none absolute inset-x-0 top-[22%] z-[2] h-[48%] bg-gradient-to-b from-black/85 via-black/65 to-black/20"
        aria-hidden
        animate={reduced ? undefined : { opacity: [0.92, 1, 0.92] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-[30%] z-[2] mx-auto h-40 max-w-3xl rounded-3xl bg-black/25 blur-3xl"
        aria-hidden
        animate={reduced ? undefined : { opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {!reduced && !mobile ? <HeroCarShowcase /> : null}

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 pb-24 pt-28 text-center md:px-8 md:pb-32 md:pt-36">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="max-w-4xl font-brand text-[clamp(2rem,5.5vw,4rem)] font-bold italic leading-[1.08] tracking-tight text-white drop-shadow-[0_4px_32px_rgba(0,0,0,0.85)]"
        >
          Velocity, <span className="text-dlw-red">distilled</span> into silence.
        </motion.h1>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="mt-8 w-full">
          <BrandTagline size="lg" variant="hero" />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Button variant="luxury" asChild>
            <Link href="/cars">
              Explore collection <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/contact">
              <Play className="h-4 w-4" />
              Private briefing
            </Link>
          </Button>
        </motion.div>

        <motion.form
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          onSubmit={onSearch}
          className="dlw-glass-strong mt-14 flex w-full max-w-xl flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center"
        >
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search marque, model, year…"
            className="border-white/10 bg-black/40"
            aria-label="Search luxury cars"
          />
          <Button className="shrink-0" variant="luxury" type="submit">
            Search
          </Button>
        </motion.form>
      </div>

      {!reduced ? (
        <motion.div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-dlw-red/60"
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          aria-hidden
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      ) : null}
    </section>
  );
}
