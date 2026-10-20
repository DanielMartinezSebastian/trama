"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  AdditiveBlending,
  CanvasTexture,
  CapsuleGeometry,
  Color,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  LatheGeometry,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PMREMGenerator,
  PlaneGeometry,
  RepeatWrapping,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  type BufferGeometry,
  type Material,
  type Mesh,
} from "three";
import { baseScale, colorsOf, tiersOf, type CakeSel } from "./cake";

/*
 * La tarta como escena procedural, con oficio de pastelería:
 * - cada piso son capas TORNEADAS (LatheGeometry) con el canto redondeado: bizcocho con miga (textura de ruido como color y
 *   relieve) y crema que asoma un poco entre capas;
 * - la tarta está cortada: una PORCIÓN (cuña de 50°) que se saca hacia delante con «Ver por dentro» (`cut`) y enseña las
 *   capas aunque la tarta esté cubierta; las caras del corte son el perfil real de cada capa;
 * - cobertura con grosor (perfil cerrado torneado): nata y buttercream con marcas de espátula y cordón de manga, ganache
 *   brillante con goterones que acaban en gota, pistacho con picado por encima;
 * - frambuesas de granitos (InstancedMesh), arándanos con corona, flores de cinco pétalos, velas a rayas con mecha y halo, y
 *   una placa de chocolate con el mensaje escrito;
 * - peana de porcelana, sombra de contacto y luz de estudio (RoomEnvironment, sin HDR).
 * Todo se crea una vez (estructura máxima: 3 pisos) y cada fotograma interpola hacia la selección: color, escala, despiece,
 * porción y opacidad. Cambiar una opción anima en lugar de remontar el lienzo.
 */

export type CakeSceneProps = {
  sel: CakeSel;
  /** 0 = montada · 1 = despiece (capas separadas en vertical) */
  explode: MutableRefObject<number>;
  /** 0 = entera · 1 = la porción sacada hacia delante (se ve por dentro) */
  cut: MutableRefObject<number>;
  /** giro añadido por el arrastre del puntero (radianes) */
  drag: MutableRefObject<number>;
  /** gira sola */
  turntable: boolean;
  active: boolean;
  onReady: () => void;
};

/* ---------- medidas ---------- */
const SPONGE_H = 0.2;
const FILL_H = 0.065;
const LAYERS = [0, 1, 0, 1, 0]; // 0 bizcocho · 1 relleno, de abajo arriba
const TIER_H = LAYERS.reduce((h, l) => h + (l ? FILL_H : SPONGE_H), 0);
const TIER_R = [1.12, 0.78, 0.5];
const COVER_T = 0.05;
const MAX_TIERS = 3;
const WEDGE = (50 * Math.PI) / 180; // la porción
const STAND_Y = 0.32; // altura de la peana
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** la porción ocupa los ángulos (−WEDGE/2, WEDGE/2) alrededor de +z, hacia la cámara */
const inSlice = (phi: number) => {
  const a = Math.atan2(Math.sin(phi), Math.cos(phi));
  return Math.abs(a) < WEDGE / 2;
};
const ringAt = (n: number, r: number, phase = 0) => Array.from({ length: n }, (_, i) => {
  const phi = (i / n) * Math.PI * 2 + phase;
  return { phi, x: Math.sin(phi) * r, z: Math.cos(phi) * r };
});

/* ---------- perfiles ---------- */
/** capa unitaria (radio 1, alto 1) con canto redondeado; `bulge` = la crema asoma hacia fuera */
function layerProfile(bevel: number, bulge = 0) {
  const pts: Vector2[] = [new Vector2(0, 0)];
  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    const a = -Math.PI / 2 + (i / steps) * (Math.PI / 2);
    pts.push(new Vector2(1 - bevel + Math.cos(a) * bevel, bevel + Math.sin(a) * bevel * 1.8));
  }
  if (bulge) pts.push(new Vector2(1 + bulge, 0.5));
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * (Math.PI / 2);
    pts.push(new Vector2(1 - bevel + Math.cos(a) * bevel, 1 - bevel * 1.8 + Math.sin(a) * bevel * 1.8));
  }
  pts.push(new Vector2(0, 1));
  // el canto se escala con el alto (1): se limita para que no se cruce
  return pts.map((p) => new Vector2(Math.max(0, p.x), Math.min(1, Math.max(0, p.y))));
}

