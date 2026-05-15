"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCompareStore } from "@/store/compare-store";
import { resolveCarImageUrl } from "@/lib/image-utils";
import { Button } from "@/components/ui/button";

/** Floating compare tray — visible only when vehicles are queued. */
export function CompareBar() {
  const items = useCompareStore((s) => s.items);
  const remove = useCompareStore((s) => s.remove);

  return (
    <AnimatePresence>
      {items.length > 0 ? (
        <motion.div
          key="compare-bar"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-3xl rounded-2xl border border-white/15 bg-black/85 p-3 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl md:inset-x-8"
          role="region"
          aria-label="Compare vehicles"
        >
          <motion.div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="text-xs uppercase tracking-[0.35em] text-white/45 sm:w-24">Compare</p>
            <motion.div className="flex flex-1 gap-2 overflow-x-auto">
              {items.map((car) => (
                <motion.div
                  key={car.id}
                  className="relative flex min-w-[120px] items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2 pr-8"
                >
                  <motion.div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg">
                    <Image src={resolveCarImageUrl(car.thumbnail)} alt="" fill className="object-cover" sizes="56px" />
                  </motion.div>
                  <motion.div className="min-w-0">
                    <p className="truncate text-xs text-white">{car.brand}</p>
                    <p className="truncate text-[10px] text-white/45">{car.model}</p>
                  </motion.div>
                  <button
                    type="button"
                    className="absolute right-1 top-1 rounded-full p-1 text-white/40 hover:text-white"
                    aria-label={`Remove ${car.model} from compare`}
                    onClick={() => remove(car.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
            <Button size="sm" asChild className="shrink-0">
              <Link href="/compare">View comparison</Link>
            </Button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
