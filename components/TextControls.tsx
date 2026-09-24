"use client";

import { useSyncExternalStore } from "react";
import { BANNER_FONTS, HOVER_EFFECTS, textStore } from "@/lib/text/store";

export type Control = "font" | "effect";

/**
 * Cajón de texto (y selectores opcionales) para probar los demos en tiempo real.
 * Los sketches leen `textStore` en cada fotograma, así que no hace falta remontar nada.
 */
export default function TextControls({ controls }: { controls: Control[] }) {
  const state = useSyncExternalStore(textStore.subscribe, textStore.get, textStore.server);

  return (
    <div className="controls">
      <input
        className="controls__input"
        type="text"
        value={state.text}
        maxLength={40}
        placeholder="Escribe un texto…"
        aria-label="Texto del fondo"
        spellCheck={false}
        autoComplete="off"
        onChange={(e) => textStore.set({ text: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === "Escape") e.currentTarget.blur();
        }}
      />
      {controls.includes("font") && (
        <select
          className="controls__select"
          aria-label="Fuente"
          value={state.font}
          onChange={(e) => textStore.set({ font: e.target.value })}
        >
          {BANNER_FONTS.map((f) => (
            <option key={f} value={f}>
              {f === "Bitmap" ? "Bitmap 7×7" : f}
            </option>
          ))}
        </select>
      )}
      {controls.includes("effect") && (
        <select
          className="controls__select"
          aria-label="Efecto de hover"
          value={state.effect}
          onChange={(e) => textStore.set({ effect: e.target.value })}
        >
          {HOVER_EFFECTS.map((f) => (
            <option key={f} value={f}>
              hover: {f}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
