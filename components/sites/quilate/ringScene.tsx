"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  BufferGeometry as Geometry,
  CanvasTexture,
  Float32BufferAttribute,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  LatheGeometry,
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
  type Mesh,
} from "three";
import { kelvinToHex, type LightCue } from "@/lib/ui/light";
import { metalOf, stoneOf, type RingSel, type Shape } from "./ring";

/*
 * El anillo de Quilate como escena procedural, sin modelos: el aro es una revolución de su sección (confort, media caña o
 * plana), la piedra una revolución facetada (flatShading) de su perfil de talla, y garras, bisel, halo, trilogía y pavé se
 * colocan alrededor. Las luces no son fijas: cada fotograma leen la toma de luz de la sección (LightScroll → `light`) y se
 * colocan como dice su finalidad (foco con destellos, difusa de día, rasante…). docs/18 §5.
 *
 * Unidades: radio interior del aro = 1 ≈ 8,5 mm (talla 14). El aro vive en el plano XY con la cabeza hacia +Y.
 */

export type RingLook = "final" | "boceto" | "cera" | "gema" | "apagado";

export type RingSceneProps = {
  sel: RingSel;
  look: RingLook;
  /** la toma de luz en vivo (de `useLight()`); sin ella, una luz de vitrina fija */
  light: MutableRefObject<LightCue> | null;
  /** giro añadido por el arrastre (radianes) */
  drag: MutableRefObject<number>;
  turntable: boolean;
  /** encuadre: el anillo entero o la cabeza de cerca */
  framing: "ring" | "head";
  active: boolean;
  onReady: () => void;
};

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
    // confort: superelipse (rectángulo de cantos muy redondeados)
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

/** Radio de la piedra (unidades) por quilates: un brillante de 1 ct mide ~6,5 mm. */
export const stoneRadius = (carat: number) => ((6.5 * Math.cbrt(carat)) / 2) * MM;

/**
 * Talla brillante simplificada (49 facetas): mesa octogonal, 8 estrellas, 8 cometas, 16 medias lunas de corona, faja, 16
 * facetas bajas de pabellón y 8 principales hasta la culata. Triángulos sueltos: cada faceta tiene su normal (el mosaico de
 * reflejos claros y oscuros que hace brillar una piedra).
 */
function brilliantGeometry(R: number): BufferGeometry {
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

function Environment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const env = new RoomEnvironment();
    const rt = pmrem.fromScene(env, 0.03);
    scene.environment = rt.texture;
    return () => {
      scene.environment = null;
      rt.dispose();
      pmrem.dispose();
      env.dispose();
    };
  }, [gl, scene]);
  return null;
}

/**
 * Entorno propio de las gemas: sala negra con seis paneles de luz pequeños. Una piedra facetada se lee por el contraste entre
 * facetas que reflejan un panel y facetas que reflejan negro (el «patrón» de GIA); con el entorno claro del metal se vería
 * blanca y lechosa. Mismo truco que los configuradores con un mapa para el metal y otro para la gema (docs/18 §3).
 */
function useGemEnvironment() {
  const gl = useThree((s) => s.gl);
  const [tex, dispose] = useMemo(() => {
    const scene = new Scene();
    scene.background = new Color(0.03, 0.03, 0.035);
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
    panels.forEach(([x, y, z, w, h]) => {
      const m = new ThreeMesh(geo, mat);
      m.position.set(x, y, z);
      m.scale.set(w, h, 1);
      m.lookAt(0, 0, 0);
      scene.add(m);
    });
    const pmrem = new PMREMGenerator(gl);
    const rt = pmrem.fromScene(scene, 0.01);
    pmrem.dispose();
    return [rt.texture as Texture, () => { rt.dispose(); geo.dispose(); mat.dispose(); }] as const;
  }, [gl]);
  useEffect(() => dispose, [dispose]);
  return tex;
}

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
const SKETCH = new Color("#d9cbb4");

