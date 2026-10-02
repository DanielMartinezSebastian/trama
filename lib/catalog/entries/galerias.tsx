"use client";

import type { ReactNode } from "react";
import AudioPlayer from "@/components/ui/AudioPlayer";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Carousel from "@/components/ui/Carousel";
import DeviceMockup, { DEVICE_MOTIONS, type DeviceMockupProps } from "@/components/ui/DeviceMockup";
import DeviceMockup3D from "@/components/ui/DeviceMockup3D";
import ImageGallery, { GALLERY_LAYOUTS } from "@/components/ui/ImageGallery";
import Logo3D, { LOGO3D_MOTIONS, LOGO3D_STYLES } from "@/components/ui/Logo3D";
import LogoCoin from "@/components/ui/LogoCoin";
import VideoPlayer, { cloudinaryPoster } from "@/components/ui/VideoPlayer";
import { vcls } from "@/components/ui/variants";
import { DEVICES, DEVICE_PLATFORMS, DEVICE_POINTER_SIDES, deviceGeometry, type DeviceKind } from "@/lib/ui/devices";
import type { CatalogEntry, PropSpec, Values } from "../schema";
import { ALL_STYLES, Sample, toneProp, variantProp } from "./shared";

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

/**
 * Captura de ejemplo para los mockups: una landing esquemática (cabecera, titular, tarjetas, pie) dibujada como SVG al ancho
 * del viewport del dispositivo y `pages` pantallas de alto, para probar el recorrido de capturas largas sin descargar nada.
 */
function fakeScreenshot(device: DeviceKind, landscape: boolean, pages = 3.2): string {
  const { w, h } = deviceGeometry(device, landscape ? "landscape" : "portrait").screen;
  const H = Math.round(h * pages);
  const u = w / 24; // rejilla de 24 columnas
  const cols = w > 700 ? 3 : 1;
  const r = (x: number, y: number, rw: number, rh: number, fill: string, rx = u * 0.3) => `<rect x="${x}" y="${y}" width="${rw}" height="${rh}" rx="${rx}" fill="${fill}"/>`;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${H}" width="${w}" height="${H}">` + r(0, 0, w, H, "#0b1020", 0);
  s += r(u, u * 0.8, u * 4, u * 0.9, "#7cc4ff") + r(w - u * 5, u * 0.8, u * 4, u * 0.9, "#232b45");
  s += r(u, u * 4, w * 0.7, u * 1.6, "#e8ecf4") + r(u, u * 6.2, w * 0.5, u * 1.6, "#e8ecf4") + r(u, u * 9, w * 0.8, u * 0.6, "#5b6680") + r(u, u * 10.2, w * 0.6, u * 0.6, "#5b6680") + r(u, u * 12, u * 6, u * 1.6, "#7cc4ff", u * 0.8);
  const cw = (w - u * (cols + 1)) / cols;
  let y = Math.max(h * 0.8, u * 16);
  for (let row = 0; y < H - h * 0.5; row++) {
    for (let c = 0; c < cols; c++) {
      const x = u + c * (cw + u);
      s += r(x, y, cw, cw * 0.6, (row + c) % 2 ? "#1a2340" : "#2a1f4a") + r(x, y + cw * 0.6 + u * 0.6, cw * 0.7, u * 0.7, "#e8ecf4") + r(x, y + cw * 0.6 + u * 1.8, cw * 0.9, u * 0.5, "#5b6680");
    }
    y += cw * 0.6 + u * 4.2;
  }
  s += r(0, H - u * 5, w, u * 5, "#060912", 0) + r(u, H - u * 3.4, u * 5, u * 0.7, "#c084fc") + r(u, H - u * 2, w * 0.5, u * 0.5, "#232b45");
  return `data:image/svg+xml;utf8,${encodeURIComponent(s + "</svg>")}`;
}

