import type { Metadata } from "next";
import { Ruthie } from "next/font/google";
import ChapterStage from "@/components/ui/ChapterStage";
import TornPaper from "@/components/ui/TornPaper";
import ProjectReel from "@/components/ui/ProjectReel";
import Desplazable from "@/components/lab/cine/Desplazable";
import RelatoMeer from "@/components/lab/cine/piezas/RelatoMeer";

/*
 * Banco del relato con scroll (docs/30, docs/36 B1): la portada con el emblema, las llamas que suben y se invierten,
 * `ChapterStage` con las palabras, listas y duraciones de la sección de meermohsin.me a la misma altura de scroll (la
 * referencia fija su sección a los 3 291 px con 720 px de alto), la franja de papel rasgado y el reel de proyectos. Se captura con
 * el mismo guion de rueda y se compara con `cine:compare` (receta `relato`).
 */

// la caligráfica de la referencia para las palabras gigantes (su web la carga como «ruthie»)
const ruthie = Ruthie({ weight: "400", subsets: ["latin"], variable: "--font-ruthie" });

export const metadata: Metadata = { title: "Banco de relato · Trama", robots: { index: false, follow: false } };

const CAPITULOS = [
  { word: "LEGACY", label: "Tension", image: "/img/estudio/01-gadgets-on-a-desk-unsplash.jpg", items: ["Design attracts attention. Development brings it to life."] },
  { word: "UI - UX", label: "Immersion", image: "/img/estudio/03-wacom-cintiq-22hd-workspace-2-unsplash.jpg", items: ["UIUX", "3D Web development", "Problem Solver", "User Research"] },
  { word: "3D WEB", label: "Impact", image: "/img/estudio/05-london-united-kingdom-unsplash-6u0qevcogqu.jpg", items: ["Frontend Engineering", "Three.js / WebGL", "GSAP Animation", "Performance Optimization"] },
];

export default function Page() {
  return (
    <main className={ruthie.variable} style={{ background: "#000", color: "#fff", ["--bg" as string]: "#000", ["--fg" as string]: "#f2f2f2", ["--acc" as string]: "#990000", ["--mut" as string]: "#8a7a7a" }}>
      <Desplazable />
      <RelatoMeer />
      <section style={{ position: "relative", zIndex: 2, height: 900, display: "grid", placeItems: "center", overflow: "hidden", background: "radial-gradient(ellipse at 50% 40%, #3a0006 0, #000 60%)" }}>
        <h1 style={{ margin: 0, fontSize: "clamp(64px, 11vw, 168px)", fontWeight: 500, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>ALWAYS DOING TO</h1>
      </section>
      <div style={{ height: 2391 }} />
      <div style={{ position: "relative", zIndex: 3 }}>
        {/* la tarjeta de la referencia va virada a rojo */}
        <style>{`.ui-chs__gl canvas, .ui-chs__card { filter: grayscale(1) sepia(1) saturate(7) hue-rotate(-38deg) brightness(0.8) contrast(1.3); }`}</style>
        <ChapterStage chapters={CAPITULOS} perChapter={[3.29, 1.7, 2.51]} wordFont="var(--font-ruthie)" />
      </div>
      <div style={{ position: "relative", zIndex: 4, marginTop: -510, ["--acc" as string]: "#a3000f" }}>
        <TornPaper seed={9} depth={40}>
          <div style={{ minHeight: 560, display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", padding: "0 5vw", color: "#0a0a0a", fontFamily: "var(--font-sans, system-ui), sans-serif" }}>
            <p style={{ margin: 0, fontSize: "clamp(28px, 3.6vw, 52px)", lineHeight: 1.02, fontWeight: 500 }}>
              The fall was always
              <br />
              part of the path.
            </p>
            <p style={{ margin: 0, justifySelf: "end", maxWidth: 260, fontSize: 13, lineHeight: 1.4, color: "#1a0000" }}>Creative development that leaves a mark, built to be felt and remembered.</p>
          </div>
        </TornPaper>
      </div>
      {/* el reel de proyectos de la referencia (9 425–12 000 px): el activo en el centro y su imagen desenfocada de fondo */}
      <div style={{ position: "relative", zIndex: 4, fontFamily: "var(--font-sans, system-ui), sans-serif" }}>
        <ProjectReel
          perProject={1}
          backdrop={0.32}
          projects={[
            { title: "Codenarts", image: "/img/estudio/04-workspace-unsplash.jpg" },
            { title: "AZ-Digital-Ventures", image: "/img/estudio/02-winter-workspace-2-unsplash.jpg" },
            { title: "Amron", image: "/img/estudio/01-gadgets-on-a-desk-unsplash.jpg" },
            { title: "Chatone", image: "/img/estudio/03-wacom-cintiq-22hd-workspace-2-unsplash.jpg", description: "A clean, light-themed messaging app designed for effortless conversations." },
          ]}
        />
      </div>
      <div style={{ height: 2000 }} />
    </main>
  );
}
