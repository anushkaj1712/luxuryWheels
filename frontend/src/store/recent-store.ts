/**
 * Recently viewed cars — powers "Continue exploring" rails without server calls.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RecentCar = { id: string; slug: string; title: string; thumb?: string | null; price: number };

type RecentState = {
  items: RecentCar[];
  push: (car: RecentCar) => void;
};

export const useRecentStore = create<RecentState>()(
  persist(
    (set, get) => ({
      items: [],
      push: (car) => {
        const rest = get().items.filter((c) => c.id !== car.id);
        set({ items: [car, ...rest].slice(0, 12) });
      },
    }),
    { name: "dlw-recent" },
  ),
);
