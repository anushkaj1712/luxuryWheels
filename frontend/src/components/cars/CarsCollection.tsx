"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { BrandTagline } from "@/components/brand/BrandTagline";
import { CarFiltersPanel } from "@/components/cars/CarFiltersPanel";
import { CarListingCard } from "@/components/cars/CarListingCard";
import { CollectionCategoryTabs } from "@/components/cars/CollectionCategoryTabs";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";
import {
  COLLECTION_TABS,
  DEFAULT_CAR_FILTERS,
  countActiveFilters,
  filtersToApiParams,
  filtersToSearchParams,
  searchParamsToFilters,
  type CarListFilters,
  type CollectionCategory,
} from "@/lib/car-filters";
import type { ApiCar } from "@/lib/types/home";

/**
 * Collection listing — category tabs, debounced search, URL-synced filters, load more.
 */
export function CarsCollection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobile = useIsMobile();
  const [filters, setFilters] = React.useState<CarListFilters>(() => searchParamsToFilters(searchParams));
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [items, setItems] = React.useState<ApiCar[]>([]);
  const [cursor, setCursor] = React.useState<string | undefined>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [view, setView] = React.useState<"grid" | "list">("grid");

  const activeFilterCount = countActiveFilters(filters);
  const debouncedSearch = useDebouncedValue(filters.search, 220);
  const queryFilters = React.useMemo(() => ({ ...filters, search: debouncedSearch }), [filters, debouncedSearch]);

  React.useEffect(() => {
    if (!filtersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [filtersOpen]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFiltersOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    const next = filtersToSearchParams(queryFilters).toString();
    const current = searchParams.toString();
    if (next === current) return;
    router.replace(next ? `/cars?${next}` : "/cars", { scroll: false });
  }, [queryFilters, router, searchParams]);

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
        setError("Could not load inventory. Try again shortly.");
        if (reset) setItems([]);
        toast.error("Collection unavailable");
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
  const resetFilters = () => setFilters((f) => ({ ...DEFAULT_CAR_FILTERS, category: f.category }));
  const setCategory = (category: CollectionCategory) => patchFilters({ category });

  const title = COLLECTION_TABS.find((t) => t.id === filters.category)?.label ?? "All Cars";

  return (
    <motion.div className={cn("mx-auto max-w-6xl px-4 py-10 md:px-8", filtersOpen && !mobile && "md:pl-[21rem]")}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-xs uppercase tracking-[0.4em] text-dlw-red">The collection</p>
        <h1 className="mt-2 font-brand text-4xl font-bold italic text-white md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-xl text-sm text-white/55">
          Filter by marque, dynamics, and acquisition thesis — every listing verified in-house.
        </p>
        <motion.div className="mt-6">
          <BrandTagline size="sm" align="left" />
        </motion.div>
      </motion.div>

      <CollectionCategoryTabs value={filters.category} onChange={setCategory} />

      <motion.div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          className={cn(
            "relative gap-2.5 border-white/15 bg-gradient-to-r from-white/[0.06] to-white/[0.02] px-5 backdrop-blur-xl transition duration-300",
            "hover:border-dlw-red/45 hover:shadow-dlw-red",
            filtersOpen && "border-dlw-red/40 shadow-dlw-red",
          )}
          onClick={() => setFiltersOpen(true)}
          aria-expanded={filtersOpen}
        >
          <SlidersHorizontal className="h-4 w-4 text-dlw-red" />
          <span className="text-xs font-medium uppercase tracking-[0.32em]">Filters</span>
          {activeFilterCount > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-dlw-red px-1.5 text-[10px] font-semibold text-white shadow-dlw-red">
              {activeFilterCount}
            </span>
          ) : null}
        </Button>

        <motion.div className="flex gap-2">
          <Button variant={view === "grid" ? "default" : "ghost"} size="icon" type="button" aria-label="Grid view" onClick={() => setView("grid")}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={view === "list" ? "default" : "ghost"} size="icon" type="button" aria-label="List view" onClick={() => setView("list")}>
            <List className="h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {filtersOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close filters overlay"
              className="fixed inset-0 z-[44] bg-black/70 backdrop-blur-xl md:bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setFiltersOpen(false)}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Collection filters"
              className={cn(
                "fixed z-[45] flex flex-col border-r border-white/12 shadow-[0_0_80px_-20px_rgba(0,0,0,0.8)]",
                "inset-y-0 left-0 w-[min(100vw-1.5rem,21rem)]",
                "bg-gradient-to-b from-dlw-charcoal/98 via-dlw-charcoal/95 to-black/90 backdrop-blur-2xl",
                "md:top-24 md:bottom-6 md:left-4 md:w-72 md:rounded-2xl md:border md:border-white/15 md:shadow-dlw-glass",
              )}
              initial={{ x: "-105%", opacity: 0.92 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-105%", opacity: 0.88 }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
            >
              <CarFiltersPanel
                filters={filters}
                onChange={patchFilters}
                onReset={resetFilters}
                onClose={() => setFiltersOpen(false)}
              />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      {error ? <p className="mb-4 text-sm text-amber-200/80">{error}</p> : null}

      {loading && items.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div key={i} className="dlw-card h-64 animate-pulse bg-white/[0.03]" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="dlw-glass rounded-2xl p-8 text-center text-sm text-white/50">No vehicles match your criteria.</p>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${filters.category}-${debouncedSearch}-${filters.brand}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={view === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3"}
          >
            {items.map((car, i) => (
              <CarListingCard key={car.id} car={car} view={view} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {loading && items.length > 0 ? (
        <p className="mt-6 text-center text-xs uppercase tracking-widest text-white/35">Updating…</p>
      ) : null}

      {cursor ? (
        <div className="mt-10 flex justify-center">
          <Button variant="outline" disabled={loading} onClick={() => load(false, cursor)}>
            {loading ? "Loading…" : "Load more"}
          </Button>
        </div>
      ) : null}
    </motion.div>
  );
}
