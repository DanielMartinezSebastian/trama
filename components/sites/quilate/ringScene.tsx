"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  BoxGeometry,
  BufferGeometry as Geometry,
  AdditiveBlending,
  CanvasTexture,
  EquirectangularReflectionMapping,
  BackSide,
  SRGBColorSpace,
  ShaderMaterial,
  CubeCamera,
  HalfFloatType,
  WebGLCubeRenderTarget,
  Float32BufferAttribute,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  LatheGeometry,
  Matrix4,
  Mesh as ThreeMesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Scene,
  type Texture,
  MeshPhysicalMaterial,
  PMREMGenerator,
  PointLight,
  RepeatWrapping,
  SphereGeometry,
  Vector2,
  Vector3,
  type BufferGeometry,
  type Object3D,
  type Mesh,
} from "three";
import { kelvinToHex, type LightCue } from "@/lib/ui/light";
import { CORUNDUM_IOR, DIAMOND_IOR, EMERALD_IOR, createGemMaterial, setGemGeometry, type GemMaterial } from "./gemMaterial";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import { FONTS, KIT_BASE, STONE_PIECE, kitPiece, metalOf, stoneOf, type RingSel, type Shape } from "./ring";
import MotionFx from "./motionFx";
import { anchorsOf, loadPiece, type Piece } from "./pieces";

/*
 * El anillo de Quilate como escena procedural, sin modelos: el aro es una revolución de su sección (confort, media caña o
 * plana), la piedra una revolución facetada (flatShading) de su perfil de talla, y garras, bisel, halo, trilogía y pavé se
 * colocan alrededor. Las luces no son fijas: cada fotograma leen la toma de luz de la sección (LightScroll → `light`) y se
 * colocan como dice su finalidad (foco con destellos, difusa de día, rasante…). docs/19 §5.
 *
 * Unidades: radio interior del aro = 1 ≈ 8,5 mm (talla 14). El aro vive en el plano XY con la cabeza hacia +Y.
 */

export type RingLook = "final" | "boceto" | "cera" | "gema" | "apagado";

/**
 * Pose del anillo dictada desde fuera (la portada la calcula con el scroll, interpolada entre capítulos): manda sobre el
 * encuadre y añade despiece y giro. Todos los valores 0–1 salvo `yaw` (radianes).
 */
export type RingPose = {
  /** 0 = montado · 1 = despiece (aro, cabeza y piedra separados por sus anclajes) */
  explode: number;
  /** 0 = anillo entero · 1 = la piedra de cerca */
  head: number;
  /** 0 = fuera · 1 = dentro del aro, leyendo el grabado */
  engrave: number;
  /** giro añadido alrededor del eje del anillo */
  yaw: number;
  /** 0 = fuera · 1 = de cerca del hombro del aro (pavé y garras de la cabeza en el mismo cuadro) */
  pave: number;
  /** dónde cae el anillo en la pantalla, en fracción del ancho desde el centro (−0,5 izquierda … 0,5 derecha) */
  x: number;
  /** distancia de la cámara en el plano general (1 = normal, menos = más cerca) */
  zoom: number;
  /** dónde cae el anillo en vertical, en fracción del alto desde el centro (positivo = más arriba) */
  y: number;
  /** 1 = solo la piedra (aro, montura y pavé fuera de cuadro, debajo); al bajar a 0 llegan y se montan alrededor */
  solo: number;
  /** 0 = un anillo · 1 = trío: los acompañantes (`companions`) suben a los lados, más atrás y más pequeños */
  trio: number;
  /** 0 = de tres cuartos · 1 = de frente: el aro se planta de cara como una «O», con la piedra arriba */
  face: number;
};

/** El HDR de estudio (Aerodynamics Workshop, Poly Haven, CC0) como cubemap: lo que ven las gemas trazadas. */
const HDR = "/models/hdr/aerodynamics_workshop_1k.hdr";
export function useHdrCube() {
  const gl = useThree((s) => s.gl);
  const [cube, setCube] = useState<Texture | null>(null);
  useEffect(() => {
    let rt: WebGLCubeRenderTarget | null = null;
    let live = true;
    new HDRLoader().load(HDR, (tex) => {
      if (!live) return tex.dispose();
      tex.mapping = EquirectangularReflectionMapping;
      rt = new WebGLCubeRenderTarget(512, { type: HalfFloatType }).fromEquirectangularTexture(gl, tex);
      tex.dispose();
      setCube(rt.texture);
    });
    return () => {
      live = false;
      rt?.dispose();
    };
  }, [gl]);
  return cube;
}
/** Diamante «de escaparate»: ior alto y canales separados (como el ior 2.75 del ejemplo de pmndrs) para que el fuego se vea. */
const SHOW_DIAMOND_IOR = new Vector3(2.65, 2.75, 2.88);

export type RingSceneProps = {
  sel: RingSel;
  look: RingLook;
  /** la toma de luz en vivo (de `useLight()`); sin ella, una luz de vitrina fija */
  light: MutableRefObject<LightCue> | null;
  /** giro añadido por el arrastre (radianes) */
  drag: MutableRefObject<number>;
  turntable: boolean;
  /** encuadre: el anillo entero o la cabeza de cerca */
  /** ring = el anillo entero · head = la piedra de cerca · engrave = dentro del aro, leyendo el grabado */
  framing: "ring" | "head" | "engrave";
  /** pose externa (scroll); si está, sustituye a `framing` */
  pose?: MutableRefObject<RingPose> | null;
  active: boolean;
  onReady: () => void;
  /** desenfoque de movimiento y tilt-shift en las transiciones de la pose (solo con `pose`; no en táctiles) */
  motionFx?: boolean;
  /** lo rellena la escena: el grupo del anillo y cuánta transición hay (para MotionFx) */
  fxTarget?: MutableRefObject<Object3D | null>;
  fxAmount?: MutableRefObject<number>;
  /** velo de los cambios de material (0–1): lo rellena la escena y lo leen los destellos y MotionFx */
  fxVeil?: MutableRefObject<number>;
  /** anillos que acompañan al principal en el trío (pose `trio`): a la izquierda (−1) y a la derecha (1) */
  companions?: { sel: RingSel; side: -1 | 1 }[];
  /** interno: este anillo es un acompañante (no mueve la cámara ni las luces; su sitio lo da `trio` de la pose del principal) */
  companion?: { side: -1 | 1; host: MutableRefObject<RingPose> };
};

/*
 * Velo de los cambios de material del recorrido (boceto → cera → metal, apagado → limpio, oro amarillo → rosa…): en vez de
 * cambiar a la vista, la escena sube un velo (desenfoque y brillo en MotionFx, destellos que barren la piedra y el metal),
 * hace el cambio en lo más alto y lo baja despacio. Solo con pose externa: en el configurador, el cambio es inmediato.
 */
const VEIL_IN = 0.16;
const VEIL_OUT = 0.75;
const ease = (t: number) => t * t * (3 - 2 * t);

const R0 = 1;
const T = 0.17;
const MM = 1 / 8.5;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const FALLBACK: LightCue = { kelvin: 3600, intensity: 1, kind: "spot", x: 60, y: 35, radius: 45, softness: 0.4, ambient: 0.2, angle: 0, follow: "none", sparkle: 0.6 };

/** Sección del aro en (radio, altura), cerrada, en sentido antihorario. */
function bandProfile(sel: RingSel): Vector2[] {
  const W = Math.max(1.6, sel.width) * MM;
  const pts: Vector2[] = [];
  if (sel.profile === "plana") {
    const c = 0.025;
    const q: [number, number][] = [[R0, -W / 2 + c], [R0 + c, -W / 2], [R0 + T - c, -W / 2], [R0 + T, -W / 2 + c], [R0 + T, W / 2 - c], [R0 + T - c, W / 2], [R0 + c, W / 2], [R0, W / 2 - c]];
    q.forEach(([r, h]) => pts.push(new Vector2(r, h)));
  } else if (sel.profile === "media-cana") {
    for (let i = 0; i <= 18; i++) {
      const a = -Math.PI / 2 + (i / 18) * Math.PI;
      pts.push(new Vector2(R0 + 0.02 + (T - 0.02) * Math.cos(a), (W / 2) * Math.sin(a)));
    }
    pts.push(new Vector2(R0, W / 2 - 0.01), new Vector2(R0, -W / 2 + 0.01));
  } else {
    // confort (y afinado, que es confort que se estrecha hacia la cabeza): superelipse de cantos muy redondeados
    for (let i = 0; i < 36; i++) {
      const a = -Math.PI / 2 + (i / 36) * Math.PI * 2;
      const c = Math.cos(a);
      const s = Math.sin(a);
      pts.push(new Vector2(R0 + T / 2 + (T / 2) * Math.sign(c) * Math.pow(Math.abs(c), 0.55), (W / 2) * Math.sign(s) * Math.pow(Math.abs(s), 0.55)));
    }
  }
  pts.push(pts[0].clone());
  return pts;
}

