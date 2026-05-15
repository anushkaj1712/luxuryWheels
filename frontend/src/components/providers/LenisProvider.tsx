"use client";

import * as React from "react";
import Lenis from "lenis";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useIsMobile } from "@/hooks/use-is-mobile";

/**
 * Lenis smooth scrolling — disabled on mobile / reduced-motion for native feel + perf.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

  React.useEffect(() => {
    if (reduced || mobile) return;

    const lenis = new Lenis({
      duration: 0.95,
      smoothWheel: true,
      touchMultiplier: 1,
      lerp: 0.085,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduced, mobile]);

  return <>{children}</>;
}
