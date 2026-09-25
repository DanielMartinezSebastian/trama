"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2, WebGLRenderTarget } from "three";
import { cssToColor } from "@/lib/retro3d/color";
import { createGlyphAtlas, type RetroRamp } from "@/lib/retro3d/glyphAtlas";
import { fragmentShader, RETRO_DITHERS, RETRO_MODES, RETRO_TINTS, vertexShader } from "@/lib/retro3d/shader";

export type RetroFXProps = {
  /** pixel = bloques posterizados · ascii = caracteres · both = caracteres sobre el pixel art */
  mode?: "pixel" | "ascii" | "both";
  /** mono = --fg sobre --bg · scene = colores de la escena · gradient = bg → acento → fg según la luz */
  tint?: "mono" | "scene" | "gradient";
  /** rampa de glifos de menos a más denso */
  ramp?: RetroRamp;
  /** glifos propios, de menos a más denso (sustituye a `ramp`); p. ej. " .oO@" */
  chars?: string;
  /** ancho de la celda de caracteres en px CSS */
  cellSize?: number;
  /** alto/ancho de la celda (los caracteres suelen ser más altos que anchos) */
  cellAspect?: number;
  /** lado del bloque de pixel art en px CSS */
  pixelSize?: number;
  /** niveles de la paleta del pixel art (2 = solo dos tonos) */
  levels?: number;
  /** cuánto dither entre niveles, 0–1 */
  dither?: number;
  /** patrón del dither: bayer = cuadrícula · hatch = diagonal · halftone = semitono de puntos · noise = ruido */
  ditherPattern?: "bayer" | "hatch" | "halftone" | "noise";
  contrast?: number;
  brightness?: number;
  invert?: boolean;
  /** intensidad de las líneas de barrido, 0–1 */
  scanlines?: number;
  /** distancia entre líneas de barrido en px CSS */
  scanlineSize?: number;
  /** banda brillante que recorre la pantalla, 0–1 */
  scanlineRoll?: number;
  vignette?: number;
  /** abombado de la pantalla CRT, 0–1 */
  curvature?: number;
  noise?: number;
  flicker?: number;
  /** bandas horizontales que saltan (fallo de señal), 0–1 */
  glitch?: number;
  /** aberración cromática: canales rojo y azul desplazados, 0–1 */
  aberration?: number;
  /** halo de fósforo alrededor de lo que brilla, 0–1 */
  glow?: number;
  /** lluvia de código sobre la escena, 0–1 */
  rain?: number;
  /**
   * resolución de la escena intermedia respecto al lienzo, 0–1. 0 (por defecto) = automática: unas 3 muestras por celda ASCII
   * o 2 por bloque de pixel art, que es todo lo que el filtro llega a leer. Subirla solo añade coste de GPU
   */
  sceneScale?: number;
  /** colores CSS; por defecto blanco sobre negro (RetroCanvas los toma de los tokens del tema) */
  fg?: string;
  bg?: string;
  accent?: string;
};

export const RETRO_FX_DEFAULTS = {
  mode: "ascii",
  tint: "mono",
  ramp: "dots",
  chars: "",
  cellSize: 7,
  cellAspect: 1.4,
  pixelSize: 4,
  levels: 4,
  dither: 0.6,
  ditherPattern: "bayer",
  contrast: 1.25,
  brightness: 0,
  invert: false,
  scanlines: 0.35,
  scanlineSize: 3,
  scanlineRoll: 0,
  vignette: 0.45,
  curvature: 0,
  noise: 0,
  flicker: 0.04,
  glitch: 0,
  aberration: 0,
  glow: 0,
  rain: 0,
  sceneScale: 0,
  fg: "#e9e9e9",
  bg: "#000000",
  accent: "#8a8a8a",
} satisfies Required<RetroFXProps>;

/**
 * Post-proceso retro para react-three-fiber: pixel art, ASCII y scanlines. Va DENTRO de un `<Canvas>` (o usa `RetroCanvas`,
 * que ya lo trae). Toma el control del render: dibuja la escena en una textura y la pasa por el shader a pantalla completa.
 * No renderiza nada en el árbol de React.
 */
