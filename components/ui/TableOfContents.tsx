"use client";

import { useEffect, useMemo, useState } from "react";
import { headingsOf, type Heading } from "@/lib/ui/markdown";
import { createSlugger } from "@/lib/ui/markdownInline";
import { vcls, type Variant } from "./variants";

export type TableOfContentsProps = {
  /** saca los títulos de este Markdown (el mismo que recibe Prose): mismos ids */
  markdown?: string;
  /** o de la página: selector del contenedor cuyos h2/h3 con id se listan ("#articulo") */
  target?: string;
  /** o a mano, uno por línea: `## Título` o `### Subtítulo` (los # dan el nivel), `=#id` opcional */
  items?: string;
  /** título del índice ("" = sin título) */
  title?: string;
  /** hasta qué nivel se listan: 2 = solo secciones · 3 = también subsecciones */
  depth?: 2 | 3;
  /** rail = línea lateral con marcador · list = lista simple · numbered = numerado (1, 1.1…) */
  kind?: "rail" | "list" | "numbered";
  /** se queda fijo al hacer scroll (dentro de su columna) */
  sticky?: boolean;
  variant?: Variant;
  className?: string;
};

/** El ancestro con scroll vertical más cercano, o null si lo que se desplaza es la página. */
function scrollParent(el: HTMLElement): HTMLElement | null {
  for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
    const o = getComputedStyle(a).overflowY;
    if ((o === "auto" || o === "scroll") && a.scrollHeight > a.clientHeight) return a;
  }
  return null;
}

function parseItems(items: string): Heading[] {
  const slug = createSlugger();
  return items
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const m = /^(#{1,4})?\s*(.*?)(?:=#([\w-]+))?$/.exec(l)!;
      return { level: m[1] ? m[1].length : 2, text: m[2], id: m[3] ?? slug(m[2]) };
    });
}

/**
 * Índice «En esta página» de un texto largo: lista sus secciones y marca la que se está leyendo. Los títulos salen del mismo
 * Markdown que `Prose` (mismos ids), de los h2/h3 de un contenedor de la página (`target`) o de una lista a mano (`items`).
 */
export default function TableOfContents({ markdown = "", target = "", items = "", title = "En esta página", depth = 3, kind = "rail", sticky = false, variant = "minimal", className = "" }: TableOfContentsProps) {
  const fromProps = useMemo(() => (items ? parseItems(items) : markdown ? headingsOf(markdown, 2, depth) : []), [items, markdown, depth]);
  const [fromDom, setFromDom] = useState<Heading[]>([]);
  const list = (fromProps.length ? fromProps : fromDom).filter((h) => h.level <= depth);
  const [active, setActive] = useState("");

  // target: se leen los títulos ya pintados en la página
  useEffect(() => {
    if (fromProps.length || !target) return;
    const root = document.querySelector(target);
    if (!root) return;
    const read = () =>
      setFromDom(
        Array.from(root.querySelectorAll<HTMLElement>("h2[id], h3[id]")).map((el) => ({ level: Number(el.tagName[1]), text: el.textContent?.replace(/#$/, "").trim() ?? "", id: el.id })),
      );
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [fromProps.length, target]);

  // sección activa: la última cuyo título ha pasado por encima del 30 % superior de lo que se desplaza (la ventana o el
  // contenedor con scroll del texto); al llegar al final, la última aunque su título no alcance esa línea
  const ids = list.map((h) => h.id).join("|");
  useEffect(() => {
    const els = ids
      .split("|")
      .map((id) => (id ? document.getElementById(id) : null))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const sc = scrollParent(els[0]);
    const onScroll = () => {
      const top = sc ? sc.getBoundingClientRect().top : 0;
      const h = sc ? sc.clientHeight : innerHeight;
      const atEnd = sc ? sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2 : scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
      let cur = els[0].id;
      for (const el of els) if (el.getBoundingClientRect().top - top <= h * 0.3) cur = el.id;
      setActive(atEnd ? els[els.length - 1].id : cur);
    };
    onScroll();
    // captura: también los scrolls de contenedores (un artículo dentro de una caja con scroll)
    addEventListener("scroll", onScroll, { passive: true, capture: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll, { capture: true });
      removeEventListener("resize", onScroll);
    };
  }, [ids]);

  if (!list.length) return null;

  // numeración 1, 1.1, 2…
  let n2 = 0;
  let n3 = 0;
  const numbered = list.map((h) => {
    if (h.level <= 2) {
      n2++;
      n3 = 0;
      return `${n2}`;
    }
    n3++;
    return `${n2 || 1}.${n3}`;
  });

  return (
    <nav aria-label={title || "Índice"} className={`ui-toc ui-toc--${kind} ${sticky ? "ui-toc--sticky" : ""} ${vcls(variant)} ${className}`}>
      {title && <p className="ui-toc__title">{title}</p>}
      <ol className="ui-toc__list">
        {list.map((h, i) => (
          <li key={h.id + i} className={`ui-toc__item ui-toc__item--l${h.level}`}>
            <a
              href={`#${h.id}`}
              className="ui-toc__link"
              aria-current={active === h.id ? "location" : undefined}
              onClick={(e) => {
                const el = document.getElementById(h.id);
                if (!el) return;
                e.preventDefault();
                el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
                history.replaceState(null, "", `#${h.id}`);
                setActive(h.id);
              }}
            >
              {kind === "numbered" && <span className="ui-toc__num">{numbered[i]}</span>}
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
