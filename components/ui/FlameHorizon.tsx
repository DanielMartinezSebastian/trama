"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { useTokens } from "@/lib/ui/useTokens";

export type FlameHorizonProps = {
  /** contenido encima (titular, texto) */
  children?: ReactNode;
  /**
   * 0–1: la coreografía de meermohsin.me, para atarla al scroll. Hasta 0,45 las llamas suben desde abajo hasta llenarlo
   * todo de rojo; de 0,6 a 1 se invierte: el rojo queda arriba y abajo quedan llamas negras con manos. Sin progress, se
   * queda en `level` e `invert`
   */
  progress?: number;
  /** altura del borde de las llamas (0 = abajo, 1 = arriba), si no hay progress */
  level?: number;
  /** 0 = llamas de color sobre fondo oscuro · 1 = llamas oscuras sobre color, si no hay progress */
  invert?: number;
  /** cuántas manos asoman de las llamas (0 = ninguna) */
  hands?: number;
  /** velocidad de las llamas (0 = quietas) */
  speed?: number;
  /** color de las llamas; por defecto, el --acc del tema */
  color?: string;
  /** alto en px (o cualquier medida CSS); 100% para un fondo */
  height?: number | string;
  /** absolute = rellena su contenedor (fondo) · block = ocupa su sitio con `height` */
  position?: "block" | "absolute";
  className?: string;
};

const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

/*
 * Llamas: un borde que sube con `level`, deformado por ruido fractal estirado en vertical que corre hacia arriba
 * (lenguas), con el color más vivo junto al borde y más hondo abajo, y un halo encima. Manos: siluetas por distancia
 * (antebrazo, palma, cuatro dedos de dos falanges en garra y pulgar), que se mecen y asoman del borde, más arriba
 * cuanto más invertido. Invertir cambia qué es fondo y qué es llama; las manos son siempre oscuras.
 */
const FRAG = `precision highp float;uniform vec2 u_res;uniform float u_t;uniform float u_level;uniform float u_inv;uniform float u_hands;uniform vec3 u_c0;uniform vec3 u_c1;
float h1(float n){return fract(sin(n*127.1)*43758.5453);}
float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*vn(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}
float cap(vec2 p,vec2 a,vec2 b,float r){vec2 pa=p-a,ba=b-a;float k=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*k)-r;}
vec2 rot(vec2 v,float a){float c=cos(a),s=sin(a);return vec2(c*v.x-s*v.y,s*v.x+c*v.y);}
float mano(vec2 p,vec2 base,vec2 punta,float s,float t,float i){
  float d=cap(p,base,punta,.016*s);
  vec2 dir=normalize(punta-base);
  vec2 palma=punta+dir*.012*s;
  d=min(d,length((p-palma)*vec2(1.,1.15))-.022*s);
  float cierra=.35+.35*sin(t*1.3+i*2.1);
  for(int k=0;k<4;k++){
    float fk=float(k);
    vec2 d1=rot(dir,(fk-1.5)*.32);
    vec2 a=palma+d1*.016*s;
    vec2 b=a+d1*.03*s*(1.-abs(fk-1.5)*.12);
    vec2 d2=rot(d1,-cierra*sign(fk-1.5+.01)*.6-cierra*.4);
    vec2 c=b+d2*.024*s;
    d=min(d,min(cap(p,a,b,.0055*s),cap(p,b,c,.0045*s)));
  }
  vec2 dp=rot(dir,1.25);
  d=min(d,cap(p,palma+dp*.014*s,palma+dp*.036*s+dir*.01*s,.006*s));
  return d;
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;float ar=u_res.x/u_res.y;vec2 q=vec2(uv.x*ar,uv.y);
  // lenguas: ruido estirado en vertical que sube; más altas en unas zonas que en otras
  float zona=fbm(vec2(uv.x*2.2,u_t*.05));
  float lenguas=fbm(vec2(q.x*4.,q.y*2.4-u_t*.7))*.26+fbm(vec2(q.x*11.,q.y*4.-u_t*1.3))*.08;
  float borde=u_level-.06+lenguas+zona*.08;
  float dentro=smoothstep(.004,-.004,uv.y-borde);
  // color de la llama: vivo en el borde, hondo abajo; el fondo, oscuro con un halo junto al borde
  vec3 hondo=u_c1*.6;vec3 vivo=min(u_c1*1.25,vec3(1.));
  vec3 llama=mix(hondo,vivo,smoothstep(borde-.45,borde,uv.y));
  vec3 fondo=u_c0+u_c1*.35*exp(-max(uv.y-borde,0.)*14.)*(1.-u_inv);
  // invertido: el rojo arriba (más hondo hacia arriba) y las llamas oscuras
  vec3 arriba=mix(fondo,mix(vivo,hondo,smoothstep(borde,borde+.7,uv.y)),u_inv);
  vec3 abajo=mix(llama,u_c0,u_inv);
  vec3 col=mix(arriba,abajo,dentro);
  // manos que asoman: siluetas oscuras, más fuera cuanto más invertido
  float dm=1e3;
  for(int i=0;i<12;i++){
    float fi=float(i);if(fi>=u_hands)break;
    float x=(fi+.5)/u_hands*ar+(h1(fi+3.)-.5)*.5/u_hands*ar;
    float s=1.7+1.1*h1(fi+11.);
    float sale=mix(.0,.12,u_inv)+.07*h1(fi+7.)+.025*sin(u_t*.9+fi*1.7);
    float lean=(h1(fi+5.)-.5)*.12+.03*sin(u_t*.7+fi);
    vec2 base=vec2(x-lean*1.5,u_level-.5);
    vec2 punta=vec2(x+lean,u_level+sale);
    dm=min(dm,mano(q,base,punta,s,u_t,fi));
  }
  // los brazos se pierden dentro de las llamas: solo se ve lo que asoma junto al borde
  float m=smoothstep(.0015,-.0015,dm)*step(.0001,u_hands)*smoothstep(borde-.26,borde-.1,uv.y);
  col=mix(col,u_c0,m);
  col+=(h(gl_FragCoord.xy+u_t)-.5)*.03;
  gl_FragColor=vec4(col,1.);
}`;

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

