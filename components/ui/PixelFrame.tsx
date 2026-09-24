import type { CSSProperties, ReactNode } from "react";

/**
 * Pieles del pack Kenney "Pixel UI" (CC0), con el color de relleno (medido en el centro del PNG) de cada una:
 * se pinta DETRÁS del `border-image` para tapar las rendijas de un píxel que el navegador deja entre las 9
 * regiones cuando la escala de pantalla es fraccionaria (110 %, 125 %, 150 %…).
 */
export const PIXEL_FRAME_SKINS = {
  colored: { dir: "Colored", fills: { blue: "#1ea7e1", green: "#73cd4b", grey: "#eeeeee", red: "#e86a17", yellow: "#ffcc00" } },
  outline: { dir: "Outline", fills: { blue: "#eeeeee", green: "#eeeeee", red: "#eeeeee", yellow: "#eeeeee" } },
  ancient: { dir: "Ancient", fills: { brown: "#97714a", grey: "#838796", tan: "#d3bf8f", white: "#e5e5e5" } },
} as const;

export type PixelFrameSkin = keyof typeof PIXEL_FRAME_SKINS;

export type PixelFrameProps = {
  skin?: PixelFrameSkin;
  /** color de la piel; si no existe en esa piel se usa el primero que tenga (ver `PIXEL_FRAME_SKINS`) */
  color?: string;
  /** versión "hundida" del marco (estado pulsado) */
  pressed?: boolean;
  /** píxeles CSS por píxel del sprite; el marco ocupa 16 × escala px por cada lado */
  scale?: 1 | 2 | 3 | 4;
  children?: ReactNode;
  className?: string;
};

/** Resuelve piel + color (con el fallback al primero de la piel) a la ruta del PNG y a su color de relleno. */
export function pixelFrameAsset(skin: PixelFrameSkin, color: string, pressed: boolean) {
  const { dir, fills } = PIXEL_FRAME_SKINS[skin];
  const names = Object.keys(fills) as (keyof typeof fills)[];
  const c = names.includes(color as never) ? (color as keyof typeof fills) : names[0];
  return { src: `/pixel/kenney-pixel-ui/9-slice/${dir}/${c}${pressed ? "_pressed" : ""}.png`, fill: fills[c] as string };
}

/**
 * Marco pixel art de 9 cortes (`border-image`) con las piezas de Kenney "Pixel UI" — CC0, sin atribución
 * obligatoria (`public/pixel/kenney-pixel-ui/License.txt`). El marco trae su PROPIO fondo, siempre opaco y de tono
 * medio o claro (comprobado en las 13 combinaciones piel/color: negro sobre ellas da ≥ 4,5:1), y fija una paleta
 * local de tinta (`.ui-pframe` en ui-kit.css) para que el texto y los componentes del kit que pongas dentro se
 * lean igual con cualquier tema de la página: aquí el contraste no depende de lo que haya detrás.
 */
export default function PixelFrame({ skin = "colored", color = "blue", pressed = false, scale = 2, children, className = "" }: PixelFrameProps) {
  const { src, fill } = pixelFrameAsset(skin, color, pressed);
  return (
    <div className={`ui-pframe ${className}`.trim()} style={{ "--pf-img": `url(${src})`, "--pf-bg": fill, "--pf-s": scale } as CSSProperties}>
      {children}
    </div>
  );
}
