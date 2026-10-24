import type { Metadata } from "next";
import ChapterStage from "@/components/ui/ChapterStage";
import Desplazable from "@/components/lab/cine/Desplazable";

/*
 * Banco del relato con scroll (docs/30): `ChapterStage` con las palabras, listas y duraciones de la sección de
 * meermohsin.me, a la misma altura de scroll (la referencia fija su sección a los 3 291 px con 720 px de alto), para
 * capturarlo con el mismo guion de rueda y comparar el eje de texto con `cine:compare`.
 */

export const metadata: Metadata = { title: "Banco de relato · Trama", robots: { index: false, follow: false } };

const CAPITULOS = [
  { word: "LEGACY", label: "Tension", image: "/img/estudio/01-gadgets-on-a-desk-unsplash.jpg", items: ["Design attracts attention. Development brings it to life."] },
  { word: "UI - UX", label: "Immersion", image: "/img/estudio/03-wacom-cintiq-22hd-workspace-2-unsplash.jpg", items: ["UIUX", "3D Web development", "Problem Solver", "User Research"] },
  { word: "3D WEB", label: "Impact", image: "/img/estudio/05-london-united-kingdom-unsplash-6u0qevcogqu.jpg", items: ["Frontend Engineering", "Three.js / WebGL", "GSAP Animation", "Performance Optimization"] },
];

export default function Page() {
  return (
    <main style={{ background: "#000", color: "#fff", ["--bg" as string]: "#000", ["--fg" as string]: "#f2f2f2", ["--acc" as string]: "#990000", ["--mut" as string]: "#8a7a7a" }}>
      <Desplazable />
      <div style={{ height: 3291 }} />
      <ChapterStage chapters={CAPITULOS} perChapter={[3.29, 1.7, 2.51]} />
      <div style={{ height: 6000 }} />
    </main>
  );
}
