"use client";

import { useEffect, useMemo, useState } from "react";
import type { Swiper as SwiperClass } from "swiper";
import { A11y, Autoplay, EffectCards, EffectCoverflow, EffectCreative, EffectCube, EffectFade, FreeMode, Grid, Keyboard, Navigation, Pagination, Thumbs, Zoom } from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperProps } from "swiper/react";
import { resolveImage } from "@/lib/ui/placeholder";
import "./swiperCss";
import { vcls, type Variant } from "./variants";

export const GALLERY_LAYOUTS = ["thumbs", "coverflow", "cards", "fade", "cube", "creative", "filmstrip", "mosaic"] as const;
export type GalleryLayout = (typeof GALLERY_LAYOUTS)[number];

export type ImageGalleryProps = {
  /** una por línea: «imagen|título|texto». La imagen es una URL/ruta, o `gen:N` para una escena de ejemplo generada (0, 1, 2…) */
  images?: string;
  /**
   * thumbs = imagen grande + tira de miniaturas · coverflow = carrusel 3D centrado · cards = baraja apilada ·
   * fade = fundido a pantalla completa · cube = cubo 3D · creative = diapositivas que entran girando ·
   * filmstrip = tira libre que se arrastra, de anchos distintos · mosaic = mosaico de dos filas
   */
  layout?: GalleryLayout;
  /** proporción de cada imagen (no afecta a filmstrip ni mosaic) */
  ratio?: "4/3" | "16/9" | "21/9" | "1/1" | "3/4";
  /** muestra título y texto sobre cada imagen */
  captions?: boolean;
  /** segundos entre imágenes; 0 = manual (siempre apagado con prefers-reduced-motion) */
  autoplay?: number;
  loop?: boolean;
  /** zoom con doble clic o pellizco (solo en thumbs y fade) */
  zoom?: boolean;
  variant?: Variant;
  className?: string;
};

const DEFAULT_IMAGES =
  "gen:0|Amanecer|Primera luz sobre la bahía\n" +
  "gen:1|Mediodía|Mar limpio y viento suave\n" +
  "gen:2|Atardecer|La hora dorada del swell\n" +
  "gen:3|Noche|Luna llena y marea alta\n" +
  "gen:4|Cala|Aguas verdes entre rocas\n" +
  "gen:5|Ocaso|Rojos y naranjas en el horizonte\n" +
  "gen:6|Bruma|Mañana de niebla fina\n" +
  "gen:7|Aurora|Cielo violeta sobre el agua";

type Shot = { src: string; title: string; text: string };

/** Proporciones de la tira libre: ancho relativo a la altura de cada diapositiva. */
const STRIP = [1.5, 1, 0.8, 1.3, 1.15, 0.9, 1.4, 1.05];

