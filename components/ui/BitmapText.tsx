"use client";

import { useEffect, useState } from "react";
import { bannerLines } from "@/lib/text/banner";
import { tcls, type Tone } from "./variants";

export type BitmapTextProps = {
  text: string;
  /** "Bitmap" (fuente 7×7 de asciify-engine) o una fuente FIGlet */
  font?: string;
  /** carácter con el que se dibuja (solo fuente Bitmap) */
  char?: string;
  scale?: number;
  /** tamaño en px de cada carácter */
  fontSize?: number;
  /** @deprecated usa `fontSize` */
  size?: number;
  tone?: Tone;
  align?: "left" | "center" | "right";
  glow?: boolean;
  /** intensidad del halo en px */
  glowSize?: number;
  animate?: "none" | "flicker" | "scan";
  className?: string;
};

/**
 * Titular en arte ASCII generado por asciify-engine (`asciifyText` / FIGlet). El color viene del token
 * elegido en `tone`; el texto original queda accesible mediante `aria-label`.
 */
export default function BitmapText({
  text,
  font = "Bitmap",
  char = "#",
  scale = 1,
  fontSize, size: legacySize,
  tone = "acc",
  align = "left",
  glow = true,
  glowSize = 8,
  animate = "none",
  className = "",
}: BitmapTextProps) {
  const size = fontSize ?? legacySize ?? 11;
  const [lines, setLines] = useState<string[]>([text]);

  useEffect(() => {
    let live = true;
    bannerLines(text || " ", font, { char, scale }).then((l) => live && setLines(l));
    return () => {
      live = false;
    };
  }, [text, font, char, scale]);

  return (
    <pre
      role="img"
      aria-label={text}
      className={`ui-bitmap ${glow ? "ui-bitmap--glow" : ""} ui-bitmap--${animate} ${tcls(tone)} ${className}`}
      style={{ fontSize: size, lineHeight: `${size}px`, textAlign: align, textShadow: glow ? `0 0 ${glowSize}px var(--tone, var(--acc))` : undefined }}
    >
      {lines.join("\n")}
    </pre>
  );
}
