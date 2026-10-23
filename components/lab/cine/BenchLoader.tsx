"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { ESTUDIOS } from "./estudios";

const Bench = dynamic(() => import("./Bench"), { ssr: false });

/** El banco solo en el cliente (WebGPU no existe en el servidor). Recibe el id: las fichas no cruzan la frontera. */
export default function BenchLoader({ id }: { id: string }) {
  const ficha = ESTUDIOS[id];
  const scroll = ficha?.reloj === "scroll";
  // el sitio no hace scroll por defecto (html y body con overflow hidden): las páginas que lo necesitan lo piden así
  useEffect(() => {
    if (!scroll) return;
    document.documentElement.classList.add("scrollable");
    return () => document.documentElement.classList.remove("scrollable");
  }, [scroll]);
  if (!ficha) return null;
  return (
    // con reloj de scroll, la página mide la primera pantalla más `duracion` pantallas de recorrido
    <main style={{ background: "#000", minHeight: scroll ? `${(ficha.duracion + 1) * 100}vh` : "100vh" }}>
      <Bench ficha={ficha} />
    </main>
  );
}
