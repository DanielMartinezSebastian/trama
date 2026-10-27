"use client";

import { useEffect, useMemo, useState } from "react";
import { bookingSlots, downloadCalendar, prettyDate, useAppointments, type Appointment, type BookingPlace, type BookingService, type BookingStaff } from "@/lib/commerce/booking";
import { money } from "@/lib/commerce/money";
import Button from "./Button";
import DatePicker from "./DatePicker";
import Stepper from "./Stepper";
import TextField from "./TextField";
import { vcls, type Variant } from "./variants";

export type BookingFlowProps = {
  /** lo que se reserva, con duración y precio */
  services: BookingService[];
  /** quién atiende; cada uno, con los servicios que hace */
  staff: BookingStaff[];
  /** locales de una cadena: si hay, el primer paso es elegir uno */
  places?: BookingPlace[];
  /** horas de inicio posibles, separadas por comas */
  times?: string;
  /** días cerrados (0 = domingo), separados por comas */
  closedDays?: string;
  /** cierre antes de hora por día de la semana: { 6: "14:00" } */
  closesAt?: Partial<Record<number, string>>;
  /** antelación mínima y máxima, en días */
  min?: number;
  max?: number;
  /** clave de `localStorage` donde se guardan las citas (la misma que lea `AppointmentList`) */
  storageKey?: string;
  /** servicio, profesional o local elegidos al llegar (`?servicio=` desde una carta) */
  initialService?: string;
  initialStaff?: string;
  initialPlace?: string;
  /** id de una cita guardada que se está cambiando de día (reprogramar) */
  editId?: string;
  /** títulos de cada elección */
  serviceLabel?: string;
  staffLabel?: string;
  placeLabel?: string;
  /** opción «me da igual» en la elección de profesional (el primero con hueco) */
  anyStaffLabel?: string;
  /** nombre del negocio y dirección, para el archivo de calendario */
  business?: string;
  location?: string;
  /** enlace de «Ver mis citas» en la confirmación */
  appointmentsHref?: string;
  /** aviso bajo el formulario (que es una demo, la política de cambios…) */
  note?: string;
  /** se llama al guardar la cita */
  onBooked?: (a: Appointment) => void;
  variant?: Variant;
  className?: string;
};

const NADIE = "__cualquiera";

/**
 * Reserva de cita en pasos (peluquería, barbería, estética, consulta): local si hay varios, servicio y profesional; día y
 * hueco con `DatePicker`; datos; y confirmación con «Añadir al calendario». Los huecos dependen de la duración del servicio,
 * del cierre de cada día y de las citas ya guardadas (`useAppointments`, en `localStorage`). Un resumen al lado sigue la
 * elección. No envía nada: es la interfaz de la reserva; conecta `onBooked` a tu agenda.
 */
