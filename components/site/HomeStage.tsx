"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { RetroShapesProps } from "@/components/ui/RetroShapes";
import SceneFlash from "@/components/ui/SceneFlash";

// three.js (≈ 250 KB comprimidos) no bloquea el primer pintado: el lienzo llega en su propio fragmento tras hidratar
const HomeBackdrop = dynamic(() => import("./HomeBackdrop"), { ssr: false });

// un acto por sección: el fondo cambia de figura al entrar en cada una (como SILO y SIGNAL)
type Act = { shape: NonNullable<RetroShapesProps["shape"]>; label: string };
const ACTS: Act[] = [
  { shape: "knot", label: "trama" },
  { shape: "cage", label: "componentes" },
  { shape: "globe", label: "landings" },
  { shape: "terrain", label: "webs completas" },
  { shape: "tunnel", label: "empezar" },
];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Fondo, corte y etiqueta de sección de la portada: la única parte que cambia con el scroll. Observa las secciones
 * `[data-act]` de la página (que pinta el servidor) y solo se repinta a sí misma (guía §22.1).
 */
export default function HomeStage() {
  const [act, setAct] = useState(0);
  const [wide, setWide] = useState(true);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = Number((e.target as HTMLElement).dataset.act);
          if (!Number.isNaN(i)) setAct(i);
        }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    document.querySelectorAll(".tr-home [data-act]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const mq = matchMedia("(min-width: 900px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const a = ACTS[act];
  return (
    <>
      <div className={`tr-bg ${act === 0 ? "tr-bg--hero" : ""}`} aria-hidden>
        <HomeBackdrop shape={a.shape} hero={act === 0} wide={wide} />
      </div>
      <SceneFlash className="tr-flash" kind="slices" duration={0.45} playKey={act} />
      <div className="tr-scene" aria-hidden>
        [{pad(act + 1)}/{pad(ACTS.length)}] {a.label}
      </div>
    </>
  );
}
