/** Formatea un importe: `money(1234.5)` → «1.234,50 €». Sin decimales cuando el importe es entero y `compact` es true. */
export function money(n: number, currency = "EUR", locale = "es-ES", compact = false): string {
  const whole = compact && Number.isInteger(n);
  return n.toLocaleString(locale, { style: "currency", currency, minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 });
}

/** Porcentaje de descuento entero entre un precio anterior y el actual (0 si no hay rebaja). */
export function discount(compareAt: number | undefined, price: number): number {
  return compareAt && compareAt > price ? Math.round((1 - price / compareAt) * 100) : 0;
}