function Figure({ s, captions, zoom, variant, fill = false }: { s: Shot; captions: boolean; zoom?: boolean; variant: Variant; fill?: boolean }) {
  const img = <img src={resolveImage(s.src)} alt={s.title} loading="lazy" draggable={false} />;
  return (
    <figure className={`ui-gal__shot ui-surface ${vcls(variant)} ${fill ? "ui-gal__shot--fill" : ""}`}>
      {zoom ? <div className="swiper-zoom-container">{img}</div> : img}
      {captions && (s.title || s.text) && (
        <figcaption className="ui-gal__cap">
          {s.title && <strong>{s.title}</strong>}
          {s.text && <span>{s.text}</span>}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Galería de imágenes sobre Swiper (https://swiperjs.com/) con ocho maneras de presentar las mismas fotos. El estilo sale de
 * `variant` (borde, sombra y radio de cada imagen) y de los tokens, igual que el resto del kit; las flechas y los puntos
 * los define components/ui/styles/ui-carousel.css con las variables `--s-*`. Sin imágenes propias usa escenas pixel art generadas (`gen:N`).
 */
export default function ImageGallery({ images = DEFAULT_IMAGES, layout = "thumbs", ratio = "4/3", captions = true, autoplay = 0, loop = false, zoom = false, variant = "retro", className = "" }: ImageGalleryProps) {
  const shots = useMemo<Shot[]>(
    () =>
      images
        .split("\n")
        .map((l) => l.split("|"))
        .filter((r) => r[0]?.trim())
        .map(([src, title = "", text = ""]) => ({ src, title: title.trim(), text: text.trim() })),
    [images],
  );

  const [thumbs, setThumbs] = useState<SwiperClass | null>(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const play = !reduced && autoplay > 0 ? { delay: autoplay * 1000, disableOnInteraction: false, pauseOnMouseEnter: true } : false;
  const canLoop = loop && shots.length > 3;
  const base: NonNullable<SwiperProps["modules"]> = [A11y, Keyboard];
  const root = `ui-gal ui-gal--${layout} ${vcls(variant)} ${className}`;
  const style = { "--gal-ratio": ratio } as React.CSSProperties;
  const key = `${layout}-${zoom}-${canLoop}-${autoplay > 0}-${play !== false}`;

  const slide = (s: Shot, i: number, extra?: { zoom?: boolean; fill?: boolean; width?: number }) => (
    <SwiperSlide key={s.src + i} style={extra?.width ? ({ "--w": extra.width } as React.CSSProperties) : undefined}>
      <Figure s={s} captions={captions} zoom={extra?.zoom} fill={extra?.fill} variant={variant} />
    </SwiperSlide>
  );

  let body: React.ReactNode;
  switch (layout) {
    case "thumbs":
      body = (
        <>
          <Swiper
            key={key}
            modules={[...base, Navigation, Thumbs, ...(zoom ? [Zoom] : []), ...(play ? [Autoplay] : [])]}
            spaceBetween={10}
            navigation
            zoom={zoom}
            autoplay={play}
            thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
            className="ui-gal__main"
          >
            {shots.map((s, i) => slide(s, i, { zoom }))}
          </Swiper>
          <Swiper key={`t-${key}`} onSwiper={setThumbs} modules={[FreeMode, Thumbs]} spaceBetween={10} slidesPerView={4} breakpoints={{ 700: { slidesPerView: 6 } }} freeMode watchSlidesProgress className="ui-gal__thumbs">
            {shots.map((s, i) => (
              <SwiperSlide key={s.src + i}>
                <figure className={`ui-gal__thumb ui-surface ${vcls(variant)}`}>
                  <img src={resolveImage(s.src)} alt={s.title} loading="lazy" draggable={false} />
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      );
      break;
    case "coverflow":
      body = (
        <Swiper key={key} modules={[...base, EffectCoverflow, Pagination, ...(play ? [Autoplay] : [])]} effect="coverflow" grabCursor centeredSlides slidesPerView="auto" loop={canLoop} autoplay={play} coverflowEffect={{ rotate: 38, stretch: 0, depth: 170, modifier: 1, slideShadows: true }} pagination={{ clickable: true }}>
          {shots.map((s, i) => slide(s, i))}
        </Swiper>
      );
      break;
    case "cards":
      body = (
        <Swiper key={key} modules={[...base, EffectCards, ...(play ? [Autoplay] : [])]} effect="cards" grabCursor autoplay={play} cardsEffect={{ slideShadows: false, perSlideOffset: 9, perSlideRotate: 3 }}>
          {shots.map((s, i) => slide(s, i))}
        </Swiper>
      );
      break;
    case "fade":
      body = (
        <Swiper key={key} modules={[...base, EffectFade, Navigation, Pagination, ...(zoom ? [Zoom] : []), ...(play ? [Autoplay] : [])]} effect="fade" fadeEffect={{ crossFade: true }} navigation pagination={{ type: "fraction" }} zoom={zoom} loop={canLoop} autoplay={play}>
          {shots.map((s, i) => slide(s, i, { zoom }))}
        </Swiper>
      );
      break;
    case "cube":
      body = (
        <Swiper key={key} modules={[...base, EffectCube, Pagination, ...(play ? [Autoplay] : [])]} effect="cube" grabCursor cubeEffect={{ shadow: true, slideShadows: true, shadowOffset: 24, shadowScale: 0.92 }} pagination={{ clickable: true }} autoplay={play}>
          {shots.map((s, i) => slide(s, i))}
        </Swiper>
      );
      break;
    case "creative":
      body = (
        <Swiper
          key={key}
          modules={[...base, EffectCreative, Navigation, Pagination, ...(play ? [Autoplay] : [])]}
          effect="creative"
          grabCursor
          creativeEffect={{ prev: { shadow: true, translate: ["-110%", 0, -400], rotate: [0, 0, -8] }, next: { translate: ["110%", 0, 0], rotate: [0, 0, 8] } }}
          navigation
          pagination={{ clickable: true }}
          loop={canLoop}
          autoplay={play}
        >
          {shots.map((s, i) => slide(s, i))}
        </Swiper>
      );
      break;
    case "filmstrip":
      body = (
        <Swiper key={key} modules={[...base, FreeMode, Pagination, ...(play ? [Autoplay] : [])]} slidesPerView="auto" spaceBetween={14} freeMode={{ enabled: true, sticky: false }} grabCursor pagination={{ type: "progressbar" }} loop={canLoop} autoplay={play}>
          {shots.map((s, i) => slide(s, i, { fill: true, width: STRIP[i % STRIP.length] }))}
        </Swiper>
      );
      break;
    case "mosaic":
      body = (
        <Swiper
          key={key}
          modules={[...base, Grid, Pagination, ...(play ? [Autoplay] : [])]}
          slidesPerView={2}
          grid={{ rows: 2, fill: "row" }}
          spaceBetween={12}
          breakpoints={{ 700: { slidesPerView: 3 }, 1000: { slidesPerView: 4 } }}
          pagination={{ clickable: true }}
          autoplay={play}
        >
          {shots.map((s, i) => slide(s, i, { fill: true }))}
        </Swiper>
      );
      break;
  }

  return (
    <div className={root} style={style}>
      {body}
    </div>
  );
}
