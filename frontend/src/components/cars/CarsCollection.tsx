"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutGrid, List } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { CarFiltersPanel } from "@/components/cars/CarFiltersPanel";
import { CarListingCard } from "@/components/cars/CarListingCard";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  DEFAULT_CAR_FILTERS,
  filtersToApiParams,
  filtersToSearchParams,
  searchParamsToFilters,
  type CarListFilters,
} from "@/lib/car-filters";
import type { ApiCar } from "@/lib/types/home";

/**
 * Collection listing — debounced search, URL-synced filters, cursor pagination.
 * Demo mode applies the same rules client-side via demo-axios-resolver.
 */
export function CarsCollection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = React.useState<CarListFilters>(() => searchParamsToFilters(searchParams));
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [items, setItems] = React.useState<ApiCar[]>([]);
  const [cursor, setCursor] = React.useState<string | undefined>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [view, setView] = React.useState<"grid" | "list">("grid");

  const debouncedSearch = useDebouncedValue(filters.search, 320);
  const queryFilters = React.useMemo(() => ({ ...filters, search: debouncedSearch }), [filters, debouncedSearch]);

  // Keep shareable URLs in sync without full page reload.
  React.useEffect(() => {
    const next = filtersToSearchParams(queryFilters).toString();
    router.replace(next ? `/cars?${next}` : "/cars", { scroll: false });
  }, [queryFilters, router]);

  const load = React.useCallback(
    async (reset: boolean, activeCursor?: string) => {
      setLoading(true);
      setError(null);
      const controller = new AbortController();
      try {
        const { data } = await api.get("/cars", {
          params: filtersToApiParams(queryFilters, reset ? undefined : activeCursor),
          signal: controller.signal,
        });
        const list = (data.data.items ?? []) as ApiCar[];
        const next = data.data.nextCursor as string | undefined;
        setItems((prev) => (reset ? list : [...prev, ...list]));
        setCursor(next);
      } catch (e) {
        if ((e as { name?: string }).name === "CanceledError") return;
        setError("Could not load inventory. Showing cached results when available.");
        if (reset) setItems([]);
        toast.error("Collection unavailable — try again shortly.");
      } finally {
        setLoading(false);
      }
      return () => controller.abort();
    },
    [queryFilters],
  );

  React.useEffect(() => {
    setCursor(undefined);
    void load(true);
  }, [queryFilters, load]);

  const patchFilters = (patch: Partial<CarListFilters>) => setFilters((f) => ({ ...f, ...patch }));
  const resetFilters = () => setFilters(DEFAULT_CAR_FILTERS);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="font-display text-4xl text-white">The collection</h1>
        <p className="mt-2 max-w-xl text-sm text-white/55">Filter by marque, dynamics, and acquisition thesis — every listing is verified in-house.</p>
      </motion.div>

      <CarFiltersPanel
        filters={filters}
        onChange={patchFilters}
        onReset={resetFilters}
        showAdvanced={showAdvanced}
        onToggleAdvanced={() => setShowAdvanced((v) => !v)}
      />

      <div className="mb-6 flex justify-end gap-2">
        <Button variant={view === "grid" ? "default" : "ghost"} size="icon" type="button" aria-label="Grid view" onClick={() => setView("grid")}>
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button variant={view === "list" ? "default" : "ghost"} size="icon" type="button" aria-label="List view" onClick={() => setView("list")}>
          <List className="h-4 w-4" />
        </Button>
      </div>

      {error ? <p className="mb-4 text-sm text-amber-200/80">{error}</p> : null}

      {loading && items.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-white/[0.04]" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/50">No vehicles match your criteria.</p>
      ) : view === "grid" ? (
        <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((car, i) => (
            <CarListingCard key={car.id} car={car} view="grid" index={i} />
          ))}
        </motion.div>
      ) : (
        <motion.div className="space-y-3">
          {items.map((car, i) => (
            <CarListingCard key={car.id} car={car} view="list" index={i} />
          ))}
        </motion.div>
      )}

      {cursor ? (
        <div className="mt-10 flex justify-center">
          <Button variant="outline" disabled={loading} onClick={() => load(false, cursor)}>
            {loading ? "Loading…" : "Load more"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
