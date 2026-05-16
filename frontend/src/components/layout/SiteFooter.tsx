import Link from "next/link";
import { Share2, Video, Link as LinkIcon } from "lucide-react";
import { SITE_NAME } from "@/constants/site";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { BrandTagline } from "@/components/brand/BrandTagline";

/** Multi-column luxury footer — logo, animated tagline, chrome dividers. */
export function SiteFooter() {
  return (
    <footer
      className="relative border-t border-white/[0.08] bg-gradient-to-b from-dlw-metal/50 via-dlw-charcoal to-black px-4 py-16 md:px-8"
      role="contentinfo"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,0,0,0.06),transparent_50%)]" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <BrandLogo href="/" size="md" />
          <div className="mt-6">
            <BrandTagline size="sm" align="left" />
          </div>
          <p className="mt-4 max-w-xs text-sm text-white/45">
            Curated supercars, bespoke financing, and white-glove delivery for collectors worldwide.
          </p>
        </div>
        <nav aria-label="Explore">
          <p className="text-xs uppercase tracking-[0.3em] text-dlw-red">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <Link className="transition hover:text-white" href="/cars">
                Collection
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-white" href="/services">
                Services
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-white" href="/blog">
                Journal
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-white" href="/compare">
                Compare
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-dlw-red">Concierge</p>
          <p className="mt-4 text-sm text-white/70">+91 90000 00000</p>
          <p className="text-sm text-white/70">concierge@drive-luxury.demo</p>
          <p className="mt-2 text-xs text-white/40">Mon–Sat · 10:00–20:00 IST</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-dlw-red">Social</p>
          <div className="mt-4 flex gap-3 text-white/60">
            <a href="https://instagram.com" aria-label="Instagram" className="rounded-full border border-white/10 p-2 transition hover:border-dlw-red/40 hover:text-white hover:shadow-dlw-red">
              <Share2 className="h-4 w-4" />
            </a>
            <a href="https://youtube.com" aria-label="YouTube" className="rounded-full border border-white/10 p-2 transition hover:border-dlw-red/40 hover:text-white">
              <Video className="h-4 w-4" />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="rounded-full border border-white/10 p-2 transition hover:border-dlw-red/40 hover:text-white">
              <LinkIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="dlw-divider mx-auto mt-12 max-w-4xl" />
      <p className="relative mx-auto mt-8 max-w-6xl text-center text-xs text-white/30">
        © {new Date().getFullYear()} {SITE_NAME}. Crafted for collectors — specifications subject to availability.
      </p>
    </footer>
  );
}
