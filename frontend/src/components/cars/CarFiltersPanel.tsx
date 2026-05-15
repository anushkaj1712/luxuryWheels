"use client";

import { SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BRAND_OPTIONS, BODY_TYPE_OPTIONS, type CarListFilters } from "@/lib/car-filters";

type Props = {
  filters: CarListFilters;
  onChange: (patch: Partial<CarListFilters>) => void;
  onReset: () => void;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
};

const selectClass =
  "mt-1 flex h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white";

/** Collection filters — debounced search is handled by parent. */
export function CarFiltersPanel({ filters, onChange, onReset, showAdvanced, onToggleAdvanced }: Props) {
  return (
    <div className="mb-8 space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1 space-y-2">
          <label className="text-xs uppercase tracking-widest text-white/45">Search</label>
          <Input
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Brand, model, year, fuel…"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-white/45">Sort</label>
          <select className={selectClass} value={filters.sort} onChange={(e) => onChange({ sort: e.target.value as CarListFilters["sort"] })}>
            <option value="price_desc">Price · High to low</option>
            <option value="price_asc">Price · Low to high</option>
            <option value="year_desc">Year · Newest</option>
            <option value="mileage_asc">Mileage · Lowest</option>
          </select>
        </div>
        <Button type="button" variant="ghost" size="icon" aria-label="Toggle filters" onClick={onToggleAdvanced}>
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {showAdvanced ? (
        <div className="grid gap-4 border-t border-white/10 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/45">Brand</label>
            <select className={selectClass} value={filters.brand} onChange={(e) => onChange({ brand: e.target.value })}>
              <option value="">All marques</option>
              {BRAND_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/45">Fuel</label>
            <select className={selectClass} value={filters.fuel} onChange={(e) => onChange({ fuel: e.target.value })}>
              <option value="">Any</option>
              <option value="PETROL">Petrol</option>
              <option value="DIESEL">Diesel</option>
              <option value="ELECTRIC">Electric</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/45">Transmission</label>
            <select className={selectClass} value={filters.transmission} onChange={(e) => onChange({ transmission: e.target.value })}>
              <option value="">Any</option>
              <option value="AUTOMATIC">Automatic</option>
              <option value="MANUAL">Manual</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/45">Body type</label>
            <select className={selectClass} value={filters.bodyType} onChange={(e) => onChange({ bodyType: e.target.value })}>
              <option value="">Any</option>
              {BODY_TYPE_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/45">Min price (₹)</label>
            <Input type="number" value={filters.minPrice} onChange={(e) => onChange({ minPrice: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/45">Max price (₹)</label>
            <Input type="number" value={filters.maxPrice} onChange={(e) => onChange({ maxPrice: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/45">Year</label>
            <Input type="number" value={filters.year} onChange={(e) => onChange({ year: e.target.value })} placeholder="e.g. 2024" />
          </div>
          <div className="flex items-end">
            <Button type="button" variant="outline" className="w-full" onClick={onReset}>
              Reset filters
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
