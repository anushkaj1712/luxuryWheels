"use client";

import dynamic from "next/dynamic";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SiteHeader } from "@/components/layout/SiteHeader";

const AIConcierge = dynamic(() => import("@/components/ai/AIConcierge").then((m) => m.AIConcierge), {
  ssr: false,
  loading: () => null,
});

/** Client marketing chrome — lazy AI concierge, scroll progress, header. */
export function MarketingAddons() {
  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <AIConcierge />
    </>
  );
}
