"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/services/api";

/** Admin cockpit — analytics + tables (requires SUPER_ADMIN / ADMIN JWT). */
export default function AdminPage() {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const [analytics, setAnalytics] = React.useState<{ cars: number; bookings: number; users: number; revenueTotal: number } | null>(null);

  React.useEffect(() => {
    if (!token || (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN")) {
      router.replace("/");
      return;
    }
    (async () => {
      try {
        const { data } = await api.get("/admin/analytics");
        setAnalytics(data.data);
      } catch {
        setAnalytics(null);
      }
    })();
  }, [token, user, router]);

  const chart = analytics
    ? [
        { name: "Cars", v: analytics.cars },
        { name: "Bookings", v: analytics.bookings },
        { name: "Users", v: analytics.users },
      ]
    : [];

  return (
    <div className="min-h-screen bg-black px-4 py-24 text-white md:px-8">
      <h1 className="font-display text-3xl">Command</h1>
      <p className="text-sm text-white/50">Revenue (succeeded payments): ₹{analytics?.revenueTotal?.toLocaleString?.() ?? "—"}</p>
      <div className="mt-8 min-h-[240px] w-full max-w-3xl rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chart}>
            <XAxis dataKey="name" stroke="#71717a" />
            <Tooltip contentStyle={{ background: "#09090b", border: "1px solid #27272a" }} />
            <Bar dataKey="v" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fafafa" />
                <stop offset="100%" stopColor="#52525b" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
