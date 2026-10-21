"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

/**
 * Humo de fluido para el HUD de Ánima: una simulación de fluido incompresible en la GPU («Stable Fluids», el algoritmo de
 * Pavel Dobryakov que explica el tutorial de Bandinopla, docs/21), en WebGL2 sin three. Cada campo es una textura con doble
 * búfer (velocidad, color, presión) y cada paso, una pasada de pantalla completa: inyectar, remolinos (curl), refuerzo de
 * remolinos (vorticity confinement), divergencia, presión (Jacobi), restar el gradiente y transportar (advección
 * semilagrangiana). Los emisores rodean el círculo del HUD con una forma y un color por acto (`SMOKES`); el ratón arrastra
 * el humo. Sin WebGL2 con texturas de coma flotante renderizables, o con movimiento reducido, no pinta.
 */

export type SmokeKind = "niebla" | "ecto" | "disco" | "bengala" | "vapor";
/** Lo que pide el scroll: tipo de humo, intensidad de emisión (0–1), centro y radio del HUD en px del lienzo. */
export type SmokeState = { kind: SmokeKind; a: number; cx: number; cy: number; r: number };

type V3 = [number, number, number];
type Preset = {
  /** forma de emisión */
  mode: "suelo" | "anillo" | "golpes" | "sube";
  colors: V3[];
  /** cuánto tarda en desaparecer el humo y en frenarse el movimiento (más = antes) */
  density: number;
  velocity: number;
  /** intensidad de los remolinos */
  curl: number;
  /** tamaño del «pincel» (fracción del alto, al cuadrado) */
  radius: number;
  /** velocidad de salida (fracción del alto por segundo) */
  speed: number;
  /** pinceladas por segundo */
  rate: number;
};

export const SMOKES: Record<SmokeKind, Preset> = {
  // 01 la puerta: niebla baja y fría que se arrastra de lado por debajo de la calavera
  niebla: { mode: "suelo", colors: [[0.2, 0.23, 0.3], [0.16, 0.19, 0.26]], density: 0.35, velocity: 0.25, curl: 10, radius: 0.004, speed: 0.12, rate: 40 },
  // 02 el pasaje: ectoplasma verde que gira alrededor del círculo
  ecto: { mode: "anillo", colors: [[0.05, 0.42, 0.18], [0.12, 0.55, 0.3]], density: 0.9, velocity: 0.3, curl: 38, radius: 0.0016, speed: 0.32, rate: 70 },
  // 03 la pista: bocanadas de colores a golpes, como un cañón de humo de discoteca
  disco: { mode: "golpes", colors: [[0.45, 0.06, 0.7], [0.75, 0.05, 0.38], [0.05, 0.45, 0.7]], density: 1.1, velocity: 0.5, curl: 26, radius: 0.0022, speed: 0.9, rate: 2.2 },
  // 04 el concurso: bengala roja y naranja que sube
  bengala: { mode: "sube", colors: [[0.85, 0.2, 0.03], [0.75, 0.06, 0.04]], density: 0.95, velocity: 0.35, curl: 20, radius: 0.0018, speed: 0.45, rate: 60 },
  // 05 la cena: vapor cálido, suave, de una olla
  vapor: { mode: "sube", colors: [[0.34, 0.3, 0.26], [0.28, 0.25, 0.22]], density: 0.7, velocity: 0.4, curl: 7, radius: 0.0035, speed: 0.22, rate: 30 },
};

