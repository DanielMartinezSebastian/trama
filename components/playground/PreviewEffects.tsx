"use client";

import type { ReactNode } from "react";
import HoverFX from "@/components/ui/HoverFX";
import Presence from "@/components/ui/Presence";
import { IconSet } from "@/components/ui/Icon";
import { lucide } from "@/lib/ui/icons-lucide";
import { phosphor } from "@/lib/ui/icons-phosphor";
import type { PreviewEnvironment } from "./preview-protocol";

export default function PreviewEffects({ environment: env, canWrap = true, children }: { environment: PreviewEnvironment; canWrap?: boolean; children: ReactNode }) {
  let out = children;
  if (canWrap && env.hover) out = <HoverFX effect={env.hoverEffect} strength={env.hoverStrength} fill>{out}</HoverFX>;
  if (canWrap && env.enter) out = <Presence effect={env.enterEffect} loop duration={env.enterDuration} hold={1.4} fill>{out}</Presence>;
  const set = env.iconFamily === "phosphor" ? phosphor : env.iconFamily === "lucide" ? lucide : undefined;
  return <IconSet set={set} weight={env.iconWeight}>{out}</IconSet>;
}
