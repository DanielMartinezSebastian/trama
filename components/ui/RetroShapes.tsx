"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, Shape, type Group, type Mesh, type PlaneGeometry } from "three";

export const RETRO_SHAPES = ["chevrons", "knot", "cube", "icosahedron", "cage", "helix", "rings", "terrain", "globe", "tunnel", "pyramid", "torus"] as const;

export type RetroShapesProps = {
  /** chevrons = dos flechas con una barra central · cage = jaula de aristas · helix = ADN · rings = giroscopio · terrain = relieve de datos · globe = globo facetado · tunnel = túnel de marcos · el resto, un sólido */
  shape?: (typeof RETRO_SHAPES)[number];
  /** velocidad de giro (1 = normal) */
  speed?: number;
};

/** «>» grueso; el de la derecha es el mismo espejado */
function chevron(): Shape {
  const s = new Shape();
  [[-0.55, 1], [0.15, 1], [0.95, 0], [0.15, -1], [-0.55, -1], [0.25, 0]].forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  s.closePath();
  return s;
}

/** las 12 aristas de un cubo de lado `a` como listas de [posición, tamaño]: barras finas que sí se leen como caracteres */
function cageBars(a: number, t: number): { pos: [number, number, number]; size: [number, number, number] }[] {
  const h = a / 2;
  const out: { pos: [number, number, number]; size: [number, number, number] }[] = [];
  for (const y of [-h, h]) for (const z of [-h, h]) out.push({ pos: [0, y, z], size: [a + t, t, t] });
  for (const x of [-h, h]) for (const z of [-h, h]) out.push({ pos: [x, 0, z], size: [t, a + t, t] });
  for (const x of [-h, h]) for (const y of [-h, h]) out.push({ pos: [x, y, 0], size: [t, t, a + t] });
  return out;
}

const TUNNEL_FRAMES = 9;
const TUNNEL_SPAN = 14;

/**
 * Escenas de ejemplo para `RetroCanvas`: formas de aristas vivas con luz direccional, que son las que mejor se leen como
 * caracteres. Sirven de modelo para montar la tuya (luces + mallas dentro del `Canvas`).
 */