/**
 * El aro como barrido de su sección alrededor del dedo (eje Z), con la cabeza arriba (+Y). `afinado` estrecha y adelgaza el
 * aro al subir hacia la piedra («hombros afinados» del solitario clásico): la sección se escala con el ángulo.
 */
function sweepBand(sel: RingSel): BufferGeometry {
  const prof = bandProfile(sel).slice(0, -1);
  const M = prof.length;
  const N = 200;
  const taper = sel.profile === "afinado";
  const pos: number[] = [];
  const uv: number[] = [];
  for (let i = 0; i <= N; i++) {
    const th = (i / N) * Math.PI * 2;
    const w = ((th + Math.PI) % (Math.PI * 2)) - Math.PI; // −π…π, 0 arriba
    const near = Math.exp(-((w / 0.75) ** 2));
    const sw = taper ? 1 - 0.38 * near : 1;
    const st = taper ? 1 - 0.18 * near : 1;
    for (let j = 0; j <= M; j++) {
      const q = prof[j % M];
      const r = R0 + (q.x - R0) * st;
      pos.push(Math.sin(th) * r, Math.cos(th) * r, q.y * sw);
      uv.push(i / N, j / M);
    }
  }
  const index: number[] = [];
  for (let i = 0; i < N; i++)
    for (let j = 0; j < M; j++) {
      const a = i * (M + 1) + j;
      const b = (i + 1) * (M + 1) + j;
      index.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const g = new Geometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  g.setIndex(index);
  g.computeVertexNormals();
  // las caras tienen que mirar hacia fuera: en el vértice más exterior, la normal debe apuntar lejos del dedo
  const P = g.getAttribute("position");
  const nrm = g.getAttribute("normal");
  let far = 0;
  for (let k = 1; k < P.count; k++) if (Math.hypot(P.getX(k), P.getY(k)) > Math.hypot(P.getX(far), P.getY(far))) far = k;
  if (nrm.getX(far) * P.getX(far) + nrm.getY(far) * P.getY(far) < 0) {
    const idx = g.getIndex()!;
    for (let k = 0; k < idx.count; k += 3) {
      const t = idx.getX(k + 1);
      idx.setX(k + 1, idx.getX(k + 2));
      idx.setX(k + 2, t);
    }
    g.computeVertexNormals();
  }
  return g;
}

/** Radio de la piedra (unidades) por quilates: un brillante de 1 ct mide ~6,5 mm. */
export const stoneRadius = (carat: number) => ((6.5 * Math.cbrt(carat)) / 2) * MM;

/**
 * Talla brillante simplificada (49 facetas): mesa octogonal, 8 estrellas, 8 cometas, 16 medias lunas de corona, faja, 16
 * facetas bajas de pabellón y 8 principales hasta la culata. Triángulos sueltos: cada faceta tiene su normal (el mosaico de
 * reflejos claros y oscuros que hace brillar una piedra).
 */
export function brilliantGeometry(R: number): BufferGeometry {
  const at = (deg: number, r: number, h: number) => new Vector3(Math.cos((deg * Math.PI) / 180) * r * R, h * R, Math.sin((deg * Math.PI) / 180) * r * R);
  const T = Array.from({ length: 8 }, (_, k) => at(k * 45, 0.55, 0.32));
  const S = Array.from({ length: 8 }, (_, k) => at(k * 45 + 22.5, 0.8, 0.2));
  const G = Array.from({ length: 16 }, (_, j) => at(j * 22.5, 1, 0.03));
  const Gb = Array.from({ length: 16 }, (_, j) => at(j * 22.5, 1, -0.03));
  const M = Array.from({ length: 8 }, (_, k) => at(k * 45, 0.46, -0.5));
  const top = new Vector3(0, 0.32 * R, 0);
  const culet = new Vector3(0, -0.86 * R, 0);
  const tris: Vector3[][] = [];
  const m8 = (i: number) => (i + 8) % 8;
  const m16 = (i: number) => (i + 16) % 16;
  for (let k = 0; k < 8; k++) {
    tris.push([top, T[k], T[m8(k + 1)]]); // mesa
    tris.push([T[k], T[m8(k + 1)], S[k]]); // estrella
    tris.push([T[k], S[m8(k - 1)], G[2 * k]], [T[k], G[2 * k], S[k]]); // cometa
    tris.push([S[k], G[2 * k], G[2 * k + 1]], [S[k], G[2 * k + 1], G[m16(2 * k + 2)]]); // medias lunas
    tris.push([Gb[m16(2 * k - 1)], Gb[2 * k], M[k]], [Gb[2 * k], Gb[2 * k + 1], M[k]], [Gb[2 * k + 1], M[m8(k + 1)], M[k]]); // pabellón bajo
    tris.push([M[k], M[m8(k + 1)], culet]); // principales
  }
  for (let j = 0; j < 16; j++) tris.push([G[j], G[m16(j + 1)], Gb[m16(j + 1)]], [G[j], Gb[m16(j + 1)], Gb[j]]); // faja
  const center = new Vector3(0, -0.2 * R, 0);
  const pos: number[] = [];
  const e1 = new Vector3();
  const e2 = new Vector3();
  for (const [a, b, c] of tris) {
    // cada faceta mirando hacia fuera
    const n = e1.subVectors(b, a).cross(e2.subVectors(c, a));
    const mid = new Vector3().add(a).add(b).add(c).divideScalar(3).sub(center);
    const [p, q, r] = n.dot(mid) < 0 ? [a, c, b] : [a, b, c];
    pos.push(p.x, p.y, p.z, q.x, q.y, q.z, r.x, r.y, r.z);
  }
  const g = new Geometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

/** Perfil de talla (radio, altura) con la tabla arriba y la culata abajo, y cuántas facetas alrededor. */
function stoneGeometry(shape: Shape, R: number): BufferGeometry {
  const P = (r: number, h: number) => new Vector2(Math.max(0.0005, r * R), h * R);
  if (shape === "esmeralda") {
    // talla en escalera: tres escalones en la corona y en el pabellón
    const g = new LatheGeometry([P(0, -0.62), P(0.45, -0.5), P(0.78, -0.28), P(1, 0), P(1, 0.04), P(0.86, 0.16), P(0.7, 0.24), P(0, 0.24)], 8);
    g.rotateY(Math.PI / 8);
    g.scale(1.38, 1, 1);
    return g;
  }
  if (shape === "princesa") {
    const g = new LatheGeometry([P(0, -0.74), P(0.62, -0.32), P(1.18, 0), P(1.18, 0.04), P(0.82, 0.2), P(0, 0.2)], 4);
    g.rotateY(Math.PI / 4);
    return g;
  }
  const g = brilliantGeometry(R);
  if (shape === "oval") g.scale(1.32, 1, 0.94);
  return g;
}

/** Textura de golpes de martillo como mapa de normales (se crea una vez). */
function hammerNormals() {
  const S = 256;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  const h = new Float32Array(S * S);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let k = 0; k < 120; k++) {
    const cx = rnd() * S;
    const cy = rnd() * S;
    const r = 10 + rnd() * 18;
    for (let y = -r; y <= r; y++)
      for (let x = -r; x <= r; x++) {
        const d = Math.hypot(x, y) / r;
        if (d > 1) continue;
        const px = (Math.round(cx + x) + S) % S;
        const py = (Math.round(cy + y) + S) % S;
        h[py * S + px] -= (1 - d * d) * 0.6;
      }
  }
  const img = ctx.createImageData(S, S);
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      const dx = h[y * S + ((x + 1) % S)] - h[y * S + ((x - 1 + S) % S)];
      const dy = h[((y + 1) % S) * S + x] - h[((y - 1 + S) % S) * S + x];
      const n = new Vector3(-dx * 3, -dy * 3, 1).normalize();
      const i = (y * S + x) * 4;
      img.data[i] = (n.x * 0.5 + 0.5) * 255;
      img.data[i + 1] = (n.y * 0.5 + 0.5) * 255;
      img.data[i + 2] = (n.z * 0.5 + 0.5) * 255;
      img.data[i + 3] = 255;
    }
  ctx.putImageData(img, 0, 0);
  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(10, 1);
  return t;
}

