"use client";

import { useMemo } from "react";
import Carousel from "./Carousel";
import SectionHeader from "./SectionHeader";
import Testimonial from "./Testimonial";
import type { Variant } from "./variants";

export type TestimonialSectionProps = {
  kicker?: string;
  title?: string;
  subtitle?: string;
  /** un testimonio por línea: «cita|autor|rol|valoración (0-5)» */
  items?: string;
  /** grid = rejilla · carousel = carrusel de Swiper */
  layout?: "grid" | "carousel";
  /** con layout="carousel": tarjetas visibles en pantallas anchas */
  perView?: number;
  /** con layout="carousel": segundos entre tarjetas (0 = manual) */
  autoplay?: number;
  /** con layout="carousel": slide = desplazamiento · fade = una cita que se funde con la siguiente · cards = baraja */
  effect?: "slide" | "fade" | "cards";
  variant?: Variant;
  className?: string;
};

const DEFAULT_ITEMS =
  "Levanté la tabla el primer día. El equipo es paciente y el mar, una maravilla.|Lucía Pardo|Alumna, iniciación|5\n" +
  "Vinimos en familia y los peques no querían salir del agua.|Marcos Ibáñez|Curso familiar|5\n" +
  "El monitor grabó mis olas y corregimos la técnica al momento.|Diego Rus|Clases privadas|4";

/** Grid de reseñas (`Testimonial`) con cabecera: prueba social lista para pegar en una landing. */
export default function TestimonialSection({
  kicker = "Lo que dicen",
  title = "Alumnos que ya cogieron su ola",
  subtitle = "",
  items = DEFAULT_ITEMS,
  layout = "grid",
  perView = 3,
  autoplay = 0,
  effect = "slide",
  variant = "glass",
  className = "",
}: TestimonialSectionProps) {
  const rows = useMemo(() => items.split("\n").map((l) => l.split("|")).filter((r) => r[0]?.trim()), [items]);
  const cards = rows.map(([quote, author, role, rating], i) => (
    <Testimonial key={author + i} quote={quote} author={author} role={role} rating={parseInt(rating, 10) || 0} variant={variant} />
  ));
  return (
    <section className={`ui-testimonials ${className}`}>
      <SectionHeader kicker={kicker} title={title} subtitle={subtitle} align="center" variant="minimal" />
      {layout === "carousel" ? (
        <Carousel perView={perView} autoplay={autoplay} effect={effect} loop variant={variant} label={title}>
          {cards}
        </Carousel>
      ) : (
        <div className="ui-testimonials__grid">{cards}</div>
      )}
    </section>
  );
}
