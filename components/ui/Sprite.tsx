import type { CSSProperties } from "react";

/** Geometría de la hoja de Kenney "Pixel UI" (UIpackSheet_transparent.png): baldosas de 16 px con 2 px de margen. */
export const SPRITE_SHEET = {
  src: "/pixel/kenney-pixel-ui/spritesheet/sheet.png",
  tile: 16,
  gap: 2,
  width: 538,
  height: 592,
  cols: 30,
  rows: 33,
} as const;

export type SpriteProps = {
  /** columna de la baldosa en la hoja, empezando en 0 */
  col: number;
  /** fila de la baldosa en la hoja, empezando en 0 */
  row: number;
  /** píxeles CSS por píxel del sprite (números enteros mantienen los píxeles nítidos) */
  scale?: number;
  /** nombre accesible; sin él el sprite es decorativo */
  label?: string;
  className?: string;
};

/**
 * Una baldosa 16×16 de la hoja de sprites de Kenney "Pixel UI" (CC0): flechas, casillas, punteros, botones…
 * Son píxeles ya coloreados, no se tiñen con los tokens del tema (a diferencia de `Icon`). Las coordenadas se
 * ven en el catálogo (`/componentes` → Pixel art → Sprite), que dibuja la hoja con su rejilla.
 */
export default function Sprite({ col, row, scale = 2, label, className = "" }: SpriteProps) {
  return (
    <span
      className={`ui-sprite ${className}`.trim()}
      style={{ "--sp-img": `url(${SPRITE_SHEET.src})`, "--sp-s": scale, "--sp-x": col, "--sp-y": row } as CSSProperties}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
