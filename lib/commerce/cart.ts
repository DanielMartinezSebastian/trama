"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type CartLine = {
  /** identifica la línea: producto + variante («vaso-azul-m») */
  id: string;
  title: string;
  /** precio unitario */
  price: number;
  qty: number;
  image?: string;
  /** variante legible: «Azul · M» */
  meta?: string;
};

/** aviso entre instancias de `useCart` de esta pestaña (el detalle es la clave del carrito) */
const CART_EVENT = "trama:cart";

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * Carrito en el cliente: líneas, cantidades, subtotal y persistencia en `localStorage` (sobrevive a recargar y a navegar). Lee
 * el almacenamiento tras montar, así el primer pintado coincide con el del servidor y no hay desajuste de hidratación. Si el
 * almacenamiento no está disponible (modo privado), funciona igual en memoria. No habla con ningún backend: para cobrar, tu
 * servidor valida precios y stock; esto es solo el estado de la interfaz.
 */
export function useCart(storageKey = "trama:cart") {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  // lo último leído o escrito, para no reescribir ni avisar de lo que ya está guardado
  const last = useRef("");
  useEffect(() => {
    const leer = () => {
      try {
        const raw = localStorage.getItem(storageKey) ?? "[]";
        if (raw === last.current) return;
        last.current = raw;
        const saved = JSON.parse(raw);
        if (Array.isArray(saved)) setLines(saved.filter((l) => l && typeof l.id === "string" && Number.isFinite(l.price) && l.qty > 0));
      } catch {
        /* sin almacenamiento o contenido dañado: carrito vacío */
      }
    };
    leer();
    setReady(true);
    // varias instancias con la misma clave (el contador de la cabecera y la página de la tienda) se mantienen al día: en
    // esta pestaña por un evento propio y en las demás por `storage`
    const propio = (e: Event) => (e as CustomEvent<string>).detail === storageKey && leer();
    const otra = (e: StorageEvent) => e.key === storageKey && leer();
    window.addEventListener(CART_EVENT, propio);
    window.addEventListener("storage", otra);
    return () => {
      window.removeEventListener(CART_EVENT, propio);
      window.removeEventListener("storage", otra);
    };
  }, [storageKey]);

  useEffect(() => {
    if (!ready) return;
    const raw = JSON.stringify(lines);
    if (raw === last.current) return;
    last.current = raw;
    try {
      localStorage.setItem(storageKey, raw);
      window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: storageKey }));
    } catch {
      /* nada */
    }
  }, [lines, ready, storageKey]);

  const add = useCallback((line: Omit<CartLine, "qty">, qty = 1) => {
    setLines((cur) => {
      const i = cur.findIndex((l) => l.id === line.id);
      return i >= 0 ? cur.map((l, j) => (j === i ? { ...l, qty: l.qty + qty } : l)) : [...cur, { ...line, qty }];
    });
  }, []);
  const setQty = useCallback((id: string, qty: number) => setLines((cur) => (qty <= 0 ? cur.filter((l) => l.id !== id) : cur.map((l) => (l.id === id ? { ...l, qty } : l)))), []);
  const remove = useCallback((id: string) => setLines((cur) => cur.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setLines([]), []);

  const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines]);
  const subtotal = useMemo(() => round(lines.reduce((n, l) => n + l.price * l.qty, 0)), [lines]);

  return { lines, count, subtotal, add, setQty, remove, clear, ready };
}
