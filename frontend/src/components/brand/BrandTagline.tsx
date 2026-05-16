"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SITE_TAGLINE_PARTS } from "@/constants/site";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Props = {
  className?: string;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center";
  variant?: "default" | "hero";
};

const sizeClass = {
  sm: "text-[10px] tracking-[0.35em]",
  md: "text-xs tracking-[0.42em] md:text-sm",
  lg: "text-sm tracking-[0.45em] md:text-base",
};

/**
 * Animated brand tagline — LUXURY | LEGACY | LIFESTYLE
 * Hero variant adds glass panel + cinematic glow for readability over motion backgrounds.
 */
export function BrandTagline({ className, size = "md", align = "center", variant = "default" }: Props) {
  const reduced = useReducedMotion();
  const isHero = variant === "hero";

  const words = reduced ? (
    <p
      className={cn(
        "uppercase text-white/90",
        sizeClass[size],
        align === "center" && "text-center",
        isHero && "font-medium tracking-[0.5em] text-white",
        className,
      )}
    >
      {SITE_TAGLINE_PARTS.join(" | ")}
    </p>
  ) : (
    <motion.p
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 uppercase",
        isHero ? "text-white" : "text-white/85",
        sizeClass[size],
        align === "center" && "justify-center",
        className,
      )}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } } }}
      aria-label="LUXURY LEGACY LIFESTYLE"
    >
      {SITE_TAGLINE_PARTS.map((word, i) => (
        <span key={word} className="inline-flex items-center gap-2">
          {i > 0 ? (
            <motion.span
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
              className="text-dlw-red drop-shadow-[0_0_10px_var(--dlw-red-glow)]"
              aria-hidden
            >
              |
            </motion.span>
          ) : null}
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
              show: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className={cn(
              isHero && "animate-dlw-tagline-glow font-semibold tracking-[0.48em]",
              !isHero && "text-shadow-glow",
            )}
            style={
              isHero
                ? {
                    textShadow:
                      "0 0 40px rgba(255,255,255,0.45), 0 0 16px rgba(255,0,0,0.35), 0 2px 28px rgba(0,0,0,0.95)",
                  }
                : { textShadow: "0 0 24px rgba(255,255,255,0.15)" }
            }
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.p>
  );

  if (!isHero) return words;

  return (
    <div
      className={cn(
        "relative mx-auto max-w-3xl rounded-2xl border border-white/15 px-6 py-5 md:px-10 md:py-7",
        "bg-black/70 shadow-[0_32px_100px_-28px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl",
        align === "center" && "text-center",
        className,
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.1] via-white/[0.03] to-transparent"
        aria-hidden
        animate={reduced ? undefined : { opacity: [0.45, 0.9, 0.45] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-dlw-red/30"
        aria-hidden
        animate={reduced ? undefined : { boxShadow: ["0 0 0 rgba(255,0,0,0)", "0 0 28px -8px var(--dlw-red-glow)", "0 0 0 rgba(255,0,0,0)"] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative">{words}</div>
    </div>
  );
}
