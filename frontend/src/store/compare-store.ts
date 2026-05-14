/**
 * Car comparison tray — stores up to 3 vehicle IDs for side-by-side modal.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

type CompareState = {
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) => {
        const ids = get().ids.filter((x) => x !== id);
        ids.unshift(id);
        set({ ids: ids.slice(0, 3) });
      },
      remove: (id) => set({ ids: get().ids.filter((x) => x !== id) }),
      clear: () => set({ ids: [] }),
    }),
    { name: "dlw-compare" },
  ),
);
