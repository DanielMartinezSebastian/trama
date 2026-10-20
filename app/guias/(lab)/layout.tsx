import SiteChrome from "@/components/site/SiteChrome";
import FontshareLink from "@/components/site/guias/FontshareLink";
import "@/components/site/guias/guias.css";

export default function GuiasLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteChrome>
      <FontshareLink />
      {children}
    </SiteChrome>
  );
}
