"use client";

import { useCallback, useEffect, useState } from "react";

/*
 * Reservas de mesa para una función (cena con espectáculo, sala, teatro pequeño): las guarda este navegador y las comparten
 * `ShowBookingFlow` y la página de «mis entradas» de cada web. Al escribir avisa a las demás copias del gancho en la misma
 * pestaña (evento `trama:funciones`), para que el contador de la cabecera y la lista se pongan al día sin recargar.
 */

export type ShowBooking = {
  id: string;
  eventId: string;
  event: string;
  date: string;
  time: string;
  table: string;
  zone: string;
  guests: number;
  menu: string;
  total: number;
  paid: number;
  name: string;
  email: string;
  at: string;
};

const esReserva = (v: unknown): v is ShowBooking => typeof v === "object" && v !== null && typeof (v as ShowBooking).id === "string" && typeof (v as ShowBooking).eventId === "string";
const AVISO = "trama:funciones";

export function useShowBookings(storageKey = "trama:funciones") {
  const [list, setList] = useState<ShowBooking[]>([]);
  const [ready, setReady] = useState(false);
  const [temporary, setTemporary] = useState(false);
  const leer = useCallback(() => {
    try {
      const v: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      setList(Array.isArray(v) ? v.filter(esReserva) : []);
    } catch {
      setTemporary(true);
    }
  }, [storageKey]);
  useEffect(() => {
    leer();
    setReady(true);
    const otra = (e: Event) => (e as CustomEvent<string>).detail === storageKey && leer();
    window.addEventListener(AVISO, otra);
    return () => window.removeEventListener(AVISO, otra);
  }, [leer, storageKey]);
  const escribir = useCallback(
    (next: ShowBooking[]) => {
      setList(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
        window.dispatchEvent(new CustomEvent(AVISO, { detail: storageKey }));
      } catch {
        setTemporary(true);
      }
    },
    [storageKey],
  );
  const add = useCallback((b: ShowBooking) => escribir([...list.filter((x) => x.id !== b.id), b]), [escribir, list]);
  const cancel = useCallback((id: string) => escribir(list.filter((x) => x.id !== id)), [escribir, list]);
  const sorted = [...list].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  return { list: sorted, add, cancel, ready, temporary };
}

/**
 * Mesas ocupadas de una función, estables (la misma función da siempre las mismas): más con «últimas mesas», ninguna libre
 * si está agotada. Para que el plano de una demo no parezca vacío. Las reservas propias se suman aparte.
 */
export function takenTables(eventId: string, tableIds: string[], status: "open" | "few" | "soldout" | "cancelled" = "open") {
  if (status === "soldout" || status === "cancelled") return tableIds;
  const umbral = status === "few" ? 0.72 : 0.34;
  return tableIds.filter((t) => ([...`${eventId}|${t}`].reduce((n, c) => Math.imul(n ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261) % 1000) / 1000 < umbral);
}
