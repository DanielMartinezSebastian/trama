"use client";

import { useState } from "react";
import { downloadCalendar, prettyDate } from "@/lib/commerce/booking";
import { cardError, type CardData } from "@/lib/commerce/card";
import { money } from "@/lib/commerce/money";
import { takenTables, useShowBookings, type ShowBooking } from "@/lib/commerce/shows";
import Button from "./Button";
import type { LineupEvent } from "./EventLineup";
import QRCode from "./QRCode";
import QuantityStepper from "./QuantityStepper";
import SeatMap, { type SeatTable, type SeatZone } from "./SeatMap";
import Stepper from "./Stepper";
import TextField from "./TextField";
import { vcls, type Variant } from "./variants";

export type ShowMenu = {
  id: string;
  name: string;
  /** precio por persona (cena y espectáculo) */
  price: number;
  description?: string;
};

export type ShowBookingFlowProps = {
  /** funciones (las agotadas y canceladas no se pueden elegir) */
  events: LineupEvent[];
  initialEvent?: string;
  /** mesa elegida al llegar (si está libre esa noche, se salta a elegir mesa) */
  initialTable?: string;
  tables: SeatTable[];
  zones: SeatZone[];
  menus: ShowMenu[];
  /** señal por persona para reservar; 0 = se paga todo */
  depositPerGuest?: number;
  maxGuests?: number;
  /** minutos que dura la noche (para el calendario) */
  minutes?: number;
  /** dirección del local (para el calendario) */
  location?: string;
  stage?: string;
  storageKey?: string;
  /** enlace a «mis entradas» en la confirmación */
  ticketsHref?: string;
  note?: string;
  onBook?: (b: ShowBooking) => void;
  variant?: Variant;
  className?: string;
};

/**
 * Reserva de mesa para una función (cena con espectáculo): la función, los comensales y la mesa en el plano de la sala
 * (`SeatMap`, con las ocupadas de esa noche), el menú, los datos y el pago de la señal o del total (simulado, con
 * validación de tarjeta). Confirma con la entrada en QR y la opción de añadirla al calendario, y la guarda con
 * `useShowBookings` para la página de «mis entradas». Con `EventLineup` en la cartelera (La Tramoya, docs/57).
 */
