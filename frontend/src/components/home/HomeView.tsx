"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { ArrowRight, ChevronDown, Play } from "lucide-react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fadeUp, staggerContainer } from "@/animations/reveal";
import { HeroGraphic } from "@/components/three/HeroGraphic";
import { DEMO_FEATURED_CARS } from "@/lib/demo-data/cars";
import { SITE_TAGLINE } from "@/constants/site";

export type BlogPreview = { slug: string; title: string; excerpt?: string };

export type ApiCar = {
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
};

const brands = ["Lamborghini", "Rolls-Royce", "Porsche", "Bentley", "Ferrari", "McLaren", "Aston Martin", "Mercedes-Maybach"];

const faq = [
  { q: "Do you ship internationally?", a: "Yes — enclosed transport, customs orchestration, and insurance bundled into a single concierge workflow." },
  { q: "Can I reserve remotely?", a: "Select a token on the vehicle page; Stripe or Razorpay captures payment and issues a digital receipt instantly." },
  { q: "Is every car verified?", a: "Each vehicle passes mechanical inspection, provenance review, and title diligence before listing." },
];

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [v, setV] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const dur = 2200;
    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.floor(to * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to]);
  return (
    <span ref={ref}>
      {v}
      {suffix}
    </span>
  );
}

/**
 * HomeView — composes cinematic hero, carousels, marquees, stats, FAQ, and finance rails.
 * Data: tries live API, gracefully falls back to curated placeholders for demos without DB.
 */
