"use client";

import { Children, lazy, Suspense } from "react";
import type { CarouselProps } from "./Carousel";
import "./swiperCss";

const Carousel = lazy(() => import("./Carousel"));

/**
 * `Carousel` con el JS de Swiper (~35 KB gz) aparte: lo usan las secciones con `layout="carousel"`, que así no lo envían
 * cuando pintan rejilla. Se renderiza en servidor igual que `Carousel` (el CSS de Swiper va estático, sin parpadeo); solo
 * en una navegación en cliente se ve un instante la rejilla de respaldo mientras llega el fragmento.
 */
export default function CarouselLazy(props: CarouselProps) {
  const { children, perView = 3, gap = 20, ticker = false, effect = "slide", className = "" } = props;
  const cols = ticker || effect !== "slide" ? 1 : Math.max(1, Math.round(perView));
  const fallback = ticker ? null : (
    <div className={`ui-car ${className}`} style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap }}>
      {Children.toArray(children).slice(0, cols)}
    </div>
  );
  return (
    <Suspense fallback={fallback}>
      <Carousel {...props} />
    </Suspense>
  );
}
