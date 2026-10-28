import ChapterStage from "@/components/ui/ChapterStage";
import TornPaper from "@/components/ui/TornPaper";
import ProjectReel from "@/components/ui/ProjectReel";
import Relato from "./Relato";
import Portada from "./Portada";
import { CAPITULOS, TRABAJOS } from "./data";
import { brasaHref } from "./enlaces";
import { ruthie, stack } from "./fuentes";

/*
 * Brasa, diseñador web 3D: inspiración de Trama basada en meermohsin.me (docs/30, docs/36 B1, docs/55). La portada con el
 * emblema, las llamas que suben y se invierten, `ChapterStage` con las palabras, listas y duraciones de la referencia a la
 * misma altura de scroll (fija su sección a los 3 291 px con 720 px de alto), la franja de papel rasgado y el reel de
 * proyectos (cada uno abre su ficha). En /lab/cine/relato se sigue comparando con la original (`cine:compare`, receta
 * `relato`). Las demás páginas, en Sitio.tsx (docs/56).
 */

export default function Brasa() {
  return (
    <main className={`${ruthie.variable} ${stack.variable}`} style={{ background: "#000", color: "#fff", ["--bg" as string]: "#000", ["--fg" as string]: "#f2f2f2", ["--acc" as string]: "#990000", ["--mut" as string]: "#8a7a7a" }}>
      {/* la sensación de Quilate (docs/42), inercia larga, la pone el marco (registro: scroll "cinematic") */}
      <Relato />
      <Portada />
      {/* el relato se fija a los 3 291 px, como en la referencia, sea cual sea el alto de la portada (100vh) */}
      <div style={{ height: "calc(3291px - 100vh)" }} />
      <div style={{ position: "relative", zIndex: 3 }}>
        {/* la tarjeta de la referencia va virada a rojo; la barra de capítulos es la fija de la portada (en la referencia hay una) */}
        <style>{`.ui-chs__gl canvas, .ui-chs__card { filter: grayscale(1) sepia(1) saturate(7) hue-rotate(-38deg) brightness(0.8) contrast(1.3); } .ui-chs__bar { display: none; }`}</style>
        <ChapterStage chapters={CAPITULOS} perChapter={[3.29, 1.7, 2.51]} wordFont="var(--font-ruthie)" />
      </div>
      <div style={{ position: "relative", zIndex: 4, marginTop: -510, ["--acc" as string]: "#a3000f" }}>
        <TornPaper seed={9} depth={40}>
          <div style={{ minHeight: 560, display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", padding: "0 5vw", color: "#0a0a0a", fontFamily: "var(--font-sans, system-ui), sans-serif" }}>
            <p style={{ margin: 0, fontSize: "clamp(28px, 3.6vw, 52px)", lineHeight: 1.02, fontWeight: 500 }}>
              La caída siempre
              <br />
              fue parte del camino.
            </p>
            <p style={{ margin: 0, justifySelf: "end", maxWidth: 260, fontSize: 13, lineHeight: 1.4, color: "#1a0000" }}>Desarrollo creativo que deja huella: hecho para sentirse y recordarse.</p>
          </div>
        </TornPaper>
      </div>
      {/* el reel de proyectos de la referencia (9 425–12 000 px): el activo en el centro y su imagen desenfocada de fondo */}
      <div style={{ position: "relative", zIndex: 4, fontFamily: "var(--font-sans, system-ui), sans-serif" }}>
        <ProjectReel
          perProject={1}
          backdrop={0.32}
          projects={TRABAJOS.map((t) => ({ title: t.titulo, image: t.img, href: brasaHref(`trabajos/${t.id}`), description: t.id === "charla" ? t.texto : undefined }))}
        />
      </div>
      <div style={{ height: 2000 }} />
    </main>
  );
}
