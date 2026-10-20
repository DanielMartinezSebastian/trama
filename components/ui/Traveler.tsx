"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { ViewTransition, vtDelayClass, type PageTransitionPace } from "@/lib/ui/viewTransitions";

/*
 * Elementos que VIAJAN entre rutas sin desaparecer (View Transitions API). El elemento vive en el layout (TravelStage),
 * así que no se desmonta al navegar: un vídeo sigue sonando, un lienzo sigue animando, un estado no se pierde. Cada página
 * declara con TravelSlot el hueco que ocupa en ella (tamaño y sitio los pone el CSS de la página). Al cambiar de ruta el
 * elemento se recoloca sobre el hueco nuevo dentro del mismo commit, y como lleva `view-transition-name`, el navegador
 * anima su caja de la vieja a la nueva: posición, tamaño y proporción, con el contenido en directo.
 *
 * Es la versión de una SPA de lo que las webs multipágina imitan guardando el estado (la demo «Video Zoom» de Chrome
 * guarda `currentTime` en `pageswap` y lo restaura en `pagereveal`): aquí el nodo es el mismo.
 *
 * Cómo coloca: el viajero va en `position: absolute` dentro del escenario (que es `position: relative`) con la caja del
 * hueco medida respecto al escenario, así que hace scroll con la página sin escuchar el scroll. Si el hueco o algún
 * antecesor es `position: fixed`, el viajero pasa a `fixed` con la caja del hueco en el viewport (mini reproductor en una
 * esquina, cabecera fija). Con un antecesor `sticky` se vuelve a medir al hacer scroll.
 *
 * Por qué funciona con React: los huecos se registran en efectos de layout, que corren dentro del callback de
 * `document.startViewTransition` (el commit de la navegación). La recolocación es una escritura directa en el DOM cuando
 * termina la actualización de la transición (`updateCallbackDone`), antes de que el navegador capture el estado nuevo. El viajero no es un boundary de React: React no lo
 * cancela ni lo oculta (ver PageTransitionPersist, mismo motivo).
 */

export type TravelFit = "cover" | "stretch";
export type TravelBlend = "live" | "crossfade";

type ActiveVt = { updateCallbackDone?: Promise<unknown> };
type VtDocument = Document & { activeViewTransition?: ActiveVt | null; __reactViewTransition?: ActiveVt | null };
/** La View Transition del documento en curso, si la hay (estándar o la que registra React al iniciarla). */
const activeTransition = () => (document as VtDocument).activeViewTransition ?? (document as VtDocument).__reactViewTransition ?? null;

type Slot = { el: HTMLElement; at: string; priority: number; order: number };
type Rider = { el: HTMLElement; slot: Slot | null; placed: boolean; onMove?: (at: string | null) => void; cleanup?: () => void };

