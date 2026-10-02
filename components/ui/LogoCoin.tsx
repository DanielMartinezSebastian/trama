"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { resolveImage } from "@/lib/ui/placeholder";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { tcls, type Tone } from "./variants";

export type LogoCoinProps = {
  /** imagen de la marca en las dos caras: URL, ruta o `gen:N`. Con `children`, se ignora */
  src?: string;
  /** imagen de la cara trasera, si es distinta de la delantera */
  backSrc?: string;
  /** contenido de las caras en lugar de una imagen: un SVG, un `Icon`, texto… Se pinta igual en las dos */
  children?: ReactNode;
  /** diámetro en px */
  diameter?: number;
  /** grosor del canto en px */
  thickness?: number;
  /** token del color del canto */
  tone?: Tone;
  /** token del fondo de las caras (lo que asoma si la imagen tiene transparencia o no llega al borde) */
  faceTone?: "bg" | Tone;
  /** cover = la imagen llena la cara (logos ya redondos) · contain = entra entera, con margen */
  fit?: "cover" | "contain";
  /** multiplicador de la velocidad de giro (1 = una vuelta cada 6 s; negativo = al revés; 0 = quieto) */
  speed?: number;
  /** inclinación en grados para que se vea el canto de arriba (positivo) o el de abajo */
  tilt?: number;
  /** deja girarlo arrastrando, con inercia. Por defecto no: es decorativo y no recibe toques */
  draggable?: boolean;
  /** reflejo fijo sobre las caras */
  glare?: boolean;
  /** quieto, ladeado para que se vea el volumen (lo mismo que con `prefers-reduced-motion`) */
  still?: boolean;
  /** descripción para lectores de pantalla. Vacío = decorativo */
  alt?: string;
  className?: string;
};

/** tramos rectos que forman el canto: de sobra para que se lea curvo hasta ~240 px de diámetro */
const SEGMENTS = 48;
/** grados por segundo a `speed` 1 */
const TURN = 60;

/**
 * Logo con volumen que gira sobre su eje vertical, como una moneda: dos caras con la marca y canto visible. Es CSS 3D puro
 * (sin WebGL ni three): el giro lo anima el compositor, no hay JavaScript por fotograma y dentro de un contenedor oculto no
 * trabaja. Solo con `draggable` se mueve por JS, y se detiene fuera de pantalla. Decorativo por defecto: no recibe eventos.
 */
export default function LogoCoin({ src = "", backSrc, children, diameter = 120, thickness = 12, tone = "acc", faceTone = "bg", fit = "cover", speed = 1, tilt = 10, draggable = false, glare = true, still = false, alt = "", className = "" }: LogoCoinProps) {
  const root = useRef<HTMLSpanElement>(null);
  const spin = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const quiet = still || reduced || (speed === 0 && !draggable);
  const byHand = draggable && !still && !reduced;

  // Con `draggable` el giro va por JS: velocidad base + la del arrastre, que se va perdiendo. Parado mientras no se ve.
  useEffect(() => {
    const el = root.current;
    const target = spin.current;
    if (!el || !target || !byHand) return;
    let raf = 0;
    let last = 0;
    let angle = 0;
    let extra = 0; // grados/s añadidos por el arrastre
    let dragX: number | null = null;
    let dragT = 0;
    let visible = false;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (dragX === null) {
        angle += (TURN * speed + extra) * dt;
        extra *= Math.exp(-dt * 1.6);
      }
      target.style.transform = `rotateY(${angle.toFixed(2)}deg)`;
    };
    const run = () => {
      cancelAnimationFrame(raf);
      if (!visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      run();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", run);

    const down = (e: PointerEvent) => {
      dragX = e.clientX;
      dragT = e.timeStamp;
      extra = 0;
      el.setPointerCapture(e.pointerId);
    };
    const moveTo = (e: PointerEvent) => {
      if (dragX === null) return;
      const dx = e.clientX - dragX;
      const dt = Math.max(1, e.timeStamp - dragT) / 1000;
      angle += dx * 0.8;
      extra = Math.max(-1400, Math.min(1400, (dx * 0.8) / dt));
      dragX = e.clientX;
      dragT = e.timeStamp;
    };
    const up = () => {
      dragX = null;
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", moveTo);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", run);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", moveTo);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      target.style.transform = "";
    };
  }, [byHand, speed]);

  const front = src ? resolveImage(src) : "";
  const back = backSrc ? resolveImage(backSrc) : front;
  const face = (img: string) => children ?? (img ? <img src={img} alt="" draggable={false} /> : null);
  // tramo del canto: un poco más ancho que la cuerda para que no se vean rendijas
  const seg = diameter * Math.tan(Math.PI / SEGMENTS) + 0.6;
  const style = {
    "--coin-d": `${diameter}px`,
    "--coin-t": `${thickness}px`,
    "--coin-seg": `${seg.toFixed(2)}px`,
    "--coin-tilt": `${-tilt}deg`,
    "--coin-face": faceTone === "bg" ? "var(--bg)" : `var(--${faceTone})`,
    "--coin-turn": `${(360 / TURN / Math.max(0.01, Math.abs(speed))).toFixed(2)}s`,
  } as CSSProperties;
  const cls = ["ui-coin", tcls(tone), `ui-coin--${fit}`, quiet ? "is-still" : "", byHand ? "is-hand" : "", speed < 0 ? "is-reverse" : "", className].filter(Boolean).join(" ");

  return (
    <span ref={root} className={cls} style={style} role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
      <span className="ui-coin__tilt">
        <span ref={spin} className="ui-coin__spin">
          {Array.from({ length: SEGMENTS }, (_, i) => {
            const a = (i / SEGMENTS) * 360;
            // luz desde arriba: los tramos de arriba, claros; los de abajo, en sombra
            const k = (1 + Math.cos((a * Math.PI) / 180)) / 2;
            return <i key={i} className="ui-coin__edge" style={{ "--a": `${a}deg`, "--k": k.toFixed(3) } as CSSProperties} />;
          })}
          <span className="ui-coin__face ui-coin__face--front">
            {face(front)}
            {glare && <span className="ui-coin__glare" />}
          </span>
          <span className="ui-coin__face ui-coin__face--back">
            {face(back)}
            {glare && <span className="ui-coin__glare" />}
          </span>
        </span>
      </span>
    </span>
  );
}
