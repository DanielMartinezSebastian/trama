import { Fragment, type ReactNode } from "react";
import {
  NAV_BACK,
  NAV_FORWARD,
  OPPOSITE,
  PAGE_TRANSITION_ANIMATIONS,
  ViewTransition,
  pageTransitionType,
  vtClasses,
  withDirection,
  type PageTransitionAnimation,
  type PageTransitionDirection,
  type PageTransitionKind,
  type PageTransitionPace,
  type PageTransitionTone,
} from "@/lib/ui/viewTransitions";

/*
 * Transiciones de ELEMENTOS sueltos con la View Transitions API, a través del `<ViewTransition>` de React: la animación
 * ocupa la caja del elemento que envuelve (una tarjeta, un panel, el contenido de una pestaña), no la ventana. Mismas
 * 9 animaciones que PageTransition. Para la página entera, usa PageTransition.
 * Sin "use client": funciona en componentes de servidor.
 */

export type ElementTransitionProps = {
  /** animación de las transiciones sin tipo (y base de `nav-forward` / `nav-back`); `none` = solo animan las que llevan tipo */
  kind?: PageTransitionKind;
  /** hacia dónde se mueve el contenido en `slide` y `wipe`; `nav-back` usa la contraria */
  direction?: PageTransitionDirection;
  /** duración: `fast` ≈ 240 ms, `normal` ≈ 380 ms, `slow` ≈ 560 ms */
  pace?: PageTransitionPace;
  /** color de barridos, aro, cursor y separación RGB (token del tema) */
  tone?: PageTransitionTone;
  /** tipo de transición → animación, p. ej. `{ "abrir-ficha": "iris" }` */
  types?: Record<string, PageTransitionAnimation | PageTransitionKind>;
  children: ReactNode;
};

const cls = (a: PageTransitionAnimation, phase: "in" | "out", pace: PageTransitionPace, tone: PageTransitionTone) => (a === "none" ? "none" : vtClasses(a, phase, pace, tone));

/** Mapa tipo de transición → clases, para `enter` / `exit` del `<ViewTransition>` de React. */
function classMap(phase: "in" | "out", kind: PageTransitionKind, direction: PageTransitionDirection, pace: PageTransitionPace, tone: PageTransitionTone, types: ElementTransitionProps["types"]) {
  const map: Record<string, string> = {};
  for (const a of PAGE_TRANSITION_ANIMATIONS) map[pageTransitionType(a)] = cls(a, phase, pace, tone);
  map[pageTransitionType("slide")] = cls(withDirection("slide", direction), phase, pace, tone);
  map[pageTransitionType("wipe")] = cls(withDirection("wipe", direction), phase, pace, tone);
  map[NAV_FORWARD] = cls(withDirection(kind, direction), phase, pace, tone);
  map[NAV_BACK] = cls(withDirection(kind, OPPOSITE[direction]), phase, pace, tone);
  for (const [type, a] of Object.entries(types ?? {})) map[type] = cls(withDirection(a, direction), phase, pace, tone);
  map.default = cls(withDirection(kind, direction), phase, pace, tone);
  return map;
}

/**
 * Anima la entrada y la salida del elemento que envuelve cuando se monta o se desmonta dentro de una transición de React
 * (`startTransition`, una navegación del App Router, `<Suspense>`). Para cambiar de contenido, cambia su `key`. No añade
 * nodos al DOM. Sin soporte, el cambio es inmediato.
 */
export default function ElementTransition({ kind = "fade", direction = "left", pace = "normal", tone = "acc", types, children }: ElementTransitionProps) {
  if (!ViewTransition) return <Fragment>{children}</Fragment>;
  return (
    <ViewTransition enter={classMap("in", kind, direction, pace, tone, types)} exit={classMap("out", kind, direction, pace, tone, types)} update="none" default="none">
      {children}
    </ViewTransition>
  );
}

export type SharedTransitionProps = {
  /** nombre compartido: el mismo en la página de salida y en la de llegada, y único en cada una (p. ej. `foto-${id}`) */
  name: string;
  /** duración del morph: `fast` ≈ 240 ms, `normal` ≈ 380 ms, `slow` ≈ 560 ms */
  pace?: PageTransitionPace;
  children: ReactNode;
};

/**
 * Elemento compartido entre dos vistas (la miniatura de un listado y la imagen grande de su ficha): si en una transición
 * desaparece uno y aparece otro con el mismo `name`, el navegador lo transforma de una caja a la otra (posición, tamaño
 * y fundido cruzado), por encima de la animación de página. Fuera de ese caso no anima nada.
 */
export function SharedTransition({ name, pace = "normal", children }: SharedTransitionProps) {
  if (!ViewTransition) return <Fragment>{children}</Fragment>;
  return (
    <ViewTransition name={name} share={`ui-vt-morph ui-vt--${pace}`} enter="none" exit="none" update="none" default="none">
      {children}
    </ViewTransition>
  );
}
