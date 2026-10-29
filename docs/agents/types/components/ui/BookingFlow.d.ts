import { type Appointment, type BookingPlace, type BookingService, type BookingStaff } from "../../lib/commerce/booking.js";
export type { Appointment, BookingPlace, BookingService, BookingStaff } from "../../lib/commerce/booking.js";
import { type Variant } from "./variants.js";
export type BookingFlowProps = {
    /** lo que se reserva, con duración y precio */
    services: BookingService[];
    /** quién atiende; cada uno, con los servicios que hace */
    staff: BookingStaff[];
    /** locales de una cadena: si hay, el primer paso es elegir uno */
    places?: BookingPlace[];
    /** horas de inicio posibles, separadas por comas */
    times?: string;
    /** días cerrados (0 = domingo), separados por comas */
    closedDays?: string;
    /** cierre antes de hora por día de la semana: { 6: "14:00" } */
    closesAt?: Partial<Record<number, string>>;
    /** antelación mínima y máxima, en días */
    min?: number;
    max?: number;
    /** clave de `localStorage` donde se guardan las citas (la misma que lea `AppointmentList`) */
    storageKey?: string;
    /** servicio, profesional o local elegidos al llegar (`?servicio=` desde una carta) */
    initialService?: string;
    initialStaff?: string;
    initialPlace?: string;
    /** id de una cita guardada que se está cambiando de día (reprogramar) */
    editId?: string;
    /** títulos de cada elección */
    serviceLabel?: string;
    staffLabel?: string;
    placeLabel?: string;
    /** opción «me da igual» en la elección de profesional (el primero con hueco) */
    anyStaffLabel?: string;
    /** nombre del negocio y dirección, para el archivo de calendario */
    business?: string;
    location?: string;
    /** enlace de «Ver mis citas» en la confirmación */
    appointmentsHref?: string;
    /** aviso bajo el formulario (que es una demo, la política de cambios…) */
    note?: string;
    /** se llama al guardar la cita */
    onBooked?: (a: Appointment) => void;
    variant?: Variant;
    className?: string;
};
/**
 * Reserva de cita en pasos (peluquería, barbería, estética, consulta): local si hay varios, servicio y profesional; día y
 * hueco con `DatePicker`; datos; y confirmación con «Añadir al calendario». Los huecos dependen de la duración del servicio,
 * del cierre de cada día y de las citas ya guardadas (`useAppointments`, en `localStorage`). Un resumen al lado sigue la
 * elección. No envía nada: es la interfaz de la reserva; conecta `onBooked` a tu agenda.
 */
export default function BookingFlow({ services, staff, places, times, closedDays, closesAt, min, max, storageKey, initialService, initialStaff, initialPlace, editId, serviceLabel, staffLabel, placeLabel, anyStaffLabel, business, location, appointmentsHref, note, onBooked, variant, className, }: BookingFlowProps): import("react").JSX.Element;
