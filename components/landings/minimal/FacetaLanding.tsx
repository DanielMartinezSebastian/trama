"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import Accordion from "@/components/ui/Accordion";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ContactForm from "@/components/ui/ContactForm";
import CTASection from "@/components/ui/CTASection";
import FAQSection from "@/components/ui/FAQSection";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Footer from "@/components/ui/Footer";
import ImageGallery from "@/components/ui/ImageGallery";
import LogoCloud from "@/components/ui/LogoCloud";
import Marquee from "@/components/ui/Marquee";
import PricingSection from "@/components/ui/PricingSection";
import Progress from "@/components/ui/Progress";
import SectionHeader from "@/components/ui/SectionHeader";
import StatsSection from "@/components/ui/StatsSection";
import Stepper from "@/components/ui/Stepper";
import Tabs from "@/components/ui/Tabs";
import TestimonialSection from "@/components/ui/TestimonialSection";
import Timeline from "@/components/ui/Timeline";
import VideoPlayer, { cloudinaryPoster } from "@/components/ui/VideoPlayer";
import { Glitch, Scramble } from "./Glitch";
import ShapeStage, { type ShapeLook } from "./ShapeStage";
import { useActFx } from "./useActFx";
import "./minimal.css";
import "./geometry.css";
import "./faceta.css";

/**
 * FACETA: landing de prueba, larga, que mezcla los principios de la demo de formas (fondo dither que evoluciona con el
 * scroll, celda fina, figuras a los bordes, hover propio, carteles con aparición distinta) con componentes del kit.
 *
 * La página es una sucesión de ACTOS (`data-act`), en el mismo orden que `LOOKS`: o un cartel a pantalla completa
 * (sticky, con su efecto de entrada) o un bloque de componentes en un panel sólido. El fondo pasa de un look al siguiente
 * conforme el scroll cruza de un acto al otro.
 *
 * Los componentes del kit van con `variant="retro"` (esquinas rectas, borde duro, sombra desplazada) y `.faceta`
 * (faceta.css) les cambia solo las variables `--s-*` a pixel duro: ningún componente se toca.
 */

type L = Omit<ShapeLook, "acc"> & { acc: [number, number, number] };
const look = (o: L): ShapeLook => o;

