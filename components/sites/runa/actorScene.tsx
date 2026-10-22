"use client";

import { useEffect, useLayoutEffect, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/*
 * Un modelo animado de videojuego (con esqueleto) en su lienzo. Los de Sketchfab traen escalas y raíces de todo tipo
 * (centímetros, la pose de referencia lejos del origen…), así que se ENCUADRA midiendo la malla deformada por los huesos
 * en varios instantes de su animación: alto, y radio horizontal alrededor de su eje (los personajes solo giran sobre él).
 * La cámara se aparta lo justo para que quepa en el lado más estrecho del lienzo. Sin Draco ni meshopt (CSP).
 */

export type ActorClip = { name?: string; /** tramo del clip en segundos (un clip con varias animaciones seguidas) */ from?: number; to?: number };
export type ScreenBox = { x0: number; y0: number; x1: number; y1: number };

export type ActorSceneProps = {
  src: string;
  /** la animación en bucle (por defecto, la primera entera) */
  loop?: ActorClip;
  /** una animación que se reproduce una vez y se queda en su último fotograma cuando `play` es true (abrir un cofre) */
  once?: string;
  /** en reposo, quieto en el último fotograma de esta animación (el cofre, cerrado); sin bucle */
  rest?: string;
  play?: boolean;
  /** giro fijo (radianes) y cuánto se inclina hacia el puntero */
  yaw?: number;
  follow?: number;
  /** vuelta lenta continua (rad/s) */
  spin?: number;
  /** cambia en cada golpe recibido: destello rojo y retroceso */
  hit?: number;
  /** derrotado: cae hacia atrás y se hunde */
  down?: boolean;
  active: boolean;
  /** dónde cae el modelo en el lienzo (fracciones), para poner encima elementos de la página */
  screen?: MutableRefObject<ScreenBox>;
  /** color de los contraluces (los tokens de la web) */
  rim?: [string, string];
  onReady?: () => void;
};

const pointer = { x: 0, y: 0 };
if (typeof window !== "undefined")
  addEventListener("pointermove", (e) => {
    pointer.x = (e.clientX / innerWidth) * 2 - 1;
    pointer.y = -((e.clientY / innerHeight) * 2 - 1);
  }, { passive: true });

function Studio() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pm.dispose();
    };
  }, [gl, scene]);
  return null;
}

type Fit = { offset: THREE.Vector3; halfH: number; rad: number; box: THREE.Box3 };

/** Mide la malla deformada en `n` instantes del clip: caja total y radio horizontal desde el eje del personaje. */
function measure(root: THREE.Object3D, mixer: THREE.AnimationMixer | null, dur: number, n = 6): Fit {
  const box = new THREE.Box3();
  const pts: THREE.Vector3[] = [];
  const v = new THREE.Vector3();
  for (let k = 0; k < n; k++) {
    if (mixer) mixer.setTime((dur * k) / n);
    root.updateMatrixWorld(true);
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      const pos = m.isMesh ? m.geometry?.getAttribute("position") : null;
      if (!pos || !m.visible) return;
      const step = Math.max(1, Math.floor(pos.count / 1500));
      for (let i = 0; i < pos.count; i += step) {
        m.getVertexPosition(i, v);
        v.applyMatrix4(m.matrixWorld);
        box.expandByPoint(v);
        pts.push(v.clone());
      }
    });
  }
  if (mixer) mixer.setTime(0);
  const c = box.getCenter(new THREE.Vector3());
  let rad = 0;
  for (const p of pts) rad = Math.max(rad, Math.hypot(p.x - c.x, p.z - c.z));
  return { offset: c.clone().negate(), halfH: (box.max.y - box.min.y) / 2, rad, box };
}

