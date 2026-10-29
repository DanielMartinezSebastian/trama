import { type Intent, type LegacyIntent } from "./intent.js";
import { type Variant } from "./variants.js";
export type BadgeProps = {
    text: string;
    variant?: Variant;
    /** color semántico, el mismo vocabulario que Button, Alert, TextField y Toast (ver intent.ts) */
    intent?: Intent | LegacyIntent;
    /** @deprecated nombre antiguo de `intent` (aceptaba `warn`); se mantiene por compatibilidad */
    tone?: Intent | LegacyIntent;
    size?: "md" | "lg";
    dot?: boolean;
    className?: string;
};
/** Etiqueta de estado con color semántico (`intent`). */
export default function Badge({ text, variant, intent, tone, size, dot, className }: BadgeProps): import("react").JSX.Element;
