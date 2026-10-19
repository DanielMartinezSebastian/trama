import { Children, type CSSProperties, type ReactNode } from "react";

export type StackedCardsProps = {
  /** cada hijo directo es una tarjeta */
  children: ReactNode;
  /** distancia al borde superior donde se «pegan» (px) */
  top?: number;
  /** cuánto asoma cada tarjeta anterior por encima de la siguiente (px) */
  step?: number;
  /** espacio de scroll entre tarjetas (vh) */
  gap?: number;
  /** las tarjetas ya cubiertas se encogen un poco (solo en navegadores con animaciones ligadas al scroll) */
  shrink?: boolean;
  className?: string;
};

/**
 * Tarjetas que se apilan al hacer scroll: cada una se pega arriba y la siguiente la cubre. CSS puro
 * (`position: sticky`), sin JS ni hidratación; el encogimiento de las cubiertas usa `animation-timeline: view()` donde existe y,
 * si no, simplemente no se aplica. Con `prefers-reduced-motion` no se encoge.
 */
export default function StackedCards({ children, top = 96, step = 18, gap = 18, shrink = true, className = "" }: StackedCardsProps) {
  return (
    <div className={`ui-stack ${shrink ? "ui-stack--shrink" : ""} ${className}`.trim()} style={{ "--sc-top": `${top}px`, "--sc-step": `${step}px`, "--sc-gap": `${gap}vh` } as CSSProperties}>
      {Children.toArray(children).map((c, i) => (
        <div key={i} className="ui-stack__item" style={{ "--i": i } as CSSProperties}>
          {c}
        </div>
      ))}
    </div>
  );
}
