"use client";

import * as React from "react";
import { SHOW_DEMO_RIBBON } from "@/constants/site";

/**
 * Subtle indicator when the site is running without a configured public API URL.
 * Hidden when `NEXT_PUBLIC_HIDE_DEMO_RIBBON=1` or when `NEXT_PUBLIC_API_URL` is set at build time.
 */
export function DemoRibbon() {
  if (!SHOW_DEMO_RIBBON) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[90] -translate-x-1/2 px-4">
      <div className="pointer-events-auto rounded-full border border-amber-400/30 bg-black/70 px-4 py-2 text-center text-[11px] uppercase tracking-[0.28em] text-amber-100/90 shadow-[0_0_32px_rgba(0,0,0,0.45)] backdrop-blur-md">
        Showcase dataset · connect API for live inventory
      </div>
    </div>
  );
}
