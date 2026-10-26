"use client";

import { useEffect, useState } from "react";

/** Browser-local demo state. Nothing is sent to a server, including contact details. */
export function useDemoState<T>(key: string, initial: T, validate: (value: unknown) => value is T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  const [temporary, setTemporary] = useState(false);
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(key) ?? "null");
      if (validate(saved)) setValue(saved);
    } catch { setTemporary(true); }
    setReady(true);
  }, [key, validate]);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { setTemporary(true); }
  }, [key, ready, value]);
  return { value, setValue, ready, temporary };
}

export function nextDays(count = 7) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
}
export const prettyDate = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });

/** Floating times intentionally remain in the local timezone of these fictional Spanish businesses. */
export function downloadCalendar(title: string, date: string, time: string, minutes: number, location: string) {
  const start = new Date(`${date}T${time}:00`);
  const end = new Date(start.getTime() + minutes * 60000);
  const stamp = (d: Date) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}00`;
  const text = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Trama//Demo//ES", "BEGIN:VEVENT", `UID:${crypto.randomUUID()}@trama.demo`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z")}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`, `SUMMARY:${title}`, `LOCATION:${location}`, "DESCRIPTION:Reserva de demostración. No es una cita real.", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url; link.download = "reserva-demo.ics"; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
