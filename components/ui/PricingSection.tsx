"use client";

import { useId, useMemo, useState } from "react";
import Button from "./Button";
import PricingCard, { type PricingCardProps } from "./PricingCard";
import Carousel from "./CarouselLazy";
import type { CardFill } from "./fill";
import SectionHeader from "./SectionHeader";
import { splitEscaped } from "@/lib/ui/list";
import { vcls, type Variant } from "./variants";
import { pricingPlans, pricingSelection, type PricingPlan } from "@/lib/ui/pricing";
export type { PricingPlan } from "@/lib/ui/pricing";

export type PricingSectionProps = {
  kicker?: string;
  title?: string;
  subtitle?: string;
  /**
   * un plan por línea: «nombre|precio|periodo|destacado(si/no)|características separadas por ;|descripción|precio anual».
   * Las dos últimas son opcionales; una característica que empieza por «-» se muestra como no incluida. Si algún plan
   * trae precio anual, aparece el selector Mensual / Anual.
   */
  plans?: string | PricingPlan[];
  /**
   * grid = rejilla de tarjetas · joined = una sola pieza con los planes en columnas separadas por líneas finas (Linear,
   * Vercel; la insignia va junto al nombre) · list = una columna de tarjetas horizontales · carousel = carrusel de Swiper
   */
  layout?: "grid" | "joined" | "list" | "carousel" | "menu" | "comparison";
  /** En comparison, una fila por línea: «Característica|valor plan 1|valor plan 2|…». Sin ella se comparan features. */
  comparison?: string;
  /** Nombre accesible de la tabla, independiente del titular visual. */
  caption?: string;
  /** Condiciones comunes visibles bajo los precios. */
  footnote?: string;
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
  onSelectPlan?: (plan: { name: string; price: string; period: string; yearly: boolean; id?: string }) => void;
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
  comparison = "",
  caption = "Comparación de planes",
  footnote = "",
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
  const uid = useId();
  const rows = useMemo(() => pricingPlans(plans), [plans]);
  const hasYearly = rows.some(r => r.yearlyPrice && r.yearlyPrice !== r.price);
  const [yearly, setYearly] = useState(false);
  const shown = (p: PricingPlan) => pricingSelection(p, hasYearly && yearly, yearlyPeriod);
  const planHref = (p: PricingPlan) => {
    if (p.href) return p.href;
    return ctaHref && !/[?#]/.test(ctaHref) ? `${ctaHref}?plan=${encodeURIComponent(p.name)}&billing=${shown(p).yearly ? "yearly" : "monthly"}` : ctaHref;
  };
  const action = (p: PricingPlan) => <Button label={p.cta ?? cta} href={planHref(p)} onClick={onSelectPlan ? () => onSelectPlan(shown(p)) : undefined} variant={variant} emphasis={p.highlighted ? "primary" : "outline"} />;
  const comparisons = comparison ? comparison.split("\n").map(l=>splitEscaped(l,"|")).filter(r=>r[0]) : [...new Set(rows.flatMap(p=>p.features?.map(f=>f.replace(/^[-+]\s*/,""))??[]))].map(label=>[label,...rows.map(p=>p.features?.some(f=>!f.startsWith("-") && f.replace(/^\+\s*/,"")===label)?"Sí":"—")]);

  const cards = rows.map((p, i) => {
    // un precio anual igual al mensual («A medida», «0 €») no es una tarifa anual: se queda con su periodo y sin «equivale a»
    const selected = shown(p);
    return (
      <PricingCard
        key={p.id ?? p.name + i}
        plan={p.name}
        description={p.description}
        price={selected.price}
        period={selected.period}
        cta={p.cta ?? cta}
        ctaHref={planHref(p)}
        onSelect={onSelectPlan ? () => onSelectPlan(selected) : undefined}
        note={p.note ?? (selected.yearly ? "Pago anual · precio total del año" : "")}
        meta={p.meta}
        highlighted={p.highlighted ?? false}
        highlight={highlight}
        badge={badge}
        badgePlacement={layout === "joined" ? "inline" : badgePlacement}
        planCase={planCase}
        marker={marker}
        features={p.features?.join("\n") ?? ""}
        layout={layout === "list" ? "horizontal" : layout === "joined" ? "classic" : cardLayout}
        fill={fill}
        variant={variant}
      />
    );
  });

  return (
    <section className={`ui-pricing ui-pricing--${layout} ${className}`}>
      {(kicker || title) ? <SectionHeader kicker={kicker} title={title} subtitle={subtitle} align="center" variant="minimal" /> : subtitle ? <p className="ui-pricing__intro">{subtitle}</p> : null}
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
      {layout === "menu" ? <div className={`ui-pricing-menu ${vcls(variant)}`}>
        {rows.map((p,i)=><article className="ui-pricing-menu__row" key={p.id??p.name+i}><div><h3>{p.name}</h3>{p.description && <p>{p.description}</p>}{p.note && <small>{p.note}</small>}</div><span className="ui-pricing-menu__meta">{p.meta}</span><div className="ui-pricing-menu__price"><strong>{shown(p).price}</strong>{shown(p).period && <small>{shown(p).period}</small>}</div>{action(p)}</article>)}
      </div> : layout === "comparison" ? <div className={`ui-pricing-compare ${vcls(variant)}`} role="region" aria-label={caption} tabIndex={0}>
        <table><caption className="ui-sr">{caption}</caption><thead><tr><th scope="col">Tu cuota incluye</th>{rows.map((p,i)=><th scope="col" id={`${uid}-p${i}`} key={p.id??p.name+i} data-featured={p.highlighted || undefined}><span className="ui-pricing-compare__name">{p.name}</span>{badge && <small className="ui-pricing-compare__badge">{p.highlighted ? badge : ""}</small>}<strong>{shown(p).price}<small>{shown(p).period}</small></strong>{p.description && <p>{p.description}</p>}{p.note && <small>{p.note}</small>}</th>)}</tr></thead><tbody>{comparisons.map(([label,...values],i)=><tr key={label+i}><th scope="row">{label}</th>{rows.map((p,j)=><td key={p.id??p.name+j} data-featured={p.highlighted || undefined}>{values[j] ?? "—"}</td>)}</tr>)}</tbody><tfoot><tr><th scope="row">Elige tu plan</th>{rows.map((p,i)=><td key={p.id??p.name+i} data-featured={p.highlighted || undefined}>{action(p)}</td>)}</tr></tfoot></table>
      </div> : layout === "carousel" ? (
        <Carousel perView={perView} autoplay={autoplay} variant={variant} label={title}>
          {cards}
        </Carousel>
      ) : (
        <div className={`ui-pricing__grid ui-pricing__grid--${layout}`}>{cards}</div>
      )}
      {footnote && <p className="ui-pricing__footnote">{footnote}</p>}
    </section>
  );
}
