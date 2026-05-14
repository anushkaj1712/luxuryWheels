import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { AIConcierge } from "@/components/ai/AIConcierge";

/**
 * Marketing shell — shared chrome for public pages (nav, scroll progress, AI dock).
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <main id="main-content" className="pt-24">
        {children}
      </main>
      <SiteFooter />
      <AIConcierge />
    </>
  );
}
