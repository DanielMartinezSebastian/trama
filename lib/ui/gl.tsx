"use client";

import { Component, useEffect, useState, type ReactNode, type RefObject } from "react";
import { hasWebGL, lowPower } from "./capability";

/**
 * Piezas comunes de los componentes con WebGL opcional (`ObjectStage`, `Logo3D`, `DeviceMockup3D`, `DistortImage`,
 * `ExplorableCanvas depth="3d"`): todos pintan primero una versión plana y solo cargan three cuando el equipo puede, no se pide
 * reducir movimiento y el elemento está cerca de la pantalla. Si el lienzo falla, se quedan con la versión plana.
 */

/** si el lienzo falla (sin WebGL, contexto perdido al crear), no pinta nada y avisa para volver a la versión plana */
export class GLBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export type GLGateOptions = {
  /** se quiere 3D (p. ej. `render !== "static"` y sin movimiento reducido) */
  want: boolean;
  /** `render="3d"`: también en equipos modestos */
  force?: boolean;
  /** margen para crear el lienzo antes de que el elemento entre en pantalla */
  margin?: string;
  /** true: mientras se comprueba el equipo cuenta como capaz (para no cambiar de caja al hidratar) */
  optimistic?: boolean;
};

export type GLGate = {
  /** se va a usar 3D */
  use3d: boolean;
  /** el lienzo ya se creó alguna vez (se queda montado al salir de pantalla) */
  mounted: boolean;
  /** el elemento está cerca de la pantalla: el lienzo dibuja */
  near: boolean;
  /** el lienzo falló: vuelve a la versión plana */
  fail: () => void;
};

/** Decide si se dibuja en 3D y cuándo se crea el lienzo (al acercarse a la pantalla) y cuándo deja de dibujar (al alejarse). */
export function useGLGate(root: RefObject<HTMLElement | null>, { want, force = false, margin = "120px", optimistic = false }: GLGateOptions): GLGate {
  const [capable, setCapable] = useState<boolean | null>(null);
  const [failed, setFailed] = useState(false);
  const [near, setNear] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (want) setCapable(hasWebGL() && (force || !lowPower()));
  }, [want, force]);

  const use3d = want && (optimistic ? capable !== false : capable === true) && !failed;

  useEffect(() => {
    const el = root.current;
    if (!el || !use3d) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setNear(e.isIntersecting);
        if (e.isIntersecting) setMounted(true);
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [use3d, margin, root]);

  return { use3d, mounted, near, fail: () => setFailed(true) };
}
