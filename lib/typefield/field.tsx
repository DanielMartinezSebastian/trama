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
  /**
   * columnas y filas de relleno de más a cada lado, fuera de la rejilla de las palabras (que no se mueve): para lienzos más
   * anchos que el de la referencia, donde se vería el borde del campo
   */
  margen?: [number, number];
  /** paso de la rejilla en x e y */
  paso?: [number, number];
  /** ancho y alto de cada letra (se escala el glifo para llenarlo) */
  letra?: [number, number];
  /** largo de la columna: la cara de arriba está en z = 0 */
  profundidad?: number;
  /** variación aleatoria de la altura de cada columna */
  variacion?: number;
  color?: string;
  /**
   * color de instancia del relleno y de las palabras escondidas: el del material lo multiplica. Blanco con el material del
   * color de las letras (la referencia); con fondos oscuros, material blanco y aquí el color de las letras, para que las
   * palabras no se apaguen al multiplicarse por un material oscuro
   */
  reposo?: string;
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
  /**
   * muelle de la subida de las palabras (en la referencia, más vivo que el del suelo); por defecto, `muelle`. Un tercer
   * valor es la amortiguación de la última letra, interpolada desde la primera: en la referencia cada palabra rebota más
   * al final (ζ 0,52 → 0,34)
   */
  muellePalabras?: [number, number] | [number, number, number];
  /**
   * las palabras suben letra a letra en orden de lectura: retraso (en unidades de reloj) de cada letra sobre la anterior. Las
   * palabras no siguen la onda de subida del suelo: empiezan todas a la vez, en `tramo[0]`
   */
  escalonado?: number;
  /** y bajan al revés, desde la última letra: retraso de cada letra sobre la siguiente; sin él, siguen la onda de vuelta */
  escalonadoVuelta?: number;
  /**
   * onda radial: origen en el suelo y retraso (en unidades de reloj) por unidad de distancia, de la vuelta y, si se da, de
   * la subida del suelo (en la referencia, ida y vuelta en la misma onda desde el centro: 1,7 fotogramas por unidad)
   */
  onda?: { origen: [number, number]; retraso: number; retrasoSubida?: number };
  /**
   * puntero: radio de influencia, cuánto hunde en el centro y el tinte. `curva` es el exponente de la caída, (1 − d/radio)^curva
   * (1 = cono; la referencia, 1,4), y `borde`, la fracción del hundido que se levanta en un anillo de radio a 1,9 × radio,
   * como el material que se aparta (la referencia, 2,5 %)
   */
  puntero?: { radio: number; hundir: number; tinte: string; curva?: number; borde?: number } | null;
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

