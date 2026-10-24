"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { uniform, uniformArray } from "three/tsl";
import { geometriaCruz } from "./geometry";
import { materialCruz, type DatosRacimo } from "./material";
import { crearRacimo, type OpcionesRacimo } from "./sim";

export type PiezaRacimo = {
  /** color CSS de la cruz */
  color: string;
  /** pulida (brillo de cajas de luz) en lugar de mate */
  pulida?: boolean;
  /** de cristal: refracta lo que tiene detrás */
  cristal?: boolean;
};

export type CrossClusterContentProps = {
  piezas: PiezaRacimo[];
  /** elemento que recibe el puntero (por defecto, el lienzo) */
  objetivo?: RefObject<HTMLElement | null>;
  /** false = sin puntero: el racimo se asienta solo */
  interactivo?: boolean;
  /** alto visible en el plano del racimo, en radios de cruz (la tarjeta de Lusion: 3,7) */
  alto?: number;
  /** física (docs/31 §3); por defecto, la medida en Lusion */
  fisica?: Omit<OpcionesRacimo, "n">;
  /** lo que el cristal ve detrás cuando detrás no hay cruces (un color claro: el de la página en la referencia) */
  fondoCristal?: string;
  /**
   * cámara exacta de otra captura: fov vertical y desplazamiento de la vista (setViewOffset: ancho y alto completos, x,
   * y, ancho y alto). El banco la usa para reproducir la tarjeta de Lusion; sin ella, el fov sale de `alto`
   */
  vista?: { fov: number; desplazamiento: [number, number, number, number, number, number] };
  onReady?: () => void;
};

const DISTANCIA = 17.5;
const LUZ = new THREE.Vector3(10, 10, 5);

/** el color tal cual (sRGB): el shader trabaja en el espacio de la referencia */
function srgb(css: string) {
  const c = new THREE.Color(css);
  return c.convertLinearToSRGB();
}

/**
 * El racimo de cruces sin lienzo (para `CrossClusterScene` o el banco): dos InstancedMesh (opacas y de cristal, este
 * en dos pasadas, cara trasera y delantera) que comparten los datos de todas las cruces para sombrearse entre ellas, la
 * física de `sim.ts` y una cámara de teleobjetivo (fov estrecho a 17,5) como la de la referencia.
 * Requiere un WebGPURenderer (WebGPU o su reserva WebGL2).
 */
