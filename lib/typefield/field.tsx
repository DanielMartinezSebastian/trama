"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { FontLoader, type Font } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

/*
 * Campo tipográfico (motor de `TypeField`; nació del estudio de Plain Sight, docs/27): un suelo de columnas-letra extruidas
 * en una rejilla, con palabras escondidas entre ellas. Con el progreso (scroll, puntero o tiempo, lo decide quien lo usa),
 * las palabras suben y toman color mientras el resto se hunde (muelles con rebote), la vuelta llega en onda radial y el
 * puntero hunde y tiñe las letras de alrededor. Una InstancedMesh por letra distinta, color por instancia y la cara de
 * arriba teñida del todo (los laterales, al 70 %). Necesita WebGLRenderer (el material se retoca con onBeforeCompile).
 */

/** una palabra escondida: su texto, su color, su primera celda [columna, fila desde el centro] y si va en vertical */
export type PalabraCampo = { texto: string; color: string; celda: [number, number]; vertical?: boolean };

export type CampoTipograficoProps = {
  /** fuente en formato typeface de three (JSON) */
  fuente: string;
  /** progreso del relato, de 0 a 1 (o segundos de reloj): lo escribe quien lo usa y se lee en cada fotograma */
  progreso: RefObject<number>;
  /** los colores vienen en lineal (como instanceColor: lo que mide cine:capture) en vez de sRGB (los tokens del tema) */
  coloresLineales?: boolean;
  /** avisa cuando la fuente ha cargado y el campo está montado */
  onReady?: () => void;
  columnas?: number;
  filas?: number;
  /** paso de la rejilla en x e y */
  paso?: [number, number];
  /** ancho y alto de cada letra (se escala el glifo para llenarlo) */
  letra?: [number, number];
  /** largo de la columna: la cara de arriba está en z = 0 */
  profundidad?: number;
  /** variación aleatoria de la altura de cada columna */
  variacion?: number;
  color?: string;
  rugosidad?: number;
  /** letras del relleno */
  letras?: string;
  semilla?: number;
  palabras: PalabraCampo[];
  /** cuánto suben las palabras y cuánto se hunde el resto, en unidades de escena */
  subida?: number;
  hundimiento?: number;
  /** rampas del reloj (progreso del scroll): empieza a subir, arriba del todo, empieza a bajar, abajo del todo */
  tramo?: [number, number, number, number];
  /** muelle por fotograma a 60 Hz: rigidez y amortiguación (x'' = k·(objetivo − x) − c·x') */
  muelle?: [number, number];
  /** muelle de la vuelta (sin rebote: amortiguación crítica, c = 2·√k); por defecto, el mismo de la subida */
  muelleVuelta?: [number, number];
  /** vuelta en onda radial: origen en el suelo y retraso (en unidades de reloj) por unidad de distancia */
  onda?: { origen: [number, number]; retraso: number };
  /** puntero: radio de influencia, cuánto hunde en el centro y el tinte */
  puntero?: { radio: number; hundir: number; tinte: string } | null;
  /** segmentos de las curvas de los glifos (la referencia usa pocos: 2) */
  segmentos?: number;
};

/** generador pseudoaleatorio con semilla (mulberry32): el relleno es siempre el mismo */
function aleatorio(semilla: number) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** material estándar con la cara de arriba teñida del color de la instancia y los laterales al 70 % */
function materialCampo(color: string, rugosidad: number) {
  const m = new THREE.MeshStandardMaterial({ color, roughness: rugosidad });
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying float vFace;").replace("#include <beginnormal_vertex>", "#include <beginnormal_vertex>\nvFace = objectNormal.z;");
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying float vFace;").replace(
      "#include <color_fragment>",
      `#if defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
        float face = smoothstep( 0.55, 0.92, vFace );
        diffuseColor.rgb *= mix( mix( vec3( 1.0 ), vColor.rgb, 0.7 ), vColor.rgb, face );
      #endif`,
    );
  };
  return m;
}