/** material estándar con la cara de arriba teñida del color de la instancia y los laterales al 70 % (desde el de reposo) */
function materialCampo(color: string, rugosidad: number, reposo: THREE.Color) {
  const m = new THREE.MeshStandardMaterial({ color, roughness: rugosidad });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uReposo = { value: reposo };
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying float vFace;").replace("#include <beginnormal_vertex>", "#include <beginnormal_vertex>\nvFace = objectNormal.z;");
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying float vFace;\nuniform vec3 uReposo;").replace(
      "#include <color_fragment>",
      `#if defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
        float face = smoothstep( 0.55, 0.92, vFace );
        diffuseColor.rgb *= mix( mix( uReposo, vColor.rgb, 0.7 ), vColor.rgb, face );
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

/** orden = posición de la letra en su palabra; fraccion = la misma de 0 (primera) a 1 (última); largo = letras − 1 */
type Celda = { x: number; y: number; z: number; letra: string; palabra: number; orden: number; fraccion: number; largo: number; base: THREE.Color };

export default function TypeFieldMesh({
  fuente,
  progreso,
  coloresLineales = false,
  onReady,
  columnas = 56,
  filas = 23,
  margen = [0, 0],
  paso = [0.44, 1],
  letra = [0.466, 0.996],
  profundidad = 6.535,
  variacion = 0.02,
  color = "#e9e2d8",
  reposo = "#ffffff",
  rugosidad = 0.82,
  letras = "ABCDEFGHIKLMNOPRSTUVWY",
  semilla = 7,
  palabras,
  subida = 1.4,
  hundimiento = 0.7,
  tramo = [0.02, 0.1, 0.34, 0.39],
  muelle = [0.018, 0.094],
  muelleVuelta,
  muellePalabras,
  escalonado = 0,
  escalonadoVuelta,
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
    // el relleno del margen sale de otra semilla: la rejilla de la referencia queda letra a letra igual
    const rnd = aleatorio(semilla);
    const rndMargen = aleatorio(semilla + 1);
    const x0 = -((columnas - 1) * paso[0]) / 2;
    const y0 = -((filas - 1) * paso[1]) / 2;
    const [mc, mf] = margen;
    const out: Celda[][] = [];
    const extra: Celda[] = [];
    for (let c = -mc; c < columnas + mc; c++) {
      if (c >= 0 && c < columnas) out.push([]);
      for (let f = -mf; f < filas + mf; f++) {
        const dentro = c >= 0 && c < columnas && f >= 0 && f < filas;
        const r = dentro ? rnd : rndMargen;
        const cel = { x: x0 + c * paso[0], y: y0 + f * paso[1], z: (r() * 2 - 1) * variacion, letra: letras[Math.floor(r() * letras.length)], palabra: -1, orden: 0, fraccion: 0, largo: 0, base: colorDe(reposo, coloresLineales) };
        if (dentro) out[c].push(cel);
        else extra.push(cel);
      }
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
        cel.orden = k;
        cel.fraccion = p.texto.length > 1 ? k / (p.texto.length - 1) : 0;
        cel.largo = p.texto.length - 1;
        cel.base = colorDe(p.color, coloresLineales);
      });
    });
    return [...out.flat(), ...extra];
  }, [columnas, filas, margen[0], margen[1], paso, letras, semilla, variacion, palabras, reposo, coloresLineales]);

  // una InstancedMesh por letra distinta, con su glifo escalado a la celda y la cara de arriba en z = 0
  const grupos = useMemo(() => {
    if (!font) return [];
    const porLetra = new Map<string, number[]>();
    celdas.forEach((c, i) => (porLetra.get(c.letra) ?? porLetra.set(c.letra, []).get(c.letra)!).push(i));
    const mat = materialCampo(color, rugosidad, colorDe(reposo, coloresLineales));
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
  }, [font, celdas, color, reposo, coloresLineales, rugosidad, profundidad, letra, segmentos]);
  useEffect(() => () => grupos.forEach((g) => g.mesh.geometry.dispose()), [grupos]);
  useEffect(() => {
    if (grupos.length) onReady?.();
  }, [grupos, onReady]);

  /*
   * Un muelle por celda (z y velocidad). El objetivo de cada una: las palabras suben y el resto se hunde, con la subida en
   * rampa: el suelo baja en onda radial desde `onda.origen` (`onda.retrasoSubida` de reloj más tarde por unidad de
   * distancia) y las palabras suben letra a letra (`escalonado`); a la vuelta, el suelo en onda radial (`onda.retraso`)
   * y las palabras desde la última letra (`escalonadoVuelta`). El puntero hunde y tiñe alrededor, solo desde que el ratón se mueve de verdad (R3F pone el
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
  const blanco = useMemo(() => colorDe(reposo, coloresLineales), [reposo, coloresLineales]);
  const tinte = useMemo(() => colorDe(puntero?.tinte ?? "#ffffff", coloresLineales), [puntero?.tinte, coloresLineales]);

  useFrame((_, delta) => {
    const dt = Math.min(2, delta * 60);
    const r = reloj.current;
    const rampa = (a: number, b: number) => Math.min(1, Math.max(0, (r - a) / Math.max(1e-6, b - a)));
    const [k, c] = muelle;
    const [kp, cp, cpUltima = cp] = muellePalabras ?? muelle;
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
        const d0 = cel.palabra >= 0 && escalonadoVuelta !== undefined ? (1 - cel.fraccion) * cel.largo * escalonadoVuelta : dist[ci] * onda.retraso;
        const d1 = cel.palabra >= 0 ? cel.orden * escalonado : dist[ci] * (onda.retrasoSubida ?? 0);
        const arriba = rampa(tramo[0] + d1, tramo[1] + d1) * (1 - rampa(tramo[2] + d0, tramo[3] + d0));
        let objetivo = cel.palabra >= 0 ? arriba * subida : -arriba * hundimiento;
        let f = 0;
        if (hay && puntero && cel.palabra < 0) {
          const d = Math.hypot(cel.x - punto.x, cel.y - punto.y) / puntero.radio;
          f = Math.max(0, 1 - d) ** (puntero.curva ?? 1);
          objetivo -= puntero.hundir * f;
          if (puntero.borde && d > 1 && d < 1.9) objetivo += puntero.hundir * puntero.borde * Math.sin((Math.PI * (d - 1)) / 0.9);
        }
        // a la ida, el de las palabras o el del suelo; a la vuelta, el suyo
        const [kk, cc] = vuelta ? [kv, cv] : cel.palabra >= 0 ? [kp, cp + (cpUltima - cp) * cel.fraccion] : [k, c];
        estado.v[ci] += (objetivo - estado.z[ci]) * kk * dt - estado.v[ci] * cc * dt;
        estado.z[ci] += estado.v[ci] * dt;
        // escondidas a la vista: las palabras son del color de reposo y toman su color al subir
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
