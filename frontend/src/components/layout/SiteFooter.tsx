import Link from "next/link";
import { Share2, Video, Link as LinkIcon } from "lucide-react";
import { SITE_NAME, SITE_TAGLINE } from "@/constants/site";

/**
 * Multi-column luxury footer — semantic landmarks for accessibility.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-gradient-to-b from-black to-zinc-950 px-4 py-16 md:px-8" role="contentinfo">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-4">
        <div>
          <p className="font-display text-lg tracking-[0.2em] text-white">{SITE_NAME}</p>
          <p className="mt-3 max-w-xs text-sm text-white/50">{SITE_TAGLINE}</p>
        </div>
        <nav aria-label="Explore">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <Link className="hover:text-white" href="/cars">
                Collection
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/services">
                Services
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/blog">
                Journal
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Concierge</p>
          <p className="mt-4 text-sm text-white/70">+91 90000 00000</p>
          <p className="text-sm text-white/70">concierge@drive-luxury.demo</p>
          <p className="mt-2 text-xs text-white/40">Mon–Sat · 10:00–20:00 IST</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Social</p>
          <div className="mt-4 flex gap-3 text-white/60">
            <a href="https://instagram.com" aria-label="Instagram" className="rounded-full border border-white/10 p-2 hover:text-white">
              <Share2 className="h-4 w-4" />
            </a>
            <a href="https://youtube.com" aria-label="YouTube" className="rounded-full border border-white/10 p-2 hover:text-white">
              <Video className="h-4 w-4" />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="rounded-full border border-white/10 p-2 hover:text-white">
              <LinkIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl text-center text-xs text-white/30">
        © {new Date().getFullYear()} {SITE_NAME}. Crafted for collectors — specifications subject to availability.
      </p>
    </footer>
  );
}
