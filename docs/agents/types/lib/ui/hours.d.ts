/** Un día de la semana (0 = domingo … 6 = sábado, como `Date.getDay()`) con sus tramos en minutos desde las 00:00. */
export type DayHours = {
    day: number;
    ranges: [number, number][];
};
/** Cierre puntual (festivo, vacaciones) o apertura especial: fecha ISO `2026-12-24` y, si abre, sus tramos. */
export type HoursException = {
    date: string;
    label?: string;
    ranges?: [number, number][];
};
export declare const DAY_NAMES: string[];
export declare const fmt: (m: number) => string;
/** Lee el formato de texto de `hours` (lo usa el componente y `openingHoursSchema`). */
export declare function parseHours(hours: string): DayHours[];
export declare function parseExceptions(text: string): HoursException[];
/**
 * `openingHoursSpecification` de schema.org a partir del mismo texto: ponlo en el JSON-LD del negocio (`LocalBusiness`,
 * `Bakery`, `Restaurant`…) para que el horario de la web coincida con el de la ficha de Google (B12 en docs/11).
 */
export declare function openingHoursSchema(hours: string, exceptions?: string): Record<string, unknown>[];
/** Fecha y minutos de ahora en la zona del negocio. */
export declare function nowIn(timeZone: string): {
    iso: string;
    day: number;
    min: number;
};
export type HoursStatus = {
    open: boolean;
    soon: boolean;
    text: string;
    detail: string;
};
export declare function hoursStatus(week: DayHours[], exceptions: HoursException[], timeZone: string, soonMinutes?: number): HoursStatus;
