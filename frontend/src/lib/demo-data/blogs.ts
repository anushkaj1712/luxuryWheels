/**
 * Demo editorial content — mirrors `GET /api/blogs` and single-post payloads.
 */

export type DemoBlogListItem = { slug: string; title: string; excerpt?: string | null };

export const DEMO_BLOG_LIST: DemoBlogListItem[] = [
  {
    slug: "the-quiet-revolution-of-ev-grand-touring",
    title: "The quiet revolution of EV grand touring",
    excerpt: "How silence became the ultimate luxury signal on the road.",
  },
  {
    slug: "atelier-spec-financing-without-friction",
    title: "Atelier-spec financing without friction",
    excerpt: "Token reservations, escrow, and white-glove titling in one motion.",
  },
];

export function getDemoBlogPost(slug: string): { post: { title: string; contentHtml: string } } | null {
  const hit = DEMO_BLOG_LIST.find((b) => b.slug === slug);
  if (!hit) return null;
  return {
    post: {
      title: hit.title,
      contentHtml: `<p>${hit.excerpt ?? "Curated essay — wire your CMS or Prisma blog model to replace this demo body."}</p>`,
    },
  };
}
