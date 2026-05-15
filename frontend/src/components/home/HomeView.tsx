"use client";

import dynamic from "next/dynamic";
import type { ApiCar, BlogPreview } from "@/lib/types/home";
import { HomeHero } from "@/components/home/HomeHero";

const FeaturedCarousel = dynamic(
  () => import("@/components/home/FeaturedCarousel").then((m) => m.FeaturedCarousel),
  { loading: () => null },
);

const HomeBelowFold = dynamic(
  () => import("@/components/home/HomeBelowFold").then((m) => m.HomeBelowFold),
  { loading: () => null },
);

export type { ApiCar, BlogPreview };

type Props = {
  featured: ApiCar[];
  blogs: BlogPreview[];
};

/** Homepage shell — hero first paint, below-fold chunks code-split. */
export default function HomeView({ featured, blogs }: Props) {
  return (
    <div className="overflow-x-hidden">
      <HomeHero />
      <FeaturedCarousel cars={featured} />
      <HomeBelowFold blogs={blogs} />
    </div>
  );
}
