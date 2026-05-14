"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Visual configurator shell — bind trim / wheel / interior enums to `PATCH /api/admin/cars/:id` or a dedicated config API.
 */
export default function ConfiguratorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl text-white">
        Atelier configurator
      </motion.h1>
      <p className="mt-4 text-sm text-white/55">3D trim selection + real-time pricing hooks belong here — wire your GLB and option matrix.</p>
      <div className="mt-10 rounded-3xl border border-dashed border-white/15 p-10 text-center text-white/40">3D stage placeholder (React Three Fiber)</div>
      <Button className="mt-8" asChild>
        <Link href="/cars">Return to collection</Link>
      </Button>
    </div>
  );
}