/**
 * Entorno del metal: un estudio de fotografía de joyería generado (docs/19 §5) que **cambia con la toma de luz de la
 * sección** (como las escenas de Oryzo o los EXR por sala de Cartier W&W): una cúpula con degradado (techo, horizonte y suelo),
 * tiras verticales, softboxes de borde suave, un rebote cálido y banderas negras. Cada toma da otra sala: vitrina negra con
 * tiras duras, caja de luz gris para la luz de día, lámpara baja y cálida para la conversación, flexo cenital para el taller,
 * una sola tira casi tangente para la rasante. El metal pulido se lee por esas franjas, así que al cambiar de sala cambian
 * los reflejos del anillo. Se re-renderiza solo mientras la toma se mueve (cubemap de 128 px + PMREM reutilizado).
 */
function studioScene() {
  const scene = new Scene();
  const disposables: { dispose: () => void }[] = [];
  const dome = new ShaderMaterial({
    side: BackSide,
    depthWrite: false,
    uniforms: { uTop: { value: new Color("#0b0a09") }, uMid: { value: new Color("#6a5f50") }, uBot: { value: new Color("#4a3622") }, uBand: { value: 0.08 } },
    vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader:
      "uniform vec3 uTop; uniform vec3 uMid; uniform vec3 uBot; uniform float uBand; varying vec3 vP; void main(){ float y = vP.y; vec3 c = y > 0.0 ? mix(uMid, uTop, smoothstep(0.0, 0.9, y)) : mix(uMid, uBot, smoothstep(0.0, 0.6, -y)); c += uMid * exp(-y * y / (uBand * uBand)) * 0.6; gl_FragColor = vec4(c, 1.0); }",
  });
  const domeGeo = new SphereGeometry(20, 32, 16);
  scene.add(new ThreeMesh(domeGeo, dome));
  disposables.push(dome, domeGeo);

  // softbox con borde suave: centro intenso que cae hacia el canto (reflejos de bordes difusos, no rectángulos duros)
  const box = document.createElement("canvas");
  box.width = box.height = 128;
  const bx = box.getContext("2d")!;
  const bg = bx.createRadialGradient(64, 64, 8, 64, 64, 64);
  bg.addColorStop(0, "#ffffff");
  bg.addColorStop(0.55, "#f4efe6");
  bg.addColorStop(1, "#000000");
  bx.fillStyle = bg;
  bx.fillRect(0, 0, 128, 128);
  const boxTex = new CanvasTexture(box);
  boxTex.colorSpace = SRGBColorSpace;
  disposables.push(boxTex);

  const geo = new PlaneGeometry(1, 1);
  disposables.push(geo);
  const mk = (c: Color, map: CanvasTexture | null = boxTex) => {
    const m = new MeshBasicMaterial({ color: c, map, side: 2, toneMapped: false });
    disposables.push(m);
    return m;
  };
  const stripL = mk(new Color(1, 1, 1).multiplyScalar(6));
  const stripR = mk(new Color(1, 1, 1).multiplyScalar(6));
  const top = mk(new Color(1, 0.96, 0.9).multiplyScalar(2.4));
  const back = mk(new Color(1, 0.96, 0.9).multiplyScalar(2.4));
  const warm = mk(new Color(1, 0.78, 0.55).multiplyScalar(1.6));
  const lamp = mk(new Color(1, 0.7, 0.4).multiplyScalar(0));
  const black = mk(new Color(0, 0, 0), null);
  const add = (m: MeshBasicMaterial, [x, y, z, w, h]: number[]) => {
    const p = new ThreeMesh(geo, m);
    p.position.set(x, y, z);
    p.scale.set(w, h, 1);
    p.lookAt(0, 0, 0);
    scene.add(p);
    return p;
  };
  add(stripL, [-5, 0.5, 2.5, 1.4, 9]);
  add(stripR, [5, 0.5, -1.5, 1.1, 9]);
  add(top, [0, 6, 0, 7, 4]);
  add(back, [0, 1.5, -6, 6, 3]);
  // panel alto detrás: lo que refleja el interior del aro cuando la cámara entra a leer el grabado
  add(back, [0, 4.5, -4.5, 8, 3.5]);
  add(warm, [0, -5, 2, 9, 3]);
  // la lámpara de mesa: baja y lateral, solo en las tomas cálidas de conversación
  add(lamp, [-4.5, -0.6, 3, 2.2, 2.2]);
  add(black, [4, -3, 4, 2.5, 3]);
  add(black, [-6, 0, -3, 2, 6]);

  const tint = new Color();
  const W = new Color(1, 1, 1);
  const WARM = new Color(1, 0.74, 0.5);
  /** Pone la sala de una toma de luz. */
  const update = (c: LightCue) => {
    tint.set(kelvinToHex(c.kelvin)).lerp(W, 0.35);
    const hard = 1 - c.softness;
    const I = c.intensity;
    const u = dome.uniforms;
    // techo: en penumbra salvo en la caja de luz; horizonte: el ambiente; suelo: rebote cálido
    u.uTop.value.copy(tint).multiplyScalar(0.03 + 0.55 * c.ambient * c.softness);
    u.uMid.value.copy(tint).multiplyScalar((0.08 + 0.75 * c.ambient) * I);
    u.uBot.value.copy(WARM).multiplyScalar(0.06 + 0.35 * c.ambient);
    u.uBand.value = 0.05 + 0.25 * c.softness;
    const rake = c.kind === "rake";
    stripL.color.copy(tint).multiplyScalar((1.5 + 6 * hard) * I * (rake ? 1.6 : 1));
    stripR.color.copy(tint).multiplyScalar(rake ? 0 : (1.2 + 5 * hard) * I);
    top.color.copy(tint).multiplyScalar((0.6 + 3 * c.softness) * I * (c.y < 15 ? 1.8 : 1));
    back.color.copy(tint).multiplyScalar((0.5 + 2.2 * c.softness) * I);
    warm.color.copy(WARM).multiplyScalar(c.kelvin < 3400 ? 1.8 : 0.7);
    lamp.color.copy(WARM).multiplyScalar(c.kelvin < 3000 ? 4 * I : 0);
  };
  return { scene, update, dispose: () => disposables.forEach((x) => x.dispose()) };
}

/** Diferencia entre dos tomas que obliga a volver a pintar el entorno. */
const cueDelta = (a: LightCue, b: LightCue) =>
  Math.abs(a.kelvin - b.kelvin) / 400 + Math.abs(a.softness - b.softness) + Math.abs(a.ambient - b.ambient) + Math.abs(a.intensity - b.intensity) + Math.abs(a.y - b.y) / 40 + (a.kind === b.kind ? 0 : 1);

function Environment({ light }: { light: MutableRefObject<LightCue> | null }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const env = useMemo(() => studioScene(), []);
  const res = useMemo(() => {
    const cubeRT = new WebGLCubeRenderTarget(128, { type: HalfFloatType });
    const cam = new CubeCamera(0.1, 50, cubeRT);
    const pmrem = new PMREMGenerator(gl);
    return { cubeRT, cam, pmrem, out: null as null | ReturnType<PMREMGenerator["fromCubemap"]>, last: null as LightCue | null, t: 0 };
  }, [gl]);
  const render = (c: LightCue) => {
    env.update(c);
    res.cam.update(gl, env.scene);
    res.out = res.pmrem.fromCubemap(res.cubeRT.texture, res.out ?? undefined);
    scene.environment = res.out.texture;
    res.last = { ...c };
  };
  useEffect(() => {
    render(light?.current ?? FALLBACK);
    return () => {
      scene.environment = null;
      res.out?.dispose();
      res.cubeRT.dispose();
      res.pmrem.dispose();
      env.dispose();
    };
  }, [res, env]); // eslint-disable-line react-hooks/exhaustive-deps
  // mientras la toma se mueve, la sala se vuelve a pintar (como mucho ~20 veces por segundo)
  useFrame((_, dt) => {
    const c = light?.current;
    if (!c || !res.last) return;
    res.t += dt;
    if (res.t < 0.05 || cueDelta(c, res.last) < 0.02) return;
    res.t = 0;
    render(c);
  });
  return null;
}

/**
 * Entorno propio de las gemas: sala negra con seis paneles de luz pequeños. Una piedra facetada se lee por el contraste entre
 * facetas que reflejan un panel y facetas que reflejan negro (el «patrón» de GIA); con el entorno claro del metal se vería
 * blanca y lechosa. Mismo truco que los configuradores con un mapa para el metal y otro para la gema (docs/19 §3).
 */
