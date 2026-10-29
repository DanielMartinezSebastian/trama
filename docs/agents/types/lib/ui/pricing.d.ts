export type PricingPlan = {
    id?: string;
    name: string;
    price: string;
    period?: string;
    description?: string;
    features?: string[];
    highlighted?: boolean;
    yearlyPrice?: string;
    /** Duración, frecuencia o dato breve junto al precio. */
    meta?: string;
    /** Condición del precio, visible antes de elegir. */
    note?: string;
    cta?: string;
    href?: string;
};
/** Conserva el formato de texto del catálogo y permite datos tipados de un producto real. */
export declare function pricingPlans(input: string | PricingPlan[]): PricingPlan[];
/** A price is shown as annual only when it is distinct from the monthly one. */
export declare function pricingSelection(plan: PricingPlan, yearly: boolean, yearlyPeriod: string): {
    name: string;
    price: string;
    period: string;
    yearly: boolean;
    id: string | undefined;
};
