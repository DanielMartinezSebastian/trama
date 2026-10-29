import { type Intent, type LegacyIntent } from "./intent.js";
import { type Variant } from "./variants.js";
export type TextFieldProps = {
    label?: string;
    placeholder?: string;
    defaultValue?: string;
    hint?: string;
    /** estado de validación con el vocabulario común (ver intent.ts): `danger` marca el campo como inválido (aria-invalid) */
    intent?: Exclude<Intent, "accent" | "neutral"> | LegacyIntent;
    /** @deprecated nombre antiguo de `intent`: "default" | "error" | "success" */
    state?: "default" | "error" | "success";
    variant?: Variant;
    size?: "sm" | "md" | "lg";
    /** carácter delante del texto (@, >, $…) */
    prefix?: string;
    /** `tel` abre el teclado numérico en el móvil */
    type?: "text" | "email" | "password" | "search" | "tel" | "url";
    /** pista de autocompletado del navegador (`name`, `given-name`, `tel`, `email`…) */
    autoComplete?: string;
    /** nombre del campo, para leerlo con `FormData` (ver `ContactForm`) */
    name?: string;
    /** dibuja un `<textarea>` en vez de un `<input>` */
    multiline?: boolean;
    rows?: number;
    required?: boolean;
    /** valor controlado desde fuera (con `onChange`); sin él, el campo guarda el suyo desde `defaultValue` */
    value?: string;
    /** a cada cambio, con el texto nuevo */
    onChange?: (value: string) => void;
    className?: string;
};
/** Campo de texto con etiqueta, ayuda y estados. El foco y los estados usan `--acc` / colores semánticos. */
export default function TextField({ label, placeholder, defaultValue, hint, intent, state, variant, size, prefix, type, name, autoComplete, multiline, rows, required, value: controlled, onChange, className, }: TextFieldProps): import("react").JSX.Element;
