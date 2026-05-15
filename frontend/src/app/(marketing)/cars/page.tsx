import { Suspense } from "react";
import { CarsCollection } from "@/components/cars/CarsCollection";
import { Skeleton } from "@/components/ui/skeleton";

export default function CarsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 md:px-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-32 w-full" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        </div>
      }
    >
      <CarsCollection />
    </Suspense>
  );
}
