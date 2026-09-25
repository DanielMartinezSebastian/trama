"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { useTokens } from "@/lib/ui/useTokens";
import type { BackgroundPosition } from "@/lib/ui/pointerBridge";
import RetroFX, { type RetroFXProps } from "./RetroFX";
import RetroShapes from "./RetroShapes";

export type RetroCanvasProps = RetroFXProps & {
  /** escena react-three-fiber (luces + mallas). Sin hijos se muestra `RetroShapes` de ejemplo */
  children?: ReactNode;
  /** absolute (por defecto) = rellena su contenedor · fixed = cubre la ventana */
  position?: BackgroundPosition;
  /** campo de visión de la cámara, en grados */
  fov?: number;
  /** distancia de la cámara al origen */
  cameraZ?: number;
  /** tope de la densidad de píxeles del lienzo (más alto = más nítido y más coste) */
  maxDpr?: number;
  /** descripción para lectores de pantalla; sin ella el lienzo se marca como decorativo */
  label?: string;
  className?: string;
};

/**
 * Lienzo react-three-fiber con acabado retro: la escena 3D se ve como pixel art, ASCII o ambos, con scanlines, viñeta y
 * curvatura de monitor CRT. Colores por defecto = tokens del tema (--fg sobre --bg, --acc). Rellena su contenedor
 * (que debe tener `position: relative` y tamaño). Pausa fuera de pantalla y con `prefers-reduced-motion` dibuja bajo demanda.
 *
 * Requiere `three` y `@react-three/fiber` (dependencias opcionales del paquete).
 */
export default function RetroCanvas({ children, position = "absolute", fov = 35, cameraZ = 8, maxDpr = 2, label, className = "", fg, bg, accent, ...fx }: RetroCanvasProps) {
  const root = useRef<HTMLDivElement>(null);
  const tokens = useTokens(root);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => {
      io.disconnect();
      mq.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div ref={root} className={`ui-fill ui-retro ${position === "fixed" ? "ui-fill--fixed" : ""} ${className}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <Canvas
        frameloop={!visible ? "never" : reduced ? "demand" : "always"}
        dpr={[1, maxDpr]}
        camera={{ fov, position: [0, 0, cameraZ] }}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      >
        <RetroFX {...fx} fg={fg ?? tokens?.["--fg"] ?? undefined} bg={bg ?? tokens?.["--bg"] ?? undefined} accent={accent ?? tokens?.["--acc"] ?? undefined} />
        {children ?? <RetroShapes />}
      </Canvas>
    </div>
  );
}
