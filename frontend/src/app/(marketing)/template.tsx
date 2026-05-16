"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { pageEnter } from "@/animations/reveal";
import { scrollWindowToTop } from "@/components/providers/lenis-context";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Marketing route transitions — fast, premium, respects reduced motion. */
export default function MarketingTemplate({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  React.useEffect(() => {
    scrollWindowToTop("auto");
  }, []);

  if (reduced) return <>{children}</>;

  return (
    <motion.div variants={pageEnter} initial="hidden" animate="show">
      {children}
    </motion.div>
  );
}
