import HomeView from "@/components/home/HomeView";
import { getHomePageData } from "@/lib/home-data";

export default async function HomePage() {
  const { featured, blogs } = await getHomePageData();
  return <HomeView featured={featured} blogs={blogs} />;
}
