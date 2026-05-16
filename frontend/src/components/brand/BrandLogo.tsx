"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Props = {
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  showWordmark?: boolean;
};

const sizes = {
  sm: { box: "h-11 w-11", img: 44, word: "text-sm" },
  md: { box: "h-[3.25rem] w-[3.25rem] md:h-[3.75rem] md:w-[3.75rem]", img: 60, word: "text-base md:text-lg" },
  lg: { box: "h-[4.25rem] w-[4.25rem]", img: 68, word: "text-lg" },
  hero: { box: "h-20 w-20 md:h-24 md:w-24", img: 96, word: "text-xl" },
};

/**
 * Official brand mark — sharp chrome frame, red glow, hover shine.
 */
export function BrandLogo({ href = "/", className, size = "md", showWordmark = false }: Props) {
  const reduced = useReducedMotion();
  const [src, setSrc] = React.useState("/logo.png");
  const s = sizes[size];

  const mark = (
    <motion.span
      className={cn("group/logo relative inline-flex shrink-0 items-center justify-center", s.box, className)}
      whileHover={reduced ? undefined : { scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      <span
        className="pointer-events-none absolute -inset-1.5 rounded-[11px] bg-dlw-red/35 blur-xl opacity-75 transition-opacity duration-500 group-hover/logo:opacity-100 animate-dlw-glow"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -inset-px rounded-[11px] bg-gradient-to-br from-dlw-silver/50 via-white/20 to-dlw-metal/30 opacity-80"
        aria-hidden
      />
      <span className="relative overflow-hidden rounded-[11px] ring-1 ring-dlw-silver/35 ring-offset-2 ring-offset-dlw-charcoal shadow-[0_8px_32px_-8px_rgba(0,0,0,0.65),0_0_24px_-6px_var(--dlw-red-glow)]">
        <Image
          src={src}
          alt="Drive Luxury Wheels"
          width={s.img}
          height={s.img}
          className={cn("rounded-[11px] object-cover bg-dlw-charcoal", s.box)}
          sizes={`${s.img}px`}
          priority={size === "hero" || size === "md"}
          onError={() => setSrc("/logo.svg")}
          unoptimized={src.endsWith(".svg")}
        />
        {!reduced ? (
          <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[11px] opacity-0 transition-opacity duration-500 group-hover/logo:opacity-100" aria-hidden>
            <span className="absolute inset-0 w-1/3 animate-dlw-shine bg-gradient-to-r from-transparent via-white/35 to-transparent" />
          </span>
        ) : null}
      </span>
    </motion.span>
  );

  const content = (
    <span className="group inline-flex items-center gap-3.5">
      {mark}
      {showWordmark ? (
        <span className={cn("hidden font-brand font-bold uppercase tracking-[0.12em] text-white sm:block", s.word)}>
          Drive <span className="text-dlw-red">Luxury</span> Wheels
        </span>
      ) : null}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="group inline-flex items-center gap-3.5" aria-label="Drive Luxury Wheels home">
      {content}
    </Link>
  );
}
