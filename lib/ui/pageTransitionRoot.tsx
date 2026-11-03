"use client";

import { useLayoutEffect } from "react";
import { pickTransitionAnimation, vtClasses, type PageTransitionPace, type PageTransitionTone, type TransitionChoice } from "./viewTransitions";

/*
 * Parte cliente de PageTransition: arma la animación de la RAÍZ (todo el viewport) en la transición que monta la página.
 *
 * Cómo encaja con React (react-dom, commitAfterMutationEffectsOnFiber, caso de la raíz): si en un commit con View
 * Transition no cambió el tamaño de ningún `<ViewTransition>`, React «cancela» la captura de la raíz poniendo
 * `view-transition-name: none` en línea en <html>, pero solo si ese estilo en línea está vacío. Esa comprobación ocurre
 * después de los efectos de layout del commit nuevo, dentro del callback de `document.startViewTransition`, y antes de
 * que el navegador capture el estado nuevo. Por eso, en un efecto de layout:
 *   1. se lee la transición en curso (`document.activeViewTransition` o la que guarda React) y sus tipos;
 *   2. se pone en <html> `view-transition-name: root` en línea (React ya no la cancela) y un `view-transition-class` con
 *      la animación, el ritmo y el tono (`ui-vt ui-vt-root ui-vt-wipe-left ui-vt--fast ui-vt--acc`), más `data-ui-vt`;
 *   3. copia en <html> los tokens del tema de la página nueva (--ui-vt-acc, --ui-vt-acc2, --ui-vt-fg, --ui-vt-mut y
 *      --ui-vt-bg): los pseudo-elementos `::view-transition-*` heredan de <html>, no del contenedor donde vive el tema,
 *      y sin esto una web con tema propio dentro del sitio barrería con el color del sitio;
 *   4. al terminar la transición (`finished`), se deja <html> como estaba.
 * El CSS (ui-view-transitions.css) anima `::view-transition-old/new/group(root)` por esas clases.
 */

type ActiveVt = { types?: Iterable<string>; finished: Promise<unknown> };
type VtDocument = Document & { activeViewTransition?: ActiveVt | null; __reactViewTransition?: ActiveVt | null };

/** La transición del documento en curso, si la hay (estándar o la que registra React al iniciarla). */
function activeTransition(): ActiveVt | null {
  const doc = document as VtDocument;
  return doc.activeViewTransition ?? doc.__reactViewTransition ?? null;
}

let armed: object | null = null;

const TOKENS = ["acc", "acc2", "fg", "mut"] as const;
const COPIED = [...TOKENS.map((t) => `--ui-vt-${t}`), "--ui-vt-bg"];

/**
 * El fondo de la página: el opaco más externo entre `el` y <body> (el contenedor de la web, no una tarjeta del centro);
 * sin ninguno, el de <body>.
 */
function paintedBackground(el: Element | null): string {
  const opaque = (n: Element) => {
    const c = getComputedStyle(n).backgroundColor;
    return c && c !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(c) ? c : "";
  };
  let found = "";
  for (let n = el; n && n !== document.body && n !== document.documentElement; n = n.parentElement) found = opaque(n) || found;
  return found || opaque(document.body);
}

/**
 * El elemento de la página que ocupa el centro de la ventana, buscado por las cajas y no con `elementFromPoint`: durante
 * la transición, la capa `::view-transition` cubre la ventana y la prueba de impacto devuelve <html>.
 */
function centerElement(): Element {
  const x = window.innerWidth / 2, y = window.innerHeight / 2;
  let node: Element = document.body;
  for (let depth = 0; depth < 12; depth++) {
    // los nodos con `display: contents` no tienen caja: cuentan sus hijos
    const kids = (n: Element): Element[] => Array.from(n.children).flatMap((c) => (getComputedStyle(c).display === "contents" ? kids(c) : [c]));
    const next = kids(node).find((c) => {
      const r = c.getBoundingClientRect();
      return r.width > 0 && r.left <= x && r.right >= x && r.top <= y && r.bottom >= y && getComputedStyle(c).visibility !== "hidden";
    });
    if (!next) break;
    node = next;
  }
  return node;
}

/**
 * Copia en <html> el tema de la página nueva. Se lee en el contenedor de `themeFrom` o, sin él, en el elemento del centro
 * de la ventana: los tokens heredan, así que ahí valen los del contenedor del tema que lo envuelve.
 */
function copyTheme(html: HTMLElement, themeFrom?: string) {
  let src: Element | null = null;
  try {
    src = themeFrom ? document.querySelector(themeFrom) : null;
  } catch {
    src = null;
  }
  src ??= centerElement();
  const cs = getComputedStyle(src);
  for (const t of TOKENS) {
    const v = cs.getPropertyValue(`--${t}`).trim();
    if (v) html.style.setProperty(`--ui-vt-${t}`, v);
  }
  const bg = paintedBackground(src) || cs.getPropertyValue("--bg").trim();
  if (bg) html.style.setProperty("--ui-vt-bg", bg);
}

/** Deja <html> sin nuestras marcas (solo si siguen siendo las de esta transición). */
function disarm(token: object) {
  if (armed !== token) return;
  armed = null;
  const html = document.documentElement;
  if (html.style.viewTransitionName === "root") html.style.viewTransitionName = "";
  html.style.removeProperty("view-transition-class");
  html.removeAttribute("data-ui-vt");
  for (const p of COPIED) html.style.removeProperty(p);
}

export type PageTransitionRootProps = TransitionChoice & { pace: PageTransitionPace; tone: PageTransitionTone; themeFrom?: string };

export default function PageTransitionRoot({ kind, direction, pace, tone, types, themeFrom }: PageTransitionRootProps) {
  // Solo al montar: la página nueva entra en el commit de la navegación. Las actualizaciones posteriores de la misma
  // página (un filtro, un estado) no deben animar la ventana entera.
  useLayoutEffect(() => {
    const vt = activeTransition();
    if (!vt) return; // sin API, primera carga o commit fuera de una transición: no se anima nada
    let list: string[] = [];
    try {
      list = vt.types ? Array.from(vt.types) : [];
    } catch {
      list = [];
    }
    const animation = pickTransitionAnimation(list, { kind, direction, types });
    const html = document.documentElement;
    const token = {};
    armed = token;
    html.style.viewTransitionName = "root";
    html.style.setProperty("view-transition-class", vtClasses(animation, "root", pace, tone));
    html.setAttribute("data-ui-vt", animation);
    copyTheme(html, themeFrom);
    vt.finished.then(
      () => disarm(token),
      () => disarm(token),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- a propósito: solo en la navegación que monta la página
  }, []);
  return null;
}
