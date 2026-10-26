"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import Hero from "@/components/ui/Hero";
import ClassSchedule from "@/components/ui/ClassSchedule";
import TeamSection from "@/components/ui/TeamSection";
import PricingSection from "@/components/ui/PricingSection";
import FAQSection from "@/components/ui/FAQSection";
import Chart from "@/components/ui/Chart";
import Modal from "@/components/ui/Modal";
import TextField from "@/components/ui/TextField";
import QRCode from "@/components/ui/QRCode";
import ActionBar from "@/components/ui/ActionBar";
import OpeningHours from "@/components/ui/OpeningHours";
import { tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame, siteHref } from "../shared";
import { downloadCalendar, nextDays, prettyDate, useDemoState } from "../business-demo/state";
import { CLASSES, INITIAL, TRAINING, validMember, sessionsOn, type Member } from "./data";
import ForjaHome from "./Workbook";
import "../business-demo/business.css";
import "./redesign.css";


const href = (p = "") => siteHref("forja", p);
const TOKENS = tokensToStyle({ bg:"#141515", fg:"#f1eee6", mut:"#a5aca6", acc:"#f16538", acc2:"#c7d693", card:"#232725", ln:"#464b46", r:0, font:"var(--font-mona-sans), sans-serif", display:"var(--font-archivo), sans-serif", glow:false });
type Request = { classId: string; date: string };
const Context = createContext<(ReturnType<typeof useMember> & { days: string[]; request: (r: Request) => void }) | null>(null);
function useMember() { return useDemoState<Member>("trama-forja-v1", INITIAL, validMember); }
function useClub() { const c = useContext(Context); if (!c) throw new Error("Falta Forja Shell"); return c; }
const keyFor = (id: string, date: string) => `${date}:${id}`;
function freePlaces(id: string, date: string) { const c = CLASSES.find(c => c.id === id)!; return Math.max(0, c.capacity - c.booked - (id === "engine" ? 0 : Number(date.slice(-2)) % 3)); }

