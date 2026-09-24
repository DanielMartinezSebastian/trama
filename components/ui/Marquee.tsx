import type { CSSProperties } from "react";
import { tcls, type Tone, type Variant } from "./variants";

export type MarqueeProps = {
  text: string;
  /** segundos que tarda una vuelta completa (más = más lento) */
  duration?: number;
  /** @deprecated usa `duration` */
  speed?: number;
  rows?: number;
  variant?: Variant;
  tone?: Tone;
  /** alternate = las filas van en sentidos opuestos */
  direction?: "alternate" | "left" | "right";
  separator?: string;
  /** tamaño de letra en px */
  fontSize?: number;
  /** @deprecated usa `fontSize` */
  size?: number;
  pauseOnHover?: boolean;
  /** difumina los extremos */
  edgeFade?: boolean;
  /** inclina la cinta en grados */
  tilt?: number;
  className?: string;
};

/**
 * Cinta de texto en bucle, en CSS puro (sin JS). El estilo lo da la variante; el color, el token elegido.
 * El texto se repite solo para llenar el ancho; el lector de pantalla recibe una sola vez.
 */
export default function Marquee({
  text,
  duration, speed: legacySpeed,
  rows = 2,
  variant = "terminal",
  tone = "acc",
  direction = "alternate",
  separator = "  //  ",
  fontSize, size: legacySize,
  pauseOnHover = true,
  edgeFade = false,
  tilt = 0,
  className = "",
}: MarqueeProps) {
  const speed = duration ?? legacySpeed ?? 18;
  const size = fontSize ?? legacySize ?? 28;
  const track = `${text}${separator}`.repeat(6);
  return (
    <div
      className={`ui-marquee ui-marquee--${variant} ${tcls(tone)} ${pauseOnHover ? "ui-marquee--pause" : ""} ${edgeFade ? "ui-marquee--edges" : ""} ${className}`}
      style={{ fontSize: size, transform: tilt ? `rotate(${tilt}deg)` : undefined } as CSSProperties}
      role="marquee"
      aria-label={text}
    >
      {Array.from({ length: Math.max(1, rows) }, (_, i) => (
        <div key={i} className="ui-marquee__row" aria-hidden>
          <div
            className="ui-marquee__track"
            style={{
              animationDuration: `${speed * (1 + (i % 3) * 0.25)}s`,
              animationDirection: direction === "left" ? "normal" : direction === "right" ? "reverse" : i % 2 ? "reverse" : "normal",
            }}
          >
            <span>{track}</span>
            <span>{track}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
