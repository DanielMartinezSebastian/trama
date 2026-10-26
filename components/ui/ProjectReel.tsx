"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { pinProgress, trackScroll } from "@/lib/motion/progress";

export type ReelProject = {
  title: string;
  image: string;
  alt?: string;
  /** texto corto a la derecha del proyecto activo */
  description?: string;
  href?: string;
};

export type ProjectReelProps = {
  projects?: ReelProject[];
  /** pantallas de scroll por proyecto */
  perProject?: number;
  /** fondo: la imagen del proyecto activo, desenfocada, a pantalla completa (0 = sin fondo, 1 = a plena opacidad) */
  backdrop?: number;
  /** contador circular con el número del proyecto */
  counter?: boolean;
  /** 0–1: modo controlado (sin fijarse al scroll) */
  progress?: number;
  /** alto en modo controlado */
  height?: number | string;
  className?: string;
};

const DEMO: ReelProject[] = [
  { title: "Codenarts", image: "/img/estudio/04-workspace-unsplash.jpg", description: "Web de estudio con escena 3D y reel." },
  { title: "Venture Beyond", image: "/img/estudio/02-winter-workspace-2-unsplash.jpg", description: "Identidad y web para una consultora." },
  { title: "Amron", image: "/img/estudio/01-gadgets-on-a-desk-unsplash.jpg", description: "Tienda con configurador de producto." },
  { title: "Chatone", image: "/img/estudio/03-wacom-cintiq-22hd-workspace-2-unsplash.jpg", description: "App de mensajería: marca y producto." },
];

const suave = (t: number) => t * t * (3 - 2 * t);

/**
 * Reel de proyectos fijado al scroll, como el de meermohsin.me: la imagen del proyecto activo grande en el centro, la
 * anterior pequeña arriba y la siguiente abajo, que suben al avanzar; el nombre a la izquierda, un contador circular a
 * la derecha y, de fondo, la misma imagen desenfocada a pantalla completa que tiñe la sección con su color. El paso de un
 * proyecto a otro se asienta (curva en S) para que cada uno se quede quieto un rato. Para portfolios, estudios, casos y
 * lanzamientos. Sin WebGL: imágenes, CSS y un solo oyente de scroll. Colores del tema (--bg, --fg).
 */
export default function ProjectReel({ projects = DEMO, perProject = 1, backdrop = 0.55, counter = true, progress, height = 560, className = "" }: ProjectReelProps) {
  const outer = useRef<HTMLDivElement>(null);
  const figuras = useRef<(HTMLElement | null)[]>([]);
  const titulos = useRef<(HTMLElement | null)[]>([]);
  const fondos = useRef<(HTMLImageElement | null)[]>([]);
  const arco = useRef<SVGCircleElement>(null);
  const [activo, setActivo] = useState(0);
  const n = projects.length;
  const controlado = progress !== undefined;

  const pintar = useCallback(
    (p: number) => {
      const bruto = Math.min(n - 1, Math.max(0, p * (n - 1)));
      const k0 = Math.floor(bruto);
      // se asienta: cada proyecto se queda quieto un rato antes de pasar al siguiente
      const pos = k0 + suave(Math.min(1, Math.max(0, (bruto - k0 - 0.2) / 0.6)));
      figuras.current.forEach((el, k) => {
        if (!el) return;
        const d = k - pos;
        const a = Math.min(1, Math.abs(d));
        el.style.transform = `translate(-50%, -50%) translateY(${(d * 36).toFixed(2)}svh) scale(${(1 - a * 0.62).toFixed(3)})`;
        el.style.opacity = String(Math.max(0, 1 - Math.max(0, Math.abs(d) - 1) * 1.5) * (1 - a * 0.35));
        el.style.zIndex = String(10 - Math.round(Math.abs(d) * 2));
      });
      titulos.current.forEach((el, k) => {
        if (!el) return;
        const d = k - pos;
        el.style.opacity = String(Math.max(0, 1 - Math.abs(d) * 2.2));
        el.style.transform = `translateY(calc(-50% + ${(d * 42).toFixed(1)}px))`;
      });
      fondos.current.forEach((el, k) => {
        if (el) el.style.opacity = String(Math.max(0, 1 - Math.abs(k - pos)) * backdrop);
      });
      arco.current?.style.setProperty("--reel-p", ((pos + 1) / n).toFixed(4));
      const a = Math.round(pos);
      setActivo((x) => (x === a ? x : a));
    },
    [n, backdrop],
  );

  useEffect(() => {
    if (controlado) return;
    const el = outer.current;
    if (!el) return;
    return trackScroll(el, (r, vh) => pintar(pinProgress(r, vh)));
  }, [controlado, pintar]);
  useEffect(() => {
    if (controlado) pintar(Math.min(1, Math.max(0, progress ?? 0)));
  }, [controlado, progress, pintar]);
  useEffect(() => {
    if (!controlado) pintar(0);
  }, [controlado, pintar]);

  const actual = projects[activo];
  return (
    <div
      ref={outer}
      className={`${controlado ? "ui-reel--libre" : "ui-pin"} ui-reel ${className}`.trim()}
      style={{ "--pin-len": Math.max(1, (n - 1) * perProject + 0.4), height: controlado ? height : undefined } as CSSProperties}
    >
      <div className="ui-pin__in">
        <div className="ui-reel__stage">
          {backdrop > 0 && (
            <div className="ui-reel__backdrop" aria-hidden>
              {projects.map((p, k) => (
                <img key={k} ref={(el) => void (fondos.current[k] = el)} src={p.image} alt="" style={{ opacity: k === 0 ? backdrop : 0 }} />
              ))}
            </div>
          )}
          {projects.map((p, k) => {
            const contenido = <img src={p.image} alt={p.alt ?? p.title} loading={k < 2 ? "eager" : "lazy"} />;
            return (
              <figure key={k} ref={(el) => void (figuras.current[k] = el)} className="ui-reel__card" aria-hidden={k !== activo}>
                {p.href ? (
                  <a href={p.href} tabIndex={k === activo ? 0 : -1}>
                    {contenido}
                  </a>
                ) : (
                  contenido
                )}
              </figure>
            );
          })}
          <div className="ui-reel__titles">
            {projects.map((p, k) => (
              <h3 key={k} ref={(el) => void (titulos.current[k] = el)} className="ui-reel__title" style={{ opacity: k === 0 ? 1 : 0 }}>
                {p.title}
              </h3>
            ))}
          </div>
          {actual?.description && <p className="ui-reel__desc">{actual.description}</p>}
          {counter && (
            <div className="ui-reel__counter" aria-label={`Proyecto ${activo + 1} de ${n}`}>
              <svg viewBox="0 0 44 44" aria-hidden>
                <circle cx="22" cy="22" r="20" className="ui-reel__ring" />
                <circle ref={arco} cx="22" cy="22" r="20" className="ui-reel__arc" pathLength={1} />
              </svg>
              <span>{String(activo + 1).padStart(2, "0")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
