"use client";

import dynamic from "next/dynamic";
import type { ComponentType, ReactNode } from "react";

/*
 * Cada web carga solo su código. Con imports estáticos, las cinco webs descargaban el código y los datos de las otras
 * cuatro. `next/dynamic` separa cada una en su propio fragmento (se sigue renderizando en el servidor).
 */
type Shell = ComponentType<{ children: ReactNode }>;
type Page = ComponentType<{ path: string[] }>;
type SiteModule = { Shell: (p: { children: ReactNode }) => ReactNode; Page: (p: { path: string[] }) => ReactNode };

const site = (load: () => Promise<SiteModule>) => ({
  Shell: dynamic(() => load().then((m) => m.Shell)) as Shell,
  Page: dynamic(() => load().then((m) => m.Page)) as Page,
});

/** Cada web: su marco (barra, pie, estado compartido) y su página según la ruta. */
const SITES: Record<string, { Shell: Shell; Page: Page }> = {
  "kernel-log": site(() => import("./kernel-log/Site")),
  pixelforge: site(() => import("./pixelforge/Site")),
  vigia: site(() => import("./vigia/Site")),
  onda: site(() => import("./onda/Site")),
  "clara-vidal": site(() => import("./clara-vidal/Site")),
};

/** Marco de la web: va en el layout, así persiste (con su estado) al navegar entre sus páginas. */
export function SiteShell({ site, children }: { site: string; children: ReactNode }) {
  const S = SITES[site];
  return S ? <S.Shell>{children}</S.Shell> : children;
}

export function SitePage({ site, path }: { site: string; path: string[] }) {
  const S = SITES[site];
  return S ? <S.Page path={path} /> : null;
}
