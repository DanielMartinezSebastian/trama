import { type Variant } from "./variants.js";
export type StepperProps = {
    steps?: string;
    /** índice (0-based) del paso activo; los anteriores se marcan como hechos */
    current?: number;
    variant?: Variant;
    className?: string;
};
/** Indicador de progreso por pasos (alta, checkout, onboarding…). No gestiona el contenido de cada paso. */
export default function Stepper({ steps, current, variant, className }: StepperProps): import("react").JSX.Element;