export function Shell({ children }: { children: ReactNode }) {
  const state = useMember();
  const path = usePathname();
  const [days, setDays] = useState<string[]>([]);
  const [request, setRequest] = useState<Request | null>(null);
  const [notice, setNotice] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => setDays(nextDays()), []);
  const cls = CLASSES.find(c => c.id === request?.classId);
  const already = !!request && state.value.bookings.some(b => b.key === keyFor(request.classId, request.date));
  const waiting = !!request && freePlaces(request.classId, request.date) === 0;
  const conflict = !!request && !!cls && state.value.bookings.some(b => { const other = CLASSES.find(c => c.id === b.classId)!; const min = (t: string) => Number(t.slice(0,2)) * 60 + Number(t.slice(3)); return b.date === request.date && !b.waitlist && min(other.time) < min(cls.time) + cls.minutes && min(cls.time) < min(other.time) + other.minutes; });
  return <Context.Provider value={{ ...state, days, request: r => { setRequest(r); setNotice(""); setEmail(""); } }}><SiteFrame tokens={TOKENS} className="fj biz">
    <div className="fj-demo"><a href="/demos">TRAMA / WEBS COMPLETAS ↗</a><span>Club de demostración · Reservas guardadas en tu navegador.</span></div>
    <header className="fj-nav"><a href={href()} className="fj-logo">forja<span aria-hidden>↗</span></a><nav aria-label="Navegación del club">{[["clases", "Clases"], ["planes", "Planes"], ["club", "El club"], ["mi-ritmo", "Mi entrenamiento"]].map(([p,label]) => <a key={p} href={href(p)} aria-current={path === href(p) ? "page" : undefined}>{label}</a>)}</nav><Button label="Prueba una clase" href={`${href("clases")}?prueba=1`} variant="solid" glyph="↗" /></header>
    <main>{children}</main>
    <footer className="fj-footer"><div><a className="fj-logo" href={href()}>forja↗</a><p>El progreso no se improvisa.<br />Se entrena.</p><small>Club ficticio en Zaragoza.<br />Fotografías de referencia, no de un local real.</small></div><OpeningHours title="El tiempo también entrena" hours={"L-V|06:30-22:00\nS|08:00-15:00\nD|09:00-13:00"} variant="minimal" /><div><a href={href("clases")}>Encuentra tu clase ↗</a><a href={href("planes")}>Planes sin letra pequeña ↗</a><a href="/creditos">Fotografía y créditos ↗</a><a href={siteHref("esparta")}>Descubrir Esparta, la barbería ↗</a><small>Datos y disponibilidad simulados. Sin pagos ni mensajes.{state.temporary && " Guardado temporal: el almacenamiento está bloqueado."}</small></div></footer>
    <ActionBar actions={[{ label: "Horario", href: href("clases"), icon: "calendar" }, { label: "Mi entrenamiento", href: href("mi-ritmo"), icon: "user" }, { label: "Prueba una clase", href: `${href("clases")}?prueba=1`, primary: true, icon: "arrow-right" }]} variant="solid" />
    <Modal open={!!request} onOpenChange={open => { if (!open) setRequest(null); }} title={cls ? `${waiting ? "Lista de espera" : "Tu próxima clase"}: ${cls.name}` : "Reserva"} actions={[]} variant="solid" size="md">
      {cls && request && <form className="fj-book-form" onSubmit={e => { e.preventDefault(); if (!state.ready || already || conflict) return; state.setValue(prev => ({ ...prev, bookings: [...prev.bookings, { key: keyFor(cls.id, request.date), classId: cls.id, date: request.date, waitlist: waiting }] })); setRequest(null); setNotice(waiting ? "Te hemos añadido a la lista de espera de prueba. Puedes verla en Mi entrenamiento." : "Tu plaza de prueba está guardada. Puedes verla en Mi entrenamiento."); }}><p>{prettyDate(request.date)} · {cls.time}<br />{cls.minutes} min · {cls.coach} · {cls.room}</p><p>{cls.description}</p>{waiting && <p>Esta sesión está completa. Guardaremos tu interés en este navegador. La demo no envía avisos ni asigna plazas automáticamente.</p>}{already ? <p role="status">Ya tienes esta sesión en tu agenda.</p> : conflict ? <p role="alert">Esta clase coincide con otra de tu agenda. Cancela la otra reserva o elige otro horario.</p> : <><TextField label="Correo para probar tu reserva" placeholder="alex@ejemplo.com" type="email" required value={email} onChange={setEmail} variant="solid" /><p className="fj-small">Tu primera clase es gratuita. El correo no se guarda ni se envía. Esta es una reserva simulada; puedes cancelar hasta 2 horas antes desde Mi entrenamiento.</p><label className="fj-consent"><input required type="checkbox" /> Entiendo que es una demo y que no reserva una plaza real.</label><Button label={waiting ? "Apuntarme a la espera de prueba" : "Confirmar plaza de prueba"} type="submit" disabled={!state.ready} variant="solid" fullWidth /></>}<Button label="Volver al horario" onClick={() => setRequest(null)} variant="solid" emphasis="ghost" /></form>}
    </Modal>
    {notice && <div className="fj-notice" role="status"><span>{notice}</span><a href={href("mi-ritmo")}>Ver mi agenda ↗</a><button aria-label="Cerrar aviso" onClick={() => setNotice("")}>×</button></div>}
  </SiteFrame></Context.Provider>;
}

function Home() { const { days, request } = useClub(); return <ForjaHome days={days} onRequest={request} />; }

