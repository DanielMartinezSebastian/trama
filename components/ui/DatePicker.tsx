"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { splitList } from "@/lib/ui/list";
import { vcls, type Variant } from "./variants";

/** Un hueco horario del día elegido. */
export type DateSlot = { time: string; disabled?: boolean; /** texto corto bajo la hora: «2 plazas», «último» */ note?: string };

export type DatePickerProps = {
  /** single = un día · range = llegada y salida (o inicio y fin) */
  mode?: "single" | "range";
  /** fecha ISO (`2026-10-24`) o intervalo ISO (`2026-10-24/2026-10-27`) en `range` */
  value?: string;
  onChange?: (value: string) => void;
  /** primer día elegible: fecha ISO o días desde hoy (`2` = pasado mañana; encargos con 48 h de antelación) */
  min?: string | number;
  /** último día elegible: fecha ISO o días desde hoy */
  max?: string | number;
  /** días de la semana cerrados (0 = domingo … 6 = sábado), separados por comas: «0» o «0,1» */
  closedDays?: string;
  /** fechas sueltas no disponibles (festivos, completos), separadas por comas */
  disabledDates?: string;
  /** huecos de cada día, separados por comas («09:00, 10:30, 12:00») o una función por fecha (disponibilidad real) */
  slots?: string | ((date: string) => DateSlot[]);
  slot?: string;
  onSlotChange?: (slot: string) => void;
  /** meses a la vista (2 en escritorio para rangos de hotel) */
  months?: 1 | 2;
  /** texto del grupo de huecos */
  slotsLabel?: string;
  /** noches mínimas en `range` */
  minNights?: number;
  /** atajos con los próximos N días disponibles («Hoy», «Mañana», «jue 23») encima del calendario (solo `single`) */
  shortcuts?: number;
  /** open = calendario siempre a la vista · collapsed = solo los atajos y «Otro día…», que despliega el calendario */
  calendar?: "open" | "collapsed";
  /** nombre accesible del calendario */
  label?: string;
  variant?: Variant;
  className?: string;
};

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromIso = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
};
const add = (s: string, n: number) => {
  const d = fromIso(s);
  d.setDate(d.getDate() + n);
  return iso(d);
};
const resolve = (v: string | number | undefined, today: string) => (v === undefined || v === "" ? undefined : typeof v === "number" ? add(today, v) : v);
const nights = (a: string, b: string) => Math.round((fromIso(b).getTime() - fromIso(a).getTime()) / 86_400_000);
const WD = ["L", "M", "X", "J", "V", "S", "D"];
const WD_LONG = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
const longDate = (s: string) => fromIso(s).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });

/**
 * Calendario en línea para elegir un día (cita, encargo, recogida) o un rango (hotel, alquiler), con días cerrados,
 * antelación mínima y huecos horarios del día elegido. Es una cuadrícula ARIA: flechas ±1 día y ±1 semana, Inicio/Fin
 * de semana, RePág/AvPág de mes, Intro o espacio para elegir. Controlado o no: `value` + `onChange` (ISO), igual que
 * `slot` + `onSlotChange`. Sin JS se ve el mes en curso. La disponibilidad real llega con `slots` como función.
 */
