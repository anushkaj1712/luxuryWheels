"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/constants/site";
import { useAuthStore } from "@/store/auth-store";

const links = [
  { href: "/cars", label: "Collection" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "Heritage" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Concierge" },
];

/**
 * Floating glass navigation — scroll-densifies background for cinematic contrast.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = React.useState(false);
  const [dense, setDense] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setDense(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/[0.08] px-4 py-3 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-colors duration-500 md:px-6",
          dense ? "bg-black/75" : "bg-black/40",
        )}
      >
        <Link href="/" className="group flex items-center gap-2" aria-label={`${SITE_NAME} home`}>
          <span className="font-display text-lg tracking-[0.22em] text-white md:text-xl">{SITE_NAME}</span>
          <span className="hidden h-px w-8 origin-left scale-x-0 bg-gradient-to-r from-white/0 via-white/70 to-white/0 transition group-hover:scale-x-100 md:block" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-xs uppercase tracking-[0.28em] text-white/55 transition hover:text-white",
                pathname === l.href && "text-white",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cars">Configure</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={user ? "/dashboard" : "/login"}>{user ? "Garage" : "Sign in"}</Link>
          </Button>
        </div>

        <button
          type="button"
          className="rounded-full border border-white/15 p-2 text-white md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-3 max-w-6xl rounded-2xl border border-white/10 bg-black/80 p-4 md:hidden"
        >
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-white/80" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link href="/login" className="text-sm text-white" onClick={() => setOpen(false)}>
              Sign in
            </Link>
          </div>
        </motion.div>
      ) : null}
    </motion.header>
  );
}
