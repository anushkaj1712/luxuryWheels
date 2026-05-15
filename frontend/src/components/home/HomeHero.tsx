"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ArrowRight, ChevronDown, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fadeUp, heroTitle } from "@/animations/reveal";
import { SITE_TAGLINE } from "@/constants/site";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { Skeleton } from "@/components/ui/skeleton";

const HeroGraphic = dynamic(
  () => import("@/components/three/HeroGraphic").then((m) => m.HeroGraphic),
  {
    ssr: false,
    loading: () => <Skeleton className="absolute inset-0 rounded-none opacity-0" aria-hidden />,
  },
);

const HERO_POSTER =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=75";
const HERO_VIDEO =
  "https://assets.mixkit.co/videos/preview/mixkit-sports-car-racing-in-a-highway-at-night-39873-large.mp4";

/**
 * Cinematic hero — GSAP title reveal + deferred video/WebGL for faster FCP.
 */
export function HomeHero() {
  const heroLine = React.useRef<HTMLHeadingElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const [videoReady, setVideoReady] = React.useState(false);

  React.useLayoutEffect(() => {
    if (reduced || !heroLine.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroLine.current,
        { opacity: 0, y: 44 },
        { opacity: 1, y: 0, duration: 1.15, ease: "power3.out" },
      );
    });
    return () => ctx.revert();
  }, [reduced]);

  React.useEffect(() => {
    if (reduced || mobile) return;
    const el = videoRef.current;
    if (!el) return;

    const play = () => {
      el.play().catch(() => undefined);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        if (el.readyState >= 2) play();
        else el.addEventListener("loadeddata", play, { once: true });
        observer.disconnect();
      },
      { rootMargin: "0px", threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced, mobile]);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <Image
        src={HERO_POSTER}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        aria-hidden
      />

      {!reduced && !mobile ? (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${videoReady ? "opacity-55" : "opacity-0"}`}
          muted
          loop
          playsInline
          preload="none"
          poster={HERO_POSTER}
          onLoadedData={() => setVideoReady(true)}
          aria-hidden
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/70 to-black" aria-hidden />

      {!reduced && !mobile ? <HeroGraphic /> : null}

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col justify-end px-4 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="text-xs uppercase tracking-[0.45em] text-white/50"
        >
          Atelier digital
        </motion.p>
        {reduced ? (
          <motion.h1
            variants={heroTitle}
            initial="hidden"
            animate="show"
            className="mt-4 max-w-4xl font-display text-[clamp(2.4rem,6vw,4.6rem)] font-semibold leading-[1.05] tracking-tight text-white"
          >
            Velocity, distilled into silence.
          </motion.h1>
        ) : (
          <h1
            ref={heroLine}
            className="mt-4 max-w-4xl font-display text-[clamp(2.4rem,6vw,4.6rem)] font-semibold leading-[1.05] tracking-tight text-white"
          >
            Velocity, distilled into silence.
          </h1>
        )}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="mt-6 max-w-xl text-sm leading-relaxed text-white/60 md:text-base"
        >
          {SITE_TAGLINE}
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Button asChild>
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
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-16 flex max-w-xl flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl md:flex-row md:items-center"
        >
          <Input placeholder="Search marque, model, VIN…" className="border-white/10 bg-black/40" aria-label="Search luxury cars" />
          <Button className="shrink-0" asChild>
            <Link href="/cars">Search</Link>
          </Button>
        </motion.div>
      </div>

      {!reduced ? (
        <motion.div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/40"
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

