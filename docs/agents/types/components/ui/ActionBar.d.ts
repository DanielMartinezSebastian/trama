import type { MouseEvent } from "react";
import type { IconName } from "../../lib/ui/icons.js";
import { type Variant } from "./variants.js";
export type ActionItem = {
    label: string;
    /** `tel:+34…`, `https://wa.me/34…`, una ruta o un ancla */
    href?: string;
    onClick?: (e: MouseEvent) => void;
    icon?: IconName;
    /** la acción principal (una sola): ocupa más y lleva el color de acento */
    primary?: boolean;
    /** contador sobre el icono (artículos en la bolsa) */
    badge?: number;
};
export type ActionBarProps = {
    /** una acción por línea o separadas por `;`: `Etiqueta|enlace|icono|primary` (p. ej. `Llamar|tel:+34976000000|phone`) */
    actions?: string | ActionItem[];
    /** mobile = solo en ventanas de hasta 760 px (en la zona del pulgar) · always = también en escritorio */
    show?: "mobile" | "always";
    /** fixed = pegada abajo con su hueco en la página · static = en el flujo (vista previa, maquetas) */
    position?: "fixed" | "static";
    /** nombre accesible de la barra */
    label?: string;
    /** al pulsar un enlace interno (empieza por `/`): navegación sin recarga del framework */
    onNavigate?: (href: string) => void;
    /** suave: sin bandeja ni botón relleno; vidrio que se difumina hacia arriba, las acciones iguales y los iconos con
     * brillo (la principal, en el acento) */
    soft?: boolean;
    variant?: Variant;
    className?: string;
};
/**
 * Barra de acciones fija abajo en móvil: llamar, WhatsApp, cómo llegar y la acción principal del negocio (reservar,
 * pedir, pedir cita). Responde a B1 y B2 de docs/11: la acción no obliga a abrir el menú y queda en la zona del pulgar
 * (objetivos de 56 px, `safe-area-inset-bottom`). Deja un hueco de su altura al final de la página para no tapar el pie.
 */
export default function ActionBar({ actions, show, position, label, onNavigate, soft, variant, className, }: ActionBarProps): import("react").JSX.Element;
