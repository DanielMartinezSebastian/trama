import { type Tone } from "./variants.js";
export type AvatarProps = {
    /** nombre completo: da las iniciales y el texto accesible */
    name: string;
    /** imagen (URL o data URI); sin ella se pintan las iniciales */
    src?: string;
    size?: "sm" | "md" | "lg";
    /** punto de estado en la esquina */
    status?: "none" | "online" | "away" | "busy" | "offline";
    /** token del color de las iniciales */
    tone?: Tone;
    className?: string;
};
/** Avatar con imagen o iniciales y punto de estado opcional. El nombre (y el estado) van como texto accesible. */
export default function Avatar({ name, src, size, status, tone, className }: AvatarProps): import("react").JSX.Element;
