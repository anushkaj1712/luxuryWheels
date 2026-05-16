"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { COLLECTION_TABS, type CollectionCategory } from "@/lib/car-filters";

type Props = {
  value: CollectionCategory;
  onChange: (category: CollectionCategory) => void;
  counts?: Partial<Record<CollectionCategory, number>>;
};

/** Premium category tabs — All / New / Used / Demo with animated underline. */
export function CollectionCategoryTabs({ value, onChange, counts }: Props) {
  return (
    <div className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-dlw-metal/60 p-1.5 backdrop-blur-xl md:gap-1">
      {COLLECTION_TABS.map((tab) => {
        const active = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex-1 rounded-xl px-3 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors md:px-5 md:text-xs md:tracking-[0.28em]",
              active ? "text-white" : "text-white/45 hover:text-white/75",
            )}
          >
            {active ? (
              <motion.span
                layoutId="collection-tab-bg"
                className="absolute inset-0 rounded-xl border border-dlw-red/40 bg-gradient-to-r from-dlw-red/20 via-white/5 to-dlw-red/10 shadow-dlw-red"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            ) : null}
            <span className="relative z-10">
              {tab.label}
              {counts?.[tab.id] != null ? (
                <span className="ml-1 text-white/35">({counts[tab.id]})</span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