/** Logo de ejemplo para `LogoCoin`: un círculo oscuro con «< >» de trazo grueso, como SVG en data URI. */
const SAMPLE_LOGO = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" fill="#05050f"/><path d="M78 62 44 96l34 34M114 62l34 34-34 34" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/></svg>',
)}`;

const DEVICE_DEMOS: Record<string, string> = {
  screenshot: "Captura larga (recorre la página al pasar el puntero)",
  image: "Imagen",
  web: "Web en vivo (/demo/th-minimal)",
  react: "Componentes React del kit",
  custom: "Tus props: url, image y video",
};

/** Controles comunes a `DeviceMockup` y `DeviceMockup3D`. */
const deviceSpecs = (): PropSpec[] => [
  { key: "device", label: "Dispositivo", type: "select", default: "phone", options: DEVICES, labels: { phone: "móvil", tablet: "tablet", laptop: "portátil", desktop: "monitor", browser: "ventana de navegador" } },
  { key: "platform", label: "Tipo de móvil", type: "select", default: "ios", options: DEVICE_PLATFORMS, labels: { ios: "iPhone (isla)", android: "Android (cámara redonda)" }, when: (p) => p.device === "phone" },
  { key: "orientation", label: "Orientación", type: "select", default: "portrait", options: ["portrait", "landscape"], labels: { portrait: "vertical", landscape: "horizontal" }, when: (p) => p.device === "phone" || p.device === "tablet" },
  { key: "rotatable", label: "Botón para girarlo", type: "boolean", default: false, when: (p) => p.device === "phone" || p.device === "tablet", hint: "El visitante lo cambia entre vertical y horizontal" },
  { key: "rotateLabel", label: "Texto accesible del botón", type: "text", default: "Girar el dispositivo", when: (p) => p.rotatable === true && (p.device === "phone" || p.device === "tablet") },
  { key: "demo", label: "Contenido de ejemplo", type: "select", default: "screenshot", options: Object.keys(DEVICE_DEMOS), labels: DEVICE_DEMOS, noCode: true },
  { key: "url", label: "Web en vivo (URL)", type: "text", default: "", when: (p) => p.demo === "custom", hint: "La web debe permitir incrustarse en un iframe" },
  { key: "image", label: "Captura (URL, ruta o gen:N)", type: "text", default: "", when: (p) => p.demo === "custom", hint: "Sola es el contenido; con url o video, la imagen previa y la del modo estático" },
  { key: "video", label: "Vídeo (.mp4, .webm)", type: "text", default: "", when: (p) => p.demo === "custom" },
  { key: "alt", label: "Descripción accesible", type: "text", default: "", hint: "Vacío = decorativo" },
  { key: "urlLabel", label: "Texto de la barra de direcciones", type: "text", default: "", when: (p) => p.device === "browser", hint: "Vacío = el dominio de url" },
  { key: "imageScroll", label: "Recorrido de capturas largas", type: "select", default: "hover", options: ["hover", "auto", "none"], labels: { hover: "al pasar el puntero", auto: "automático", none: "ninguno" } },
  { key: "interactive", label: "Contenido utilizable (scroll y clics)", type: "boolean", default: false },
  { key: "viewportWidth", label: "Ancho del viewport simulado (px, 0 = el del dispositivo)", type: "number", default: 0, min: 0, max: 1920, step: 10 },
  { key: "safeArea", label: "Área segura (la web empieza bajo la isla)", type: "boolean", default: false, when: (p) => p.device === "phone", hint: "Para webs cuyo menú queda tapado por la isla. Color de la franja: --device-safe" },
  { key: "systemNav", label: "Navegación del sistema", type: "boolean", default: false, when: (p) => p.device === "phone" || p.device === "tablet", hint: "iPhone: indicador de inicio · Android: atrás, inicio y recientes. La web queda por encima" },
  toneProp("mut"),
  { key: "rotateX", label: "Inclinación (°, positivo = desde arriba)", type: "number", default: 0, min: -30, max: 40, step: 1 },
  { key: "rotateY", label: "Giro (°)", type: "number", default: 0, min: -60, max: 60, step: 1 },
  { key: "motion", label: "Movimiento", type: "select", default: "float", options: DEVICE_MOTIONS, labels: { none: "quieto", float: "flota", sway: "se balancea", spin: "gira", pointer: "sigue al puntero" } },
  { key: "pointerX", label: "Giro máximo con el puntero (°)", type: "number", default: 16, min: 0, max: 45, step: 1, when: (p) => p.motion === "pointer", hint: "0 = no gira a los lados" },
  { key: "pointerY", label: "Inclinación máxima con el puntero (°)", type: "number", default: 10, min: 0, max: 30, step: 1, when: (p) => p.motion === "pointer", hint: "0 = no se inclina arriba ni abajo" },
  { key: "pointerSide", label: "Lado del giro", type: "select", default: "both", options: DEVICE_POINTER_SIDES, labels: { both: "los dos", left: "solo a la izquierda", right: "solo a la derecha" }, when: (p) => p.motion === "pointer" && (p.pointerX as number) > 0 },
  { key: "speed", label: "Velocidad", type: "number", default: 1, min: 0.2, max: 3, step: 0.1, when: (p) => p.motion !== "none" || p.imageScroll !== "none" },
  { key: "shadow", label: "Sombra", type: "boolean", default: true },
  { key: "glare", label: "Reflejo del cristal", type: "boolean", default: true },
  { key: "shine", label: "Brillos y reflejos (0 = mate)", type: "number", default: 1, min: 0, max: 2, step: 0.05, hint: "En 3D gradúa también los reflejos de la carcasa, que cambian cuando el aparato se mueve o sigue al puntero" },
  { key: "ownScreenShine", label: "Reflejo del cristal aparte", type: "boolean", default: false, noCode: true, when: (p) => p.glare === true, hint: "Apagado, el cristal sigue a «Brillos y reflejos»" },
  { key: "screenShine", label: "Reflejo del cristal (screenShine)", type: "number", default: 1, min: 0, max: 2, step: 0.05, when: (p) => p.glare === true && p.ownScreenShine === true },
  { key: "still", label: "Imagen fija", type: "boolean", default: false, hint: "Sin movimiento y, si hay captura, la muestra en lugar de la web o el vídeo" },
];

/** Las props de una entrada de mockup, con el contenido de ejemplo elegido. */
function deviceValues(p: Values): DeviceMockupProps {
  const device = p.device as DeviceKind;
  const landscape = p.orientation === "landscape" && (device === "phone" || device === "tablet");
  const demo = p.demo as string;
  const shot = fakeScreenshot(device, landscape);
  const content: DeviceMockupProps =
    demo === "custom"
      ? { url: (p.url as string).trim() || undefined, image: (p.image as string).trim() || undefined, video: (p.video as string).trim() || undefined }
      : demo === "web"
        ? { url: "/demo/th-minimal", image: shot }
        : demo === "image"
          ? { image: "gen:2" }
          : demo === "react"
            ? {
                children: (
                  <div style={{ display: "grid", gap: 18, alignContent: "start", padding: "12cqw 7cqw", minHeight: "100%", boxSizing: "border-box" }}>
                    <div>
                      <Badge text="Nuevo" variant="outline" />
                    </div>
                    <strong style={{ fontSize: "clamp(28px, 9cqw, 64px)", lineHeight: 1.05 }}>Clases de surf al amanecer</strong>
                    <span style={{ color: "var(--mut)", fontSize: 17, lineHeight: 1.5 }}>Este contenido es React real, maquetado al ancho del viewport simulado.</span>
                    <div>
                      <Button label="Reservar plaza" variant="solid" />
                    </div>
                  </div>
                ),
              }
            : { image: shot };
  return {
    ...content,
    device,
    platform: p.platform as never,
    orientation: landscape ? "landscape" : "portrait",
    rotatable: p.rotatable as boolean,
    rotateLabel: p.rotateLabel as string,
    alt: p.alt as string,
    urlLabel: (p.urlLabel as string) || (demo === "web" || demo === "custom" ? undefined : "tu-proyecto.com"),
    imageScroll: p.imageScroll as never,
    interactive: p.interactive as boolean,
    viewportWidth: p.viewportWidth as number,
    safeArea: p.safeArea as boolean,
    systemNav: p.systemNav as boolean,
    tone: p.tone as never,
    rotateX: p.rotateX as number,
    rotateY: p.rotateY as number,
    motion: p.motion as never,
    pointerX: p.pointerX as number,
    pointerY: p.pointerY as number,
    pointerSide: p.pointerSide as never,
    speed: p.speed as number,
    shadow: p.shadow as boolean,
    glare: p.glare as boolean,
    shine: p.shine as number,
    screenShine: p.ownScreenShine ? (p.screenShine as number) : undefined,
    still: p.still as boolean,
  };
}

const DEVICE_NOTES = [
  "Contenido, por orden de preferencia: `url` (web real en un iframe), `video`, `children` (React) o solo `image` (captura). Con `url` o `video`, `image` es la imagen previa y la que queda en modo estático.",
  "La pantalla simula el viewport real del dispositivo (móvil 390 px, o 412 con `platform` android; tablet 820, portátil 1440, monitor 1920, navegador 1280) y lo reduce al tamaño del mockup: la web se ve como en ese aparato. `viewportWidth` lo cambia. Los `children` pueden responder a ese ancho con `@container`.",
  "Una web solo se puede incrustar si lo permite: `X-Frame-Options: DENY` o `frame-ancestors 'none'` la dejan en blanco, y tu propia CSP necesita `frame-src` con ese origen. Para webs de terceros, usa una captura.",
  "Ocupa el ancho de su contenedor (que debe tener ancho propio) hasta `--device-max`: 300 px el móvil, 460 la tablet, 860 el portátil, 900 el monitor y el navegador.",
  "`safeArea` (móvil): la web no se pinta bajo la isla sino debajo de ella, como el área segura de un teléfono real; la franja es negra o del color de `--device-safe` (p. ej. el de la cabecera de la web).",
  "`orientation` fija la orientación de móvil y tablet; `rotatable` añade debajo un botón para que el visitante lo gire (la web en vivo se adapta al nuevo viewport).",
  "`systemNav` (móvil y tablet): pinta la navegación del sistema y deja la web por encima; el indicador de inicio con `platform` ios, o los tres botones de Android (a la derecha con el móvil en horizontal). Color de los iconos: `--device-nav`.",
  "Con `motion` pointer, `pointerX` y `pointerY` son los grados máximos de giro horizontal e inclinación vertical (0 anula ese eje) y `pointerSide` deja girar solo hacia un lado: con `left`, el aparato solo se vuelve cuando el puntero está a su izquierda.",
  "Por defecto el contenido no es utilizable (no atrapa el scroll ni el foco); `interactive` lo activa.",
];

const deviceStage = (mockup: ReactNode) => (
  <div className="ui-center" style={{ padding: "56px 40px", justifyItems: "stretch", gridTemplateColumns: "minmax(0, 1fr)" }}>
    {mockup}
  </div>
);

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
    id: "device-mockup",
    component: "DeviceMockup",
    path: "@/components/ui/DeviceMockup",
    name: "Mockup de dispositivo",
    category: "galerias",
    styles: ALL_STYLES,
    description:
      "Vista previa de una web dentro de un móvil, tablet, portátil, monitor o ventana de navegador dibujados con CSS: web real en un iframe a tamaño de viewport, captura (con recorrido de páginas largas), vídeo o contenido React. Sin WebGL ni dependencias; para enseñar proyectos en un portfolio o una landing.",
    stageHeight: 780,
    notes: [...DEVICE_NOTES, "Con `prefers-reduced-motion` queda quieto y el vídeo no arranca. `still` lo fuerza y además muestra `image` en lugar de la web."],
    props: deviceSpecs(),
    render: (p) => deviceStage(<DeviceMockup key={`${p.device}-${p.platform}-${p.demo}`} {...deviceValues(p)} />),
  },
  {
    id: "device-mockup-3d",
    component: "DeviceMockup3D",
    path: "@/components/ui/DeviceMockup3D",
    name: "Mockup de dispositivo 3D",
    category: "galerias",
    styles: ALL_STYLES,
    description:
      "El mismo mockup con volumen: carcasa three.js generada (canto, cristal, reflejos, sombra) y la pantalla como DOM real colocado en 3D, así la web en vivo sigue siendo utilizable. Si el equipo no puede con WebGL, va justo o pide reducir movimiento, pinta solo la versión CSS como imagen fija.",
    stageHeight: 780,
    notes: [
      "Requiere `three` y `@react-three/fiber` (opcionales en el paquete): importa `trama-ui/DeviceMockup3D`. three se descarga bajo demanda, al acercarse el mockup a la pantalla; mientras, se ve la versión CSS en la misma caja y con la misma pose.",
      "`render`: `auto` elige 3D salvo sin WebGL2, con `Save-Data`, ≤ 2 GB de memoria, ≤ 2 núcleos o `prefers-reduced-motion`, que caen a imagen fija; `3d` lo fuerza; `flat` es la versión CSS; `static`, la CSS quieta con `image` en lugar de la web.",
      "Cada mockup 3D es un contexto WebGL (los navegadores admiten unos 16): en una rejilla de proyectos usa 3D en uno o dos destacados y `DeviceMockup` en el resto. Dibuja bajo demanda y se detiene fuera de pantalla.",
      ...DEVICE_NOTES,
    ],
    props: [{ key: "render", label: "Render", type: "select", default: "auto", options: ["auto", "3d", "flat", "static"], labels: { auto: "auto (3D si el equipo puede)", "3d": "3D siempre", flat: "CSS", static: "imagen fija" } }, ...deviceSpecs()],
    render: (p) => deviceStage(<DeviceMockup3D key={`${p.device}-${p.platform}-${p.demo}-${p.render}`} render={p.render as never} {...deviceValues(p)} />),
  },
  {
    id: "logo-coin",
    component: "LogoCoin",
    path: "@/components/ui/LogoCoin",
    name: "Logo giratorio 3D",
    category: "galerias",
    styles: ALL_STYLES,
    description:
      "Un logo con volumen que gira sobre su eje vertical, como una moneda: la marca en las dos caras y canto visible. CSS 3D puro, sin WebGL ni dependencias: lo anima el compositor, no cuesta nada dentro de un contenedor oculto y no recibe toques. Para dar vida a un menú, una cabecera o una pantalla de carga.",
    stageHeight: 320,
    notes: [
      "La marca va en `src` (URL, ruta o `gen:N`) o como `children` (un SVG, un `Icon`, texto), que se pinta en las dos caras. Con un logo ya redondo, `fit` cover; con uno suelto, contain.",
      "Decorativo por defecto: `aria-hidden` y sin eventos. `alt` le da nombre accesible. `draggable` deja girarlo arrastrando, con inercia (entonces sí recibe toques, pero el scroll vertical pasa).",
      "Sin `draggable` no ejecuta JavaScript por fotograma: es una animación CSS de `transform`. Con `prefers-reduced-motion` o `still` queda quieto y ladeado, con el canto a la vista.",
      "Color del canto: `tone`. Fondo de las caras: `faceTone`.",
    ],
    props: [
      { key: "src", label: "Imagen de la marca (URL, ruta o gen:N)", type: "text", default: "", hint: "Vacío = el logo de ejemplo del catálogo" },
      { key: "diameter", label: "Diámetro (px)", type: "number", default: 120, min: 40, max: 320, step: 4 },
      { key: "thickness", label: "Grosor del canto (px)", type: "number", default: 12, min: 2, max: 48, step: 1 },
      toneProp("acc"),
      { key: "faceTone", label: "Fondo de las caras (token)", type: "select", default: "bg", options: ["bg", "fg", "acc", "acc2", "mut"] },
      { key: "fit", label: "Encaje de la imagen", type: "select", default: "cover", options: ["cover", "contain"], labels: { cover: "llena la cara", contain: "entera, con margen" } },
      { key: "speed", label: "Velocidad (negativa = al revés)", type: "number", default: 1, min: -4, max: 4, step: 0.1 },
      { key: "tilt", label: "Inclinación (°)", type: "number", default: 10, min: -40, max: 40, step: 1 },
      { key: "draggable", label: "Se puede girar arrastrando", type: "boolean", default: false },
      { key: "glare", label: "Reflejo", type: "boolean", default: true },
      { key: "still", label: "Quieto", type: "boolean", default: false },
      { key: "alt", label: "Descripción accesible", type: "text", default: "", hint: "Vacío = decorativo" },
    ],
    render: (p) => (
      <div className="ui-center">
        <LogoCoin
          src={(p.src as string).trim() || SAMPLE_LOGO}
          diameter={p.diameter as number}
          thickness={p.thickness as number}
          tone={p.tone as never}
          faceTone={p.faceTone as never}
          fit={p.fit as never}
          speed={p.speed as number}
          tilt={p.tilt as number}
          draggable={p.draggable as boolean}
          glare={p.glare as boolean}
          still={p.still as boolean}
          alt={p.alt as string}
        />
      </div>
    ),
  },
  {
    id: "logo-3d",
    component: "Logo3D",
    path: "@/components/ui/Logo3D",
    name: "Logo 3D",
    category: "galerias",
    styles: ALL_STYLES,
    description:
      "La marca como objeto 3D: un trazado SVG extruido que gira, se balancea, flota o sigue al puntero, pintado como sólido, malla de alambre, caracteres ASCII o pixel art con el mismo filtro que RetroCanvas (rampas de glifos, dither, scanlines, glow, glitch). Decorativo, para un menú, una cabecera o un hero.",
    stageHeight: 360,
    notes: [
      "Requiere `three` y `@react-three/fiber` (opcionales en el paquete): importa `trama-ui/Logo3D`. Se descargan bajo demanda; mientras, y si el equipo no puede con WebGL, va justo, pide ahorrar datos o reducir movimiento, se ve la marca plana en SVG.",
      "La marca es `path` (el atributo `d` de un SVG) con su `viewBox`. Con `strokeWidth` > 0 el trazado es una línea de ese grosor con extremos redondos; con 0, una forma rellena. No acepta imágenes: de un PNG no se puede sacar volumen.",
      "`renderStyle` ascii, pixel y both usan `RetroFX`: `ramp`, `chars`, `cellSize`, `pixelSize`, `levels`, `dither`, `ditherPattern`, `tint`, `scanlines`, `glow`… Con ellos el lienzo se pinta sobre `--bg` (opaco); `solid` y `wire` son transparentes.",
      "Colores por tokens: `tone` (marca y caracteres) y `baseTone` (placa o aro, y el acento de `tint` gradient). `tint` scene conserva los colores de la escena en vez de monocromo.",
      "Decorativo por defecto (`aria-hidden`, sin eventos). `draggable` deja girarlo arrastrando, con inercia. Dibuja a `fps` solo mientras se mueve, y nada fuera de pantalla o dentro de un contenedor oculto.",
    ],
    props: [
      { key: "path", label: "Trazado SVG (atributo d)", type: "text", default: "M78 62 44 96l34 34M114 62l34 34-34 34" },
      { key: "viewBox", label: "viewBox del SVG", type: "text", default: "0 0 192 192" },
      { key: "strokeWidth", label: "Grosor de línea (0 = forma rellena)", type: "number", default: 16, min: 0, max: 60, step: 1 },
      { key: "depth", label: "Fondo de la extrusión", type: "number", default: 22, min: 2, max: 120, step: 1 },
      { key: "bevel", label: "Bisel", type: "number", default: 3, min: 0, max: 12, step: 0.5 },
      { key: "base", label: "Base", type: "select", default: "none", options: ["none", "plate", "ring"], labels: { none: "ninguna", plate: "placa", ring: "aro" } },
      { key: "renderStyle", label: "Estilo de render", type: "select", default: "ascii", options: LOGO3D_STYLES, labels: { solid: "sólido", wire: "alambre", ascii: "ASCII", pixel: "pixel art", both: "ASCII sobre pixel art" } },
      { key: "ramp", label: "Rampa de glifos", type: "select", default: "classic", options: ["classic", "dots", "braille", "blocks", "binary", "hex", "code", "hatch", "circuit"], when: (p) => p.renderStyle === "ascii" || p.renderStyle === "both" },
      { key: "chars", label: "Glifos propios (de menos a más denso)", type: "text", default: "", when: (p) => p.renderStyle === "ascii" || p.renderStyle === "both" },
      { key: "cellSize", label: "Celda ASCII (px)", type: "number", default: 6, min: 3, max: 20, step: 1, when: (p) => p.renderStyle === "ascii" || p.renderStyle === "both" },
      { key: "pixelSize", label: "Bloque de pixel art (px)", type: "number", default: 4, min: 2, max: 16, step: 1, when: (p) => p.renderStyle === "pixel" || p.renderStyle === "both" },
      { key: "levels", label: "Niveles de la paleta", type: "number", default: 4, min: 2, max: 8, step: 1, when: (p) => p.renderStyle === "pixel" || p.renderStyle === "both" },
      { key: "dither", label: "Dither", type: "number", default: 0.6, min: 0, max: 1, step: 0.05, when: (p) => p.renderStyle === "pixel" || p.renderStyle === "both" },
      { key: "ditherPattern", label: "Patrón del dither", type: "select", default: "bayer", options: ["bayer", "hatch", "halftone", "noise"], when: (p) => p.renderStyle === "pixel" || p.renderStyle === "both" },
      { key: "tint", label: "Tinte", type: "select", default: "mono", options: ["mono", "scene", "gradient"], labels: { mono: "monocromo (tone sobre --bg)", scene: "colores de la escena", gradient: "degradado bg → baseTone → tone" }, when: (p) => p.renderStyle !== "solid" && p.renderStyle !== "wire" },
      { key: "scanlines", label: "Scanlines", type: "number", default: 0.2, min: 0, max: 1, step: 0.05, when: (p) => p.renderStyle !== "solid" && p.renderStyle !== "wire" },
      { key: "glow", label: "Glow", type: "number", default: 0, min: 0, max: 1, step: 0.05, when: (p) => p.renderStyle !== "solid" && p.renderStyle !== "wire" },
      { key: "glitch", label: "Glitch", type: "number", default: 0, min: 0, max: 1, step: 0.05, when: (p) => p.renderStyle !== "solid" && p.renderStyle !== "wire" },
      { key: "invert", label: "Invertir", type: "boolean", default: false, when: (p) => p.renderStyle !== "solid" && p.renderStyle !== "wire" },
      toneProp("fg"),
      { key: "baseTone", label: "Color de la base (token)", type: "select", default: "acc", options: ["fg", "acc", "acc2", "mut"] },
      { key: "motion", label: "Movimiento", type: "select", default: "spin", options: LOGO3D_MOTIONS, labels: { spin: "gira", sway: "se balancea", float: "flota", pointer: "sigue al puntero", none: "quieto" } },
      { key: "axis", label: "Eje", type: "select", default: "y", options: ["y", "x", "z"], when: (p) => p.motion !== "none" },
      { key: "speed", label: "Velocidad (negativa = al revés)", type: "number", default: 1, min: -4, max: 4, step: 0.1, when: (p) => p.motion !== "none" },
      { key: "tilt", label: "Inclinación (°)", type: "number", default: 8, min: -45, max: 45, step: 1 },
      { key: "draggable", label: "Se puede girar arrastrando", type: "boolean", default: false },
      { key: "paused", label: "En pausa", type: "boolean", default: false },
      { key: "height", label: "Alto (px)", type: "number", default: 160, min: 80, max: 480, step: 10 },
      { key: "fps", label: "Fotogramas por segundo (0 = pantalla)", type: "number", default: 30, min: 0, max: 60, step: 5 },
      { key: "render", label: "Render", type: "select", default: "auto", options: ["auto", "3d", "static"], labels: { auto: "auto (3D si el equipo puede)", "3d": "3D siempre", static: "marca plana" } },
      { key: "alt", label: "Descripción accesible", type: "text", default: "", hint: "Vacío = decorativo" },
    ],
    render: (p) => (
      <div className="ui-center" style={{ justifyItems: "stretch", gridTemplateColumns: "minmax(0, 1fr)" }}>
        <Logo3D
          key={`${p.renderStyle}-${p.render}`}
          path={p.path as string}
          viewBox={p.viewBox as string}
          strokeWidth={p.strokeWidth as number}
          depth={p.depth as number}
          bevel={p.bevel as number}
          base={p.base as never}
          renderStyle={p.renderStyle as never}
          ramp={p.ramp as never}
          chars={p.chars as string}
          cellSize={p.cellSize as number}
          pixelSize={p.pixelSize as number}
          levels={p.levels as number}
          dither={p.dither as number}
          ditherPattern={p.ditherPattern as never}
          tint={p.tint as never}
          scanlines={p.scanlines as number}
          glow={p.glow as number}
          glitch={p.glitch as number}
          invert={p.invert as boolean}
          tone={p.tone as never}
          baseTone={p.baseTone as never}
          motion={p.motion as never}
          axis={p.axis as never}
          speed={p.speed as number}
          tilt={p.tilt as number}
          draggable={p.draggable as boolean}
          paused={p.paused as boolean}
          height={p.height as number}
          fps={p.fps as number}
          render={p.render as never}
          alt={p.alt as string}
        />
      </div>
    ),
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
  {
    id: "audio-player",
    component: "AudioPlayer",
    path: "@/components/ui/AudioPlayer",
    name: "Reproductor de música",
    category: "galerias",
    styles: ALL_STYLES,
    description: "Lista de pistas con visualizador (barras, onda o puntos), repetición, volumen y teclado (espacio, flechas, M). Reproduce archivos o música sintetizada en el navegador (`synth:estilo:bpm:semilla`) para demos sin audio.",
    stageHeight: 600,
    props: [
      { key: "tracks", label: "Pistas (Título|Artista|src|duración|portada)", type: "text", multiline: true, default: "Mar de fondo|Maré Surf Club|synth:ambient:80:2|1:40\nSerie grande|Maré Surf Club|synth:techno:124:5|2:10\nMarea viva|Maré Surf Club|synth:hardtechno:150:7|2:30" },
      { key: "layout", label: "Disposición", type: "select", default: "full", options: ["full", "bar", "minimal"], labels: { full: "tarjeta", bar: "barra", minimal: "mínima" } },
      { key: "visualizer", label: "Visualizador", type: "select", default: "bars", options: ["bars", "wave", "dots", "none"] },
      { key: "showPlaylist", label: "Lista de pistas", type: "boolean", default: true, when: (p) => p.layout !== "minimal" },
      { key: "repeat", label: "Repetir", type: "select", default: "all", options: ["off", "all", "one"] },
      { key: "defaultVolume", label: "Volumen inicial", type: "number", default: 0.8, min: 0, max: 1, step: 0.05 },
      { key: "dock", label: "Mini reproductor fijo al salir de pantalla", type: "select", default: "none", options: ["none", "bottom", "top", "bottom-left", "bottom-right"] },
      { key: "dockDraggable", label: "Mini reproductor arrastrable", type: "boolean", default: true, when: (p) => p.dock !== "none" },
      { key: "dockVisualizer", label: "Visualizador del mini reproductor", type: "select", default: "bars", options: ["bars", "wave", "dots", "none"], when: (p) => p.dock !== "none" },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center" style={{ padding: 8 }}>
        <div style={{ width: p.layout === "full" ? 420 : 720, maxWidth: "100%", display: "grid" }}>
          <AudioPlayer tracks={p.tracks as string} layout={p.layout as never} visualizer={p.visualizer as never} showPlaylist={p.showPlaylist as boolean} repeat={p.repeat as never} defaultVolume={p.defaultVolume as number} dock={p.dock as never} dockDraggable={p.dockDraggable as boolean} dockVisualizer={p.dockVisualizer as never} variant={p.variant as never} />
        </div>
      </div>
    ),
  },
];
