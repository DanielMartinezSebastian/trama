import * as React from "react";
import type { ComponentType, ReactNode } from "react";

/*
 * Núcleo común de las transiciones con la View Transitions API (PageTransition, ElementTransition, SharedTransition):
 * nombres de las animaciones, tipos de transición, elección de animación y acceso seguro al `<ViewTransition>` de React.
 * Sin "use client": lo importan tanto componentes de servidor como de cliente.
 */

/** Familias de animación. `slide`, `wipe`, `scan` y `stack` tienen dirección; el resto no. */
export const PAGE_TRANSITION_KINDS = ["none", "fade", "slide", "wipe", "scan", "stack", "blinds", "pixelate", "scanline", "glitch", "iris", "terminal"] as const;
export type PageTransitionKind = (typeof PAGE_TRANSITION_KINDS)[number];
export type PageTransitionDirection = "left" | "right" | "up" | "down";
/** Familias con dirección (hacia dónde se mueve el contenido, la banda, la línea o la pila). */
export const DIRECTIONAL_TRANSITION_KINDS = ["slide", "wipe", "scan", "stack"] as const;
type DirectionalKind = (typeof DIRECTIONAL_TRANSITION_KINDS)[number];
/** Animación concreta: una familia sin dirección, o `slide-*` / `wipe-*` / `scan-*` / `stack-*` con la suya. */
export type PageTransitionAnimation = Exclude<PageTransitionKind, DirectionalKind> | `${DirectionalKind}-${PageTransitionDirection}`;
export type PageTransitionTone = "acc" | "acc2" | "fg";
export type PageTransitionPace = "fast" | "normal" | "slow";

const DIRS: readonly PageTransitionDirection[] = ["left", "right", "up", "down"];
export const OPPOSITE: Record<PageTransitionDirection, PageTransitionDirection> = { left: "right", right: "left", up: "down", down: "up" };
const isDirectional = (k: string): k is DirectionalKind => (DIRECTIONAL_TRANSITION_KINDS as readonly string[]).includes(k);

/** Dirección de una familia cuando no se indica: `down` en `scan` (la línea baja), `left` en el resto. */
export const defaultDirection = (a: PageTransitionAnimation | PageTransitionKind): PageTransitionDirection => (a === "scan" ? "down" : "left");

/** Todas las animaciones concretas (lo que aceptan `types` y `pageTransitionType`). */
export const PAGE_TRANSITION_ANIMATIONS: readonly PageTransitionAnimation[] = PAGE_TRANSITION_KINDS.flatMap((k) =>
  isDirectional(k) ? DIRS.map((d) => `${k}-${d}` as PageTransitionAnimation) : [k as PageTransitionAnimation],
);

/** Tipos de transición convencionales para la dirección de la navegación (los de la guía de Next). */
export const NAV_FORWARD = "nav-forward";
export const NAV_BACK = "nav-back";

/**
 * Tipo de transición que elige una animación concreta para una navegación, sin configurar nada en la página:
 * `<Link href="/x" transitionTypes={[pageTransitionType("glitch")]}>` → `"trama-glitch"`. `slide`/`wipe`/`scan`/`stack`
 * sin dirección usan la `direction` del componente de destino (o la de la familia, ver `defaultDirection`).
 */
export const pageTransitionType = (animation: PageTransitionAnimation | PageTransitionKind) => `trama-${animation}`;

/** Opciones con las que se elige la animación de una transición. */
export type TransitionChoice = {
  kind?: PageTransitionKind;
  direction?: PageTransitionDirection;
  /** tipo de transición → animación, p. ej. `{ "abrir-ficha": "iris" }` */
  types?: Record<string, PageTransitionAnimation | PageTransitionKind>;
};

const KNOWN = new Set<string>([...PAGE_TRANSITION_KINDS, ...PAGE_TRANSITION_ANIMATIONS]);

/** Familia con dirección sin ella (`slide`, `wipe`, `scan`, `stack`) → con la dada (o la suya por defecto); el resto, igual. */
export const withDirection = (a: PageTransitionAnimation | PageTransitionKind, dir?: PageTransitionDirection): PageTransitionAnimation =>
  isDirectional(a) ? `${a}-${dir ?? defaultDirection(a)}` : (a as PageTransitionAnimation);

/** Dirección contraria a la que usaría `kind` (para `nav-back`). */
export const backDirection = (kind: PageTransitionAnimation | PageTransitionKind, dir?: PageTransitionDirection): PageTransitionDirection =>
  OPPOSITE[dir ?? defaultDirection(kind)];

/**
 * Animación de una transición según sus tipos. Prioridad: los `types` propios › `trama-<animación>` › `nav-back`
 * (dirección contraria) › `nav-forward` / sin tipo (`kind` con `direction`). Función pura: se puede probar sin navegador.
 */
export function pickTransitionAnimation(transitionTypes: Iterable<string>, { kind = "fade", direction, types }: TransitionChoice = {}): PageTransitionAnimation {
  const list = [...transitionTypes];
  for (const t of list) if (types && Object.prototype.hasOwnProperty.call(types, t)) return withDirection(types[t], direction);
  for (const t of list) {
    const a = t.startsWith("trama-") ? t.slice(6) : null;
    if (a && KNOWN.has(a)) return withDirection(a as PageTransitionKind, direction);
  }
  if (list.includes(NAV_BACK)) return withDirection(kind, backDirection(kind, direction));
  return withDirection(kind, direction);
}

/**
 * `ViewTransition` existe en el React que trae el App Router de Next (canary) y en React ≥ 19.3; en 19.0–19.2 estable
 * no. Se lee por clave para que el bundler no falle con un import con nombre inexistente: sin él, no se anima.
 */
type VtClass = string | Record<string, string>;
export type VtProps = { name?: string; enter?: VtClass; exit?: VtClass; update?: VtClass; share?: VtClass; default?: VtClass; children?: ReactNode };
export const ViewTransition = Reflect.get(React, "ViewTransition") as ComponentType<VtProps> | undefined;
const addType = Reflect.get(React, "addTransitionType") as ((type: string) => void) | undefined;

/** true si este React puede animar transiciones (el navegador, además, necesita la View Transitions API). */
export const pageTransitionsSupported = typeof ViewTransition !== "undefined";

/**
 * Marca la transición en curso con la animación dada. Llámala dentro de `startTransition` antes de navegar con un
 * router que no acepte `transitionTypes` (en Next, mejor `<Link transitionTypes>` o `router.push(url, { transitionTypes })`).
 * Sin soporte en React, no hace nada.
 */
export function markPageTransition(type: PageTransitionAnimation | PageTransitionKind | typeof NAV_FORWARD | typeof NAV_BACK | (string & {})) {
  if (!addType) return;
  addType(KNOWN.has(type) ? pageTransitionType(type as PageTransitionKind) : type);
}

/** Clases de `view-transition-class` del kit: base + ámbito/fase + animación + ritmo + tono. */
export const vtClasses = (a: PageTransitionAnimation, scope: "root" | "in" | "out", pace: PageTransitionPace, tone: PageTransitionTone) =>
  `ui-vt ui-vt-${scope} ui-vt-${a} ui-vt--${pace} ui-vt--${tone}`;
