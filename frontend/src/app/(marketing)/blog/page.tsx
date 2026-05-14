import Link from "next/link";

import { getServerApiBaseUrl } from "@/lib/public-env";

const base = () => getServerApiBaseUrl();

type BlogListItem = { slug: string; title: string; excerpt?: string | null };

export default async function BlogPage() {
  let posts: BlogListItem[] = [];
  try {
    const res = await fetch(`${base()}/blogs`, { next: { revalidate: 60 } });
    const json = await res.json();
    posts = json.data ?? [];
  } catch {
    posts = [];
  }
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <h1 className="font-display text-4xl text-white">Journal</h1>
      <div className="mt-10 space-y-4">
        {posts.length === 0 ? <p className="text-white/50">Run the API + seed to publish stories.</p> : null}
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="block rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/25">
            <h2 className="font-display text-xl text-white">{p.title}</h2>
            {p.excerpt ? <p className="mt-2 text-sm text-white/55">{p.excerpt}</p> : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
