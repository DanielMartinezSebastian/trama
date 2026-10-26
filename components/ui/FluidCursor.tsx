"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { useTokens } from "@/lib/ui/useTokens";

export type FluidCursorProps = {
  /** color del humo (CSS); por defecto, el --acc del tema. Cada trazo varía un poco su tono */
  color?: string;
  /** opacidad del lienzo (la referencia: 0,6) */
  opacity?: number;
  /** cuánto color suelta el puntero (1 = el de la referencia) */
  intensity?: number;
  /** cuánto dura el humo: más alto, se apaga antes (DENSITY_DISSIPATION) */
  fade?: number;
  /** cuánto dura el movimiento (VELOCITY_DISSIPATION) */
  drag?: number;
  /** remolinos (CURL) */
  curl?: number;
  /** tamaño del trazo (SPLAT_RADIUS) */
  radius?: number;
  /** fuerza del trazo (SPLAT_FORCE) */
  force?: number;
  /** fixed = cubre la ventana y sigue al puntero en toda la página · absolute = rellena su contenedor */
  position?: "fixed" | "absolute";
  /** fusión con lo de debajo (screen aclara; normal, como la referencia) */
  blend?: CSSProperties["mixBlendMode"];
  className?: string;
};

/*
 * Simulación de fluidos estables (Navier–Stokes en una rejilla) para el puntero, como el humo rojo de meermohsin.me, que
 * usa la de Pavel Dobryakov (WebGL-Fluid-Simulation, MIT). Esta es una reescritura corta con sus mismos pasos:
 * rotacional y confinamiento de vorticidad, divergencia, presión por Jacobi, resta del gradiente y advección del color y
 * la velocidad con disipación. Los valores por defecto son los medidos en la referencia (docs/41 P5).
 */
const VERT = `precision highp float;attribute vec2 aPosition;varying vec2 vUv,vL,vR,vT,vB;uniform vec2 texelSize;
void main(){vUv=aPosition*.5+.5;vL=vUv-vec2(texelSize.x,0.);vR=vUv+vec2(texelSize.x,0.);vT=vUv+vec2(0.,texelSize.y);vB=vUv-vec2(0.,texelSize.y);gl_Position=vec4(aPosition,0.,1.);}`;
const H = "precision highp float;precision highp sampler2D;varying vec2 vUv,vL,vR,vT,vB;";
const FRAG = {
  splat: `${H}uniform sampler2D uTarget;uniform float aspectRatio,radius;uniform vec3 color;uniform vec2 point;
void main(){vec2 p=vUv-point;p.x*=aspectRatio;vec3 s=exp(-dot(p,p)/radius)*color;gl_FragColor=vec4(texture2D(uTarget,vUv).xyz+s,1.);}`,
  advection: `${H}uniform sampler2D uVelocity,uSource;uniform vec2 texelSize;uniform float dt,dissipation;
void main(){vec2 c=vUv-dt*texture2D(uVelocity,vUv).xy*texelSize;gl_FragColor=texture2D(uSource,c)/(1.+dissipation*dt);}`,
  divergence: `${H}uniform sampler2D uVelocity;
void main(){float L=texture2D(uVelocity,vL).x,R=texture2D(uVelocity,vR).x,T=texture2D(uVelocity,vT).y,B=texture2D(uVelocity,vB).y;vec2 C=texture2D(uVelocity,vUv).xy;
if(vL.x<0.)L=-C.x;if(vR.x>1.)R=-C.x;if(vT.y>1.)T=-C.y;if(vB.y<0.)B=-C.y;gl_FragColor=vec4(.5*(R-L+T-B),0.,0.,1.);}`,
  curl: `${H}uniform sampler2D uVelocity;
void main(){float L=texture2D(uVelocity,vL).y,R=texture2D(uVelocity,vR).y,T=texture2D(uVelocity,vT).x,B=texture2D(uVelocity,vB).x;gl_FragColor=vec4(.5*(R-L-T+B),0.,0.,1.);}`,
  vorticity: `${H}uniform sampler2D uVelocity,uCurl;uniform float curl,dt;
void main(){float L=texture2D(uCurl,vL).x,R=texture2D(uCurl,vR).x,T=texture2D(uCurl,vT).x,B=texture2D(uCurl,vB).x,C=texture2D(uCurl,vUv).x;
vec2 f=.5*vec2(abs(T)-abs(B),abs(R)-abs(L));f/=length(f)+.0001;f*=curl*C;f.y*=-1.;vec2 v=texture2D(uVelocity,vUv).xy+f*dt;gl_FragColor=vec4(clamp(v,-1000.,1000.),0.,1.);}`,
  pressure: `${H}uniform sampler2D uPressure,uDivergence;
void main(){float L=texture2D(uPressure,vL).x,R=texture2D(uPressure,vR).x,T=texture2D(uPressure,vT).x,B=texture2D(uPressure,vB).x,d=texture2D(uDivergence,vUv).x;gl_FragColor=vec4((L+R+B+T-d)*.25,0.,0.,1.);}`,
  gradient: `${H}uniform sampler2D uPressure,uVelocity;
void main(){float L=texture2D(uPressure,vL).x,R=texture2D(uPressure,vR).x,T=texture2D(uPressure,vT).x,B=texture2D(uPressure,vB).x;vec2 v=texture2D(uVelocity,vUv).xy-vec2(R-L,T-B);gl_FragColor=vec4(v,0.,1.);}`,
  clear: `${H}uniform sampler2D uTexture;uniform float value;void main(){gl_FragColor=value*texture2D(uTexture,vUv);}`,
  display: `${H}uniform sampler2D uTexture;void main(){vec3 c=texture2D(uTexture,vUv).rgb;float a=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c,a);}`,
};