function Schedule() {
  const { value, request, ready } = useClub();
  const [activity, setActivity] = useState("");
  useEffect(() => { const a = new URLSearchParams(location.search).get("actividad"); if (a && ["Fuerza", "Movilidad", "Cardio"].includes(a)) setActivity(a); }, []);
  return <div className="fj-section"><Hero kicker="HORARIO / LOS PRÓXIMOS SIETE DÍAS" title="RESERVA. ENTRENA. REPITE." subtitle="Elige día, actividad y nivel. Tu primera sesión es gratis. Plazas de demostración: la disponibilidad no corresponde a un gimnasio real." primaryCta="" secondaryCta="" badges="" backdrop="none" align="left" />
    {!ready ? <p role="status">Preparando el horario…</p> : <ClassSchedule classes={CLASSES} startOffset={1} availableOn={(c, d) => sessionsOn(d).some(s => s.id === c.id)} defaultCategory={activity} bookings={value.bookings} freePlaces={(c, d) => { const own = value.bookings.find(b => b.key === keyFor(c.id, d)); return Math.max(0, freePlaces(c.id, d) - (own && !own.waitlist ? 1 : 0)); }} onBook={(c, d) => request({ classId: c.id, date: d })} bookLabel="Reservar plaza" waitlistLabel="Entrar en espera" bookedLabel="Tu plaza está guardada" waitlistedLabel="En tu lista de espera" bookedHref={href("mi-ritmo")} emptyText="Otro ritmo, otro filtro: no hay clases con esta combinación." variant="solid" className="fj-sched" />}
    <p className="fj-small">Cancelación hasta 2 horas antes. Puedes gestionar plazas y listas de espera desde Mi entrenamiento. La demo no envía notificaciones.</p>
  </div>;
}

function Plans() {
  const { setValue, ready } = useClub();
  const [plan, setPlan] = useState<{ name: string; price: string; period: string } | null>(null);
  const [done, setDone] = useState("");
  return <div className="fj-section"><p className="fj-eyebrow">PLANES / TODO A LA VISTA</p><h1 className="fj-title">ENTRENAR. SIN LETRA PEQUEÑA.</h1><PricingSection kicker="" title="" subtitle="0 € de matrícula. Sin permanencia. Todos los precios incluyen IVA. Cada plan se renueva al mes y puedes darlo de baja antes de la siguiente renovación." plans={"Esencial|39 €|/ mes|no|4 clases al mes;Sala libre en horario de apertura;Sesión de bienvenida|Para hacerle sitio al movimiento.\nClub|59 €|/ mes|si|8 clases al mes;Sala libre en horario de apertura;Sesión de bienvenida;Rutina orientativa semanal|Para encontrar tu constancia.\nLibre|79 €|/ mes|no|Clases ilimitadas según disponibilidad;Sala libre en horario de apertura;Sesión de bienvenida;Rutina orientativa semanal|Para entrenar a tu manera."} variant="solid" cta="Elegir este plan" badge="Encuentra tu constancia" layout="list" highlight="lift" badgePlacement="inline" planCase="none" marker="check" footnote="IVA incluido. 0 € de matrícula. Sin permanencia. Baja antes de la siguiente renovación." comparison={"Clases al mes|4|8|Sin límite\nSala libre|Incluida|Incluida|Incluida\nBienvenida con entrenador|Incluida|Incluida|Incluida\nPropuesta semanal|—|Incluida|Incluida"} onSelectPlan={p => { setPlan(p); setDone(""); }} /><p className="fj-small">Los bonos de clases se renuevan cada mes y no se acumulan. La demostración permite probar reservas sin descontar saldo. En un servicio real se validarían las plazas, el saldo y el cobro en el servidor.</p>{done && <p role="status" className="fj-success">{done} <a href={href("mi-ritmo")}>Ver mi plan ↗</a></p>}<FAQSection kicker="SIN LETRA PEQUEÑA" title="LAS COSAS CLARAS." subtitle="" align="left" variant="minimal" items={"¿Puedo probar antes de apuntarme?|Sí. Elige una sesión del horario y reserva tu primera clase gratuita. En esta demo la reserva solo se guarda en tu navegador.\n¿Hay permanencia o matrícula?|No. Los planes del club ficticio no tienen matrícula ni permanencia. Puedes cancelar antes de la siguiente renovación mensual.\n¿Y si una clase está llena?|Puedes entrar en la lista de espera. En esta demo se guarda tu interés, pero no se envían avisos ni se asignan plazas automáticamente.\n¿Cómo cancelo mi plan?|Desde Mi entrenamiento, pulsa Dar de baja el plan y confirma. En esta simulación el cambio es inmediato y no hay cobros.\n¿Tengo que tener experiencia?|No. Las sesiones de nivel Inicio están pensadas para aprender la técnica desde cero, con ayuda del entrenador."} /><Modal open={!!plan} onOpenChange={o => { if (!o) setPlan(null); }} title={`Tu plan ${plan?.name ?? ""}`} actions={[]} variant="solid"><p>{plan?.price} {plan?.period} · Sin matrícula ni permanencia.</p><p>Activarás un plan de demostración en este navegador. No se solicita tarjeta, no hay cobro ni se crea una cuenta real.</p><div className="fj-modal-actions"><Button label="Activar plan de prueba" disabled={!ready} onClick={() => { if (!plan) return; setValue(prev => ({ ...prev, plan: plan.name })); setDone(`Plan ${plan.name} activado en esta demo.`); setPlan(null); }} variant="solid" /><Button label="Seguir comparando" onClick={() => setPlan(null)} variant="solid" emphasis="ghost" /></div></Modal></div>;
}

