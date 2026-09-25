/**
 * Shader de post-proceso retro: convierte la escena 3D (ya renderizada a textura) en pixel art, ASCII o ambos, y encima
 * le pone el acabado de monitor CRT (scanlines, viñeta, curvatura, ruido, glitch, aberración). Una sola pasada a pantalla completa.
 *
 * Los cálculos se hacen en espacio lineal (el que usa three) y la luminosidad se pasa a perceptual (gamma 2.2) antes de
 * elegir glifo o nivel de paleta, para que las rampas de caracteres se vean parejas.
 */

export const RETRO_MODES = { pixel: 0, ascii: 1, both: 2 } as const;
export const RETRO_DITHERS = { bayer: 0, hatch: 1, halftone: 2, noise: 3 } as const;
export const RETRO_TINTS = { mono: 0, scene: 1, gradient: 2 } as const;

export const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
uniform sampler2D tScene;
uniform sampler2D tGlyph;
uniform vec2 uRes;
uniform float uTime;
uniform int uMode;
uniform int uTint;
uniform int uDitherKind;
uniform float uCell;
uniform float uCellAspect;
uniform float uGlyphs;
uniform float uPixel;
uniform float uLevels;
uniform float uDither;
uniform float uContrast;
uniform float uBright;
uniform float uInvert;
uniform float uScan;
uniform float uScanPeriod;
uniform float uRoll;
uniform float uVig;
uniform float uCurve;
uniform float uNoise;
uniform float uFlicker;
uniform float uGlitch;
uniform float uAberr;
uniform float uGlow;
uniform float uRain;
uniform vec3 uFg;
uniform vec3 uBg;
uniform vec3 uAcc;
varying vec2 vUv;

float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
float perceptual(vec3 c) { return pow(clamp(luma(c), 0.0, 1.0), 1.0 / 2.2); }
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float bayer(vec2 p) {
  const float m[16] = float[16](0.0, 8.0, 2.0, 10.0, 12.0, 4.0, 14.0, 6.0, 3.0, 11.0, 1.0, 9.0, 15.0, 7.0, 13.0, 5.0);
  vec2 q = mod(floor(p), 4.0);
  return (m[int(q.x) + int(q.y) * 4] + 0.5) / 16.0;
}

/** umbral de dither en [0,1) según el patrón: bayer 4x4, trama diagonal, punto de semitono o ruido */
float threshold(vec2 p, float t) {
  if (uDitherKind == 1) return fract((p.x + p.y) * 0.25 + 0.5 * step(2.0, mod(p.y, 4.0)));
  if (uDitherKind == 2) { vec2 q = fract(p * 0.25) - 0.5; return clamp(length(q) * 1.6, 0.0, 1.0); }
  if (uDitherKind == 3) return hash(p + floor(t * 12.0));
  return bayer(p);
}

vec3 sceneAt(vec2 px) { return texture2D(tScene, clamp(px / uRes, 0.0, 1.0)).rgb; }

/** contraste, brillo e inversión sobre una luminosidad perceptual */
float grade(float l) {
  l = (l - 0.5) * uContrast + 0.5 + uBright;
  l = clamp(l, 0.0, 1.0);
  return mix(l, 1.0 - l, uInvert);
}

/** rampa de color según el tinte: mono (bg→fg), scene (color de la escena), gradient (bg→acc→fg) */
vec3 ramp(float l, vec3 sceneCol) {
  if (uTint == 1) {
    vec3 s = sceneCol / max(max(sceneCol.r, max(sceneCol.g, sceneCol.b)), 0.04);
    return mix(uBg, s, l);
  }
  if (uTint == 2) return l < 0.5 ? mix(uBg, uAcc, l * 2.0) : mix(uAcc, uFg, l * 2.0 - 1.0);
  return mix(uBg, uFg, l);
}

