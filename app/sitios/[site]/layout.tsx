import { notFound } from "next/navigation";
import { SiteShell } from "@/components/sites/SiteRouter";
import { getSite } from "@/lib/sites";

/** Marco de cada web completa: persiste entre sus páginas (carrito, chat y barra no se reinician al navegar). */
export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ site: string }> }) {
  const { site } = await params;
  if (!getSite(site)) notFound();
  return <SiteShell site={site}>{children}</SiteShell>;
}
