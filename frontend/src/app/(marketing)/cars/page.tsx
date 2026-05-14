"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { api } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ApiCar } from "@/components/home/HomeView";

/**
 * Collection page — advanced filters, grid/list toggle, infinite-style pagination via cursor.
 */
export default function CarsPage() {
  const [items, setItems] = React.useState<ApiCar[]>([]);
  const [cursor, setCursor] = React.useState<string | undefined>();
  const [loading, setLoading] = React.useState(true);
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [filters, setFilters] = React.useState({ search: "", sort: "price_desc", brand: "" });

  const load = React.useCallback(
    async (reset = false) => {
      setLoading(true);
      try {
        const { data } = await api.get("/cars", {
          params: {
            search: filters.search || undefined,
            sort: filters.sort,
            brand: filters.brand || undefined,
            cursor: reset ? undefined : cursor,
            take: 12,
          },
        });
        const next = data.data.nextCursor as string | undefined;
        const list = data.data.items as ApiCar[];
        setItems((prev) => (reset ? list : [...prev, ...list]));
        setCursor(next);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [cursor, filters.brand, filters.search, filters.sort],
  );

  React.useEffect(() => {
    setCursor(undefined);
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.sort, filters.brand]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="font-display text-4xl text-white">The collection</h1>
        <p className="mt-2 max-w-xl text-sm text-white/55">Filter by marque, dynamics, and acquisition thesis — every listing is verified in-house.</p>
      </motion.div>

      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:flex-row md:items-end">
        <div className="flex-1 space-y-2">
          <label className="text-xs uppercase tracking-widest text-white/45">Search</label>
          <Input value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} placeholder="Brand, model, keyword…" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-white/45">Sort</label>
          <select
            className="mt-1 flex h-11 w-full min-w-[180px] rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white"
            value={filters.sort}
            onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
          >
            <option value="price_desc">Price · High to low</option>
            <option value="price_asc">Price · Low to high</option>
            <option value="year_desc">Year · Newest</option>
            <option value="mileage_asc">Mileage · Lowest</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant={view === "grid" ? "default" : "ghost"} size="icon" type="button" aria-label="Grid view" onClick={() => setView("grid")}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={view === "list" ? "default" : "ghost"} size="icon" type="button" aria-label="List view" onClick={() => setView("list")}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" type="button" aria-label="More filters" title="Extend with fuel/transmission filters — wired to API query params.">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading && items.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-white/[0.04]" />
          ))}
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((car) => (
            <Link key={car.id} href={`/cars/${car.slug}`} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:border-white/25">
              <div className="relative aspect-[5/3]">
                {car.thumbnail ? <Image src={car.thumbnail} alt="" fill className="object-cover transition duration-700 group-hover:scale-105" sizes="400px" /> : <div className="h-full bg-zinc-800" />}
              </div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">{car.brand}</p>
                <p className="font-display text-lg text-white">
                  {car.model} · {car.year}
                </p>
                <p className="mt-2 text-sm text-white/55">
                  {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(car.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((car) => (
            <Link key={car.id} href={`/cars/${car.slug}`} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-white/25">
              <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl">
                {car.thumbnail ? <Image src={car.thumbnail} alt="" fill className="object-cover" sizes="128px" /> : null}
              </div>
              <div>
                <p className="text-sm text-white">
                  {car.brand} {car.model}
                </p>
                <p className="text-xs text-white/45">{car.year}</p>
              </div>
              <div className="ml-auto text-sm text-white/80">
                {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(car.price)}
              </div>
            </Link>
          ))}
        </div>
      )}

      {cursor ? (
        <div className="mt-10 flex justify-center">
          <Button variant="outline" disabled={loading} onClick={() => load(false)}>
            {loading ? "Loading…" : "Load more"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
