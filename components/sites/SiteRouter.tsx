"use client";

import type { ReactNode } from "react";
import * as kernel from "./kernel-log/Site";
import * as pixelforge from "./pixelforge/Site";
import * as vigia from "./vigia/Site";
import * as onda from "./onda/Site";
import * as clara from "./clara-vidal/Site";

/** Cada web: su marco (barra, pie, estado compartido) y su página según la ruta. */
const SITES: Record<string, { Shell: (p: { children: ReactNode }) => ReactNode; Page: (p: { path: string[] }) => ReactNode }> = {
  "kernel-log": kernel,
  pixelforge,
  vigia,
  onda,
  "clara-vidal": clara,
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
