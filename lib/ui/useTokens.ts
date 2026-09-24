"use client";

import { useEffect, useState, type RefObject } from "react";

const NAMES = ["--bg", "--fg", "--mut", "--acc", "--acc2", "--card", "--ln", "--r"] as const;
export type TokenSnapshot = Record<(typeof NAMES)[number], string>;

const read = (el: Element): TokenSnapshot => {
  const cs = getComputedStyle(el);
  return Object.fromEntries(NAMES.map((n) => [n, cs.getPropertyValue(n).trim()])) as TokenSnapshot;
};

/**
 * Devuelve los tokens de diseño vigentes en el elemento y se actualiza cuando cambian
 * (p. ej. al elegir otro tema). Sirve a los componentes que pintan en canvas y no pueden
 * apoyarse en `var(--x)` de CSS: úsalo como dependencia de sus efectos de dibujo.
 */
export function useTokens(ref: RefObject<Element | null>): TokenSnapshot | null {
  const [tokens, setTokens] = useState<TokenSnapshot | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const next = read(el);
      setTokens((prev) => (prev && NAMES.every((n) => prev[n] === next[n]) ? prev : next));
    };
    update();
    // El tema se aplica con `style` en un ancestro: se observan los ancestros cercanos
    const mo = new MutationObserver(update);
    let a: Element | null = el;
    for (let i = 0; i < 8 && a; i++, a = a.parentElement) mo.observe(a, { attributes: true, attributeFilter: ["style", "class"] });
    return () => mo.disconnect();
  }, [ref]);

  return tokens;
}
