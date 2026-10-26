"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { FontLoader, type Font } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { Mundo, cuerpo, esferasCaja, plano, type Cuerpo } from "../physics/world";
import { Vehiculo, type Mandos } from "../physics/vehicle";
import Decorado, { type OpcionesDecorado } from "./decorado";

/*
 * Escena de `ToyDrive` (docs/29): un coche de juguete con física que empuja las letras de una palabra y unas cajas, con
 * la cámara isométrica que lo persigue. Concepto, cámara y dinámica medidos en el portfolio de Bruno Simon con
 * cine:capture: cámara fija en dirección (−0,585, −0,562, −0,585) a 29,4 m con fov 25 que sigue al coche con 0,15 por
 * fotograma sin subir con sus saltos; el coche acelera a 32 m/s², llega a 13,8 m/s, frena solo a 20 m/s² y gira a
 * ~120°/s. La física es la de `lib/physics` (sin WebAssembly).
 */

export type ToyDriveColores = { suelo: string; coche: string; letras: string; cajas: string; acento: string };

export type ToyDriveContentProps = {
  palabra: string;
  colores: ToyDriveColores;
  /** fuente typeface de three para las letras */
  fuente: string;
  /** elemento que recibe el teclado y el puntero; sin él, la ventana */
  objetivo?: RefObject<HTMLElement | null>;
  interactivo?: boolean;
  /** pose de salida del coche: posición del chasis y rumbo (rad, desde +x hacia +z) */
  inicio?: { pos: [number, number, number]; rumbo: number };
  /** altura del suelo */
  suelo?: number;
  /** mandos desde fuera (botones); se suman al teclado */
  mandosExternos?: RefObject<Partial<Mandos>>;
  /** mantener pulsado el puntero (o el dedo) lleva el coche hacia ese punto del suelo */
  puntero?: boolean;
  /** lejos de la salida (m) el coche vuelve a ella; también con la tecla R (y todo vuelve a su sitio) */
  radio?: number;
  /** distancia de la cámara relativa a la medida (1 = 29,4 m, la de la referencia) */
  zoom?: number;
  /** a cuántos metros por delante de la salida están las letras */
  separacion?: number;
  /** posición de la luz principal relativa al foco de la cámara (por defecto, la medida en la referencia) */
  luzRelativa?: [number, number, number];
  /** decorado alrededor (hierba, árboles, estanques, piedras; `lib/toydrive/decorado`): true, sus opciones o nada */
  decorado?: boolean | OpcionesDecorado;
  /**
   * la intro de la referencia: el mundo oculto bajo un vacío morado con una rejilla de cruces, salvo una isla alrededor
   * del coche con un borde que brilla; la cámara se aleja en los dos primeros segundos (0,82 → 1) y un clic descubre el
   * mundo (el vacío se abre desde la isla). Hasta el clic no se conduce
   */
  intro?: boolean;
  onReady?: () => void;
};

const OFFSET_CAMARA = new THREE.Vector3(17.2, 16.53, 17.2);
const SEGUIMIENTO = 0.15;

const TECLAS: Record<string, keyof Mandos> = { ArrowUp: "adelante", KeyW: "adelante", ArrowDown: "atras", KeyS: "atras", ArrowLeft: "izquierda", KeyA: "izquierda", ArrowRight: "derecha", KeyD: "derecha", Space: "freno" };

