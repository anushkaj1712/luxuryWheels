"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fadeUp, scaleReveal } from "@/animations/reveal";
import type { BlogPreview } from "@/lib/types/home";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const brands = [
  "Lamborghini",
  "Rolls-Royce",
  "Porsche",
  "Bentley",
  "Ferrari",
  "McLaren",
  "Aston Martin",
  "Mercedes-Maybach",
];

const faq = [
  { q: "Do you ship internationally?", a: "Yes — enclosed transport, customs orchestration, and insurance bundled into a single concierge workflow." },
  { q: "Can I reserve remotely?", a: "Select a token on the vehicle page; Stripe or Razorpay captures payment and issues a digital receipt instantly." },
  { q: "Is every car verified?", a: "Each vehicle passes mechanical inspection, provenance review, and title diligence before listing." },
];

const instagram = [
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=70",
];

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [v, setV] = React.useState(reduced ? to : 0);

  React.useEffect(() => {
    if (reduced || !inView) return;
    let start: number | null = null;
    const dur = 1800;
    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.floor(to * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to, reduced]);

  return (
    <span ref={ref}>
      {v}
      {suffix}
    </span>
  );
}

type Props = {
  blogs: BlogPreview[];
};

export function HomeBelowFold({ blogs }: Props) {
  const [openFaq, setOpenFaq] = React.useState(0);
  const journal = blogs.length
    ? blogs
    : [{ slug: "art-of-specification", title: "The Art of Specification", excerpt: "How we curate bespoke builds." }];

  return (
    <>
      <section className="border-y border-white/[0.06] bg-black/40 py-8" aria-label="Premium brands">
        <div className="relative overflow-hidden">
          <div className="flex w-max animate-dlw-marquee gap-16 pr-16">
            {[...brands, ...brands].map((b, i) => (
              <span key={`${b}-${i}`} className="whitespace-nowrap font-display text-sm uppercase tracking-[0.35em] text-white/35">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-24 md:grid-cols-2 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.75 }}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Why collectors choose us</p>
          <h2 className="mt-4 font-display text-3xl text-white">Precision without theatrics.</h2>
          <ul className="mt-8 space-y-4 text-sm text-white/60">
            <li>— Dedicated acquisition desk across EU, UK, UAE, and APAC.</li>
            <li>— Bespoke finance orchestration with institutional partners.</li>
            <li>— White-glove logistics with enclosed carriers and insurance.</li>
            <li>— Concierge maintenance programs and discreet storage.</li>
          </ul>
        </motion.div>
        <motion.div className="grid grid-cols-2 gap-4">
          {[
            { label: "Vehicles curated", value: 240, suffix: "+" },
            { label: "Concierge NPS", value: 98, suffix: "" },
            { label: "Markets served", value: 18, suffix: "" },
            { label: "Avg. closing days", value: 9, suffix: "" },
          ].map((s) => (
            <motion.div key={s.label} variants={scaleReveal} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <Card className="border-white/10 bg-white/[0.02] p-6 transition duration-500 hover:border-white/20">
                <p className="text-3xl font-semibold text-white md:text-4xl">
                  <CountUp to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/40">{s.label}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="border-t border-white/[0.06] bg-gradient-to-b from-zinc-950/80 to-black px-4 py-24 md:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="font-display text-3xl text-white"
          >
            Trusted by founders & creators
          </motion.h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              { name: "A. Verma", quote: "DLW orchestrated a cross-border acquisition flawlessly — white-glove beyond expectation." },
              { name: "S. Laurent", quote: "The configurator session felt like haute couture for automobiles." },
            ].map((t, i) => (
              <motion.div key={t.name} variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <Card className="border-white/10 bg-black/50 p-8 transition duration-500 hover:border-white/20">
                  <p className="text-lg leading-relaxed text-white/80">“{t.quote}”</p>
                  <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/40">{t.name}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24 md:px-8">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl text-white">Journal</h3>
            <motion.div className="mt-6 space-y-4" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              {journal.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-white/25"
                >
                  <p className="font-medium text-white">{post.title}</p>
                  {post.excerpt ? <p className="mt-1 text-sm text-white/50">{post.excerpt}</p> : null}
                </Link>
              ))}
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <h3 className="font-display text-2xl text-white">Finance atelier</h3>
            <p className="mt-4 text-sm text-white/55">
              Balloon structures, lease-to-own, and cross-border L/C pathways — structured around your liquidity calendar, not ours.
            </p>
            <Button className="mt-6" variant="outline" asChild>
              <Link href="/services">View programs</Link>
            </Button>
          </motion.div>
        </div>

        <div className="mt-20">
          <h3 className="font-display text-2xl text-white">FAQ</h3>
          <div className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10">
            {faq.map((item, i) => (
              <div key={item.q}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-4 text-left text-sm text-white transition hover:bg-white/[0.02]"
                  onClick={() => setOpenFaq(i)}
                  aria-expanded={openFaq === i}
                >
                  {item.q}
                  <span className="text-white/40">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i ? <p className="px-4 pb-4 text-sm text-white/55">{item.a}</p> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <h3 className="font-display text-2xl text-white">Instagram</h3>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {instagram.map((src, i) => (
              <div key={src} className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={src}
                  alt={`Showroom moment ${i + 1}`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  sizes="(max-width:768px) 50vw, 200px"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
