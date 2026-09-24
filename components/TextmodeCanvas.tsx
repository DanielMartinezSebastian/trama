"use client";

import { useEffect, useRef } from "react";
import { sketches } from "@/lib/sketches/registry";

/**
 * Monta un sketch de textmode.js como fondo a pantalla completa.
 * El canvas se crea dentro del efecto (y se elimina al desmontar) para que el
 * doble montaje de React StrictMode no reutilice un contexto WebGL ya destruido.
 */
export default function TextmodeCanvas({ slug, overlay = false }: { slug: string; overlay?: boolean }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = host.current;
    const sketch = sketches[slug];
    if (!container || !sketch) return;

    let disposed = false;
    let instance: { destroy: () => void } | null = null;
    const canvas = document.createElement("canvas");
    canvas.className = "textmode-canvas";
    // Con un canvas existente, textmode.js toma el tamaño del propio elemento
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    container.appendChild(canvas);

    (async () => {
      const { textmode } = await import("textmode.js");
      if (disposed) return;

      const t = textmode.create({
        canvas,
        width: window.innerWidth,
        height: window.innerHeight,
        fontSize: sketch.fontSize,
        frameRate: 60,
        pixelDensity: Math.min(window.devicePixelRatio || 1, 2),
      });
      instance = t;

      t.windowResized(() => t.resizeCanvas(window.innerWidth, window.innerHeight));
      sketch.setup(t);
    })().catch((err) => console.error("[textmode] error al iniciar", err));

    return () => {
      disposed = true;
      instance?.destroy();
      canvas.remove();
    };
  }, [slug]);

  return <div ref={host} className={overlay ? "stage stage--overlay" : "stage"} aria-hidden />;
}
