import { SiteFooter } from "@/components/layout/SiteFooter";
import { MarketingAddons } from "@/components/layout/MarketingAddons";

/** Marketing shell — server layout; interactive chrome in client addon bundle. */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingAddons />
      <main id="main-content" className="pt-24">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
