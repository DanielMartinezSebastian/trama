"use client";

import { useCallback, useEffect, useState } from "react";

/*
 * Citas en el cliente (peluquería, barbería, estética, consulta): servicios, profesionales, huecos y las citas guardadas en
 * `localStorage`, como `useCart`. Sale de las reservas de Hebra y Esparta (/sitios), que lo tenían copiado. No habla con
 * ningún backend: es el estado de la interfaz de una demo o el punto de partida de una agenda real.
 */

export type BookingService = {
  id: string;
  name: string;
  /** duración en minutos: decide qué huecos caben */
  minutes: number;
  /** precio en euros (0 o sin precio = gratis o a consultar) */
  price?: number;
  /** «Desde 45 €» en vez del precio cerrado */
  from?: boolean;
  description?: string;
  category?: string;
};

export type BookingStaff = {
  name: string;
  role?: string;
  photo?: string;
  /** ids de los servicios que hace (sin lista: todos) */
  services?: string[];
  /** ids de los locales donde trabaja (sin lista: en todos) */
  places?: string[];
};

/** un sitio donde se atiende (cadena con varios locales); opcional */
export type BookingPlace = { id: string; name: string; address?: string };

export type Appointment = {
  id: string;
  service: string;
  staff: string;
  place?: string;
  /** ISO, «2026-10-24» */
  date: string;
  /** «10:30» */
  time: string;
  name: string;
};

const esCita = (a: unknown): a is Appointment => {
  const x = a as Appointment;
  return !!x && typeof x.id === "string" && typeof x.service === "string" && typeof x.staff === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x.date) && /^\d{2}:\d{2}$/.test(x.time) && typeof x.name === "string";
};

/**
 * Las citas guardadas en este navegador. Lee el almacenamiento tras montar (el primer pintado coincide con el del
 * servidor); sin almacenamiento (modo privado) funciona en memoria y `temporary` lo dice.
 */
export function useAppointments(storageKey = "trama:citas") {
  const [list, setList] = useState<Appointment[]>([]);
  const [ready, setReady] = useState(false);
  const [temporary, setTemporary] = useState(false);
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      if (Array.isArray(saved)) setList(saved.filter(esCita));
    } catch {
      setTemporary(true);
    }
    setReady(true);
  }, [storageKey]);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(list));
    } catch {
      setTemporary(true);
    }
  }, [list, ready, storageKey]);
  /** guarda una cita nueva o reemplaza la del mismo id (reprogramar) */
  const save = useCallback((a: Appointment) => setList((cur) => [...cur.filter((x) => x.id !== a.id), a]), []);
  const cancel = useCallback((id: string) => setList((cur) => cur.filter((x) => x.id !== id)), []);
  const sorted = [...list].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  return { list: sorted, save, cancel, ready, temporary };
}

const minutos = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

/**
 * Huecos de un día para un profesional: las horas de `times` que caben antes del cierre y no pisan otra cita suya. `busy`
 * marca algunos como ocupados de forma estable (la misma fecha y persona dan siempre los mismos), para que la agenda de una
 * demo no parezca vacía.
 */
export function bookingSlots(opts: {
  date: string;
  times: string[];
  service: BookingService;
  staff: string;
  appointments: Appointment[];
  services: BookingService[];
  /** «14:00» el sábado, por ejemplo: día de la semana (0 = domingo) → hora de cierre */
  closesAt?: Partial<Record<number, string>>;
  /** cita que se está cambiando: no cuenta como ocupada */
  ignoreId?: string;
  /** 0–1: proporción de huecos ocupados de mentira (0 = ninguno) */
  busy?: number;
}) {
  const { date, times, service, staff, appointments, services, closesAt = {}, ignoreId, busy = 0.25 } = opts;
  const cierre = closesAt[new Date(`${date}T12:00:00`).getDay()];
  // un hash por día, persona y hora (sin signo: `>>>`), para que la misma agenda salga siempre igual
  const hash = (t: string) => [...`${date}|${staff}|${t}`].reduce((n, c) => Math.imul(n ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);
  return times
    .filter((t) => !cierre || minutos(t) + service.minutes <= minutos(cierre))
    .map((t) => {
      const pisa = appointments.some((a) => a.id !== ignoreId && a.date === date && a.staff === staff && Math.abs(minutos(a.time) - minutos(t)) < Math.max(service.minutes, services.find((s) => s.id === a.service)?.minutes ?? 30));
      const ocupado = busy > 0 && (hash(t) % 100) / 100 < busy;
      return { time: t, disabled: pisa || ocupado, note: pisa ? "tu cita" : "" };
    });
}

/** «sábado, 24 de octubre» */
export const prettyDate = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });

/** descarga un .ics con la cita (hora local del negocio) */
export function downloadCalendar(title: string, date: string, time: string, minutes: number, location: string) {
  const start = new Date(`${date}T${time}:00`);
  const end = new Date(start.getTime() + minutes * 60000);
  const stamp = (d: Date) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}00`;
  const text = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Trama//Reserva//ES", "BEGIN:VEVENT", `UID:${crypto.randomUUID()}@trama.demo`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z")}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`, `SUMMARY:${title}`, `LOCATION:${location}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "cita.ics";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** horas que faltan para una cita (negativo si ya pasó) */
export const hoursUntil = (a: Pick<Appointment, "date" | "time">) => (new Date(`${a.date}T${a.time}:00`).getTime() - Date.now()) / 3600000;
