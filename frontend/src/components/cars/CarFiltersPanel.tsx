"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { RotateCcw, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BRAND_OPTIONS, BODY_TYPE_OPTIONS, type CarListFilters } from "@/lib/car-filters";
import { cn } from "@/lib/utils";

type Props = {
  filters: CarListFilters;
  onChange: (patch: Partial<CarListFilters>) => void;
  onReset: () => void;
  onClose: () => void;
};

const selectClass =
  "dlw-filter-select mt-1.5 flex h-11 w-full cursor-pointer appearance-none rounded-xl border border-white/12 bg-gradient-to-b from-black/60 to-black/40 px-3.5 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-300 hover:border-dlw-silver/30 hover:shadow-[0_0_20px_-10px_var(--dlw-red-glow)] focus:border-dlw-red/50 focus:outline-none focus:ring-2 focus:ring-dlw-red/30";

const labelClass = "text-[10px] font-medium uppercase tracking-[0.32em] text-white/50";

function FilterField({
  label,
  children,
  active,
}: {
  label: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <motion.div
      layout
      className={cn(
        "rounded-2xl border p-3.5 transition duration-300",
        active
          ? "border-dlw-red/40 bg-gradient-to-br from-dlw-red/[0.08] to-transparent shadow-[0_0_28px_-10px_var(--dlw-red-glow)]"
          : "border-white/[0.08] bg-white/[0.02] hover:border-white/18 hover:bg-white/[0.04]",
      )}
    >
      <span className={labelClass}>{label}</span>
      {children}
    </motion.div>
  );
}

const PRICE_MAX = 50_000_000;

/** Premium collection filters — rendered inside the sidebar drawer. */
export function CarFiltersPanel({ filters, onChange, onReset, onClose }: Props) {
  const maxPriceNum = filters.maxPrice !== "" ? Number(filters.maxPrice) : PRICE_MAX;
  const minPriceNum = filters.minPrice !== "" ? Number(filters.minPrice) : 0;

  return (
    <div className="flex h-full flex-col">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between border-b border-white/10 px-5 py-4"
      >
        <motion.div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-dlw-red">Refine</p>
          <h2 className="mt-1 font-display text-lg text-white">Filters</h2>
        </motion.div>
        <motion.div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" className="gap-1.5 text-[10px] uppercase tracking-widest" onClick={onReset}>
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label="Close filters" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5"
      >
        <FilterField label="Search" active={Boolean(filters.search.trim())}>
          <Input
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Brand, model, year, fuel…"
            className="mt-1.5 border-white/12 bg-black/50 focus-visible:ring-dlw-red/30"
          />
        </FilterField>

        <FilterField label="Sort" active={filters.sort !== "price_desc"}>
          <select className={selectClass} value={filters.sort} onChange={(e) => onChange({ sort: e.target.value as CarListFilters["sort"] })}>
            <option value="price_desc">Price · High to low</option>
            <option value="price_asc">Price · Low to high</option>
            <option value="year_desc">Year · Newest</option>
            <option value="mileage_asc">Mileage · Lowest</option>
          </select>
        </FilterField>

        <FilterField label="Brand" active={Boolean(filters.brand)}>
          <select className={selectClass} value={filters.brand} onChange={(e) => onChange({ brand: e.target.value })}>
            <option value="">All marques</option>
            {BRAND_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label="Fuel" active={Boolean(filters.fuel)}>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["", "PETROL", "DIESEL", "ELECTRIC", "HYBRID"] as const).map((f) => {
              const label = f === "" ? "Any" : f.charAt(0) + f.slice(1).toLowerCase();
              const on = filters.fuel === f;
              return (
                <button
                  key={f || "any"}
                  type="button"
                  onClick={() => onChange({ fuel: f })}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-wider transition duration-300",
                    on
                      ? "border-dlw-red/50 bg-dlw-red/15 text-white shadow-[0_0_16px_-4px_var(--dlw-red-glow)]"
                      : "border-white/10 bg-black/30 text-white/55 hover:border-white/25 hover:text-white",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </FilterField>

        <FilterField label="Transmission" active={Boolean(filters.transmission)}>
          <motion.div className="mt-2 flex flex-wrap gap-2">
            {(["", "AUTOMATIC", "MANUAL"] as const).map((t) => {
              const label = t === "" ? "Any" : t === "AUTOMATIC" ? "Automatic" : "Manual";
              const on = filters.transmission === t;
              return (
                <button
                  key={t || "any-t"}
                  type="button"
                  onClick={() => onChange({ transmission: t })}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-wider transition duration-300",
                    on
                      ? "border-dlw-red/50 bg-dlw-red/15 text-white shadow-[0_0_16px_-4px_var(--dlw-red-glow)]"
                      : "border-white/10 bg-black/30 text-white/55 hover:border-white/25 hover:text-white",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </motion.div>
        </FilterField>

        <FilterField label="Body type" active={Boolean(filters.bodyType)}>
          <select className={selectClass} value={filters.bodyType} onChange={(e) => onChange({ bodyType: e.target.value })}>
            <option value="">Any</option>
            {BODY_TYPE_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label="Price range (₹)" active={filters.minPrice !== "" || filters.maxPrice !== ""}>
          <motion.div className="mt-3 space-y-4">
            <input
              type="range"
              min={0}
              max={PRICE_MAX}
              step={500_000}
              value={Math.min(maxPriceNum, PRICE_MAX)}
              onChange={(e) => onChange({ maxPrice: e.target.value })}
              className="dlw-range w-full"
              aria-label="Maximum price"
            />
            <motion.div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                value={filters.minPrice}
                onChange={(e) => onChange({ minPrice: e.target.value })}
                placeholder="Min"
                className="border-white/12 bg-black/50"
              />
              <Input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => onChange({ maxPrice: e.target.value })}
                placeholder="Max"
                className="border-white/12 bg-black/50"
              />
            </motion.div>
            <p className="text-[10px] text-white/35">
              {minPriceNum > 0 || maxPriceNum < PRICE_MAX
                ? `Up to ${new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(maxPriceNum)}`
                : "Full INR range (demo inventory)."}
            </p>
          </motion.div>
        </FilterField>

        <FilterField label="Year" active={filters.year !== ""}>
          <Input
            type="number"
            value={filters.year}
            onChange={(e) => onChange({ year: e.target.value })}
            placeholder="e.g. 2024"
            className="mt-1.5 border-white/12 bg-black/50"
          />
        </FilterField>
      </motion.div>

      <motion.div className="border-t border-white/10 p-5">
        <Button type="button" variant="luxury" className="w-full" onClick={onClose}>
          View results
        </Button>
      </motion.div>
    </div>
  );
}
