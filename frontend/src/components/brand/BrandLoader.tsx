"use client";

import { motion } from "framer-motion";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { BrandTagline } from "@/components/brand/BrandTagline";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Full-screen luxury loader — logo pulse + tagline reveal. */
export function BrandLoader() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-8 px-4 py-20"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        animate={reduced ? undefined : { scale: [1, 1.03, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <BrandLogo href={undefined} size="lg" />
      </motion.div>
      <BrandTagline size="md" />
      <div className="dlw-divider max-w-xs" />
      <motion.div
        className="h-0.5 w-32 overflow-hidden rounded-full bg-white/10"
        aria-hidden
      >
        {!reduced ? (
          <motion.div
            className="h-full bg-gradient-to-r from-dlw-red via-white to-dlw-red"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}
      </motion.div>
    </motion.div>
  );
}