function Club() { return <><div className="fj-section"><Hero kicker="EL CLUB / ESPACIO PARA TI" title="AQUÍ SE TRABAJA." subtitle="Un club de barrio con espacio para entrenar, recuperar y hablar. Instalaciones y equipo ficticios para esta demo de Trama." primaryCta="Conocer mi primera clase" primaryHref={href("clases")} secondaryCta="" badges="" backdrop="none" align="left" /><div className="fj-club-image"><img src={TRAINING} alt="Un entrenador conversa con un grupo durante la vuelta a la calma" loading="lazy" /><p>TRABAJO EN GRUPO / RECUPERACIÓN / ACOMPAÑAMIENTO</p></div><TeamSection kicker="EL EQUIPO" title="LOS QUE TE CORRIGEN." subtitle="" titleSize="giant" align="left" shape="portrait" photoTone="mono" linkLabel="Ver sus clases" variant="minimal" className="fj-team" members={[{ name: "Inés", role: "Fuerza y técnica", bio: "Te acompaña desde la primera sentadilla hasta tu siguiente reto.", photo: "/img/forja/equipo/ines.webp", href: href("clases") + "?actividad=Fuerza" }, { name: "Nico", role: "Movilidad y control", bio: "Te ayuda a encontrar espacio, control y confianza en cada gesto.", photo: "/img/forja/equipo/nico.webp", href: href("clases") + "?actividad=Movilidad" }, { name: "Dani", role: "Resistencia y energía", bio: "Adapta la intensidad para que termines con ganas de volver.", photo: "/img/forja/equipo/dani.webp", href: href("clases") + "?actividad=Cardio" }]} /><section className="fj-occupancy"><div><p className="fj-eyebrow">ELIGE TU MOMENTO</p><h2>MÁS ESPACIO.<br />MENOS PRISAS.</h2><p>A primera hora y a mediodía suele haber más espacio. Estos datos son orientativos y simulados, no ocupación en directo.</p></div><Chart kind="bar" labels={["07 h","09 h","11 h","13 h","15 h","17 h","19 h","21 h"]} series={[{ name: "Ocupación orientativa", data: [35,50,25,40,30,65,90,55], tone: "acc" }]} unit=" %" label="Ejemplo simulado de ocupación del gimnasio por hora" height={260} /></section></div><section className="fj-band"><h2>LA PRÓXIMA<br />REPETICIÓN ES TUYA.</h2><Button label="Ver clases" href={href("clases")} variant="solid" glyph="↗" /></section></>; }

