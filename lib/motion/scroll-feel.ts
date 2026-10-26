/**
 * La sensación del scroll (docs/42): las tres etapas que hacen que una animación ligada al scroll se sienta como Quilate,
 * con nombre, para que cada web elija una y no números sueltos.
 *   1. entrada con inercia: el `lerp` y el multiplicador de rueda de Lenis (`SmoothScroll`);
 *   2. mapeo por tramos: cuánto de cada tramo se queda quieto (`plateau`) y con qué curva se recorre el resto;
 *   3. seguimiento amortiguado: con qué rapidez lo que se mueve persigue a su objetivo (`damp`, en 1/s), lo geométrico
 *      (`pose`) más rápido que lo material (`look`).
 * Sin React y sin el DOM: lo leen `SmoothScroll`, `useScrollStory`, las piezas del kit y las escenas.
 */

export type Curva = "linear" | "smooth" | "smoother" | "power2.out" | "power3.out" | "power2.inOut" | "sine.inOut" | "expo.out";

export type ScrollFeel = {
  /** Lenis: cuánto se acerca el scroll a su destino en cada fotograma (menos = más cola al soltar la rueda) */
  lerp: number;
  wheelMultiplier: number;
  /** fracción de cada tramo que se queda quieta en el centro de los pasos */
  plateau: number;
  /** curva del recorrido entre mesetas */
  curve: Curva;
  /** rapidez del seguimiento amortiguado (1/s): la pose y el aspecto (materiales, luz, color) */
  damp: { pose: number; look: number };
};

export const SCROLL_FEELS = {
  /** el de Quilate (docs/19 §7): cola larga, meseta del 30 % y una S; la pose sigue rápida y el aspecto despacio */
  cinematic: { lerp: 0.04, wheelMultiplier: 0.85, plateau: 0.3, curve: "smooth", damp: { pose: 9, look: 4 } },
  /** relato de texto con imágenes: algo menos de cola y mesetas más cortas */
  editorial: { lerp: 0.07, wheelMultiplier: 1, plateau: 0.2, curve: "smooth", damp: { pose: 7, look: 4 } },
  /** interfaces y catálogos: responde enseguida, sin mesetas */
  snappy: { lerp: 0.1, wheelMultiplier: 1, plateau: 0, curve: "power2.out", damp: { pose: 14, look: 8 } },
} satisfies Record<string, ScrollFeel>;

export type ScrollFeelName = keyof typeof SCROLL_FEELS;

/** la sensación de la página: la que publica `SmoothScroll` en `<html data-scroll-feel>`; si no hay, `cinematic` */
export function pageFeel(): ScrollFeel {
  const n = typeof document !== "undefined" ? (document.documentElement.dataset.scrollFeel as ScrollFeelName | undefined) : undefined;
  return SCROLL_FEELS[n && n in SCROLL_FEELS ? n : "cinematic"];
}

/** una sensación por nombre, un objeto propio o, si no se da, la de la página */
export const resolveFeel = (feel?: ScrollFeelName | ScrollFeel): ScrollFeel => (typeof feel === "string" ? SCROLL_FEELS[feel] : (feel ?? pageFeel()));

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

export const CURVAS: Record<Curva, (t: number) => number> = {
  linear: (t) => t,
  smooth: (t) => t * t * (3 - 2 * t),
  smoother: (t) => t * t * t * (t * (6 * t - 15) + 10),
  "power2.out": (t) => 1 - (1 - t) ** 2,
  "power3.out": (t) => 1 - (1 - t) ** 3,
  "power2.inOut": (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2),
  "sine.inOut": (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  "expo.out": (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t)),
};

/**
 * El avance de un tramo (0–1 entre dos pasos) con la meseta y la curva: los bordes del tramo (`plateau / 2` a cada lado)
 * no se mueven y el centro se recorre con la curva. Es la etapa 2 de Quilate: `smooth(clamp((raw − 0,15) / 0,7))`.
 */
export function tramo(raw: number, plateau = 0.3, curve: Curva = "smooth") {
  const borde = plateau / 2;
  return CURVAS[curve](clamp01((raw - borde) / Math.max(1e-6, 1 - plateau)));
}

/** cuánto se acerca a su objetivo en `dt` segundos con rapidez `lambda` (1/s): igual a 30, 60 o 144 Hz */
export const dampFactor = (lambda: number, dt: number) => 1 - Math.exp(-lambda * dt);

/** un paso del seguimiento amortiguado: de `actual` hacia `objetivo` */
export const damp = (actual: number, objetivo: number, lambda: number, dt: number) => actual + (objetivo - actual) * dampFactor(lambda, dt);

/**
 * Seguidor de una pose con nombre (etapa 3): guarda el estado y, en cada fotograma, lo acerca al objetivo. Una sola
 * fuente por variable (docs/22, trampas): lo que lo use no debe hacer otro lerp sobre las mismas claves.
 */
export function crearSeguidor<K extends string>(inicial: Record<K, number>, lambda: number) {
  const estado = { ...inicial };
  return {
    estado,
    paso(objetivo: Partial<Record<K, number>>, dt: number, rapidez = lambda) {
      const k = dampFactor(rapidez, Math.min(dt, 0.1));
      for (const c in objetivo) {
        const o = objetivo[c];
        if (o !== undefined) estado[c] += (o - estado[c]) * k;
      }
      return estado;
    },
  };
}

/** interpola dos poses con nombre (las claves que falten valen 0, como en los BEATS de Quilate) */
export function mezclaPose<K extends string>(a: Partial<Record<K, number>>, b: Partial<Record<K, number>>, t: number, claves: readonly K[]) {
  const out = {} as Record<K, number>;
  for (const k of claves) out[k] = (a[k] ?? 0) + ((b[k] ?? 0) - (a[k] ?? 0)) * t;
  return out;
}

/**
 * Un valor que persigue a su objetivo en su propio bucle de fotogramas (para el DOM: variables CSS, transform). `set` fija
 * el objetivo y el bucle solo corre hasta llegar; la primera vez salta directo. Con `lambda = Infinity`, sin amortiguar.
 */
export function seguidorRaf(lambda: number, aplica: (v: number) => void) {
  let objetivo = 0, actual = NaN, raf = 0, antes = 0;
  const tick = (ahora: number) => {
    raf = 0;
    const dt = antes ? Math.min(0.1, (ahora - antes) / 1000) : 1 / 60;
    antes = ahora;
    actual = Number.isFinite(lambda) ? actual + (objetivo - actual) * dampFactor(lambda, dt) : objetivo;
    aplica(actual);
    if (Math.abs(objetivo - actual) > 1e-4) raf = requestAnimationFrame(tick);
    else antes = 0;
  };
  return {
    get valor() {
      return Number.isNaN(actual) ? objetivo : actual;
    },
    set(v: number) {
      objetivo = v;
      if (Number.isNaN(actual)) {
        actual = v;
        aplica(v);
      } else if (!raf) raf = requestAnimationFrame(tick);
    },
    stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}
