"use client";

import { Environment, Lightformer, Merged, MeshReflectorMaterial, ScrollControls, useGLTF, useScroll, type InstanceProps } from "@react-three/drei";
import { Canvas, useFrame, useThree, type ThreeElements } from "@react-three/fiber";
import { memo, Suspense, useEffect, useMemo, useRef, useState, type FC, type RefObject } from "react";
import * as THREE from "three";
import { COCHES_MAQUETA, capituloDe, fijarPlaza, libres, usePlaza, type CocheMaqueta, type Elegida } from "./maqueta-datos";

/*
 * Reinterpretación de Night Train (pmndrs/examples, MIT): tren sin techo instanciado con `Merged`, recorrido con
 * `ScrollControls`, suelo reflectante y niebla. Los cambios propios son que cada asiento es una plaza que se puede
 * elegir, que el GLB va sin Draco (la CSP no deja compilar WebAssembly) y que el rótulo y la luz no piden nada a un CDN.
 */
useGLTF.preload("/models/night-train/cabin.glb", false, false);
useGLTF.preload("/models/night-train/seat.glb", false, false);

type Models = FC<InstanceProps> & Record<string, FC<InstanceProps>>;
const FILAS = [0, -1.9, -6.6, -8.5, -11, -12.9, -17.6, -19.5];
const QUARTOS = [-1.2, 1.2];
const ASIENTOS_QUARTO: [number, number, number][] = [[-.35, .7, 0], [.35, .7, 0], [-.35, -.7, Math.PI], [.35, -.7, Math.PI]];

function Asiento({ models, position, rotation, color, elegido, onElegir }: { models: Models; color: string; elegido: boolean; onElegir?: () => void } & Pick<ThreeElements["group"], "position" | "rotation">) {
  const [encima, setEncima] = useState(false);
  const pinta = elegido ? "#ffe34d" : encima && onElegir ? "#ffffff" : color;
  const eventos = onElegir ? {
    onClick: (e: { stopPropagation: () => void }) => { e.stopPropagation(); onElegir(); },
    onPointerOver: (e: { stopPropagation: () => void }) => { e.stopPropagation(); setEncima(true); document.body.style.cursor = "pointer"; },
    onPointerOut: () => { setEncima(false); document.body.style.cursor = ""; },
  } : {};
  return <models.Seat color={pinta} position={position} rotation={rotation} {...eventos} />;
}

function Cabina({ models, coche, i, elegida, onElegir, ...props }: { models: Models; coche: CocheMaqueta; i: number; elegida: Elegida; onElegir: (e: NonNullable<Elegida>) => void } & ThreeElements["group"]) {
  const disponibles = useMemo(() => new Set(libres(coche.plazas)), [coche.plazas]);
  const sinPlazas = coche.plazas === 0;
  let n = -1;
  return <group {...props}>
    <Rotulo texto={coche.numero} />
    <models.Cabin color={coche.tono} />
    {FILAS.map((z) => QUARTOS.map((x) => ASIENTOS_QUARTO.map(([ax, az, giro]) => {
      n += 1;
      const numero = n, libre = disponibles.has(numero);
      return <Asiento key={numero} models={models} position={[x + ax, -.45, 9.75 + z + az]} rotation={[0, giro, 0]}
        color={sinPlazas ? coche.color : libre ? coche.color : "#3c3c46"} elegido={elegida?.coche === i && elegida.n === numero}
        onElegir={libre ? () => onElegir({ coche: i, n: numero }) : undefined} />;
    })))}
  </group>;
}

/* Sustituye a `Text` de drei: su fuente por defecto se descarga de un CDN. Se pinta con la Archivo ya servida por la web. */
function Rotulo({ texto }: { texto: string }) {
  const [mapa, setMapa] = useState<THREE.CanvasTexture | null>(null);
  useEffect(() => {
    let vivo = true;
    const familia = getComputedStyle(document.documentElement).getPropertyValue("--font-archivo") || "sans-serif";
    const pintar = () => {
      if (!vivo) return;
      const lienzo = document.createElement("canvas");
      lienzo.width = lienzo.height = 512;
      const ctx = lienzo.getContext("2d")!;
      ctx.fillStyle = "#e9e2d2"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = `800 420px ${familia}`;
      ctx.fillText(texto, 256, 276);
      const t = new THREE.CanvasTexture(lienzo);
      t.colorSpace = THREE.SRGBColorSpace;
      setMapa(t);
    };
    document.fonts.load(`800 420px ${familia}`).then(pintar, pintar);
    return () => { vivo = false; };
  }, [texto]);
  if (!mapa) return null;
  return <mesh position={[0, 6, 4]} rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={[3.6, 3.6]} /><meshBasicMaterial map={mapa} transparent depthWrite={false} />
  </mesh>;
}

