import { tcls, type Tone } from "./variants";

export type NeonSignProps = {
  text?: string;
  mode?: "tube" | "outline" | "pixel";
  tone?: Extract<Tone, "acc" | "acc2" | "fg">;
  /** tamaño de letra en px */
  fontSize?: number;
  /** @deprecated usa `fontSize` */
  size?: number;
  flicker?: boolean;
  className?: string;
};

/** Rótulo luminoso: tubo de neón, contorno o sombra de píxel. Usa `--acc` / `--acc2`. */
export default function NeonSign({ text = "ABIERTO", mode = "tube", tone = "acc", fontSize, size: legacySize, flicker = true, className = "" }: NeonSignProps) {
  const size = fontSize ?? legacySize ?? 64;
  return (
    <p className={`ui-neon ui-neon--${mode} ${flicker ? "ui-neon--flicker" : ""} ${tcls(tone)} ${className}`} style={{ fontSize: size, margin: 0 }}>
      {text}
    </p>
  );
}