export function useGemEnvironment() {
  const gl = useThree((s) => s.gl);
  const [tex, dispose] = useMemo(() => {
    const scene = new Scene();
    // caja de luz gris (brillo, GIA: la luz difusa da el brillo) con paneles fuertes y banderas negras (el patrón oscuro)
    scene.background = new Color(0.42, 0.42, 0.43);
    const geo = new PlaneGeometry(1, 1);
    // paneles más intensos que el blanco (HDR): son los que se ven como destellos en las facetas
    const mat = new MeshBasicMaterial({ color: new Color(1, 1, 1).multiplyScalar(9) });
    const panels: [number, number, number, number, number][] = [
      [0, 6, 0, 3.2, 3.2],
      [5, 3, 3, 1.4, 2.6],
      [-5, 3, 3, 1.4, 2.6],
      [4, 1, -4, 2.2, 1.2],
      [-4, 3, -4, 1.2, 2.2],
      [0, 0.5, 6, 4.5, 0.7],
      [6, -1, 0, 0.8, 3],
      [-6, -1, 0, 0.8, 3],
      [2.5, 5, 3, 1, 1],
      [-2.5, 5, -3, 1, 1],
    ];
    const flag = new MeshBasicMaterial({ color: 0x000000 });
    const flags: [number, number, number, number, number][] = [
      [0, 1.5, 6, 6, 1.2],
      [6, 1, -2, 1.2, 4],
      [-6, 1, -2, 1.2, 4],
      [0, -4, -5, 7, 2],
      [-4, -2, 4, 2, 1.5],
    ];
    const add = (list: [number, number, number, number, number][], m0: MeshBasicMaterial) =>
      list.forEach(([x, y, z, w, h]) => {
        const m = new ThreeMesh(geo, m0);
        m.position.set(x, y, z);
        m.scale.set(w, h, 1);
        m.lookAt(0, 0, 0);
        scene.add(m);
      });
    add(flags, flag);
    add(panels, mat);
    // cubemap (no PMREM): el shader de la gema lo muestrea con la dirección exacta de cada rayo que sale de la piedra
    const rt = new WebGLCubeRenderTarget(256, { type: HalfFloatType });
    new CubeCamera(0.1, 50, rt).update(gl, scene);
    return [rt.texture as Texture, () => { rt.dispose(); geo.dispose(); mat.dispose(); flag.dispose(); }] as const;
  }, [gl]);
  useEffect(() => dispose, [dispose]);
  return tex;
}

/**
 * El grabado como textura de relieve: el texto en negativo (letras más bajas y algo más oscuras) sobre blanco, desenfocado un
 * pelo para que el borde del corte tenga pendiente y la luz rasante lo dibuje. Va en una franja pegada al interior del aro, en
 * la parte de abajo (la cabeza está arriba), centrada y con el punzón de la casa al final.
 */
function engravingTexture(text: string, font: string) {
  const H = 128;
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d")!;
  // la fuente es una variable CSS (next/font): se resuelve al nombre real de la familia
  const family = font.replace(/var\((--[\w-]+)\)/g, (_, v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "serif");
  const main = `400 76px ${family}`;
  const mark = `500 30px ui-monospace, monospace`;
  ctx.font = main;
  const tw = ctx.measureText(text).width;
  ctx.font = mark;
  const mw = ctx.measureText("750 · QLT").width;
  const W = Math.ceil(tw + mw + 140);
  c.width = W;
  c.height = H;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);
  ctx.filter = "blur(1.2px)";
  ctx.fillStyle = "#3c3c3c";
  ctx.textBaseline = "middle";
  ctx.font = main;
  ctx.fillText(text, 40, H / 2 + 4);
  ctx.font = mark;
  ctx.fillText("750 · QLT", tw + 100, H / 2 + 4);
  // máscara: solo las letras (y su borde) tocan la superficie; el resto de la franja es transparente y se ve el aro real
  const m = document.createElement("canvas");
  m.width = W;
  m.height = H;
  const mx = m.getContext("2d")!;
  mx.fillStyle = "#000";
  mx.fillRect(0, 0, W, H);
  mx.filter = "blur(2.5px)";
  mx.fillStyle = "#fff";
  mx.textBaseline = "middle";
  mx.font = main;
  mx.fillText(text, 40, H / 2 + 4);
  mx.font = mark;
  mx.fillText("750 · QLT", tw + 100, H / 2 + 4);
  const make = (cv: HTMLCanvasElement, srgb: boolean) => {
    const t = new CanvasTexture(cv);
    if (srgb) t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
    // la franja se ve desde dentro del aro: sin voltearla en vertical, el texto saldría boca abajo
    t.center.set(0.5, 0.5);
    t.repeat.set(1, -1);
    return t;
  };
  return { texture: make(c, true), mask: make(m, false), aspect: W / H };
}

/** Una pieza del kit de Blender por id (null mientras carga o si no hay); al cambiar de id se queda la anterior hasta que llega la nueva. */
function usePiece(id: string | undefined) {
  const [piece, setPiece] = useState<Piece | null>(null);
  useEffect(() => {
    const k = id ? kitPiece(id) : undefined;
    if (!k) return;
    let live = true;
    loadPiece(KIT_BASE + k.archivo, MM)
      .then((p) => live && setPiece(p))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [id]);
  return id ? piece : null;
}

const scaled = (m: Matrix4, k: number) => m.clone().multiply(new Matrix4().makeScale(k, k, k));

/** Un cilindro fino entre dos puntos (garras). */
function placeBetween(m: Mesh, a: Vector3, b: Vector3, r: number) {
  const d = new Vector3().subVectors(b, a);
  m.position.copy(a).addScaledVector(d, 0.5);
  m.scale.set(r, d.length(), r);
  m.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), d.normalize());
}

const LOOK = {
  final: { rough: 0, env: 1, op: 1, dim: 0, wax: 0 },
  boceto: { rough: 0, env: 0.4, op: 0.75, dim: 0, wax: 0 },
  cera: { rough: 0.62, env: 0.35, op: 1, dim: 0, wax: 1 },
  gema: { rough: 0, env: 1, op: 1, dim: 0, wax: 0 },
  apagado: { rough: 0.42, env: 0.45, op: 1, dim: 1, wax: 0 },
} as const;
const WAX = new Color("#3d7a66");
const WHITE = new Color(1, 1, 1);
const SKETCH = new Color("#d9cbb4");