function Tren() {
  const elegida = usePlaza();
  const ref = useRef<THREE.Group>(null!);
  const scroll = useScroll();
  const [cabin, seat] = useGLTF(["/models/night-train/cabin.glb", "/models/night-train/seat.glb"], false, false);
  const meshes = useMemo(() => ({ Cabin: cabin.nodes.cabin_1 as THREE.Mesh, Seat: seat.nodes.seat as THREE.Mesh }), [cabin, seat]);
  useFrame(() => { ref.current.position.z = scroll.offset * 160; });
  return <Merged castShadow receiveShadow meshes={meshes}>
    {(models: Models) => <group ref={ref}>
      {COCHES_MAQUETA.map((coche, i) => <Cabina key={coche.numero} models={models} coche={coche} i={i} elegida={elegida} onElegir={fijarPlaza} position={[0, 0, -6 - 26 * i]} />)}
    </group>}
  </Merged>;
}

/* El original usa `Environment preset="dawn"`, que se descarga de un CDN. Estas dos luces dan el mismo cruce de naranja y azul. */
function Luz() {
  return <Environment resolution={32} environmentIntensity={.9}>
    <color attach="background" args={["#0b0b18"]} />
    <Lightformer color="#ffb98a" intensity={1.7} position={[0, 7, 0]} rotation-x={Math.PI / 2} scale={[24, 24, 1]} />
    <Lightformer color="#4a5ad8" intensity={4.2} position={[-10, 6, 10]} rotation-y={-Math.PI / 4} scale={[24, 14, 1]} />
  </Environment>;
}

/* Publica el scroll a la interfaz HTML, que vive fuera del lienzo, y aparta la maqueta del panel. */
function Puente({ scrollEl, onCapitulo }: { scrollEl: RefObject<HTMLElement | null>; onCapitulo: (c: number) => void }) {
  const scroll = useScroll();
  const { camera, size } = useThree();
  const actual = useRef(-2);
  useEffect(() => { scrollEl.current = scroll.el; }, [scroll.el, scrollEl]);
  useEffect(() => {
    const c = camera as THREE.PerspectiveCamera, { width: w, height: h } = size;
    const movil = w < 860;
    // en vertical se abre el objetivo en vez de alejar la cámara: la niebla empieza a 30 unidades
    c.fov = movil ? 52 : 35;
    c.position.set(-15, 15, 18);
    c.lookAt(0, 0, 0);
    if (movil) c.setViewOffset(w, h, 0, h * .18, w, h);
    else c.setViewOffset(w, h, w * .1, 0, w, h);
    c.updateProjectionMatrix();
    return () => c.clearViewOffset();
  }, [camera, size]);
  useFrame(() => {
    const c = capituloDe(scroll.offset);
    if (c !== actual.current) { actual.current = c; onCapitulo(c); }
  });
  return null;
}

function MaquetaScene({ scrollEl, onCapitulo }: { scrollEl: RefObject<HTMLElement | null>; onCapitulo: (c: number) => void }) {
  const [quieto, setQuieto] = useState(false);
  useEffect(() => setQuieto(matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  return <Canvas dpr={[1, 1.5]} shadows camera={{ position: [-15, 15, 18], fov: 35 }} gl={{ alpha: false }} aria-hidden="true">
    <fog attach="fog" args={["#17171b", 30, 40]} />
    <color attach="background" args={["#17171b"]} />
    <ambientLight intensity={.25 * Math.PI} />
    <directionalLight castShadow intensity={2 * Math.PI} position={[10, 6, 6]} shadow-mapSize={[1024, 1024]}>
      <orthographicCamera attach="shadow-camera" left={-20} right={20} top={20} bottom={-20} />
    </directionalLight>
    <Suspense fallback={null}>
      <ScrollControls pages={6} damping={quieto ? 0 : .2}>
        <Tren />
        <Puente scrollEl={scrollEl} onCapitulo={onCapitulo} />
      </ScrollControls>
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial blur={[400, 100]} resolution={1024} mixBlur={1} mixStrength={15} depthScale={1} minDepthThreshold={.85} color="#151515" metalness={.6} roughness={1} />
      </mesh>
      <Luz />
    </Suspense>
  </Canvas>;
}

/* memo: <Canvas> no debe volver a renderizarse (ver maqueta-datos.ts). */
export default memo(MaquetaScene);
