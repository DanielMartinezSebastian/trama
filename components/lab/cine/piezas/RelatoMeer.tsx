"use client";

import { useEffect, useState } from "react";
import FlameHorizon from "@/components/ui/FlameHorizon";
import ThornEmblem from "@/components/ui/ThornEmblem";
import { CURVAS, seguidorRaf } from "@/lib/motion/scroll-feel";

/*
 * Lo que rodea al relato en meermohsin.me (docs/36 B1), atado al scroll con las posiciones medidas en la referencia
 * (vista de 1280 × 720, cine:capture con rueda de 200 px):
 *   - las llamas van fijas de 1 300 a 3 300 px: suben (1 692 px: el rojo llena el 70 %), lo llenan todo (2 320 px) y se
 *     invierten (2 987 px: llamas negras con manos abajo);
 *   - el emblema va fijo encima de todo: de frente en la portada, de canto y vertical hacia los 2 400 px, y luego sube
 *     y se apaga sobre el relato (3 625–4 919 px) hasta desaparecer hacia los 5 500 px.
 */
const CAMARA = { position: [0, 0, 1.2] as [number, number, number], fov: 45 };
/** tramo de scroll [a, b] con curva en S (docs/42: nada lineal; lo que llega, se asienta) */
const tramo = (y: number, a: number, b: number) => CURVAS.smooth(Math.min(1, Math.max(0, (y - a) / (b - a))));

export default function RelatoMeer() {
  // una sola posición de scroll, amortiguada (5/s: el scroll ya tiene la inercia de feel="cinematic"), de la que sale todo:
  // llamas, máscara y su salida van a la vez y no copian cada tirón de la rueda (docs/42, docs/02 §6.5)
  const [y, setY] = useState(0);
  useEffect(() => {
    const seg = seguidorRaf(5, setY);
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
  const gira = tramo(y, 500, 2400);
  const sube = tramo(y, 3000, 4600);
  // la salida sobre el relato: primero se apaga a un 40 % y se desenfoca (queda detrás, como en la referencia, sin tapar la
  // palabra ni la tarjeta) y luego se va del todo; antes iba a plena luz hasta desaparecer de golpe
  const tenue = 1 - 0.6 * tramo(y, 3100, 3700);
  const apaga = tenue * (1 - tramo(y, 4400, 5200));
  const desenfoque = 3 * tramo(y, 3100, 3700);
  return (
    <>
      {verLlamas && (
        <div style={{ position: "fixed", inset: 0, zIndex: 5, opacity: funde }}>
          <FlameHorizon progress={llamas} position="absolute" color="#c8000f" />
        </div>
      )}
      {/* en la portada la máscara va sobre los ojos del retrato (un 15 % por encima del centro) y baja al empezar el scroll */}
      <div style={{ position: "fixed", inset: 0, zIndex: 6, pointerEvents: "none", opacity: apaga, filter: desenfoque > 0.05 ? `blur(${desenfoque.toFixed(2)}px)` : undefined, transform: `translateY(${-15 * (1 - tramo(y, 0, 700)) - sube * 22}vh)` }}>
        {/* la cámara de la referencia (fija en z = 1,2 con fov 45): el emblema, a la escala que le corresponde */}
        <ThornEmblem height="100%" shape="mask" progress={gira} interactive={false} camera={CAMARA} toneMapped={false} scale={(0.72 - 0.18 * sube) * 0.26} />
      </div>
    </>
  );
}
