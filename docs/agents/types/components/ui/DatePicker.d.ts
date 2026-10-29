import { type Variant } from "./variants.js";
/** Un hueco horario del día elegido. */
export type DateSlot = {
    time: string;
    disabled?: boolean; /** texto corto bajo la hora: «2 plazas», «último» */
    note?: string;
};
export type DatePickerProps = {
    /** single = un día · range = llegada y salida (o inicio y fin) */
    mode?: "single" | "range";
    /** fecha ISO (`2026-10-24`) o intervalo ISO (`2026-10-24/2026-10-27`) en `range` */
    value?: string;
    onChange?: (value: string) => void;
    /** primer día elegible: fecha ISO o días desde hoy (`2` = pasado mañana; encargos con 48 h de antelación) */
    min?: string | number;
    /** último día elegible: fecha ISO o días desde hoy */
    max?: string | number;
    /** días de la semana cerrados (0 = domingo … 6 = sábado), separados por comas: «0» o «0,1» */
    closedDays?: string;
    /** fechas sueltas no disponibles (festivos, completos), separadas por comas */
    disabledDates?: string;
    /** huecos de cada día, separados por comas («09:00, 10:30, 12:00») o una función por fecha (disponibilidad real) */
    slots?: string | ((date: string) => DateSlot[]);
    slot?: string;
    onSlotChange?: (slot: string) => void;
    /** meses a la vista (2 en escritorio para rangos de hotel) */
    months?: 1 | 2;
    /** texto del grupo de huecos */
    slotsLabel?: string;
    /** noches mínimas en `range` */
    minNights?: number;
    /** atajos con los próximos N días disponibles («Hoy», «Mañana», «jue 23») encima del calendario (solo `single`) */
    shortcuts?: number;
    /** open = calendario siempre a la vista · collapsed = solo los atajos y «Otro día…», que despliega el calendario */
    calendar?: "open" | "collapsed";
    /** nombre accesible del calendario */
    label?: string;
    variant?: Variant;
    className?: string;
};
/**
 * Calendario en línea para elegir un día (cita, encargo, recogida) o un rango (hotel, alquiler), con días cerrados,
 * antelación mínima y huecos horarios del día elegido. Es una cuadrícula ARIA: flechas ±1 día y ±1 semana, Inicio/Fin
 * de semana, RePág/AvPág de mes, Intro o espacio para elegir. Controlado o no: `value` + `onChange` (ISO), igual que
 * `slot` + `onSlotChange`. Sin JS se ve el mes en curso. La disponibilidad real llega con `slots` como función.
 */
export default function DatePicker({ mode, value, onChange, min, max, closedDays, disabledDates, slots, slot, onSlotChange, months, slotsLabel, minNights, shortcuts, calendar, label, variant, className, }: DatePickerProps): import("react").JSX.Element;