/** color de la escena en la posición de pantalla \`frag\` (px de dispositivo), ya convertido a pixel art / ASCII */
vec3 shade(vec2 frag) {
  vec3 col = uBg;

  // ---- pixel art: bloques + posterizado con dither ----
  vec3 pix = uBg;
  if (uMode != 1) {
    vec2 pc = (floor(frag / uPixel) + 0.5) * uPixel;
    vec3 s = sceneAt(pc);
    float l = grade(perceptual(s));
    float steps = max(uLevels - 1.0, 1.0);
    float lq = clamp(floor(l * steps + threshold(floor(frag / uPixel), uTime) * uDither + 0.5 * (1.0 - uDither)) / steps, 0.0, 1.0);
    vec3 sq = pow(clamp(floor(pow(s, vec3(1.0 / 2.2)) * steps + 0.5) / steps, 0.0, 1.0), vec3(2.2));
    pix = uTint == 1 ? sq : ramp(lq, s);
  }

  // ---- ascii: un glifo del atlas por celda, elegido por la luminosidad media de la celda ----
  if (uMode != 0) {
    vec2 cell = vec2(uCell, uCell * uCellAspect);
    vec2 id = floor(frag / cell);
    vec2 loc = fract(frag / cell);
    vec2 c0 = (id + 0.5) * cell;
    vec3 s = sceneAt(c0) * 0.36
      + sceneAt(c0 + cell * vec2(0.25, 0.25)) * 0.16
      + sceneAt(c0 + cell * vec2(-0.25, 0.25)) * 0.16
      + sceneAt(c0 + cell * vec2(0.25, -0.25)) * 0.16
      + sceneAt(c0 + cell * vec2(-0.25, -0.25)) * 0.16;
    float l = grade(perceptual(s));

    // lluvia de código: cada columna tiene su velocidad y una cabeza brillante con estela
    float trail = 0.0;
    if (uRain > 0.0) {
      float rows = uRes.y / cell.y;
      float h = hash(vec2(id.x, 7.0));
      float d = fract(uTime * (0.12 + h * 0.3) + h * 9.0 - (rows - 1.0 - id.y) / rows);
      trail = step(1.0 - (0.1 + uRain * 0.3), hash(vec2(id.x, 3.0))) * exp(-d * 9.0) * (d < 0.5 ? 1.0 : 0.0);
      trail = trail < 0.12 ? 0.0 : trail;
      l = max(l, trail * uRain * (0.45 + 0.55 * hash(id + floor(uTime * 9.0))));
    }

    l = clamp(l + (threshold(id, uTime) - 0.5) * uDither / uGlyphs, 0.0, 1.0);
    float idx = floor(l * (uGlyphs - 1.0) + 0.5);
    vec2 gu = vec2((idx + clamp(loc.x, 0.01, 0.99)) / uGlyphs, clamp(loc.y, 0.01, 0.99));
    float mask = texture2D(tGlyph, gu).r;
    vec3 ink = ramp(max(l, 0.35), s);
    ink = mix(ink, uAcc * 1.6 + 0.15, clamp(trail * uRain, 0.0, 1.0));

    // glow de fósforo: halo suave alrededor de las celdas encendidas
    float halo = exp(-length((loc - 0.5) * 2.0) * 2.2) * l * uGlow;
    vec3 base = uMode == 1 ? uBg : pix * 0.4;
    col = mix(base, ink, mask) + ink * halo * (1.0 - mask);
  } else {
    col = pix;
  }
  return col;
}

void main() {
  // curvatura de tubo: deforma las coordenadas y deja negro lo que queda fuera
  vec2 uv = vUv;
  vec2 cc = uv * 2.0 - 1.0;
  cc += cc * dot(cc, cc) * uCurve * 0.22;
  uv = cc * 0.5 + 0.5;
  float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  vec2 frag = uv * uRes;

  // glitch: bandas horizontales que se desplazan a saltos
  if (uGlitch > 0.0) {
    float band = floor(uv.y * 24.0);
    float tick = floor(uTime * 7.0);
    if (hash(vec2(band, tick)) > 1.0 - uGlitch * 0.35) frag.x += (hash(vec2(tick, band)) - 0.5) * uRes.x * 0.12 * uGlitch;
  }

  vec3 col;
  if (uAberr > 0.0) {
    // aberración cromática: los canales rojo y azul se leen desplazados
    vec2 o = vec2(uAberr * uRes.x * 0.006, 0.0);
    col = vec3(shade(frag - o).r, shade(frag).g, shade(frag + o).b);
  } else {
    col = shade(frag);
  }

  // ---- acabado CRT ----
  float sl = 0.5 + 0.5 * sin(frag.y / uScanPeriod * 6.2831853);
  col *= 1.0 - uScan * (1.0 - smoothstep(0.0, 1.0, sl));
  float d = fract(uv.y + uTime * 0.07);
  col *= 1.0 + uRoll * 0.4 * smoothstep(0.0, 0.12, d) * (1.0 - smoothstep(0.12, 0.42, d));
  col *= 1.0 - uVig * smoothstep(0.35, 1.3, length(cc * vec2(0.9, 1.0)));
  col += (hash(frag + fract(uTime) * 91.7) - 0.5) * uNoise;
  col *= 1.0 + (hash(vec2(floor(uTime * 24.0), 3.0)) - 0.5) * uFlicker;

  gl_FragColor = vec4(max(col, 0.0) * inside, 1.0);
  #include <colorspace_fragment>
}
`;
