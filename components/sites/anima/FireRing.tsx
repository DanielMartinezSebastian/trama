"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

/** Lo que el scroll le pide al anillo: radio (fracción de la mitad del lienzo), intensidad (0–1) y rojo (0 = fuego, 1 = sangre). */
export type FireState = { r: number; a: number; red: number };

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

// Eclipse de fuego: disco oscuro con borde incandescente, llamas de ruido fractal en coordenadas polares que suben, rayos
// finos que parpadean, chispas que salen hacia fuera y humo que deriva hacia arriba. Salida con alfa premultiplicado.
const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uT, uR, uA, uRed;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; } return v; }
vec3 fire(float k){
  vec3 deep = mix(vec3(0.45, 0.03, 0.0), vec3(0.5, 0.0, 0.02), uRed);
  vec3 mid  = mix(vec3(1.0, 0.32, 0.02), vec3(1.0, 0.08, 0.05), uRed);
  vec3 hot  = mix(vec3(1.0, 0.82, 0.35), vec3(1.0, 0.55, 0.4), uRed);
  return k < 0.5 ? mix(deep, mid, k * 2.0) : mix(mid, mix(hot, vec3(1.0), (k - 0.75) * 2.0 * step(0.75, k)), (k - 0.5) * 2.0);
}
void main(){
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / min(uRes.x, uRes.y);
  float d = length(uv), ang = atan(uv.y, uv.x);
  float x = d - uR;                       // distancia por fuera del borde
  vec2 dir = vec2(cos(ang), sin(ang));    // sin costura en el ángulo
  // llamas: ruido sobre la dirección, desplazado hacia fuera con el tiempo
  float n = fbm(dir * 3.2 + vec2(0.0, -uT * 0.55) + d * 3.5 - uT * 0.25);
  float n2 = fbm(dir * 7.0 - vec2(uT * 0.3, 0.0) + d * 6.0);
  float h = uR * (0.12 + 0.75 * pow(n * n2 * 1.8, 1.4));
  float flame = x > 0.0 ? pow(clamp(1.0 - x / h, 0.0, 1.0), 1.6) : 0.0;
  float rim = exp(-abs(x) / (uR * 0.018)) + (x > 0.0 ? 0.6 * exp(-x / (uR * 0.06)) : 0.0);
  // rayos: franjas angulares finas que se apagan con la distancia y parpadean
  float bins = 90.0, a = (ang / 6.2831853 + 0.5) * bins, id = floor(a);
  float on = step(0.72, hash(vec2(id, floor(uT * 5.0 + hash(vec2(id, 3.0)) * 5.0))));
  float len = uR * (0.3 + 1.1 * hash(vec2(id, 7.0)));
  float ray = on * (1.0 - smoothstep(0.0, 0.5, abs(fract(a) - 0.5) * (1.0 + x * 8.0))) * (x > 0.0 ? exp(-x / len) : 0.0);
  // chispas: celdas polares que avanzan hacia fuera
  vec2 cell = vec2(floor(a * 0.5), floor((x - uT * 0.12) * 40.0));
  float sp = step(0.985, hash(cell)) * (x > 0.0 ? exp(-x / (uR * 0.9)) : 0.0);
  float sx = fract((x - uT * 0.12) * 40.0); sp *= (1.0 - smoothstep(0.0, 0.5, abs(sx - 0.5))) * (1.0 - smoothstep(0.0, 0.5, abs(fract(a * 0.5) - 0.5)));
  // humo: ruido que sube despacio, gris, por fuera de las llamas
  float sm = fbm(uv * 2.2 + vec2(0.0, -uT * 0.18)) * fbm(uv * 4.0 - vec2(uT * 0.05, uT * 0.22));
  float smoke = sm * smoothstep(0.02, uR * 0.35, x) * (1.0 - smoothstep(uR * 0.4, uR * 1.6, x)) * (0.6 + 0.4 * uv.y / max(d, 0.001));
  // halo de calor: un resplandor ancho y suave por fuera de las llamas
  float glow = x > 0.0 ? 0.32 * exp(-x / (uR * 0.22)) : 0.0;
  float heat = clamp(flame * (0.6 + 0.7 * n) + rim * 0.9 + ray * 0.7 + sp * 1.3 + glow, 0.0, 1.0);
  float alpha = heat;
  vec3 col = fire(heat) * alpha;          // premultiplicado: el color nunca pasa del alfa
  // el disco: oscuro y semitransparente (el eclipse), por detrás de la calavera
  float disc = (1.0 - smoothstep(-uR * 0.04, 0.0, x)) * 0.55;
  vec3 smokeCol = vec3(0.22, 0.17, 0.16) * smoke * 2.0;
  float sa = clamp(smoke * 1.8, 0.0, 0.7) * (1.0 - alpha);
  col += smokeCol * (1.0 - alpha);
  alpha = alpha + sa + disc * (1.0 - alpha - sa);
  alpha = clamp(alpha, 0.0, 1.0);
  gl_FragColor = vec4(min(col, vec3(alpha)) * uA, alpha * uA);
}`;

/**
 * El HUD de Ánima: un eclipse de fuego en WebGL (sin three). Pinta solo si hay intensidad; con movimiento reducido, quieto.
 * `state` lo rellena el bucle de scroll de la portada.
 */
export default function FireRing({ state, className = "" }: { state: MutableRefObject<FireState>; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    const gl = cv?.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!cv || !gl) return;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes"), uT = u("uT"), uR = u("uR"), uA = u("uA"), uRed = u("uRed");
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // resolución moderada: el fuego es blando y así cuesta poco (también en móvil)
    const size = () => {
      const r = cv.getBoundingClientRect();
      const k = Math.min(1, 720 / Math.max(1, r.width)) * Math.min(1.5, devicePixelRatio || 1);
      cv.width = Math.max(1, Math.round(r.width * k));
      cv.height = Math.max(1, Math.round(r.height * k));
      gl.viewport(0, 0, cv.width, cv.height);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(cv);
    let raf = 0, cleared = false;
    const t0 = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const s = state.current;
      if (s.a < 0.005) {
        if (!cleared) {
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          cleared = true;
        }
        return;
      }
      cleared = false;
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform1f(uT, still ? 3 : (now - t0) / 1000);
      gl.uniform1f(uR, s.r);
      gl.uniform1f(uA, s.a);
      gl.uniform1f(uRed, s.red);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      // sin loseContext(): en desarrollo (StrictMode) el efecto se repite sobre el mismo <canvas>, y un contexto perdido
      // se queda perdido (se pinta en blanco). Basta con soltar el programa y el búfer
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [state]);
  return <canvas ref={ref} className={`an-fire ${className}`.trim()} aria-hidden />;
}
