"use client";

import { Suspense, lazy, useEffect, useMemo, useRef, useState, type CSSProperties, type MutableRefObject } from "react";
import { GLBoundary, useGLGate } from "@/lib/ui/gl";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { useTokens } from "@/lib/ui/useTokens";
import { POINTCLOUD_REST, type PointCloudState } from "@/lib/pointcloud/scene";

export { POINTCLOUD_REST, type PointCloudState } from "@/lib/pointcloud/scene";

// three y react-three-fiber solo se descargan cuando la nube está cerca de la pantalla
const PointCloudScene = lazy(() => import("@/lib/pointcloud/scene"));

export type PointCloudProps = {
  /** pose controlada desde fuera (el scroll de una web, `useScrollStory`); sin ella, la nube va sola según `motion` */
  state?: MutableRefObject<PointCloudState>;
  /** sin `state`: scan = el barrido recorre el terreno en bucle · orbit = gira despacio, ya escaneado · none = quieta */
  motion?: "scan" | "orbit" | "none";
  /** puntos por lado del terreno (en móvil se usa ~60 %) */
  density?: number;
  /** semilla del terreno (cambia el relieve) */
  seed?: number;
  /** radio de la lupa del puntero (0 = sin lupa) */
  lens?: number;
  /** cuánto se inclina hacia el puntero (radianes) */
  follow?: number;
  /** lectura X/Y/Z que sigue al puntero sobre la nube */
  readout?: boolean;
  /** metros que vale la altura máxima del terreno (para la cota que se lee) */
  meters?: number;
  /** extremos de la línea de medida, en coordenadas del terreno «x,z;x,z» (−1…1) */
  measure?: string;
  /** texto de la etiqueta de la medida; `{d}` se sustituye por la distancia en metros y `{h}` por el desnivel */
  measureLabel?: string;
  /** escala de la distancia medida (metros por unidad del terreno) */
  scale?: number;
  /** alto CSS (con `fill`, no se usa) */
  height?: string;
  /** rellena su contenedor (que debe tener tamaño y `position: relative`) */
  fill?: boolean;
  /** descripción para lectores de pantalla */
  alt?: string;
  className?: string;
};

const parsePair = (s: string, i: number): [number, number] => {
  const p = (s.split(";")[i] ?? "0,0").split(",").map(Number);
  return [p[0] || 0, p[1] || 0];
};

/**
 * Una **nube de puntos** de un terreno escaneado (topografía con dron, LIDAR, gemelos digitales): un relieve procedural con
 * un río, un cerro y un solar con edificios, sin descargar nada. Un **barrido** revela los puntos con una estela de luz, el
 * color puede ir por cota, los edificios se levantan desde el suelo, hay una **línea de medida** con su cifra y una **lupa**:
 * los puntos bajo el ratón se encienden y se lee su X/Y/Z. Un clic lanza un pulso de escaneo desde el punto pulsado.
 *
 * Todo depende de una pose (`PointCloudState`): sola (`motion`) o guiada desde fuera (`state`, p. ej. con `useScrollStory`).
 * Colores de los tokens (`--fg`, `--acc`, `--acc2`). Sin WebGL o con movimiento reducido, una rejilla de puntos plana.
 * Sin WebAssembly (pasa la CSP del sitio). Requiere `three` y `@react-three/fiber`.
 */
export default function PointCloud({
  state: external,
  motion = "scan",
  density = 200,
  seed = 7,
  lens = 0.16,
  follow = 0.12,
  readout = true,
  meters = 148,
  measure = "-0.75,0.55;0.55,-0.25",
  measureLabel = "{d} m",
  scale = 420,
  height = "70vh",
  fill = false,
  alt = "Nube de puntos de un terreno escaneado",
  className = "",
}: PointCloudProps) {
  const root = useRef<HTMLDivElement>(null);
  const tokens = useTokens(root);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const { use3d, mounted, near, fail } = useGLGate(root, { want: !reduced, margin: "200px" });
  const own = useRef<PointCloudState>({ ...POINTCLOUD_REST, reveal: motion === "scan" ? 0 : 1 });
  const state = external ?? own;
  const out = useRef({ x: 0, y: 0, z: 0, on: false, sx: 0, sy: 0, mx: 0, my: 0, md: 0, mh: 0, mon: false });
  const tip = useRef<HTMLSpanElement>(null);
  const tag = useRef<HTMLSpanElement>(null);
  const [mobile, setMobile] = useState(false);
  useEffect(() => setMobile(matchMedia("(max-width: 760px)").matches), []);

  // sin pose de fuera: el barrido en bucle o la órbita lenta
  useEffect(() => {
    if (external || !use3d || motion === "none") return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = (now - t0) / 1000, s = own.current;
      if (motion === "scan") s.reveal = Math.min(1, (t % 9) / 6);
      s.yaw = 0.6 + t * (motion === "orbit" ? 0.08 : 0.03);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [external, use3d, motion]);

  // la lectura del puntero y la etiqueta de la medida: el DOM sigue a lo que la escena escribe, sin re-renderizar
  useEffect(() => {
    if (!use3d) return;
    let raf = 0;
    const tick = () => {
      const o = out.current, el = root.current;
      if (el && tip.current) {
        tip.current.style.opacity = o.on && readout ? "1" : "0";
        tip.current.style.transform = `translate(${(o.sx * el.clientWidth).toFixed(1)}px, ${(o.sy * el.clientHeight).toFixed(1)}px)`;
        tip.current.textContent = `X ${(o.x * scale).toFixed(1)} · Y ${(o.z * scale).toFixed(1)} · Z ${o.y.toFixed(1)} m`;
      }
      if (el && tag.current) {
        tag.current.style.opacity = o.mon ? "1" : "0";
        tag.current.style.transform = `translate(${(o.mx * el.clientWidth).toFixed(1)}px, ${(o.my * el.clientHeight).toFixed(1)}px)`;
        const f = (n: number) => n.toLocaleString("es-ES", { maximumFractionDigits: 1 });
        tag.current.textContent = measureLabel.replace("{d}", f(o.md * scale)).replace("{h}", f(o.mh));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [use3d, readout, scale, measureLabel]);

  const colors = useMemo(() => ({ fg: tokens?.["--fg"] || "#e8eef2", acc: tokens?.["--acc"] || "#ffb347", acc2: tokens?.["--acc2"] || "#3fb6c9" }), [tokens]);
  const from = useMemo(() => parsePair(measure, 0), [measure]);
  const to = useMemo(() => parsePair(measure, 1), [measure]);

  return (
    <div ref={root} className={`ui-pcloud ${fill ? "ui-pcloud--fill" : ""} ${className}`.trim()} style={fill ? undefined : ({ height } as CSSProperties)} role="img" aria-label={alt}>
      {!ready && <div className="ui-pcloud__flat" aria-hidden />}
      {use3d && mounted && (
        <div className={`ui-pcloud__gl ${ready ? "is-on" : ""}`}>
          <GLBoundary onError={fail}>
            <Suspense fallback={null}>
              <PointCloudScene state={state} colors={colors} density={Math.round(density * (mobile ? 0.62 : 1))} seed={seed} lens={lens} follow={follow} measureFrom={from} measureTo={to} readout={out} meters={meters} active={near} onReady={() => setReady(true)} />
            </Suspense>
          </GLBoundary>
        </div>
      )}
      <span ref={tip} className="ui-pcloud__tip" aria-hidden />
      <span ref={tag} className="ui-pcloud__tag" aria-hidden />
    </div>
  );
}
