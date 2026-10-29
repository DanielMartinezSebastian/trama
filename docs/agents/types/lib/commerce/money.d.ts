/** Formatea un importe: `money(1234.5)` → «1.234,50 €». Sin decimales cuando el importe es entero y `compact` es true. */
export declare function money(n: number, currency?: string, locale?: string, compact?: boolean): string;
/** Porcentaje de descuento entero entre un precio anterior y el actual (0 si no hay rebaja). */
export declare function discount(compareAt: number | undefined, price: number): number;