/** funda de cobertura de un piso: perfil cerrado con grosor, canto superior redondeado */
function coverProfile(R: number, H: number, t: number) {
  const ro = R + t;
  const b = 0.06;
  const pts: Vector2[] = [new Vector2(0, H + t)];
  for (let i = 0; i <= 6; i++) {
    const a = Math.PI / 2 - (i / 6) * (Math.PI / 2);
    pts.push(new Vector2(ro - b + Math.cos(a) * b, H + t - b + Math.sin(a) * b));
  }
  pts.push(new Vector2(ro, 0), new Vector2(R, 0), new Vector2(R, H), new Vector2(0, H));
  return pts;
}

/** UV por caras: arriba y abajo, proyección plana (x, z); en el lateral, ángulo × alto. La miga no se estira hacia el centro. */
function remapUV(g: BufferGeometry, around = 3) {
  g.computeVertexNormals();
  const pos = g.attributes.position;
  const nor = g.attributes.normal;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    if (Math.abs(nor.getY(i)) > 0.6) uv.setXY(i, x * 0.5 + 0.5, z * 0.5 + 0.5);
    else uv.setXY(i, (Math.atan2(x, z) / (Math.PI * 2) + 0.5) * around, y);
  }
  uv.needsUpdate = true;
  return g;
}

/* ---------- texturas generadas ---------- */
function canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, srgb = true) {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  draw(cv.getContext("2d")!);
  const t = new CanvasTexture(cv);
  t.wrapS = t.wrapT = RepeatWrapping;
  if (srgb) t.colorSpace = SRGBColorSpace;
  return t;
}
/** miga: alveolos claros y oscuros sobre gris medio (se multiplica por el color del bizcocho) */
const crumbTex = () =>
  canvasTex(256, 256, (c) => {
    c.fillStyle = "#d8d8d8";
    c.fillRect(0, 0, 256, 256);
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 2600; i++) {
      const r = 0.6 + rnd() * 2.6;
      const v = rnd() < 0.55 ? 150 + rnd() * 60 : 235 + rnd() * 20;
      c.fillStyle = `rgb(${v},${v},${v})`;
      c.beginPath();
      c.arc(rnd() * 256, rnd() * 256, r, 0, Math.PI * 2);
      c.fill();
    }
  }, false);
/** espátula: franjas horizontales suaves (relieve de la buttercream y la nata alisada) */
const spatulaTex = () =>
  canvasTex(64, 256, (c) => {
    for (let y = 0; y < 256; y++) {
      const v = 200 + Math.sin(y * 0.19) * 22 + Math.sin(y * 0.047) * 18;
      c.fillStyle = `rgb(${v},${v},${v})`;
      c.fillRect(0, y, 64, 1);
    }
  }, false);
/** rayas de vela: espiral blanca y frambuesa */
const candleTex = () =>
  canvasTex(64, 256, (c) => {
    c.fillStyle = "#fbf6ef";
    c.fillRect(0, 0, 64, 256);
    c.fillStyle = "#d4566f";
    for (let y = -64; y < 320; y += 40) {
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(64, y + 32);
      c.lineTo(64, y + 46);
      c.lineTo(0, y + 14);
      c.fill();
    }
  });
