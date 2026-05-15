"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { api } from "@/services/api";
import { compareIdsParam, useCompareStore, type CompareItem } from "@/store/compare-store";
import { SafeImage } from "@/components/media/SafeImage";
import { resolveCarImageUrl } from "@/lib/image-utils";
import { Button } from "@/components/ui/button";

const SPEC_ROWS: { key: keyof CompareItem | "price"; label: string; format?: (c: CompareItem) => string }[] = [
  { key: "price", label: "Price", format: (c) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(c.price) },
  { key: "year", label: "Year", format: (c) => String(c.year) },
  { key: "mileage", label: "Mileage", format: (c) => `${c.mileage.toLocaleString()} km` },
  { key: "fuel", label: "Fuel" },
  { key: "transmission", label: "Transmission" },
  { key: "horsepower", label: "Power", format: (c) => (c.horsepower ? `${c.horsepower} hp` : "—") },
];

/**
 * Compare page — hydrates tray snapshots via single `?ids=` request when online.
 */
export default function ComparePage() {
  const items = useCompareStore((s) => s.items);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const [rows, setRows] = React.useState<CompareItem[]>(items);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!items.length) {
      setRows([]);
      return;
    }
    const ids = compareIdsParam(items);
    if (!ids) {
      setRows(items);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get("/cars", { params: { ids } });
        const fresh = (data.data.items ?? []) as CompareItem[];
        if (!cancelled) setRows(fresh.length ? fresh : items);
      } catch {
        if (!cancelled) {
          setRows(items);
          setError("Live refresh unavailable — showing saved comparison.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [items]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl text-white">
          Compare atelier
        </motion.h1>
        {rows.length > 0 ? (
          <button type="button" className="text-xs uppercase tracking-widest text-white/45 hover:text-white" onClick={clear}>
            Clear all
          </button>
        ) : null}
      </div>

      {loading ? <p className="mt-6 text-sm text-white/45">Refreshing specifications…</p> : null}
      {error ? <p className="mt-2 text-sm text-amber-200/80">{error}</p> : null}

      {rows.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/50">
          Add up to three vehicles from a detail page to begin a side-by-side review.
        </p>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 grid gap-4 md:grid-cols-3"
          >
            {rows.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
              >
                <button
                  type="button"
                  className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-1.5 text-white/70 hover:text-white"
                  aria-label="Remove from compare"
                  onClick={() => remove(c.id)}
                >
                  <X className="h-4 w-4" />
                </button>
                <Link href={`/cars/${c.slug}`} className="block">
                  <div className="relative aspect-[16/10]">
                    <SafeImage src={resolveCarImageUrl(c.thumbnail)} alt={`${c.brand} ${c.model}`} fill className="object-cover" sizes="33vw" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-widest text-white/40">{c.brand}</p>
                    <p className="font-display text-lg text-white">
                      {c.model} · {c.year}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-12 overflow-x-auto rounded-2xl border border-white/10"
          >
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="p-4 text-xs uppercase tracking-widest text-white/40">Specification</th>
                  {rows.map((c) => (
                    <th key={c.id} className="p-4 font-display text-white">
                      {c.model}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SPEC_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-white/5">
                    <td className="p-4 text-white/45">{row.label}</td>
                    {rows.map((c) => (
                      <td key={`${c.id}-${row.label}`} className="p-4 text-white/85">
                        {row.format ? row.format(c) : String(c[row.key as keyof CompareItem] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="p-4 text-white/45">Features</td>
                  {rows.map((c) => (
                    <td key={`${c.id}-feat`} className="p-4 text-xs text-white/60">
                      {(c.features ?? []).slice(0, 4).join(" · ") || "—"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </motion.div>

          <div className="mt-10 flex flex-wrap gap-3">
            {rows.map((c) => (
              <Button key={c.id} variant="outline" asChild>
                <Link href={`/cars/${c.slug}`}>View {c.model}</Link>
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
