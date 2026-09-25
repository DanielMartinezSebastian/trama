import type { Metadata } from "next";
import Link from "next/link";
import SiteChrome from "@/components/site/SiteChrome";

export const metadata: Metadata = { title: "Página no encontrada · Trama" };

export default function NotFound() {
  return (
    <SiteChrome>
      <main className="tr-page tr-404">
        <p className="tr-label">Error 404</p>
        <h1 className="tr-404__code">404</h1>
        <p className="tr-statement">Esta página no existe.</p>
        <p className="tr-sec__lead">Puede que la dirección haya cambiado. La galería de demos ahora vive en /demos y la documentación en /docs.</p>
        <div className="tr-hero__cta">
          <Link href="/" className="tr-btn tr-btn--solid">
            Ir al inicio
          </Link>
          <Link href="/docs" className="tr-btn">
            Documentación
          </Link>
          <Link href="/demos" className="tr-btn">
            Demos →
          </Link>
        </div>
      </main>
    </SiteChrome>
  );
}
