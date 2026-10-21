"use client";

import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from "react";
import { GLBoundary, useGLGate } from "@/lib/ui/gl";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { RingFlat } from "./RingStage";
import { DEFAULT_SOLITAIRE } from "./ring";

const PrismScene = lazy(() => import("./prismScene"));

/**
 * Portada inmersiva: el diamante y el haz de luz que sale del puntero (prismScene) a pantalla completa, con el texto encima.
 * La sección mide dos pantallas y el escenario es fijo: la primera pantalla es la portada; en la segunda, el diamante baja y
 * se encoge hacia donde aparece el anillo del recorrido, el haz se apaga y el texto se desvanece (la fusión con la escena
 * siguiente). Con movimiento reducido o sin WebGL: el texto y la piedra dibujada.
 */
export default function PrismHero({ children, landing = { x: 0.22, y: 0.12 }, scaleTo = 0.3 }: { children: ReactNode; landing?: { x: number; y: number }; /** tamaño final del diamante (1 = el de la portada) */ scaleTo?: number }) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const { use3d, mounted, near, fail } = useGLGate(stage, { want: !reduced, margin: "200px" });
  const pointer = useRef({ x: 0, y: 0, active: false });
  const progress = useRef(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      // 0 mientras la portada ocupa la pantalla; 1 al final de la segunda pantalla
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
      progress.current = p;
      el.style.setProperty("--hero-p", p.toFixed(3));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = stage.current?.getBoundingClientRect();
      if (!r) return;
      pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      pointer.current.active = true;
    };
    const leave = () => (pointer.current.active = false);
    update();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", on);
      removeEventListener("resize", on);
      removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <section ref={root} className="ql-prism" data-light="vitrina" aria-label="Portada">
      <div className="ql-prism__sticky">
        <div ref={stage} className="ql-prism__stage" role="img" aria-label="Un diamante talla brillante atravesado por un haz de luz que se abre en colores">
          {!ready && <RingFlat sel={DEFAULT_SOLITAIRE} look="gema" className="ql-prism__flat" />}
          {use3d && mounted && (
            <div className={`ql-prism__gl ${ready ? "is-on" : ""}`}>
              <GLBoundary onError={fail}>
                <Suspense fallback={null}>
                  <PrismScene pointer={pointer} progress={progress} landing={landing} scaleTo={scaleTo} active={near} onReady={() => setReady(true)} />
                </Suspense>
              </GLBoundary>
            </div>
          )}
        </div>
        <div className="ql-prism__copy">{children}</div>
      </div>
    </section>
  );
}
