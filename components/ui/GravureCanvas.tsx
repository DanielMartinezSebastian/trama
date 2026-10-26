"use client";

import { Suspense, lazy, useCallback, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { GLBoundary, useGLGate } from "@/lib/ui/gl";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { useTokens } from "@/lib/ui/useTokens";
import { sobreFondo } from "@/lib/ui/color";
import type { AjusteLapiz } from "@/lib/gravure/canvas";
import type { OpcionesLapiz } from "@/lib/gravure/material";

// three (con su WebGPURenderer) y react-three-fiber solo se descargan cuando la pieza está cerca de la pantalla
const GravureCanvasScene = lazy(() => import("@/lib/gravure/canvas"));

export type GravureCanvasProps = {
  /** la escena: elementos de react-three-fiber (mallas, grupos, modelos). Sus materiales se sustituyen por el lápiz */
  children?: ReactNode;
  /** contenido HTML encima de la escena (titular, botones) */
  overlay?: ReactNode;
  /** alto en px (o cualquier medida CSS); el ancho es el del contenedor */
  height?: number | string;
  /**
   * ajuste del lápiz para las mallas que no digan otro en `userData.lapiz`: objeto, suelo, follaje (escenas de tamaño
   * normal) o terreno, casa, arbol (los de Chartogne, a escala de un paisaje de 10 m); o las opciones del material
   */
  preset?: AjusteLapiz | OpcionesLapiz;
  /** posición de la cámara (mira al origen) y su campo de visión vertical */
  camera?: { position?: [number, number, number]; fov?: number };
  /** segundos que tarda el dibujo en entrar por baldosas; 0 = sin entrada */
  intro?: number;
  /** grosor de los contornos (la referencia: 0,5) */
  lineWidth?: number;
  /** grano del papel (la referencia: 0,123) */
  grain?: number;
  /** auto = 3D si el equipo puede y no pide reducir movimiento · static = solo el rayado plano */
  render?: "auto" | "static";
  className?: string;
};

/**
 * Cualquier escena 3D dibujada como un grabado a lápiz sobre papel: rayado que engorda con la sombra, contornos de Sobel
 * más gruesos cerca, grano y fibra del papel, viñeta que se funde con el papel y entrada por baldosas. Envuelve hijos de
 * react-three-fiber: las mallas se pintan con el material de lápiz (cada una puede pedir su ajuste con
 * `userData={{ lapiz: "follaje" }}`, o quedarse fuera con `userData={{ sinLapiz: true }}`). Técnica medida en
 * Chartogne-Taillet (docs/32) y generalizada en docs/36 D1; `EngravedMap` es el paisaje de la referencia hecho con ella.
 * Para portadas editoriales, objetos de producto «dibujados», mapas, arquitectura o cualquier 3D que no quiera parecer
 * 3D. Colores del tema: papel de --card (o del fondo) y lápiz de --mut. Sin WebGL o con movimiento reducido, un rayado
 * plano.
 *
 * Requiere `three` y `@react-three/fiber` (dependencias opcionales del paquete): se importa por subruta, `trama-ui/GravureCanvas`.
 */
export default function GravureCanvas({ children, overlay, height = 480, preset = "objeto", camera, intro = 1.5, lineWidth = 0.5, grain = 0.123, render = "auto", className = "" }: GravureCanvasProps) {
  const root = useRef<HTMLDivElement>(null);
  const tokens = useTokens(root);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const { use3d, mounted, near, fail } = useGLGate(root, { want: render === "auto" && !reduced });
  const onReady = useCallback(() => setReady(true), []);

  const papel = sobreFondo(tokens?.["--card"], tokens?.["--bg"]) || "#fff5dd";
  const lapiz = tokens?.["--mut"] || "#8c887d";
  const grabado = useMemo(() => ({ papel, lapiz, anchoLinea: lineWidth, grano: grain }), [papel, lapiz, lineWidth, grain]);
  const camara = useMemo(() => ({ posicion: camera?.position ?? ([3.2, 2.2, 4.2] as [number, number, number]), fov: camera?.fov ?? 40 }), [camera?.position, camera?.fov]);

  return (
    <div ref={root} className={`ui-em ${className}`.trim()} style={{ height, "--em-paper": papel, "--em-pencil": lapiz } as CSSProperties}>
      {!ready && <div className="ui-em__flat" aria-hidden />}
      {use3d && mounted && (
        <div className={`ui-em__gl ${ready ? "is-on" : ""}`} aria-hidden>
          <GLBoundary onError={fail}>
            <Suspense fallback={null}>
              <GravureCanvasScene grabado={grabado} ajuste={preset} camara={camara} entrada={reduced ? 0 : intro} active={near} onReady={onReady}>
                {children}
              </GravureCanvasScene>
            </Suspense>
          </GLBoundary>
        </div>
      )}
      {overlay && <div className="ui-em__content">{overlay}</div>}
    </div>
  );
}
