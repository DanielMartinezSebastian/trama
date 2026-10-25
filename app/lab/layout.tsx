import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

/*
 * El laboratorio (/lab: bancos de cine, panel de rondas, archivos de las capturas) solo existe en local: en producción
 * cada ruta da 404. Las capturas viven en `.refs3d`, que no se versiona ni se despliega.
 */

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function LabLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === "production") notFound();
  return children;
}
