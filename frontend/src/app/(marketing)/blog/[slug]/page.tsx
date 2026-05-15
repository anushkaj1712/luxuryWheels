import { notFound } from "next/navigation";
import { getDemoBlogPost } from "@/lib/demo-data/blogs";
import { fetchApiOrDemo } from "@/lib/server-fetch";

type BlogPayload = { post: { title: string; contentHtml: string } };

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const json = await fetchApiOrDemo<BlogPayload>(
    `/blogs/${slug}`,
    { next: { revalidate: 120 } },
    () => {
      const demo = getDemoBlogPost(slug);
      return { data: demo ?? undefined };
    },
  );
  const payload = json.data;
  if (!payload) notFound();
  const { post } = payload;
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <h1 className="font-display text-4xl text-white">{post.title}</h1>
      <div className="prose prose-invert mt-8 max-w-none text-white/75" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}