function Actor({ src, loop, once, rest, play, yaw = 0, follow = 0.15, spin = 0, hit = 0, down = false, screen, onReady }: Omit<ActorSceneProps, "active" | "rim">) {
  const { scene, animations } = useGLTF(src, false, false);
  const { camera, size } = useThree();
  const outer = useRef<THREE.Group>(null);
  const [fit, setFit] = useState<Fit | null>(null);
  const anim = useRef<{ mixer: THREE.AnimationMixer; once?: THREE.AnimationAction; rest?: THREE.AnimationAction } | null>(null);
  const fx = useRef({ hitT: -1, lastHit: hit, downT: -1, spin: 0 });

  // mezclador, clip en bucle (recortado si hace falta) y medida; en un efecto (el doble montaje de desarrollo lo rehace)
  useLayoutEffect(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) m.frustumCulled = false;
    });
    const mixer = new THREE.AnimationMixer(scene);
    let clip = loop?.name ? animations.find((a) => a.name === loop.name) : rest ? undefined : animations.find((a) => a.name !== once);
    if (clip && (loop?.from !== undefined || loop?.to !== undefined)) {
      const fps = 30;
      clip = THREE.AnimationUtils.subclip(clip, `${clip.name}-tramo`, Math.round((loop?.from ?? 0) * fps), Math.round((loop?.to ?? clip.duration) * fps), fps);
    }
    const base = clip ? mixer.clipAction(clip) : null;
    base?.play();
    const onceClip = once ? animations.find((a) => a.name === once) : undefined;
    const onceAction = onceClip ? mixer.clipAction(onceClip) : undefined;
    if (onceAction) {
      onceAction.setLoop(THREE.LoopOnce, 1);
      onceAction.clampWhenFinished = true;
    }
    const restClip = rest ? animations.find((a) => a.name === rest) : undefined;
    const restAction = restClip ? mixer.clipAction(restClip) : undefined;
    if (restAction && restClip) {
      restAction.setLoop(THREE.LoopOnce, 1);
      restAction.clampWhenFinished = true;
      restAction.play();
      mixer.setTime(restClip.duration);
    }
    // la medida incluye el cofre abierto (su tapa sube)
    let f = measure(scene, base ? mixer : null, clip?.duration ?? 0);
    if (onceAction && onceClip) {
      restAction?.stop();
      onceAction.play();
      mixer.setTime(onceClip.duration);
      scene.updateMatrixWorld(true);
      const g = measure(scene, null, 0, 1);
      f = { ...f, box: f.box.union(g.box) };
      const c = f.box.getCenter(new THREE.Vector3());
      f.offset = c.negate();
      f.halfH = (f.box.max.y - f.box.min.y) / 2;
      f.rad = Math.max(f.rad, g.rad);
      onceAction.stop();
      mixer.setTime(0);
      if (restAction && restClip) {
        restAction.reset().play();
        mixer.setTime(restClip.duration);
      }
    }
    anim.current = { mixer, once: onceAction, rest: restAction };
    setFit(f);
    onReady?.();
    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(scene);
      anim.current = null;
    };
    // la animación se elige al cargar el modelo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, animations]);

  useEffect(() => {
    const a = anim.current?.once, r = anim.current?.rest;
    if (!a) return;
    if (play) {
      r?.stop();
      a.reset().play();
    } else {
      a.stop();
      if (r) {
        r.reset().play();
        anim.current!.mixer.update(r.getClip().duration);
      }
    }
  }, [play, fit]);

  // la cámara: que quepa el alto y el radio horizontal en el lienzo, gire como gire sobre su eje
  useLayoutEffect(() => {
    if (!fit) return;
    const cam = camera as THREE.PerspectiveCamera;
    const v = (cam.fov * Math.PI) / 180;
    const h = 2 * Math.atan(Math.tan(v / 2) * (size.width / Math.max(1, size.height)));
    const d = Math.max(fit.halfH / Math.tan(v / 2), fit.rad / Math.tan(h / 2)) * 1.08 + fit.rad;
    cam.position.set(0, 0, d);
    cam.near = d / 100;
    cam.far = d * 4;
    cam.updateProjectionMatrix();
    // (la matriz de la cámara se actualiza al pintar: para proyectar ya, hay que hacerlo a mano)
    cam.updateMatrixWorld();
    // dónde cae en pantalla (para los puntos débiles): la caja del cuerpo sin la profundidad
    if (screen) {
      const b = fit.box.clone().translate(fit.offset);
      const p = (x: number, y: number) => new THREE.Vector3(x, y, 0).project(cam);
      const a = p(-fit.rad * 0.7, b.max.y), c = p(fit.rad * 0.7, b.min.y);
      screen.current = { x0: (a.x + 1) / 2, y0: (1 - a.y) / 2, x1: (c.x + 1) / 2, y1: (1 - c.y) / 2 };
    }
  }, [fit, camera, size, screen]);

  useFrame((state, dt) => {
    const g = outer.current;
    anim.current?.mixer.update(dt);
    if (!g || !fit) return;
    const f = fx.current, t = state.clock.elapsedTime;
    if (hit !== f.lastHit) {
      f.lastHit = hit;
      f.hitT = t;
    }
    if (down && f.downT < 0) f.downT = t;
    if (!down) f.downT = -1;
    f.spin += dt * spin;
    // golpe: retroceso con muelle y destello rojo que se apaga
    const since = f.hitT < 0 ? 9 : t - f.hitT;
    const kick = since < 0.5 ? Math.sin(since * 30) * Math.exp(-since * 9) * 0.25 : 0;
    const flash = since < 0.35 ? 1 - since / 0.35 : 0;
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      (Array.isArray(m.material) ? m.material : [m.material]).forEach((mt) => {
        const s = mt as THREE.MeshStandardMaterial;
        if (s.emissive) {
          s.emissive.setRGB(flash * 1.2, 0, flash * 0.25);
          s.emissiveIntensity = 1;
        }
      });
    });
    // derrota: cae hacia atrás y se hunde
    const fall = f.downT < 0 ? 0 : Math.min(1, (t - f.downT) / 1.1);
    const e = fall * fall;
    g.rotation.set(-e * 1.35 - pointer.y * follow * 0.4, yaw + f.spin + pointer.x * follow, 0);
    g.position.set(0, -e * fit.halfH * 1.6, kick * -fit.halfH);
  });

  return (
    <group ref={outer} visible={!!fit}>
      <group position={fit?.offset ?? [0, 0, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

export default function ActorScene({ active, rim = ["#ff2e63", "#08f7fe"], ...props }: ActorSceneProps) {
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={[1, 2]} gl={{ alpha: true, antialias: true }} camera={{ fov: 28, position: [0, 0, 5], near: 0.05, far: 100 }} style={{ pointerEvents: "none" }}>
      <Studio />
      <ambientLight intensity={0.45} />
      <directionalLight position={[2, 3, 4]} intensity={2} color="#fff4e6" />
      <directionalLight position={[-4, 2, -3]} intensity={2.4} color={rim[0]} />
      <directionalLight position={[4, 1, -3]} intensity={2} color={rim[1]} />
      <Actor {...props} />
    </Canvas>
  );
}
