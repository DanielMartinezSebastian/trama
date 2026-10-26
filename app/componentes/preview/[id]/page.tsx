import type { Metadata } from "next";
import CatalogPreviewPage from "@/components/playground/CatalogPreviewPage";

export const metadata: Metadata = { title: "Vista previa · Trama", robots: { index: false, follow: false } };

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CatalogPreviewPage id={id} />;
}
