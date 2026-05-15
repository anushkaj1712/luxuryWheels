"use client";

import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CompareBar } from "@/components/compare/CompareBar";

// AI Concierge — preserved for future release (Coming Soon).
// import dynamic from "next/dynamic";
// const AIConcierge = dynamic(() => import("@/components/ai/AIConcierge").then((m) => m.AIConcierge), {
//   ssr: false,
//   loading: () => null,
// });

/** Client marketing chrome — scroll progress, header, compare tray. */
export function MarketingAddons() {
  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <CompareBar />
      {/* <AIConcierge /> — enable when assistant API is wired */}
    </>
  );
}
