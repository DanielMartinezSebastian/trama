import type { Textmodifier } from "textmode.js";
import { aurora } from "./aurora";
import { fire } from "./fire";
import { flow } from "./flow";
import { life } from "./life";
import { matrix } from "./matrix";
import { ocean } from "./ocean";
import { plasma } from "./plasma";
import { ripples } from "./ripples";
import { starfield } from "./starfield";
import { tunnel } from "./tunnel";
import { scAssemble } from "./scroll-assemble";
import { scParallax } from "./scroll-parallax";
import { scRain } from "./scroll-rain";
import { scStats } from "./scroll-stats";
import { scTerminal } from "./scroll-terminal";
import { scZoom } from "./scroll-zoom";
import { tx3d } from "./text-3d";
import { txScramble } from "./text-scramble";
import { thOrbit } from "./theme-orbit";
import { thPulse } from "./theme-pulse";
import { txComboFiglet } from "./text-combo-figlet";
import { txGlitch } from "./text-glitch";
import { txMarquee } from "./text-marquee";
import { txParticles } from "./text-particles";
import { txRain } from "./text-rain";
import { txWave } from "./text-wave";

export type Sketch = {
  fontSize: number;
  setup: (t: Textmodifier) => void;
};

export const sketches: Record<string, Sketch> = {
  plasma: { fontSize: 16, setup: plasma },
  matrix: { fontSize: 16, setup: matrix },
  starfield: { fontSize: 14, setup: starfield },
  ripples: { fontSize: 14, setup: ripples },
  life: { fontSize: 14, setup: life },
  flow: { fontSize: 14, setup: flow },
  fire: { fontSize: 14, setup: fire },
  ocean: { fontSize: 16, setup: ocean },
  tunnel: { fontSize: 16, setup: tunnel },
  aurora: { fontSize: 16, setup: aurora },
  // Demos de texto (leen lo que se escribe en el cajón de la interfaz)
  "tx-wave": { fontSize: 12, setup: txWave },
  "tx-particles": { fontSize: 12, setup: txParticles },
  "tx-glitch": { fontSize: 12, setup: txGlitch },
  "tx-rain": { fontSize: 14, setup: txRain },
  "tx-marquee": { fontSize: 16, setup: txMarquee },
  "tx-combo-figlet": { fontSize: 14, setup: txComboFiglet },
  "tx-scramble": { fontSize: 12, setup: txScramble },
  "tx-3d": { fontSize: 12, setup: tx3d },
  // Demos con scroll (300vh): leen scrollState
  "sc-zoom": { fontSize: 12, setup: scZoom },
  "sc-assemble": { fontSize: 12, setup: (t) => scAssemble(t) },
  "sc-rain": { fontSize: 14, setup: scRain },
  "sc-parallax": { fontSize: 14, setup: scParallax },
  "sc-terminal": { fontSize: 20, setup: scTerminal },
  "sc-stats": { fontSize: 10, setup: scStats },
  "sc-combo": { fontSize: 12, setup: (t) => scAssemble(t, { transparent: true }) },
  // Fondos de las landings temáticas
  "th-orbit": { fontSize: 14, setup: thOrbit },
  "th-pulse": { fontSize: 14, setup: thPulse },
  // Capa superior del combo: partículas de texto sin fondo, fusionadas con la capa de asciify
  "tx-combo-layers": { fontSize: 12, setup: (t) => txParticles(t, { transparent: true }) },
};
