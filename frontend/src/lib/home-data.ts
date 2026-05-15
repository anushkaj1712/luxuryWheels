import { fetchApiOrDemo } from "@/lib/server-fetch";
import { DEMO_FEATURED_CARS } from "@/lib/demo-data/cars";
import { DEMO_BLOG_LIST } from "@/lib/demo-data/blogs";
import type { ApiCar, BlogPreview } from "@/lib/types/home";

export async function getHomePageData(): Promise<{ featured: ApiCar[]; blogs: BlogPreview[] }> {
  const [featuredRes, blogsRes] = await Promise.all([
    fetchApiOrDemo<ApiCar[]>("/cars/featured", { next: { revalidate: 120 } }, () => ({
      success: true,
      data: DEMO_FEATURED_CARS,
    })),
    fetchApiOrDemo<BlogPreview[]>("/blogs", { next: { revalidate: 300 } }, () => ({
      success: true,
      data: DEMO_BLOG_LIST.map((b) => ({
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt ?? undefined,
      })),
    })),
  ]);

  const blogs =
    blogsRes.data?.map((b) => ({ slug: b.slug, title: b.title, excerpt: b.excerpt ?? undefined })) ??
    DEMO_BLOG_LIST.map((b) => ({ slug: b.slug, title: b.title, excerpt: b.excerpt ?? undefined }));

  return {
    featured: featuredRes.data ?? DEMO_FEATURED_CARS,
    blogs: blogs.slice(0, 3),
  };
}
