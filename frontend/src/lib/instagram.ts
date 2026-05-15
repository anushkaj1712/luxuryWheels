/**
 * Instagram feed adapter — swap demo for Graph API when credentials are set.
 *
 * Env (future):
 * - INSTAGRAM_ACCESS_TOKEN
 * - INSTAGRAM_USER_ID
 */

export type InstagramPost = {
  id: string;
  permalink: string;
  mediaUrl: string;
  caption?: string;
};

const DEMO_POSTS: InstagramPost[] = [
  {
    id: "demo-1",
    permalink: "https://instagram.com/",
    mediaUrl: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=600&q=70",
    caption: "Night drive — STO delivery",
  },
  {
    id: "demo-2",
    permalink: "https://instagram.com/",
    mediaUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=70",
    caption: "Phantom atelier handover",
  },
  {
    id: "demo-3",
    permalink: "https://instagram.com/",
    mediaUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=70",
    caption: "Track-spec morning",
  },
  {
    id: "demo-4",
    permalink: "https://instagram.com/",
    mediaUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=70",
    caption: "Showroom light study",
  },
];

async function fetchInstagramGraph(limit = 4): Promise<InstagramPost[] | null> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  if (!token || !userId) return null;

  const url = `https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&limit=${limit}&access_token=${token}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const json = (await res.json()) as { data?: { id: string; caption?: string; media_url?: string; permalink?: string }[] };
  const posts = (json.data ?? [])
    .filter((p) => p.media_url && p.permalink)
    .map((p) => ({
      id: p.id,
      permalink: p.permalink!,
      mediaUrl: p.media_url!,
      caption: p.caption,
    }));
  return posts.length ? posts.slice(0, limit) : null;
}

/** Returns live posts when configured; otherwise curated demo tiles. */
export async function getInstagramFeed(limit = 4): Promise<InstagramPost[]> {
  try {
    const live = await fetchInstagramGraph(limit);
    if (live?.length) return live;
  } catch {
    /* fall through to demo */
  }
  return DEMO_POSTS.slice(0, limit);
}
