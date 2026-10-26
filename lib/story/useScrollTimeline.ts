"use client";

import { useEffect, useRef, type RefObject } from "react";
import { crearSeguidor, mezclaPose, resolveFeel, tramo, type Curva, type ScrollFeel, type ScrollFeelName } from "@/lib/motion/scroll-feel";
import { useScrollStory, type ScrollStoryOptions } from "./useScrollStory";

/**
 * Línea de tiempo por scroll (docs/42): la tubería de Quilate entera en una pieza. Los pasos del texto (`[data-step]`) son
 * los fotogramas clave; cada uno lleva una pose con nombre (`{ yaw: 1.2, zoom: 0.9 }`). Con el scroll:
 *   1. la entrada con inercia la pone `SmoothScroll feel` (la misma sensación que lee esto);
 *   2. el tramo entre dos pasos se recorre con meseta y curva (las de la sensación, o las del paso de destino);
 *   3. la pose sigue al objetivo amortiguada, igual a 30, 60 o 144 Hz.
 * La pose se publica de dos formas: variables CSS en el escenario (`--tl-<clave>`) y `pose.current` para lo que no es CSS
 * (una escena 3D la lee en su bucle). Todo lo del tramo comparte el mismo avance: lo que se mueve va a la vez.
 */
export type TimelineBeat<K extends string> = {
  pose: Partial<Record<K, number>>;
  /** curva y meseta del tramo que llega a este paso (si no, las de la sensación) */
  curve?: Curva;
  plateau?: number;
};

export type ScrollTimelineOptions<K extends string> = Omit<ScrollStoryOptions, "onFrame" | "plateau" | "curve"> & {
  beats: TimelineBeat<K>[];
  keys: readonly K[];
  feel?: ScrollFeelName | ScrollFeel;
  /** rapidez del seguimiento (1/s); false = sin amortiguar (la pose es el objetivo). Por defecto, la de la sensación */
  damp?: number | false;
  /** prefijo de las variables CSS (por defecto `--tl-`); null = no escribirlas */
  cssPrefix?: string | null;
  /** cada fotograma con la pose ya amortiguada */
  onPose?: (pose: Record<K, number>) => void;
};

export function useScrollTimeline<K extends string>(list: RefObject<HTMLElement | null>, stage: RefObject<HTMLElement | null>, { beats, keys, feel, damp, cssPrefix = "--tl-", onPose, ...story }: ScrollTimelineOptions<K>) {
  const inicial = mezclaPose(beats[0]?.pose ?? {}, beats[0]?.pose ?? {}, 0, keys);
  const objetivo = useRef<Record<K, number>>({ ...inicial });
  const pose = useRef<Record<K, number>>({ ...inicial });
  const despierta = useRef<() => void>(() => {});

  useScrollStory(list, stage, {
    ...story,
    feel,
    onFrame: ({ j, next, raw }) => {
      const f = resolveFeel(feel);
      const b = beats[next] ?? beats[j];
      const t = tramo(raw, b?.plateau ?? f.plateau, b?.curve ?? f.curve);
      objetivo.current = mezclaPose(beats[j]?.pose ?? {}, b?.pose ?? {}, t, keys);
      despierta.current();
    },
  });

  // la etapa 3: un bucle que solo corre mientras la pose no ha llegado a su objetivo
  useEffect(() => {
    const f = resolveFeel(feel);
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rapidez = damp === false || quieto ? Infinity : (damp ?? f.damp.pose);
    const seguidor = crearSeguidor(pose.current, Number.isFinite(rapidez) ? rapidez : 1);
    let raf = 0, antes = 0;
    const escribe = () => {
      const st = stage.current?.style;
      if (st && cssPrefix !== null) for (const k of keys) st.setProperty(`${cssPrefix}${k}`, pose.current[k].toFixed(4));
      onPose?.(pose.current);
    };
    const tick = (ahora: number) => {
      raf = 0;
      const dt = antes ? Math.min(0.1, (ahora - antes) / 1000) : 1 / 60;
      antes = ahora;
      let falta = 0;
      if (!Number.isFinite(rapidez)) Object.assign(pose.current, objetivo.current);
      else {
        Object.assign(pose.current, seguidor.paso(objetivo.current, dt));
        for (const k of keys) falta = Math.max(falta, Math.abs(objetivo.current[k] - pose.current[k]));
      }
      escribe();
      if (falta > 1e-4) raf = requestAnimationFrame(tick);
      else antes = 0;
    };
    despierta.current = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    despierta.current();
    return () => {
      cancelAnimationFrame(raf);
      despierta.current = () => {};
    };
    // las poses y las claves se fijan al montar, como en useScrollStory
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feel, damp, cssPrefix]);

  return { pose, objetivo };
}
