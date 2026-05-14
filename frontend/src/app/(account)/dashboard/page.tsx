"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";

/**
 * User garage — bookings, wishlist hooks, profile placeholder.
 */
export default function DashboardPage() {
  const router = useRouter();
  const { user, token, clearSession } = useAuthStore();
  const [bookings, setBookings] = React.useState<{ id: string; status: string; receiptNumber?: string | null; car?: { brand?: string; model?: string } }[]>([]);

  React.useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }
    (async () => {
      try {
        const { data } = await api.get("/bookings/me");
        setBookings(data.data ?? []);
      } catch {
        setBookings([]);
      }
    })();
  }, [token, router]);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white">Garage</h1>
          <p className="text-sm text-white/55">Welcome, {user.name}</p>
        </div>
        <Button variant="ghost" onClick={() => { clearSession(); router.push("/"); }}>
          Sign out
        </Button>
      </div>
      <section className="mt-10">
        <h2 className="text-sm uppercase tracking-[0.3em] text-white/40">Bookings</h2>
        <div className="mt-4 space-y-3">
          {bookings.length === 0 ? <p className="text-sm text-white/45">No reservations yet.</p> : null}
          {bookings.map((b) => (
            <div key={b.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-white/70">
              <p>
                {b.car?.brand} {b.car?.model} — {b.status}
              </p>
              <p className="text-xs text-white/40">{b.receiptNumber}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="mt-8 flex gap-3">
        <Button asChild variant="outline">
          <Link href="/cars">Browse collection</Link>
        </Button>
      </div>
    </div>
  );
}
