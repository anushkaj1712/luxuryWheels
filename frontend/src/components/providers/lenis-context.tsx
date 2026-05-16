"use client";

import * as React from "react";
import type Lenis from "lenis";

const LenisContext = React.createContext<Lenis | null>(null);

export function LenisContextProvider({ lenis, children }: { lenis: Lenis | null; children: React.ReactNode }) {
  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export function useLenisInstance() {
  return React.useContext(LenisContext);
}

/** Scroll to top — uses Lenis when active, otherwise native window scroll. */
export function scrollWindowToTop(behavior: ScrollBehavior = "auto") {
  if (typeof window === "undefined") return;

  const lenis = (window as Window & { __dlwLenis?: Lenis }).__dlwLenis;
  if (lenis) {
    lenis.scrollTo(0, { immediate: behavior === "auto" });
    return;
  }

  window.scrollTo({ top: 0, left: 0, behavior });
}