const VERT = `#version 300 es
in vec2 aPos; uniform vec2 texelSize; out vec2 vUv, vL, vR, vT, vB;
void main(){ vUv = aPos * 0.5 + 0.5; vL = vUv - vec2(texelSize.x, 0.0); vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y); vB = vUv - vec2(0.0, texelSize.y); gl_Position = vec4(aPos, 0.0, 1.0); }`;
const HEAD = `#version 300 es
precision highp float; precision highp sampler2D; in vec2 vUv, vL, vR, vT, vB; out vec4 o;
`;
const FRAG = {
  splat: `uniform sampler2D uTarget; uniform float aspect, radius; uniform vec3 color; uniform vec2 point;
    void main(){ vec2 p = vUv - point; p.x *= aspect; o = vec4(texture(uTarget, vUv).xyz + exp(-dot(p, p) / radius) * color, 1.0); }`,
  advect: `uniform sampler2D uVelocity, uSource; uniform vec2 velTexel; uniform float dt, dissipation;
    void main(){ vec2 c = vUv - dt * texture(uVelocity, vUv).xy * velTexel; o = texture(uSource, c) / (1.0 + dissipation * dt); }`,
  curl: `uniform sampler2D uVelocity;
    void main(){ float L = texture(uVelocity, vL).y, R = texture(uVelocity, vR).y, T = texture(uVelocity, vT).x, B = texture(uVelocity, vB).x;
      o = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0); }`,
  vorticity: `uniform sampler2D uVelocity, uCurl; uniform float curl, dt;
    void main(){ float L = texture(uCurl, vL).x, R = texture(uCurl, vR).x, T = texture(uCurl, vT).x, B = texture(uCurl, vB).x, C = texture(uCurl, vUv).x;
      vec2 f = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L)); f /= length(f) + 0.0001; f *= curl * C; f.y *= -1.0;
      vec2 v = texture(uVelocity, vUv).xy + f * dt; o = vec4(clamp(v, -1000.0, 1000.0), 0.0, 1.0); }`,
  divergence: `uniform sampler2D uVelocity;
    void main(){ float L = texture(uVelocity, vL).x, R = texture(uVelocity, vR).x, T = texture(uVelocity, vT).y, B = texture(uVelocity, vB).y;
      vec2 C = texture(uVelocity, vUv).xy;
      if (vL.x < 0.0) L = -C.x; if (vR.x > 1.0) R = -C.x; if (vT.y > 1.0) T = -C.y; if (vB.y < 0.0) B = -C.y;
      o = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0); }`,
  scale: `uniform sampler2D uTexture; uniform float value; void main(){ o = value * texture(uTexture, vUv); }`,
  pressure: `uniform sampler2D uPressure, uDivergence;
    void main(){ float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x, T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
      o = vec4((L + R + B + T - texture(uDivergence, vUv).x) * 0.25, 0.0, 0.0, 1.0); }`,
  gradient: `uniform sampler2D uPressure, uVelocity;
    void main(){ float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x, T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
      vec2 v = texture(uVelocity, vUv).xy - vec2(R - L, T - B); o = vec4(v, 0.0, 1.0); }`,
  // a pantalla: el color es luz (humo iluminado); alfa = su canal más alto, con una curva suave para que no sature
  display: `uniform sampler2D uTexture;
    void main(){ vec3 c = 1.0 - exp(-texture(uTexture, vUv).rgb * 1.6); float a = clamp(max(c.r, max(c.g, c.b)) * 1.15, 0.0, 1.0);
      o = vec4(min(c, vec3(a)), a); }`,
};

type Prog = { p: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };
type FBO = { tex: WebGLTexture; fb: WebGLFramebuffer; w: number; h: number };
type Double = { read: FBO; write: FBO; swap: () => void };