function Ring({ sel: selIn, look: lookIn, light, drag, turntable, framing, pose, onReady, fxTarget, fxAmount, fxVeil, companion }: Omit<RingSceneProps, "active" | "companions">) {
  const root = useRef<Group>(null);
  // lo que se ve va un instante por detrás de lo pedido: el cambio llega cuando el velo está arriba
  const swapKey = `${lookIn}|${JSON.stringify(selIn)}`;
  const [shown, setShown] = useState({ sel: selIn, look: lookIn, key: swapKey });
  const veilAt = useRef(-1);
  // el velo sube desde donde esté (dos cambios seguidos no lo hacen parpadear)
  const veilNow = useRef(0);
  const veilFrom = useRef(0);
  useEffect(() => {
    if (!pose || shown.key === swapKey) return;
    veilAt.current = performance.now();
    veilFrom.current = veilNow.current;
    const id = setTimeout(() => setShown({ sel: selIn, look: lookIn, key: swapKey }), VEIL_IN * 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapKey, pose]);
  const sel = pose ? shown.sel : selIn;
  const look = pose ? shown.look : lookIn;
  const lastPose = useRef<RingPose | null>(null);
  const headGroup = useRef<Group>(null);
  const stoneLift = useRef<Group>(null);
  // posición del puntero en coordenadas de pantalla −1…1 (el lienzo no recibe eventos: se escucha la ventana)
  const cursorNdc = useRef({ x: 0, y: 0, active: false });
  const cursorPos = useRef(new Vector3(2, 2, 3));
  const reducedMotion = typeof matchMedia !== "undefined" && (matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(pointer: fine)").matches);
  const gl = useThree((st) => st.gl);
  useEffect(() => {
    const el = gl.domElement;
    const on = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      cursorNdc.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      cursorNdc.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      cursorNdc.current.active = true;
    };
    const off = () => (cursorNdc.current.active = false);
    addEventListener("pointermove", on, { passive: true });
    document.addEventListener("pointerleave", off);
    return () => {
      removeEventListener("pointermove", on);
      document.removeEventListener("pointerleave", off);
    };
  }, [gl]);
  const engraveMesh = useRef<Mesh>(null);
  const bandMesh = useRef<Mesh>(null);
  const camera = useThree((s) => s.camera);
  const scene = useThree((s) => s.scene);
  const ready = useRef(false);
  const spin = useRef(companion ? 0.6 + companion.side * 2.1 : 0.6);
  const k = useRef({ fc: 0, py: 0, so: 0, fp: 0, px: 0, zm: 1, ex: 0, yaw: 0, fe: 0, y: 0, s: 1, band: 1, rough: 0, env: 1, op: 1, wax: 0, dim: 0, fx: 0 });

  const hammer = useMemo(() => hammerNormals(), []);
  const gemEnv = useGemEnvironment();
  const mount = useRef<Group>(null);
  const paveRef = useRef<Group>(null);
  const mats = useMemo(
    () => ({
      metal: new MeshPhysicalMaterial({ metalness: 1, roughness: 0.15, clearcoat: 0.3, clearcoatRoughness: 0.2 }),
      prong: new MeshPhysicalMaterial({ metalness: 1, roughness: 0.15 }),
    }),
    [],
  );
  const geos = useMemo(() => ({ prong: new CylinderGeometry(1, 1, 1, 10, 1), flat: new BoxGeometry(1, 1, 1), tip: new SphereGeometry(1, 14, 10), melee: stoneGeometry("redonda", 0.045) }), []);
  useEffect(
    () => () => {
      Object.values(mats).forEach((m) => m.dispose());
      Object.values(geos).forEach((g) => g.dispose());
      hammer.dispose();
    },
    [mats, geos, hammer],
  );

  const band = useMemo(() => {
    return sweepBand(sel);
  }, [sel.width, sel.profile]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => band.dispose(), [band]);

  // el grabado: textura de relieve + franja del interior del aro con el arco justo para el texto
  const engraveText = sel.engraving.trim();
  const engrave = useMemo(() => {
    if (!engraveText) return null;
    const font = FONTS.find((f) => f.value === sel.font)?.css ?? "serif";
    const { texture, mask, aspect } = engravingTexture(engraveText, font);
    const r = R0 - 0.004;
    // letra de ~55 % del ancho del aro, más pequeña si el texto no cabe en 1,5 rad (lo que se ve de una vez por dentro)
    const h = Math.min(Math.max(1.6, sel.width) * MM * 0.55, (1.5 * r) / aspect);
    const arc = (aspect * h) / r;
    const geo = new CylinderGeometry(r, r, h, 96, 1, true, -arc / 2, arc);
    geo.rotateX(Math.PI / 2);
    const mat = new MeshPhysicalMaterial({ metalness: 1, roughness: 0.2, map: texture, bumpMap: texture, bumpScale: 4, alphaMap: mask, transparent: true, depthWrite: false, side: BackSide });
    // el charco de luz: un óvalo cálido sobre la pared interior, un poco más grande que el texto y detrás de las letras
    const poolArc = Math.min(Math.PI * 1.2, arc * 1.25);
    const poolGeo = new CylinderGeometry(r + 0.002, r + 0.002, h * 1.9, 96, 1, true, -poolArc / 2, poolArc);
    poolGeo.rotateX(Math.PI / 2);
    const pc = document.createElement("canvas");
    pc.width = 256;
    pc.height = 64;
    const px = pc.getContext("2d")!;
    const grd = px.createRadialGradient(128, 32, 4, 128, 32, 128);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.45, "rgba(255,255,255,0.55)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    px.setTransform(1, 0, 0, 0.25, 0, 24);
    px.fillStyle = grd;
    px.fillRect(0, -96, 256, 256);
    const poolTex = new CanvasTexture(pc);
    const poolMat = new MeshBasicMaterial({ map: poolTex, transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending, side: BackSide, toneMapped: false });
    return { geo, mat, texture, mask, poolGeo, poolMat, poolTex };
  }, [engraveText, sel.font, sel.width]);
  useEffect(
    () => () => {
      engrave?.geo.dispose();
      engrave?.mat.dispose();
      engrave?.texture.dispose();
      engrave?.mask.dispose();
      engrave?.poolGeo.dispose();
      engrave?.poolMat.dispose();
      engrave?.poolTex.dispose();
    },
    [engrave],
  );

  const solitaire = sel.kind === "solitario";
  const R = stoneRadius(sel.carat);
  const stone = useMemo(() => stoneGeometry(sel.shape, stoneRadius(sel.carat)), [sel.shape, sel.carat]);
  useEffect(() => () => stone.dispose(), [stone]);
  const side = useMemo(() => stoneGeometry("redonda", stoneRadius(0.15)), []);
  useEffect(() => () => side.dispose(), [side]);

  // gemas con trazado de rayos: la central (cambia de talla), las laterales de la trilogía y las de pavé y halo
  const coarse = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  const hdr = useHdrCube();
  const gems = useMemo(
    () => ({
      stone: createGemMaterial(gemEnv, stone, !coarse),
      side: createGemMaterial(gemEnv, side, !coarse),
      melee: createGemMaterial(gemEnv, geos.melee, false),
      // las del kit tienen su propia geometría (y sus propios planos de faceta)
      sideKit: createGemMaterial(gemEnv, side, !coarse),
      meleeKit: createGemMaterial(gemEnv, geos.melee, false),
    }),
    [gemEnv, side, geos.melee, coarse], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    for (const g of Object.values(gems)) {
      g.uniforms.uEnv.value = hdr ?? gemEnv;
      g.toneMapped = !hdr;
    }
  }, [gems, hdr, gemEnv]);

  // piezas del kit modelado en Blender: aro, cabeza y su piedra, melé de pavé y halo, laterales de la trilogía
  const kitShank = usePiece(sel.shank || undefined);
  const kitHead = usePiece(sel.kind === "solitario" && sel.head ? sel.head : undefined);
  const kitStone = usePiece(sel.kind === "solitario" && sel.head ? STONE_PIECE[sel.shape] : undefined);
  const kitMelee = usePiece(sel.shank || sel.head ? "piedra-melee" : undefined);
  const kitSide = usePiece(sel.head === "cabeza-trilogia" ? "piedra-brillante" : undefined);
  const useKitHead = !!(sel.kind === "solitario" && sel.head && kitHead?.metal);
  const useKitShank = !!(sel.shank && kitShank?.metal);
  useEffect(() => setGemGeometry(gems.stone, useKitHead && kitStone?.gem ? kitStone.gem : stone), [gems, stone, useKitHead, kitStone]);
  useEffect(() => {
    if (kitMelee?.gem) setGemGeometry(gems.meleeKit, kitMelee.gem);
  }, [gems, kitMelee]);
  useEffect(() => {
    if (kitSide?.gem) setGemGeometry(gems.sideKit, kitSide.gem);
  }, [gems, kitSide]);
  // la cabeza del kit (hecha para 1 ct) se apoya en el anclaje del aro y se escala con los quilates
  const headM = useMemo(() => {
    const base = useKitShank ? kitShank!.anchors.attach_head : undefined;
    return scaled(base ?? new Matrix4().makeTranslation(0, R0 + T, 0), Math.cbrt(sel.carat));
  }, [useKitShank, kitShank, sel.carat]);
  const kitGirdle = useMemo(() => (useKitHead && kitHead!.anchors.seat ? new Vector3().setFromMatrixPosition(headM.clone().multiply(kitHead!.anchors.seat)).y : 0), [useKitHead, kitHead, headM]);
  useEffect(() => () => Object.values(gems).forEach((m) => m.dispose()), [gems]);

  // dónde va cada cosa de la cabeza
  const layout = useMemo(() => {
    const top = R0 + T;
    const classic = sel.setting === "clasico";
    // el clásico monta la piedra baja: el filetín casi a ras del aro
    const girdle = classic ? top + 0.42 * R + 0.02 : top + 0.55 * R + 0.06;
    const n = sel.setting === "garras4" || classic ? 4 : sel.setting === "garras6" || sel.setting === "trilogia" ? 6 : 0;
    const sx = sel.shape === "oval" ? 1.32 : sel.shape === "esmeralda" ? 1.38 : sel.shape === "princesa" ? 1.18 : 1;
    const prongs = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + (n === 4 ? Math.PI / 4 : 0);
      const ex = Math.cos(a) * R * sx * (sel.shape === "princesa" ? 0.86 : 1);
      const ez = Math.sin(a) * R * (sel.shape === "princesa" ? 1.02 : 1);
      // clásico: garras rectas y verticales que bajan hasta el aro; las demás salen de la base y se abren
      if (classic) return { a: new Vector3(ex * 1.04, top - 0.08, ez * 1.04), b: new Vector3(ex * 1.02, girdle + 0.26 * R + 0.02, ez * 1.02) };
      return { a: new Vector3(ex * 0.35, top - 0.02, ez * 0.35), b: new Vector3(ex * 1.02, girdle + 0.07 * R + 0.02, ez * 1.02) };
    });
    const halo = sel.setting === "halo" ? Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2; return new Vector3(Math.cos(a) * (R * sx + 0.075), girdle - 0.02, Math.sin(a) * (R + 0.075)); }) : [];
    const pave = sel.pave && !sel.shank ? Array.from({ length: 14 }, (_, i) => { const f = solitaire ? (i < 7 ? -1.25 + i * 0.13 : 0.47 + (i - 7) * 0.13) : -0.95 + i * 0.146; return f; }) : [];
    return { top, girdle, prongs, halo, pave, sx, classic };
  }, [sel.setting, sel.shape, sel.pave, sel.shank, R, solitaire]);

  useFrame((state, dt) => {
    const g = root.current;
    if (!g) return;
    const s = k.current;
    const kk = Math.min(1, dt * 4);
    const L = LOOK[look];
    // el velo: sube rápido hasta el cambio y baja despacio
    const vt = veilAt.current < 0 ? Infinity : (performance.now() - veilAt.current) / 1000;
    const v0 = veilFrom.current;
    const veil = vt < VEIL_IN ? v0 + (1 - v0) * ease(vt / VEIL_IN) : Math.max(0, 1 - ease(Math.min(1, (vt - VEIL_IN) / VEIL_OUT)));
    veilNow.current = veil;
    if (fxVeil) fxVeil.current = veil;
    const gemOnly = look === "gema" && solitaire;
    // estado animado: aspecto (cera, boceto, apagado) y encuadre (anillo entero o solo la piedra)
    s.band = lerp(s.band, gemOnly ? 0 : 1, kk);
    s.rough = lerp(s.rough, L.rough, kk);
    s.env = lerp(s.env, L.env, kk);
    s.op = lerp(s.op, L.op, kk);
    s.wax = lerp(s.wax, L.wax, kk);
    s.dim = lerp(s.dim, L.dim, kk);
    const wantHead = framing === "head" || gemOnly;
    s.fx = lerp(s.fx, wantHead ? 1 : 0, kk);
    s.fe = lerp(s.fe, framing === "engrave" ? 1 : 0, kk);
    // con pose externa, el scroll ya interpola: se sigue de cerca (sin retraso que la haga ir por detrás del gesto)
    const P = pose?.current;
    if (P) {
      // cuánta transición hay: lo que ha cambiado la pose desde el fotograma anterior, por segundo (el giro pesa menos)
      if (fxAmount) {
        const L = lastPose.current;
        let d = 0;
        if (L) d = Math.abs(P.explode - L.explode) + Math.abs(P.head - L.head) + Math.abs(P.engrave - L.engrave) + Math.abs(P.pave - L.pave) + Math.abs(P.x - L.x) + Math.abs(P.y - L.y) + Math.abs(P.zoom - L.zoom) + Math.abs(P.solo - L.solo) + Math.abs(P.face - L.face) + Math.abs(P.yaw - L.yaw) * 0.3;
        lastPose.current = { ...P };
        fxAmount.current += (Math.min(1.2, (d / Math.max(dt, 1 / 120)) * 0.9) - fxAmount.current) * Math.min(1, dt * 6);
      }
      if (fxTarget && !fxTarget.current) fxTarget.current = root.current;
      const kp = Math.min(1, dt * 9);
      s.fx = lerp(s.fx, Math.max(P.head, gemOnly ? 1 : 0), kp);
      s.fe = lerp(s.fe, P.engrave, kp);
      s.ex = lerp(s.ex, P.explode, kp);
      s.yaw = lerp(s.yaw, P.yaw, kp);
      s.fp = lerp(s.fp, P.pave, kp);
      s.px = lerp(s.px, P.x, kp);
      s.zm = lerp(s.zm, P.zoom, kp);
      s.so = lerp(s.so, P.solo, kp);
      s.py = lerp(s.py, P.y, kp);
      s.fc = lerp(s.fc, P.face, kp);
    } else {
      s.ex = lerp(s.ex, 0, kk);
      s.yaw = lerp(s.yaw, 0, kk);
      s.fp = lerp(s.fp, 0, kk);
      s.px = lerp(s.px, 0, kk);
      s.zm = lerp(s.zm, 1, kk);
    }

    const m = metalOf(sel.metal);
    const base = new Color(m.color);
    const wire = look === "boceto";
    mats.metal.color.copy(base).lerp(WAX, s.wax).lerp(new Color("#7d7468"), s.dim * 0.35);
    // al leer el grabado el metal pasa a satinado: un espejo devuelve el entorno y tapa el relieve; mate, manda la luz rasante
    mats.metal.roughness = Math.min(0.9, (sel.finish === "satinado" ? 0.4 : sel.finish === "martillado" ? 0.2 : m.roughness * 0.7) + s.rough + s.fe * 0.32);
    mats.metal.clearcoat = 0.3 * (1 - s.fe);
    mats.metal.metalness = 1 - s.wax;
    mats.metal.normalMap = sel.finish === "martillado" && !wire ? hammer : null;
    mats.metal.normalScale.set(0.9, 0.9);
    mats.metal.wireframe = wire;
    mats.metal.transparent = s.op < 0.99;
    mats.metal.opacity = s.op;
    if (wire) mats.metal.color.copy(SKETCH);
    mats.prong.color.copy(mats.metal.color);
    mats.prong.roughness = mats.metal.roughness;
    mats.prong.metalness = mats.metal.metalness;
    mats.prong.wireframe = wire;

    const st = stoneOf(sel.stone);
    const diamond = sel.stone.startsWith("diamante");
    for (const [key, g] of Object.entries(gems) as [keyof typeof gems, GemMaterial][]) {
      const u = g.uniforms;
      const colored = key !== "melee" && !diamond;
      // las de color absorben por el camino (Beer–Lambert); el diamante es incoloro
      // normalizado a su canal dominante: la piedra se queda con su color y absorbe los demás
      u.uAbsorb.value.set(colored ? st.color : "#ffffff");
      const peak = Math.max(u.uAbsorb.value.r, u.uAbsorb.value.g, u.uAbsorb.value.b);
      u.uAbsorb.value.multiplyScalar(1 / peak);
      u.uAbsorbK.value = colored ? 1.6 : 0;
      u.uIor.value.copy(key === "melee" || diamond ? (hdr ? SHOW_DIAMOND_IOR : DIAMOND_IOR) : sel.stone === "esmeralda" ? EMERALD_IOR : CORUNDUM_IOR);
      u.uFlat.value.copy(wire ? SKETCH : WAX);
      u.uFlatMix.value = Math.max(s.wax, wire ? 1 : 0);
      u.uDim.value = s.dim;
      u.uOpacity.value = s.op;
      g.transparent = s.op < 0.99;
      g.wireframe = wire;
    }

    // luces: la toma de la sección en vivo
    const c = light?.current ?? FALLBACK;
    const tint = new Color(kelvinToHex(c.kelvin));
    const lights = scene.userData.rig as { key: DirectionalLight; hemi: HemisphereLight; spark: PointLight[]; engrave: PointLight; cursor: PointLight } | undefined;
    // un acompañante solo lee las luces (las mueve el anillo principal); sus gemas sí toman la misma toma
    if (lights && companion) {
      for (const g of Object.values(gems)) {
        const u = g.uniforms;
        u.uTint.value.copy(tint).lerp(WHITE, 0.6);
        u.uEnvI.value = (hdr ? 0.5 + c.softness * 0.25 : 0.55 + c.softness * 0.35) * c.intensity;
        u.uKeyDir.value.copy(lights.key.position).normalize();
        u.uKeyColor.value.copy(tint);
        u.uKeyI.value = (1 - c.softness) * 6 * c.intensity;
      }
    }
    if (lights && !companion) {
      const hard = 1 - c.softness;
      lights.key.color.copy(tint);
      if (c.kind === "rake") {
        // rasante: casi tangente, desde el lado que diga el ángulo
        const a = (c.angle * Math.PI) / 180;
        lights.key.position.set(-6 * Math.cos(a), 0.4 + 6 * Math.sin(a) * 0.15, 0.9);
        lights.key.intensity = 4.2 * c.intensity;
      } else {
        lights.key.position.set((c.x / 100 - 0.5) * 9, (0.5 - c.y / 100) * 8 + 1, 4);
        lights.key.intensity = (1.2 + hard * 2.8) * c.intensity;
      }
      lights.hemi.color.copy(tint);
      lights.hemi.intensity = (0.12 + c.ambient * 0.7) * c.intensity;
      const t = state.clock.elapsedTime;
      // luz del grabado: rasante, casi pegada a la pared interior del aro, del lado del que viene la luz de la toma
      if (lights.engrave) {
        // rasante de verdad: pegada a la pared, dentro del ancho del aro, y barriendo despacio de un lado a otro
        lights.engrave.color.copy(tint).lerp(WHITE, 0.4);
        lights.engrave.intensity = s.fe * 9;
        const side = Math.sin(t * 0.4) * 0.45;
        lights.engrave.position.copy(new Vector3(side - 0.15, -R0 + 0.12, 0.02).applyEuler(g.rotation));
      }
      if (engrave) {
        // el charco sigue a la luz y respira un poco: se nota que hay una lámpara que se mueve
        engrave.poolMat.color.copy(tint).lerp(WHITE, 0.3);
        engrave.poolMat.opacity = s.fe * (0.32 + Math.sin(t * 0.8) * 0.04);
      }
      // luz del puntero: sigue a la posición del ratón en el mundo con retraso y desplazada hacia arriba y hacia la cámara
      if (lights.cursor) {
        const pt = cursorNdc.current;
        const live = pt.active && !reducedMotion;
        // a la profundidad del anillo (su centro proyectado), y luego un poco hacia la cámara: ilumina la cara que ves
        const depth = g.getWorldPosition(new Vector3()).project(camera).z;
        const target = new Vector3(pt.x, pt.y, depth).unproject(camera);
        target.lerp(camera.position, 0.28);
        target.add(new Vector3(0.25, 0.3, 0));
        cursorPos.current.lerp(target, Math.min(1, dt * 2.6));
        lights.cursor.position.copy(cursorPos.current);
        lights.cursor.color.set("#ffe2b8");
        lights.cursor.intensity = lerp(lights.cursor.intensity, live ? 5 : 0, Math.min(1, dt * 3));
      }
      lights.spark.forEach((p, i) => {
        p.color.copy(tint).lerp(WHITE, veil * 0.6);
        // con el velo, los destellos se encienden fuerte y barren deprisa la piedra y el metal
        p.intensity = c.sparkle * hard * 9 * (1 - s.dim) + veil * 34;
        const a = t * (0.7 + i * 0.25) + i * 2.1 + veil * veil * (2 + i) * 1.8;
        p.position.set(Math.cos(a) * 1.4 + (c.x / 100 - 0.5) * 3, 2.2 + Math.sin(a * 1.3) * 0.5, 2.4);
      });
      // la misma toma ilumina las gemas: tinte del entorno, intensidad y el reflejo del foco principal
      for (const g of Object.values(gems)) {
        const u = g.uniforms;
        // el tinte de la luz se suaviza en la piedra: un diamante incoloro no debe leerse como piedra de color
        u.uTint.value.copy(tint).lerp(WHITE, 0.6);
        // con el HDR la piedra ve un estudio real: menos multiplicador (si no, se quema)
        u.uEnvI.value = (hdr ? 0.5 + c.softness * 0.25 : 0.55 + c.softness * 0.35) * c.intensity;
        u.uKeyDir.value.copy(lights.key.position).normalize();
        u.uKeyColor.value.copy(tint);
        u.uKeyI.value = (1 - c.softness) * 6 * c.intensity * (1 + veil * 3);
        u.uEnvI.value *= 1 + veil * 0.7;
      }
      // difusa = más entorno (brillo); dura = menos entorno y más foco (fuego)
      (scene as unknown as { environmentIntensity: number }).environmentIntensity = (0.25 + c.softness * 0.95) * c.intensity * s.env * (1 + veil * 0.6);
    }

    if (engrave) {
      engrave.mat.color.copy(mats.metal.color);
      engrave.mat.roughness = Math.min(0.9, mats.metal.roughness + 0.1);
      engrave.mat.wireframe = wire;
    }
    // giro: solo, con el arrastre y un balanceo leve. Al grabar se para de frente (la vuelta entera más cercana) y el
    // arrastre inclina el aro: así cambia el ángulo de la luz rasante sobre las letras
    if (framing === "engrave" || s.fe > 0.5) spin.current = lerp(spin.current, Math.round(spin.current / (Math.PI * 2)) * Math.PI * 2, kk);
    // de frente: el giro se para con el aro de cara (la vuelta entera más cercana, contando el giro de la pose)
    else if (s.fc > 0.5) spin.current = lerp(spin.current, Math.round((spin.current + s.yaw) / (Math.PI * 2)) * Math.PI * 2 - s.yaw, kk);
    else if (turntable) spin.current += dt * (companion ? 0.28 : 0.35);
    g.rotation.y = spin.current + s.yaw + drag.current * (1 - s.fe * 0.7);
    // el eje de giro se inclina hacia quien mira: la cabeza (y sus piedras) queda de cara a la cámara
    g.rotation.x = lerp(lerp(lerp(0.62, 0.85, s.fx), 0.3, s.fe), 0.06, s.fc);
    // de frente, un balanceo leve para que no parezca una foto
    if (s.fc > 1e-3) g.rotation.y += Math.sin(state.clock.elapsedTime * 0.5) * 0.14 * s.fc;
    const bm = bandMesh.current;
    // «solo»: el aro, la montura y el pavé están fuera (pequeños y abajo) y llegan volando a montarse alrededor de la piedra
    const arrive = 1 - s.so;
    const hide = Math.max(0.001, s.band * arrive);
    if (bm) bm.position.y = -s.so * 1.6;
    if (paveRef.current) paveRef.current.position.y = -s.so * 1.6;
    if (mount.current) mount.current.position.y = -s.so * 0.9;
    if (bm) {
      bm.visible = s.band > 0.02;
      bm.scale.setScalar(hide);
    }
    if (paveRef.current) {
      paveRef.current.visible = s.band > 0.02;
      // en el despiece, la melé se separa un poco del aro hacia fuera
      paveRef.current.scale.setScalar(hide * (1 + s.ex * 0.12));
    }
    // despiece: la cabeza sube del aro y la piedra sale de la cabeza
    if (engraveMesh.current) engraveMesh.current.visible = s.band > 0.02 && s.so < 0.5;
    if (headGroup.current) headGroup.current.position.y = s.ex * 0.85;
    if (stoneLift.current) stoneLift.current.position.y = (s.ex * 0.75) / (useKitHead ? Math.cbrt(sel.carat) : 1);
    if (mount.current) {
      mount.current.visible = s.band > 0.02;
      mount.current.scale.setScalar(hide);
    }
    // un acompañante no toca la cámara: se coloca a su lado del principal según el `trio` de la pose de este, y llega
    // subiendo desde abajo
    if (companion) {
      const e = ease(Math.min(1, Math.max(0, companion.host.current.trio)));
      g.visible = e > 0.01;
      g.position.set(companion.side * 2.55, 0.05 - (1 - e) * 2.4, -1.3);
      g.scale.setScalar(Math.max(0.001, 0.74 * e));
      return;
    }
    // cámara: el anillo entero o la cabeza de cerca (la cabeza está en el eje Y local: el giro en Y no la mueve)
    const gy = solitaire ? (useKitHead ? kitGirdle : layout.girdle) : R0 + T;
    const head = new Vector3(0, gy, 0).applyEuler(g.rotation);
    // el despiece necesita más altura de cuadro: la cámara se aleja y apunta más arriba
    const far = new Vector3(0, 0.6 + s.ex * 0.8, (7.2 + s.ex * 3.4) * s.zm);
    const near = new Vector3(head.x, head.y + 0.8 + R * 1.2, head.z + 1.2 + R * 2.8);
    camera.position.copy(far).lerp(near, s.fx);
    const aim = new Vector3(0, (solitaire ? 0.25 : 0) + s.ex * 0.75, 0).lerp(head, s.fx);
    // grabado: la cámara entra por la boca del aro y mira la parte de abajo por dentro
    const bottom = new Vector3(0, -R0, 0).applyEuler(g.rotation);
    // más cerca cuanto más estrecho es el aro: la letra mide la mitad del ancho y tiene que leerse
    // y más lejos en lienzos estrechos (la portada es más alta que ancha): el arco del grabado tiene que caber a lo ancho
    const aspect = (camera as unknown as { aspect: number }).aspect || 1;
    const closeIn = Math.min(1.15, Math.max(0.55, (useKitShank ? 2.2 : sel.width) / 3.5)) * (aspect < 1 ? 0.86 : 1);
    camera.position.lerp(new Vector3(bottom.x, bottom.y + 1.85 * closeIn, bottom.z + 1.95 * closeIn), s.fe);
    aim.lerp(bottom, s.fe);
    // de cerca del hombro: el pavé del aro y las garras de la cabeza en el mismo cuadro
    // más abajo del hombro (1,25 rad) y la cámara por fuera del aro: el pavé de frente y la cabeza al fondo, sin meterse en la piedra
    const shoulder = new Vector3(Math.sin(1.25) * (R0 + T), Math.cos(1.25) * (R0 + T), 0).applyEuler(g.rotation);
    const outward = new Vector3(Math.sin(1.25), Math.cos(1.25), 0).applyEuler(g.rotation);
    camera.position.lerp(shoulder.clone().addScaledVector(outward, 1.7).add(new Vector3(0, 0.35, 1.6)), s.fp);
    aim.lerp(shoulder, s.fp);
    // el anillo cae a un lado de la pantalla: la cámara y su punto de mira se desplazan en paralelo hacia el otro
    if (Math.abs(s.px) > 1e-3 || Math.abs(s.py) > 1e-3) {
      const dir = new Vector3().subVectors(aim, camera.position);
      const dist = dir.length();
      const right = new Vector3().crossVectors(dir, new Vector3(0, 1, 0)).normalize();
      const up = new Vector3().crossVectors(right, dir).normalize();
      const cam = camera as unknown as { fov: number; aspect: number };
      const halfH = dist * Math.tan(((cam.fov || 30) * Math.PI) / 360);
      const halfW = halfH * (cam.aspect || 1);
      const shift = right.multiplyScalar(-s.px * 2 * halfW).addScaledVector(up, -s.py * 2 * halfH);
      camera.position.add(shift);
      aim.add(shift);
    }
    camera.lookAt(aim);

    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  });

  return (
    <group ref={root}>
      <mesh ref={bandMesh} geometry={useKitShank ? kitShank!.metal! : band} material={mats.metal} />
      {engrave && <mesh geometry={engrave.poolGeo} material={engrave.poolMat} renderOrder={1} />}
      {engrave && <mesh ref={engraveMesh} geometry={engrave.geo} material={engrave.mat} renderOrder={2} />}
      <group ref={paveRef}>
      {useKitShank &&
        kitMelee?.gem &&
        anchorsOf(kitShank, "pave_").map((m, i) => <mesh key={`kp${i}`} geometry={kitMelee.gem!} material={gems.meleeKit} matrixAutoUpdate={false} matrix={m} />)}
      {layout.pave.map((f, i) => {
        const r = R0 + T + 0.012;
        const p = new Vector3(Math.sin(f) * r, Math.cos(f) * r, 0);
        return <mesh key={`p${i}`} geometry={geos.melee} material={gems.melee} position={p} rotation={[0, 0, -f]} />;
      })}
      </group>
      {solitaire && useKitHead && (
        <group ref={headGroup}>
          <group matrixAutoUpdate={false} matrix={headM}>
            <group ref={stoneLift}>{kitStone?.gem && kitHead!.anchors.seat && <mesh geometry={kitStone.gem} material={gems.stone} matrixAutoUpdate={false} matrix={kitHead!.anchors.seat} />}</group>
            <group ref={mount}>
              <mesh geometry={kitHead!.metal!} material={mats.prong} />
              {kitMelee?.gem && anchorsOf(kitHead, "halo_").map((m, i) => <mesh key={`kh${i}`} geometry={kitMelee.gem!} material={gems.meleeKit} matrixAutoUpdate={false} matrix={scaled(m, 1.1 / 1.3)} />)}
              {kitSide?.gem &&
                (["seat_side_L", "seat_side_R"] as const).map((n) =>
                  kitHead!.anchors[n] ? <mesh key={n} geometry={kitSide.gem!} material={gems.sideKit} matrixAutoUpdate={false} matrix={scaled(kitHead!.anchors[n], Math.cbrt(0.25))} /> : null,
                )}
            </group>
          </group>
        </group>
      )}
      {solitaire && !useKitHead && (
        <group ref={headGroup}>
          <group ref={stoneLift}>
            <mesh geometry={stone} material={gems.stone} position={[0, layout.girdle, 0]} />
          </group>
          <group ref={mount}>
          {layout.prongs.map((p, i) =>
            layout.classic ? (
              // garra plana de sección cuadrada, cortada en recto, orientada hacia el centro de la piedra
              <mesh key={`g${i}`} geometry={geos.flat} material={mats.prong} rotation={[0, -Math.atan2(p.b.z, p.b.x), 0]} position={[(p.a.x + p.b.x) / 2, (p.a.y + p.b.y) / 2, (p.a.z + p.b.z) / 2]} scale={[0.07, p.b.y - p.a.y, 0.06]} />
            ) : (
              <group key={`g${i}`}>
                <mesh geometry={geos.prong} material={mats.prong} ref={(m) => m && placeBetween(m, p.a, p.b, 0.022)} />
                <mesh geometry={geos.tip} material={mats.prong} position={p.b} scale={0.03} />
              </group>
            ),
          )}
          {layout.classic && (
            // galería: el aro fino que une las garras por debajo de la piedra
            <mesh material={mats.prong} position={[0, layout.top + 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[R * 0.98, 0.022, 10, 48]} />
            </mesh>
          )}
          {sel.setting === "bisel" && (
            <mesh material={mats.prong} position={[0, layout.girdle - 0.02, 0]} scale={[R * layout.sx + 0.05, 0.13, R + 0.05]}>
              <cylinderGeometry args={[1, 0.82, 1, 48, 1, true]} />
            </mesh>
          )}
          {sel.setting !== "bisel" && !layout.classic && (
            <mesh material={mats.prong} position={[0, layout.top + 0.05, 0]} scale={[R * 0.42, 0.08, R * 0.42]}>
              <cylinderGeometry args={[1, 1, 1, 24, 1, true]} />
            </mesh>
          )}
          {layout.halo.map((p, i) => (
            <mesh key={`h${i}`} geometry={geos.melee} material={gems.melee} position={p} scale={1.15} />
          ))}
          {sel.setting === "trilogia" &&
            [-1, 1].map((sgn) => {
              const a = sgn * (0.3 + R * 0.4);
              const r = R0 + T + stoneRadius(0.15) * 0.55 + 0.03;
              return <mesh key={`t${sgn}`} geometry={side} material={gems.side} position={[Math.sin(a) * r, Math.cos(a) * r, 0]} rotation={[0, 0, -a]} />;
            })}
          </group>
        </group>
      )}
    </group>
  );
}

