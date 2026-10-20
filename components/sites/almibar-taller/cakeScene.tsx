"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { CapsuleGeometry, Color, CylinderGeometry, Group, MeshStandardMaterial, PMREMGenerator, SphereGeometry, type Mesh } from "three";
import { baseScale, colorsOf, tiersOf, type CakeSel } from "./cake";

/*
 * La tarta como escena procedural: 3 pisos posibles, cada uno con 3 capas de bizcocho y 2 de relleno, una funda de
 * cobertura (si no es «desnuda»), goteo para el ganache, rosetas para la nata y toppings en el piso de arriba. Se crea
 * todo una vez (la estructura máxima) y cada fotograma interpola hacia la selección: color, escala, posición y opacidad.
 * Así cambiar una opción anima en lugar de remontar el lienzo.
 */

export type CakeSceneProps = {
  sel: CakeSel;
  /** 0 = montada · 1 = despiece (capas separadas en vertical) */
  explode: MutableRefObject<number>;
  /** giro añadido por el arrastre del puntero (radianes) */
  drag: MutableRefObject<number>;
  /** gira sola */
  turntable: boolean;
  active: boolean;
  onReady: () => void;
};

const SPONGE_H = 0.22;
const FILL_H = 0.07;
const LAYERS = [0, 1, 0, 1, 0]; // 0 bizcocho · 1 relleno, de abajo arriba
const TIER_H = LAYERS.reduce((h, l) => h + (l ? FILL_H : SPONGE_H), 0);
const TIER_R = [1.15, 0.8, 0.52];
const MAX_TIERS = 3;
const DRIPS = 22;
const ROSETTES = 14;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

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