export default function BookingFlow({
  services,
  staff,
  places = [],
  times = "10:00, 11:00, 12:00, 13:00, 16:00, 17:00, 18:00, 19:00",
  closedDays = "0",
  closesAt,
  min = 1,
  max = 45,
  storageKey = "trama:citas",
  initialService,
  initialStaff,
  initialPlace,
  editId,
  serviceLabel = "¿Qué te hacemos?",
  staffLabel = "¿Con quién?",
  placeLabel = "Elige el local",
  anyStaffLabel = "Me da igual",
  business = "Tu cita",
  location = "",
  appointmentsHref,
  note = "Reserva de demostración: no se envía nada y la cita solo se guarda en este navegador.",
  onBooked,
  variant = "minimal",
  className = "",
}: BookingFlowProps) {
  const { list, save, ready } = useAppointments(storageKey);
  const editing = list.find((a) => a.id === editId);
  const horas = useMemo(() => times.split(",").map((t) => t.trim()).filter(Boolean), [times]);
  const [place, setPlace] = useState(initialPlace ?? places[0]?.id ?? "");
  const [serviceId, setService] = useState(initialService ?? services[0]?.id ?? "");
  const [who, setWho] = useState(initialStaff ?? NADIE);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [done, setDone] = useState<Appointment | null>(null);

  // reprogramar: la cita guardada fija servicio, persona, local y nombre
  useEffect(() => {
    if (!editing) return;
    setService(editing.service);
    setWho(editing.staff);
    if (editing.place) setPlace(editing.place);
    setName(editing.name);
  }, [editing]);

  const service = services.find((s) => s.id === serviceId) ?? services[0];
  const capaces = staff.filter((p) => (!p.services || p.services.includes(service.id)) && (!place || !p.places || p.places.includes(place)));
  useEffect(() => {
    if (who !== NADIE && !capaces.some((p) => p.name === who)) setWho(NADIE);
  }, [capaces, who]);

  /** huecos del día: con «me da igual», libre si lo está para alguien (y se asigna a ese) */
  const huecos = (day: string) => {
    const gente = who === NADIE ? capaces : capaces.filter((p) => p.name === who);
    const porPersona = gente.map((p) => bookingSlots({ date: day, times: horas, service, staff: p.name, appointments: list, services, closesAt, ignoreId: editId }));
    return horas
      .map((t) => {
        const libres = porPersona.map((s) => s.find((x) => x.time === t)).filter(Boolean);
        if (!libres.length) return null;
        return { time: t, disabled: libres.every((x) => x!.disabled), note: libres.some((x) => x!.note) ? "tu cita" : "" };
      })
      .filter((x): x is { time: string; disabled: boolean; note: string } => !!x);
  };
  const huecoValido = !!date && !!time && huecos(date).some((s) => s.time === time && !s.disabled);
  const asignado = () => {
    if (who !== NADIE) return who;
    return capaces.find((p) => !bookingSlots({ date, times: horas, service, staff: p.name, appointments: list, services, closesAt, ignoreId: editId }).find((x) => x.time === time)?.disabled)?.name ?? capaces[0]?.name ?? "";
  };
  const precio = (s: BookingService) => (s.price ? `${s.from ? "Desde " : ""}${money(s.price, "EUR", "es-ES", true)}` : "Gratis");
  const lugar = places.find((p) => p.id === place);
  const pasos = ["Servicio", "Día y hora", "Tus datos"].join(", ");

  const confirmar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    if (!huecoValido) return setError("Ese hueco ya no está libre: vuelve atrás y elige otro.");
    if (name.trim().length < 2) return setError("Escribe tu nombre (al menos dos letras).");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Revisa el correo: falta algo (por ejemplo, alex@ejemplo.com).");
    const a: Appointment = { id: editing?.id ?? crypto.randomUUID(), service: service.id, staff: asignado(), place: place || undefined, date, time, name: name.trim() };
    save(a);
    setDone(a);
    setError("");
    onBooked?.(a);
  };

  if (done) {
    const s = services.find((x) => x.id === done.service)!;
    return (
      <section className={`ui-book ui-book--done ${className}`} aria-live="polite">
        <div className={`ui-book__main ui-surface ${vcls(variant)}`}>
          <p className="ui-book__ok" role="status">
            <span aria-hidden>✓</span> {editing ? "Cita cambiada" : "Cita reservada"}
          </p>
          <h2>{s.name}</h2>
          <p>
            {prettyDate(done.date)} · {done.time} · con {done.staff}
            {lugar ? ` · ${lugar.name}` : ""}
          </p>
          <p className="ui-book__note">Te esperamos, {done.name}. {note}</p>
          <div className="ui-book__actions">
            <Button label="Añadir al calendario" onClick={() => downloadCalendar(`${business} · ${s.name}`, done.date, done.time, s.minutes, lugar?.address ?? location)} variant={variant} emphasis="outline" />
            {appointmentsHref && <Button label="Ver mis citas" href={appointmentsHref} variant={variant} />}
            <Button label="Reservar otra" onClick={() => { setDone(null); setStep(0); setDate(""); setTime(""); }} variant={variant} emphasis="ghost" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`ui-book ${className}`}>
      <div className={`ui-book__main ui-surface ${vcls(variant)}`}>
        <Stepper steps={pasos} current={step} variant={variant} />
        {step === 0 && (
          <div className="ui-book__step">
            {places.length > 1 && (
              <fieldset className="ui-book__group">
                <legend>{placeLabel}</legend>
                <div className="ui-book__choices">
                  {places.map((p) => (
                    <button key={p.id} type="button" aria-pressed={place === p.id} onClick={() => { setPlace(p.id); setTime(""); }}>
                      <b>{p.name}</b>
                      {p.address && <small>{p.address}</small>}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            <fieldset className="ui-book__group">
              <legend>{serviceLabel}</legend>
              <div className="ui-book__options">
                {services.map((s) => (
                  <button key={s.id} type="button" aria-pressed={serviceId === s.id} onClick={() => { setService(s.id); setTime(""); }}>
                    <b>{s.name}</b>
                    <span>
                      {s.minutes} min · {precio(s)}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="ui-book__group">
              <legend>{staffLabel}</legend>
              <div className="ui-book__choices">
                <button type="button" aria-pressed={who === NADIE} onClick={() => { setWho(NADIE); setTime(""); }}>
                  <b>{anyStaffLabel}</b>
                  <small>el primero con hueco</small>
                </button>
                {capaces.map((p) => (
                  <button key={p.name} type="button" aria-pressed={who === p.name} onClick={() => { setWho(p.name); setTime(""); }}>
                    {p.photo && <img src={p.photo} alt="" loading="lazy" />}
                    <span>
                      <b>{p.name}</b>
                      {p.role && <small>{p.role}</small>}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="ui-book__actions">
              <Button label="Elegir día y hora" glyph="→" onClick={() => setStep(1)} variant={variant} />
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="ui-book__step">
            <DatePicker label="Día y hora" value={date} onChange={(d) => { setDate(d); setTime(""); }} slot={time} onSlotChange={setTime} min={min} max={max} closedDays={closedDays} slots={huecos} slotsLabel="Huecos libres" shortcuts={4} variant={variant} />
            <div className="ui-book__actions">
              <Button label="Atrás" onClick={() => setStep(0)} emphasis="outline" variant={variant} />
              <Button label="Continuar" glyph="→" disabled={!huecoValido} onClick={() => setStep(2)} variant={variant} />
            </div>
          </div>
        )}
        {step === 2 && (
          <form className="ui-book__step ui-book__form" onSubmit={confirmar} noValidate>
            <TextField label="Tu nombre" placeholder="Alex" value={name} onChange={setName} required autoComplete="given-name" variant={variant} />
            <TextField label="Correo" type="email" placeholder="alex@ejemplo.com" value={email} onChange={setEmail} required autoComplete="email" variant={variant} />
            <p className="ui-book__note">{note}</p>
            {error && (
              <p className="ui-book__error" role="alert">
                {error}
              </p>
            )}
            <div className="ui-book__actions">
              <Button label="Atrás" onClick={() => setStep(1)} emphasis="outline" variant={variant} />
              <Button label={editing ? "Cambiar mi cita" : "Confirmar cita"} type="submit" variant={variant} />
            </div>
          </form>
        )}
      </div>
      <aside className={`ui-book__summary ui-surface ${vcls(variant)}`} aria-label="Resumen de la cita">
        <p className="ui-book__kicker">Tu cita</p>
        <h3>{service.name}</h3>
        <p>
          {service.minutes} min · {precio(service)}
        </p>
        <p>{who === NADIE ? `Con quien tenga hueco` : `Con ${who}`}{lugar ? ` · ${lugar.name}` : ""}</p>
        <p>{date ? `${prettyDate(date)}${time ? ` · ${time}` : ""}` : "El día lo eliges tú"}</p>
        {service.description && <small>{service.description}</small>}
      </aside>
    </section>
  );
}
