import { cn } from "@/lib/utils";

/** Premium shimmer placeholder — avoids layout shift while sections hydrate. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-white/[0.04] before:absolute before:inset-0 before:-translate-x-full before:animate-dlw-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/[0.06] before:to-transparent",
        className,
      )}
      {...props}
    />
  );
}
