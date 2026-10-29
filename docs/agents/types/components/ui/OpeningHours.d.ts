import { type Variant } from "./variants.js";
export { openingHoursSchema, parseHours, parseExceptions, hoursStatus, type DayHours, type HoursException } from "../../lib/ui/hours.js";
export type OpeningHoursProps = {
    /**
     * Horario semanal, una línea por grupo de días: `días|tramos`. Días con las iniciales españolas (`L M X J V S D`), en
     * rango (`L-V`) o lista (`L,X,V`); tramos `07:30-14:00 17:00-20:30` o `cerrado`. Un tramo que pasa de medianoche se
     * escribe `20:00-02:00`.
     */
    hours?: string;
    /** cierres y aperturas especiales, una por línea: `2026-12-25|Navidad` (cerrado) o `2026-12-24|Nochebuena|08:00-14:00` */
    exceptions?: string;
    /** zona horaria del negocio: el estado se calcula con la hora de allí, no con la del visitante */
    timeZone?: string;
    /** full = estado + semana con hoy resaltado · compact = estado + horario de hoy · badge = solo el estado */
    layout?: "full" | "compact" | "badge";
    /** minutos antes del cierre en que pasa a «Cierra pronto» */
    soonMinutes?: number;
    /** cuántos cierres o aperturas especiales próximos se enseñan (los pasados nunca) */
    maxExceptions?: number;
    /** título de la tabla (vacío = sin título) */
    title?: string;
    variant?: Variant;
    className?: string;
};
/**
 * Horario con estado «Abierto ahora · cierra a las 20:30» calculado en la zona horaria del negocio, festivos incluidos.
 * Responde la primera pregunta de restauración, comercio y clínicas (B3 en docs/11). La tabla se pinta en el servidor; el
 * estado, al montar (depende de la hora). `openingHoursSchema()` da el mismo horario en schema.org.
 */
export default function OpeningHours({ hours, exceptions, timeZone, layout, soonMinutes, maxExceptions, title, variant, className, }: OpeningHoursProps): import("react").JSX.Element;
