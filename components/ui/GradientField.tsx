"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { useTokens } from "@/lib/ui/useTokens";

export const GRADIENT_KINDS = ["mesh", "ribbon", "beams"] as const;
export type GradientKind = (typeof GRADIENT_KINDS)[number];

export type GradientFieldProps = {
  /** `mesh`: manchas de color que se mezclan despacio · `ribbon`: cinta iridiscente en diagonal (Stripe) · `beams`: haces de luz en diagonal (Raycast) */
  kind?: GradientKind;
  /** velocidad del movimiento (0 = quieto) */
  speed?: number;
  /** fuerza del color sobre el fondo del tema */
  intensity?: number;
  /** grano fino encima (quita las bandas del degradado en pantallas de 8 bits) */
  grain?: boolean;
  /** absolute (por defecto) = rellena su contenedor · fixed = cubre la ventana */
  position?: "absolute" | "fixed";
  className?: string;
};

const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

// Las tres escenas comparten cabecera: fondo (u_c0) y dos acentos del tema (u_c1, u_c2)
const HEAD = `precision mediump float;uniform vec2 u_res;uniform float u_t;uniform float u_k;uniform float u_grain;uniform vec3 u_c0;uniform vec3 u_c1;uniform vec3 u_c2;
float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}`;

const FRAG: Record<GradientKind, string> = {
  mesh: `${HEAD}
void main(){vec2 uv=gl_FragCoord.xy/u_res;vec2 q=vec2(uv.x*u_res.x/u_res.y,uv.y);float ar=u_res.x/u_res.y;vec3 col=u_c0;
for(int i=0;i<4;i++){float f=float(i);vec2 c=vec2(ar*(.5+.38*sin(u_t*(.21+f*.07)+f*1.9)),.5+.36*cos(u_t*(.17+f*.05)+f*2.7));
float w=exp(-dot(q-c,q-c)*(2.2+f*.6));vec3 ci=mod(f,2.)<1.?u_c1:u_c2;col=mix(col,ci,w*u_k);}
col+=(h(gl_FragCoord.xy+u_t)-.5)*u_grain;gl_FragColor=vec4(col,1.);}`,
  ribbon: `${HEAD}
void main(){vec2 uv=gl_FragCoord.xy/u_res;float a=-.55;vec2 r=mat2(cos(a),-sin(a),sin(a),cos(a))*(uv-.5)+.5;float x=r.x;
float c=.52+.2*sin(x*2.6+u_t*.35)+.07*sin(x*6.3-u_t*.27);float w=.16+.07*sin(x*1.7+u_t*.2);float d=(r.y-c)/w;float band=exp(-d*d*1.6);
vec3 g=mix(u_c1,u_c2,.5+.5*sin(x*3.4+d*1.2+u_t*.45));g=mix(g,mix(u_c1,vec3(1.),.6),.35*smoothstep(.55,1.,.5+.5*sin(d*5.+x*9.+u_t*.8)));
vec3 col=mix(u_c0,g,band*u_k);col+=(h(gl_FragCoord.xy+u_t)-.5)*u_grain;gl_FragColor=vec4(col,1.);}`,
  beams: `${HEAD}
void main(){vec2 p=(gl_FragCoord.xy-.5*u_res)/u_res.y;float u=(p.x+p.y)*3.2;float along=(p.x-p.y);float id=floor(u+u_t*.04);
float f=abs(fract(u+u_t*.04)-.5);float core=smoothstep(.32,.02,f);float glow=smoothstep(.5,.0,f);
float len=.55+.3*sin(id*1.7+u_t*.25);float m=smoothstep(len,len-.45,abs(along+.18*sin(id*2.3+u_t*.3)));
float rad=exp(-dot(p,p)*1.6);float k=m*rad*u_k;vec3 col=u_c0;col=mix(col,u_c1*.55,glow*k*.6);col=mix(col,u_c1,core*k);col+=u_c2*pow(core,6.)*k*.25;
col+=(h(gl_FragCoord.xy+u_t)-.5)*u_grain;gl_FragColor=vec4(col,1.);}`,
};

/** Color CSS cualquiera (hex, rgb, color-mix…) → RGB 0–1, con el propio navegador como intérprete. */
function rgb(css: string, fallback: [number, number, number]): [number, number, number] {
  if (!css) return fallback;
  const c = document.createElement("canvas").getContext("2d");
  if (!c) return fallback;
  c.fillStyle = "#000";
  c.fillStyle = css;
  c.fillRect(0, 0, 1, 1);
  const [r, g, b] = c.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

/**
 * Fondo de color en WebGL con tres escenas: manchas que se mezclan (`mesh`), la cinta iridiscente de Stripe (`ribbon`) y los
 * haces de luz en diagonal de Raycast (`beams`). Los colores son los del tema (`--bg`, `--acc`, `--acc2`) y cambian con él.
 * Sin dependencias (WebGL 1 a pelo, un triángulo a pantalla completa), a media resolución (es un degradado: no se nota) y
 * pausado fuera de pantalla o con la pestaña oculta. Sin WebGL queda un degradado CSS; con movimiento reducido, un fotograma fijo.
 */
export default function GradientField({ kind = "mesh", speed = 1, intensity = 1, grain = true, position = "absolute", className = "" }: GradientFieldProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const tokens = useTokens(wrap);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = cv.current;
    const host = wrap.current;
    if (!canvas || !host || !tokens) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: "low-power" });
    if (!gl) return;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG[kind] ?? FRAG.mesh));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    gl.uniform3fv(U("u_c0"), rgb(tokens["--bg"], [0, 0, 0]));
    gl.uniform3fv(U("u_c1"), rgb(tokens["--acc"], [0.5, 0.7, 1]));
    gl.uniform3fv(U("u_c2"), rgb(tokens["--acc2"], [1, 0.5, 0.7]));
    gl.uniform1f(U("u_k"), intensity);
    gl.uniform1f(U("u_grain"), grain ? 0.035 : 0);
    const uRes = U("u_res");
    const uT = U("u_t");

    const still = reduced || speed <= 0;
    const t0 = 12; // un fotograma con las formas ya repartidas
    const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.5;
    const resize = () => {
      const w = Math.max(1, Math.round(host.clientWidth * scale));
      const h = Math.max(1, Math.round(host.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      // siempre: al cambiar de escena el lienzo (y su tamaño) se reutiliza, pero el programa es nuevo y no tiene u_res
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (still) draw(t0);
    });
    ro.observe(host);

    let raf = 0;
    let visible = true;
    let last = performance.now();
    let t = t0;
    const draw = (time: number) => {
      gl.uniform1f(uT, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      host.setAttribute("data-gl", "");
    };
    const loop = (now: number) => {
      raf = 0;
      t += ((now - last) / 1000) * speed;
      last = now;
      draw(t);
      if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (still || raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    draw(t0);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(host);
    const onVis = () => start();
    document.addEventListener("visibilitychange", onVis);
    start();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [kind, speed, intensity, grain, reduced, tokens]);

  return (
    <div ref={wrap} className={`ui-gfield ui-gfield--${kind} ${position === "fixed" ? "ui-gfield--fixed" : ""} ${className}`.trim()} style={{ "--gf-k": intensity } as CSSProperties} aria-hidden>
      <canvas ref={cv} />
    </div>
  );
}