export default function DatePicker({
  mode = "single",
  value,
  onChange,
  min = 0,
  max = 90,
  closedDays = "",
  disabledDates = "",
  slots = "",
  slot,
  onSlotChange,
  months = 1,
  slotsLabel = "Hora",
  minNights = 1,
  shortcuts = 0,
  calendar = "open",
  label = mode === "range" ? "Elige las fechas" : "Elige un día",
  variant = "minimal",
  className = "",
}: DatePickerProps) {
  const uid = useId();
  // «hoy» solo en el cliente: el servidor y el primer pintado coinciden con un mes neutro
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(iso(new Date())), []);
  const base = today ?? (value ? value.slice(0, 10) : iso(new Date(2026, 0, 1, 12)));

  const [inner, setInner] = useState(value ?? "");
  const val = value ?? inner;
  const [start, end] = val.split("/");
  const set = (v: string) => {
    setInner(v);
    onChange?.(v);
  };
  const [innerSlot, setInnerSlot] = useState(slot ?? "");
  const curSlot = slot ?? innerSlot;
  const pickSlot = (s: string) => {
    setInnerSlot(s);
    onSlotChange?.(s);
  };

  const minD = resolve(min, base);
  const maxD = resolve(max, base);
  const closed = useMemo(() => splitList(closedDays).map(Number), [closedDays]);
  const off = useMemo(() => new Set(splitList(disabledDates)), [disabledDates]);
  const blocked = (d: string) => (minD !== undefined && d < minD) || (maxD !== undefined && d > maxD) || closed.includes(fromIso(d).getDay()) || off.has(d);

  const [view, setView] = useState(() => (start || base).slice(0, 7));
  const [focus, setFocus] = useState<string>(start || base);
  // al conocer «hoy» (tras montar), el mes y el día con foco pasan a hoy si aún no hay nada elegido
  useEffect(() => {
    if (!today || start) return;
    setView(today.slice(0, 7));
    setFocus(today);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);
  const [hover, setHover] = useState<string>("");
  const grid = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    grid.current?.querySelector<HTMLElement>(`[data-date="${focus}"]`)?.focus();
  }, [focus, view]);

  const choose = (d: string) => {
    if (blocked(d)) return;
    if (mode === "single") {
      set(d);
      return;
    }
    // rango: primer clic = inicio; segundo = fin (si es posterior); un tercero empieza otro rango
    if (!start || end || d <= start) set(d);
    else if (nights(start, d) < minNights) set(`${start}/${add(start, minNights)}`);
    else {
      // un día cerrado en medio rompe el rango: empieza de nuevo en el día pulsado
      for (let k = add(start, 1); k < d; k = add(k, 1)) if (off.has(k)) return set(d);
      set(`${start}/${d}`);
    }
  };

  const moveFocus = (d: string) => {
    moved.current = true;
    setFocus(d);
    if (d.slice(0, 7) !== view && (months === 1 || d.slice(0, 7) !== nextMonth(view))) setView(d.slice(0, 7));
  };
  const onKey = (e: KeyboardEvent) => {
    const f = focus;
    const dow = (fromIso(f).getDay() + 6) % 7;
    const map: Record<string, () => string> = {
      ArrowLeft: () => add(f, -1),
      ArrowRight: () => add(f, 1),
      ArrowUp: () => add(f, -7),
      ArrowDown: () => add(f, 7),
      Home: () => add(f, -dow),
      End: () => add(f, 6 - dow),
      PageUp: () => shiftMonth(f, -1),
      PageDown: () => shiftMonth(f, 1),
    };
    if (map[e.key]) {
      e.preventDefault();
      moveFocus(map[e.key]());
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(f);
    }
  };

  const shown = months === 2 ? [view, nextMonth(view)] : [view];
  const prevOk = !minD || `${view}-01` > minD;
  const lastShown = shown[shown.length - 1];
  const nextOk = !maxD || `${lastShown}-31` < maxD || nextMonth(lastShown) <= maxD.slice(0, 7);

  const daySlots: DateSlot[] = useMemo(() => {
    if (mode !== "single" || !start) return [];
    if (typeof slots === "function") return slots(start);
    return splitList(slots).map((t) => ({ time: t }));
  }, [mode, start, slots]);

  const inRange = (d: string) => {
    const e = end || (hover && start && hover > start ? hover : "");
    return !!(start && e && d > start && d < e);
  };

  const summary =
    mode === "range"
      ? start && end
        ? `${longDate(start)} → ${longDate(end)} · ${nights(start, end)} ${nights(start, end) === 1 ? "noche" : "noches"}`
        : start
          ? `Desde el ${longDate(start)}: elige el último día`
          : "Elige el primer día"
      : start
        ? `${longDate(start)}${curSlot ? ` · ${curSlot}` : ""}`
        : "Ningún día elegido";

  // atajos: los próximos días elegibles a partir de hoy (se conocen tras montar)
  const quick: string[] = [];
  if (mode === "single" && shortcuts > 0 && today) {
    for (let d = minD && minD > today ? minD : today, k = 0; quick.length < shortcuts && k < 60; d = add(d, 1), k++) if (!blocked(d)) quick.push(d);
  }
  const quickLabel = (d: string) => {
    if (d === today) return "Hoy";
    if (today && d === add(today, 1)) return "Mañana";
    return fromIso(d).toLocaleDateString("es-ES", { weekday: "short", day: "numeric" }).replace(".", "");
  };
  const [showCal, setShowCal] = useState(calendar === "open");
  const calOpen = calendar === "open" || showCal || (!!start && quick.length > 0 && !quick.includes(start));

  return (
    <div className={`ui-date ${vcls(variant)} ${className}`.trim()}>
      {mode === "single" && shortcuts > 0 && (
        <div className="ui-date__quick" role="group" aria-label={label}>
          {quick.map((d) => (
            <button key={d} type="button" className="ui-date__qd" aria-pressed={start === d} aria-label={longDate(d)} onClick={() => { setFocus(d); setView(d.slice(0, 7)); set(d); }}>
              <b>{quickLabel(d)}</b>
              <small aria-hidden>{fromIso(d).toLocaleDateString("es-ES", { day: "numeric", month: "short" }).replace(".", "")}</small>
            </button>
          ))}
          {calendar === "collapsed" && (
            <button type="button" className="ui-date__qd ui-date__qd--more" aria-expanded={calOpen} onClick={() => setShowCal((v) => !v)}>
              <b>{calOpen ? "Cerrar" : "Otro día…"}</b>
              <small aria-hidden>calendario</small>
            </button>
          )}
        </div>
      )}
      {calOpen && (<>
      <div className="ui-date__top">
        <button type="button" className="ui-date__nav" onClick={() => setView(shiftMonth(`${view}-01`, -1).slice(0, 7))} disabled={!prevOk} aria-label="Mes anterior">‹</button>
        <p className="ui-date__label" id={`${uid}-l`}>{label}</p>
        <button type="button" className="ui-date__nav" onClick={() => setView(nextMonth(view))} disabled={!nextOk} aria-label="Mes siguiente">›</button>
      </div>
      <div className="ui-date__months" ref={grid} onMouseLeave={() => setHover("")}>
        {shown.map((ym) => (
          <div key={ym} className="ui-date__month">
            <p className="ui-date__mname" id={`${uid}-${ym}`} aria-live="polite">{fromIso(`${ym}-01`).toLocaleDateString("es-ES", { month: "long", year: "numeric" })}</p>
            <div role="grid" aria-labelledby={`${uid}-l ${uid}-${ym}`} className="ui-date__grid" onKeyDown={onKey}>
              <div role="row" className="ui-date__wk">
                {WD.map((w, i) => (
                  <span key={w} role="columnheader" aria-label={WD_LONG[i]}>{w}</span>
                ))}
              </div>
              {weeks(ym).map((wk, wi) => (
                <div role="row" key={wi} className="ui-date__wk">
                  {wk.map((d, di) =>
                    !d ? (
                      <span key={di} role="gridcell" className="ui-date__pad" />
                    ) : (
                      <span key={d} role="gridcell" aria-selected={d === start || d === end ? true : undefined}>
                        <button
                          type="button"
                          data-date={d}
                          className="ui-date__day"
                          tabIndex={d === focus || (!focusVisible(focus, shown) && d === `${ym}-01`) ? 0 : -1}
                          aria-disabled={blocked(d) || undefined}
                          aria-label={`${longDate(d)}${blocked(d) ? ", no disponible" : ""}${d === today ? ", hoy" : ""}`}
                          data-today={d === today ? "" : undefined}
                          data-sel={d === start || d === end ? "" : undefined}
                          data-edge={mode === "range" ? (d === start ? "start" : d === end ? "end" : undefined) : undefined}
                          data-range={inRange(d) ? "" : undefined}
                          onClick={() => {
                            setFocus(d);
                            choose(d);
                          }}
                          onFocus={() => setFocus(d)}
                          onMouseEnter={() => mode === "range" && setHover(d)}
                        >
                          {Number(d.slice(8))}
                        </button>
                      </span>
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      </>)}

      {mode === "single" && start && (slots === "" ? null : (
        <fieldset className="ui-date__slots">
          <legend>{slotsLabel} · {longDate(start)}</legend>
          {daySlots.length === 0 ? (
            <p className="ui-date__none">No quedan huecos este día. Prueba con otro.</p>
          ) : (
            <div className="ui-date__srow">
              {daySlots.map((s) => (
                <label key={s.time} className="ui-date__slot" data-off={s.disabled ? "" : undefined}>
                  <input type="radio" name={`${uid}-slot`} value={s.time} checked={curSlot === s.time} disabled={s.disabled} onChange={() => pickSlot(s.time)} />
                  <span>
                    {s.time}
                    {s.note && <small>{s.note}</small>}
                  </span>
                </label>
              ))}
            </div>
          )}
        </fieldset>
      ))}
      <p className="ui-date__sum" aria-live="polite">{summary}</p>
    </div>
  );
}

function nextMonth(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return m === 12 ? `${y + 1}-01` : `${y}-${pad(m + 1)}`;
}
function shiftMonth(d: string, n: number) {
  const x = fromIso(d);
  const day = x.getDate();
  x.setDate(1);
  x.setMonth(x.getMonth() + n);
  x.setDate(Math.min(day, new Date(x.getFullYear(), x.getMonth() + 1, 0).getDate()));
  return iso(x);
}
/** Semanas del mes, de lunes a domingo, con huecos vacíos al principio y al final. */
function weeks(ym: string) {
  const first = fromIso(`${ym}-01`);
  const lead = (first.getDay() + 6) % 7;
  const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => `${ym}-${pad(i + 1)}`)];
  while (cells.length % 7) cells.push(null);
  const out: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
  return out;
}
const focusVisible = (focus: string, shown: string[]) => shown.includes(focus.slice(0, 7));
