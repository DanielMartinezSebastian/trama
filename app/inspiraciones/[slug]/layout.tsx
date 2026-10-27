import { notFound } from "next/navigation";
import { InspiracionShell } from "@/components/inspiraciones/Cargador";
import { replica } from "@/components/inspiraciones/registro";

/** Marco de cada inspiración: persiste entre sus páginas (cabecera, menú, carrito o reserva no se reinician al navegar). */
export default async function InspiracionLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!replica(slug)) notFound();
  return <InspiracionShell slug={slug}>{children}</InspiracionShell>;
}
