"use client";

import { useMemo, useState } from "react";
import PricingCard, { type PricingCardProps } from "./PricingCard";
import Carousel from "./CarouselLazy";
import type { CardFill } from "./fill";
import SectionHeader from "./SectionHeader";
import { splitEscaped } from "@/lib/ui/list";
import { vcls, type Variant } from "./variants";

export type PricingSectionProps = {
  kicker?: string;
  title?: string;
  subtitle?: string;
  /**
   * un plan por línea: «nombre|precio|periodo|destacado(si/no)|características separadas por ;|descripción|precio anual».
   * Las dos últimas son opcionales; una característica que empieza por «-» se muestra como no incluida. Si algún plan
   * trae precio anual, aparece el selector Mensual / Anual.
   */
  plans?: string;
  /**
   * grid = rejilla de tarjetas · joined = una sola pieza con los planes en columnas separadas por líneas finas (Linear,
   * Vercel; la insignia va junto al nombre) · list = una columna de tarjetas horizontales · carousel = carrusel de Swiper
   */
  layout?: "grid" | "joined" | "list" | "carousel";
  /** maquetación de cada tarjeta en `grid` y `carousel` */
  cardLayout?: "classic" | "compact";
  /** cómo se destaca el plan marcado (ver PricingCard) */
  highlight?: PricingCardProps["highlight"];
  /** texto de la insignia del plan destacado (vacío = sin insignia) */
  badge?: string;
  /** dónde va la insignia (con layout="joined", siempre junto al nombre) */
  badgePlacement?: PricingCardProps["badgePlacement"];
  planCase?: PricingCardProps["planCase"];
  marker?: PricingCardProps["marker"];
  /** selector Mensual / Anual: accent = la opción elegida en el acento · neutral = gris discreto, el acento solo en el ahorro */
  toggle?: "accent" | "neutral";
  /** fondo de las tarjetas no destacadas (ver fill.ts) */
  fill?: CardFill;
  /** texto del periodo cuando se elige facturación anual */
  yearlyPeriod?: string;
  /** etiqueta del ahorro junto a «Anual» (vacío = sin etiqueta) */
  yearlyNote?: string;
  /** texto del botón de cada plan */
  cta?: string;
  /** el botón de cada plan como enlace ("#contacto", "/alta"); se le añade `?plan=<nombre>&billing=monthly|yearly` si no lleva ya `?` ni `#` */
  ctaHref?: string;
  /** al elegir un plan: su nombre, el precio y el periodo mostrados y si la facturación es anual */
  onSelectPlan?: (plan: { name: string; price: string; period: string; yearly: boolean }) => void;
  /** con layout="carousel": tarjetas visibles en pantallas anchas */
  perView?: number;
  /** con layout="carousel": segundos entre tarjetas (0 = manual) */
  autoplay?: number;
  variant?: Variant;
  className?: string;
};

export const DEFAULT_PLANS =
  "Básico|9 €|/ mes|no|Un proyecto;Exportación PNG;Soporte por email;-Dominio propio|Para probar sin compromiso|90 €\n" +
  "Pro|29 €|/ mes|si|Proyectos ilimitados;Soporte prioritario;Exportación a PNG y SVG;Dominio propio|Para quien publica cada semana|290 €\n" +
  "Equipo|79 €|/ mes|no|Todo lo de Pro;5 puestos;Panel de administración;Facturación centralizada|Para estudios y agencias|790 €";

/** Cabecera + planes (`PricingCard`), con selector mensual/anual opcional: la sección de precios lista para pegar. */
export default function PricingSection({
  kicker = "Precios",
  title = "Un plan para cada tamaño",
  subtitle = "Cambia o cancela cuando quieras.",
  plans = DEFAULT_PLANS,
  layout = "grid",
  cardLayout = "classic",
  highlight = "invert",
  badge = "Más popular",
  badgePlacement = "tab",
  planCase = "upper",
  marker = "plus",
  toggle = "accent",
  fill = "surface",
  yearlyPeriod = "/ año",
  yearlyNote = "2 meses gratis",
  cta = "Empezar ahora",
  ctaHref,
  onSelectPlan,
  perView = 3,
  autoplay = 0,
  variant = "glass",
  className = "",
}: PricingSectionProps) {
  const rows = useMemo(() => plans.split("\n").map((l) => splitEscaped(l, "|").map((x) => x.trim())).filter((r) => r[0]), [plans]);
  const hasYearly = rows.some((r) => r[6]);
  const [yearly, setYearly] = useState(false);

  const cards = rows.map(([plan, price, period, hl, features, description, yearlyPrice], i) => {
    // un precio anual igual al mensual («A medida», «0 €») no es una tarifa anual: se queda con su periodo y sin «equivale a»
    const useYear = yearly && !!yearlyPrice && yearlyPrice !== price;
    const shownPrice = useYear ? yearlyPrice : price;
    const shownPeriod = useYear ? yearlyPeriod : period;
    const href = ctaHref && !/[?#]/.test(ctaHref) ? `${ctaHref}?plan=${encodeURIComponent(plan)}&billing=${useYear ? "yearly" : "monthly"}` : ctaHref;
    return (
      <PricingCard
        key={plan + i}
        plan={plan}
        description={description}
        price={shownPrice}
        period={shownPeriod}
        cta={cta}
        ctaHref={href}
        onSelect={onSelectPlan ? () => onSelectPlan({ name: plan, price: shownPrice, period: shownPeriod, yearly: useYear }) : undefined}
        note={useYear ? `equivale a ${price} ${period}`.replace(/\s+/g, " ") : ""}
        highlighted={hl === "si"}
        highlight={highlight}
        badge={badge}
        badgePlacement={layout === "joined" ? "inline" : badgePlacement}
        planCase={planCase}
        marker={marker}
        features={splitEscaped(features ?? "", ";").filter(Boolean).join("\n")}
        layout={layout === "list" ? "horizontal" : layout === "joined" ? "classic" : cardLayout}
        fill={fill}
        variant={variant}
      />
    );
  });

  return (
    <section className={`ui-pricing ${className}`}>
      {(kicker || title || subtitle) && <SectionHeader kicker={kicker} title={title} subtitle={subtitle} align="center" variant="minimal" />}
      {hasYearly && (
        <div className={`ui-billing ui-billing--${toggle} ui-surface ${vcls(variant)}`} role="group" aria-label="Periodo de facturación">
          <button type="button" aria-pressed={!yearly} onClick={() => setYearly(false)}>
            Mensual
          </button>
          <button type="button" aria-pressed={yearly} onClick={() => setYearly(true)}>
            Anual
            {yearlyNote && <span className="ui-billing__note">{yearlyNote}</span>}
          </button>
        </div>
      )}
      {layout === "carousel" ? (
        <Carousel perView={perView} autoplay={autoplay} variant={variant} label={title}>
          {cards}
        </Carousel>
      ) : (
        <div className={`ui-pricing__grid ui-pricing__grid--${layout}`}>{cards}</div>
      )}
    </section>
  );
}