/** color lineal (como lo guarda instanceColor y lo mide la captura) o sRGB (un color CSS del tema) */
const colorDe = (css: string, lineales: boolean) => {
  if (!lineales) return new THREE.Color(css);
  const n = parseInt(css.slice(1), 16);
  return new THREE.Color().setRGB(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, THREE.LinearSRGBColorSpace);
};

type Celda = { x: number; y: number; z: number; letra: string; palabra: number; base: THREE.Color };

export default function TypeFieldMesh({
  fuente,
  progreso,
  coloresLineales = false,
  onReady,
  columnas = 56,
  filas = 23,
  paso = [0.44, 1],
  letra = [0.466, 0.996],
  profundidad = 6.535,
  variacion = 0.02,
  color = "#e9e2d8",
  rugosidad = 0.82,
  letras = "ABCDEFGHIKLMNOPRSTUVWY",
  semilla = 7,
  palabras,
  subida = 1.4,
  hundimiento = 0.7,
  tramo = [0.02, 0.1, 0.34, 0.39],
  muelle = [0.018, 0.094],
  muelleVuelta,
  onda = { origen: [0, 0], retraso: 0 },
  puntero = { radio: 1.6, hundir: 0.3, tinte: "#d4d7ff" },
  segmentos = 2,
}: CampoTipograficoProps) {
  const [font, setFont] = useState<Font | null>(null);
  useEffect(() => {
    new FontLoader().load(fuente, setFont);
  }, [fuente]);
  const reloj = progreso;
  const { raycaster, camera, pointer } = useThree();

  // la rejilla: relleno aleatorio con semilla y las palabras encima, en sus celdas
  const celdas = useMemo(() => {
    const rnd = aleatorio(semilla);
    const x0 = -((columnas - 1) * paso[0]) / 2;
    const y0 = -((filas - 1) * paso[1]) / 2;
    const out: Celda[][] = [];
    for (let c = 0; c < columnas; c++) {
      out.push([]);
      for (let f = 0; f < filas; f++)
        out[c].push({ x: x0 + c * paso[0], y: y0 + f * paso[1], z: (rnd() * 2 - 1) * variacion, letra: letras[Math.floor(rnd() * letras.length)], palabra: -1, base: new THREE.Color("#ffffff") });
    }
    // celda [columna, fila] con la fila contada desde el centro (como la referencia: y = fila · paso)
    palabras.forEach((p, w) => {
      [...p.texto].forEach((ch, k) => {
        const c = p.celda[0] + (p.vertical ? 0 : k);
        const f = Math.round(p.celda[1] - (p.vertical ? k : 0) + (filas - 1) / 2);
        const cel = out[c]?.[f];
        if (!cel) return;
        cel.letra = ch;
        cel.palabra = w;
        cel.base = colorDe(p.color, coloresLineales);
      });
    });
    return out.flat();
  }, [columnas, filas, paso, letras, semilla, variacion, palabras, coloresLineales]);

  // una InstancedMesh por letra distinta, con su glifo escalado a la celda y la cara de arriba en z = 0
  const grupos = useMemo(() => {
    if (!font) return [];
    const porLetra = new Map<string, number[]>();
    celdas.forEach((c, i) => (porLetra.get(c.letra) ?? porLetra.set(c.letra, []).get(c.letra)!).push(i));
    const mat = materialCampo(color, rugosidad);
    return [...porLetra].map(([ch, idx]) => {
      const g = new TextGeometry(ch, { font, size: 1, depth: profundidad, curveSegments: segmentos, bevelEnabled: false });
      g.computeBoundingBox();
      const bb = g.boundingBox!;
      const w = bb.max.x - bb.min.x || 1, h = bb.max.y - bb.min.y || 1;
      g.translate(-(bb.min.x + w / 2), -(bb.min.y + h / 2), -profundidad);
      g.scale(letra[0] / w, letra[1] / h, 1);
      g.computeVertexNormals();
      const mesh = new THREE.InstancedMesh(g, mat, idx.length);
      mesh.castShadow = mesh.receiveShadow = true;
      mesh.frustumCulled = false;
      mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(idx.length * 3), 3);
      return { mesh, idx };
    });
  }, [font, celdas, color, rugosidad, profundidad, letra, segmentos]);
  useEffect(() => () => grupos.forEach((g) => g.mesh.geometry.dispose()), [grupos]);
  useEffect(() => {
    if (grupos.length) onReady?.();
  }, [grupos, onReady]);

  /*
   * Un muelle por celda (z y velocidad). El objetivo de cada una: las palabras suben y el resto se hunde, con la subida en
   * rampa y a la vez, y la vuelta en onda radial desde `onda.origen` (cada celda vuelve `onda.retraso` de reloj más tarde
   * por unidad de distancia). El puntero hunde y tiñe alrededor, solo desde que el ratón se mueve de verdad (R3F pone el
   * puntero en el centro antes de cualquier evento).
   */
  const estado = useMemo(() => ({ z: new Float32Array(celdas.length), v: new Float32Array(celdas.length) }), [celdas]);
  const dist = useMemo(() => Float32Array.from(celdas.map((c) => Math.hypot(c.x - onda.origen[0], c.y - onda.origen[1]))), [celdas, onda.origen]);
  const ratonActivo = useRef(false);
  useEffect(() => {
    const on = () => (ratonActivo.current = true);
    addEventListener("pointermove", on, { once: true });
    return () => removeEventListener("pointermove", on);
  }, []);
  const plano = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const punto = useMemo(() => new THREE.Vector3(), []);
  const m4 = useMemo(() => new THREE.Matrix4(), []);
  const col = useMemo(() => new THREE.Color(), []);
  const blanco = useMemo(() => new THREE.Color("#ffffff"), []);
  const tinte = useMemo(() => colorDe(puntero?.tinte ?? "#ffffff", coloresLineales), [puntero?.tinte, coloresLineales]);

  useFrame((_, delta) => {
    const dt = Math.min(2, delta * 60);
    const r = reloj.current;
    const rampa = (a: number, b: number) => Math.min(1, Math.max(0, (r - a) / Math.max(1e-6, b - a)));
    const sube = rampa(tramo[0], tramo[1]);
    const [k, c] = muelle;
    const [kv, cv] = muelleVuelta ?? muelle;
    const vuelta = r > tramo[2];
    // dónde cae el puntero en el plano del suelo
    let hay = false;
    if (puntero && ratonActivo.current) {
      raycaster.setFromCamera(pointer, camera);
      hay = !!raycaster.ray.intersectPlane(plano, punto);
    }
    for (const { mesh, idx } of grupos) {
      idx.forEach((ci, j) => {
        const cel = celdas[ci];
        const d0 = dist[ci] * onda.retraso;
        const arriba = sube * (1 - rampa(tramo[2] + d0, tramo[3] + d0));
        let objetivo = cel.palabra >= 0 ? arriba * subida : -arriba * hundimiento;
        let f = 0;
        if (hay && puntero && cel.palabra < 0) {
          f = Math.max(0, 1 - Math.hypot(cel.x - punto.x, cel.y - punto.y) / puntero.radio);
          objetivo -= puntero.hundir * f;
        }
        // a la ida, el muelle con rebote; a la vuelta, el suyo (la referencia vuelve sin rebote)
        const [kk, cc] = vuelta ? [kv, cv] : [k, c];
        estado.v[ci] += (objetivo - estado.z[ci]) * kk * dt - estado.v[ci] * cc * dt;
        estado.z[ci] += estado.v[ci] * dt;
        // escondidas a la vista: las palabras son blancas en reposo y toman su color al subir
        if (cel.palabra >= 0) col.copy(blanco).lerp(cel.base, Math.min(1, Math.max(0, estado.z[ci] / subida)));
        else col.copy(cel.base).lerp(tinte, f);
        m4.makeTranslation(cel.x, cel.y, cel.z + estado.z[ci]);
        mesh.setMatrixAt(j, m4);
        mesh.setColorAt(j, col);
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group>
      {grupos.map((g, i) => (
        <primitive key={i} object={g.mesh} />
      ))}
    </group>
  );
}