/** el coche de juguete: chasis, cabina, parachoques, faros y cuatro ruedas (las ruedas giran y viran aparte) */
function modeloCoche(pintura: THREE.MeshStandardMaterial, piloto: THREE.MeshStandardMaterial) {
  const g = new THREE.Group();
  const oscuro = new THREE.MeshStandardMaterial({ color: "#1d1b22", roughness: 0.8 });
  const cristal = new THREE.MeshStandardMaterial({ color: "#2b3446", roughness: 0.15, metalness: 0.3 });
  const faro = new THREE.MeshStandardMaterial({ color: "#fff4cf", emissive: new THREE.Color("#ffd27a"), emissiveIntensity: 3 });
  const caja = (w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number, nombre?: string) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x, y, z);
    mesh.castShadow = mesh.receiveShadow = true;
    if (nombre) mesh.name = nombre;
    g.add(mesh);
    return mesh;
  };
  // el nombre del chasis es el de la referencia: así cine:compare empareja la pieza (docs/29 §2)
  caja(2.4, 0.55, 1.45, pintura, 0, 0.05, 0, "bodyPainted001");
  caja(1.15, 0.5, 1.25, pintura, -0.25, 0.55, 0);
  caja(0.05, 0.38, 1.1, cristal, 0.34, 0.56, 0);
  caja(0.2, 0.25, 1.55, oscuro, 1.25, -0.08, 0);
  caja(0.2, 0.25, 1.55, oscuro, -1.25, -0.08, 0);
  for (const z of [-0.5, 0.5]) {
    caja(0.06, 0.14, 0.26, faro, 1.36, 0.08, z);
    caja(0.06, 0.12, 0.24, piloto, -1.36, 0.08, z);
  }
  const ruedas: THREE.Group[] = [];
  const llanta = new THREE.CylinderGeometry(0.34, 0.34, 0.3, 18);
  llanta.rotateX(Math.PI / 2);
  for (const [x, z] of [
    [0.9, -0.75],
    [0.9, 0.75],
    [-0.9, -0.75],
    [-0.9, 0.75],
  ]) {
    const eje = new THREE.Group();
    eje.position.set(x, -0.2, z);
    const rueda = new THREE.Mesh(llanta, oscuro);
    rueda.castShadow = true;
    const tapa = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.32, 12).rotateX(Math.PI / 2), pintura);
    rueda.add(tapa);
    eje.add(rueda);
    g.add(eje);
    ruedas.push(eje);
  }
  return { g, ruedas };
}