export default function HomeView() {
  const heroLine = React.useRef<HTMLHeadingElement>(null);
  const [featured, setFeatured] = React.useState<ApiCar[]>([]);
  const [blogs, setBlogs] = React.useState<BlogPreview[]>([]);
  const [openFaq, setOpenFaq] = React.useState(0);

  React.useLayoutEffect(() => {
    if (!heroLine.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroLine.current,
        { opacity: 0, y: 48, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.35, ease: "power3.out" },
      );
    });
    return () => ctx.revert();
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [f, b] = await Promise.all([api.get("/cars/featured"), api.get("/blogs")]);
        if (!cancelled) {
          setFeatured(f.data.data ?? []);
          setBlogs((b.data.data ?? []).slice(0, 3));
        }
      } catch {
        if (!cancelled) {
          setFeatured(DEMO_FEATURED_CARS);
          setBlogs([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* ---------- HERO ---------- */}
      <section className="relative min-h-[100svh] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-55"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80"
          aria-hidden
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-sports-car-racing-in-a-highway-at-night-39873-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/70 to-black" />
        <HeroGraphic />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col justify-end px-4 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={0} className="text-xs uppercase tracking-[0.45em] text-white/50">
            Atelier digital
          </motion.p>
          <h1
            ref={heroLine}
            className="mt-4 max-w-4xl font-display text-[clamp(2.4rem,6vw,4.6rem)] font-semibold leading-[1.05] tracking-tight text-white"
          >
            Velocity, distilled into silence.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">{SITE_TAGLINE}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/cars">
                Explore collection <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/contact">
                <Play className="h-4 w-4" />
                Private briefing
              </Link>
            </Button>
          </div>
          <div className="mt-16 flex max-w-xl flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl md:flex-row md:items-center">
            <Input placeholder="Search marque, model, VIN…" className="border-white/10 bg-black/40" aria-label="Search luxury cars" />
            <Button className="shrink-0" asChild>
              <Link href="/cars">Search</Link>
            </Button>
          </div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/40"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          aria-hidden
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </section>

      {/* ---------- FEATURED ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-24 md:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-20%" }} className="mb-12">
          <motion.p variants={fadeUp} custom={0} className="text-xs uppercase tracking-[0.4em] text-white/40">
            Signature inventory
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="mt-3 font-display text-3xl text-white md:text-4xl">
            Featured arrivals
          </motion.h2>
        </motion.div>
        <Swiper modules={[Pagination, Autoplay]} pagination={{ clickable: true }} autoplay={{ delay: 4800 }} spaceBetween={18} slidesPerView={1.1} breakpoints={{ 768: { slidesPerView: 2.05 }, 1024: { slidesPerView: 3 } }}>
          {(featured.length ? featured : DEMO_FEATURED_CARS).map((car) => (
            <SwiperSlide key={car.id}>
              <Link href={`/cars/${car.slug}`} className="group block h-full">
                <Card className="h-full overflow-hidden border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent p-0 transition duration-500 group-hover:-translate-y-1 group-hover:border-white/25">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {car.thumbnail ? (
                      <Image src={car.thumbnail} alt={`${car.brand} ${car.model}`} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
                    ) : (
                      <div className="h-full w-full bg-zinc-800" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">{car.brand}</p>
                        <p className="font-display text-lg text-white">
                          {car.model} · {car.year}
                        </p>
                      </div>
                      <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs text-white/90">
                        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(car.price)}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-xs text-white/45">
                      {car.mileage.toLocaleString()} km · {car.fuel} · {car.transmission}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ---------- BRANDS MARQUEE ---------- */}
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

      {/* ---------- WHY + STATS ---------- */}
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-24 md:grid-cols-2 md:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Why collectors choose us</p>
          <h2 className="mt-4 font-display text-3xl text-white">Precision without theatrics.</h2>
          <ul className="mt-8 space-y-4 text-sm text-white/60">
            <li>— Dedicated acquisition desk across EU, UK, UAE, and APAC.</li>
            <li>— Bespoke finance orchestration with institutional partners.</li>
            <li>— White-glove logistics with enclosed carriers and insurance.</li>
            <li>— Concierge maintenance programs and discreet storage.</li>
          </ul>
        </motion.div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Vehicles curated", value: 240, suffix: "+" },
            { label: "Concierge NPS", value: 98, suffix: "" },
            { label: "Markets served", value: 18, suffix: "" },
            { label: "Avg. closing days", value: 9, suffix: "" },
          ].map((s) => (
            <Card key={s.label} className="border-white/10 bg-white/[0.02] p-6">
              <p className="text-3xl font-semibold text-white md:text-4xl">
                <CountUp to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/40">{s.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section className="border-t border-white/[0.06] bg-gradient-to-b from-zinc-950/80 to-black px-4 py-24 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl text-white">Trusted by founders & creators</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              { name: "A. Verma", quote: "DLW orchestrated a cross-border acquisition flawlessly — white-glove beyond expectation." },
              { name: "S. Laurent", quote: "The configurator session felt like haute couture for automobiles." },
            ].map((t) => (
              <Card key={t.name} className="border-white/10 bg-black/50 p-8">
                <p className="text-lg leading-relaxed text-white/80">“{t.quote}”</p>
                <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/40">{t.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- BLOG + FINANCE + FAQ + INSTAGRAM ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-24 md:px-8">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl text-white">Journal</h3>
            <div className="mt-6 space-y-4">
              {(blogs.length
                ? blogs
                : [{ slug: "art-of-specification", title: "The Art of Specification", excerpt: "How we curate bespoke builds." }]
              ).map((post: BlogPreview) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/25">
                  <p className="font-medium text-white">{post.title}</p>
                  {post.excerpt ? <p className="mt-1 text-sm text-white/50">{post.excerpt}</p> : null}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-display text-2xl text-white">Finance atelier</h3>
            <p className="mt-4 text-sm text-white/55">
              Balloon structures, lease-to-own, and cross-border L/C pathways — structured around your liquidity calendar, not ours.
            </p>
            <Button className="mt-6" variant="outline" asChild>
              <Link href="/services">View programs</Link>
            </Button>
          </div>
        </div>

        <div className="mt-20">
          <h3 className="font-display text-2xl text-white">FAQ</h3>
          <div className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10">
            {faq.map((item, i) => (
              <div key={item.q}>
                <button type="button" className="flex w-full items-center justify-between px-4 py-4 text-left text-sm text-white" onClick={() => setOpenFaq(i)} aria-expanded={openFaq === i}>
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
            {[
              "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=600&q=70",
              "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=70",
              "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=70",
              "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=70",
            ].map((src, i) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-2xl border border-white/10">
                <Image src={src} alt={`Showroom moment ${i + 1}`} fill className="object-cover transition hover:scale-105" sizes="200px" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
