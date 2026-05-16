"use client";

import * as React from "react";
import Lenis from "lenis";
import { LenisContextProvider } from "./lenis-context";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useIsMobile } from "@/hooks/use-is-mobile";

/**
 * Lenis smooth scrolling — disabled on mobile / reduced-motion for native feel + perf.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const [lenis, setLenis] = React.useState<Lenis | null>(null);

  React.useEffect(() => {
    if (reduced || mobile) {
      setLenis(null);
      delete (window as Window & { __dlwLenis?: Lenis }).__dlwLenis;
      return;
    }

    const instance = new Lenis({
      duration: 0.95,
      smoothWheel: true,
      touchMultiplier: 1,
      lerp: 0.085,
    });

    setLenis(instance);
    (window as Window & { __dlwLenis?: Lenis }).__dlwLenis = instance;

    let raf = 0;
    const loop = (time: number) => {
      instance.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
      setLenis(null);
      delete (window as Window & { __dlwLenis?: Lenis }).__dlwLenis;
    };
  }, [reduced, mobile]);

  return <LenisContextProvider lenis={lenis}>{children}</LenisContextProvider>;
}
