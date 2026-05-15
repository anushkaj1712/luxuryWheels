import HomeView from "@/components/home/HomeView";
import { getHomePageData } from "@/lib/home-data";
import { getInstagramFeed } from "@/lib/instagram";

export default async function HomePage() {
  const [{ featured, blogs }, instagram] = await Promise.all([getHomePageData(), getInstagramFeed(4)]);
  return <HomeView featured={featured} blogs={blogs} instagram={instagram} />;
}