export default function ToyDriveContent({ palabra, colores, fuente, objetivo, interactivo = true, inicio = { pos: [0, 0.77, 0], rumbo: 0 }, suelo = 0, mandosExternos, puntero = false, radio = 45, zoom = 1, separacion = 9, luzRelativa = [11.5, 26.6, -12.4], decorado, intro = false, onReady }: ToyDriveContentProps) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const raycaster = useThree((s) => s.raycaster);
  const gl = useThree((s) => s.gl);
  const [font, setFont] = useState<Font | null>(null);
  useEffect(() => {
    new FontLoader().load(fuente, setFont);
  }, [fuente]);

  const grupo = useRef<THREE.Group>(null);
  const escena = useMemo(() => {
    const mundo = new Mundo();
    mundo.suelo = plano(suelo);
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -inicio.rumbo);
    const chasis = mundo.añadir(cuerpo(esferasCaja(2.4, 0.6, 1.45), 300, { pos: [...inicio.pos], rot: [q.x, q.y, q.z, q.w], rozamiento: 0.5 }));
    const vehiculo = new Vehiculo(mundo, chasis);
    const mats = {
      pintura: new THREE.MeshStandardMaterial({ color: colores.coche, roughness: 0.45, metalness: 0.1 }),
      piloto: new THREE.MeshStandardMaterial({ color: colores.acento, emissive: new THREE.Color(colores.acento), emissiveIntensity: 2 }),
      letra: new THREE.MeshStandardMaterial({ color: colores.letras, roughness: 0.6 }),
      caja: new THREE.MeshStandardMaterial({ color: colores.cajas, roughness: 0.7 }),
      suelo: new THREE.MeshStandardMaterial({ color: colores.suelo, roughness: 0.95 }),
    };
    const coche = modeloCoche(mats.pintura, mats.piloto);
    return { mundo, chasis, vehiculo, coche, mats, objetos: [] as { c: Cuerpo; m: THREE.Mesh; p0: [number, number, number]; q0: [number, number, number, number] }[] };
    // la escena se monta una vez: cambiar la pose de salida o el suelo pide una escena nueva
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // letras de la palabra en fila delante del coche y una pila de cajas; cada una es un cuerpo con sus esferas
  useLayoutEffect(() => {
    if (!font) return;
    const { mundo, objetos } = escena;
    const delante = new THREE.Vector3(Math.cos(inicio.rumbo), 0, Math.sin(inicio.rumbo));
    // el lado que se lee de izquierda a derecha en pantalla: la derecha de la cámara (que mira por la diagonal −x −z) es
    // (1, 0, −1)/√2; de las dos perpendiculares al rumbo, la que va hacia ella
    const lado = new THREE.Vector3(delante.z, 0, -delante.x);
    if (lado.x - lado.z < 0) lado.negate();
    const base = new THREE.Vector3(...inicio.pos).addScaledVector(delante, separacion).setY(suelo);
    const matLetra = escena.mats.letra;
    const letras = [...palabra.toUpperCase()].filter((ch) => ch.trim());
    const ancho = 1.3;
    letras.forEach((ch, i) => {
      const g = new TextGeometry(ch, { font, size: 1.5, depth: 0.45, curveSegments: 4, bevelEnabled: false });
      g.computeBoundingBox();
      const b = g.boundingBox!;
      const w = b.max.x - b.min.x, h = b.max.y - b.min.y, d = b.max.z - b.min.z;
      g.translate(-(b.min.x + w / 2), -(b.min.y + h / 2), -(b.min.z + d / 2));
      const m = new THREE.Mesh(g, matLetra);
      m.castShadow = m.receiveShadow = true;
      const p = base.clone().addScaledVector(lado, (i - (letras.length - 1) / 2) * ancho).setY(suelo + h / 2 + 0.01);
      // de cara a la cámara: la letra mira hacia la diagonal de la vista
      const rot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 4);
      grupo.current?.add(m);
      const c = mundo.añadir(cuerpo(esferasCaja(w, h, d), 25, { pos: [p.x, p.y, p.z], rot: [rot.x, rot.y, rot.z, rot.w], rozamiento: 0.7, rebote: 0.15 }));
      objetos.push({ c, m, p0: [...c.pos], q0: [...c.rot] });
    });
    const matCaja = escena.mats.caja;
    const geoCaja = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const pila = new THREE.Vector3(...inicio.pos).addScaledVector(lado, -separacion * 0.6).addScaledVector(delante, separacion * 0.45);
    [
      [0, 0],
      [0.85, 0],
      [0.42, 1],
      [-0.85, 0],
      [-0.42, 1],
      [0, 2],
    ].forEach(([dx, fila]) => {
      const p = pila.clone().addScaledVector(lado, dx).setY(suelo + 0.4 + fila * 0.81);
      const m = new THREE.Mesh(geoCaja, matCaja);
      m.castShadow = m.receiveShadow = true;
      grupo.current?.add(m);
      const c = mundo.añadir(cuerpo(esferasCaja(0.8, 0.8, 0.8), 12, { pos: [p.x, p.y, p.z], rozamiento: 0.6 }));
      objetos.push({ c, m, p0: [...c.pos], q0: [...c.rot] });
    });
    onReady?.();
    return () => {
      for (const o of objetos) {
        mundo.quitar(o.c);
        o.m.removeFromParent();
        o.m.geometry.dispose();
      }
      objetos.length = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [font, palabra, escena]);

  // teclado: flechas, WASD y espacio (freno); solo con la pieza enfocada si hay objetivo
  const teclas = useRef<Partial<Record<keyof Mandos, number>>>({});
  const volver = useRef(false);
  // puntero: mientras está pulsado, el punto del suelo bajo él (coordenadas normalizadas del lienzo)
  const pulsado = useRef<[number, number] | null>(null);
  useEffect(() => {
    if (!interactivo || !puntero) return;
    const el = gl.domElement;
    const pos = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return [((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1)] as [number, number];
    };
    const abajo = (e: PointerEvent) => {
      pulsado.current = pos(e);
      el.setPointerCapture?.(e.pointerId);
    };
    const mueve = (e: PointerEvent) => {
      if (pulsado.current) pulsado.current = pos(e);
    };
    const arriba = () => (pulsado.current = null);
    el.addEventListener("pointerdown", abajo);
    el.addEventListener("pointermove", mueve);
    el.addEventListener("pointerup", arriba);
    el.addEventListener("pointercancel", arriba);
    return () => {
      el.removeEventListener("pointerdown", abajo);
      el.removeEventListener("pointermove", mueve);
      el.removeEventListener("pointerup", arriba);
      el.removeEventListener("pointercancel", arriba);
    };
  }, [interactivo, puntero, gl]);
  useEffect(() => {
    if (!interactivo) return;
    const el: HTMLElement | Window = objetivo?.current ?? window;
    const abajo = (e: KeyboardEvent) => {
      if (e.code === "KeyR") volver.current = true;
      const k = TECLAS[e.code];
      if (!k) return;
      e.preventDefault();
      teclas.current[k] = 1;
    };
    const arriba = (e: KeyboardEvent) => {
      const k = TECLAS[e.code];
      if (k) teclas.current[k] = 0;
    };
    el.addEventListener("keydown", abajo as EventListener);
    el.addEventListener("keyup", arriba as EventListener);
    const suelta = () => (teclas.current = {});
    window.addEventListener("blur", suelta);
    return () => {
      el.removeEventListener("keydown", abajo as EventListener);
      el.removeEventListener("keyup", arriba as EventListener);
      window.removeEventListener("blur", suelta);
    };
  }, [interactivo, objetivo]);

  // los colores del tema pueden cambiar con la escena montada: se pintan los materiales
  useEffect(() => {
    const { mats } = escena;
    mats.pintura.color.set(colores.coche);
    mats.piloto.color.set(colores.acento);
    mats.piloto.emissive.set(colores.acento);
    mats.letra.color.set(colores.letras);
    mats.caja.color.set(colores.cajas);
    mats.suelo.color.set(colores.suelo);
  }, [escena, colores.coche, colores.acento, colores.letras, colores.cajas, colores.suelo]);

  const offset = useMemo(() => OFFSET_CAMARA.clone().multiplyScalar(zoom), [zoom]);
  const foco = useMemo(() => new THREE.Vector3(...inicio.pos).setY(suelo), [inicio, suelo]);
  const luz = useRef<THREE.DirectionalLight>(null);
  useLayoutEffect(() => {
    camera.position.copy(foco).add(offset);
    camera.lookAt(foco);
    camera.fov = 25;
    camera.near = 0.1;
    camera.far = 200;
    camera.updateProjectionMatrix();
  }, [camera, foco, offset]);

  // la intro: «espera» hasta el clic, «abre» mientras el vacío se aparta y «fuera» después
  const fase = useRef<{ f: "espera" | "abre" | "fuera"; t: number }>({ f: intro ? "espera" : "fuera", t: 0 });
  const vacio = useMemo(() => {
    if (!intro) return null;
    // rejilla de cruces: una textura pequeña que se repite (128 px, una cruz por casilla)
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const x = c.getContext("2d")!;
    x.fillStyle = "#160c26";
    x.fillRect(0, 0, 128, 128);
    x.strokeStyle = "#5d3c94";
    x.lineWidth = 5;
    x.beginPath();
    x.moveTo(56, 56);
    x.lineTo(72, 72);
    x.moveTo(72, 56);
    x.lineTo(56, 72);
    x.stroke();
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(380, 380);
    tex.colorSpace = THREE.SRGBColorSpace;
    const R = 3.8;
    const suelo0 = new THREE.Mesh(new THREE.RingGeometry(R, 300, 96, 1), new THREE.MeshBasicMaterial({ map: tex, fog: false }));
    const borde = new THREE.Mesh(new THREE.RingGeometry(R, R + 0.14, 96, 1), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 1.2, 2.6), fog: false, toneMapped: false }));
    for (const m of [suelo0, borde]) {
      m.rotation.x = -Math.PI / 2;
      m.position.set(inicio.pos[0], suelo + 0.03, inicio.pos[2]);
      m.renderOrder = 2;
    }
    return { suelo0, borde, tex };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intro]);
  useEffect(() => {
    if (!vacio) return;
    return () => {
      vacio.tex.dispose();
      for (const m of [vacio.suelo0, vacio.borde]) {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      }
    };
  }, [vacio]);
  useEffect(() => {
    if (!intro) return;
    const el: HTMLElement = gl.domElement;
    const obj = objetivo?.current;
    const empieza = () => {
      if (fase.current.f === "espera") fase.current = { f: "abre", t: -1 };
    };
    el.addEventListener("pointerdown", empieza);
    obj?.addEventListener("pointerdown", empieza);
    return () => {
      el.removeEventListener("pointerdown", empieza);
      obj?.removeEventListener("pointerdown", empieza);
    };
  }, [intro, gl, objetivo]);
  const decoradoRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    // intro: el vacío se abre desde la isla, acelerando, y deja ver lo que ocultaba
    const fi = fase.current;
    if (vacio) {
      if (fi.f === "abre" && fi.t < 0) fi.t = clock.elapsedTime;
      const abre = fi.f === "espera" ? 0 : Math.min(1, (clock.elapsedTime - fi.t) / 1.4);
      const s = 1 + Math.pow(abre, 2.2) * 80;
      vacio.suelo0.scale.setScalar(s);
      vacio.borde.scale.setScalar(s);
      vacio.suelo0.visible = vacio.borde.visible = abre < 1;
      if (abre >= 1 && fi.f === "abre") fi.f = "fuera";
      const oculto = fi.f === "espera";
      if (grupo.current) grupo.current.visible = !oculto;
      if (decoradoRef.current) decoradoRef.current.visible = !oculto;
    }
    const { mundo, chasis, vehiculo, coche, objetos } = escena;
    const ext = mandosExternos?.current ?? {};
    const t = teclas.current;
    // puntero: hacia el punto del suelo bajo él; gira según el ángulo entre el rumbo y la dirección al punto
    const ptr: Partial<Mandos> = {};
    if (pulsado.current) {
      raycaster.setFromCamera(new THREE.Vector2(...pulsado.current), camera);
      const hit = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -suelo), hit)) {
        const dx = hit.x - chasis.pos[0], dz = hit.z - chasis.pos[2];
        const lejos = Math.hypot(dx, dz);
        const fw = new THREE.Vector3(1, 0, 0).applyQuaternion(new THREE.Quaternion(...chasis.rot));
        const ang = Math.atan2(fw.x * dz - fw.z * dx, fw.x * dx + fw.z * dz);
        if (lejos > 1.5) {
          // muy por detrás: marcha atrás girando al revés; si no, adelante y girar hacia el punto
          const atras = Math.abs(ang) > 2.4;
          ptr[atras ? "atras" : "adelante"] = 1;
          const giro = atras ? -Math.sign(ang) : Math.sign(ang);
          if (Math.abs(ang) > 0.08) ptr[giro > 0 ? "derecha" : "izquierda"] = Math.min(1, Math.abs(ang) * 2);
        }
      }
    }
    const suma = (k: keyof Mandos) => Math.min(1, (t[k] ?? 0) + (ext[k] ?? 0) + (ptr[k] ?? 0));
    vehiculo.mandos = fi.f === "espera" ? { adelante: 0, atras: 0, izquierda: 0, derecha: 0, freno: 1 } : { adelante: suma("adelante"), atras: suma("atras"), izquierda: suma("izquierda"), derecha: suma("derecha"), freno: suma("freno") };
    // fuera del área o con R: de vuelta a la salida, quieto
    if (volver.current || Math.hypot(chasis.pos[0] - inicio.pos[0], chasis.pos[2] - inicio.pos[2]) > radio || chasis.pos[1] < suelo - 5) {
      volver.current = false;
      const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -inicio.rumbo);
      chasis.pos = [...inicio.pos];
      chasis.rot = [q.x, q.y, q.z, q.w];
      chasis.vel = [0, 0, 0];
      chasis.ang = [0, 0, 0];
      // las letras y las cajas también vuelven a su sitio
      for (const o of objetos) {
        o.c.pos = [...o.p0];
        o.c.rot = [...o.q0];
        o.c.vel = [0, 0, 0];
        o.c.ang = [0, 0, 0];
        o.c.dormido = false;
      }
    }
    mundo.avanzar(delta);
    coche.g.position.set(...chasis.pos);
    coche.g.quaternion.set(...chasis.rot);
    coche.ruedas.forEach((eje, i) => {
      const r = vehiculo.ruedas[i];
      eje.rotation.y = r.giro;
      eje.children[0].rotation.z = -r.vueltas;
      // la rueda baja con la suspensión
      eje.position.y = -0.2 - (vehiculo.p.suspension.reposo - r.compresion);
    });
    for (const o of objetos) {
      o.m.position.set(...o.c.pos);
      o.m.quaternion.set(...o.c.rot);
    }
    // cámara: sigue al coche en el plano (no sube con sus saltos) con 0,15 por fotograma a 60 Hz
    const k = 1 - Math.pow(1 - SEGUIMIENTO, Math.min(3, delta * 60));
    foco.x += (chasis.pos[0] - foco.x) * k;
    foco.z += (chasis.pos[2] - foco.z) * k;
    // la intro: la cámara empieza más cerca (0,82) y se aleja entre 0,8 y 2 s con curva sine.in (medido en la referencia)
    const acerca = vacio ? 0.82 + 0.18 * (1 - Math.cos((Math.min(1, Math.max(0, (clock.elapsedTime - 0.8) / 1.2)) * Math.PI) / 2)) : 1;
    camera.position.copy(foco).addScaledVector(offset, acerca);
    if (luz.current) {
      luz.current.position.set(foco.x + luzRelativa[0], foco.y + luzRelativa[1], foco.z + luzRelativa[2]);
      luz.current.target.position.copy(foco);
      luz.current.target.updateMatrixWorld();
    }
  });

  return (
    <group>
      <primitive object={escena.coche.g} />
      <group ref={grupo} />
      <mesh rotation-x={-Math.PI / 2} position-y={suelo} receiveShadow material={escena.mats.suelo}>
        <planeGeometry args={[400, 400]} />
      </mesh>
      {vacio && (
        <>
          <primitive object={vacio.suelo0} />
          <primitive object={vacio.borde} />
        </>
      )}
      {decorado && (
        <group ref={decoradoRef}>
          <Decorado
            centro={[inicio.pos[0], inicio.pos[2]]}
            suelo={suelo}
            // libres: la salida del coche y la fila de letras, que está a `separacion` por delante
            libres={[
              { x: inicio.pos[0], z: inicio.pos[2], r: 4 },
              { x: inicio.pos[0] + Math.cos(inicio.rumbo) * separacion, z: inicio.pos[2] + Math.sin(inicio.rumbo) * separacion, r: 5 },
            ]}
            opciones={decorado === true ? {} : decorado}
          />
        </group>
      )}
      <hemisphereLight args={["#ffe7d1", "#5b3a6e", 0.35]} />
      <directionalLight
        ref={luz}
        intensity={5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.001}
        shadow-normalBias={0.1}
        shadow-radius={3}
        shadow-camera-left={-30.8}
        shadow-camera-right={30.8}
        shadow-camera-top={30.8}
        shadow-camera-bottom={-30.8}
        shadow-camera-near={1}
        shadow-camera-far={62.5}
      />
    </group>
  );
}
