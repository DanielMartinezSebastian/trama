"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      if (Array.isArray(saved)) setLines(saved.filter((l) => l && typeof l.id === "string" && Number.isFinite(l.price) && l.qty > 0));
    } catch {
      /* sin almacenamiento o contenido dañado: carrito vacío */
    }
    setReady(true);
  }, [storageKey]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(lines));
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