function rgb(css: string): [number, number, number] {
  const c = document.createElement("canvas").getContext("2d");
  if (!c) return [0.9, 0, 0.01];
  c.fillStyle = "#e00";
  c.fillStyle = css;
  c.fillRect(0, 0, 1, 1);
  const [r, g, b] = c.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

/**
 * Humo que sigue al puntero: una simulación de fluidos (remolinos, presión, disipación) que suelta color al mover el
 * ratón o el dedo, como la estela roja de meermohsin.me. Con position="fixed" cubre la ventana sin bloquear clics. Para
 * portadas oscuras, portfolios, música o cualquier fondo que pida reaccionar al gesto. WebGL a pelo, sin dependencias;
 * pausado con la pestaña oculta; con movimiento reducido no se pinta. Color: --acc del tema.
 */
export default function FluidCursor({ color, opacity = 0.6, intensity = 1, fade = 5.5, drag = 3.8, curl = 1.2, radius = 0.035, force = 1700, position = "fixed", blend = "normal", className = "" }: FluidCursorProps) {
  const cv = useRef<HTMLCanvasElement>(null);
  const tokens = useTokens(cv);
  const reduced = useReducedMotion();
  const col = color || tokens?.["--acc"] || "#e00000";

  useEffect(() => {
    const canvas = cv.current;
    if (!canvas || reduced) return;
    const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false, premultipliedAlpha: true };
    const gl2 = canvas.getContext("webgl2", params) as WebGL2RenderingContext | null;
    const gl = (gl2 ?? canvas.getContext("webgl", params)) as WebGLRenderingContext | null;
    if (!gl) return;
    // texturas de media precisión: WebGL2 trae RGBA16F; en WebGL1 hace falta la extensión
    let tipo: number, interno: number, formato: number;
    if (gl2) {
      gl2.getExtension("EXT_color_buffer_float");
      tipo = gl2.HALF_FLOAT;
      interno = gl2.RGBA16F;
      formato = gl2.RGBA;
    } else {
      const hf = gl.getExtension("OES_texture_half_float");
      gl.getExtension("OES_texture_half_float_linear");
      if (!hf) return;
      tipo = hf.HALF_FLOAT_OES;
      interno = gl.RGBA;
      formato = gl.RGBA;
    }
    const lineal = gl2 ? gl.LINEAR : gl.getExtension("OES_texture_half_float_linear") ? gl.LINEAR : gl.NEAREST;

    const sh = (t: number, src: string) => {
      const s = gl.createShader(t)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const vs = sh(gl.VERTEX_SHADER, VERT);
    const programa = (frag: string) => {
      const p = gl.createProgram()!;
      gl.attachShader(p, vs);
      gl.attachShader(p, sh(gl.FRAGMENT_SHADER, frag));
      gl.bindAttribLocation(p, 0, "aPosition");
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) console.warn("FluidCursor:", gl.getProgramInfoLog(p));
      const u: Record<string, WebGLUniformLocation | null> = {};
      const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS) as number;
      for (let i = 0; i < n; i++) {
        const nombre = gl.getActiveUniform(p, i)!.name;
        u[nombre] = gl.getUniformLocation(p, nombre);
      }
      return { p, u };
    };
    const P = Object.fromEntries(Object.entries(FRAG).map(([k, f]) => [k, programa(f)])) as Record<keyof typeof FRAG, ReturnType<typeof programa>>;
    if (!gl.getProgramParameter(P.display.p, gl.LINK_STATUS)) return;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const ibuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    type FBO = { tex: WebGLTexture; fbo: WebGLFramebuffer; w: number; h: number; tx: number; ty: number; adjunta: (id: number) => number };
    const crear = (w: number, h: number): FBO => {
      gl.activeTexture(gl.TEXTURE0);
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, lineal);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, lineal);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, interno, w, h, 0, formato, tipo, null);
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return {
        tex, fbo, w, h, tx: 1 / w, ty: 1 / h,
        adjunta(id: number) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          return id;
        },
      };
    };
    const doble = (w: number, h: number) => {
      let a = crear(w, h), b = crear(w, h);
      return {
        get read() { return a; },
        get write() { return b; },
        swap() { [a, b] = [b, a]; },
      };
    };
    const tam = (res: number) => {
      let ar = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (ar < 1) ar = 1 / ar;
      const min = Math.round(res), max = Math.round(res * ar);
      return gl.drawingBufferWidth > gl.drawingBufferHeight ? { w: max, h: min } : { w: min, h: max };
    };
    const dibuja = (destino: FBO | null) => {
      if (destino) {
        gl.viewport(0, 0, destino.w, destino.h);
        gl.bindFramebuffer(gl.FRAMEBUFFER, destino.fbo);
      } else {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };

    const escala = Math.min(window.devicePixelRatio || 1, 2);
    const ajusta = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * escala)), h = Math.max(1, Math.floor(canvas.clientHeight * escala));
      if (canvas.width === w && canvas.height === h) return false;
      canvas.width = w;
      canvas.height = h;
      return true;
    };
    ajusta();
    // la resolución de la simulación (48) y la del color (384): la de la referencia
    let sim = tam(48), dye = tam(384);
    let vel = doble(sim.w, sim.h), color = doble(dye.w, dye.h), pres = doble(sim.w, sim.h);
    let div = crear(sim.w, sim.h), rot = crear(sim.w, sim.h);
    const rehace = () => {
      sim = tam(48);
      dye = tam(384);
      vel = doble(sim.w, sim.h);
      color = doble(dye.w, dye.h);
      pres = doble(sim.w, sim.h);
      div = crear(sim.w, sim.h);
      rot = crear(sim.w, sim.h);
    };

    const base = rgb(col);
    const splat = (x: number, y: number, dx: number, dy: number, c: [number, number, number]) => {
      const ar = canvas.width / canvas.height;
      gl.useProgram(P.splat.p);
      gl.uniform1i(P.splat.u.uTarget, vel.read.adjunta(0));
      gl.uniform1f(P.splat.u.aspectRatio, ar);
      gl.uniform2f(P.splat.u.point, x, y);
      gl.uniform3f(P.splat.u.color, dx, dy, 0);
      gl.uniform1f(P.splat.u.radius, (radius / 100) * (ar > 1 ? ar : 1));
      dibuja(vel.write);
      vel.swap();
      gl.uniform1i(P.splat.u.uTarget, color.read.adjunta(0));
      gl.uniform3f(P.splat.u.color, c[0], c[1], c[2]);
      dibuja(color.write);
      color.swap();
    };
    // el color de cada trazo: el del tema entero con un poco de variación, como los rojos al azar de la referencia (r 0,8–1;
    // el original de Dobryakov lo multiplica por 0,15, esta web no)
    const trazo = (): [number, number, number] => {
      const v = 0.8 + Math.random() * 0.2;
      return [base[0] * v * intensity, base[1] * v * intensity, base[2] * v * intensity];
    };

    const puntero = { x: 0, y: 0, px: 0, py: 0, movido: false, c: trazo() };
    const mueve = (cx: number, cy: number) => {
      const r = canvas.getBoundingClientRect();
      const x = (cx - r.left) / r.width, y = 1 - (cy - r.top) / r.height;
      if (x < -0.1 || x > 1.1 || y < -0.1 || y > 1.1) return;
      puntero.px = puntero.x;
      puntero.py = puntero.y;
      puntero.x = x;
      puntero.y = y;
      puntero.movido = true;
    };
    const onMove = (e: PointerEvent) => mueve(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => e.touches[0] && mueve(e.touches[0].clientX, e.touches[0].clientY);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    const paso = (dt: number) => {
      gl.disable(gl.BLEND);
      gl.useProgram(P.curl.p);
      gl.uniform2f(P.curl.u.texelSize, vel.read.tx, vel.read.ty);
      gl.uniform1i(P.curl.u.uVelocity, vel.read.adjunta(0));
      dibuja(rot);
      gl.useProgram(P.vorticity.p);
      gl.uniform2f(P.vorticity.u.texelSize, vel.read.tx, vel.read.ty);
      gl.uniform1i(P.vorticity.u.uVelocity, vel.read.adjunta(0));
      gl.uniform1i(P.vorticity.u.uCurl, rot.adjunta(1));
      gl.uniform1f(P.vorticity.u.curl, curl);
      gl.uniform1f(P.vorticity.u.dt, dt);
      dibuja(vel.write);
      vel.swap();
      gl.useProgram(P.divergence.p);
      gl.uniform2f(P.divergence.u.texelSize, vel.read.tx, vel.read.ty);
      gl.uniform1i(P.divergence.u.uVelocity, vel.read.adjunta(0));
      dibuja(div);
      gl.useProgram(P.clear.p);
      gl.uniform1i(P.clear.u.uTexture, pres.read.adjunta(0));
      gl.uniform1f(P.clear.u.value, 0.12);
      dibuja(pres.write);
      pres.swap();
      gl.useProgram(P.pressure.p);
      gl.uniform2f(P.pressure.u.texelSize, vel.read.tx, vel.read.ty);
      gl.uniform1i(P.pressure.u.uDivergence, div.adjunta(0));
      for (let i = 0; i < 6; i++) {
        gl.uniform1i(P.pressure.u.uPressure, pres.read.adjunta(1));
        dibuja(pres.write);
        pres.swap();
      }
      gl.useProgram(P.gradient.p);
      gl.uniform2f(P.gradient.u.texelSize, vel.read.tx, vel.read.ty);
      gl.uniform1i(P.gradient.u.uPressure, pres.read.adjunta(0));
      gl.uniform1i(P.gradient.u.uVelocity, vel.read.adjunta(1));
      dibuja(vel.write);
      vel.swap();
      gl.useProgram(P.advection.p);
      gl.uniform2f(P.advection.u.texelSize, vel.read.tx, vel.read.ty);
      const v = vel.read.adjunta(0);
      gl.uniform1i(P.advection.u.uVelocity, v);
      gl.uniform1i(P.advection.u.uSource, v);
      gl.uniform1f(P.advection.u.dt, dt);
      gl.uniform1f(P.advection.u.dissipation, drag);
      dibuja(vel.write);
      vel.swap();
      gl.uniform1i(P.advection.u.uVelocity, vel.read.adjunta(0));
      gl.uniform1i(P.advection.u.uSource, color.read.adjunta(1));
      gl.uniform1f(P.advection.u.dissipation, fade);
      dibuja(color.write);
      color.swap();
    };

    let raf = 0, ultimo = performance.now(), visible = true, cambia = 0;
    const bucle = (ahora: number) => {
      raf = 0;
      const dt = Math.min((ahora - ultimo) / 1000, 0.016666);
      ultimo = ahora;
      if (ajusta()) rehace();
      // el color cambia despacio (COLOR_UPDATE_SPEED 0,5 en la referencia)
      cambia += dt * 0.5;
      if (cambia >= 1) {
        cambia = 0;
        puntero.c = trazo();
      }
      if (puntero.movido) {
        puntero.movido = false;
        const ar = canvas.width / canvas.height;
        let dx = puntero.x - puntero.px, dy = puntero.y - puntero.py;
        if (ar < 1) dx *= ar;
        if (ar > 1) dy /= ar;
        splat(puntero.x, puntero.y, dx * force, dy * force, puntero.c);
      }
      paso(dt);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      gl.useProgram(P.display.p);
      gl.uniform2f(P.display.u.texelSize, 1 / gl.drawingBufferWidth, 1 / gl.drawingBufferHeight);
      gl.uniform1i(P.display.u.uTexture, color.read.adjunta(0));
      dibuja(null);
      if (visible && !document.hidden) raf = requestAnimationFrame(bucle);
    };
    const empieza = () => {
      if (raf || !visible || document.hidden) return;
      ultimo = performance.now();
      raf = requestAnimationFrame(bucle);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) empieza();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", empieza);
    empieza();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", empieza);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onTouch);
      // sin loseContext: React monta el efecto dos veces en desarrollo y el segundo montaje reutiliza el mismo lienzo
      for (const x of Object.values(P)) gl.deleteProgram(x.p);
      gl.deleteBuffer(buf);
      gl.deleteBuffer(ibuf);
    };
  }, [col, intensity, fade, drag, curl, radius, force, reduced]);

  return <canvas ref={cv} className={`ui-fluid ui-fluid--${position} ${className}`.trim()} style={{ opacity, mixBlendMode: blend }} aria-hidden />;
}
