"use client";

import * as React from "react";
import { registerApiLoadingListener } from "./ApiLoadingBridge";

/**
 * Subtle top loading bar while any Axios request is in flight (slow Render cold starts / heavy queries).
 */
export function ApiLoadingProvider({ children }: { children: React.ReactNode }) {
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => registerApiLoadingListener(setBusy), []);

  return (
    <>
      <div
        className={`pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 transition-opacity duration-300 ${
          busy ? "opacity-100" : "opacity-0"
        }`}
        aria-busy={busy}
        aria-label={busy ? "Loading data" : undefined}
      >
        <div className="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-amber-400/90 to-transparent shadow-[0_0_20px_rgba(251,191,36,0.35)]" />
      </div>
      {children}
    </>
  );
}
