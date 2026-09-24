"use client";

import Carousel from "@/components/ui/Carousel";
import ImageGallery, { GALLERY_LAYOUTS } from "@/components/ui/ImageGallery";
import VideoPlayer, { cloudinaryPoster } from "@/components/ui/VideoPlayer";
import { vcls } from "@/components/ui/variants";
import type { CatalogEntry } from "../schema";
import { ALL_STYLES, Sample, variantProp } from "./shared";

/**
 * Galerías y carruseles sobre Swiper (https://swiperjs.com/). `ImageGallery` presenta las mismas imágenes de ocho maneras;
 * `Carousel` es el carrusel genérico que usan también las secciones (testimonios, ventajas, precios, equipo, blog) con su
 * prop `layout="carousel"`, y la cinta continua de marcas (`LogoCloud layout="ticker"`).
 */
const CLD_SAMPLE = "https://res.cloudinary.com/martinezsebastian-test/video/upload/v1701113097/samples/cld-sample-video.mp4";
const CLD_TURTLE = "https://res.cloudinary.com/martinezsebastian-test/video/upload/v1701113091/samples/sea-turtle.mp4";
const LOCAL_LIFE = "/video/pixel-life.mp4";
const YOUTUBE = "https://www.youtube.com/watch?v=aqz-KE-bpKQ";

/** Muestras del visor: fuente → carátula. Las de Cloudinary usan un fotograma del propio vídeo. */
const VIDEO_SAMPLES: Record<string, string> = {
  [CLD_SAMPLE]: "Cloudinary · cld-sample-video",
  [CLD_TURTLE]: "Cloudinary · sea-turtle",
  [LOCAL_LIFE]: "Local · pixel-life (8 s, sin audio)",
  [YOUTUBE]: "YouTube · enlace (carátula, sin cookies)",
};