function Ring({ sel, look, light, drag, turntable, framing, onReady }: Omit<RingSceneProps, "active">) {
  const root = useRef<Group>(null);
  const head = useRef<Group>(null);
  const bandMesh = useRef<Mesh>(null);
  const camera = useThree((s) => s.camera);
  const scene = useThree((s) => s.scene);
  const ready = useRef(false);
  const spin = useRef(0.6);
  const k = useRef({ y: 0, s: 1, band: 1, rough: 0, env: 1, op: 1, wax: 0, dim: 0, fx: 0 });

  const hammer = useMemo(() => hammerNormals(), []);
  const gemEnv = useGemEnvironment();
  const mount = useRef<Group>(null);
  const paveRef = useRef<Group>(null);
  const mats = useMemo(
    () => ({
      metal: new MeshPhysicalMaterial({ metalness: 1, roughness: 0.15, clearcoat: 0.3, clearcoatRoughness: 0.2 }),
      prong: new MeshPhysicalMaterial({ metalness: 1, roughness: 0.15 }),
      stone: new MeshPhysicalMaterial({ metalness: 0.1, roughness: 0, flatShading: true, clearcoat: 1, clearcoatRoughness: 0, ior: 2.4, specularIntensity: 1, iridescence: 1, iridescenceIOR: 1.9, iridescenceThicknessRange: [180, 620], envMapIntensity: 3.2 }),
      melee: new MeshPhysicalMaterial({ metalness: 0.1, roughness: 0, flatShading: true, color: new Color("#4d5258"), clearcoat: 1, iridescence: 0.9, iridescenceIOR: 1.9, envMapIntensity: 3.2 }),
    }),
    [],
  );
  const geos = useMemo(() => ({ prong: new CylinderGeometry(1, 1, 1, 10, 1), tip: new SphereGeometry(1, 14, 10), melee: stoneGeometry("redonda", 0.045) }), []);
  useEffect(() => {
    mats.stone.envMap = gemEnv;
    mats.melee.envMap = gemEnv;
  }, [mats, gemEnv]);
  useEffect(
    () => () => {
      Object.values(mats).forEach((m) => m.dispose());
      Object.values(geos).forEach((g) => g.dispose());
      hammer.dispose();
    },
    [mats, geos, hammer],
  );

  const band = useMemo(() => {
    const g = new LatheGeometry(bandProfile(sel), 160);
    g.rotateX(Math.PI / 2);
    return g;
  }, [sel.width, sel.profile]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => band.dispose(), [band]);

  const solitaire = sel.kind === "solitario";
  const R = stoneRadius(sel.carat);
  const stone = useMemo(() => stoneGeometry(sel.shape, stoneRadius(sel.carat)), [sel.shape, sel.carat]);
  useEffect(() => () => stone.dispose(), [stone]);
  const side = useMemo(() => stoneGeometry("redonda", stoneRadius(0.15)), []);
  useEffect(() => () => side.dispose(), [side]);

  // dónde va cada cosa de la cabeza
  const layout = useMemo(() => {
    const top = R0 + T;
    const girdle = top + 0.55 * R + 0.06;
    const n = sel.setting === "garras4" ? 4 : sel.setting === "garras6" || sel.setting === "trilogia" ? 6 : 0;
    const sx = sel.shape === "oval" ? 1.32 : sel.shape === "esmeralda" ? 1.38 : sel.shape === "princesa" ? 1.18 : 1;
    const prongs = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + (n === 4 ? Math.PI / 4 : 0);
      const ex = Math.cos(a) * R * sx * (sel.shape === "princesa" ? 0.86 : 1);
      const ez = Math.sin(a) * R * (sel.shape === "princesa" ? 1.02 : 1);
      return { a: new Vector3(ex * 0.35, top - 0.02, ez * 0.35), b: new Vector3(ex * 1.02, girdle + 0.07 * R + 0.02, ez * 1.02) };
    });
    const halo = sel.setting === "halo" ? Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2; return new Vector3(Math.cos(a) * (R * sx + 0.075), girdle - 0.02, Math.sin(a) * (R + 0.075)); }) : [];
    const pave = sel.pave ? Array.from({ length: 14 }, (_, i) => { const f = solitaire ? (i < 7 ? -1.25 + i * 0.13 : 0.47 + (i - 7) * 0.13) : -0.95 + i * 0.146; return f; }) : [];
    return { top, girdle, prongs, halo, pave, sx };
  }, [sel.setting, sel.shape, sel.pave, R, solitaire]);

  useFrame((state, dt) => {
    const g = root.current;
    if (!g) return;
    const s = k.current;
    const kk = Math.min(1, dt * 4);
    const L = LOOK[look];
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

    const m = metalOf(sel.metal);
    const base = new Color(m.color);
    const wire = look === "boceto";
    mats.metal.color.copy(base).lerp(WAX, s.wax).lerp(new Color("#7d7468"), s.dim * 0.35);
    mats.metal.roughness = Math.min(0.9, (sel.finish === "satinado" ? 0.4 : sel.finish === "martillado" ? 0.2 : m.roughness * 0.7) + s.rough);
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
    mats.stone.color.set(st.color).multiplyScalar(sel.stone.startsWith("diamante") ? 0.1 : 0.45).lerp(WAX, s.wax).lerp(new Color("#8a8a86"), s.dim * 0.5);
    mats.stone.iridescence = st.iridescence * (1 - s.dim) * (1 - s.wax);
    mats.stone.wireframe = wire;
    mats.stone.transparent = s.op < 0.99;
    mats.stone.opacity = s.op;
    mats.stone.envMapIntensity = 3.2 * (1 - s.dim * 0.75);
    mats.melee.wireframe = wire;
    mats.melee.color.set("#4d5258").lerp(WAX, s.wax).lerp(new Color("#8a8a86"), s.dim * 0.5);
    mats.melee.iridescence = 0.9 * (1 - s.dim) * (1 - s.wax);

    // luces: la toma de la sección en vivo
    const c = light?.current ?? FALLBACK;
    const tint = new Color(kelvinToHex(c.kelvin));
    const lights = scene.userData.rig as { key: DirectionalLight; hemi: HemisphereLight; spark: PointLight[] } | undefined;
    if (lights) {
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
      lights.spark.forEach((p, i) => {
        p.color.copy(tint);
        p.intensity = c.sparkle * hard * 9 * (1 - s.dim);
        const a = t * (0.7 + i * 0.25) + i * 2.1;
        p.position.set(Math.cos(a) * 1.4 + (c.x / 100 - 0.5) * 3, 2.2 + Math.sin(a * 1.3) * 0.5, 2.4);
      });
      // difusa = más entorno (brillo); dura = menos entorno y más foco (fuego)
      (scene as unknown as { environmentIntensity: number }).environmentIntensity = (0.25 + c.softness * 0.95) * c.intensity * s.env;
    }

    // giro: solo, con el arrastre y un balanceo leve
    if (turntable) spin.current += dt * 0.35;
    g.rotation.y = spin.current + drag.current;
    // el eje de giro se inclina hacia quien mira: la cabeza (y sus piedras) queda de cara a la cámara
    g.rotation.x = lerp(0.62, 0.85, s.fx);
    const bm = bandMesh.current;
    const hide = Math.max(0.001, s.band);
    if (bm) {
      bm.visible = s.band > 0.02;
      bm.scale.setScalar(hide);
    }
    if (paveRef.current) {
      paveRef.current.visible = s.band > 0.02;
      paveRef.current.scale.setScalar(hide);
    }
    if (mount.current) {
      mount.current.visible = s.band > 0.02;
      mount.current.scale.setScalar(hide);
    }
    // cámara: el anillo entero o la cabeza de cerca (la cabeza está en el eje Y local: el giro en Y no la mueve)
    const gy = solitaire ? layout.girdle : R0 + T;
    const head = new Vector3(0, gy, 0).applyEuler(g.rotation);
    const far = new Vector3(0, 0.6, 7.2);
    const near = new Vector3(head.x, head.y + 0.8 + R * 1.2, head.z + 1.2 + R * 2.8);
    camera.position.copy(far).lerp(near, s.fx);
    const aim = new Vector3(0, solitaire ? 0.25 : 0, 0).lerp(head, s.fx);
    camera.lookAt(aim);

    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  });

  return (
    <group ref={root}>
      <mesh ref={bandMesh} geometry={band} material={mats.metal} />
      <group ref={paveRef}>
      {layout.pave.map((f, i) => {
        const r = R0 + T + 0.012;
        const p = new Vector3(Math.sin(f) * r, Math.cos(f) * r, 0);
        return <mesh key={`p${i}`} geometry={geos.melee} material={mats.melee} position={p} rotation={[0, 0, -f]} />;
      })}
      </group>
      {solitaire && (
        <group ref={head}>
          <mesh geometry={stone} material={mats.stone} position={[0, layout.girdle, 0]} />
          <group ref={mount}>
          {layout.prongs.map((p, i) => (
            <group key={`g${i}`}>
              <mesh geometry={geos.prong} material={mats.prong} ref={(m) => m && placeBetween(m, p.a, p.b, 0.022)} />
              <mesh geometry={geos.tip} material={mats.prong} position={p.b} scale={0.03} />
            </group>
          ))}
          {sel.setting === "bisel" && (
            <mesh material={mats.prong} position={[0, layout.girdle - 0.02, 0]} scale={[R * layout.sx + 0.05, 0.13, R + 0.05]}>
              <cylinderGeometry args={[1, 0.82, 1, 48, 1, true]} />
            </mesh>
          )}
          {sel.setting !== "bisel" && (
            <mesh material={mats.prong} position={[0, layout.top + 0.05, 0]} scale={[R * 0.42, 0.08, R * 0.42]}>
              <cylinderGeometry args={[1, 1, 1, 24, 1, true]} />
            </mesh>
          )}
          {layout.halo.map((p, i) => (
            <mesh key={`h${i}`} geometry={geos.melee} material={mats.melee} position={p} scale={1.15} />
          ))}
          {sel.setting === "trilogia" &&
            [-1, 1].map((sgn) => {
              const a = sgn * (0.3 + R * 0.4);
              const r = R0 + T + stoneRadius(0.15) * 0.55 + 0.03;
              return <mesh key={`t${sgn}`} geometry={side} material={mats.stone} position={[Math.sin(a) * r, Math.cos(a) * r, 0]} rotation={[0, 0, -a]} />;
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
  useEffect(() => {
    scene.userData.rig = { key: key.current, hemi: hemi.current, spark: sparks.current.filter(Boolean) };
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
    </>
  );
}

export default function RingScene({ active, ...props }: RingSceneProps) {
  const coarse = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={[1, coarse ? 1.5 : 2]} gl={{ alpha: true, antialias: true }} camera={{ fov: 30, position: [0, 0.55, 5.6], near: 0.05, far: 40 }} style={{ pointerEvents: "none" }}>
      <Environment />
      <Rig />
      <Ring {...props} />
    </Canvas>
  );
}
