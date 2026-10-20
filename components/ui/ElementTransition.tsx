import { Fragment, type ReactNode } from "react";
import {
  NAV_BACK,
  NAV_FORWARD,
  DIRECTIONAL_TRANSITION_KINDS,
  PAGE_TRANSITION_ANIMATIONS,
  ViewTransition,
  backDirection,
  pageTransitionType,
  vtClasses,
  vtDelayClass,
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
 * 11 animaciones que PageTransition. Para la página entera, usa PageTransition.
 * Sin "use client": funciona en componentes de servidor.
 */

export type ElementTransitionProps = {
  /** animación de las transiciones sin tipo (y base de `nav-forward` / `nav-back`); `none` = solo animan las que llevan tipo */
  kind?: PageTransitionKind;
  /** hacia dónde se mueve el contenido, la banda, la línea o la pila en `slide`, `wipe`, `scan` y `stack` (por defecto `down` en `scan` y `left` en el resto); `nav-back` usa la contraria */
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
function classMap(phase: "in" | "out", kind: PageTransitionKind, direction: PageTransitionDirection | undefined, pace: PageTransitionPace, tone: PageTransitionTone, types: ElementTransitionProps["types"]) {
  const map: Record<string, string> = {};
  for (const a of PAGE_TRANSITION_ANIMATIONS) map[pageTransitionType(a)] = cls(a, phase, pace, tone);
  for (const k of DIRECTIONAL_TRANSITION_KINDS) map[pageTransitionType(k)] = cls(withDirection(k, direction), phase, pace, tone);
  map[NAV_FORWARD] = cls(withDirection(kind, direction), phase, pace, tone);
  map[NAV_BACK] = cls(withDirection(kind, backDirection(kind, direction)), phase, pace, tone);
  for (const [type, a] of Object.entries(types ?? {})) map[type] = cls(withDirection(a, direction), phase, pace, tone);
  map.default = cls(withDirection(kind, direction), phase, pace, tone);
  return map;
}

/**
 * Anima la entrada y la salida del elemento que envuelve cuando se monta o se desmonta dentro de una transición de React
 * (`startTransition`, una navegación del App Router, `<Suspense>`). Para cambiar de contenido, cambia su `key`. No añade
 * nodos al DOM. Sin soporte, el cambio es inmediato.
 */
export default function ElementTransition({ kind = "fade", direction, pace = "normal", tone = "acc", types, children }: ElementTransitionProps) {
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
  /** si las dos cajas tienen distinta proporción: `cover` recorta las dos imágenes del morph (fotos, vídeo); `auto` es lo del navegador (bien para texto) */
  fit?: "auto" | "cover";
  /** también anima los cambios de sitio dentro de la misma vista (reordenar, filtrar): se desliza a su caja nueva y, si entra o sale, se funde */
  layout?: boolean;
  /** retraso del morph en ms (pasos de 40, hasta 800): coreografía, para que no se mueva todo a la vez */
  delay?: number;
  children: ReactNode;
};

/**
 * Elemento compartido entre dos vistas (la miniatura de un listado y la imagen grande de su ficha): si en una transición
 * desaparece uno y aparece otro con el mismo `name`, el navegador lo transforma de una caja a la otra (posición, tamaño
 * y fundido cruzado), por encima de la animación de página. Fuera de ese caso no anima nada, salvo con `layout`.
 */
export function SharedTransition({ name, pace = "normal", fit = "auto", layout = false, delay = 0, children }: SharedTransitionProps) {
  if (!ViewTransition) return <Fragment>{children}</Fragment>;
  const morph = `ui-vt-morph ui-vt--${pace}${fit === "cover" ? " ui-vt-morph--cover" : ""}${vtDelayClass(delay)}`;
  return (
    <ViewTransition
      name={name}
      share={morph}
      enter={layout ? vtClasses("fade", "in", pace, "acc") : "none"}
      exit={layout ? vtClasses("fade", "out", pace, "acc") : "none"}
      update={layout ? morph : "none"}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}

export type SharedTextProps = {
  /** nombre base: cada palabra se llama `${name}-0`, `${name}-1`…; el mismo en las dos vistas */
  name: string;
  /** el texto (plano): se trocea por palabras */
  text: string;
  as?: "span" | "p" | "div" | "h1" | "h2" | "h3";
  /** retraso entre una palabra y la siguiente, en ms (escalonado) */
  stagger?: number;
  /** retraso de la primera palabra, en ms */
  delay?: number;
  /** duración de cada palabra: `fast` ≈ 240 ms, `normal` ≈ 380 ms, `slow` ≈ 560 ms */
  pace?: PageTransitionPace;
  className?: string;
};

/**
 * Texto que viaja palabra a palabra entre dos vistas: el mismo `name` y el mismo texto en las dos (pequeño en una
 * esquina en una página, titular gigante en otra) y cada palabra vuela a su sitio nuevo, escalonada. El tamaño, la
 * posición y el color los pone el CSS de cada vista. Lectores de pantalla: leen el texto entero una vez.
 * Cada palabra lleva `ui-stext__w--<n>` (desde 0) para darle estilo propio. Si una vista tiene palabras de más, esas
 * solo aparecen o desaparecen.
 */
export function SharedText({ name, text, as: Tag = "span", stagger = 50, delay = 0, pace = "slow", className = "" }: SharedTextProps) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <Tag className={`ui-stext ${className}`.trim()}>
      <span className="ui-stext__sr">{text}</span>
      {words.map((w, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <SharedTransition name={`${name}-${i}`} pace={pace} delay={delay + i * stagger}>
            <span className={`ui-stext__w ui-stext__w--${i}`} aria-hidden>
              {w}
            </span>
          </SharedTransition>
        </Fragment>
      ))}
    </Tag>
  );
}