export default function RetroFX(props: RetroFXProps) {
  const p = { ...RETRO_FX_DEFAULTS, ...stripUndefined(props) };
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  const ref = useRef(p);
  ref.current = p;

  // la textura de glifos solo se rehace si cambia la rampa o la proporción de celda
  const atlas = useMemo(() => createGlyphAtlas(p.ramp, p.chars, p.cellAspect), [p.ramp, p.chars, p.cellAspect]);
  useEffect(() => () => atlas.texture.dispose(), [atlas]);

  // el objetivo de render, el quad y el material viven mientras viva el componente
  const [fx] = useState(() => {
    // sin MSAA (`samples`): en GPUs móviles resolverlo cuesta más que todo el filtro y el ASCII/pixel art ya lo disimula
    const target = new WebGLRenderTarget(4, 4);
    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
      uniforms: {
        tScene: { value: target.texture },
        tGlyph: { value: null },
        uRes: { value: new Vector2(4, 4) },
        uTime: { value: 0 },
        uMode: { value: 1 },
        uTint: { value: 0 },
        uCell: { value: 8 },
        uCellAspect: { value: 1.4 },
        uGlyphs: { value: 2 },
        uPixel: { value: 4 },
        uLevels: { value: 4 },
        uDither: { value: 0.5 },
        uContrast: { value: 1 },
        uBright: { value: 0 },
        uInvert: { value: 0 },
        uScan: { value: 0 },
        uScanPeriod: { value: 3 },
        uRoll: { value: 0 },
        uVig: { value: 0 },
        uCurve: { value: 0 },
        uNoise: { value: 0 },
        uFlicker: { value: 0 },
        uDitherKind: { value: 0 },
        uGlitch: { value: 0 },
        uAberr: { value: 0 },
        uGlow: { value: 0 },
        uRain: { value: 0 },
        uFg: { value: cssToColor(RETRO_FX_DEFAULTS.fg, RETRO_FX_DEFAULTS.fg) },
        uBg: { value: cssToColor(RETRO_FX_DEFAULTS.bg, RETRO_FX_DEFAULTS.bg) },
        uAcc: { value: cssToColor(RETRO_FX_DEFAULTS.accent, RETRO_FX_DEFAULTS.accent) },
      },
    });
    const quad = new Mesh(new PlaneGeometry(2, 2), material);
    quad.frustumCulled = false;
    const scene = new Scene();
    scene.add(quad);
    return { target, material, quad, scene, camera: new OrthographicCamera(-1, 1, 1, -1, 0, 1), size: new Vector2() };
  });
  useEffect(
    () => () => {
      fx.target.dispose();
      fx.material.dispose();
      fx.quad.geometry.dispose();
    },
    [fx],
  );

  // los colores CSS se resuelven en un efecto (necesitan el DOM) y solo cuando cambian
  useEffect(() => {
    const u = fx.material.uniforms;
    u.uFg.value = cssToColor(p.fg, RETRO_FX_DEFAULTS.fg);
    u.uBg.value = cssToColor(p.bg, RETRO_FX_DEFAULTS.bg);
    u.uAcc.value = cssToColor(p.accent, RETRO_FX_DEFAULTS.accent);
  }, [fx, p.fg, p.bg, p.accent]);

  // con frameloop="demand", cualquier cambio de opciones pide un fotograma
  const key = JSON.stringify(p);
  useEffect(() => invalidate(), [key, atlas, invalidate]);

  // prioridad 1: R3F deja de renderizar por su cuenta y lo hacemos aquí
  useFrame(({ scene, camera, clock }) => {
    const o = ref.current;
    const u = fx.material.uniforms;
    const dpr = gl.getPixelRatio();
    gl.getDrawingBufferSize(fx.size);
    // la escena se dibuja a la resolución que el filtro llega a leer (guía §22.1): con celdas de 3 px a dpr 2, ~1/3 por lado
    const cellPx = Math.max(2, o.cellSize) * dpr;
    const pixPx = Math.max(1, o.pixelSize) * dpr;
    const auto = o.mode === "pixel" ? 2 / pixPx : o.mode === "ascii" ? 3 / cellPx : Math.max(3 / cellPx, 2 / pixPx);
    const k = Math.min(1, Math.max(0.05, o.sceneScale > 0 ? o.sceneScale : auto));
    const tw = Math.max(1, Math.round(fx.size.x * k));
    const th = Math.max(1, Math.round(fx.size.y * k));
    if (fx.target.width !== tw || fx.target.height !== th) fx.target.setSize(tw, th);

    u.tGlyph.value = atlas.texture;
    u.uRes.value.copy(fx.size);
    u.uTime.value = clock.elapsedTime;
    u.uMode.value = RETRO_MODES[o.mode];
    u.uTint.value = RETRO_TINTS[o.tint];
    u.uCell.value = Math.max(2, o.cellSize) * dpr;
    u.uCellAspect.value = o.cellAspect;
    u.uGlyphs.value = atlas.count;
    u.uPixel.value = Math.max(1, o.pixelSize) * dpr;
    u.uLevels.value = Math.max(2, Math.round(o.levels));
    u.uDither.value = o.dither;
    u.uContrast.value = o.contrast;
    u.uBright.value = o.brightness;
    u.uInvert.value = o.invert ? 1 : 0;
    u.uScan.value = o.scanlines;
    u.uScanPeriod.value = Math.max(1, o.scanlineSize) * dpr;
    u.uRoll.value = o.scanlineRoll;
    u.uVig.value = o.vignette;
    u.uCurve.value = o.curvature;
    u.uNoise.value = o.noise;
    u.uFlicker.value = o.flicker;
    u.uDitherKind.value = RETRO_DITHERS[o.ditherPattern];
    u.uGlitch.value = o.glitch;
    u.uAberr.value = o.aberration;
    u.uGlow.value = o.glow;
    u.uRain.value = o.rain;

    gl.setRenderTarget(fx.target);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.render(fx.scene, fx.camera);
  }, 1);

  return null;
}

function stripUndefined<T extends object>(o: T): Partial<T> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<T>;
}
