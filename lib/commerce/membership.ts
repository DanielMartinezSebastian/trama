"use client";

import { useCallback, useEffect, useState } from "react";
import type { ScheduleBooking } from "@/components/ui/ClassSchedule";

/*
 * Socio de un gimnasio, estudio o club en el cliente: el plan contratado y las plazas reservadas en clases (las de
 * `ClassSchedule`), en `localStorage`. Sale de Cadencia y Forja (/sitios), que lo tenían copiado. No habla con ningún
 * backend: es el estado de la interfaz de una demo.
 */

export type MemberPlan = { id: string; name: string; price: number; period: string; since: string; name_on?: string; code: string };
export type Membership = { plan: MemberPlan | null; bookings: (ScheduleBooking & { at: string })[] };

const VACIO: Membership = { plan: null, bookings: [] };
const valido = (v: unknown): v is Membership => !!v && typeof v === "object" && Array.isArray((v as Membership).bookings);

export function useMembership(storageKey = "trama:socio") {
  const [m, setM] = useState<Membership>(VACIO);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const v: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (valido(v)) setM(v);
    } catch {
      /* sin almacenamiento: en memoria */
    }
    setReady(true);
  }, [storageKey]);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(m));
    } catch {
      /* nada */
    }
  }, [m, ready, storageKey]);

  /** reserva plaza (o entra en lista de espera) en una clase de un día; si ya estaba, no la duplica */
  const book = useCallback((classId: string, date: string, waitlist = false) => setM((x) => (x.bookings.some((b) => b.classId === classId && b.date === date) ? x : { ...x, bookings: [...x.bookings, { classId, date, waitlist, at: new Date().toISOString() }] })), []);
  const cancel = useCallback((classId: string, date: string) => setM((x) => ({ ...x, bookings: x.bookings.filter((b) => !(b.classId === classId && b.date === date)) })), []);
  const join = useCallback((plan: Omit<MemberPlan, "since" | "code">) => setM((x) => ({ ...x, plan: { ...plan, since: new Date().toISOString().slice(0, 10), code: `SOC-${String(1000 + ((Date.now() / 1000) % 9000) | 0)}` } })), []);
  const leave = useCallback(() => setM((x) => ({ ...x, plan: null })), []);
  return { ...m, book, cancel, join, leave, ready };
}
