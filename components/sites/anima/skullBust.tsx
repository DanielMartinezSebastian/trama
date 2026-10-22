"use client";

import type { MutableRefObject } from "react";
import type { ModelNavPointer } from "@/lib/modelnav/pointer";
import ModelNavScene from "@/lib/modelnav/scene";
import NavSkull from "./navSkull";

/** El busto de la calavera en su propio lienzo (la escena del medallón del kit: se inclina hacia el puntero). */
export default function SkullBust({ pointer, active, gem }: { pointer: MutableRefObject<ModelNavPointer>; active: boolean; gem: boolean }) {
  return (
    <ModelNavScene pointer={pointer} follow={0.45} active={active}>
      <NavSkull gem={gem} trackEye />
    </ModelNavScene>
  );
}
