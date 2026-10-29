import { type BookingPlace, type BookingService } from "../../lib/commerce/booking.js";
import { type Variant } from "./variants.js";
export type AppointmentListProps = {
    /** los mismos servicios que la reserva, para nombre y duración */
    services: BookingService[];
    places?: BookingPlace[];
    /** clave de `localStorage` de las citas (la misma que en `BookingFlow`) */
    storageKey?: string;
    /** enlace de la reserva; «Cambiar» le añade `?editar=<id>` */
    bookHref: string;
    /** horas antes de la cita en que se cierran los cambios en línea */
    cutoffHours?: number;
    business?: string;
    location?: string;
    emptyTitle?: string;
    emptyText?: string;
    variant?: Variant;
    className?: string;
};
/**
 * «Mis citas»: las citas guardadas por `BookingFlow` en este navegador, por fecha, con añadir al calendario, cambiar de día
 * y cancelar (con confirmación). Dentro de `cutoffHours` los cambios se cierran, como en una agenda real. Con la lista
 * vacía, una invitación a reservar.
 */
export default function AppointmentList({ services, places, storageKey, bookHref, cutoffHours, business, location, emptyTitle, emptyText, variant, className, }: AppointmentListProps): import("react").JSX.Element;