export const galerias: CatalogEntry[] = [
  {
    id: "image-gallery",
    component: "ImageGallery",
    path: "@/components/ui/ImageGallery",
    name: "Galería de imágenes",
    category: "galerias",
    styles: ALL_STYLES,
    description:
      "Ocho presentaciones de las mismas fotos: imagen grande con miniaturas, coverflow 3D, baraja, fundido, cubo, creativa, tira libre y mosaico de dos filas. Táctil, con teclado y flechas; sin imágenes propias usa escenas pixel art generadas.",
    stageHeight: 560,
    notes: [
      "Cada línea de «imágenes» es «imagen|título|texto». La imagen puede ser una URL o ruta, o `gen:N` (0, 1, 2…) para una escena de ejemplo generada, sin descargas.",
      "Las flechas, los puntos y las imágenes toman borde, radio y sombra de la variante de estilo (variables --s-*).",
      "El zoom (doble clic o pellizco) solo se aplica a los modos thumbs y fade.",
    ],
    props: [
      { key: "layout", label: "Presentación", type: "select", default: "thumbs", options: GALLERY_LAYOUTS, hint: "thumbs · coverflow · cards · fade · cube · creative · filmstrip · mosaic" },
      {
        key: "images",
        label: "Imágenes (una por línea, «imagen|título|texto»)",
        type: "text",
        multiline: true,
        default:
          "gen:0|Amanecer|Primera luz sobre la bahía\ngen:1|Mediodía|Mar limpio y viento suave\ngen:2|Atardecer|La hora dorada del swell\ngen:3|Noche|Luna llena y marea alta\ngen:4|Cala|Aguas verdes entre rocas\ngen:5|Ocaso|Rojos y naranjas en el horizonte\ngen:6|Bruma|Mañana de niebla fina\ngen:7|Aurora|Cielo violeta sobre el agua",
      },
      { key: "ratio", label: "Proporción", type: "select", default: "4/3", options: ["4/3", "16/9", "21/9", "1/1", "3/4"], when: (p) => p.layout !== "filmstrip" && p.layout !== "mosaic" },
      { key: "captions", label: "Pies de foto", type: "boolean", default: true },
      { key: "autoplay", label: "Reproducción automática (s, 0 = manual)", type: "number", default: 0, min: 0, max: 8, step: 1 },
      { key: "loop", label: "Bucle", type: "boolean", default: false, when: (p) => p.layout !== "thumbs" && p.layout !== "cards" && p.layout !== "mosaic" && p.layout !== "cube" },
      { key: "zoom", label: "Zoom", type: "boolean", default: false, when: (p) => p.layout === "thumbs" || p.layout === "fade" },
      variantProp("retro"),
    ],
    render: (p) => (
      <div className="ui-center ui-center--top" style={{ padding: "8px 4px", justifyItems: "stretch", gridTemplateColumns: "minmax(0, 1fr)" }}>
        <ImageGallery
          key={p.layout as string}
          layout={p.layout as never}
          images={p.images as string}
          ratio={p.ratio as never}
          captions={p.captions as boolean}
          autoplay={p.autoplay as number}
          loop={p.loop as boolean}
          zoom={p.zoom as boolean}
          variant={p.variant as never}
        />
      </div>
    ),
  },
  {
    id: "carousel",
    component: "Carousel",
    path: "@/components/ui/Carousel",
    name: "Carrusel",
    category: "galerias",
    styles: ALL_STYLES,
    description:
      "Carrusel genérico sobre Swiper: cada hijo es una diapositiva. Diapositivas visibles responsivas, reproducción automática, bucle, fundido, baraja apilada o cinta continua, con flechas y puntos cuadrados del estilo activo.",
    stageHeight: 340,
    notes: [
      "Las secciones (testimonios, ventajas, precios, equipo, blog) lo usan por dentro con `layout=\"carousel\"`; úsalo directamente para cualquier lista de tarjetas.",
      "En pantallas estrechas baja solo a 2 y a 1 diapositiva visible.",
    ],
    props: [
      {
        key: "cards",
        label: "Tarjetas (una por línea, «título|texto»)",
        type: "text",
        multiline: true,
        default: "Iniciación|Grupos de seis y mucha paciencia.\nPrivadas|Un monitor solo para ti.\nSurf trips|Fines de semana en la costa norte.\nBono|Cinco clases con descuento.\nFamilias|Cursos para todas las edades.",
      },
      { key: "effect", label: "Efecto", type: "select", default: "slide", options: ["slide", "fade", "cards"] },
      { key: "perView", label: "Visibles (pantalla ancha)", type: "number", default: 3, min: 1, max: 5, step: 1, when: (p) => p.effect === "slide" && !p.ticker },
      { key: "gap", label: "Separación (px)", type: "number", default: 20, min: 0, max: 40, step: 2, when: (p) => p.effect === "slide" },
      { key: "autoplay", label: "Reproducción automática (s, 0 = manual)", type: "number", default: 0, min: 0, max: 8, step: 1, when: (p) => !p.ticker },
      { key: "loop", label: "Bucle", type: "boolean", default: true, when: (p) => !p.ticker },
      { key: "arrows", label: "Flechas", type: "boolean", default: true, when: (p) => !p.ticker },
      { key: "dots", label: "Indicador", type: "select", default: "bullets", options: ["none", "bullets", "progress", "fraction"], when: (p) => !p.ticker },
      { key: "ticker", label: "Cinta continua", type: "boolean", default: false, hint: "Avanza sola sin paradas: útil para marcas o etiquetas" },
      variantProp("glass"),
    ],
    render: (p) => {
      const rows = (p.cards as string)
        .split("\n")
        .map((l) => l.split("|"))
        .filter((r) => r[0]?.trim());
      return (
        <div className="ui-center ui-center--top" style={{ padding: "8px 4px", justifyItems: "stretch", gridTemplateColumns: "minmax(0, 1fr)" }}>
          <Carousel
            key={`${p.effect}-${p.ticker}`}
            effect={p.effect as never}
            perView={p.perView as number}
            gap={p.gap as number}
            autoplay={p.autoplay as number}
            loop={p.loop as boolean}
            arrows={p.arrows as boolean}
            dots={p.dots as never}
            ticker={p.ticker as boolean}
            variant={p.variant as never}
          >
            {rows.map(([title, text], i) => (
              <div key={title + i} className={`ui-surface ${vcls(p.variant as never)}`} style={{ padding: 20, display: "grid", gap: 6, alignContent: "start", minHeight: 120 }}>
                <strong>{title}</strong>
                <span style={{ color: "var(--mut)", fontSize: 14 }}>{text}</span>
              </div>
            ))}
          </Carousel>
        </div>
      );
    },
  },
  {
    id: "video-player",
    component: "VideoPlayer",
    path: "@/components/ui/VideoPlayer",
    name: "Reproductor de vídeo",
    category: "galerias",
    styles: ALL_STYLES,
    description:
      "Reproductor sobre el <video> nativo, sin dependencias, con controles propios del estilo: play, progreso arrastrable, volumen, velocidad, subtítulos, imagen en imagen, pantalla completa y atajos de teclado. Los enlaces de YouTube y Vimeo se cargan bajo demanda, sin cookies hasta pulsar play. El modo fondo rellena un contenedor, en bucle y sin controles.",
    stageHeight: 560,
    notes: [
      "«Fuente» admite un archivo (.mp4, .webm), un enlace de YouTube (watch, youtu.be, shorts) o de Vimeo. Con un enlace de YouTube/Vimeo solo aplican título, proporción y carátula.",
      "Atajos con el reproductor enfocado: espacio o K, ←/→ ±5 s (J/L ±10 s), ↑/↓ volumen, M silencio, F pantalla completa, C subtítulos, 0–9 salta al 0–90 %.",
      "Muestras: dos vídeos de Cloudinary (cld-sample-video y sea-turtle), uno local generado con ffmpeg (public/video/pixel-life.mp4, 8 s, sin audio) y un enlace de YouTube. La carátula de los de Cloudinary sale de un fotograma del propio vídeo (cloudinaryPoster).",
      "El efecto ASCII pinta el vídeo como caracteres encima del original (que sigue reproduciéndose debajo). Exige que el servidor del vídeo permita CORS: Cloudinary y los archivos del propio sitio sí; si no, avisa y muestra el vídeo normal.",
      "Con prefers-reduced-motion el autoplay y el modo fondo no arrancan; fuera de pantalla el vídeo se pausa solo (pauseOffscreen).",
    ],
    props: [
      { key: "src", label: "Vídeo de ejemplo", type: "select", default: CLD_SAMPLE, options: Object.keys(VIDEO_SAMPLES), labels: VIDEO_SAMPLES, hint: "Cambia entre los vídeos de muestra para compararlos" },
      { key: "customSrc", label: "Pegar una URL (archivo, YouTube o Vimeo)", type: "text", default: "", noCode: true, hint: "Si la rellenas, sustituye al vídeo de ejemplo. Admite enlaces de YouTube con lista (&list=) y tiempo (&t=)" },
      { key: "poster", label: "Carátula (URL o gen:N)", type: "text", default: "", hint: "Vacío = un fotograma del propio vídeo (Cloudinary), la imagen local o la miniatura de YouTube" },
      { key: "title", label: "Título", type: "text", default: "Vida en píxeles" },
      { key: "ratio", label: "Proporción", type: "select", default: "16/9", options: ["16/9", "21/9", "4/3", "1/1", "9/16"], when: (p) => !p.background },
      { key: "controls", label: "Controles", type: "select", default: "full", options: ["full", "minimal", "none"], when: (p) => !p.background },
      { key: "autoplay", label: "Autoplay (silenciado)", type: "boolean", default: false, when: (p) => !p.background },
      { key: "muted", label: "Silenciado", type: "boolean", default: false, when: (p) => !p.background },
      { key: "loop", label: "Bucle", type: "boolean", default: false, when: (p) => !p.background },
      { key: "startAt", label: "Empieza en (s)", type: "number", default: 0, min: 0, max: 30, step: 1, when: (p) => !p.background },
      { key: "background", label: "Modo fondo", type: "boolean", default: false, hint: "Rellena el contenedor, mudo, en bucle y sin controles" },
      { key: "scanlines", label: "Líneas de barrido CRT", type: "boolean", default: false },
      { key: "ascii", label: "Efecto ASCII (asciify-engine)", type: "boolean", default: false, hint: "Convierte el vídeo a caracteres en tiempo real; el original sigue reproduciéndose debajo. No aplica a YouTube/Vimeo" },
      { key: "asciiStyle", label: "Estilo ASCII", type: "select", default: "ascii", options: ["ascii", "braille", "dots", "lines", "blocks", "cross", "diagonal", "diamond", "mixed", "pixel", "mosaic", "lego", "voxel", "disco", "dither"], when: (p) => p.ascii === true },
      { key: "asciiCell", label: "Celda ASCII (px)", type: "number", default: 6, min: 3, max: 20, step: 1, when: (p) => p.ascii === true },
      { key: "asciiColor", label: "Color ASCII", type: "select", default: "source", options: ["source", "accent", "gray"], when: (p) => p.ascii === true },
      { key: "asciiHover", label: "Hover ASCII", type: "select", default: "water", options: ["none", "trail", "water", "contour", "dissolve", "silk", "vortex"], when: (p) => p.ascii === true, hint: "Igual que en los fondos: reacciona al puntero sobre el vídeo" },
      { key: "asciiHoverStrength", label: "Fuerza del hover", type: "number", default: 0.7, min: 0, max: 1, step: 0.05, when: (p) => p.ascii === true && p.asciiHover !== "none" },
      { key: "asciiHoverRadius", label: "Radio del hover", type: "number", default: 0.28, min: 0.1, max: 0.6, step: 0.02, when: (p) => p.ascii === true && p.asciiHover !== "none" },
      { key: "pauseOffscreen", label: "Pausar fuera de pantalla", type: "boolean", default: true },
      variantProp("retro"),
    ],
    render: (p) => {
      const src = ((p.customSrc as string) || "").trim() || (p.src as string);
      const poster = (p.poster as string) || cloudinaryPoster(src) || (src === LOCAL_LIFE ? "/video/pixel-life.png" : undefined);
      const props = {
        src,
        poster,
        title: p.title as string,
        scanlines: p.scanlines as boolean,
        ascii: p.ascii as boolean,
        asciiStyle: p.asciiStyle as never,
        asciiCell: p.asciiCell as number,
        asciiColor: p.asciiColor as never,
        asciiHover: p.asciiHover as never,
        asciiHoverStrength: p.asciiHoverStrength as number,
        asciiHoverRadius: p.asciiHoverRadius as number,
        pauseOffscreen: p.pauseOffscreen as boolean,
        variant: p.variant as never,
      };
      if (p.background)
        return (
          <div className="ui-center ui-center--full">
            <VideoPlayer key={`bg-${src}-${p.ascii}`} {...props} background />
            <Sample>Vídeo de fondo</Sample>
          </div>
        );
      return (
        <div className="ui-center ui-center--top" style={{ padding: "8px 4px", justifyItems: "stretch", gridTemplateColumns: "minmax(0, 1fr)" }}>
          <VideoPlayer key={`${src}-${p.ratio}-${p.autoplay}-${p.startAt}-${p.ascii}`} {...props} ratio={p.ratio as never} controls={p.controls as never} autoplay={p.autoplay as boolean} muted={p.muted as boolean} loop={p.loop as boolean} startAt={p.startAt as number} />
        </div>
      );
    },
  },
];
