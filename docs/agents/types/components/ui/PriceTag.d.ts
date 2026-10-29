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
export default function PriceTag({ price, compareAt, currency, locale, size, className }: PriceTagProps): import("react").JSX.Element;