/** Registro de un escenario: huecos por id, viajeros por id y suscriptores de `useTraveler`. */
function createStore() {
  const slots = new Map<string, Set<Slot>>();
  const riders = new Map<string, Rider>();
  const listeners = new Set<() => void>();
  let stage: HTMLElement | null = null;
  let order = 0;
  let queued = false;

  const best = (id: string) => {
    let pick: Slot | null = null;
    for (const s of slots.get(id) ?? []) if (!pick || s.priority > pick.priority || (s.priority === pick.priority && s.order > pick.order)) pick = s;
    return pick;
  };

  /** Fijo si el hueco o un antecesor (hasta el escenario) es `fixed`; `sticky` si alguno lo es (hay que medir al hacer scroll). */
  const anchorOf = (el: HTMLElement) => {
    let sticky = false;
    for (let n: HTMLElement | null = el; n && n !== stage; n = n.parentElement) {
      const p = getComputedStyle(n).position;
      if (p === "fixed") return { fixed: true, sticky };
      if (p === "sticky") sticky = true;
    }
    return { fixed: false, sticky };
  };

  const measure = (r: Rider) => {
    const slot = r.slot;
    if (!slot || !stage) return;
    const box = slot.el.getBoundingClientRect();
    const { fixed } = anchorOf(slot.el);
    const s = r.el.style;
    if (fixed) {
      s.position = "fixed";
      s.left = `${box.left}px`;
      s.top = `${box.top}px`;
    } else {
      const base = stage.getBoundingClientRect();
      s.position = "absolute";
      s.left = `${box.left - base.left}px`;
      s.top = `${box.top - base.top}px`;
    }
    s.width = `${box.width}px`;
    s.height = `${box.height}px`;
  };

  /** Observa el hueco actual: cambios de tamaño del hueco y del escenario, ventana y, con `sticky`, el scroll. */
  const watch = (r: Rider) => {
    r.cleanup?.();
    const slot = r.slot;
    if (!slot) return;
    let raf = 0;
    const again = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => measure(r));
    };
    const ro = new ResizeObserver(again);
    ro.observe(slot.el);
    if (stage) ro.observe(stage);
    addEventListener("resize", again);
    const { sticky } = anchorOf(slot.el);
    if (sticky) addEventListener("scroll", again, { passive: true });
    r.cleanup = () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      removeEventListener("resize", again);
      removeEventListener("scroll", again);
    };
  };

  const move = (id: string, r: Rider) => {
    const next = best(id);
    if (next === r.slot && r.placed) return false;
    const prev = r.slot;
    prev?.el.removeAttribute("data-travel-host");
    r.slot = next;
    const el = r.el;
    // la clase de la transición se lee del estado nuevo: un viaje anima la caja; aparecer o irse, solo un fundido
    const mode = !next ? "leave" : !prev || !r.placed ? "arrive" : "move";
    el.style.setProperty("view-transition-class", `${el.dataset.travelClass ?? ""} ui-vt-travel--${mode}`.trim());
    if (next) {
      next.el.setAttribute("data-travel-host", "");
      el.setAttribute("data-at", next.at);
      el.removeAttribute("data-away");
      el.inert = false;
      measure(r);
      r.placed = true;
    } else {
      // se queda donde estaba, invisible e inerte: el contenido sigue vivo (un vídeo, si no lo pausas en `onMove`, suena)
      el.setAttribute("data-away", "");
      el.removeAttribute("data-at");
      el.inert = true;
    }
    watch(r);
    r.onMove?.(next ? next.at : null);
    return true;
  };

  const flush = () => {
    queued = false;
    let changed = false;
    for (const [id, r] of riders) changed = move(id, r) || changed;
    if (changed) listeners.forEach((l) => l());
  };

  /**
   * Se decide una sola vez, cuando ya se fue el hueco viejo y llegó el nuevo. Con una View Transition en curso, al
   * terminar su actualización del DOM (`updateCallbackDone`), justo antes de que el navegador capture el estado nuevo:
   * React no siempre lo hace todo en un paso (espera, por ejemplo, a que carguen las imágenes de la página nueva), y
   * decidir antes dejaba al viajero «sin hueco» (invisible) en la captura. Sin transición, en una microtarea.
   */
  const schedule = () => {
    if (queued) return;
    queued = true;
    const vt = activeTransition();
    if (vt?.updateCallbackDone) vt.updateCallbackDone.then(flush, flush);
    else queueMicrotask(flush);
  };

  return {
    setStage(el: HTMLElement | null) {
      stage = el;
      schedule();
    },
    attach(id: string, el: HTMLElement, at: string, priority: number) {
      const slot: Slot = { el, at, priority, order: ++order };
      if (!slots.has(id)) slots.set(id, new Set());
      slots.get(id)!.add(slot);
      schedule();
      return () => {
        slots.get(id)?.delete(slot);
        el.removeAttribute("data-travel-host");
        schedule();
      };
    },
    ride(id: string, el: HTMLElement, onMove?: (at: string | null) => void) {
      const r: Rider = { el, slot: null, placed: false, onMove };
      riders.set(id, r);
      schedule();
      return () => {
        r.cleanup?.();
        r.slot?.el.removeAttribute("data-travel-host");
        if (riders.get(id) === r) riders.delete(id);
      };
    },
    setOnMove(id: string, fn?: (at: string | null) => void) {
      const r = riders.get(id);
      if (r) r.onMove = fn;
    },
    at: (id: string) => riders.get(id)?.slot?.at ?? null,
    subscribe(fn: () => void) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

type Store = ReturnType<typeof createStore>;
const TravelContext = createContext<Store | null>(null);

export type TravelStageProps = {
  /** etiqueta del contenedor (`position: relative`; los viajeros se colocan respecto a él) */
  as?: "div" | "main" | "section";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * Escenario de los viajeros: va en el LAYOUT (persiste entre rutas) y envuelve a la vez a los `Traveler` y a la página
 * (`children`), que es donde están los huecos.
 */
export function TravelStage({ as: Tag = "div", className = "", style, children }: TravelStageProps) {
  const [store] = useState(createStore);
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    store.setStage(ref.current);
    return () => store.setStage(null);
  }, [store]);
  return (
    <TravelContext.Provider value={store}>
      <Tag ref={ref as never} className={`ui-travel-stage ${className}`.trim()} style={style}>
        {children}
      </Tag>
    </TravelContext.Provider>
  );
}

