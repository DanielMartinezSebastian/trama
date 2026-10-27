"use client";

import { createContext, useContext } from "react";
import type { useCart } from "@/lib/commerce/cart";

/** ruta dentro de Patrón: `patronHref("tienda")` → `/inspiraciones/patron/tienda` */
export const patronHref = (path = "") => `/inspiraciones/patron${path ? `/${path.replace(/^\//, "")}` : ""}`;

/** lo que el marco comparte con las páginas: el menú lateral y la bolsa de la tienda */
export type MarcoPatron = { menu: boolean; abrirMenu: () => void; bolsa: number; abrirBolsa: () => void; carrito: ReturnType<typeof useCart> };
export const PatronCtx = createContext<MarcoPatron | null>(null);
export function usePatron() {
  const c = useContext(PatronCtx);
  if (!c) throw new Error("Falta el marco de Patrón (Sitio.tsx)");
  return c;
}
