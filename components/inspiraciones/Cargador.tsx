"use client";

import dynamic from "next/dynamic";
import { useEffect, type ComponentType, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Desplazable from "./Desplazable";
import { replica } from "./registro";

/*
 * Cada inspiración se carga por separado: abrir una no descarga las demás. Las que tienen varias páginas (docs/56) exportan
 * desde su `Sitio.tsx` un `Shell` (marco que persiste al navegar: cabecera, menú, estado del carrito o la reserva, pie) y una
 * `Pagina` según la ruta; las de una sola página exportan su componente por defecto, que hace de portada.
 */
type Shell = ComponentType<{ children: ReactNode }>;
type Pagina = ComponentType<{ ruta: string[] }>;
type ModuloSitio = { Shell: Shell; Pagina: Pagina };

const sitio = (load: () => Promise<ModuloSitio>) => ({
  Shell: dynamic(() => load().then((m) => m.Shell)) as Shell,
  Pagina: dynamic(() => load().then((m) => m.Pagina)) as Pagina,
});
const portada = (load: () => Promise<{ default: ComponentType }>) => {
  const Portada = dynamic(load);
  return { Shell: (({ children }) => children) as Shell, Pagina: (({ ruta }) => (ruta.length ? null : <Portada />)) as Pagina };
};

const SITIOS: Record<string, { Shell: Shell; Pagina: Pagina }> = {
  matiz: sitio(() => import("./matiz/Sitio")),
  nura: sitio(() => import("./nura/Sitio")),
  cita: sitio(() => import("./cita/Sitio")),
  melena: sitio(() => import("./melena/Sitio")),
  raiz: sitio(() => import("./raiz/Sitio")),
  patron: sitio(() => import("./patron/Sitio")),
  nucleo: sitio(() => import("./nucleo/Sitio")),
  impulso: sitio(() => import("./impulso/Sitio")),
  vive: sitio(() => import("./vive/Sitio")),
  talla: sitio(() => import("./talla/Sitio")),
  lobo: sitio(() => import("./lobo/Sitio")),
  remada: sitio(() => import("./remada/Sitio")),
  ahora: sitio(() => import("./ahora/Sitio")),
  oficio: sitio(() => import("./oficio/Sitio")),
  "abuela-rosa": sitio(() => import("./abuela-rosa/Sitio")),
  q47: sitio(() => import("./q47/Sitio")),
  cenit: portada(() => import("./cenit/Cenit")),
  brasa: portada(() => import("./brasa/Brasa")),
};

/**
 * Marco de una inspiración: va en el layout, así persiste (con su estado) al cambiar de página. Monta una sola vez el scroll
 * de la página: suave con la sensación del registro, o nativo, y en los dos casos las anclas animadas que descuentan la
 * cabecera (docs/56 §1.4).
 */
export function InspiracionShell({ slug, children }: { slug: string; children: ReactNode }) {
  const S = SITIOS[slug];
  const r = replica(slug);
  const router = useRouter();
  // los enlaces a otra página de la inspiración van sin recarga (el marco y su estado siguen, y se ve la transición); en
  // el documento y en captura, como SiteFrame en /sitios, para que valgan también los de los menús en portal. Un enlace a
  // la misma página con ancla lo lleva el salto animado de SmoothScroll
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      const href = a?.getAttribute("href");
      if (!a || !href || !href.startsWith("/inspiraciones/") || a.target === "_blank" || a.dataset.navigate === "manual") return;
      const url = new URL(href, location.href);
      if (url.pathname === location.pathname && url.hash) return;
      e.preventDefault();
      router.push(href);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);
  const feel = r?.scroll && r.scroll !== "nativo" ? r.scroll : undefined;
  return (
    <>
      <Desplazable />
      <SmoothScroll feel={feel} enabled={!!feel} syncGsap={false} />
      {S ? <S.Shell>{children}</S.Shell> : children}
    </>
  );
}

export function InspiracionPagina({ slug, ruta }: { slug: string; ruta: string[] }) {
  const S = SITIOS[slug];
  return S ? <S.Pagina ruta={ruta} /> : null;
}

/** la portada con su marco, para el laboratorio (/lab/estudios/<slug>, donde se mide el par) */
export default function Cargador({ slug }: { slug: string }) {
  return (
    <InspiracionShell slug={slug}>
      <InspiracionPagina slug={slug} ruta={[]} />
    </InspiracionShell>
  );
}
