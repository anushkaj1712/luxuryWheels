"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

/**
 * AI Concierge — architecture preserved; full chat in `AIConcierge.tsx` when API is ready.
 * Enable by swapping import in `MarketingAddons.tsx`.
 */
export function AIConciergeComingSoon() {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-[65] flex flex-col items-end gap-2"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <span className="rounded-full border border-dlw-red/30 bg-dlw-charcoal/90 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-dlw-red shadow-dlw-red">
        Coming Soon
      </span>
      <Button
        size="icon"
        variant="ghost"
        className="h-14 w-14 rounded-full border border-white/15 bg-dlw-metal/80 shadow-dlw-chrome"
        aria-label="AI Concierge coming soon"
        disabled
      >
        <Sparkles className="h-6 w-6 text-dlw-red" />
      </Button>
    </motion.div>
  );
}
