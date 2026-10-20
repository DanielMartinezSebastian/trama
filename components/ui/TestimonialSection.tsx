"use client";

import { useId, useMemo, useState } from "react";
import Carousel from "./Carousel";
import SectionHeader from "./SectionHeader";
import Testimonial from "./Testimonial";
import type { Variant } from "./variants";
import { splitEscaped, splitList } from "@/lib/ui/list";

export type TestimonialSectionProps = {
  kicker?: string;
  title?: string;
  subtitle?: string;
  /** un testimonio por línea: «cita|autor|rol|valoración (0-5)» */
  items?: string;
  /** grid = rejilla · carousel = carrusel de Swiper */
  layout?: "grid" | "carousel";
  /** center = cabecera y tarjetas centradas (landing) · left = alineado a la izquierda, a todo el ancho del contenedor (webs editoriales) */
  align?: "center" | "left";
  /** con layout="carousel": tarjetas visibles en pantallas anchas */
  perView?: number;
  /** con layout="carousel": segundos entre tarjetas (0 = manual) */
  autoplay?: number;
  /** con layout="carousel": slide = desplazamiento · fade = una cita que se funde con la siguiente · cards = baraja */
  effect?: "slide" | "fade" | "cards";
  /** nota media del resumen (0 = sin resumen). Con decimales: 4.8 */
  rating?: number;
  /** número total de reseñas («642 reseñas»): la prueba social se cree con número y fuente, no solo con estrellas */
  count?: number;
  /** de dónde salen («Google», «Tripadvisor»…) */
  source?: string;
  /** enlace a todas las reseñas en la fuente (se abre en otra pestaña) */
  sourceHref?: string;
  /** reparto por estrellas, «5:540, 4:72, 3:18, 2:7, 1:5»: barras que además filtran las citas por valoración */
  distribution?: string;
  /** citas visibles al principio en la rejilla (0 = todas); el resto, con «Ver más» */
  pageSize?: number;
  /** body = cita en la fuente del texto · display = en la de titulares (`--display`), como una cita de revista */
  quoteFont?: "body" | "display";
  /** avatar con iniciales en cada cita */
  avatars?: boolean;
  variant?: Variant;
  className?: string;
};

const DEFAULT_ITEMS =
  "Levanté la tabla el primer día. El equipo es paciente y el mar, una maravilla.|Lucía Pardo|Alumna, iniciación|5\n" +
  "Vinimos en familia y los peques no querían salir del agua.|Marcos Ibáñez|Curso familiar|5\n" +
  "El monitor grabó mis olas y corregimos la técnica al momento.|Diego Rus|Clases privadas|4";

const num = (n: number, d = 0) => n.toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d });

/** Cinco estrellas con relleno parcial (4,8 → la última al 80 %); el valor va en texto para el lector de pantalla. */
function Stars({ value }: { value: number }) {
  return (
    <span className="ui-stars" aria-hidden>
      <span className="ui-stars__off">★★★★★</span>
      <span className="ui-stars__on" style={{ width: `${Math.max(0, Math.min(5, value)) * 20}%` }}>★★★★★</span>
    </span>
  );
}

/**
 * Prueba social lista para pegar: cabecera, resumen de valoraciones (media, número, fuente y reparto por estrellas) y las
 * citas (`Testimonial`) en rejilla o carrusel. El reparto filtra las citas por estrellas y la rejilla puede empezar con
 * unas pocas y «Ver más». Con `align="left"` y `quoteFont="display"` encaja en webs editoriales (ver /sitios/almibar).
 */