const suave = (t: number) => t * t * (3 - 2 * t);
/** la coreografía de la referencia: sube, llena, se invierte */
export function poseLlamas(p: number) {
  const sube = suave(Math.min(1, p / 0.45));
  const inv = suave(Math.min(1, Math.max(0, (p - 0.6) / 0.4)));
  return { level: sube * 1.2 - inv * 0.85, invert: inv };
}

/**
 * Un horizonte de llamas con manos que asoman: el borde sube desde abajo con lenguas que corren hacia arriba, el color
 * más vivo junto al borde y un halo encima, y siluetas de manos en garra que se mecen. Con progress (0–1) sigue la
 * coreografía de meermohsin.me para atarla al scroll: las llamas suben hasta llenarlo todo y luego se invierte (rojo
 * arriba, llamas negras con manos abajo). Para portadas oscuras, conciertos, videojuegos, terror o transiciones entre
 * secciones. Sin dependencias (WebGL a pelo, un triángulo a pantalla completa), pausado fuera de pantalla. Color del tema
 * (--acc sobre --bg). Sin WebGL, un degradado CSS; con movimiento reducido, quieto.
 */
export default function FlameHorizon({ children, progress, level = 0.5, invert = 0, hands = 9, speed = 1, color, height = 480, position = "block", className = "" }: FlameHorizonProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const tokens = useTokens(wrap);
  const reduced = useReducedMotion();
  // lo que cambia con el scroll va por ref: no reinicia el lienzo
  const estado = useRef({ level, invert });
  const pose = progress === undefined ? { level, invert } : poseLlamas(progress);
  estado.current = pose;
  const col = color || tokens?.["--acc"] || "#b0001a";

  useEffect(() => {
    const canvas = cv.current;
    const host = wrap.current;
    if (!canvas || !host || !tokens) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;
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
    const U = (n: string) => gl.getUniformLocation(prog, n);
    gl.uniform3fv(U("u_c0"), rgb(tokens["--bg"], [0, 0, 0]));
    gl.uniform3fv(U("u_c1"), rgb(col, [0.7, 0, 0.1]));
    gl.uniform1f(U("u_hands"), hands);
    const uRes = U("u_res"), uT = U("u_t"), uLevel = U("u_level"), uInv = U("u_inv");
    // las manos piden nitidez: resolución completa hasta 1,5×
    const scale = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const w = Math.max(1, Math.round(host.clientWidth * scale));
      const hh = Math.max(1, Math.round(host.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== hh) {
        canvas.width = w;
        canvas.height = hh;
      }
      gl.viewport(0, 0, w, hh);
      gl.uniform2f(uRes, w, hh);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const quieto = reduced || speed <= 0;
    let raf = 0, visible = true, t = 4, last = performance.now();
    const loop = (now: number) => {
      raf = 0;
      if (!quieto) t += ((now - last) / 1000) * speed;
      last = now;
      gl.uniform1f(uT, t);
      gl.uniform1f(uLevel, estado.current.level);
      gl.uniform1f(uInv, estado.current.invert);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      host.setAttribute("data-gl", "");
      if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
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
  }, [hands, speed, reduced, tokens, col]);

  return (
    <div
      ref={wrap}
      className={`ui-flh ${position === "absolute" ? "ui-flh--abs" : ""} ${className}`.trim()}
      style={{ height: position === "absolute" ? undefined : height, "--flh-color": col, "--flh-level": `${Math.round(pose.level * 100)}%` } as CSSProperties}
    >
      <canvas ref={cv} aria-hidden />
      {children && <div className="ui-flh__content">{children}</div>}
    </div>
  );
}
