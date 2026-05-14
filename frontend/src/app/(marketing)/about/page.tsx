"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl text-white">
        Heritage
      </motion.h1>
      <p className="mt-6 text-white/60">
        Drive Luxury Wheels was founded on a singular thesis: the world&apos;s finest automobiles deserve a digital experience as considered as the
        engineering beneath their skin.
      </p>
      <section className="mt-12 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-xl text-white">Mission</h2>
          <p className="mt-2 text-sm text-white/55">Curate, verify, and deliver exceptional vehicles with forensic transparency.</p>
        </div>
        <div>
          <h2 className="font-display text-xl text-white">Vision</h2>
          <p className="mt-2 text-sm text-white/55">Become the trusted global atelier for collectors who move quietly but decisively.</p>
        </div>
      </section>
    </div>
  );
}
