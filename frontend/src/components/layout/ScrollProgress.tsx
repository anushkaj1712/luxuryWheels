"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Top scroll progress — light spring on desktop, direct on mobile. */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.12 });
  const scaleX = reduced ? scrollYProgress : smooth;

  if (reduced) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-white/5 via-white to-white/40 will-change-transform"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
