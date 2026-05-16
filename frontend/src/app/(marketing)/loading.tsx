import { BrandLoader } from "@/components/brand/BrandLoader";

/** Full-viewport route loader — logo only on dedicated loading screen, not inline below header. */
export default function MarketingLoading() {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-dlw-charcoal/95 backdrop-blur-md">
      <BrandLoader />
    </div>
  );
}
