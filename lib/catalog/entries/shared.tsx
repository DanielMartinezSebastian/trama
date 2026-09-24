import { CARD_FILLS, CARD_PATTERNS, type CardFill, type CardPattern, type CardTone } from "@/components/ui/fill";
import { INTENTS } from "@/components/ui/intent";
import { VARIANTS } from "@/components/ui/variants";
import type { PropSpec, StyleTag, Values } from "../schema";

/** Todas las variantes de estilo del sistema: los componentes con `variant` las soportan todas. */
export const ALL_STYLES: StyleTag[] = [...VARIANTS];

export const variantProp = (def: string = "glass"): PropSpec => ({
  key: "variant",
  label: "Variante de estilo",
  type: "select",
  default: def,
  options: VARIANTS,
  hint: "Cambia superficie, borde, radio, sombra y tipografía",
});

export const toneProp = (def = "acc", options: readonly string[] = ["fg", "acc", "acc2", "mut"]): PropSpec => ({
  key: "tone",
  label: "Color (token)",
  type: "select",
  default: def,
  options,
  hint: "Sigue el tema y los colores del selector",
});

export const HOVER_FX = ["spotlight", "magnify", "repel", "glow", "colorShift", "attract", "shatter", "trail", "glitchText"] as const;

/** Contenido de ejemplo sobre un fondo: comprueba la legibilidad. */
export const Sample = ({ children }: { children: string }) => (
  <div className="ui-sample">
    <strong>{children}</strong>
    <span>Texto de ejemplo para comprobar la legibilidad sobre el fondo.</span>
  </div>
);

/** Controles del fondo de tarjeta (components/ui/fill.ts), iguales en todas las tarjetas. */
export const fillSpecs = (def: string = "surface"): PropSpec[] => [
  { key: "fill", label: "Fondo", type: "select", default: def, options: CARD_FILLS, labels: { surface: "el de la variante", tint: "tinte de acento", gradient: "degradado", accent: "acento (invertida)", pattern: "trama", image: "imagen" } },
  { key: "pattern", label: "Trama", type: "select", default: "dots", options: CARD_PATTERNS, when: (p) => p.fill === "pattern" },
  { key: "image", label: "Imagen (URL o gen:N)", type: "text", default: "gen:3", when: (p) => p.fill === "image" },
  { key: "tone", label: "Acento", type: "select", default: "acc", options: ["acc", "acc2"], labels: { acc: "principal (--acc)", acc2: "secundario (--acc2)" } },
];

/** Las props de fondo de una entrada, listas para pasar al componente. */
export const fillValues = (p: Values) => ({
  fill: p.fill as CardFill,
  pattern: p.pattern as CardPattern,
  image: p.fill === "image" ? (p.image as string) : undefined,
  tone: p.tone as CardTone,
});

export const INTENT_LABELS: Record<string, string> = { none: "ninguno", accent: "acento del tema", neutral: "neutro", success: "éxito", info: "info", warning: "aviso", danger: "peligro" };

/** Color semántico común (components/ui/intent.ts), igual en Button, Badge, Alert, TextField, Toast y Modal. */
export const intentProp = (def: string = "accent", options: readonly string[] = INTENTS, extra: Partial<PropSpec> = {}): PropSpec =>
  ({ key: "intent", label: "Color (intent)", type: "select", default: def, options, labels: INTENT_LABELS, hint: "Mismo vocabulario en todo el kit", ...extra }) as PropSpec;

