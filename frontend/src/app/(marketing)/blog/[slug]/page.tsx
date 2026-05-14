import { notFound } from "next/navigation";

import { getServerApiBaseUrl } from "@/lib/public-env";

const base = () => getServerApiBaseUrl();

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await fetch(`${base()}/blogs/${slug}`, { next: { revalidate: 120 } }).catch(() => null);
  if (!res?.ok) notFound();
  const json = await res.json();
  const { post } = json.data;
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <h1 className="font-display text-4xl text-white">{post.title}</h1>
      <div className="prose prose-invert mt-8 max-w-none text-white/75" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}
