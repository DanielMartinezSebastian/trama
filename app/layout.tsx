import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/site-url";
import { fontVariables } from "@/lib/ui/fonts";
import "./globals.css";
import "./landings.css";
// El kit va después del CSS del sitio, en el mismo orden que antes de moverlo a components/ui/styles/.
import "@/components/ui/styles/kit.css";

const DESCRIPTION = "Librería de componentes ASCII, textmode, pixel art y secciones de landing para Next.js: catálogo interactivo, documentación, demos y webs de referencia.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Trama",
  description: DESCRIPTION,
  applicationName: "Trama",
  // sin title/description propios: cada página comparte su <title> y su descripción
  openGraph: { type: "website", siteName: "Trama", locale: "es_ES" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