const LOOKS: ShapeLook[] = [
  /* 0  cartel · hero */ look({ scene: "cube", style: "dither", cell: 2, bloom: 0, grain: 0, scan: 0, vig: 0, tint: 0.9, acc: [255, 138, 92], x: 0.7, y: 0.5, s: 1.15, fx: "repel", hover: "trail" }),
  /* 1  cartel */ look({ scene: "pyramid", style: "mosaic", cell: 5, bloom: 0.2, grain: 0, scan: 0, vig: 0.25, tint: 0.75, acc: [63, 208, 201], x: 0.96, y: 0.52, s: 2.1, fx: "magnify", hover: "water" }),
  /* 2  panel: features */ look({ scene: "sphere", style: "dots", cell: 4, bloom: 0.45, grain: 0.1, scan: 0, vig: 0.35, tint: 0.85, acc: [255, 212, 59], x: 0.04, y: 0.6, s: 2.2, fx: "twist", hover: "vortex" }),
  /* 3  cartel */ look({ scene: "octahedron", style: "lego", cell: 8, bloom: 0.1, grain: 0, scan: 0.15, vig: 0.2, tint: 0.55, acc: [255, 79, 163], x: 0.03, y: 0.48, s: 2.1, fx: "explode", hover: "dissolve" }),
  /* 4  panel: cifras */ look({ scene: "icosahedron", style: "diamond", cell: 4, bloom: 0.3, grain: 0, scan: 0, vig: 0.3, tint: 0.8, acc: [140, 130, 255], x: 0.96, y: 0.5, s: 1.9, fx: "wave", hover: "silk" }),
  /* 5  cartel */ look({ scene: "hexprism", style: "pixel", cell: 4, bloom: 0.15, grain: 0.05, scan: 0.1, vig: 0.25, tint: 0.85, acc: [255, 150, 60], x: 0.97, y: 0.04, s: 2.0, fx: "magnet", hover: "contour" }),
  /* 6  panel: proceso */ look({ scene: "torusknot", style: "lines", cell: 5, bloom: 0.35, grain: 0, scan: 0, vig: 0.4, tint: 0.9, acc: [80, 220, 255], x: 0.1, y: 0.55, s: 1.7, fx: "snap", hover: "trail" }),
  /* 7  cartel */ look({ scene: "cone", style: "braille", cell: 4, bloom: 0.55, grain: 0.15, scan: 0.35, vig: 0.4, tint: 0.9, acc: [124, 242, 154], x: 0.06, y: 1.0, s: 2.2, fx: "stretch", hover: "dissolve" }),
  /* 8  panel: pruébalo */ look({ scene: "diamond", style: "blocks", cell: 4, bloom: 0.2, grain: 0, scan: 0, vig: 0.3, tint: 0.85, acc: [255, 110, 110], x: 0.95, y: 0.6, s: 1.9, fx: "twist", hover: "vortex" }),
  /* 8b panel: galería */ look({ scene: "cube", style: "pixel", cell: 4, bloom: 0.2, grain: 0, scan: 0.05, vig: 0.3, tint: 0.85, acc: [255, 200, 90], x: 0.95, y: 0.55, s: 1.7, fx: "repel", hover: "silk" }),
  /* G1 cartel */ look({ scene: "pyramid", style: "blocks", cell: 4, bloom: 0.25, grain: 0, scan: 0.05, vig: 0.3, tint: 0.85, acc: [255, 120, 180], x: 0.05, y: 0.5, s: 2.0, fx: "magnify", hover: "water" }),
  /* G2 coverflow */ look({ scene: "sphere", style: "mosaic", cell: 4, bloom: 0.3, grain: 0.05, scan: 0, vig: 0.35, tint: 0.85, acc: [90, 220, 255], x: 0.5, y: -0.05, s: 2.3, fx: "twist", hover: "vortex" }),
  /* G3 cubo */ look({ scene: "octahedron", style: "dither", cell: 2, bloom: 0.1, grain: 0, scan: 0, vig: 0.2, tint: 0.9, acc: [255, 90, 90], x: 0.08, y: 0.5, s: 2.4, fx: "explode", hover: "dissolve" }),
  /* G4 tira + mosaico */ look({ scene: "cone", style: "lines", cell: 4, bloom: 0.3, grain: 0, scan: 0.1, vig: 0.3, tint: 0.85, acc: [200, 255, 120], x: 0.96, y: 0.9, s: 2.0, fx: "stretch", hover: "contour" }),
  /* G5 baraja + fundido + creativa */ look({ scene: "hexprism", style: "voxel", cell: 4, bloom: 0.2, grain: 0, scan: 0, vig: 0.3, tint: 0.8, acc: [255, 190, 80], x: 0.04, y: 0.3, s: 1.8, fx: "magnet", hover: "silk" }),
  /* V1 cartel */ look({ scene: "diamond", style: "dither", cell: 2, bloom: 0.15, grain: 0, scan: 0, vig: 0.25, tint: 0.9, acc: [255, 95, 130], x: 0.9, y: 0.45, s: 1.6, fx: "twist", hover: "vortex" }),
  /* V2 demos de vídeo */ look({ scene: "torusknot", style: "mosaic", cell: 4, bloom: 0.25, grain: 0, scan: 0, vig: 0.35, tint: 0.85, acc: [120, 255, 200], x: 0.03, y: 0.7, s: 1.9, fx: "snap", hover: "water" }),
  /* 9  cartel */ look({ scene: "tetrahedron", style: "cross", cell: 4, bloom: 0.25, grain: 0, scan: 0.1, vig: 0.3, tint: 0.8, acc: [200, 255, 90], x: 0.05, y: 0.5, s: 2.0, fx: "snap", hover: "water" }),
  /* 10 panel: precios */ look({ scene: "cylinder", style: "voxel", cell: 4, bloom: 0.2, grain: 0, scan: 0, vig: 0.35, tint: 0.8, acc: [255, 170, 80], x: 0.97, y: 0.4, s: 1.8, fx: "stretch", hover: "contour" }),
  /* 11 cartel */ look({ scene: "icosahedron", style: "mixed", cell: 4, bloom: 0.3, grain: 0.05, scan: 0, vig: 0.3, tint: 0.85, acc: [90, 200, 255], x: 0.8, y: 0.5, s: 1.4, fx: "wave", hover: "silk" }),
  /* 12 panel: voces + faq */ look({ scene: "torusknot", style: "ascii", cell: 5, bloom: 0.3, grain: 0.1, scan: 0.1, vig: 0.4, tint: 0.9, acc: [255, 138, 92], x: 0.04, y: 0.5, s: 1.6, fx: "twist", hover: "trail" }),
  /* 13 cartel */ look({ scene: "sphere", style: "dots", cell: 2, bloom: 0.4, grain: 0.1, scan: 0, vig: 0.35, tint: 0.85, acc: [63, 208, 201], x: 0.5, y: 1.1, s: 2.4, fx: "repel", hover: "vortex" }),
  /* 14 panel: cierre */ look({ scene: "octahedron", style: "dither", cell: 2, bloom: 0.1, grain: 0, scan: 0, vig: 0.2, tint: 0.9, acc: [255, 79, 163], x: 0.96, y: 0.12, s: 1.6, fx: "explode", hover: "dissolve" }),
];

