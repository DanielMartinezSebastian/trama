import * as React from "react";
import { Fragment, type ComponentType, type ReactNode } from "react";

/*
 * Transiciones de página con la View Transitions API del navegador, a través del `<ViewTransition>` de React.
 * Sin "use client": funciona en páginas y plantillas de servidor. Las animaciones son CSS puro sobre los
 * pseudo-elementos `::view-transition-*` (components/ui/styles/ui-view-transitions.css), con los tokens del tema.
 */

/** Familias de animación. `slide` y `wipe` tienen dirección; el resto no. */
export const PAGE_TRANSITION_KINDS = ["none", "fade", "slide", "wipe", "blinds", "pixelate", "scanline", "glitch", "iris", "terminal"] as const;
export type PageTransitionKind = (typeof PAGE_TRANSITION_KINDS)[number];
export type PageTransitionDirection = "left" | "right" | "up" | "down";
/** Animación concreta: una familia sin dirección, o `slide-*` / `wipe-*` con la suya. */
export type PageTransitionAnimation =
  | Exclude<PageTransitionKind, "slide" | "wipe">
  | `slide-${PageTransitionDirection}`
  | `wipe-${PageTransitionDirection}`;

const DIRS: readonly PageTransitionDirection[] = ["left", "right", "up", "down"];
const OPPOSITE: Record<PageTransitionDirection, PageTransitionDirection> = { left: "right", right: "left", up: "down", down: "up" };

/** Todas las animaciones concretas (lo que aceptan `types` y `pageTransitionType`). */
export const PAGE_TRANSITION_ANIMATIONS: readonly PageTransitionAnimation[] = PAGE_TRANSITION_KINDS.flatMap((k) =>
  k === "slide" || k === "wipe" ? DIRS.map((d) => `${k}-${d}` as PageTransitionAnimation) : [k as PageTransitionAnimation],
);

/** Tipos de transición convencionales para la dirección de la navegación (los de la guía de Next). */
export const NAV_FORWARD = "nav-forward";
export const NAV_BACK = "nav-back";

/**
 * Tipo de transición que elige una animación concreta para una navegación, sin configurar nada en la página:
 * `<Link href="/x" transitionTypes={[pageTransitionType("glitch")]}>` → `"trama-glitch"`. `slide`/`wipe` sin
 * dirección usan la `direction` del `PageTransition` de destino.
 */
export const pageTransitionType = (animation: PageTransitionAnimation | PageTransitionKind) => `trama-${animation}`;

type Tone = "acc" | "acc2" | "fg";
type Pace = "fast" | "normal" | "slow";

export type PageTransitionProps = {
  /** animación de las navegaciones sin tipo (y base de `nav-forward` / `nav-back`); `none` = solo animan las navegaciones con tipo */
  kind?: PageTransitionKind;
  /** hacia dónde se mueve el contenido en `slide` y `wipe`; `nav-back` usa la contraria */
  direction?: PageTransitionDirection;
  /** duración: `fast` ≈ 240 ms, `normal` ≈ 380 ms, `slow` ≈ 560 ms */
  pace?: Pace;
  /** color de barridos, cursor y separación RGB (token del tema) */
  tone?: Tone;
  /** tipo de transición → animación, p. ej. `{ "abrir-ficha": "iris" }`; tiene prioridad sobre los tipos automáticos */
  types?: Record<string, PageTransitionAnimation | PageTransitionKind>;
  children: ReactNode;
};

/**
 * `ViewTransition` existe en el React que trae el App Router de Next (canary) y en React ≥ 19.3; en 19.0–19.2 estable
 * no. Se lee por clave para que el bundler no falle con un import con nombre inexistente: sin él, no se anima.
 */
type VtClass = string | Record<string, string>;
type VtProps = { name?: string; enter?: VtClass; exit?: VtClass; update?: VtClass; share?: VtClass; default?: VtClass; children?: ReactNode };
const ViewTransition = Reflect.get(React, "ViewTransition") as ComponentType<VtProps> | undefined;
const addType = Reflect.get(React, "addTransitionType") as ((type: string) => void) | undefined;