/** Las luces de la escena: foco principal, cielo/suelo y tres puntos que hacen los destellos. Se guardan en `scene.userData.rig`. */
function Rig() {
  const scene = useThree((s) => s.scene);
  const key = useRef<DirectionalLight>(null);
  const hemi = useRef<HemisphereLight>(null);
  const sparks = useRef<(PointLight | null)[]>([]);
  const engrave = useRef<PointLight>(null);
  const cursor = useRef<PointLight>(null);
  useEffect(() => {
    scene.userData.rig = { key: key.current, hemi: hemi.current, spark: sparks.current.filter(Boolean), engrave: engrave.current, cursor: cursor.current };
    return () => {
      delete scene.userData.rig;
    };
  }, [scene]);
  return (
    <>
      <directionalLight ref={key} intensity={2} position={[3, 3, 4]} />
      <hemisphereLight ref={hemi} args={["#ffffff", "#20180f", 0.3]} />
      {[0, 1, 2].map((i) => (
        <pointLight key={i} ref={(p) => { sparks.current[i] = p; }} intensity={0} distance={6} decay={1.4} />
      ))}
      {/* el grabado: una luz pequeña y rasante que se enciende cuando la cámara entra en el aro */}
      <pointLight ref={engrave} intensity={0} distance={2.2} decay={1.6} />
      {/* el puntero: una luz cálida que lo sigue con retraso y algo apartada, como una linterna en la mano */}
      <pointLight ref={cursor} intensity={0} distance={7} decay={1.3} />
    </>
  );
}

const NO_DRAG = { current: 0 };
const noop = () => {};

export default function RingScene({ active, motionFx = false, companions, ...props }: RingSceneProps) {
  const coarse = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  const fxTarget = useRef<Object3D | null>(null);
  const fxAmount = useRef(0);
  const fxVeil = useRef(0);
  const fx = motionFx && !!props.pose && !coarse;
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={[1, coarse ? 1.5 : 2]} gl={{ alpha: true, antialias: true }} camera={{ fov: 30, position: [0, 0.55, 5.6], near: 0.05, far: 40 }} style={{ pointerEvents: "none" }}>
      <Environment light={props.light} />
      <Rig />
      <Ring {...props} fxTarget={fx ? fxTarget : undefined} fxAmount={fx ? fxAmount : undefined} fxVeil={fxVeil} />
      {props.pose &&
        companions?.map((c) => (
          <Ring key={c.side} sel={c.sel} look="final" light={props.light} drag={NO_DRAG} turntable framing="ring" pose={null} onReady={noop} companion={{ side: c.side, host: props.pose! }} />
        ))}
      {fx && <MotionFx target={fxTarget} amount={fxAmount} veil={fxVeil} />}
    </Canvas>
  );
}