export default function CrossClusterContent({ piezas, objetivo, interactivo = true, alto = 3.7, fisica, fondoCristal = "#f0f1fa", vista, onReady }: CrossClusterContentProps) {
  const { camera, gl, size } = useThree();
  const n = piezas.length;

  const todo = useMemo(() => {
    const posRad = uniformArray(Array.from({ length: n }, () => new THREE.Vector4(0, 0, 100, 1)), "vec4");
    const giro = uniformArray(Array.from({ length: n }, () => new THREE.Vector4(0, 0, 0, 1)), "vec4");
    const color = uniformArray(piezas.map((p) => { const c = srgb(p.color); return new THREE.Vector4(c.r, c.g, c.b, 0); }), "vec4");
    const extra = uniformArray(
      piezas.map((p) => {
        const c = srgb(p.color);
        return new THREE.Vector4(p.pulida ? 0.1 : 0.8, p.cristal ? 1 : 0, 0.299 * c.r + 0.587 * c.g + 0.114 * c.b, 0);
      }),
      "vec4",
    );
    const fc = srgb(fondoCristal);
    const datos = { posRad, giro, color, extra, luz: uniform(LUZ.clone()), fondoCristal: uniform(new THREE.Vector3(fc.r, fc.g, fc.b)), n } as unknown as DatosRacimo;
    const geo = geometriaCruz();
    const opacas = piezas.map((p, i) => (p.cristal ? -1 : i)).filter((i) => i >= 0);
    const cristal = piezas.map((p, i) => (p.cristal ? i : -1)).filter((i) => i >= 0);
    const malla = (indices: number[], modo: "opaca" | "cristal-detras" | "cristal", orden: number) => {
      if (!indices.length) return null;
      const attr = new THREE.InstancedBufferAttribute(new Float32Array(indices), 1);
      const m = new THREE.InstancedMesh(geo, materialCruz(datos, attr, modo) as unknown as THREE.Material, indices.length);
      m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      m.frustumCulled = false;
      m.renderOrder = orden;
      return { m, indices };
    };
    const mallas = [malla(opacas, "opaca", 0), malla(cristal, "cristal-detras", 1), malla(cristal, "cristal", 2)].filter((x) => x !== null);
    return { datos, mallas, racimo: crearRacimo({ n, ...fisica }) };
    // las piezas cambian de identidad en cada render del padre: se comparan por contenido
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, JSON.stringify(piezas), JSON.stringify(fisica), fondoCristal]);
  useEffect(() => () => todo.mallas.forEach(({ m }) => (m.material as THREE.Material).dispose()), [todo]);

  // cámara de la referencia: en z 17,5 mirando al origen, con el fov que deja `alto` a la vista (y un ancho mínimo)
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspecto = size.width / Math.max(1, size.height);
    const h = Math.max(alto, 5.2 / aspecto);
    if (vista) {
      cam.fov = vista.fov;
      cam.setViewOffset(...vista.desplazamiento);
    } else {
      cam.clearViewOffset();
      cam.fov = (2 * Math.atan(h / 2 / DISTANCIA) * 180) / Math.PI;
    }
    cam.near = 1;
    cam.far = 60;
    cam.position.set(0, 0, DISTANCIA);
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
  }, [camera, size, alto, vista]);

  // el puntero, llevado al plano z = 0
  const puntero = useRef<THREE.Vector3 | null>(null);
  useEffect(() => {
    if (!interactivo) return;
    const el: HTMLElement = objetivo?.current ?? gl.domElement;
    const ray = new THREE.Raycaster();
    const plano = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mueve = (e: PointerEvent) => {
      const r = gl.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const p = new THREE.Vector3();
      if (ray.ray.intersectPlane(plano, p)) puntero.current = p;
    };
    const sale = () => (puntero.current = null);
    el.addEventListener("pointermove", mueve);
    el.addEventListener("pointerleave", sale);
    el.addEventListener("pointercancel", sale);
    return () => {
      el.removeEventListener("pointermove", mueve);
      el.removeEventListener("pointerleave", sale);
      el.removeEventListener("pointercancel", sale);
    };
  }, [interactivo, objetivo, gl, camera]);

  const listo = useRef(false);
  const mat = useMemo(() => new THREE.Matrix4(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const v = useMemo(() => new THREE.Vector3(), []);
  const uno = useMemo(() => new THREE.Vector3(1, 1, 1), []);
  useFrame((_, dt) => {
    const { racimo, datos, mallas } = todo;
    const p = puntero.current;
    racimo.puntero(p ? [p.x, p.y, 0] : null, dt);
    racimo.avanzar(dt);
    const pr = datos.posRad.array as THREE.Vector4[];
    const gr = datos.giro.array as THREE.Vector4[];
    racimo.cruces.forEach((c, i) => {
      pr[i].set(c.pos[0], c.pos[1], c.pos[2], 1);
      gr[i].set(c.rot[0], c.rot[1], c.rot[2], c.rot[3]);
    });
    for (const { m, indices } of mallas) {
      indices.forEach((k, j) => {
        const c = racimo.cruces[k];
        v.set(c.pos[0], c.pos[1], c.pos[2]);
        q.set(c.rot[0], c.rot[1], c.rot[2], c.rot[3]);
        m.setMatrixAt(j, mat.compose(v, q, uno));
      });
      m.instanceMatrix.needsUpdate = true;
    }
    if (!listo.current) {
      listo.current = true;
      onReady?.();
    }
  });

  return (
    <group>
      {todo.mallas.map(({ m }, i) => (
        <primitive key={i} object={m} />
      ))}
    </group>
  );
}