function MemberArea() {
  const { value, setValue, ready } = useClub();
  const [cancel, setCancel] = useState("");
  const [leave, setLeave] = useState(false);
  const goalClasses: Record<string,string[]> = { "Crear un hábito": ["Base camp", "Mobility lab", "Base camp"], "Ganar fuerza": ["Base camp", "Heavy club", "Recovery"], "Moverme mejor": ["Mobility lab", "Recovery", "Mobility lab"] };
  return <div className="fj-section"><p className="fj-eyebrow">TU ESPACIO PERSONAL / SIN CONTRASEÑAS EN ESTA DEMO</p><h1 className="fj-title">ESTO TAMBIÉN ES ENTRENAR.</h1><p>Tu plan, tu agenda y una idea para la semana. Guardado solo en este navegador.</p>{!ready ? <p role="status">Cargando tu espacio…</p> : <><div className="fj-member-grid"><article className="fj-member-plan"><p className="fj-eyebrow">TU PLAN</p><h2>{value.plan || "A TU MANERA"}</h2><p>{value.plan ? "Plan de demostración activo. No hay facturas ni cobros." : "Empieza probando una clase. Elige tu plan cuando encuentres tu ritmo."}</p>{value.plan ? <><QRCode value={`TRAMA-DEMO-FORJA-${value.plan}`} codeSize={110} caption="Pase de muestra · no válido para acceso" /><Button label={leave ? "Confirmar baja del plan" : "Dar de baja el plan"} onClick={() => { if (leave) { setValue(prev => ({ ...prev, plan: "" })); setLeave(false); } else setLeave(true); }} variant="solid" emphasis="outline" />{leave && <Button label="Conservar mi plan" onClick={() => setLeave(false)} variant="solid" emphasis="ghost" />}</> : <Button label="Comparar planes" href={href("planes")} variant="solid" glyph="↗" />}</article><article className="fj-member-goal"><p className="fj-eyebrow">UNA SEMANA QUE ENCAJA CONTIGO</p><h2>¿QUÉ TE MUEVE?</h2><label>Mi objetivo<select aria-label="Mi objetivo" value={value.goal} onChange={e => setValue(prev => ({ ...prev, goal: e.target.value }))}>{Object.keys(goalClasses).map(g => <option key={g}>{g}</option>)}</select></label><p className="fj-small">Propuesta general de organización, sin prescripción de ejercicios. Tu entrenador adapta el contenido a ti.</p>{goalClasses[value.goal].map((name,i) => <div key={i} className="fj-routine"><span>{["Lunes", "Miércoles", "Viernes"][i]}</span><strong>{name}</strong></div>)}<a href={href("clases")}>Buscar estos huecos en el horario ↗</a></article></div><div className="fj-agenda-heading"><h2>TU AGENDA</h2><Button label="Añadir una clase" href={href("clases")} variant="solid" emphasis="outline" glyph="↗" /></div>{!value.bookings.length ? <div className="fj-empty"><h3>TU PRIMERA CLASE TE ESPERA.</h3><p>Elige una sesión del horario. Aquí verás tus plazas y tus listas de espera.</p><Button label="Explorar el horario" href={href("clases")} variant="solid" /></div> : <div className="fj-bookings">{[...value.bookings].sort((a,b) => a.key.localeCompare(b.key)).map(b => { const c = CLASSES.find(c => c.id === b.classId)!; const mutable = new Date(`${b.date}T${c.time}:00`).getTime() - Date.now() > 7200000; return <article key={b.key}><div><p className="fj-eyebrow">{b.waitlist ? "LISTA DE ESPERA" : "PLAZA GUARDADA"}</p><h3>{c.name}</h3><p>{prettyDate(b.date)} · {c.time}<br />{c.coach} · {c.minutes} min · {c.room}</p></div><div className="fj-booking-buttons">{!b.waitlist && <Button label="Añadir al calendario" onClick={() => downloadCalendar(`Forja (demo) - ${c.name}`, b.date, c.time, c.minutes, "Forja - club ficticio")} variant="solid" emphasis="outline" />}<Button label={cancel === b.key ? "Confirmar cancelación" : b.waitlist ? "Salir de la espera" : "Cancelar plaza"} disabled={!mutable} onClick={() => { if (cancel === b.key) { setValue(prev => ({ ...prev, bookings: prev.bookings.filter(v => v.key !== b.key) })); setCancel(""); } else setCancel(b.key); }} variant="solid" emphasis="ghost" />{cancel === b.key && <Button label="Conservar reserva" onClick={() => setCancel("")} variant="solid" emphasis="ghost" />}{!mutable && <small>Esta sesión está dentro de las 2 horas o ya ha pasado. Cambios online cerrados.</small>}</div></article>; })}</div>}</>}</div>;
}

export function Page({ path }: { path: string[] }) {
  if (path[0] === "clases") return <Schedule />;
  if (path[0] === "planes") return <Plans />;
  if (path[0] === "club") return <Club />;
  if (path[0] === "mi-ritmo") return <MemberArea />;
  return <Home />;
}
