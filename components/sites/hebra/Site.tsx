"use client";

import { Suspense, createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Hero from "@/components/ui/Hero";
import Button from "@/components/ui/Button";
import PricingSection from "@/components/ui/PricingSection";
import Home from "./Home";
import DatePicker from "@/components/ui/DatePicker";
import Stepper from "@/components/ui/Stepper";
import TextField from "@/components/ui/TextField";
import OpeningHours from "@/components/ui/OpeningHours";
import ActionBar from "@/components/ui/ActionBar";
import { tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame, siteHref } from "../shared";
import { downloadCalendar, prettyDate, useDemoState } from "../business-demo/state";
import { SERVICES, TEAM, validAppointments, type Appointment } from "./data";
import "../business-demo/business.css";
import "./redesign.css";

const href = (path = "") => siteHref("hebra", path);
const Context = createContext<ReturnType<typeof useAppointments> | null>(null);
function useAppointments() { return useDemoState<Appointment[]>("trama-hebra-v1", [], validAppointments); }
function useSalon() { const c = useContext(Context); if (!c) throw new Error("Falta Hebra Shell"); return c; }
const TOKENS = tokensToStyle({ bg:"#f2d6db", fg:"#2b2031", mut:"#6e4c5c", acc:"#872d4f", acc2:"#654f70", card:"#f7e6e9", ln:"#c69eab", r:0, font:"var(--font-manrope), sans-serif", display:"var(--font-instrument-serif), serif", glow:false });

export function Shell({ children }: { children: ReactNode }) {
  const state = useAppointments();
  const path = usePathname();
  return <Context.Provider value={state}><SiteFrame tokens={TOKENS} className="hb biz">
    <div className="hb-demo"><a href="/demos">TRAMA / WEBS COMPLETAS ↗</a><span>Un salón imaginado. Una experiencia que puedes probar.</span></div>
    <header className="hb-nav"><a className="hb-logo" href={href()} aria-label="Hebra, inicio">hebra.</a><nav aria-label="Navegación del salón">{[["servicios", "Servicios"], ["equipo", "Las manos"], ["mis-citas", `Mis citas${state.value.length ? ` (${state.value.length})` : ""}`]].map(([p, label]) => <a key={p} href={href(p)} aria-current={path === href(p) ? "page" : undefined}>{label}</a>)}</nav><Button label="Hazte un hueco" href={href("reservar")} variant="minimal" glyph="↗" /></header>
    <main id="hebra-contenido">{children}</main>
    <footer className="hb-footer"><div><a className="hb-logo" href={href()}>hebra.</a><p>Buen pelo. Buena conversación.<br />Y un rato que es solo tuyo.</p><small>Salón ficticio en Zaragoza · Precios de demostración con IVA.</small></div><OpeningHours hours={"L|cerrado\nM-V|10:00-20:00\nS|09:00-14:00\nD|cerrado"} title="Nos vemos de martes a sábado" variant="minimal" /><div><a href={href("reservar")}>Reservar una cita ↗</a><a href={href("mis-citas")}>Gestionar mis citas ↗</a><a href="/creditos">Fotografía y créditos ↗</a><a href={siteHref("cadencia")}>Descubrir Cadencia, la otra demo ↗</a><small>Demo local: sin pagos, correos ni reservas reales.{state.temporary && " El almacenamiento no está disponible; tus cambios duran esta sesión."}</small></div></footer>
    <ActionBar actions={[{ label: "Servicios", href: href("servicios"), icon: "menu" }, { label: "Mis citas", href: href("mis-citas"), icon: "calendar" }, { label: "Reservar cita", href: href("reservar"), icon: "arrow-right", primary: true }]} variant="minimal" />
  </SiteFrame></Context.Provider>;
}

function Services() {
  return <div className="hb-section"><Hero kicker="SERVICIOS / A TU MEDIDA" title="Lo que tu pelo pide." subtitle="Precios con IVA, tiempo para escucharte y ningún suplemento por género. El color se presupuesta antes de empezar." primaryCta="Reservar cita" primaryHref={href("reservar")} secondaryCta="" badges="" backdrop="none" align="left" />
    <PricingSection kicker="" title="" subtitle="" layout="menu" variant="minimal" plans={SERVICES.map(s => ({ id:s.id, name:s.name, description:s.description, price:s.price ? `${s.category==="Color"?"Desde ":""}${s.price} €` : "Gratis", meta:`${s.minutes} min`, cta:"Elegir", href:`${href("reservar")}?servicio=${s.id}`, note:s.category==="Color"?"Presupuesto confirmado antes del servicio":"" }))} footnote="IVA incluido. Elige tu servicio para ver profesionales y horas disponibles." />
  </div>;
}

function Team() { return <div className="hb-section"><Hero kicker="EL EQUIPO / EL OFICIO" title="Las personas detrás del corte." subtitle="Personajes y fotografías de demostración. Cada profesional tiene su especialidad; elige con quién te apetece reservar." primaryCta="Elegir profesional" primaryHref={href("reservar")} secondaryCta="" badges="" backdrop="none" align="left"/><div className="biz-team-roster"><img src="/img/hebra/corte.webp" alt="Escena de trabajo en el estudio, imagen de referencia generada"/><div>{TEAM.map(p=><article key={p.name}><span>{p.role}</span><h2>{p.name}</h2><Button label={`Reservar con ${p.name}`} href={`${href("reservar")}?profesional=${p.name}`} variant="minimal" emphasis="outline" glyph="↗"/></article>)}</div></div></div>; }

function Booking() {
  const { value: appointments, setValue, ready } = useSalon();
  const search = useSearchParams();
  const router = useRouter();
  const editing = appointments.find(a => a.id === search.get("editar"));
  const [serviceId, setService] = useState("corte");
  const [professional, setProfessional] = useState("Alba");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const service = SERVICES.find(s => s.id === serviceId)!;
  const professionals = TEAM.filter(p => p.services.includes(serviceId));
  useEffect(() => {
    const id = editing?.service ?? search.get("servicio") ?? "corte";
    const chosen = SERVICES.some(s => s.id === id) ? id : "corte";
    setService(chosen);
    const requested = editing?.professional ?? search.get("profesional");
    setProfessional(TEAM.find(p => p.name === requested && p.services.includes(chosen))?.name ?? TEAM.find(p => p.services.includes(chosen))!.name);
    setDate(editing?.date ?? ""); setTime(editing?.time ?? ""); setName(editing?.name ?? "");
  }, [search, editing]);
  function selectService(id: string) { setService(id); if (!TEAM.find(p => p.name === professional)?.services.includes(id)) setProfessional(TEAM.find(p => p.services.includes(id))!.name); setTime(""); }
  const availableSlots = (day: string) => {
    const saturday = new Date(`${day}T12:00:00`).getDay() === 6;
    return ["10:00", "11:30", "13:00", "16:00", "17:30"].filter(t => !saturday || Number(t.slice(0,2)) * 60 + Number(t.slice(3)) + service.minutes <= 840).map((t,i) => ({ time: t, disabled: (i + Number(day.slice(-2)) + TEAM.findIndex(p => p.name === professional)) % 4 === 0 || appointments.some(a => a.id !== editing?.id && a.date === day && a.professional === professional && Math.abs((Number(a.time.slice(0,2)) * 60 + Number(a.time.slice(3))) - (Number(t.slice(0,2)) * 60 + Number(t.slice(3)))) < Math.max(service.minutes, SERVICES.find(s => s.id === a.service)!.minutes)), note: "" }));
  };
  const validSlot = date && time && availableSlots(date).some(s => s.time === time && !s.disabled);
  return <div className="hb-section"><p className="hb-eyebrow">TU PRÓXIMO BUEN DÍA DE PELO</p><h1 className="hb-title">{editing ? "Cambiamos de día." : "Te hacemos un hueco."}</h1><p>Agenda de demostración. No se realiza ninguna reserva ni se envía ningún correo.</p><div className="hb-booking"><div className="hb-booking-main"><Stepper steps="Servicio y manos, Día y hora, Tus datos" current={step} variant="minimal" />
    {step === 0 && <><h2>¿Qué te apetece?</h2><div className="hb-service-options">{SERVICES.map(s => <button key={s.id} aria-pressed={serviceId === s.id} onClick={() => selectService(s.id)}><b>{s.name}</b><span>{s.minutes} min · {s.price ? `${s.category === "Color" ? "desde " : ""}${s.price} €` : "Gratis"}</span></button>)}</div><h2>Elige tus manos</h2><div className="hb-choices">{professionals.map(p => <button key={p.name} aria-pressed={professional === p.name} onClick={() => { setProfessional(p.name); setTime(""); }}>{p.name}<small>{p.role}</small></button>)}</div><Button label="Elegir día y hora" onClick={() => setStep(1)} variant="minimal" glyph="→" /></>}
    {step === 1 && <><h2>Un rato para ti.</h2><DatePicker value={date} onChange={d => { setDate(d); setTime(""); }} slot={time} onSlotChange={setTime} min={1} max={45} closedDays="0,1" slots={availableSlots} slotsLabel="Huecos de demostración" shortcuts={4} variant="minimal" /><div className="hb-form-actions"><Button label="Atrás" onClick={() => setStep(0)} emphasis="outline" variant="minimal" /><Button label="Continuar con mis datos" disabled={!validSlot} onClick={() => setStep(2)} variant="minimal" /></div></>}
    {step === 2 && <form onSubmit={e => { e.preventDefault(); if (!ready || !validSlot || name.trim().length < 2) { setError("Revisa tu nombre y elige un hueco disponible."); return; } const a: Appointment = { id: editing?.id ?? crypto.randomUUID(), service: serviceId, professional, date, time, name: name.trim() }; setValue(prev => [...prev.filter(v => v.id !== editing?.id), a]); router.push(`${href("mis-citas")}?confirmada=1`); }}><h2>¿Cómo te llamas?</h2><TextField label="Tu nombre" placeholder="Por ejemplo, Alex" value={name} onChange={setName} required autoComplete="given-name" variant="minimal" /><TextField label="Correo (solo para probar el formulario)" placeholder="alex@ejemplo.com" type="email" value={email} onChange={setEmail} required autoComplete="email" variant="minimal" /><p className="hb-note">El correo no se guarda ni se envía. Puedes usar datos ficticios. Solo guardamos el nombre de la cita en este navegador.</p><label className="hb-consent"><input type="checkbox" required /> Entiendo que es una simulación y acepto la política de cambios: hasta 24 horas antes.</label>{error && <p role="alert">{error}</p>}<div className="hb-form-actions"><Button label="Atrás" onClick={() => setStep(1)} emphasis="outline" variant="minimal" /><Button label={editing ? "Guardar cambio de cita" : "Confirmar cita de prueba"} type="submit" disabled={!ready} variant="minimal" glyph="↗" /></div></form>}
    </div><aside className="hb-summary"><span aria-hidden>✳</span><p className="hb-eyebrow">TU CITA, DE UN VISTAZO</p><h2>{service.name}</h2><p>Con {professional} · {service.minutes} minutos</p><strong>{service.price ? `${service.category === "Color" ? "Desde " : ""}${service.price} €` : "Gratuito"}</strong><p>{date ? prettyDate(date) : "El día lo eliges tú"}{time && ` · ${time}`}</p><hr /><p>{service.description}</p><small>Sin pago online. {service.category === "Color" ? "Confirmamos el presupuesto y la necesidad de prueba de sensibilidad antes del servicio." : "Precio cerrado con IVA incluido."}</small></aside></div></div>;
}

function Appointments() {
  const { value, setValue, ready } = useSalon();
  const search = useSearchParams();
  const [cancel, setCancel] = useState("");
  return <div className="hb-section"><Hero kicker="TU AGENDA" title="Nos vemos pronto." subtitle="Tus citas se guardan en este navegador. Puedes reprogramarlas, cancelarlas o añadirlas a tu calendario." primaryCta="Reservar otra cita" primaryHref={href("reservar")} secondaryCta="" badges="" backdrop="none" align="left" />{search.has("confirmada") && <p className="hb-success" role="status">✓ Cita de prueba guardada. No se ha contactado con ningún salón.</p>}{!ready ? <p role="status">Abriendo tu agenda…</p> : !value.length ? <div className="hb-empty"><span>✳</span><h2>Tu próximo cambio empieza aquí.</h2><p>Aún no tienes citas. Elige un corte, un color o una pausa.</p><Button label="Elegir mi servicio" href={href("reservar")} variant="minimal" /></div> : <div className="hb-appointments">{[...value].sort((a,b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)).map(a => { const s = SERVICES.find(s => s.id === a.service)!; const mutable = new Date(`${a.date}T${a.time}:00`).getTime() - Date.now() > 86400000; return <article key={a.id}><p className="hb-eyebrow">{prettyDate(a.date)} · {a.time}</p><h2>{s.name}</h2><p>{a.name}, te esperamos con {a.professional}. {s.minutes} minutos · {s.price ? `${s.category === "Color" ? "desde " : ""}${s.price} €` : "Gratis"}</p><div className="hb-form-actions"><Button label="Añadir al calendario" onClick={() => downloadCalendar(`Hebra (demo) - ${s.name}`, a.date, a.time, s.minutes, "Hebra - salón ficticio")} variant="minimal" emphasis="outline" />{mutable && <Button label="Reprogramar" href={`${href("reservar")}?editar=${a.id}`} variant="minimal" emphasis="outline" />}<Button label={cancel === a.id ? "Confirmar cancelación" : "Cancelar cita"} disabled={!mutable} onClick={() => { if (cancel === a.id) { setValue(prev => prev.filter(v => v.id !== a.id)); setCancel(""); } else setCancel(a.id); }} variant="minimal" emphasis="ghost" />{cancel === a.id && <Button label="Conservar cita" onClick={() => setCancel("")} variant="minimal" emphasis="ghost" />}</div>{!mutable && <small>La cita está dentro de las 24 horas o ya ha pasado; los cambios online están cerrados.</small>}</article>; })}</div>}</div>;
}

export function Page({ path }: { path: string[] }) {
  if (path[0] === "servicios") return <Services />;
  if (path[0] === "equipo") return <Team />;
  if (path[0] === "reservar") return <Suspense fallback={<div className="hb-section" role="status">Preparando tu próxima cita…</div>}><Booking /></Suspense>;
  if (path[0] === "mis-citas") return <Suspense fallback={<div className="hb-section" role="status">Abriendo tu agenda…</div>}><Appointments /></Suspense>;
  return <Home />;
}
