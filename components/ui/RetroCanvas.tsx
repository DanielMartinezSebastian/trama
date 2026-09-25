"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTokens } from "@/lib/ui/useTokens";
import type { BackgroundInteraction, BackgroundPosition } from "@/lib/ui/pointerBridge";
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
  /** tope de la densidad de píxeles del lienzo (más alto = más nítido y más coste). Por defecto 2, o 1,5 en pantallas táctiles */
  maxDpr?: number;
  /** fotogramas por segundo del fondo (30 por defecto: sobra para un fondo y deja la GPU libre para el scroll). 0 = los de la pantalla */
  fps?: number;
  /** fotogramas por segundo mientras la página se desplaza (y 200 ms después); 0 = congelado durante el scroll */
  scrollFps?: number;
  /** si el dispositivo no llega a los fps pedidos, baja la densidad de píxeles por pasos hasta 1 (solo con `fps` > 0) */
  adaptive?: boolean;
  /**
   * la cámara sigue al puntero: parallax = se desplaza en paralelo · orbit = gira alrededor de la escena · tilt = solo
   * apunta hacia el puntero · none (por defecto) = quieta. Desactivado con prefers-reduced-motion
   */
  pointerFx?: "none" | "parallax" | "orbit" | "tilt";
  /** intensidad del movimiento (1 = normal) */
  pointerStrength?: number;
  /** canvas = solo con el puntero encima del lienzo · window = en toda la ventana (por defecto si es fixed). Funciona
   * aunque haya contenido encima: se escucha en la ventana */
  interaction?: BackgroundInteraction;
  /** descripción para lectores de pantalla; sin ella el lienzo se marca como decorativo */
  label?: string;
  className?: string;
};

/**
 * Lienzo react-three-fiber con acabado retro: la escena 3D se ve como pixel art, ASCII o ambos, con scanlines, viñeta y
 * curvatura de monitor CRT. Colores por defecto = tokens del tema (--fg sobre --bg, --acc). Rellena su contenedor
 * (que debe tener `position: relative` y tamaño). Pausa fuera de pantalla y con `prefers-reduced-motion` dibuja bajo demanda.
 * Pensado para ir de fondo también en móvil: 30 fps, menos durante el scroll y densidad adaptativa (guía §22.1).
 *
 * Requiere `three` y `@react-three/fiber` (dependencias opcionales del paquete).
 */
