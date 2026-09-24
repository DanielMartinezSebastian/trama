import { vcls, type Variant } from "./variants";

export type DividerProps = {
  label?: string;
  /** caracteres de la regla en el modo texto */
  pattern?: string;
  /** line = línea CSS; text = repetición de `pattern` */
  mode?: "line" | "text";
  variant?: Variant;
  className?: string;
};

/** Separador con etiqueta opcional. El modo `text` dibuja la regla con caracteres. */
export default function Divider({ label = "o continúa con", pattern = "-=", mode = "line", variant = "minimal", className = "" }: DividerProps) {
  const rule = (k: string) => (
    <span key={k} className={`ui-div__rule ${mode === "line" ? "ui-div__rule--line" : ""}`} aria-hidden>
      {mode === "text" ? (pattern || "-").repeat(80) : ""}
    </span>
  );
  return (
    <div role="separator" aria-label={label} className={`ui-div ${vcls(variant)} ${className}`}>
      {rule("a")}
      {label && <span>{label}</span>}
      {rule("b")}
    </div>
  );
}
