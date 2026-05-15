"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/services/api";
import { useCompareStore } from "@/store/compare-store";
import type { ApiCar } from "@/lib/types/home";

/** Side-by-side compare — fetches each selected vehicle by slug from localStorage IDs (IDs only: extend to slug map as needed). */
export default function ComparePage() {
  const ids = useCompareStore((s) => s.ids);
  const clear = useCompareStore((s) => s.clear);
  const [rows, setRows] = React.useState<ApiCar[]>([]);

  React.useEffect(() => {
    if (ids.length === 0) {
      setRows([]);
      return;
    }
    (async () => {
      const list: ApiCar[] = [];
      for (const id of ids) {
        try {
          const { data } = await api.get("/cars", { params: { take: 48 } });
          const hit = (data.data.items as ApiCar[]).find((c) => c.id === id);
          if (hit) list.push(hit);
        } catch {
          /* ignore */
        }
      }
      setRows(list);
    })();
  }, [ids]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-white">Compare</h1>
        <button type="button" className="text-xs uppercase tracking-widest text-white/45 hover:text-white" onClick={clear}>
          Clear
        </button>
      </div>
      {rows.length === 0 ? <p className="mt-8 text-sm text-white/50">Add vehicles from a listing detail page.</p> : null}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {rows.map((c) => (
          <Link key={c.id} href={`/cars/${c.slug}`} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="relative aspect-video">
              {c.thumbnail ? <Image src={c.thumbnail} alt="" fill className="object-cover" /> : null}
            </div>
            <p className="mt-3 text-sm text-white">
              {c.brand} {c.model}
            </p>
            <p className="text-xs text-white/45">{c.year}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
