import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <div className="min-h-screen bg-black pt-24">
        <div className="mx-auto flex max-w-6xl gap-8 px-4 pb-16 md:px-8">
          <aside className="hidden w-48 shrink-0 flex-col gap-2 text-sm text-white/50 md:flex">
            <Link className="text-white" href="/dashboard">
              Overview
            </Link>
            <Link href="/cars">Saved search</Link>
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  );
}
