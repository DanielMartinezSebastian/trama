import { discount, money } from "@/lib/commerce/money";

export type PriceTagProps = {
  price: number;
  /** precio anterior (tachado); si es mayor que `price`, se muestra la rebaja */
  compareAt?: number;
  currency?: string;
  locale?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

/** Precio con rebaja opcional. El tachado y el porcentaje llevan texto accesible («Precio rebajado: X, antes Y»): no depende del color ni del tachado. */
export default function PriceTag({ price, compareAt, currency = "EUR", locale = "es-ES", size = "md", className = "" }: PriceTagProps) {
  const off = discount(compareAt, price);
  return (
    <span className={`ui-ptag ui-ptag--${size} ${className}`.trim()}>
      <b className="ui-ptag__now">
        {off > 0 && <span className="ui-sr">Precio rebajado: </span>}
        {money(price, currency, locale)}
      </b>
      {off > 0 && (
        <>
          <s className="ui-ptag__was">
            <span className="ui-sr">antes </span>
            {money(compareAt!, currency, locale)}
          </s>
          <span className="ui-ptag__off" aria-hidden>−{off} %</span>
        </>
      )}
    </span>
  );
}
