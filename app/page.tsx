import HomePage from "@/components/site/HomePage";
import SiteChrome from "@/components/site/SiteChrome";
import { homeData } from "@/lib/site-data";

export default function Home() {
  return (
    <SiteChrome>
      <HomePage data={homeData()} />
    </SiteChrome>
  );
}
