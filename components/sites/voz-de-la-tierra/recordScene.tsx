"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/*
 * El Disco de Oro, todo procedural (sin modelos ni texturas externas):
 * · el disco: un cilindro de oro con su cara grabada pintada en un canvas (surcos, etiqueta, agujero);
 * · la funda: un plano con la lámina dibujada en otro canvas (la tipografía, el mapa de púlsares, el hueco del disco);
 * · la coreografía: el disco gira sobre su eje y todo el conjunto se inclina hacia el puntero, muy poco.
 * El lienzo va sin interacción (es decorativo); la información está en el texto de la página.
 */

const GOLD = "#e8b64c";
const INK = "#141110";
const PAPER = "#f3ead6";

/** La cara del disco, pintada: base de oro con degradado, surcos a anillo, etiqueta grabada y agujero. */
function makeFace() {
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const x = c.getContext("2d")!;
  const R = 512;
  const grad = x.createRadialGradient(R, R, 40, R, R, R);
  grad.addColorStop(0, "#e7b647");
  grad.addColorStop(0.72, "#a8742a");
  grad.addColorStop(1, "#634618");
  x.fillStyle = grad;
  x.fillRect(0, 0, 1024, 1024);

  // la etiqueta grabada en el centro
  x.beginPath();
  x.arc(R, R, 176, 0, Math.PI * 2);
  x.fillStyle = INK;
  x.fill();
  x.lineWidth = 3;
  x.strokeStyle = GOLD;
  x.stroke();
  x.beginPath();
  x.arc(R, R, 190, 0, Math.PI * 2);
  x.lineWidth = 1;
  x.strokeStyle = "rgba(232,182,76,0.45)";
  x.stroke();
  x.textAlign = "center";
  x.fillStyle = GOLD;
  x.font = '500 40px Georgia, "Times New Roman", serif';
  x.fillText("LA VOZ", R, R - 52);
  x.fillText("DE LA TIERRA", R, R - 4);
  x.font = '500 24px ui-monospace, monospace';
  x.fillStyle = "rgba(243,234,214,0.6)";
  x.fillText("THE SOUNDS OF EARTH · 1977", R, R + 46);

  // los surcos: anillos finos desde la etiqueta hasta el borde
  for (let r = 218; r < 496; r += 2.8) {
    x.beginPath();
    x.arc(R, R, r, 0, Math.PI * 2);
    x.strokeStyle = "rgba(0,0,0,0.24)";
    x.lineWidth = 1.3;
    x.stroke();
  }
  // cuatro bandas apenas más claras: la división entre los tramos del disco
  const bands: [number, number][] = [
    [218, 300],
    [300, 360],
    [360, 420],
    [420, 496],
  ];
  bands.forEach(([a, b], i) => {
    x.beginPath();
    x.arc(R, R, (a + b) / 2, 0, Math.PI * 2);
    x.strokeStyle = `rgba(243,234,214,${0.04 + i * 0.008})`;
    x.lineWidth = b - a;
    x.stroke();
  });
  // el agujero
  x.beginPath();
  x.arc(R, R, 14, 0, Math.PI * 2);
  x.fillStyle = "#06050a";
  x.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** La funda, pintada: marco fino, la tipografía, el mapa de púlsares y el hueco circular donde va el disco. */
function makeSleeve() {
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const x = c.getContext("2d")!;
  x.fillStyle = "#171310";
  x.fillRect(0, 0, 1024, 1024);
  // marco de línea fina
  x.strokeStyle = GOLD;
  x.lineWidth = 6;
  x.strokeRect(52, 52, 1024 - 104, 1024 - 104);
  // lema y ficha técnica
  x.fillStyle = GOLD;
  x.font = '500 104px Georgia, "Times New Roman", serif';
  x.fillText("LA VOZ", 96, 240);
  x.fillText("DE LA TIERRA", 96, 376);
  x.font = '500 30px ui-monospace, monospace';
  x.fillStyle = "rgba(243,234,214,0.7)";
  x.fillText("TIERRA · 1977 · 16⅔ RPM", 96, 452);
  x.fillText("115 IMÁGENES · 90 MIN", 96, 496);
  // el mapa de púlsares: tallos radiales de largo distinto y un punto (la Tierra) en el centro
  const cx = 272;
  const cy = 656;
  const base = 138;
  x.lineWidth = 3;
  x.strokeStyle = "rgba(232,182,76,0.85)";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const len = base * (0.4 + ((i * 37) % 10) / 10);
    x.beginPath();
    x.moveTo(cx + Math.cos(a) * 20, cy + Math.sin(a) * 20);
    x.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len);
    x.stroke();
    x.beginPath();
    x.arc(cx + Math.cos(a) * len, cy + Math.sin(a) * len, 5, 0, Math.PI * 2);
    x.fillStyle = GOLD;
    x.fill();
  }
  // la línea larga de la base (la marca binaria) y el punto de la estrella
  x.beginPath();
  x.moveTo(cx, cy + 26);
  x.lineTo(cx, cy + base + 36);
  x.stroke();
  x.beginPath();
  x.arc(cx, cy, 12, 0, Math.PI * 2);
  x.fillStyle = PAPER;
  x.fill();
  // el hueco circular donde va el disco, con su guía de marca
  x.setLineDash([4, 10]);
  x.beginPath();
  x.arc(704, 486, 150, 0, Math.PI * 2);
  x.lineWidth = 2;
  x.strokeStyle = "rgba(243,234,214,0.28)";
  x.stroke();
  x.setLineDash([]);
  x.beginPath();
  x.arc(704, 486, 220, 0, Math.PI * 2);
  x.lineWidth = 7;
  x.strokeStyle = "rgba(232,182,76,0.9)";
  x.stroke();
  // regla de marca en la base
  x.font = '500 30px ui-monospace, monospace';
  x.fillStyle = "rgba(243,234,214,0.5)";
  x.fillText("EL DISCO · EN SU FUNDA", 460, 930);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Reflejos de estudio sin descargar un HDR: `RoomEnvironment` de three convertido a mapa de entorno. */
