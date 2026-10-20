"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";

export type ImageTrailProps = {
  /** imágenes separadas por comas; se van mostrando en orden y vuelven a empezar */
  images: string;
  /** ancho de cada imagen en px */
  imageWidth?: number;
  /** px que tiene que recorrer el puntero para soltar la siguiente */
  threshold?: number;
  /** segundos que tarda cada imagen en desaparecer */
  lifetime?: number;
  /** giro aleatorio máximo en grados */
  rotate?: number;
  className?: string;
  style?: CSSProperties;
  /** el contenido de la zona (un titular, por ejemplo): queda por encima de la estela */
  children?: ReactNode;
};

/**
 * Estela de imágenes: al mover el puntero por la zona van apareciendo fotos donde está, que crecen y se desvanecen (uno de los
 * efectos más repetidos en portfolios premiados). Decorativa: las imágenes van `aria-hidden` y sin `alt`; lo que cuenta va en
 * `children`. Solo con puntero fino y sin movimiento reducido; en táctil la zona es su contenido y nada más. Un grupo fijo de
 * 10 `<img>` que se reciclan: no crea nodos al mover el ratón.
 */
export default function ImageTrail({ images, imageWidth = 220, threshold = 80, lifetime = 0.9, rotate = 8, className = "", style, children }: ImageTrailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pool = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const list = images.split(",").map((s) => s.trim()).filter(Boolean);
  const key = list.join("|");

  useEffect(() => {
    const el = ref.current;
    const box = pool.current;
    if (!el || !box || reduced || !list.length || !matchMedia("(pointer: fine)").matches) return;
    const nodes = Array.from(box.children) as HTMLImageElement[];
    let n = 0;
    let z = 1;
    let lastX = NaN;
    let lastY = NaN;
    const timers = new Set<number>();
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (!Number.isNaN(lastX) && Math.hypot(x - lastX, y - lastY) < threshold) return;
      lastX = x;
      lastY = y;
      const img = nodes[n % nodes.length];
      img.src = list[n % list.length];
      n += 1;
      img.style.setProperty("--x", `${x}px`);
      img.style.setProperty("--y", `${y}px`);
      img.style.setProperty("--rot", `${(Math.random() * 2 - 1) * rotate}deg`);
      img.style.zIndex = String(z++);
      img.removeAttribute("data-on");
      void img.offsetWidth; // reinicia la animación del nodo reciclado
      img.setAttribute("data-on", "");
      const id = window.setTimeout(() => {
        img.removeAttribute("data-on");
        timers.delete(id);
      }, lifetime * 1000);
      timers.add(id);
    };
    const onLeave = () => {
      lastX = NaN;
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, threshold, lifetime, rotate, reduced]);

  return (
    <div ref={ref} className={`ui-trail ${className}`.trim()} style={{ ...style, "--trail-w": `${imageWidth}px`, "--trail-life": `${lifetime}s` } as CSSProperties}>
      <div ref={pool} className="ui-trail__pool" aria-hidden>
        {Array.from({ length: 10 }, (_, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} alt="" decoding="async" />
        ))}
      </div>
      {children != null && <div className="ui-trail__content">{children}</div>}
    </div>
  );
}
