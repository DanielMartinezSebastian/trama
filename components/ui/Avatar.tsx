import { tcls, type Tone } from "./variants";

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

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => Array.from(w)[0]?.toUpperCase())
    .join("");

const STATUS_LABEL = { online: "en línea", away: "ausente", busy: "ocupado/a", offline: "desconectado/a" } as const;

/** Avatar con imagen o iniciales y punto de estado opcional. El nombre (y el estado) van como texto accesible. */
export default function Avatar({ name, src, size = "md", status = "none", tone = "acc", className = "" }: AvatarProps) {
  const label = status === "none" ? name : `${name}, ${STATUS_LABEL[status]}`;
  return (
    <span className={`ui-avatar ui-avatar--${size} ${tcls(tone)} ${className}`.trim()} role="img" aria-label={label}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" />
      ) : (
        <span aria-hidden>{initials(name)}</span>
      )}
      {status !== "none" && <i className={`ui-avatar__st ui-avatar__st--${status}`} aria-hidden />}
    </span>
  );
}