export default function RetroCanvas({ children, position = "absolute", fov = 35, cameraZ = 8, maxDpr, fps = 30, scrollFps = 20, adaptive = true, pointerFx = "none", pointerStrength = 1, interaction, label, className = "", fg, bg, accent, ...fx }: RetroCanvasProps) {
  const root = useRef<HTMLDivElement>(null);
  const tokens = useTokens(root);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [coarse, setCoarse] = useState(false);
  // tope de densidad en uso: el adaptativo lo baja de 0,25 en 0,25 si no se llega a los fps
  const [dprDrop, setDprDrop] = useState(0);
  const dprCap = Math.max(1, (maxDpr ?? (coarse ? 1.5 : 2)) - dprDrop);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    setCoarse(matchMedia("(pointer: coarse)").matches);
    return () => {
      io.disconnect();
      mq.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div ref={root} className={`ui-fill ui-retro ${position === "fixed" ? "ui-fill--fixed" : ""} ${className}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <Canvas
        frameloop={!visible ? "never" : reduced || fps > 0 ? "demand" : "always"}
        dpr={[1, dprCap]}
        camera={{ fov, position: [0, 0, cameraZ] }}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      >
        <RetroFX {...fx} fg={fg ?? tokens?.["--fg"] ?? undefined} bg={bg ?? tokens?.["--bg"] ?? undefined} accent={accent ?? tokens?.["--acc"] ?? undefined} />
        {visible && !reduced && fps > 0 && (
          <Pacer fps={fps} scrollFps={scrollFps} onSlow={adaptive ? () => Math.min(dprCap, devicePixelRatio) > 1 && setDprDrop((d) => d + 0.25) : undefined} />
        )}
        {pointerFx !== "none" && !reduced && <CameraRig fx={pointerFx} strength={pointerStrength} distance={cameraZ} area={interaction ?? (position === "fixed" ? "window" : "canvas")} root={root} />}
        {children ?? <RetroShapes />}
      </Canvas>
    </div>
  );
}

/**
 * Mueve la cámara hacia el puntero con suavizado. Escucha en la ventana (el fondo suele estar detrás del contenido y su lienzo
 * no recibe eventos); con `area="canvas"` solo cuenta el puntero sobre el lienzo y, al salir, la cámara vuelve al centro.
 */
function CameraRig({ fx, strength, distance, area, root }: { fx: "parallax" | "orbit" | "tilt"; strength: number; distance: number; area: BackgroundInteraction; root: RefObject<HTMLDivElement | null> }) {
  const target = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = root.current;
      if (area === "window" || !el) {
        target.current = { x: (e.clientX / innerWidth) * 2 - 1, y: (e.clientY / innerHeight) * 2 - 1 };
        return;
      }
      const r = el.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      target.current = inside ? { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: ((e.clientY - r.top) / r.height) * 2 - 1 } : { x: 0, y: 0 };
    };
    const onOut = (e: MouseEvent) => {
      if (e.relatedTarget === null) target.current = { x: 0, y: 0 };
    };
    addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onOut);
    return () => {
      removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onOut);
    };
  }, [area, root]);

  useFrame(({ camera }, dt) => {
    const k = 1 - Math.exp(-dt * 3.5); // suavizado independiente de los fps
    cur.current.x += (target.current.x - cur.current.x) * k;
    cur.current.y += (target.current.y - cur.current.y) * k;
    const { x, y } = cur.current;
    const s = strength;
    if (fx === "orbit") {
      const az = x * 0.9 * s;
      const el = -y * 0.5 * s;
      camera.position.set(Math.sin(az) * Math.cos(el) * distance, Math.sin(el) * distance, Math.cos(az) * Math.cos(el) * distance);
      camera.lookAt(0, 0, 0);
    } else if (fx === "parallax") {
      camera.position.set(x * 1.4 * s, -y * 0.9 * s, distance);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(0, 0, distance);
      camera.lookAt(x * 1.1 * s, -y * 0.7 * s, 0);
    }
  });
  return null;
}

/**
 * Marca el ritmo del lienzo con `frameloop="demand"`: pide un fotograma cada 1/fps s (menos mientras hay scroll) en vez de uno
 * por refresco de pantalla (60–120 Hz). Además mide si los fotogramas llegan a tiempo: si en ventanas de 2 s se consigue menos del
 * 80 % del ritmo pedido, avisa con `onSlow` (RetroCanvas baja la densidad de píxeles) y espera otra ventana antes de volver a medir.
 */
function Pacer({ fps, scrollFps, onSlow }: { fps: number; scrollFps: number; onSlow?: () => void }) {
  const invalidate = useThree((s) => s.invalidate);
  const step = useRef(1000 / fps); // intervalo pedido ahora mismo, en ms
  // la primera ventana no cuenta: compilar shaders y subir geometría a la GPU retrasa los primeros fotogramas
  const win = useRef({ start: 0, last: 0, frames: 0, expected: 0, warm: false });
  const slow = useRef(onSlow);
  slow.current = onSlow;

  useEffect(() => {
    let raf = 0;
    let last = 0;
    let scrollingUntil = 0;
    const onScroll = () => {
      scrollingUntil = performance.now() + 200;
    };
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const target = now < scrollingUntil ? scrollFps : fps;
      if (target <= 0) return;
      step.current = 1000 / target;
      // margen del 10 %: a 60 Hz y 30 fps cae justo cada 2 refrescos, a 120 Hz cada 4
      if (now - last >= step.current * 0.9) {
        last = now;
        invalidate();
      }
    };
    raf = requestAnimationFrame(tick);
    // en captura: también cuenta el scroll de contenedores (el evento no burbujea)
    addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll, { capture: true });
    };
  }, [fps, scrollFps, invalidate]);

  useFrame(() => {
    if (!slow.current) return;
    const now = performance.now();
    const w = win.current;
    // pausa larga (congelado en scroll, pestaña oculta, fuera de pantalla): la ventana no vale, se empieza otra
    if (now - w.last > 500) Object.assign(w, { start: now, frames: 0, expected: 0 });
    else {
      w.frames++;
      w.expected += (now - w.last) / step.current;
    }
    w.last = now;
    if (now - w.start < 2000) return;
    if (w.warm && w.expected > 0 && w.frames < w.expected * 0.8) slow.current();
    Object.assign(w, { start: now, frames: 0, expected: 0, warm: true });
  });
  return null;
}
