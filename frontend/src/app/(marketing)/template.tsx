"use client";

import { motion } from "framer-motion";
import { pageEnter } from "@/animations/reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Marketing route transitions — fast, premium, respects reduced motion. */
export default function MarketingTemplate({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div variants={pageEnter} initial="hidden" animate="show">
      {children}
    </motion.div>
  );
}