function Cake({ sel, explode, drag, turntable, onReady }: CakeSceneProps) {
  const root = useRef<Group>(null);
  const camera = useThree((s) => s.camera);
  const ready = useRef(false);
  const spin = useRef(0);

  // geometrías y materiales compartidos (se liberan al desmontar)
  const res = useMemo(() => {
    const cyl = new CylinderGeometry(1, 1, 1, 72, 1);
    const sphere = new SphereGeometry(1, 18, 14);
    const drip = new CapsuleGeometry(0.035, 0.12, 4, 8);
    const thin = new CylinderGeometry(1, 1, 1, 12, 1);
    const mats = {
      sponge: new MeshStandardMaterial({ roughness: 0.92 }),
      filling: new MeshStandardMaterial({ roughness: 0.45 }),
      cover: new MeshStandardMaterial({ roughness: 0.55, transparent: true }),
      drip: new MeshStandardMaterial({ roughness: 0.2, transparent: true }),
      plate: new MeshStandardMaterial({ color: new Color("#fbf8f4"), roughness: 0.25, metalness: 0 }),
      raspberry: new MeshStandardMaterial({ color: new Color("#b8213f"), roughness: 0.5 }),
      blueberry: new MeshStandardMaterial({ color: new Color("#2f3a6b"), roughness: 0.35 }),
      petal: new MeshStandardMaterial({ color: new Color("#f3b9c6"), roughness: 0.6 }),
      petal2: new MeshStandardMaterial({ color: new Color("#fff4e2"), roughness: 0.6 }),
      heart: new MeshStandardMaterial({ color: new Color("#f2c14e"), roughness: 0.5 }),
      candle: new MeshStandardMaterial({ color: new Color("#f6efe6"), roughness: 0.4 }),
      flame: new MeshStandardMaterial({ color: new Color("#ffcf6b"), emissive: new Color("#ff9a2e"), emissiveIntensity: 1.6, roughness: 1 }),
    };
    return { cyl, sphere, drip, thin, mats };
  }, []);
  useEffect(
    () => () => {
      [res.cyl, res.sphere, res.drip, res.thin].forEach((g) => g.dispose());
      Object.values(res.mats).forEach((m) => m.dispose());
    },
    [res],
  );

  // objetivos que se interpolan
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
      rosettes: sel.covering === "nata" || sel.covering === "buttercream",
      berries: sel.toppings.includes("frutos-rojos"),
      flowers: sel.toppings.includes("flores"),
      candles: sel.toppings.includes("velas"),
      roughness: sel.covering === "ganache" ? 0.22 : sel.covering === "pistacho" ? 0.5 : 0.65,
    };
  }, [sel]);

  // estado animado: visibilidad de cada piso (0–1), de la funda y de cada topping
  const anim = useRef({ tier: [1, 0, 0], cover: 0, drip: 0, ros: 0, berries: 0, flowers: 0, candles: 0, scale: 1, ex: 0, camY: 0.9, camZ: 6.2 });
  const tiers = useRef<(Group | null)[]>([]);
  const layerMeshes = useRef<(Mesh | null)[][]>([[], [], []]);
  const covers = useRef<(Mesh | null)[]>([]);
  const drips = useRef<Group | null>(null);
  const rosettes = useRef<Group | null>(null);
  const tops = useRef<{ berries: Group | null; flowers: Group | null; candles: Group | null }>({ berries: null, flowers: null, candles: null });
  const flames = useRef<(Mesh | null)[]>([]);

  useFrame((state, dt) => {
    const a = anim.current;
    const k = Math.min(1, dt * 5);
    const t = target;
    for (let i = 0; i < MAX_TIERS; i++) a.tier[i] = lerp(a.tier[i], i < t.tiers ? 1 : 0, k);
    a.cover = lerp(a.cover, t.covered ? 1 : 0, k);
    a.drip = lerp(a.drip, t.drip ? 1 : 0, k);
    a.ros = lerp(a.ros, t.rosettes ? 1 : 0, k);
    a.berries = lerp(a.berries, t.berries ? 1 : 0, k);
    a.flowers = lerp(a.flowers, t.flowers ? 1 : 0, k);
    a.candles = lerp(a.candles, t.candles ? 1 : 0, k);
    a.scale = lerp(a.scale, t.scale, k);
    a.ex = lerp(a.ex, explode.current, Math.min(1, dt * 4));
    res.mats.sponge.color.lerp(t.sponge, k);
    res.mats.filling.color.lerp(t.filling, k);
    res.mats.cover.color.lerp(t.cover, k);
    res.mats.drip.color.lerp(t.cover, k);
    res.mats.cover.roughness = lerp(res.mats.cover.roughness, t.roughness, k);
    // en el despiece la funda se aparta (más transparente) para que se vean las capas
    res.mats.cover.opacity = a.cover * (1 - 0.82 * a.ex);
    res.mats.drip.opacity = a.drip * (1 - 0.82 * a.ex);

    // apilar pisos: la altura de cada uno se multiplica por su visibilidad (el piso nuevo «crece» al aparecer)
    let y = 0.08;
    let topY = y;
    let topR = TIER_R[0];
    const gap = a.ex * 0.32;
    for (let i = 0; i < MAX_TIERS; i++) {
      const g = tiers.current[i];
      const v = a.tier[i];
      if (!g) continue;
      g.visible = v > 0.01;
      g.position.y = y;
      g.scale.set(v, Math.max(0.001, v), v);
      // capas internas: separadas en vertical con el despiece
      let ly = 0;
      LAYERS.forEach((kind, li) => {
        const m = layerMeshes.current[i][li];
        const h = kind ? FILL_H : SPONGE_H;
        if (m) {
          m.position.y = ly + h / 2 + li * gap;
        }
        ly += h;
      });
      const cov = covers.current[i];
      if (cov) {
        cov.visible = a.cover > 0.01;
        cov.position.y = TIER_H / 2 + a.ex * 1.5 * (1 + i * 0.25); // la funda sube por encima en el despiece
        cov.scale.set(TIER_R[i] + 0.03, TIER_H + 0.03, TIER_R[i] + 0.03);
      }
      const tierH = (TIER_H + LAYERS.length * gap) * v;
      if (v > 0.5) {
        topY = y + tierH;
        topR = TIER_R[i];
      }
      y += tierH + gap * 0.6;
    }
    const top = tiers.current[Math.max(0, t.tiers - 1)];
    // goteo y rosetas siguen el borde del piso de arriba; los toppings, encima de todo (más arriba con el despiece)
    const topWorldY = topY;
    if (drips.current) {
      drips.current.visible = a.drip > 0.01;
      drips.current.position.y = topWorldY - 0.07 + a.ex * 1.7;
      drips.current.scale.setScalar(topR / TIER_R[0]);
      drips.current.children.forEach((d) => (d.scale.y = Math.max(0.01, a.drip)));
    }
    if (rosettes.current) {
      rosettes.current.visible = a.ros > 0.01;
      rosettes.current.position.y = topWorldY + 0.04 + a.ex * 1.95;
      rosettes.current.scale.setScalar((topR / TIER_R[0]) * Math.max(0.01, a.ros));
    }
    const lift = topWorldY + 0.02 + a.ex * 2.2;
    for (const key of ["berries", "flowers", "candles"] as const) {
      const g = tops.current[key];
      if (!g) continue;
      const v = a[key];
      g.visible = v > 0.01;
      g.position.y = lift + (1 - v) * 0.5;
      g.scale.setScalar(Math.max(0.01, v) * (topR / TIER_R[0]));
    }
    void top;
    flames.current.forEach((f, i) => f && (f.scale.y = 0.05 * (1 + Math.sin(state.clock.elapsedTime * 9 + i * 1.7) * 0.18)));

    // giro: solo + arrastre; cámara que encuadra la altura total
    if (root.current) {
      if (turntable) spin.current += dt * 0.35;
      root.current.rotation.y = spin.current + drag.current;
      root.current.scale.setScalar(a.scale);
    }
    const h = (topY + a.ex * 2.2) * a.scale;
    a.camY = lerp(a.camY, Math.max(0.7, h * 0.52), k);
    a.camZ = lerp(a.camZ, 7.2 + h * 1.25, k);
    camera.position.set(0, a.camY + 1.5, a.camZ);
    camera.lookAt(0, a.camY, 0);

    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  });

  const ring = (n: number, r: number, phase = 0) => Array.from({ length: n }, (_, i) => [Math.cos((i / n) * Math.PI * 2 + phase) * r, Math.sin((i / n) * Math.PI * 2 + phase) * r] as const);

  return (
    <group ref={root}>
      {/* bandeja */}
      <mesh geometry={res.cyl} material={res.mats.plate} position={[0, 0.03, 0]} scale={[1.55, 0.06, 1.55]} />
      {Array.from({ length: MAX_TIERS }, (_, i) => (
        <group key={i} ref={(g) => { tiers.current[i] = g; }}>
          {LAYERS.map((kind, li) => (
            <mesh
              key={li}
              ref={(m) => { layerMeshes.current[i][li] = m; }}
              geometry={res.cyl}
              material={kind ? res.mats.filling : res.mats.sponge}
              scale={[kind ? TIER_R[i] - 0.015 : TIER_R[i], kind ? FILL_H : SPONGE_H, kind ? TIER_R[i] - 0.015 : TIER_R[i]]}
            />
          ))}
          <mesh ref={(m) => { covers.current[i] = m; }} geometry={res.cyl} material={res.mats.cover} />
        </group>
      ))}
      <group ref={drips}>
        {ring(DRIPS, TIER_R[0] + 0.035).map(([x, z], i) => (
          <mesh key={i} geometry={res.drip} material={res.mats.drip} position={[x, -0.06 - (i % 3) * 0.05, z]} scale={[1, 1 + (i % 4) * 0.45, 1]} />
        ))}
      </group>
      <group ref={rosettes}>
        {ring(ROSETTES, TIER_R[0] - 0.12).map(([x, z], i) => (
          <mesh key={i} geometry={res.sphere} material={res.mats.cover} position={[x, 0.04, z]} scale={[0.085, 0.07, 0.085]} />
        ))}
      </group>
      <group ref={(g) => { tops.current.berries = g; }}>
        {ring(9, 0.55, 0.2).map(([x, z], i) => (
          <mesh key={i} geometry={res.sphere} material={i % 3 === 2 ? res.mats.blueberry : res.mats.raspberry} position={[x, 0.07, z]} scale={i % 3 === 2 ? 0.06 : 0.085} />
        ))}
        {ring(4, 0.22, 0.9).map(([x, z], i) => (
          <mesh key={`c${i}`} geometry={res.sphere} material={res.mats.raspberry} position={[x, 0.08, z]} scale={0.08} />
        ))}
      </group>
      <group ref={(g) => { tops.current.flowers = g; }}>
        {ring(5, 0.78, 0.5).map(([x, z], i) => (
          <group key={i} position={[x, 0.05, z]} rotation={[0, i, 0]}>
            {ring(5, 0.07).map(([px, pz], j) => (
              <mesh key={j} geometry={res.sphere} material={i % 2 ? res.mats.petal2 : res.mats.petal} position={[px, 0, pz]} scale={[0.06, 0.02, 0.06]} />
            ))}
            <mesh geometry={res.sphere} material={res.mats.heart} position={[0, 0.015, 0]} scale={[0.035, 0.025, 0.035]} />
          </group>
        ))}
      </group>
      <group ref={(g) => { tops.current.candles = g; }}>
        {ring(5, 0.38, 0).map(([x, z], i) => (
          <group key={i} position={[x, 0, z]}>
            <mesh geometry={res.thin} material={res.mats.candle} position={[0, 0.16, 0]} scale={[0.022, 0.32, 0.022]} />
            <mesh ref={(m) => { flames.current[i] = m; }} geometry={res.sphere} material={res.mats.flame} position={[0, 0.36, 0]} scale={[0.025, 0.05, 0.025]} />
          </group>
        ))}
      </group>
    </group>
  );
}

export default function CakeScene(props: CakeSceneProps) {
  const coarse = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  return (
    <Canvas frameloop={props.active ? "always" : "never"} dpr={[1, coarse ? 1.5 : 1.75]} gl={{ alpha: true, antialias: true }} camera={{ fov: 30, position: [0, 2.5, 6.4], near: 0.1, far: 60 }} style={{ pointerEvents: "none" }}>
      <Environment />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} />
      <directionalLight position={[-4, 2, -3]} intensity={0.35} />
      <Cake {...props} />
    </Canvas>
  );
}
