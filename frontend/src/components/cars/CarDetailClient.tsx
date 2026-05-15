"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { toast } from "sonner";
import { api } from "@/services/api";
import { DEMO_WHATSAPP_URL } from "@/constants/site";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { useCompareStore } from "@/store/compare-store";
import { useRecentStore } from "@/store/recent-store";
import type { ApiCar } from "@/lib/types/home";
import { SafeImage } from "@/components/media/SafeImage";
import { resolveCarImageUrl } from "@/lib/image-utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type CarDetail = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  description: string;
  features: string[];
  brochureUrl?: string | null;
  videoUrl?: string | null;
  model3dUrl?: string | null;
  horsepower?: number | null;
  torqueNm?: number | null;
  engine?: string | null;
  locationCity?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
  images?: { id: string; url: string; alt?: string | null; is360: boolean }[];
  similar?: ApiCar[];
  ratingAvg?: number | null;
};

function emi(principal: number, annualRate: number, months: number) {
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

/**
 * Car detail experience — gallery, EMI, compare, wishlist, reservation + demo payment confirm.
 */
export default function CarDetailClient({ initial }: { initial: CarDetail }) {
  const token = useAuthStore((s) => s.token);
  const addCompare = useCompareStore((s) => s.add);
  const removeCompare = useCompareStore((s) => s.remove);
  const inCompare = useCompareStore((s) => s.has);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const galleryY = useTransform(scrollY, [0, 400], [0, reduced ? 0 : -28]);
  const pushRecent = useRecentStore((s) => s.push);
  const searchParams = useSearchParams();
  const gallery =
    initial.images?.length && initial.images.length > 0
      ? initial.images
      : [{ id: "ph", url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80", alt: initial.model, is360: false }];
  const [rate, setRate] = React.useState(8.5);
  const [tenure, setTenure] = React.useState(60);
  const [down, setDown] = React.useState(Math.round(initial.price * 0.2));
  const [provider, setProvider] = React.useState<"STRIPE" | "RAZORPAY">("RAZORPAY");
  const [tokenAmt, setTokenAmt] = React.useState(50000);

  React.useEffect(() => {
    pushRecent({
      id: initial.id,
      slug: initial.slug,
      title: `${initial.brand} ${initial.model}`,
      thumb: initial.images?.[0]?.url,
      price: initial.price,
    });
  }, [initial, pushRecent]);

  React.useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref === "voice") toast.message("Voice search landed you here — configure NLP routing on the API.");
  }, [searchParams]);

  const financed = Math.max(initial.price - down, 0);
  const monthly = emi(financed, rate, tenure);

  const [reserveSuccessOpen, setReserveSuccessOpen] = React.useState(false);

  const onWishlist = async () => {
    if (!token) return toast.error("Sign in to save");
    try {
      await api.post("/wishlist", { carId: initial.id });
      toast.success("Saved to wishlist");
    } catch {
      toast.error("Could not save");
    }
  };

  const onReserve = async () => {
    if (!token) return toast.error("Sign in to reserve");
    try {
      const { data } = await api.post("/bookings", {
        carId: initial.id,
        tokenAmount: tokenAmt,
        currency: "INR",
        provider,
      });
      toast.success("Reservation secured");
      setReserveSuccessOpen(true);
      try {
        const raw = window.localStorage.getItem("dlw-demo-reservations");
        const arr = (raw ? JSON.parse(raw) : []) as unknown[];
        arr.push({
          slug: initial.slug,
          brand: initial.brand,
          model: initial.model,
          tokenAmt,
          provider,
          at: Date.now(),
        });
        window.localStorage.setItem("dlw-demo-reservations", JSON.stringify(arr.slice(-12)));
      } catch {
        /* ignore quota / private mode */
      }
      const gateway = data.data?.gateway as { mode?: string } | undefined;
      const paymentId = data.data?.paymentId as string | undefined;
      if (gateway?.mode === "demo" && paymentId) {
        try {
          await api.post("/bookings/demo-confirm", { paymentId });
          toast.success("Demo payment recorded");
        } catch {
          /* production API may block demo-confirm — demo Axios layer still succeeds offline */
        }
      }
    } catch {
      toast.error("Reservation failed");
    }
  };

  const lat = initial.locationLat ?? 28.6139;
  const lng = initial.locationLng ?? 77.209;

  const toggleCompare = () => {
    if (inCompare(initial.id)) {
      removeCompare(initial.id);
      toast.message("Removed from compare");
      return;
    }
    addCompare({
      id: initial.id,
      slug: initial.slug,
      brand: initial.brand,
      model: initial.model,
      year: initial.year,
      price: initial.price,
      mileage: initial.mileage,
      fuel: initial.fuel,
      transmission: initial.transmission,
      thumbnail: initial.images?.[0]?.url ?? null,
      horsepower: initial.horsepower ?? null,
      features: initial.features,
    });
    toast.success("Added to compare");
  };

  return (
    <>
    <motion.div
      className="mx-auto max-w-6xl px-4 py-10 md:px-8"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <motion.div style={{ y: galleryY }}>
          <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} className="overflow-hidden rounded-3xl border border-white/10">
            {gallery.map((img, i) => (
              <SwiperSlide key={img.id}>
                <div className="relative aspect-[16/10] bg-zinc-900">
                  <SafeImage src={resolveCarImageUrl(img.url)} alt={img.alt ?? initial.model} fill className="object-cover" sizes="(max-width:1024px) 100vw, 60vw" priority={i === 0} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          </motion.div>
          <p className="mt-3 text-xs text-white/45">360° viewer: flag `is360` on `CarImage` rows for frame sequences; GLB path via `model3dUrl` for R3F orbit.</p>
          {initial.videoUrl ? (
            <video className="mt-6 w-full rounded-2xl border border-white/10" controls src={initial.videoUrl} poster={initial.images?.[0]?.url ?? undefined} />
          ) : null}
          <motion.div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="font-display text-lg text-white">The story</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/60">{initial.description}</p>
            {initial.features?.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {initial.features.map((f) => (
                  <li key={f} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55">
                    {f}
                  </li>
                ))}
              </ul>
            ) : null}
          </motion.div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card className="border-white/10 bg-white/[0.02]">
              <CardContent className="p-6">
                <h3 className="font-display text-lg text-white">Specifications</h3>
                <dl className="mt-4 space-y-2 text-sm text-white/60">
                  <div className="flex justify-between">
                    <dt>Year</dt>
                    <dd>{initial.year}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Mileage</dt>
                    <dd>{initial.mileage.toLocaleString()} km</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Fuel</dt>
                    <dd>{initial.fuel}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Transmission</dt>
                    <dd>{initial.transmission}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/[0.02]">
              <CardContent className="p-6">
                <h3 className="font-display text-lg text-white">EMI atelier</h3>
                <div className="mt-4 space-y-3 text-sm">
                  <label className="flex items-center justify-between text-white/55">
                    Down payment (₹)
                    <Input type="number" value={down} onChange={(e) => setDown(Number(e.target.value))} className="ml-3 max-w-[140px]" />
                  </label>
                  <label className="flex items-center justify-between text-white/55">
                    Rate % p.a.
                    <Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="ml-3 max-w-[100px]" />
                  </label>
                  <label className="flex items-center justify-between text-white/55">
                    Tenure (months)
                    <Input type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="ml-3 max-w-[100px]" />
                  </label>
                  <p className="pt-2 text-lg text-white">
                    From{" "}
                    <span className="font-semibold">
                      {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(monthly)}
                    </span>
                    <span className="text-sm text-white/45"> / mo · indicative</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-10">
            <h3 className="font-display text-lg text-white">Location</h3>
            <p className="text-sm text-white/55">{initial.locationCity ?? "Boutique showroom — by appointment."}</p>
            <div className="mt-4 aspect-video overflow-hidden rounded-2xl border border-white/10">
              <iframe title="Map" className="h-full w-full" src={`https://www.google.com/maps?q=${lat},${lng}&z=12&output=embed`} loading="lazy" />
            </div>
          </div>
          <div className="mt-10 rounded-2xl border border-dashed border-white/15 p-6 text-sm text-white/55">
            <strong className="text-white">AR preview</strong> — host a USDZ/GLB and open via iOS Quick Look or model-viewer; structure is ready via `model3dUrl`.
          </div>
        </div>

        <motion.aside initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="lg:sticky lg:top-28 h-max space-y-4">
          <Card className="border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">{initial.brand}</p>
            <h1 className="mt-2 font-display text-3xl text-white">
              {initial.model} · {initial.year}
            </h1>
            <p className="mt-4 text-3xl font-semibold text-white">
              {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(initial.price)}
            </p>
            {initial.ratingAvg != null ? <p className="mt-2 text-sm text-amber-200/90">★ {initial.ratingAvg.toFixed(1)} collector rating</p> : null}
            <div className="mt-6 space-y-3">
              <label className="text-xs uppercase tracking-widest text-white/45">Token amount</label>
              <div className="flex gap-2">
                {[25000, 50000, 100000].map((a) => (
                  <Button key={a} type="button" variant={tokenAmt === a ? "default" : "ghost"} size="sm" onClick={() => setTokenAmt(a)}>
                    ₹{(a / 1000).toFixed(0)}k
                  </Button>
                ))}
              </div>
              <label className="text-xs uppercase tracking-widest text-white/45">Gateway</label>
              <div className="flex gap-2">
                <Button type="button" variant={provider === "RAZORPAY" ? "default" : "ghost"} size="sm" onClick={() => setProvider("RAZORPAY")}>
                  Razorpay
                </Button>
                <Button type="button" variant={provider === "STRIPE" ? "default" : "ghost"} size="sm" onClick={() => setProvider("STRIPE")}>
                  Stripe
                </Button>
              </div>
              <Button className="w-full" onClick={onReserve}>
                Reserve now
              </Button>
              <Button variant="outline" className="w-full" onClick={onWishlist}>
                Save to wishlist
              </Button>
              <Button variant="ghost" className="w-full" onClick={toggleCompare}>
                {inCompare(initial.id) ? "Remove from compare" : "Add to compare"}
              </Button>
              <Button variant="ghost" className="w-full" asChild>
                <a href={buildWhatsAppHref(DEMO_WHATSAPP_URL, `Inquiry: ${initial.brand} ${initial.model}`)}>
                  WhatsApp dealer
                </a>
              </Button>
              {initial.brochureUrl ? (
                <Button variant="ghost" className="w-full" asChild>
                  <a href={initial.brochureUrl} download>
                    Download brochure
                  </a>
                </Button>
              ) : null}
            </div>
          </Card>
        </motion.aside>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl text-white">Similar vehicles</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(initial.similar ?? []).map((c: ApiCar, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link href={`/cars/${c.slug}`} className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition duration-300 hover:border-white/30">
                <div className="relative aspect-[16/10]">
                  <SafeImage src={resolveCarImageUrl(c.thumbnail)} alt={`${c.brand} ${c.model}`} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" sizes="25vw" />
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-widest text-white/40">{c.brand}</p>
                  <p className="font-medium text-white">{c.model} · {c.year}</p>
                  <p className="mt-2 text-sm text-white/55">
                    {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(c.price)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>

    <AnimatePresence>
      {reserveSuccessOpen ? (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            className="max-w-md rounded-3xl border border-amber-400/25 bg-gradient-to-b from-zinc-900 to-black p-8 text-center shadow-[0_0_60px_rgba(251,191,36,0.12)]"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">Reservation</p>
            <h3 className="mt-3 font-display text-2xl text-white">Your token is reserved</h3>
            <p className="mt-3 text-sm text-white/55">
              {initial.brand} {initial.model} · {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(tokenAmt)} token
            </p>
            <p className="mt-4 text-xs text-white/40">
              Showcase mode: connect Render + payment keys to capture live settlements. A copy was saved locally for your review.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild className="rounded-full">
                <a
                  href={buildWhatsAppHref(DEMO_WHATSAPP_URL, `Priority inquiry — ${initial.brand} ${initial.model} (${initial.slug})`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp concierge
                </a>
              </Button>
              <Button type="button" variant="outline" className="rounded-full" onClick={() => setReserveSuccessOpen(false)}>
                Continue browsing
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
    </>
  );
}