const IMG_PORT =
  "gen:8|Bahía norte|Campaña de verano\ngen:9|Cala del faro|Sesión de otoño\ngen:10|Rompiente|Catálogo de tablas\ngen:11|Luna llena|Edición nocturna\ngen:12|Punta verde|Reportaje\ngen:13|Ocaso|Portada de temporada\ngen:14|Niebla|Serie en blanco y negro\ngen:15|Aurora|Cartel del festival";
const IMG_CUBE =
  "gen:16|Cara norte|Bahía al amanecer\ngen:17|Cara este|Mediodía en la barra\ngen:18|Cara sur|Atardecer de septiembre\ngen:19|Cara oeste|Noche de luna\ngen:20|Arriba|Vista desde el faro\ngen:21|Abajo|Fondo de arena";
const IMG_FILM =
  "gen:22|Lunes|Grupo de iniciación\ngen:23|Martes|Clase privada\ngen:24|Miércoles|Marea baja\ngen:25|Jueves|Vídeo de técnica\ngen:26|Viernes|Surf trip\ngen:27|Sábado|Concurso local\ngen:28|Domingo|Barbacoa en la playa\ngen:29|Lunes|Nueva serie";
const IMG_MOSAIC =
  "gen:30|Tabla 6'0|Espuma\ngen:31|Tabla 7'2|Malibú\ngen:32|Neopreno 3/2|Verano\ngen:33|Neopreno 4/3|Invierno\ngen:34|Poncho|Cambiador\ngen:35|Wax|Coco\ngen:36|Leash|Tobillo\ngen:37|Mochila|Estanca";
const IMG_CARDS =
  "gen:38|Instructores|Equipo titulado\ngen:39|Grupos|Máximo seis\ngen:40|Material|Todo incluido\ngen:41|Playa|Acceso directo\ngen:42|Vídeo|Corrección al momento";
const IMG_FADE =
  "gen:43|Primera ola|El día uno\ngen:44|Segunda|Ya de pie\ngen:45|Tercera|Giro a la derecha\ngen:46|Cuarta|Sin espuma\ngen:47|Quinta|Ola verde";
const IMG_CREATIVE =
  "gen:48|Sesión 1|Amanecer\ngen:49|Sesión 2|Mediodía\ngen:50|Sesión 3|Tarde\ngen:51|Sesión 4|Noche\ngen:52|Sesión 5|Madrugada\ngen:53|Sesión 6|Bonus";

