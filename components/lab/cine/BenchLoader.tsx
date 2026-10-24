"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Ficha } from "@/lib/cine/schema";
import { ESTUDIOS } from "./estudios";

const Bench = dynamic(() => import("./Bench"), { ssr: false });

/** mezcla profunda: los objetos se combinan y el resto (números, textos, listas) se sustituye */
function mezclar<T>(base: T, ajuste: unknown): T {
  if (!ajuste || typeof ajuste !== "object" || Array.isArray(ajuste) || !base || typeof base !== "object" || Array.isArray(base)) return (ajuste ?? base) as T;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(ajuste)) out[k] = mezclar(out[k], v);
  return out as T;
}

/**
 * El banco solo en el cliente (WebGPU no existe en el servidor). Recibe el id: las fichas no cruzan la frontera.
 * `?ajuste=<json>` se mezcla con la ficha (docs/26 §5): variantes rápidas para depurar sin tocar archivos, p. ej.
 * `?ajuste={"render":{"sombras":"ninguna"}}`. Las listas se sustituyen enteras.
 */
export default function BenchLoader({ id }: { id: string }) {
  const base = ESTUDIOS[id];
  const [ficha, setFicha] = useState<Ficha | undefined>(base);
  useEffect(() => {
    const raw = new URLSearchParams(location.search).get("ajuste");
    if (!raw || !base) return;
    try {
      setFicha(mezclar(base, JSON.parse(raw)));
    } catch (e) {
      console.error("[cine] ?ajuste no es JSON válido", e);
    }
  }, [base]);
  if (!ficha) return null;
  return (
    // una pantalla: el reloj de scroll es virtual (la rueda la lee el banco, como drei ScrollControls)
    <main style={{ background: "#000", minHeight: "100vh" }}>
      <Bench key={ficha === base ? "base" : "ajuste"} ficha={ficha} />
    </main>
  );
}
