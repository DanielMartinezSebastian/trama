/**
 * Estado compartido de los demos de texto: el texto que escribe el usuario, la
 * fuente FIGlet y el efecto de hover. Los sketches lo leen en cada fotograma, así
 * que teclear se refleja al instante sin remontar nada.
 */
export type TextState = { text: string; font: string; effect: string };

export const DEFAULT_TEXT = "TEXTMODE";
const DEFAULTS: TextState = { text: DEFAULT_TEXT, font: "Standard", effect: "spotlight" };
const KEY = "fondos-text-v1";

let state: TextState = DEFAULTS;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    /* almacenamiento no disponible: se usan los valores por defecto */
  }
}

export const textStore = {
  get(): TextState {
    load();
    return state;
  },
  /** Texto efectivo: si el cajón está vacío se usa el de por defecto. */
  text(): string {
    return textStore.get().text.trim() || DEFAULT_TEXT;
  },
  server(): TextState {
    return DEFAULTS;
  },
  set(patch: Partial<TextState>) {
    load();
    state = { ...state, ...patch };
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignorar */
    }
    listeners.forEach((fn) => fn());
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};

/** Fuentes FIGlet de asciify-engine/studio (+ la fuente bitmap 7×7 del motor). */
export const BANNER_FONTS = [
  "Bitmap",
  "Standard",
  "Slant",
  "Small",
  "Big",
  "Banner",
  "Block",
  "Bubble",
  "Digital",
  "Doom",
  "Lean",
  "Mini",
  "Script",
  "Shadow",
  "Speed",
  "Starwars",
  "Stop",
  "Straight",
  "Thin",
  "ThreeD",
  "Univers",
  "Wavy",
] as const;

/** Efectos de hover del motor clásico de asciify-engine. */
export const HOVER_EFFECTS = [
  "spotlight",
  "magnify",
  "repel",
  "glow",
  "colorShift",
  "attract",
  "shatter",
  "trail",
  "glitchText",
] as const;
