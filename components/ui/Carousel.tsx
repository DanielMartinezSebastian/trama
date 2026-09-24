"use client";

import { Children, useEffect, useMemo, useState, type ReactNode } from "react";
import { A11y, Autoplay, EffectCards, EffectFade, FreeMode, Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperProps } from "swiper/react";
import "./swiperCss";
import { vcls, type Variant } from "./variants";

export type CarouselProps = {
  /** cada hijo es una diapositiva */
  children: ReactNode;
  /** diapositivas visibles en pantallas anchas (en móvil baja sola a 1, en tablet a 2). Ignorado con `effect` ≠ slide */
  perView?: number;
  /** separación entre diapositivas, en px */
  gap?: number;
  loop?: boolean;
  /** segundos entre diapositivas; 0 = sin reproducción automática (siempre apagado con prefers-reduced-motion) */
  autoplay?: number;
  arrows?: boolean;
  dots?: "none" | "bullets" | "progress" | "fraction";
  /** slide = desplazamiento · fade = fundido · cards = baraja apilada */
  effect?: "slide" | "fade" | "cards";
  /** cinta continua sin paradas (marcas, logos): ignora flechas, puntos y `perView` */
  ticker?: boolean;
  variant?: Variant;
  /** nombre accesible del carrusel */
  label?: string;
  className?: string;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/**
 * Carrusel genérico sobre Swiper (https://swiperjs.com/) con el lenguaje del kit: flechas y puntos cuadrados que leen las
 * variables `--s-*` de la variante, y sin estilos propios de color (todo sale de los tokens). Sirve para cualquier lista de
 * tarjetas: los componentes de sección lo usan con su prop `layout="carousel"`.
 */
export default function Carousel({ children, perView = 3, gap = 20, loop = false, autoplay = 0, arrows = true, dots = "bullets", effect = "slide", ticker = false, variant = "glass", label = "Carrusel", className = "" }: CarouselProps) {
  const reduced = usePrefersReducedMotion();
  const slides = Children.toArray(children);
  const single = effect !== "slide" && !ticker;
  const pv = single ? 1 : Math.max(1, Math.round(perView));
  const play = !reduced && (ticker || autoplay > 0);

  const config = useMemo(() => {
    const modules: NonNullable<SwiperProps["modules"]> = [A11y, Keyboard];
    const props: SwiperProps = { a11y: { containerMessage: label }, keyboard: { enabled: true, onlyInViewport: true }, spaceBetween: gap, grabCursor: true };

    if (ticker) {
      modules.push(FreeMode, Autoplay);
      Object.assign(props, {
        slidesPerView: "auto",
        loop: true,
        freeMode: { enabled: true, momentum: false },
        speed: 6000,
        allowTouchMove: false,
        autoplay: play ? { delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true } : false,
      });
      return { modules, props };
    }

    if (effect === "fade") {
      modules.push(EffectFade);
      Object.assign(props, { effect: "fade", fadeEffect: { crossFade: true }, slidesPerView: 1 });
    } else if (effect === "cards") {
      modules.push(EffectCards);
      Object.assign(props, { effect: "cards", slidesPerView: 1, cardsEffect: { slideShadows: false, perSlideOffset: 10, perSlideRotate: 3 } });
    } else {
      Object.assign(props, {
        slidesPerView: 1,
        breakpoints: { 0: { slidesPerView: 1 }, 700: { slidesPerView: Math.min(2, pv) }, 1000: { slidesPerView: pv } },
      });
    }

    if (arrows) {
      modules.push(Navigation);
      props.navigation = true;
    }
    if (dots !== "none") {
      modules.push(Pagination);
      props.pagination = { type: dots === "bullets" ? "bullets" : dots === "progress" ? "progressbar" : "fraction", clickable: dots === "bullets" };
    }
    if (autoplay > 0) {
      modules.push(Autoplay);
      props.autoplay = play ? { delay: autoplay * 1000, disableOnInteraction: false, pauseOnMouseEnter: true } : false;
    }
    props.loop = loop && slides.length > pv;
    return { modules, props };
  }, [ticker, effect, arrows, dots, autoplay, play, loop, gap, pv, slides.length, label]);

  // La cinta necesita más diapositivas que el ancho del contenedor para no dejar huecos al dar la vuelta
  const items = ticker ? [...slides, ...slides, ...slides] : slides;
  const cls = ["ui-car", vcls(variant), ticker ? "ui-car--ticker" : "", effect === "cards" ? "ui-car--cards" : "", effect === "fade" ? "ui-car--fade" : "", className].filter(Boolean).join(" ");
  // Cambiar módulos o efecto exige montar de nuevo el Swiper
  const key = `${ticker}-${effect}-${pv}-${arrows}-${dots}-${autoplay > 0}-${play}-${loop}`;

  return (
    <div className={cls}>
      <Swiper key={key} modules={config.modules} {...config.props}>
        {items.map((s, i) => (
          <SwiperSlide key={i}>{s}</SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
