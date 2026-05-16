import { BrandTagline } from "@/components/brand/BrandTagline";
import { cn } from "@/lib/utils";

/** Section separator with centered tagline — luxury white line + red accent. */
export function LuxuryDivider({ className, showTagline = true }: { className?: string; showTagline?: boolean }) {
  return (
    <div className={cn("py-10 md:py-14", className)}>
      <div className="dlw-divider mx-auto max-w-4xl" />
      {showTagline ? (
        <div className="mt-8">
          <BrandTagline size="sm" />
        </div>
      ) : null}
    </div>
  );
}