const VIDEO_DEMO = "https://res.cloudinary.com/martinezsebastian-test/video/upload/v1701113097/samples/cld-sample-video.mp4";

const VIDEO_TURTLE = "https://res.cloudinary.com/martinezsebastian-test/video/upload/v1701113091/samples/sea-turtle.mp4";

type Intro = "glitch" | "wipe" | "drop" | "slide" | "type" | "rise" | "scramble" | "zoom";
type Blk = "wipe" | "slide" | "drop" | "rise" | "zoom";

/** Cartel a pantalla completa (acto). `side` es el lado del texto; la figura del fondo va al contrario. */
function Poster({ intro, side, kicker, lines, sub, children }: { intro: Intro; side: "l" | "r"; kicker: string; lines: string[]; sub?: string; children?: ReactNode }) {
  const t = (text: string, delay = 0, className = "") => (intro === "scramble" ? <Scramble text={text} className={className} /> : <Glitch text={text} className={className} delay={delay} />);
  return (
    <section className="mx__chap mz__chap" data-act data-side={side}>
      <div className="mx__stick" data-reveal data-fx={intro} style={{ "--dir": side === "l" ? -1 : 1 } as CSSProperties}>
        <div className="mx__in">
          <span className="mn__kicker">{t(kicker, 100)}</span>
          <h2 className="mn__h2">
            {lines.map((l, i) => (
              <span key={l} className="mn-line">
                {t(l, 250 + i * 250, "mn-hl")}
              </span>
            ))}
          </h2>
          {sub && <p className="mn__p mn-hl">{t(sub, 700)}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}

/** Acto de contenido: una columna de paneles sólidos pegada a un lado (la figura del fondo queda al otro). */
function Act({ side, children, className = "" }: { side: "l" | "r" | "c"; children: ReactNode; className?: string }) {
  return (
    <section className={`mz__act ${className}`} data-act data-side={side}>
      {children}
    </section>
  );
}

/** Panel sólido de esquinas rectas donde viven los componentes del kit; entra con su propio efecto por pasos. */
function Panel({ blk, side, children, className = "" }: { blk: Blk; side?: "l" | "r"; children: ReactNode; className?: string }) {
  return (
    <div className={`mz__panel ${className}`} data-blk={blk} style={{ "--dir": side === "l" ? -1 : 1 } as CSSProperties}>
      {children}
    </div>
  );
}

export default function FacetaLanding({ hud = false }: { hud?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  useActFx(root);

  return (
    <div ref={root} className={`mn mx mz ${hud ? "mn--hud" : ""}`}>
      <ShapeStage looks={LOOKS} />

      <header className="mn__top">
        <span className="mn-hl">FACETA</span>
        <span className="mn-hl mn-hl--alt">v0.9 · prueba</span>
      </header>

      <main className="mn__main">
        {/* 0 */}
        <Poster intro="glitch" side="l" kicker="FACETA · FONDOS 3D EN CARACTERES" lines={["Formas que", "se escriben"]} sub="Un motor de fondos que convierte geometría en píxeles duros.">
          <span className="mn__cue">▼ scroll</span>
        </Poster>

        {/* 1 */}
        <Poster intro="wipe" side="l" kicker="01 · HOVER" lines={["Cada forma,", "su reacción"]} sub="Repele, estalla, se retuerce, se imanta o se ajusta a una rejilla." />

        {/* 2 · características */}
        <Act side="r">
          <Panel blk="slide" side="r">
            <FeatureGrid
              variant="retro"
              kicker="LO BÁSICO"
              title="Un fondo, mil formas"
              subtitle="Todo es una nube de cuadrados con luz propia. Tú eliges forma, celda y estilo."
              items={"icon:cpu|Sin imágenes|Las formas se generan en el momento, sin descargar un solo archivo.\nicon:zap|Celda fina|Desde 3 px de celda para ganar resolución donde importa.\nicon:eye|Hover propio|Cada figura reacciona al puntero de una forma distinta.\nicon:sparkles|Tinte vivo|El acento cambia con el scroll y arrastra a toda la página."}
            />
          </Panel>
        </Act>

        {/* 3 */}
        <Poster intro="drop" side="r" kicker="02 · NÚMEROS" lines={["Poco peso,", "mucho detalle"]} sub="Medido en una escena real de 8 formas." />

        {/* 4 · cifras */}
        <Act side="l">
          <Panel blk="wipe">
            <StatsSection kicker="EN CIFRAS" title="Lo que pesa cada cosa" subtitle="Datos de la demo, en una máquina normal." stats={"3|px|celda mínima\n11|formas|geometrías incluidas\n8|efectos|de hover propio\n60|fps|objetivo de animación"} tone="acc" />
          </Panel>
          <Panel blk="zoom">
            <SectionHeader variant="retro" kicker="EN MOVIMIENTO" title="Míralo funcionando" subtitle="Reproductor propio: espacio para pausar, flechas para saltar, F para pantalla completa." />
            <VideoPlayer variant="retro" src={VIDEO_DEMO} poster={cloudinaryPoster(VIDEO_DEMO)} title="Demo de FACETA" loop scanlines />
          </Panel>
          <div className="mz__band" data-blk="slide" style={{ "--dir": -1 } as CSSProperties}>
            <Marquee text="CUBO · PIRÁMIDE · ESFERA · OCTAEDRO · ICOSAEDRO · PRISMA · NUDO · CONO" variant="retro" duration={26} separator=" ■ " fontSize={22} />
          </div>
        </Act>

        {/* 5 */}
        <Poster intro="slide" side="l" kicker="03 · PROCESO" lines={["De cero", "a fondo vivo"]} sub="Cuatro pasos, sin tocar un canvas." />

        {/* 6 · timeline + stepper */}
        <Act side="r">
          <Panel blk="rise" side="r">
            <SectionHeader variant="retro" kicker="CÓMO FUNCIONA" title="Cuatro pasos" subtitle="Del componente a la pantalla." />
            <Timeline variant="retro" marker="number" steps={"Elige la forma|Cubo, pirámide, esfera, nudo… con `scene=`.\nAjusta la celda|Fina (3 px) para detalle o gruesa para un look de bloques.\nMarca el hover|Repele, lupa, torsión, ondas, imán, rejilla…\nAtalo al scroll|Un look por sección y el fondo hace el resto."} />
            <Stepper variant="retro" steps="Forma, Celda, Hover, Scroll" current={2} />
          </Panel>
        </Act>

        {/* 7 */}
        <Poster intro="zoom" side="r" kicker="04 · PRUÉBALO" lines={["Tú decides", "la resolución"]} sub="Menos celda, más detalle. Más celda, más carácter." />

        {/* 8 · tabs + progress + badges */}
        <Act side="l">
          <Panel blk="zoom">
            <SectionHeader variant="retro" kicker="ESTILOS" title="Cinco maneras de pintar" />
            <Tabs variant="retro" items="Dither, Mosaico, Braille, Lego" content={"Blanco y negro duro, con el acento como tinta. Ideal para celda de 3 a 5 px.\nBaldosas planas de color por celda. Quedan bien con celda de 5 a 12 px.\nPuntos braille: lectura fina y aire de terminal con celda de 4 px.\nBloques con relieve. Funciona mejor con celdas grandes, de 8 px o más."} />
            <div className="mz__stack">
              <Progress variant="retro" label="Detalle (celda de 3 px)" value={92} showValue ascii />
              <Progress variant="retro" label="Coste por fotograma" value={68} showValue striped />
              <Progress variant="retro" label="Aspecto de bloques" value={30} showValue />
            </div>
            <div className="mz__row">
              <Badge variant="retro" text="dither" intent="accent" />
              <Badge variant="retro" text="mosaic" intent="neutral" />
              <Badge variant="retro" text="braille" intent="success" />
              <Badge variant="retro" text="lego" intent="warning" dot />
            </div>
          </Panel>
        </Act>

        {/* 8b · galería */}
        <Act side="l">
          <Panel blk="rise">
            <SectionHeader variant="retro" kicker="GALERÍA" title="Escenas de ejemplo" subtitle="Arrastra, usa las flechas o pulsa una miniatura. Doble clic para ampliar." />
            <ImageGallery variant="retro" layout="thumbs" zoom />
          </Panel>
          <div className="mz__band" data-blk="slide" style={{ "--dir": -1 } as CSSProperties}>
            <LogoCloud variant="retro" layout="ticker" label="" brands="Nautilus, Costa Brava FM, Surfrider, Deporte Norte, Vela & Mar, Marea Viva, Playa Norte" />
          </div>
        </Act>

        {/* G1 · cartel de las galerías */}
        <Poster intro="slide" side="r" kicker="GALERÍAS · SWIPER" lines={["Mira cómo se ven", "de verdad"]} sub="Ocho presentaciones de las mismas fotos: aquí, en contexto." />

        {/* G2 · coverflow grande */}
        <Act side="c">
          <Panel blk="zoom" className="mz__panel--full">
            <SectionHeader variant="retro" kicker="COVERFLOW" title="Portafolio en 3D" subtitle="Arrastra, usa el teclado o deja que avance solo." />
            <ImageGallery className="mz__gal--big" variant="retro" layout="coverflow" ratio="16/9" images={IMG_PORT} loop autoplay={4} />
          </Panel>
        </Act>

        {/* G3 · cubo grande, casi a ancho completo */}
        <Act side="c" className="mz__act--cube">
          <span className="mn-hl mn-hl--alt mz__label" data-blk="drop">
            CUBO 3D · ARRASTRA PARA GIRAR
          </span>
          <div className="mz__cube" data-blk="zoom">
            <ImageGallery className="mz__gal--cube" variant="retro" layout="cube" ratio="21/9" images={IMG_CUBE} autoplay={5} />
          </div>
        </Act>

        {/* G4 · tira libre y mosaico */}
        <Act side="l">
          <Panel blk="slide" className="mz__panel--full">
            <SectionHeader variant="retro" kicker="TIRA LIBRE" title="Una semana en la escuela" subtitle="Arrastra en horizontal: cada foto tiene su propio ancho." />
            <ImageGallery variant="retro" layout="filmstrip" images={IMG_FILM} />
          </Panel>
          <Panel blk="rise" className="mz__panel--full">
            <SectionHeader variant="retro" kicker="MOSAICO" title="Tienda" subtitle="Dos filas que se desplazan juntas." />
            <ImageGallery variant="retro" layout="mosaic" images={IMG_MOSAIC} captions />
          </Panel>
        </Act>

        {/* G5 · baraja, fundido y creativa */}
        <Act side="r">
          <div className="mz__duo">
            <Panel blk="drop">
              <SectionHeader variant="retro" kicker="BARAJA" title="El equipo" subtitle="Arrastra la carta de arriba." />
              <ImageGallery variant="retro" layout="cards" ratio="3/4" images={IMG_CARDS} />
            </Panel>
            <Panel blk="rise">
              <SectionHeader variant="retro" kicker="FUNDIDO" title="Primeras olas" subtitle="Doble clic para ampliar." />
              <ImageGallery variant="retro" layout="fade" ratio="16/9" images={IMG_FADE} zoom autoplay={5} loop />
            </Panel>
          </div>
          <Panel blk="zoom" className="mz__panel--full">
            <SectionHeader variant="retro" kicker="CREATIVA" title="Sesiones" subtitle="Las diapositivas entran girando." />
            <ImageGallery variant="retro" layout="creative" ratio="16/9" images={IMG_CREATIVE} loop />
          </Panel>
        </Act>

        {/* V1 · cartel del vídeo */}
        <Poster intro="wipe" side="l" kicker="VÍDEO · ASCII" lines={["El mismo vídeo,", "muchas maneras"]} sub="Original, en caracteres, con hover y como fondo." />

        {/* V2 · demos de vídeo */}
        <Act side="c">
          <Panel blk="zoom" className="mz__panel--full">
            <SectionHeader variant="retro" kicker="ORIGINAL" title="Sin efectos" subtitle="El reproductor normal en formato panorámico, con líneas de barrido." />
            <VideoPlayer variant="retro" src={VIDEO_TURTLE} poster={cloudinaryPoster(VIDEO_TURTLE)} title="Tortuga marina" ratio="21/9" scanlines />
          </Panel>

          <div className="mz__duo">
            <Panel blk="slide" side="l">
              <SectionHeader variant="retro" kicker="BRAILLE · ACENTO" title="Puntos finos" subtitle="Hover: agua. Pulsa play y pasa el puntero." />
              <VideoPlayer variant="retro" src={VIDEO_TURTLE} poster={cloudinaryPoster(VIDEO_TURTLE)} title="Braille" ascii asciiStyle="braille" asciiCell={5} asciiColor="accent" asciiHover="water" loop />
            </Panel>
            <Panel blk="slide" side="r">
              <SectionHeader variant="retro" kicker="MOSAICO · COLOR" title="Baldosas" subtitle="Hover: seda." />
              <VideoPlayer variant="retro" src={VIDEO_DEMO} poster={cloudinaryPoster(VIDEO_DEMO)} title="Mosaico" ascii asciiStyle="mosaic" asciiCell={8} asciiColor="source" asciiHover="silk" loop />
            </Panel>
            <Panel blk="rise">
              <SectionHeader variant="retro" kicker="DITHER · GRISES" title="Blanco y negro duro" subtitle="Hover: vórtice." />
              <VideoPlayer variant="retro" src={VIDEO_TURTLE} poster={cloudinaryPoster(VIDEO_TURTLE)} title="Dither" ascii asciiStyle="dither" asciiCell={3} asciiColor="gray" asciiHover="vortex" loop />
            </Panel>
            <Panel blk="rise">
              <SectionHeader variant="retro" kicker="LEGO · CONTROLES MÍNIMOS" title="Bloques" subtitle="Hover: disolución." />
              <VideoPlayer variant="retro" src={VIDEO_DEMO} poster={cloudinaryPoster(VIDEO_DEMO)} title="Lego" ratio="1/1" controls="minimal" ascii asciiStyle="lego" asciiCell={12} asciiColor="source" asciiHover="dissolve" loop />
            </Panel>
          </div>

          <Panel blk="drop" className="mz__panel--full">
            <SectionHeader variant="retro" kicker="MODO FONDO" title="Vídeo como escenario" subtitle="Sin controles, en bucle y en caracteres. Mueve el puntero: el hover también funciona." />
            <div className="mz__vidbg">
              <VideoPlayer background src={VIDEO_TURTLE} ascii asciiStyle="dither" asciiCell={4} asciiColor="accent" asciiHover="vortex" asciiHoverRadius={0.35} />
              <span className="mn-hl mn-hl--alt mz__vidbg-tag">VÍDEO DE FONDO · ASCII</span>
            </div>
          </Panel>

          <div className="mz__duo">
            <Panel blk="slide" side="l">
              <SectionHeader variant="retro" kicker="ENLACE" title="YouTube sin cookies" subtitle="Solo una carátula hasta que pulsas play." />
              <VideoPlayer variant="retro" src="https://www.youtube.com/watch?v=aqz-KE-bpKQ" title="Big Buck Bunny" />
            </Panel>
            <Panel blk="slide" side="r">
              <SectionHeader variant="retro" kicker="CRUZADO" title="Puntos y contorno" subtitle="Hover: contorno, con celda gruesa para ver el efecto." />
              <VideoPlayer variant="retro" src={VIDEO_TURTLE} poster={cloudinaryPoster(VIDEO_TURTLE)} title="Cruces" ascii asciiStyle="cross" asciiCell={9} asciiColor="source" asciiHover="contour" asciiHoverStrength={0.9} loop />
            </Panel>
          </div>
        </Act>

        {/* 9 */}
        <Poster intro="type" side="r" kicker="05 · PLANES" lines={["Elige tu", "tamaño de celda"]} sub="Sin letra pequeña. Cancela cuando quieras." />

        {/* 10 · precios */}
        <Act side="l">
          <Panel blk="drop" className="mz__panel--wide">
            <PricingSection
              ctaHref="#contacto"
              variant="retro"
              kicker="PRECIOS"
              title="Tres planes"
              subtitle="Todos incluyen las 11 formas y los 8 efectos de hover."
              plans={"Píxel|0 €|siempre|no|3 formas;Celda de 8 px;Sin hover propio\nFaceta|19 €|al mes|si|11 formas;Celda desde 3 px;8 efectos de hover;Tinte por scroll\nEstudio|79 €|al mes|no|Todo lo de Faceta;Formas a medida;Soporte directo"}
            />
          </Panel>
        </Act>

        {/* 11 */}
        <Poster intro="rise" side="l" kicker="06 · VOCES" lines={["Lo que dicen", "quienes lo usan"]} sub="Y unas cuantas dudas resueltas." />

        {/* 12 · testimonios + faq */}
        <Act side="r">
          <Panel blk="wipe" side="r">
            <TestimonialSection
              variant="retro"
              kicker="OPINIONES"
              title="Se nota en la portada"
              layout="carousel"
              perView={2}
              autoplay={6}
              items={"Pasé de un vídeo de 8 MB a una forma que responde al puntero. La gente se queda jugando con ella.|Lucía M.|Diseño, estudio Marea|5\nLa celda de 3 px cambió por completo cómo se ve la landing en pantallas grandes.|Iker P.|Front-end|5\nEl hover de cada figura fue lo que convenció al cliente.|Ana R.|Dirección creativa|4"}
            />
          </Panel>
          <Panel blk="slide" side="r">
            <FAQSection
              variant="retro"
              kicker="DUDAS"
              title="Preguntas frecuentes"
              align="left"
              items={"¿Necesita imágenes?|No. Las formas se generan en el navegador, sin archivos.\n¿Y en móvil?|Sí. Sin puntero real el hover se activa solo y la figura sigue girando.\n¿Se pueden cambiar los colores?|El acento cambia con el scroll y todo el kit lo lee del mismo token.\n¿Cuántas formas hay?|Once: cubo, pirámide, esfera, cilindro, cono, octaedro, tetraedro, icosaedro, prisma, diamante y nudo."}
            />
          </Panel>
        </Act>

        {/* 13 */}
        <Poster intro="scramble" side="l" kicker="07 · EMPIEZA" lines={["Tu portada,", "en tres píxeles"]} sub="Pruébalo hoy con la forma que quieras." />

        {/* 14 · cierre */}
        <Act side="l">
          <Panel blk="zoom">
            <CTASection variant="retro" kicker="ÚLTIMO PASO" title="Elige forma y celda" subtitle="Te lo montamos en una tarde." primaryCta="Empezar gratis" secondaryCta="Ver la demo" align="left" />
          </Panel>
          <Panel blk="slide" side="l">
            <div id="contacto"><ContactForm variant="retro" title="Cuéntanos tu caso" subtitle="Respondemos en un día." fields="name,email,message" submitLabel="Enviar" /></div>
          </Panel>
          <Panel blk="rise" side="l">
            <Accordion variant="retro" items={"¿Qué formato tiene la prueba?|Un fondo en tu web durante 14 días.\n¿Puedo cancelar?|Cuando quieras, sin permanencia."} />
            <div className="mz__row">
              <Button variant="retro" label="Volver arriba" glyph="↑" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
            </div>
          </Panel>
          <div className="mz__foot" data-blk="drop">
            <Footer variant="retro" brand="FACETA" tagline="Formas en caracteres." columns={"Producto: Formas, Hover, Precios;Recursos: Guía, Ejemplos, Changelog;Contacto: Correo, Estado"} social="icon:github, icon:discord" copyright="© 2026 Faceta · demo de prueba" />
          </div>
        </Act>
      </main>
    </div>
  );
}
