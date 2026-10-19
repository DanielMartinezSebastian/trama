import { themes } from "@/lib/themes/themes";
import { neutralTokens, TOKEN_THEMES, type TokenSet } from "@/lib/ui/tokens";

/**
 * Presets del selector de tema de `/componentes`: los temas del kit (`TOKEN_THEMES`: neutro, dot matrix, editorial…) + los seis
 * temas de las landings.
 * Vive en el catálogo (no en `lib/ui/`) para que el kit no dependa de los datos de las demos.
 */
export type TokenPreset = { id: string; label: string; tokens: TokenSet };

const neutral: TokenPreset = { id: "neutro", label: "Neutro oscuro", tokens: neutralTokens };

export const tokenPresets: TokenPreset[] = [
  ...TOKEN_THEMES.map((t) => ({ id: t.id, label: t.label, tokens: t.tokens })),
  ...themes.map((t) => ({
    id: t.id,
    label: t.brand,
    tokens: {
      bg: t.palette.bg,
      fg: t.palette.fg,
      mut: t.palette.muted,
      acc: t.palette.accent,
      acc2: t.palette.accent2,
      card: t.palette.card,
      ln: t.palette.line,
      r: t.radius,
      font: t.font,
    },
  })),
];

export const getPreset = (id: string) => tokenPresets.find((p) => p.id === id) ?? neutral;