/** true si este React puede animar transiciones de página (el navegador, además, necesita la View Transitions API). */
export const pageTransitionsSupported = typeof ViewTransition !== "undefined";

/**
 * Marca la transición en curso con la animación dada. Llámala dentro de `startTransition` antes de navegar con un
 * router que no acepte `transitionTypes` (en Next, mejor `<Link transitionTypes>` o `router.push(url, { transitionTypes })`).
 * Sin soporte en React, no hace nada.
 */
export function markPageTransition(type: PageTransitionAnimation | PageTransitionKind | typeof NAV_FORWARD | typeof NAV_BACK | (string & {})) {
  if (!addType) return;
  const known = [...PAGE_TRANSITION_KINDS, ...PAGE_TRANSITION_ANIMATIONS] as readonly string[];
  addType(known.includes(type) ? pageTransitionType(type as PageTransitionKind) : type);
}

const resolve = (a: PageTransitionAnimation | PageTransitionKind, dir: PageTransitionDirection): PageTransitionAnimation =>
  a === "slide" || a === "wipe" ? `${a}-${dir}` : a;

/** Clases de `view-transition-class` de una fase: base + fase + animación + ritmo + tono. */
const classes = (a: PageTransitionAnimation, phase: "in" | "out", pace: Pace, tone: Tone) =>
  a === "none" ? "none" : `ui-vt ui-vt-${phase} ui-vt-${a} ui-vt--${pace} ui-vt--${tone}`;

function classMap(phase: "in" | "out", kind: PageTransitionKind, direction: PageTransitionDirection, pace: Pace, tone: Tone, types: PageTransitionProps["types"]) {
  const map: Record<string, string> = {};
  for (const a of PAGE_TRANSITION_ANIMATIONS) map[pageTransitionType(a)] = classes(a, phase, pace, tone);
  map[pageTransitionType("slide")] = classes(resolve("slide", direction), phase, pace, tone);
  map[pageTransitionType("wipe")] = classes(resolve("wipe", direction), phase, pace, tone);
  map[NAV_FORWARD] = classes(resolve(kind, direction), phase, pace, tone);
  map[NAV_BACK] = classes(resolve(kind, OPPOSITE[direction]), phase, pace, tone);
  for (const [type, a] of Object.entries(types ?? {})) map[type] = classes(resolve(a, direction), phase, pace, tone);
  map.default = classes(resolve(kind, direction), phase, pace, tone);
  return map;
}

/**
 * Envuelve el contenido de una página y lo anima al entrar y salir en cada navegación (App Router de Next: van en
 * cada `page.tsx` o en un `template.tsx`, nunca en un `layout`, que no se vuelve a montar). No añade nodos al DOM.
 * Sin soporte (React sin `ViewTransition` o navegador sin la API), la página cambia sin animar.
 */
export default function PageTransition({ kind = "fade", direction = "left", pace = "normal", tone = "acc", types, children }: PageTransitionProps) {
  if (!ViewTransition) return <Fragment>{children}</Fragment>;
  return (
    <ViewTransition enter={classMap("in", kind, direction, pace, tone, types)} exit={classMap("out", kind, direction, pace, tone, types)} update="none" default="none">
      {children}
    </ViewTransition>
  );
}

export type PageTransitionPersistProps = {
  /** nombre único en la página (`view-transition-name`); uno distinto por cada elemento fijo */
  name?: string;
  children: ReactNode;
};

/**
 * Deja fuera de la animación de página lo que envuelve (cabecera, barra de navegación, reproductor…): se queda quieto
 * y por encima mientras el contenido transiciona. Úsalo aunque la cabecera viva en un layout si alguna página la
 * repite o si la envuelve un `PageTransition`.
 */
export function PageTransitionPersist({ name = "ui-site-header", children }: PageTransitionPersistProps) {
  if (!ViewTransition) return <Fragment>{children}</Fragment>;
  return (
    <ViewTransition name={name} default="ui-vt-persist" share="ui-vt-persist" enter="ui-vt-persist" exit="ui-vt-persist" update="ui-vt-persist">
      {children}
    </ViewTransition>
  );
}