export default function RetroShapes({ shape = "chevrons", speed = 1 }: RetroShapesProps) {
  const group = useRef<Group>(null);
  const terrain = useRef<Mesh<PlaneGeometry>>(null);
  const tunnel = useRef<Group>(null);
  const cs = useMemo(chevron, []);
  const bars = useMemo(() => cageBars(2.6, 0.14), []);
  const helix = useMemo(() => Array.from({ length: 26 }, (_, i) => ({ y: (i - 12.5) * 0.28, a: i * 0.5 })), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    const g = group.current;
    if (g) {
      if (shape === "chevrons") {
        g.rotation.y = Math.sin(t * 0.6) * 0.55;
        g.rotation.x = Math.sin(t * 0.4) * 0.12;
      } else if (shape === "helix") {
        g.rotation.y = t * 0.6;
        g.rotation.z = 0.35;
      } else if (shape === "terrain") {
        g.rotation.x = -0.95;
        g.rotation.z = Math.sin(t * 0.2) * 0.15;
      } else if (shape === "tunnel") {
        g.rotation.z = t * 0.25;
      } else {
        g.rotation.y = t * 0.5;
        g.rotation.x = t * 0.3;
      }
    }
    // relieve: la altura de cada vértice avanza con el tiempo
    const m = terrain.current;
    if (m && shape === "terrain") {
      const pos = m.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i);
        pos.setZ(i, Math.max(0, Math.sin(x * 0.9 + t) * Math.cos(y * 0.7 - t * 0.8) * 0.9 + Math.sin(x * 0.3 - y * 0.5 + t * 0.5) * 0.6));
      }
      pos.needsUpdate = true;
      m.geometry.computeVertexNormals();
    }
    // túnel: los marcos se acercan a cámara y reaparecen al fondo
    if (tunnel.current && shape === "tunnel") {
      tunnel.current.children.forEach((f, i) => {
        f.position.z = 3 - ((((i * (TUNNEL_SPAN / TUNNEL_FRAMES) - t * 2.2) % TUNNEL_SPAN) + TUNNEL_SPAN) % TUNNEL_SPAN);
        f.rotation.z = i * 0.18;
      });
    }
  });

  const mat = <meshStandardMaterial color="#ffffff" roughness={0.55} metalness={0.1} side={DoubleSide} />;
  const flat = <meshStandardMaterial color="#ffffff" roughness={0.6} metalness={0.05} flatShading side={DoubleSide} />;

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 4, 5]} intensity={2.6} />
      <directionalLight position={[-4, -2, 2]} intensity={0.6} />
      <group ref={group}>
        {shape === "chevrons" && (
          <>
            <mesh position={[-2.4, 0, -0.3]} scale={1.15}>
              <extrudeGeometry args={[cs, { depth: 0.6, bevelEnabled: false }]} />
              {mat}
            </mesh>
            <mesh position={[2.4, 0, -0.3]} scale={[-1.15, 1.15, 1.15]}>
              <extrudeGeometry args={[cs, { depth: 0.6, bevelEnabled: false }]} />
              {mat}
            </mesh>
            <mesh>
              <boxGeometry args={[0.32, 3.6, 0.32]} />
              {mat}
            </mesh>
          </>
        )}
        {shape === "knot" && (
          <mesh>
            <torusKnotGeometry args={[1.2, 0.4, 160, 24]} />
            {mat}
          </mesh>
        )}
        {shape === "cube" && (
          <mesh>
            <boxGeometry args={[2.2, 2.2, 2.2]} />
            {mat}
          </mesh>
        )}
        {shape === "icosahedron" && (
          <mesh>
            <icosahedronGeometry args={[1.7, 0]} />
            {mat}
          </mesh>
        )}
        {shape === "torus" && (
          <mesh>
            <torusGeometry args={[1.5, 0.55, 20, 56]} />
            {mat}
          </mesh>
        )}
        {shape === "pyramid" && (
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[1.9, 2.8, 4]} />
            {flat}
          </mesh>
        )}
        {shape === "globe" && (
          <>
            <mesh>
              <icosahedronGeometry args={[1.6, 2]} />
              {flat}
            </mesh>
            <mesh rotation={[Math.PI / 2.4, 0, 0]}>
              <torusGeometry args={[2.3, 0.05, 8, 96]} />
              {mat}
            </mesh>
          </>
        )}
        {shape === "cage" && (
          <>
            {bars.map((b, i) => (
              <mesh key={i} position={b.pos}>
                <boxGeometry args={b.size} />
                {mat}
              </mesh>
            ))}
            <mesh rotation={[0.6, 0.6, 0]}>
              <octahedronGeometry args={[0.8, 0]} />
              {flat}
            </mesh>
          </>
        )}
        {shape === "helix" &&
          helix.map((h, i) => {
            const x = Math.cos(h.a) * 1.1, z = Math.sin(h.a) * 1.1;
            return (
              <group key={i} position={[0, h.y * 0.62, 0]} scale={0.7}>
                <mesh position={[x, 0, z]}>
                  <sphereGeometry args={[0.17, 12, 10]} />
                  {mat}
                </mesh>
                <mesh position={[-x, 0, -z]}>
                  <sphereGeometry args={[0.17, 12, 10]} />
                  {mat}
                </mesh>
                <mesh rotation={[0, -h.a, Math.PI / 2]}>
                  <cylinderGeometry args={[0.035, 0.035, 2.2, 6]} />
                  {mat}
                </mesh>
              </group>
            );
          })}
        {shape === "rings" &&
          [1.0, 1.6, 2.2].map((r, i) => (
            <mesh key={r} rotation={[i * 1.05, i * 0.7, i * 0.4]}>
              <torusGeometry args={[r, 0.1, 10, 72]} />
              {mat}
            </mesh>
          ))}
        {shape === "terrain" && (
          <mesh ref={terrain} position={[0, 0, -1]}>
            <planeGeometry args={[9, 9, 40, 40]} />
            {flat}
          </mesh>
        )}
      </group>
      {shape === "tunnel" && (
        <group ref={tunnel} position={[0, 0, 0]}>
          {Array.from({ length: TUNNEL_FRAMES }, (_, i) => (
            <group key={i}>
              {cageBars(3.4, 0.16)
                .filter((b) => b.size[2] < 0.5 && b.pos[2] < 0)
                .map((b, k) => (
                  <mesh key={k} position={[b.pos[0], b.pos[1], 0]}>
                    <boxGeometry args={[b.size[0], b.size[1], 0.16]} />
                    {mat}
                  </mesh>
                ))}
            </group>
          ))}
        </group>
      )}
    </>
  );
}
