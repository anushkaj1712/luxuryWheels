import Image from "next/image";
import Link from "next/link";
import type { InstagramPost } from "@/lib/instagram";

/** Instagram grid — server-rendered; swap data via `getInstagramFeed()`. */
export function InstagramFeed({ posts }: { posts: InstagramPost[] }) {
  return (
    <div className="mt-20">
      <h3 className="font-display text-2xl text-white">Instagram</h3>
      <p className="mt-2 text-xs text-white/40">Latest from the atelier — connect API credentials for live posts.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {posts.map((post, i) => (
          <Link
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10"
          >
            <Image
              src={post.mediaUrl}
              alt={post.caption ?? `Showroom moment ${i + 1}`}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.04]"
              sizes="(max-width:768px) 50vw, 200px"
              loading="lazy"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