export default function ShowBookingFlow({
  events,
  initialEvent,
  initialTable,
  tables,
  zones,
  menus,
  depositPerGuest = 10,
  maxGuests = 8,
  minutes = 180,
  location = "",
  stage = "Escenario",
  storageKey = "trama:funciones",
  ticketsHref,
  note = "Reserva de demostración: no se envía ni se cobra nada. Para probar el pago: 4242 4242 4242 4242.",
  onBook,
  variant = "minimal",
  className = "",
}: ShowBookingFlowProps) {
  const reservas = useShowBookings(storageKey);
  const abiertas = events.filter((e) => e.status !== "soldout" && e.status !== "cancelled");
  const [paso, setPaso] = useState(initialTable && tables.some((t) => t.id === initialTable) ? 1 : 0);
  const [eventoId, setEventoId] = useState(initialEvent && abiertas.some((e) => e.id === initialEvent) ? initialEvent : (abiertas[0]?.id ?? ""));
  const [comensales, setComensales] = useState(2);
  const [mesa, setMesa] = useState(initialTable && tables.some((t) => t.id === initialTable) ? initialTable : "");
  const [menuId, setMenuId] = useState(menus[0]?.id ?? "");
  const [datos, setDatos] = useState({ name: "", email: "" });
  const [tarjeta, setTarjeta] = useState<CardData>({ holder: "", number: "", exp: "", cvc: "" });
  const [error, setError] = useState("");
  const [hecha, setHecha] = useState<ShowBooking | null>(null);

  const ev = events.find((e) => e.id === eventoId);
  const ocupadas = ev ? [...takenTables(ev.id, tables.map((t) => t.id), ev.status), ...reservas.list.filter((r) => r.eventId === ev.id).map((r) => r.table)] : [];
  const t = tables.find((x) => x.id === mesa);
  const z = zones.find((x) => x.id === t?.zone);
  const menu = menus.find((m) => m.id === menuId);
  const porPersona = (menu?.price ?? 0) + (z?.price ?? 0);
  const total = porPersona * comensales;
  const senal = depositPerGuest > 0 ? Math.min(total, depositPerGuest * comensales) : total;

  const siguiente = () => {
    setError("");
    if (paso === 0 && !ev) return setError("Elige una función.");
    if (paso === 1 && (!t || ocupadas.includes(t.id) || t.seats < comensales)) return setError(`Elige una mesa libre para ${comensales}.`);
    if (paso === 2 && !menu) return setError("Elige un menú.");
    if (paso === 3) {
      if (datos.name.trim().length < 2) return setError("Escribe tu nombre.");
      if (!/^\S+@\S+\.\S+$/.test(datos.email.trim())) return setError("Revisa el correo (por ejemplo, alex@ejemplo.com).");
    }
    setPaso(paso + 1);
  };
  const pagar = (e: React.FormEvent) => {
    e.preventDefault();
    const fallo = cardError(tarjeta);
    if (fallo) return setError(fallo);
    if (!ev || !t || !menu) return;
    const b: ShowBooking = { id: `ENT-${String(1000 + ((Date.now() / 1000) % 9000) | 0)}`, eventId: ev.id, event: ev.title, date: ev.date, time: ev.time ?? "21:00", table: t.label ?? t.id, zone: z?.name ?? t.zone, guests: comensales, menu: menu.name, total, paid: senal, name: datos.name.trim(), email: datos.email.trim(), at: new Date().toISOString() };
    reservas.add(b);
    setHecha(b);
    onBook?.(b);
  };

  if (hecha)
    return (
      <section className={`ui-book ui-book--done ui-show ${className}`} aria-live="polite">
        <div className={`ui-book__main ui-surface ${vcls(variant)}`}>
          <p className="ui-book__ok" role="status">
            <span aria-hidden>✓</span> Mesa reservada
          </p>
          <div className="ui-show__entrada">
            <div>
              <h2>{hecha.event}</h2>
              <p>
                {prettyDate(hecha.date)} · {hecha.time}
              </p>
              <p>
                Mesa {hecha.table} ({hecha.zone}) · {hecha.guests} {hecha.guests === 1 ? "persona" : "personas"} · {hecha.menu}
              </p>
              <p>
                Entrada {hecha.id} · pagado {money(hecha.paid)}
                {hecha.paid < hecha.total ? ` · el resto (${money(hecha.total - hecha.paid)}) en la sala` : ""}
              </p>
            </div>
            <QRCode value={`${hecha.id}|${hecha.eventId}|${hecha.table}`} codeSize={132} label={`Entrada ${hecha.id}`} caption="Enséñalo en la puerta" />
          </div>
          <p className="ui-book__note">Te hemos enviado la entrada a {hecha.email}. (Demostración: no sale nada.)</p>
          <div className="ui-book__actions">
            <Button label="Añadir al calendario" onClick={() => downloadCalendar(hecha.event, hecha.date, hecha.time, minutes, location)} variant={variant} emphasis="outline" />
            {ticketsHref && <Button label="Mis entradas" href={ticketsHref} variant={variant} emphasis="outline" />}
            <Button label="Otra reserva" onClick={() => { setHecha(null); setPaso(0); setMesa(""); }} variant={variant} emphasis="outline" />
          </div>
        </div>
      </section>
    );

  return (
    <section className={`ui-book ui-show ${className}`}>
      <div className={`ui-book__main ui-surface ${vcls(variant)}`}>
        <Stepper steps="Función, Mesa, Menú, Tus datos, Pago" current={paso} variant={variant} />
        {paso === 0 && (
          <fieldset className="ui-book__group ui-book__step">
            <legend>¿Qué noche?</legend>
            <div className="ui-book__options">
              {abiertas.map((e) => (
                <button key={e.id} type="button" aria-pressed={eventoId === e.id} onClick={() => { setEventoId(e.id); setMesa(""); }}>
                  <b>{e.title}</b>
                  <span>
                    {prettyDate(e.date)} · {e.time}
                    {e.genre ? ` · ${e.genre}` : ""}
                    {e.status === "few" ? " · últimas mesas" : ""}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        )}
        {paso === 1 && (
          <div className="ui-book__step">
            <QuantityStepper value={comensales} onChange={(n) => { setComensales(n); if (t && t.seats < n) setMesa(""); }} min={1} max={maxGuests} label="Comensales" />
            <SeatMap tables={tables} zones={zones} taken={ocupadas} value={mesa} onChange={setMesa} guests={comensales} stage={stage} variant={variant} />
          </div>
        )}
        {paso === 2 && (
          <fieldset className="ui-book__group ui-book__step">
            <legend>¿Qué cenáis?</legend>
            <div className="ui-book__options">
              {menus.map((m) => (
                <button key={m.id} type="button" aria-pressed={menuId === m.id} onClick={() => setMenuId(m.id)}>
                  <b>
                    {m.name} · {money(m.price)}
                  </b>
                  {m.description && <span>{m.description}</span>}
                </button>
              ))}
            </div>
          </fieldset>
        )}
        {paso === 3 && (
          <div className="ui-book__step ui-book__form">
            <TextField label="Nombre y apellidos" value={datos.name} onChange={(v) => setDatos({ ...datos, name: v })} autoComplete="name" required variant={variant} />
            <TextField label="Correo" type="email" value={datos.email} onChange={(v) => setDatos({ ...datos, email: v })} autoComplete="email" required variant={variant} />
          </div>
        )}
        {paso === 4 && (
          <form className="ui-book__step ui-book__form" onSubmit={pagar} noValidate>
            <p className="ui-book__note">{senal < total ? `Reserva con una señal de ${money(senal)}; el resto (${money(total - senal)}) se paga en la sala.` : `Pagas la noche completa: ${money(total)}.`}</p>
            <TextField label="Titular" value={tarjeta.holder} onChange={(v) => setTarjeta({ ...tarjeta, holder: v })} autoComplete="cc-name" required variant={variant} />
            <TextField label="Número de tarjeta" value={tarjeta.number} onChange={(v) => setTarjeta({ ...tarjeta, number: v.replace(/[^\d ]/g, "").slice(0, 23) })} autoComplete="cc-number" placeholder="4242 4242 4242 4242" required variant={variant} />
            <div className="ui-checkout__fila">
              <TextField label="Caducidad" value={tarjeta.exp} onChange={(v) => setTarjeta({ ...tarjeta, exp: v.slice(0, 5) })} autoComplete="cc-exp" placeholder="MM/AA" required variant={variant} />
              <TextField label="CVC" value={tarjeta.cvc} onChange={(v) => setTarjeta({ ...tarjeta, cvc: v.replace(/\D/g, "").slice(0, 4) })} autoComplete="cc-csc" placeholder="123" required variant={variant} />
            </div>
            <p className="ui-book__note">{note}</p>
            {error && (
              <p className="ui-book__error" role="alert">
                {error}
              </p>
            )}
            <div className="ui-book__actions">
              <Button label="Atrás" onClick={() => { setError(""); setPaso(3); }} emphasis="outline" variant={variant} />
              <Button label={`Pagar ${money(senal)} y reservar`} type="submit" variant={variant} />
            </div>
          </form>
        )}
        {paso < 4 && (
          <>
            {error && (
              <p className="ui-book__error" role="alert">
                {error}
              </p>
            )}
            <div className="ui-book__actions">
              {paso > 0 && <Button label="Atrás" onClick={() => { setError(""); setPaso(paso - 1); }} emphasis="outline" variant={variant} />}
              <Button label="Continuar" glyph="→" onClick={siguiente} variant={variant} />
            </div>
          </>
        )}
      </div>
      <aside className={`ui-book__summary ui-surface ${vcls(variant)}`} aria-label="Resumen de la reserva">
        <p className="ui-book__kicker">Tu noche</p>
        <h3>{ev?.title ?? "Elige función"}</h3>
        {ev && (
          <p>
            {prettyDate(ev.date)} · {ev.time}
          </p>
        )}
        <p>
          {comensales} {comensales === 1 ? "persona" : "personas"}
          {t ? ` · mesa ${t.label ?? t.id} (${z?.name ?? t.zone})` : ""}
        </p>
        {menu && paso >= 2 && <p>{menu.name}</p>}
        {t && menu && paso >= 2 && (
          <small>
            {money(porPersona)} / persona · total {money(total)}
          </small>
        )}
      </aside>
    </section>
  );
}
