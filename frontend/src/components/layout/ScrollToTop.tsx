"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { scrollWindowToTop } from "@/components/providers/lenis-context";

/**
 * Resets scroll position on route changes — fixes pages opening mid-scroll.
 * Intentionally ignores search-param-only updates (e.g. filter tweaks on /cars).
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const isFirst = React.useRef(true);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  React.useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      scrollWindowToTop("auto");
      return;
    }
    scrollWindowToTop("auto");
  }, [pathname]);

  return null;
}
