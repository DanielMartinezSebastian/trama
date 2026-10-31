import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductWorld from "@/components/producto/ProductWorld";

const versions = ["materia", "ritual", "esencial"] as const;
type Version = typeof versions[number];
const copy: Record<Version, { title: string; description: string }> = {
  materia: { title: "SONDA 01 — materia", description: "Una historia de materiales y sonido espacial, con producto WebGL interactivo." },
  ritual: { title: "SONDA 01 — ritual", description: "Una experiencia WebGL para explorar el altavoz SONDA y comprarlo." },
  esencial: { title: "SONDA 01 — esencial", description: "La página de producto SONDA: fotografía, detalles y compra directa, sin WebGL." },
};
export const dynamicParams = false;
export function generateStaticParams() { return versions.map((version) => ({ version })); }
export async function generateMetadata({ params }: { params: Promise<{ version: string }> }): Promise<Metadata> {
  const { version } = await params;
  if (!versions.includes(version as Version)) return { title: "Producto SONDA" };
  const page = copy[version as Version];
  return { title: page.title, description: page.description };
}
export default async function ProductPage({ params }: { params: Promise<{ version: string }> }) {
  const { version } = await params;
  if (!versions.includes(version as Version)) notFound();
  return <ProductWorld version={version as Version} />;
}