export default function FluidSmoke({ state, className = "" }: { state: MutableRefObject<SmokeState>; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = cv.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
    if (!gl || !gl.getExtension("EXT_color_buffer_float")) return;
    const mobile = matchMedia("(max-width: 899px)").matches;
    const SIM = mobile ? 96 : 128, DYE = mobile ? 320 : 512, ITER = mobile ? 12 : 20;

    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const vs = shader(gl.VERTEX_SHADER, VERT);
    const progs: Record<keyof typeof FRAG, Prog> = {} as never;
    for (const [k, src] of Object.entries(FRAG) as [keyof typeof FRAG, string][]) {
      const p = gl.createProgram()!;
      gl.attachShader(p, vs);
      gl.attachShader(p, shader(gl.FRAGMENT_SHADER, HEAD + src));
      gl.bindAttribLocation(p, 0, "aPos");
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return;
      const u: Prog["u"] = {};
      const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS) as number;
      for (let i = 0; i < n; i++) {
        const name = gl.getActiveUniform(p, i)!.name;
        u[name] = gl.getUniformLocation(p, name);
      }
      progs[k] = { p, u };
    }
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const fbo = (w: number, h: number): FBO => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
      const fb = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { tex, fb, w, h };
    };
    const double = (w: number, h: number): Double => {
      const d = { read: fbo(w, h), write: fbo(w, h), swap() { [d.read, d.write] = [d.write, d.read]; } };
      return d;
    };
    const all: FBO[] = [];
    let velocity: Double, dye: Double, pressure: Double, divergence: FBO, curlT: FBO, aspect = 1;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      const k = Math.min(1, devicePixelRatio || 1);
      cv.width = Math.max(1, Math.round(r.width * k));
      cv.height = Math.max(1, Math.round(r.height * k));
      aspect = cv.width / cv.height;
      for (const f of all.splice(0)) { gl.deleteTexture(f.tex); gl.deleteFramebuffer(f.fb); }
      const dims = (base: number) => (aspect >= 1 ? [Math.round(base * aspect), base] : [base, Math.round(base / aspect)]);
      const [sw, sh] = dims(SIM), [dw, dh] = dims(DYE);
      velocity = double(sw, sh); dye = double(dw, dh); pressure = double(sw, sh);
      divergence = fbo(sw, sh); curlT = fbo(sw, sh);
      all.push(velocity.read, velocity.write, dye.read, dye.write, pressure.read, pressure.write, divergence, curlT);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    // una pasada: el programa, sus texturas y uniformes, y a qué destino (null = pantalla)
    let unit = 0;
    const use = (k: keyof typeof FRAG, texel: [number, number]) => {
      const pr = progs[k];
      gl.useProgram(pr.p);
      gl.uniform2f(pr.u.texelSize, texel[0], texel[1]);
      unit = 0;
      return pr;
    };
    const tex = (pr: Prog, name: string, f: FBO) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, f.tex);
      gl.uniform1i(pr.u[name], unit++);
    };
    const blit = (target: FBO | null) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fb : null);
      gl.viewport(0, 0, target ? target.w : cv.width, target ? target.h : cv.height);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const texelOf = (f: FBO): [number, number] => [1 / f.w, 1 / f.h];

    /** una pincelada: punto en uv (0–1, y hacia arriba), velocidad en uv/s, color */
    const splat = (x: number, y: number, vx: number, vy: number, color: V3, radius: number) => {
      const t = texelOf(velocity.read);
      let pr = use("splat", t);
      tex(pr, "uTarget", velocity.read);
      gl.uniform1f(pr.u.aspect, aspect);
      gl.uniform2f(pr.u.point, x, y);
      // en la textura de velocidad, las unidades son celdas por segundo
      gl.uniform3f(pr.u.color, vx * velocity.read.w, vy * velocity.read.h, 0);
      gl.uniform1f(pr.u.radius, radius);
      blit(velocity.write);
      velocity.swap();
      pr = use("splat", texelOf(dye.read));
      tex(pr, "uTarget", dye.read);
      gl.uniform1f(pr.u.aspect, aspect);
      gl.uniform2f(pr.u.point, x, y);
      gl.uniform3f(pr.u.color, color[0], color[1], color[2]);
      gl.uniform1f(pr.u.radius, radius);
      blit(dye.write);
      dye.swap();
    };

    const step = (dt: number, p: Preset) => {
      const t = texelOf(velocity.read);
      let pr = use("curl", t);
      tex(pr, "uVelocity", velocity.read);
      blit(curlT);
      pr = use("vorticity", t);
      tex(pr, "uVelocity", velocity.read);
      tex(pr, "uCurl", curlT);
      gl.uniform1f(pr.u.curl, p.curl);
      gl.uniform1f(pr.u.dt, dt);
      blit(velocity.write);
      velocity.swap();
      pr = use("divergence", t);
      tex(pr, "uVelocity", velocity.read);
      blit(divergence);
      pr = use("scale", t);
      tex(pr, "uTexture", pressure.read);
      gl.uniform1f(pr.u.value, 0.8);
      blit(pressure.write);
      pressure.swap();
      pr = use("pressure", t);
      for (let i = 0; i < ITER; i++) {
        unit = 0;
        tex(pr, "uPressure", pressure.read);
        tex(pr, "uDivergence", divergence);
        blit(pressure.write);
        pressure.swap();
      }
      pr = use("gradient", t);
      tex(pr, "uPressure", pressure.read);
      tex(pr, "uVelocity", velocity.read);
      blit(velocity.write);
      velocity.swap();
      pr = use("advect", t);
      tex(pr, "uVelocity", velocity.read);
      tex(pr, "uSource", velocity.read);
      gl.uniform2f(pr.u.velTexel, t[0], t[1]);
      gl.uniform1f(pr.u.dt, dt);
      gl.uniform1f(pr.u.dissipation, p.velocity);
      blit(velocity.write);
      velocity.swap();
      pr = use("advect", texelOf(dye.read));
      tex(pr, "uVelocity", velocity.read);
      tex(pr, "uSource", dye.read);
      gl.uniform2f(pr.u.velTexel, t[0], t[1]);
      gl.uniform1f(pr.u.dt, dt);
      gl.uniform1f(pr.u.dissipation, p.density);
      blit(dye.write);
      dye.swap();
    };

    // emisión según la forma del humo, alrededor del HUD (todo en uv: y hacia arriba; el radio, en fracción del alto)
    let acc = 0, beat = 0, hue = 0;
    const emit = (dt: number, s: SmokeState, p: Preset) => {
      const cx = s.cx / cv.clientWidth, cy = 1 - s.cy / cv.clientHeight, R = s.r / cv.clientHeight;
      const ax = 1 / aspect; // un desplazamiento horizontal de R (en alto) en uv
      // en móvil el lienzo es pequeño y el humo se acumula antes: la mitad de color
      const col = (i: number, k: number): V3 => p.colors[i % p.colors.length].map((c) => c * k * s.a * (mobile ? 0.5 : 1)) as V3;
      if (p.mode === "golpes") {
        beat += dt * p.rate;
        if (beat >= 1) {
          beat -= 1;
          hue++;
          for (let i = 0; i < 9; i++) {
            const ang = (i / 9) * Math.PI * 2 + hue * 0.7;
            const dx = Math.cos(ang), dy = Math.sin(ang);
            splat(cx + dx * R * ax, cy + dy * R, dx * p.speed * ax, dy * p.speed, col(hue, 1.4), p.radius);
          }
        }
        return;
      }
      acc += dt * p.rate * Math.max(0.15, s.a);
      while (acc >= 1) {
        acc -= 1;
        const i = Math.floor(Math.random() * 1000);
        if (p.mode === "anillo") {
          const ang = Math.random() * Math.PI * 2, dx = Math.cos(ang), dy = Math.sin(ang);
          // tangencial (gira) y algo hacia fuera
          splat(cx + dx * R * 1.02 * ax, cy + dy * R * 1.02, (-dy * 0.9 + dx * 0.35) * p.speed * ax, (dx * 0.9 + dy * 0.35) * p.speed, col(i, 0.5), p.radius);
        } else if (p.mode === "sube") {
          // del arco de abajo del círculo, hacia arriba con algo de dispersión
          const ang = Math.PI * (1.15 + Math.random() * 0.7), dx = Math.cos(ang), dy = Math.sin(ang);
          splat(cx + dx * R * ax, cy + dy * R, (Math.random() - 0.5) * 0.25 * p.speed * ax, p.speed * (0.7 + Math.random() * 0.6), col(i, 0.45), p.radius);
        } else {
          // suelo: una franja bajo la calavera, de lado
          const side = Math.random() < 0.5 ? -1 : 1;
          const x = cx + (Math.random() * 2 - 1) * R * 1.9 * ax, y = cy - R * (0.75 + Math.random() * 0.35);
          splat(x, y, side * p.speed * ax, p.speed * 0.15, col(i, 0.55), p.radius);
        }
      }
    };

    // el ratón arrastra el humo
    let last: { x: number; y: number } | null = null;
    const onMove = (e: PointerEvent) => {
      const s = state.current;
      const r = cv.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = 1 - (e.clientY - r.top) / r.height;
      if (last && s.a > 0.05 && x >= 0 && x <= 1 && y >= 0 && y <= 1) {
        const p = SMOKES[s.kind];
        const dx = x - last.x, dy = y - last.y;
        if (Math.abs(dx) + Math.abs(dy) > 0.0005) splat(x, y, dx * 18, dy * 18, p.colors[0].map((c) => c * 0.35 * s.a) as V3, p.radius * 0.7);
      }
      last = { x, y };
    };
    addEventListener("pointermove", onMove, { passive: true });

    let raf = 0, prev = performance.now(), idle = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.033, (now - prev) / 1000);
      prev = now;
      const s = state.current, p = SMOKES[s.kind] ?? SMOKES.niebla;
      // sin emisión durante un rato, el humo ya se ha ido: no se simula
      idle = s.a > 0.01 ? 0 : idle + dt;
      if (idle > 4) return;
      if (s.a > 0.01) emit(dt, s, p);
      step(dt, p);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ZERO);
      const pr = use("display", [0, 0]);
      tex(pr, "uTexture", dye.read);
      blit(null);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      removeEventListener("pointermove", onMove);
      for (const f of all) { gl.deleteTexture(f.tex); gl.deleteFramebuffer(f.fb); }
      for (const k of Object.keys(progs) as (keyof typeof FRAG)[]) gl.deleteProgram(progs[k].p);
      gl.deleteBuffer(buf);
    };
  }, [state]);
  return <canvas ref={ref} className={`an-smoke ${className}`.trim()} aria-hidden />;
}
