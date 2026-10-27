import type { CSSProperties } from "react";
import type { CatalogEntry, Values } from "@/lib/catalog/schema";
import type { IconWeight } from "@/components/ui/Icon";
import type { HoverEffectKind } from "@/components/ui/HoverFX";
import type { PresenceEffect } from "@/components/ui/Presence";

export type PreviewMode = "scroll" | "inview";
export const previewMode = (entry: CatalogEntry, values: Values) => typeof entry.preview === "function" ? entry.preview(values) : entry.preview;

export type PreviewEnvironment = {
  theme: CSSProperties;
  iconFamily: "pixel" | "phosphor" | "lucide";
  iconWeight: IconWeight;
  enter: boolean;
  enterEffect: PresenceEffect;
  enterDuration: number;
  hover: boolean;
  hoverEffect: HoverEffectKind;
  hoverStrength: number;
};

export type PreviewConfig = PreviewEnvironment & { id: string; values: Values; replay: number; mode: PreviewMode };
export type PreviewCommand =
  | { type: "trama-preview:config"; config: PreviewConfig }
  | { type: "trama-preview:seek"; progress: number }
  | { type: "trama-preview:reset" };

export type PreviewReport =
  | { type: "trama-preview:ready" }
  | { type: "trama-preview:scroll"; progress: number };