export type TravelerProps = {
  /** id del viajero: el mismo que llevan sus `TravelSlot`; único en el escenario */
  id: string;
  /** cómo se adapta la imagen del viaje si cambia la proporción: `cover` recorta (fotos, vídeo), `stretch` estira (texto con la misma proporción) */
  fit?: TravelFit;
  /** `live`: solo se ve el estado nuevo, en directo, cambiando de caja (vídeo, lienzos); `crossfade`: funde el viejo con el nuevo (si el contenido cambia de forma) */
  blend?: TravelBlend;
  /** duración del viaje: `fast` ≈ 420 ms, `normal` ≈ 640 ms, `slow` ≈ 900 ms */
  pace?: PageTransitionPace;
  /** retraso del viaje en ms (pasos de 40, hasta 800): que salga después de otra cosa */
  delay?: number;
  /** se llama al cambiar de hueco con su `at` (o `null` si la página no tiene hueco para él): p. ej. pausar un vídeo */
  onMove?: (at: string | null) => void;
  className?: string;
  children: ReactNode;
};

/**
 * Elemento que persiste entre rutas y viaja de hueco en hueco. Va dentro de `TravelStage`, en el layout. Lleva
 * `data-at="<at del hueco>"` para que el CSS cambie su aspecto en cada sitio (`.mi-reel[data-at="mini"] …`), y
 * `data-away` (invisible e inerte) en las páginas sin hueco para él. Hasta que hidrata, no se ve.
 */
export default function Traveler({ id, fit = "cover", blend = "live", pace = "normal", delay = 0, onMove, className = "", children }: TravelerProps) {
  const store = useContext(TravelContext);
  const ref = useRef<HTMLDivElement>(null);
  const cls = `ui-vt-travel ui-vt-travel--${pace} ui-vt-travel--${fit} ui-vt-travel--${blend}${vtDelayClass(delay)}`;
  useLayoutEffect(() => {
    if (!store || !ref.current) return;
    return store.ride(id, ref.current);
  }, [store, id]);
  useLayoutEffect(() => {
    store?.setOnMove(id, onMove);
  }, [store, id, onMove]);
  return (
    <div
      ref={ref}
      className={`ui-traveler ${className}`.trim()}
      data-away=""
      data-travel-class={cls}
      style={{ viewTransitionName: `ui-travel-${id}`, viewTransitionClass: cls } as CSSProperties}
    >
      {children}
    </div>
  );
}

export type TravelSlotProps = {
  /** id del viajero que se coloca aquí */
  id: string;
  /** nombre de este sitio: llega al viajero como `data-at` (su CSS cambia de aspecto según dónde está) */
  at?: string;
  /** con varios huecos del mismo viajero a la vez (uno en la cabecera del layout y otro en la portada), gana el de prioridad más alta; empate, el último montado */
  priority?: number;
  /** `span` para un hueco dentro de un texto (un titular con el vídeo en una píldora) */
  as?: "div" | "span" | "figure";
  /** el tamaño y el sitio del hueco son los de este elemento: dáselos por CSS (ancho, `aspect-ratio`, `position: fixed`…) */
  className?: string;
  style?: CSSProperties;
  /** lo que se ve debajo hasta que llega el viajero (un póster, un fondo): el viajero lo tapa */
  children?: ReactNode;
};

/**
 * Hueco de una página para un viajero: el viajero se coloca exactamente sobre esta caja. Para cambiarlo de hueco dentro de
 * la misma página (modo cine, ampliar), monta otro hueco dentro de `startTransition`. Lleva `data-travel-host` mientras
 * lo ocupa.
 */
export function TravelSlot({ id, at = "default", priority = 0, as: Tag = "div", className = "", style, children }: TravelSlotProps) {
  const store = useContext(TravelContext);
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!store || !ref.current) return;
    return store.attach(id, ref.current, at, priority);
  }, [store, id, at, priority]);
  const slot = (
    <Tag ref={ref as never} className={`ui-travel-slot ${className}`.trim()} style={style} data-travel-slot={id}>
      {children}
    </Tag>
  );
  // Un boundary «vacío» (todo a none): que montar o desmontar el hueco dentro de una transición de React (navegación,
  // startTransition) sea una View Transition aunque la página no lleve PageTransition.
  if (!ViewTransition) return slot;
  return (
    <ViewTransition enter="none" exit="none" update="none" share="none" default="none">
      {slot}
    </ViewTransition>
  );
}

/** Dónde está ahora el viajero `id` (el `at` de su hueco, o `null` si la página no tiene hueco para él). */
export function useTraveler(id: string) {
  const store = useContext(TravelContext);
  const subscribe = useCallback((fn: () => void) => store?.subscribe(fn) ?? (() => {}), [store]);
  return useSyncExternalStore(
    subscribe,
    () => store?.at(id) ?? null,
    () => null,
  );
}
