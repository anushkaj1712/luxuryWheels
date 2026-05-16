"use client";

import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CompareBar } from "@/components/compare/CompareBar";

/** Client marketing chrome — scroll progress, header, compare tray. */
export function MarketingAddons() {
  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <CompareBar />
    </>
  );
}
