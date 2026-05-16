"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { BrandTagline } from "@/components/brand/BrandTagline";
import { useAuthStore } from "@/store/auth-store";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const links = [
  { href: "/cars", label: "Collection" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "Heritage" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Concierge" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const reduced = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const [dense, setDense] = React.useState(false);

  React.useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setDense(window.scrollY > 48);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8"
      initial={reduced ? false : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl border px-4 py-3 shadow-dlw-glass backdrop-blur-2xl transition-all duration-500 md:px-6",
          dense
            ? "border-white/12 bg-dlw-charcoal/90 shadow-dlw-red/20"
            : "border-white/[0.08] bg-gradient-to-r from-dlw-metal/80 via-dlw-charcoal/70 to-dlw-metal/80",
        )}
      >
        <BrandLogo size="md" showWordmark />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "relative text-xs uppercase tracking-[0.28em] text-white/55 transition hover:text-white",
                pathname === l.href && "text-white",
              )}
            >
              {l.label}
              {pathname === l.href ? (
                <motion.span layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-px bg-dlw-red shadow-dlw-red" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          <Button variant="ghost" size="sm" asChild>
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

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-3 max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-dlw-charcoal/95 backdrop-blur-xl md:hidden"
          >
            <motion.div className="flex flex-col items-center gap-4 p-6">
              <BrandTagline size="sm" />
              <motion.div className="dlw-divider w-full" />
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="w-full"
                >
                  <Link
                    href={l.href}
                    className={cn("block py-2 text-center text-sm uppercase tracking-[0.25em]", pathname === l.href ? "text-dlw-red" : "text-white/80")}
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <Link href="/login" className="text-sm text-white" onClick={() => setOpen(false)}>
                Sign in
              </Link>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
