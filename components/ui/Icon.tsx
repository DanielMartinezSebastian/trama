import type { ReactElement, ReactNode, SVGProps } from "react";
import { ICONS, type IconEntry, type IconName } from "@/lib/ui/icons";
import { tcls, type Tone } from "./variants";

export type IconProps = {
  /** clave del set curado, p. ej. "heart" o "external-link" (agrupadas en `ICON_GROUPS`, `lib/ui/icons.ts`) */
  name?: IconName;
  /** alternativa a `name`: cualquier componente de `pixelarticons/react/*`, sin pasar por el set curado */
  icon?: (props: SVGProps<SVGSVGElement>) => ReactElement;
  /** lado: px (número) o cualquier longitud CSS */
  iconSize?: number | string;
  /** @deprecated usa `iconSize` */
  size?: number | string;
  /** variante de esquinas duras, cuando el icono la tiene (~1 de cada 2); si no, cae a la base */
  sharp?: boolean;
  /** token de color; sin él hereda el color del texto que lo rodea (`currentColor`) */
  tone?: Tone;
  /** nombre accesible; sin él el icono es decorativo y se oculta a los lectores de pantalla */
  label?: string;
  className?: string;
};

/**
 * Icono pixel art (Pixelarticons, MIT). SVG con `fill: currentColor`: se tiñe con el color del texto o con
 * un token del tema (`tone`), igual que el resto del kit. `shape-rendering: crispEdges` (ver `.ui-icon`) evita
 * que los bordes de cada píxel se suavicen al escalar.
 */
export default function Icon({ name, icon, iconSize, size: legacySize, sharp = false, tone, label, className = "" }: IconProps) {
  const size = iconSize ?? legacySize ?? 24;
  const entry: IconEntry | undefined = name ? ICONS[name] : undefined;
  const Glyph = icon ?? (entry ? (sharp && entry.sharp ? entry.sharp : entry.base) : undefined);
  if (!Glyph) return null;
  return (
    <Glyph
      width={size}
      height={size}
      className={`ui-icon ${tone ? `ui-icon--tone ${tcls(tone)}` : ""} ${className}`.trim()}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}

const GLYPH_ICON = /^icon:([a-z0-9-]+)(:sharp)?$/;

/**
 * Para los componentes del kit que reciben un "glifo" como texto (`glyph="→"`, los `items` de FeatureGrid…):
 * `"icon:heart"` (o `"icon:heart:sharp"`) se dibuja como el icono pixel art de ese nombre; cualquier otra cadena
 * pasa tal cual, así que lo existente no cambia. Un nombre que no está en el set se devuelve como texto — el
 * error de tecleo se ve en pantalla en vez de desaparecer.
 */
export function renderGlyph(glyph: string, size: number | string = "1.25em"): ReactNode {
  const m = GLYPH_ICON.exec(glyph);
  if (!m || !(m[1] in ICONS)) return glyph;
  return <Icon name={m[1] as IconName} iconSize={size} sharp={Boolean(m[2])} />;
}
