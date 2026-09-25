"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, type CSSProperties, type ReactNode } from "react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import "./sites.css";

/** Ruta absoluta dentro de una web: `siteHref("pixelforge", "tienda")` → `/sitios/pixelforge/tienda`. */
export const siteHref = (slug: string, path = "") => `/sitios/${slug}${path ? `/${path.replace(/^\//, "")}` : ""}`;

/** Navegación sin recarga para los componentes del kit que aceptan `onNavigate` (NavBar). */
export function useSiteNavigate() {
  const router = useRouter();
  return useCallback(
    (item: { href?: string }) => {
      if (!item.href) return;
      if (item.href.startsWith("#")) document.getElementById(item.href.slice(1))?.scrollIntoView({ behavior: "smooth" });
      else if (item.href.startsWith("/")) router.push(item.href);
      else location.assign(item.href);
    },
    [router],
  );
}

/**
 * Índice del enlace activo de una barra: el de la ruta más larga que encaja con la página actual.
 * `hrefs` en el mismo orden que los enlaces de la barra ("" para los que no son rutas).
 */
export function useActiveIndex(hrefs: string[]) {
  const path = usePathname();
  let best = -1;
  let len = -1;
  hrefs.forEach((h, i) => {
    if (h && (path === h || path.startsWith(h + "/")) && h.length > len) {
      best = i;
      len = h.length;
    }
  });
  return best;
}

/**
 * Marco común de las webs completas: tema (tokens en línea), scroll de página (las demos a pantalla completa lo bloquean en
 * `<html>`), enlaces internos sin recarga. Los enlaces `<a href="/sitios/…">` que pintan los
 * componentes del kit (Button con href, BlogCard, Prose…) se interceptan aquí y van por `router.push`, así el estado de la web
 * (carrito, chat) sobrevive al cambiar de página. Los de la barra no: NavBar ya navega con `onNavigate`.
 */
export function SiteFrame({ tokens, className = "", children }: { tokens: CSSProperties; className?: string; children: ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    document.documentElement.classList.add("scrollable");
    return () => document.documentElement.classList.remove("scrollable");
  }, []);
  // en el documento y no en el contenedor: también los enlaces de los overlays en portal (chat, toasts)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      const href = a?.getAttribute("href");
      if (!a || !href || !href.startsWith("/sitios/") || a.target === "_blank" || a.closest(".ui-nav, .ui-nav-portal")) return;
      e.preventDefault();
      router.push(href);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);
  return (
    <div className={`st-page ${className}`} style={tokens}>
      {children}
    </div>
  );
}

/** Cabecera de página interior: migas, título y entradilla. */
export function PageHeader({ crumbs, title, lead, children, align = "left" }: { crumbs?: string; title: string; lead?: string; children?: ReactNode; align?: "left" | "center" }) {
  return (
    <header className={`st-phead st-phead--${align}`}>
      {crumbs && <Breadcrumbs items={crumbs} variant="minimal" />}
      <h1>{title}</h1>
      {lead && <p className="st-lead">{lead}</p>}
      {children}
    </header>
  );
}

/** Sección con ancho de contenido y espaciado vertical. */
export function Section({ id, tight, className = "", children }: { id?: string; tight?: boolean; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`st-section ${tight ? "st-section--tight" : ""} ${className}`}>
      <div className="st-wrap">{children}</div>
    </section>
  );
}

/** Formatea euros al estilo español: 1234.5 → «1.234,50 €». */
export const euros = (n: number) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
