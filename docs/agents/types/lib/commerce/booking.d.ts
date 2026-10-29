export type BookingService = {
    id: string;
    name: string;
    /** duración en minutos: decide qué huecos caben */
    minutes: number;
    /** precio en euros (0 o sin precio = gratis o a consultar) */
    price?: number;
    /** «Desde 45 €» en vez del precio cerrado */
    from?: boolean;
    description?: string;
    category?: string;
};
export type BookingStaff = {
    name: string;
    role?: string;
    photo?: string;
    /** ids de los servicios que hace (sin lista: todos) */
    services?: string[];
    /** ids de los locales donde trabaja (sin lista: en todos) */
    places?: string[];
};
/** un sitio donde se atiende (cadena con varios locales); opcional */
export type BookingPlace = {
    id: string;
    name: string;
    address?: string;
};
export type Appointment = {
    id: string;
    service: string;
    staff: string;
    place?: string;
    /** ISO, «2026-10-24» */
    date: string;
    /** «10:30» */
    time: string;
    name: string;
};
/**
 * Las citas guardadas en este navegador. Lee el almacenamiento tras montar (el primer pintado coincide con el del
 * servidor); sin almacenamiento (modo privado) funciona en memoria y `temporary` lo dice.
 */
export declare function useAppointments(storageKey?: string): {
    list: Appointment[];
    save: (a: Appointment) => void;
    cancel: (id: string) => void;
    ready: boolean;
    temporary: boolean;
};
/**
 * Huecos de un día para un profesional: las horas de `times` que caben antes del cierre y no pisan otra cita suya. `busy`
 * marca algunos como ocupados de forma estable (la misma fecha y persona dan siempre los mismos), para que la agenda de una
 * demo no parezca vacía.
 */
export declare function bookingSlots(opts: {
    date: string;
    times: string[];
    service: BookingService;
    staff: string;
    appointments: Appointment[];
    services: BookingService[];
    /** «14:00» el sábado, por ejemplo: día de la semana (0 = domingo) → hora de cierre */
    closesAt?: Partial<Record<number, string>>;
    /** cita que se está cambiando: no cuenta como ocupada */
    ignoreId?: string;
    /** 0–1: proporción de huecos ocupados de mentira (0 = ninguno) */
    busy?: number;
}): {
    time: string;
    disabled: boolean;
    note: string;
}[];
/** «sábado, 24 de octubre» */
export declare const prettyDate: (date: string) => string;
/** descarga un .ics con la cita (hora local del negocio) */
export declare function downloadCalendar(title: string, date: string, time: string, minutes: number, location: string): void;
/** horas que faltan para una cita (negativo si ya pasó) */
export declare const hoursUntil: (a: Pick<Appointment, "date" | "time">) => number;
