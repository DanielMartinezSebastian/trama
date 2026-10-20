/**
 * Horario de un negocio en texto («L-V|07:30-14:00 17:00-20:30»): lectura, estado «abierto ahora» en la zona horaria del
 * negocio y `openingHoursSpecification` de schema.org. Lógica pura (sin React): la usan `OpeningHours` y los JSON-LD
 * que se generan en el servidor.
 */
import { splitList } from "./list";

/** Un día de la semana (0 = domingo … 6 = sábado, como `Date.getDay()`) con sus tramos en minutos desde las 00:00. */
export type DayHours = { day: number; ranges: [number, number][] };
/** Cierre puntual (festivo, vacaciones) o apertura especial: fecha ISO `2026-12-24` y, si abre, sus tramos. */
export type HoursException = { date: string; label?: string; ranges?: [number, number][] };

const LETTERS = ["D", "L", "M", "X", "J", "V", "S"];
export const DAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const ORDER = [1, 2, 3, 4, 5, 6, 0];

const toMin = (s: string) => {
  const [h, m = "0"] = s.trim().split(":");
  return Number(h) * 60 + Number(m);
};
export const fmt = (m: number) => `${String(Math.floor((m % 1440) / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const parseRanges = (s: string): [number, number][] =>
  /cerrad/i.test(s) || !s.trim()
    ? []
    : s
        .trim()
        .split(/\s+|,/)
        .filter(Boolean)
        .map((r) => {
          const [a, b] = r.split("-").map(toMin);
          return [a, b <= a ? b + 1440 : b] as [number, number];
        });

function parseDays(s: string): number[] {
  const out = new Set<number>();
  for (const part of s.split(",")) {
    const [a, b] = part.trim().toUpperCase().split("-");
    const ia = LETTERS.indexOf(a);
    if (ia < 0) continue;
    if (!b) out.add(ia);
    else {
      // rango en el orden de la semana española (L → D)
      const oa = ORDER.indexOf(ia);
      const ob = ORDER.indexOf(LETTERS.indexOf(b));
      for (let k = oa; k <= (ob < oa ? ob + 7 : ob); k++) out.add(ORDER[k % 7]);
    }
  }
  return [...out];
}

/** Lee el formato de texto de `hours` (lo usa el componente y `openingHoursSchema`). */
export function parseHours(hours: string): DayHours[] {
  const week: DayHours[] = ORDER.map((day) => ({ day, ranges: [] }));
  for (const line of splitList(hours, "\n")) {
    const [days, ranges = ""] = line.split("|");
    for (const d of parseDays(days)) week.find((w) => w.day === d)!.ranges = parseRanges(ranges);
  }
  return week;
}

export function parseExceptions(text: string): HoursException[] {
  return splitList(text, "\n").map((l) => {
    const [date, label = "", ranges = ""] = l.split("|").map((x) => x.trim());
    return { date, label, ranges: ranges ? parseRanges(ranges) : [] };
  });
}

/**
 * `openingHoursSpecification` de schema.org a partir del mismo texto: ponlo en el JSON-LD del negocio (`LocalBusiness`,
 * `Bakery`, `Restaurant`…) para que el horario de la web coincida con el de la ficha de Google (B12 en docs/11).
 */
export function openingHoursSchema(hours: string, exceptions = "") {
  const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const spec: Record<string, unknown>[] = [];
  for (const d of parseHours(hours)) for (const [a, b] of d.ranges) spec.push({ "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${DAY[d.day]}`, opens: fmt(a), closes: fmt(b) });
  for (const e of parseExceptions(exceptions)) {
    if (!e.ranges?.length) spec.push({ "@type": "OpeningHoursSpecification", validFrom: e.date, validThrough: e.date, opens: "00:00", closes: "00:00" });
    else for (const [a, b] of e.ranges) spec.push({ "@type": "OpeningHoursSpecification", validFrom: e.date, validThrough: e.date, opens: fmt(a), closes: fmt(b) });
  }
  return spec;
}

/** Fecha y minutos de ahora en la zona del negocio. */
export function nowIn(timeZone: string) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", weekday: "short", hourCycle: "h23" }).formatToParts(new Date()).map((p) => [p.type, p.value]));
  const iso = `${parts.year}-${parts.month}-${parts.day}`;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
  return { iso, day, min: Number(parts.hour) * 60 + Number(parts.minute) };
}
const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

export type HoursStatus = { open: boolean; soon: boolean; text: string; detail: string };

export function hoursStatus(week: DayHours[], exceptions: HoursException[], timeZone: string, soonMinutes = 30): HoursStatus {
  const now = nowIn(timeZone);
  const rangesOn = (iso: string, day: number) => {
    const ex = exceptions.find((e) => e.date === iso);
    return { ranges: ex ? ex.ranges ?? [] : week.find((w) => w.day === day)?.ranges ?? [], label: ex?.label };
  };
  // ¿abierto ahora? (también por un tramo de ayer que pasa de medianoche)
  const today = rangesOn(now.iso, now.day);
  const yesterday = rangesOn(addDays(now.iso, -1), (now.day + 6) % 7);
  const current = today.ranges.find(([a, b]) => now.min >= a && now.min < b) ?? yesterday.ranges.map(([a, b]) => [a - 1440, b - 1440] as [number, number]).find(([a, b]) => now.min >= a && now.min < b);
  if (current) {
    const left = current[1] - now.min;
    return { open: true, soon: left <= soonMinutes, text: left <= soonMinutes ? "Cierra pronto" : "Abierto ahora", detail: `cierra a las ${fmt(current[1])}` };
  }
  // próxima apertura: hoy más tarde o los 14 días siguientes
  for (let k = 0; k < 14; k++) {
    const iso = addDays(now.iso, k);
    const day = (now.day + k) % 7;
    const r = rangesOn(iso, day).ranges.find(([a]) => k > 0 || a > now.min);
    if (!r) continue;
    const when = k === 0 ? "hoy" : k === 1 ? "mañana" : `el ${DAY_NAMES[day]}`;
    return { open: false, soon: false, text: today.label && !today.ranges.length ? `Cerrado hoy · ${today.label}` : "Cerrado", detail: `abre ${when} a las ${fmt(r[0])}` };
  }
  return { open: false, soon: false, text: "Cerrado", detail: "" };
}

