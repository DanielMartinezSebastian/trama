"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FlameHorizon from "@/components/ui/FlameHorizon";
import ThornEmblem, { type PoseEmblema } from "@/components/ui/ThornEmblem";
import { CURVAS, seguidorRaf } from "@/lib/motion/scroll-feel";

/*
 * Lo que rodea al relato de Brasa, como en meermohsin.me (docs/36 B1), atado al scroll con las posiciones medidas en la referencia
 * (vista de 1280 × 720, cine:capture con rueda de 200 px):
 *   - las llamas van fijas de 1 300 a 3 300 px: suben (1 692 px: el rojo llena el 70 %), lo llenan todo (2 320 px) y se
 *     invierten (2 987 px: llamas negras con manos abajo);
 *   - el emblema va fijo encima de todo: de frente en la portada, de canto y vertical hacia los 2 400 px, y luego sube
 *     y se apaga sobre el relato (3 625–4 919 px) hasta desaparecer hacia los 5 500 px.
 */
/** la cámara de la escena del emblema en la referencia (sonda: fov 35 en z = 14) */
const CAMARA = { position: [0, 0, 14] as [number, number, number], fov: 35 };
/** tramo de scroll [a, b] con curva en S (docs/42: nada lineal; lo que llega, se asienta) */
const tramo = (y: number, a: number, b: number) => CURVAS.smooth(Math.min(1, Math.max(0, (y - a) / (b - a))));

/*
 * La coreografía del emblema, medida en la referencia fotograma a fotograma (scroll en px con 720 de alto; giro en rad;
 * altura en unidades de la escena, ±4,4 de borde a borde; brillo 0–1). Sale de los ojos de la portada dando vueltas en
 * 3D: de canto en X (320, 1032), plano (462, 610, 1720), de frente como una mariposa (800, 2120, 3319), vertical (2919).
 * Al llegar al relato se encoge, se oscurece y se queda pequeño arriba (4319–8400) hasta que llega el papel rasgado.
 */
type Clave = [y: number, yaw: number, pitch: number, roll: number, escala: number, alto: number, brillo: number, aleteo: number];
const CLAVES: Clave[] = [
  [0, 0, 0, 0, 1.75, 0.85, 1, 0.12],
  [167, 0.6, 0.05, -0.15, 1.9, 0.9, 1, 0.2],
  [320, 1.5, 0.1, 0.3, 1.9, 0.3, 1, 0.45],
  [462, 1.9, 1.35, 0.1, 2.1, -0.8, 1, 0.3],
  [610, 2.3, 1.25, 0, 2, -0.3, 1, 0.2],
  [800, 3.14, 0.1, 0, 1.6, 0, 1, 0.15],
  [1032, 4.6, 0.15, 0.4, 1.7, 0, 1, 0.45],
  [1322, 6.0, 0.5, 0, 1.8, -0.2, 1, 0.2],
  [1720, 6.6, 1.3, 0, 1.9, -0.6, 0.95, 0.25],
  [2120, 7.6, 0.05, 0, 2.2, 0, 0.85, 0.12],
  [2520, 8.2, 0.6, 0.2, 2.1, 0, 0.9, 0.3],
  [2919, 9.0, 0.1, 1.57, 2.2, 0, 1, 0.05],
  [3319, 9.42, 0, 0, 2.4, 0, 1, 0.12],
  [3719, 9.42, 0.05, 0, 2.6, -1.0, 1, 0.15],
  [4319, 9.6, 0.1, 0, 1.0, 3.0, 0.35, 0.18],
  [5025, 9.8, 0.1, 0, 0.8, 3.3, 0.3, 0.2],
  [8400, 10.6, 0.1, 0, 0.8, 3.3, 0.3, 0.2],
  [8750, 10.8, 0.1, 0, 0.7, 3.6, 0, 0.2],
];
function poseEn(y: number): PoseEmblema {
  let k = 0;
  while (k < CLAVES.length - 2 && y > CLAVES[k + 1][0]) k++;
  const a = CLAVES[k], b = CLAVES[k + 1];
  const t = tramo(y, a[0], b[0]);
  const m = (i: number) => a[i] + (b[i] - a[i]) * t;
  return { giro: [m(2), m(1), m(3)], escala: m(4), y: m(5), brillo: m(6), aleteo: m(7) };
}

export default function Relato() {
  // una sola posición de scroll, amortiguada (5/s: el scroll ya tiene la inercia de feel="cinematic"), de la que sale todo:
  // llamas y emblema van a la vez y no copian cada tirón de la rueda (docs/42, docs/02 §6.5)
  const [y, setY] = useState(0);
  const yRef = useRef(0);
  useEffect(() => {
    const seg = seguidorRaf(5, (v) => {
      yRef.current = v;
      setY(v);
    });
    let raf = 0;
    const lee = () => {
      raf = 0;
      seg.set(window.scrollY);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(lee);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    lee();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      seg.stop();
    };
  }, []);
  const llamas = Math.min(1, Math.max(0, (y - 1300) / 1750));
  const verLlamas = y > 1100 && y < 3450;
  // las llamas tapan el relato hasta que este se fija (en la referencia, a 2 987 px aún llenan la pantalla)
  const funde = 1 - tramo(y, 3150, 3400);
  // el emblema lee la posición en cada fotograma de su escena (sin pasar por React)
  const coreografia = useCallback(() => poseEn(yRef.current), []);
  return (
    <>
      {verLlamas && (
        <div style={{ position: "fixed", inset: 0, zIndex: 5, opacity: funde }}>
          <FlameHorizon progress={llamas} position="absolute" color="#c8000f" />
        </div>
      )}
      {y < 8800 && (
        <div style={{ position: "fixed", inset: 0, zIndex: 6, pointerEvents: "none" }}>
          <ThornEmblem height="100%" shape="wings" lighting="red" choreography={coreografia} interactive={false} camera={CAMARA} toneMapped={false} />
        </div>
      )}
    </>
  );
}