export default function TestimonialSection({
  kicker = "Lo que dicen",
  title = "Alumnos que ya cogieron su ola",
  subtitle = "",
  items = DEFAULT_ITEMS,
  layout = "grid",
  align = "center",
  perView = 3,
  autoplay = 0,
  effect = "slide",
  rating = 0,
  count = 0,
  source = "",
  sourceHref = "",
  distribution = "",
  pageSize = 0,
  quoteFont = "body",
  avatars = true,
  variant = "glass",
  className = "",
}: TestimonialSectionProps) {
  const uid = useId();
  const rows = useMemo(
    () =>
      items
        .split("\n")
        .map((l) => splitEscaped(l, "|"))
        .filter((r) => r[0]?.trim())
        .map(([quote, author = "", role = "", r = ""]) => ({ quote, author, role, rating: parseInt(r, 10) || 0 })),
    [items],
  );
  const dist = useMemo(
    () =>
      splitList(distribution)
        .map((p) => p.split(":").map((x) => Number(x.trim())))
        .filter(([s, n]) => s >= 1 && s <= 5 && n >= 0)
        .sort((a, b) => b[0] - a[0]) as [number, number][],
    [distribution],
  );
  const distTotal = dist.reduce((n, [, c]) => n + c, 0);
  const [stars, setStars] = useState(0);
  const [shown, setShown] = useState(pageSize);

  const filtered = stars ? rows.filter((r) => r.rating === stars) : rows;
  const paged = layout === "grid" && shown > 0 ? filtered.slice(0, shown) : filtered;
  const cards = paged.map((r, i) => <Testimonial key={r.author + i} quote={r.quote} author={r.author} role={r.role} rating={r.rating} quoteFont={quoteFont} avatar={avatars} variant={variant} />);

  const hasHead = !!(kicker || title || subtitle);
  const summary = rating > 0 && (
    <div className="ui-testimonials__sum">
      <p className="ui-testimonials__avg">
        <b>{num(rating, 1)}</b>
        <Stars value={rating} />
        <span className="ui-sr">{num(rating, 1)} de 5 estrellas</span>
        {count > 0 && (
          <span className="ui-testimonials__count">
            {sourceHref ? (
              <a href={sourceHref} target="_blank" rel="noopener noreferrer">
                {num(count)} reseñas{source && ` en ${source}`}
              </a>
            ) : (
              <>
                {num(count)} reseñas{source && ` en ${source}`}
              </>
            )}
          </span>
        )}
      </p>
      {dist.length > 0 && (
        <div className="ui-testimonials__dist" role="group" aria-label="Reparto por estrellas: pulsa para ver solo esas citas">
          {dist.map(([s, n]) => {
            const has = rows.some((r) => r.rating === s);
            return (
              <button key={s} type="button" className="ui-testimonials__bar" aria-pressed={stars === s} disabled={!has} onClick={() => { setStars((cur) => (cur === s ? 0 : s)); setShown(pageSize); }} aria-controls={`${uid}-list`}>
                <span className="ui-testimonials__bl">{s} ★</span>
                <span className="ui-testimonials__track" aria-hidden>
                  <span style={{ width: `${distTotal ? (n / distTotal) * 100 : 0}%` }} />
                </span>
                <span className="ui-testimonials__bn">{num(n)}</span>
                <span className="ui-sr"> reseñas de {s} estrellas{has ? "" : " (sin citas aquí)"}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <section className={`ui-testimonials ui-testimonials--${align} ${className}`.trim()}>
      {(hasHead || summary) && (
        <div className="ui-testimonials__top">
          {hasHead && <SectionHeader kicker={kicker} title={title} subtitle={subtitle} align={align} rule={align === "center" ? "line" : "none"} variant={variant === "editorial" ? "editorial" : "minimal"} />}
          {summary}
        </div>
      )}
      <p className="ui-sr" aria-live="polite">{stars ? `${filtered.length} citas de ${stars} estrellas` : ""}</p>
      {layout === "carousel" ? (
        <Carousel key={stars} perView={perView} autoplay={autoplay} effect={effect} loop={filtered.length > perView} variant={variant} label={title || "Reseñas"}>
          {cards}
        </Carousel>
      ) : (
        <div id={`${uid}-list`} className="ui-testimonials__grid">{cards}</div>
      )}
      {(layout === "grid" && shown > 0 && filtered.length > shown) || stars ? (
        <div className="ui-testimonials__more">
          {layout === "grid" && shown > 0 && filtered.length > shown && (
            <button type="button" onClick={() => setShown((n) => n + Math.max(1, pageSize))}>Ver más reseñas ({filtered.length - shown})</button>
          )}
          {stars > 0 && <button type="button" onClick={() => setStars(0)}>Ver todas</button>}
        </div>
      ) : null}
    </section>
  );
}