/** sombra de contacto: degradado radial (alfa) */
const shadowTex = () =>
  canvasTex(128, 128, (c) => {
    const g = c.createRadialGradient(64, 64, 4, 64, 64, 64);
    g.addColorStop(0, "rgba(40,20,24,0.55)");
    g.addColorStop(0.55, "rgba(40,20,24,0.18)");
    g.addColorStop(1, "rgba(40,20,24,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, 128, 128);
  });
const glowTex = () =>
  canvasTex(64, 64, (c) => {
    const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,210,140,0.9)");
    g.addColorStop(1, "rgba(255,160,60,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, 64, 64);
  });
function plaqueTex(text: string) {
  return canvasTex(512, 160, (c) => {
    c.fillStyle = "#3a2017";
    c.fillRect(0, 0, 512, 160);
    c.fillStyle = "#fbf3e6";
    c.textAlign = "center";
    c.textBaseline = "middle";
    let size = 70;
    c.font = `italic 500 ${size}px Fraunces, Georgia, serif`;
    while (c.measureText(text).width > 470 && size > 28) c.font = `italic 500 ${(size -= 4)}px Fraunces, Georgia, serif`;
    c.fillText(text, 256, 84);
  });
}

function Environment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const env = new RoomEnvironment();
    const rt = pmrem.fromScene(env, 0.04);
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

/* ---------- recursos compartidos (se crean una vez y se liberan al desmontar) ---------- */
function useResources() {
  return useMemo(() => {
    const seg = 96;
    const body = (bulge: number) => remapUV(new LatheGeometry(layerProfile(0.05, bulge), seg, WEDGE / 2, Math.PI * 2 - WEDGE), 30);
    const slice = (bulge: number) => remapUV(new LatheGeometry(layerProfile(0.05, bulge), 10, -WEDGE / 2, WEDGE), 30);
    // cara del corte: el mismo perfil, plano (se orienta a cada lado de la porción)
    const capShape = (bulge: number) => new ShapeGeometry(new Shape(layerProfile(0.05, bulge)), 4);
    const geo = {
      sponge: { body: body(0), slice: slice(0), cap: capShape(0) },
      filling: { body: body(0.025), slice: slice(0.025), cap: capShape(0.025) },
      cover: TIER_R.map((R) => {
        const p = coverProfile(R, TIER_H, COVER_T);
        return { body: remapUV(new LatheGeometry(p, seg, WEDGE / 2, Math.PI * 2 - WEDGE), 8), slice: remapUV(new LatheGeometry(p, 10, -WEDGE / 2, WEDGE), 8), cap: new ShapeGeometry(new Shape(p), 2) };
      }),
      stand: new LatheGeometry(
        [[0, 0], [0.62, 0], [0.66, 0.02], [0.58, 0.05], [0.16, 0.1], [0.11, 0.24], [0.13, STAND_Y - 0.035], [1.5, STAND_Y - 0.03], [1.56, STAND_Y - 0.01], [1.57, STAND_Y + 0.01], [1.52, STAND_Y + 0.02], [0, STAND_Y + 0.02]].map(([x, y]) => new Vector2(x, y)),
        96,
      ),
      shadow: new PlaneGeometry(1, 1),
      sphere: new SphereGeometry(1, 20, 16),
      drupe: new IcosahedronGeometry(1, 1),
      piping: new TorusGeometry(1, 0.42, 10, 18),
      // cordón de la base: un toro fino, abierto donde está la porción
      border: new TorusGeometry(1, 0.035, 10, 120, Math.PI * 2 - WEDGE),
      borderSlice: new TorusGeometry(1, 0.035, 10, 20, WEDGE),
      drip: new CapsuleGeometry(0.042, 1, 6, 12),
      crumb: new IcosahedronGeometry(1, 0),
      candle: new LatheGeometry([[0, 0], [0.024, 0], [0.024, 0.3], [0, 0.3]].map(([x, y]) => new Vector2(x, y)), 14),
      wick: new LatheGeometry([[0, 0], [0.004, 0], [0.004, 0.035], [0, 0.035]].map(([x, y]) => new Vector2(x, y)), 6),
      flame: new LatheGeometry([[0, 0], [0.014, 0.008], [0.018, 0.022], [0.012, 0.045], [0, 0.065]].map(([x, y]) => new Vector2(x, y)), 12),
      glow: new PlaneGeometry(1, 1),
      plaque: (() => {
        const s = new Shape();
        const w = 0.5, h = 0.16, r = 0.04;
        s.moveTo(-w / 2 + r, -h / 2);
        s.lineTo(w / 2 - r, -h / 2);
        s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
        s.lineTo(w / 2, h / 2 - r);
        s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
        s.lineTo(-w / 2 + r, h / 2);
        s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
        s.lineTo(-w / 2, -h / 2 + r);
        s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
        return new ExtrudeGeometry(s, { depth: 0.018, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2 });
      })(),
      plaqueFace: new PlaneGeometry(0.48, 0.15),
    };
    const crumb = crumbTex();
    crumb.repeat.set(1, 1);
    crumb.anisotropy = 4;
    const spat = spatulaTex();
    spat.repeat.set(1, 3);
    const tex = { crumb, spat, candle: candleTex(), shadow: shadowTex(), glow: glowTex() };
    const mats = {
      sponge: new MeshStandardMaterial({ map: tex.crumb, bumpMap: tex.crumb, bumpScale: 2.2, roughness: 0.95, side: DoubleSide }),
      filling: new MeshPhysicalMaterial({ roughness: 0.32, clearcoat: 0.35, clearcoatRoughness: 0.4, side: DoubleSide }),
      cover: new MeshPhysicalMaterial({ roughness: 0.55, bumpMap: tex.spat, bumpScale: 0.6, transparent: true, side: DoubleSide, envMapIntensity: 0.9 }),
      drip: new MeshPhysicalMaterial({ roughness: 0.3, clearcoat: 0.3, transparent: true }),
      stand: new MeshPhysicalMaterial({ color: new Color("#fbf8f4"), roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08 }),
      shadow: new MeshStandardMaterial({ map: tex.shadow, transparent: true, depthWrite: false, roughness: 1 }),
      raspberry: new MeshPhysicalMaterial({ color: new Color("#b51e3c"), roughness: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.3 }),
      blueberry: new MeshStandardMaterial({ color: new Color("#2b3463"), roughness: 0.55 }),
      bloom: new MeshStandardMaterial({ color: new Color("#4b5270"), roughness: 0.9 }),
      petal: new MeshStandardMaterial({ color: new Color("#f2b4c3"), roughness: 0.6, side: DoubleSide }),
      petal2: new MeshStandardMaterial({ color: new Color("#fff1dc"), roughness: 0.6, side: DoubleSide }),
      heart: new MeshStandardMaterial({ color: new Color("#f0bb3e"), roughness: 0.5 }),
      pistachio: new MeshStandardMaterial({ color: new Color("#86a34a"), roughness: 0.8 }),
      candle: new MeshStandardMaterial({ map: tex.candle, roughness: 0.45 }),
      wick: new MeshStandardMaterial({ color: new Color("#2a211c"), roughness: 1 }),
      flame: new MeshStandardMaterial({ color: new Color("#ffd27a"), emissive: new Color("#ff9a2e"), emissiveIntensity: 2.2, roughness: 1 }),
      glow: new MeshStandardMaterial({ map: tex.glow, transparent: true, depthWrite: false, blending: AdditiveBlending, emissive: new Color("#ffb45e"), emissiveIntensity: 0.6 }),
      plaque: new MeshPhysicalMaterial({ color: new Color("#3a2017"), roughness: 0.25, clearcoat: 0.8 }),
    };
    return { geo, tex, mats };
  }, []);
}

/** frambuesa: ~30 granitos sobre una cúpula (una sola InstancedMesh para todas) */
const DRUPES = (() => {
  const out: [number, number, number][] = [];
  for (let ring = 0; ring < 5; ring++) {
    const el = (ring / 5) * Math.PI * 0.52;
    const n = Math.max(1, Math.round(Math.sin(el + 0.35) * 9));
    for (let k = 0; k < n; k++) {
      const az = (k / n) * Math.PI * 2 + ring * 0.6;
      out.push([Math.sin(el) * Math.cos(az), Math.cos(el) * 1.25, Math.sin(el) * Math.sin(az)]);
    }
  }
  return out;
})();

function Cake({ sel, explode, cut, drag, turntable, onReady }: CakeSceneProps) {
  const { geo, tex, mats } = useResources();
  const root = useRef<Group>(null);
  const camera = useThree((s) => s.camera);
  const ready = useRef(false);
  const spin = useRef(0);

  useEffect(
    () => () => {
      const all: (BufferGeometry | undefined)[] = [];
      for (const v of Object.values(geo)) {
        if (Array.isArray(v)) v.forEach((c) => all.push(c.body, c.slice, c.cap));
        else if ("body" in (v as object)) all.push((v as { body: BufferGeometry }).body, (v as { slice: BufferGeometry }).slice, (v as { cap: BufferGeometry }).cap);
        else all.push(v as BufferGeometry);
      }
      all.forEach((g) => g?.dispose());
      Object.values(tex).forEach((t) => t.dispose());
      Object.values(mats).forEach((m) => (m as Material).dispose());
    },
    [geo, tex, mats],
  );

  // placa del mensaje: textura nueva solo cuando cambia el texto
  const message = sel.toppings.includes("mensaje") ? sel.message.trim() : "";
  const plaqueText = useMemo(() => (message ? plaqueTex(message) : null), [message]);
  useEffect(() => () => plaqueText?.dispose(), [plaqueText]);

  const target = useMemo(() => {
    const c = colorsOf(sel);
    return {
      tiers: tiersOf(sel.size),
      scale: baseScale(sel.size),
      sponge: new Color(c.sponge),
      filling: new Color(c.filling),
      cover: new Color(c.covering || c.sponge),
      covered: sel.covering !== "desnuda",
      drip: sel.covering === "ganache",
      piping: sel.covering === "nata" || sel.covering === "buttercream",
      crumbs: sel.covering === "pistacho",
      berries: sel.toppings.includes("frutos-rojos"),
      flowers: sel.toppings.includes("flores"),
      candles: sel.toppings.includes("velas"),
      plaque: !!message,
      roughness: sel.covering === "ganache" ? 0.3 : sel.covering === "pistacho" ? 0.6 : sel.covering === "nata" ? 0.7 : 0.5,
      bump: sel.covering === "buttercream" ? 2.4 : sel.covering === "nata" ? 1.2 : sel.covering === "pistacho" ? 0.8 : 0,
    };
  }, [sel, message]);

  const anim = useRef({ tier: [1, 0, 0], cover: 0, drip: 0, pipe: 0, crumbs: 0, berries: 0, flowers: 0, candles: 0, plaque: 0, scale: 1, ex: 0, cut: 0, camY: 0.9, camZ: 6.2 });
  // por piso: grupo del cuerpo y de la porción, y las capas (cuerpo, porción, caras del corte)
  const tierBody = useRef<(Group | null)[]>([]);
  const tierSlice = useRef<(Group | null)[]>([]);
  const layerNodes = useRef<(Object3D | null)[][]>([[], [], []]);
  const coverNodes = useRef<(Object3D | null)[]>([]);
  // detalles del piso de arriba, también partidos en cuerpo / porción
  const top = useRef<{ body: Group | null; slice: Group | null }>({ body: null, slice: null });
  const parts = useRef<Record<string, (Object3D | null)[]>>({});
  const flames = useRef<(Mesh | null)[]>([]);
  const drupes = useRef<InstancedMesh | null>(null);
  const baseBorders = useRef<(Mesh | null)[]>([]);

  // los granitos de las frambuesas: se colocan una vez
  const BERRIES = useMemo(() => ringAt(8, 0.58, 0.25).concat(ringAt(3, 0.2, 1.1)).map((b, i) => ({ ...b, blue: i % 3 === 2 })), []);
  // las frambuesas de la porción se quedan fuera: no flotarían al sacarla
  const RASP = useMemo(() => BERRIES.filter((b) => !b.blue && !inSlice(b.phi)), [BERRIES]);
  useEffect(() => {
    const m = drupes.current;
    if (!m) return;
    const o = new Object3D();
    let k = 0;
    RASP.forEach((b) => {
      DRUPES.forEach(([x, y, z]) => {
        o.position.set(b.x + x * 0.052, 0.06 + y * 0.05, b.z + z * 0.052);
        o.scale.setScalar(0.021);
        o.updateMatrix();
        m.setMatrixAt(k++, o.matrix);
      });
    });
    m.count = k;
    m.instanceMatrix.needsUpdate = true;
  }, [RASP]);

  useFrame((state, dt) => {
    const a = anim.current;
    const k = Math.min(1, dt * 5);
    const t = target;
    for (let i = 0; i < MAX_TIERS; i++) a.tier[i] = lerp(a.tier[i], i < t.tiers ? 1 : 0, k);
    a.cover = lerp(a.cover, t.covered ? 1 : 0, k);
    a.drip = lerp(a.drip, t.drip ? 1 : 0, k);
    a.pipe = lerp(a.pipe, t.piping ? 1 : 0, k);
    a.crumbs = lerp(a.crumbs, t.crumbs ? 1 : 0, k);
    a.berries = lerp(a.berries, t.berries ? 1 : 0, k);
    a.flowers = lerp(a.flowers, t.flowers ? 1 : 0, k);
    a.candles = lerp(a.candles, t.candles ? 1 : 0, k);
    a.plaque = lerp(a.plaque, t.plaque ? 1 : 0, k);
    a.scale = lerp(a.scale, t.scale, k);
    a.ex = lerp(a.ex, explode.current, Math.min(1, dt * 4));
    a.cut = lerp(a.cut, cut.current, Math.min(1, dt * 3.5));
    mats.sponge.color.lerp(t.sponge, k);
    mats.filling.color.lerp(t.filling, k);
    mats.cover.color.lerp(t.cover, k);
    mats.drip.color.lerp(t.cover, k);
    mats.cover.roughness = lerp(mats.cover.roughness, t.roughness, k);
    mats.cover.bumpScale = lerp(mats.cover.bumpScale, t.bump, k);
    mats.cover.clearcoat = lerp(mats.cover.clearcoat, t.drip ? 0.3 : 0, k);
    mats.cover.envMapIntensity = lerp(mats.cover.envMapIntensity, t.drip ? 0.22 : 0.9, k);
    mats.drip.envMapIntensity = 0.22;
    // la ganache brilla en los cantos pero no refleja el techo como un espejo
    mats.cover.specularIntensity = lerp(mats.cover.specularIntensity, t.drip ? 0.35 : 1, k);
    mats.drip.specularIntensity = 0.35;
    // en el despiece la funda se aparta (más transparente) para que se vean las capas
    mats.cover.opacity = Math.min(1, a.cover) * (1 - 0.82 * a.ex);
    mats.drip.opacity = a.drip * (1 - 0.82 * a.ex);

    // la porción: sale hacia delante (+z, hacia la cámara) y un poco hacia arriba
    const pull = a.cut;
    let y = STAND_Y + 0.02;
    let topY = y;
    let topR = TIER_R[0];
    let topIdx = 0;
    const gap = a.ex * 0.3;
    for (let i = 0; i < MAX_TIERS; i++) {
      const v = a.tier[i];
      const R = TIER_R[i];
      for (const g of [tierBody.current[i], tierSlice.current[i]]) {
        if (!g) continue;
        g.visible = v > 0.01;
        g.scale.set(v, Math.max(0.001, v), v);
      }
      const b = tierBody.current[i];
      const s = tierSlice.current[i];
      if (b) b.position.set(0, y, 0);
      if (s) s.position.set(0, y + pull * 0.04, pull * R * 0.62);
      let ly = 0;
      LAYERS.forEach((kind, li) => {
        const h = kind ? FILL_H : SPONGE_H;
        const r = kind ? R - 0.012 : R;
        for (let p = 0; p < 2; p++) {
          const n = layerNodes.current[i][li * 2 + p];
          if (!n) continue;
          n.position.y = ly + li * gap;
          n.scale.set(r, h, r); // el torneado y sus caras del corte comparten escala (x = radio, y = alto)
        }
        ly += h;
      });
      for (let p = 0; p < 2; p++) {
        const n = coverNodes.current[i * 2 + p];
        if (!n) continue;
        n.visible = a.cover > 0.01;
        n.position.y = a.ex * 1.5 * (1 + i * 0.25); // la funda sube por encima en el despiece
      }
      const tierH = (TIER_H + LAYERS.length * gap) * v;
      if (v > 0.5) {
        topY = y + tierH + (a.cover > 0.5 ? COVER_T : 0);
        topR = R;
        topIdx = i;
      }
      y += tierH + gap * 0.6 + COVER_T * a.cover;
    }

    // detalles del piso de arriba: el grupo «cuerpo» se queda, el de la porción sale con ella
    const tb = top.current.body;
    const ts = top.current.slice;
    const sTop = topR / TIER_R[0];
    if (tb) {
      tb.position.set(0, topY, 0);
      tb.scale.setScalar(sTop);
    }
    if (ts) {
      ts.position.set(0, topY + pull * 0.04, pull * TIER_R[topIdx] * 0.62);
      ts.scale.setScalar(sTop);
    }
    const show = (key: string, v: number, lift: number) =>
      (parts.current[key] = (parts.current[key] ?? []).filter((o) => o?.parent)).forEach((o) => {
        if (!o) return;
        o.visible = v > 0.01;
        o.position.y = (o.userData.y ?? 0) + lift + (1 - v) * 0.4;
        o.scale.setScalar((o.userData.s ?? 1) * Math.max(0.01, v));
      });
    baseBorders.current.forEach((m) => m && (m.visible = a.pipe > 0.05));
    show("drip", a.drip, a.ex * 1.7);
    show("pipe", a.pipe, a.ex * 1.9);
    show("crumbs", a.crumbs, a.ex * 1.9);
    show("berries", a.berries, a.ex * 2.2);
    show("flowers", a.flowers, a.ex * 2.2);
    show("candles", a.candles, a.ex * 2.3);
    show("plaque", a.plaque, a.ex * 2.2);
    (parts.current.drip ?? []).forEach((o) => o && (o.scale.y = Math.max(0.01, a.drip) * (o.userData.len ?? 1)));
    flames.current.forEach((f, i) => f && (f.scale.set(1, 1 + Math.sin(state.clock.elapsedTime * 10 + i * 1.7) * 0.14, 1)));

    // giro: solo + arrastre; la cámara encuadra la altura total
    if (root.current) {
      if (turntable) spin.current += dt * 0.3;
      root.current.rotation.y = spin.current + drag.current;
      root.current.scale.setScalar(a.scale);
    }
    const h = (topY + a.ex * 2.3 + 0.25) * a.scale;
    a.camY = lerp(a.camY, Math.max(0.75, h * 0.5), k);
    a.camZ = lerp(a.camZ, 6.6 + h * 1.2 + pull * 0.6, k);
    camera.position.set(0, a.camY + 1.55, a.camZ);
    camera.lookAt(0, a.camY, 0);

    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  });

  const reg = (key: string, extra: Record<string, number> = {}) => (o: Object3D | null) => {
    const list = (parts.current[key] ??= []);
    if (o && !list.includes(o)) {
      Object.assign(o.userData, { y: o.position.y, s: o.scale.x, ...extra });
      list.push(o);
    }
  };

  /** un detalle colocado en el ángulo `phi`: va al grupo de la porción si cae dentro de ella */
  const split = <T,>(items: (T & { phi: number })[]) => ({ body: items.filter((i) => !inSlice(i.phi)), slice: items.filter((i) => inSlice(i.phi)) });

  const R0 = TIER_R[0];
  const drips = split(ringAt(34, R0 + COVER_T + 0.004, 0.11).map((d, i) => ({ ...d, len: [0.1, 0.32, 0.18, 0.5, 0.14, 0.26, 0.4, 0.12][i % 8] + ((i * 13) % 5) * 0.02 })));
  const piping = split(ringAt(26, R0 - 0.06, 0.05));
  const crumbs = split(Array.from({ length: 60 }, (_, i) => { const r = Math.sqrt(((i * 53) % 60) / 60) * (R0 - 0.08); const phi = i * 2.399; return { phi, x: Math.sin(phi) * r, z: Math.cos(phi) * r, rot: i }; }));
  const berries = split(BERRIES);
  const flowers = split(ringAt(5, 0.82, 0.5));
  const candles = split(ringAt(5, 0.36, 0.3));

  const details = (part: "body" | "slice") => (
    <group ref={(g) => { top.current[part] = g; }}>
      {drips[part].map((d, i) => (
        <group key={`d${i}`} ref={reg("drip", { len: d.len })} position={[d.x, 0.005, d.z]} rotation={[0, d.phi, 0]}>
          <mesh geometry={geo.drip} material={mats.drip} position={[0, -0.5, 0]} scale={[1.25, 1, 0.55]} />
        </group>
      ))}
      {piping[part].map((p, i) => (
        <mesh key={`p${i}`} ref={reg("pipe")} geometry={geo.sphere} material={mats.cover} position={[p.x, 0.04, p.z]} rotation={[0, p.phi, 0.5]} scale={[0.07, 0.06, 0.05]} />
      ))}
      {crumbs[part].map((c, i) => (
        <mesh key={`c${i}`} ref={reg("crumbs")} geometry={geo.crumb} material={mats.pistachio} position={[c.x, 0.01, c.z]} rotation={[c.rot, c.rot * 2, 0]} scale={0.018 + (i % 3) * 0.006} />
      ))}
      {berries[part].map((b, i) =>
        b.blue ? (
          <group key={`b${i}`} ref={reg("berries")} position={[b.x, 0.055, b.z]}>
            <mesh geometry={geo.sphere} material={mats.blueberry} scale={[0.055, 0.05, 0.055]} />
            <mesh geometry={geo.piping} material={mats.bloom} position={[0, 0.048, 0]} rotation={[Math.PI / 2, 0, 0]} scale={0.012} />
          </group>
        ) : null,
      )}
      {part === "body" && <instancedMesh ref={(m) => { drupes.current = m; reg("berries")(m); }} args={[geo.drupe, mats.raspberry, RASP.length * DRUPES.length]} />}
      {flowers[part].map((f, i) => (
        <group key={`f${i}`} ref={reg("flowers")} position={[f.x, 0.035, f.z]} rotation={[0, i * 1.3, 0]} scale={1.7}>
          {ringAt(5, 0.045).map((p, j) => (
            <mesh key={j} geometry={geo.sphere} material={i % 2 ? mats.petal2 : mats.petal} position={[p.x, 0.004, p.z]} rotation={[0.35, p.phi, 0]} scale={[0.036, 0.008, 0.06]} />
          ))}
          <mesh geometry={geo.sphere} material={mats.heart} position={[0, 0.012, 0]} scale={[0.02, 0.015, 0.02]} />
        </group>
      ))}
      {candles[part].map((c, i) => (
        <group key={`v${i}`} ref={reg("candles")} position={[c.x, 0, c.z]}>
          <mesh geometry={geo.candle} material={mats.candle} />
          <mesh geometry={geo.wick} material={mats.wick} position={[0, 0.3, 0]} />
          <mesh ref={(m) => { if (m && !flames.current.includes(m)) flames.current.push(m); }} geometry={geo.flame} material={mats.flame} position={[0, 0.33, 0]} />
          <mesh geometry={geo.glow} material={mats.glow} position={[0, 0.365, 0]} scale={0.16} />
        </group>
      ))}
      {part === "body" && plaqueText && (
        <group ref={reg("plaque")} position={[0, 0.13, -0.32]} rotation={[-0.35, 0, 0]} scale={1.5}>
          <mesh geometry={geo.plaque} material={mats.plaque} position={[0, 0, -0.012]} />
          <mesh geometry={geo.plaqueFace} position={[0, 0, 0.032]}>
            <meshStandardMaterial map={plaqueText} roughness={0.4} />
          </mesh>
        </group>
      )}
    </group>
  );

  return (
    <group ref={root}>
      {/* sombra de contacto y peana de porcelana */}
      <mesh geometry={geo.shadow} material={mats.shadow} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} scale={2.6} />
      <mesh geometry={geo.stand} material={mats.stand} />
      <mesh geometry={geo.shadow} material={mats.shadow} rotation={[-Math.PI / 2, 0, 0]} position={[0, STAND_Y + 0.025, 0]} scale={2.9} />
      {Array.from({ length: MAX_TIERS }, (_, i) =>
        (["body", "slice"] as const).map((part, pi) => (
          <group key={`${i}-${part}`} ref={(g) => { (part === "body" ? tierBody : tierSlice).current[i] = g; }}>
            {LAYERS.map((kind, li) => {
              const g = kind ? geo.filling : geo.sponge;
              const m = kind ? mats.filling : mats.sponge;
              return (
                <group key={li} ref={(n) => { layerNodes.current[i][li * 2 + pi] = n; }}>
                  <mesh geometry={part === "body" ? g.body : g.slice} material={m} />
                  {/* caras del corte, a los dos lados de la porción: se ven al sacarla */}
                  <mesh geometry={g.cap} material={m} rotation={[0, WEDGE / 2 - Math.PI / 2, 0]} />
                  <mesh geometry={g.cap} material={m} rotation={[0, -WEDGE / 2 - Math.PI / 2, 0]} />
                </group>
              );
            })}
            <group ref={(n) => { coverNodes.current[i * 2 + pi] = n; }}>
              {/* arco del toro en el plano XZ: θ = 0 cae en φ = π/2 + giro; se gira para empezar donde empieza cada parte */}
              <group rotation={[0, (part === "body" ? WEDGE / 2 : -WEDGE / 2) - Math.PI / 2, 0]} position={[0, 0.03, 0]}>
                <mesh ref={(n) => { baseBorders.current[i * 2 + pi] = n; }} geometry={part === "body" ? geo.border : geo.borderSlice} material={mats.cover} rotation={[-Math.PI / 2, 0, 0]} scale={[TIER_R[i] + COVER_T, TIER_R[i] + COVER_T, 1]} />
              </group>
              <mesh geometry={part === "body" ? geo.cover[i].body : geo.cover[i].slice} material={mats.cover} />
              <mesh geometry={geo.cover[i].cap} material={mats.cover} rotation={[0, WEDGE / 2 - Math.PI / 2, 0]} />
              <mesh geometry={geo.cover[i].cap} material={mats.cover} rotation={[0, -WEDGE / 2 - Math.PI / 2, 0]} />
            </group>
          </group>
        )),
      )}
      {details("body")}
      {details("slice")}
    </group>
  );
}

export default function CakeScene(props: CakeSceneProps) {
  const coarse = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  return (
    <Canvas frameloop={props.active ? "always" : "never"} dpr={[1, coarse ? 1.5 : 1.75]} gl={{ alpha: true, antialias: true }} camera={{ fov: 28, position: [0, 2.5, 6.4], near: 0.1, far: 60 }} style={{ pointerEvents: "none" }}>
      <Environment />
      <hemisphereLight args={["#fff6ee", "#c9a8a0", 0.3]} />
      <directionalLight position={[4.5, 4, 3]} intensity={1.6} color="#fff1e2" />
      <directionalLight position={[-4, 2.5, -3]} intensity={0.45} color="#ffd9d0" />
      <Cake {...props} />
    </Canvas>
  );
}