function Studio() {
  const scene = useThree((s) => s.scene);
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pm.dispose();
    };
  }, [scene, gl]);
  return null;
}

function Piece({
  pointer,
  onReady,
}: {
  pointer: MutableRefObject<{ x: number; y: number }>;
  onReady?: () => void;
}) {
  const face = useMemo(makeFace, []);
  const sleeve = useMemo(makeSleeve, []);
  useEffect(() => () => {
    face.dispose();
    sleeve.dispose();
  }, [face, sleeve]);

  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const cur = useRef({ x: -0.08, y: 0, spin: 0 });
  useFrame((_, dt) => {
    if (!tilt.current || !spin.current) return;
    // el conjunto se inclina hacia el puntero, poco: la escena mima, no busca atención
    const tx = pointer.current.y * 0.22 - 0.08;
    const ty = pointer.current.x * 0.3;
    cur.current.x += (tx - cur.current.x) * Math.min(1, dt * 3);
    cur.current.y += (ty - cur.current.y) * Math.min(1, dt * 3);
    tilt.current.rotation.x = cur.current.x;
    tilt.current.rotation.y = cur.current.y;
    // el disco gira sobre el eje de su cara, como en un tocadiscos visto de frente
    cur.current.spin -= dt * 0.42;
    spin.current.rotation.z = cur.current.spin;
  });
  // se avisa de que ya hay un fotograma pintado (el preloader espera a `.is-ready`)
  useEffect(() => {
    const id = requestAnimationFrame(() => onReady?.());
    return () => cancelAnimationFrame(id);
  }, [onReady]);

  return (
    <group ref={tilt}>
      <group ref={spin}>
        {/* el disco, de pie: sus caras miran hacia la cámara */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.3, 1.3, 0.09, 96]} />
          <meshStandardMaterial color={GOLD} metalness={0.75} roughness={0.42} envMapIntensity={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.048]}>
          <circleGeometry args={[1.27, 96]} />
          <meshStandardMaterial map={face} metalness={0.2} roughness={0.55} envMapIntensity={0.25} />
        </mesh>
        <mesh position={[0, 0, -0.048]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[1.27, 96]} />
          <meshStandardMaterial color={GOLD} metalness={0.85} roughness={0.32} envMapIntensity={0.5} />
        </mesh>
      </group>
      {/* la funda, detrás, desplazada para que se vea su portada al lado del disco */}
      <group position={[-0.38, 0.06, -1.42]} rotation={[0.02, -0.2, 0]}>
        <mesh>
          <planeGeometry args={[3.3, 3.3]} />
          <meshStandardMaterial map={sleeve} metalness={0.05} roughness={0.9} envMapIntensity={0.35} />
        </mesh>
      </group>
    </group>
  );
}

export type RecordSceneProps = {
  active: boolean;
  pointer: MutableRefObject<{ x: number; y: number }>;
  onReady?: () => void;
};

export default function RecordScene({ active, pointer, onReady }: RecordSceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.NeutralToneMapping }}
      camera={{ fov: 40, position: [0, 0.2, 6.6], near: 0.1, far: 40 }}
      onCreated={({ gl }) => {
        // el oro se come la luz: bajar la exposición para que el disco no salga crema
        gl.toneMappingExposure = 0.78;
      }}
      style={{ pointerEvents: "none" }}
    >
      <Studio />
      <ambientLight intensity={0.18} />
      <directionalLight position={[3, 3.5, 4]} intensity={1.15} color="#fff2df" />
      <directionalLight position={[-4, -1.5, 2.5]} intensity={0.35} color="#bcd7ff" />
      <pointLight position={[0, 0.6, 2.4]} intensity={0.35} distance={8} color="#ffd889" />
      <Piece pointer={pointer} onReady={onReady} />
    </Canvas>
  );
}
