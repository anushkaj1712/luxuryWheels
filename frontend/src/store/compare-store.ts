/**
 * Compare tray — persists up to 3 vehicles with snapshot data for instant UI + compare page.
 * IDs are still sent to API as `?ids=` when refreshing from network.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CompareItem = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  thumbnail: string | null;
  horsepower?: number | null;
  features?: string[];
};

type CompareState = {
  items: CompareItem[];
  add: (item: CompareItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
};

const MAX = 3;

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const next = get().items.filter((x) => x.id !== item.id);
        next.unshift(item);
        set({ items: next.slice(0, MAX) });
      },
      remove: (id) => set({ items: get().items.filter((x) => x.id !== id) }),
      clear: () => set({ items: [] }),
      has: (id) => get().items.some((x) => x.id === id),
    }),
    {
      name: "dlw-compare-v2",
      partialize: (s) => ({ items: s.items }),
    },
  ),
);

/** Build API `ids` query from persisted compare tray. */
export function compareIdsParam(items: CompareItem[]): string | undefined {
  if (!items.length) return undefined;
  return items.map((i) => i.id).join(",");
}
