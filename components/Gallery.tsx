import Link from "next/link";
import TextmodeCanvas from "@/components/TextmodeCanvas";
import { demos, type DemoMeta, type Family } from "@/lib/demos";

const sections: { family: Family; title: string; blurb: string }[] = [
  {
    family: "textmode",
    title: "textmode.js",
    blurb: "Sketches generativos que dibujan directamente sobre la rejilla de caracteres.",
  },
  {
    family: "asciify",
    title: "asciify-engine",
    blurb:
      "Imágenes procedurales convertidas a caracteres, con estilos Studio (braille, Lego, voxel, dither…) y efectos de hover.",
  },
  {
    family: "text",
    title: "Texto · ambas librerías",
    blurb:
      "Escribe tu propio texto y míralo cambiar en tiempo real: cada demo lo renderiza con textmode.js, con asciify-engine o combinando las dos.",
  },
  {
    family: "scroll",
    title: "Scroll y landings · 300vh",
    blurb:
      "Páginas de 300vh donde el scroll (medido con GSAP ScrollTrigger) mueve el fondo, con una landing de ejemplo encima. Útiles como base para héroes y secciones.",
  },
  {
    family: "landing",
    title: "Landings temáticas",
    blurb:
      "Seis landings de 300vh con estilos distintos (cards con efectos ASCII, revelados propios, fondo que cambia de escena) más tres construidas enteramente con el kit de components/ui/: CIPHERGRID (retrowave/cyberpunk), MYCEL (red de sensores orgánica) y FOLIO (editorial de tema claro), cada una con casi todo el catálogo en una sola página. Cierran MARÉ minimal (fondo dither y tipografía pixel) y FORMAS, un demo de 2000dvh donde el scroll cambia el tamaño de celda y salta entre ocho geometrías, cada una con su hover, y FACETA, una landing larga que mezcla ese fondo con componentes del kit en estilo pixel duro.",
  },
];

function Card({ d, n }: { d: DemoMeta; n: number }) {
  return (
    <li>
      <Link href={`/demo/${d.slug}`} className="card" style={{ ["--accent" as string]: d.accent }}>
        <span className="card__n">{String(n).padStart(2, "0")}</span>
        <span className="card__title">{d.title}</span>
        <span className="card__blurb">{d.blurb}</span>
        <span className="tag">{[d.family === "text" || d.family === "scroll" || d.family === "landing" ? d.lib : null, d.reactive ? "reactivo" : "ambiente"].filter(Boolean).join(" · ")}</span>
      </Link>
    </li>
  );
}

export default function Gallery() {
  let n = 0;
  return (
    <>
      <TextmodeCanvas slug="plasma" />
      <main className="gallery">
        <header className="gallery__head">
          <h1>Trama</h1>
          <p>
            Fondos a pantalla completa sobre Next.js con <strong>textmode.js</strong> y{" "}
            <strong>asciify-engine</strong>. Los marcados como <em>reactivo</em> responden al puntero.
          </p>
          <p style={{ marginTop: 16 }}>
            <Link href="/componentes" className="chip">
              Componentes reutilizables → catálogo con props editables
            </Link>
          </p>
        </header>
        {sections.map((s) => {
          const items = demos.filter((d) => d.family === s.family);
          return (
            <section key={s.family} className="gallery__section">
              <h2>
                {s.title} <span className="count">{items.length}</span>
              </h2>
              <p className="gallery__sub">{s.blurb}</p>
              <ul className="cards">
                {items.map((d) => (
                  <Card key={d.slug} d={d} n={++n} />
                ))}
              </ul>
            </section>
          );
        })}
      </main>
    </>
  );
}
