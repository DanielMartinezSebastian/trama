import type { Metadata } from "next";
import { fontVariables } from "@/lib/ui/fonts";
import "./globals.css";
import "./landings.css";
// El kit va después del CSS del sitio, en el mismo orden que antes de moverlo a components/ui/styles/.
import "@/components/ui/styles/kit.css";

export const metadata: Metadata = {
  title: "Trama",
  description: "Librería de componentes ASCII, textmode y pixel art para Next.js: catálogo, demos y landings de referencia",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
