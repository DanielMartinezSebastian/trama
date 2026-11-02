"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowRight, Check, Globe2, Heart, MessageCircle, Mic, Monitor, Video, X } from "lucide-react";
import GuideFrame from "@/components/ui/GuideFrame";
import Hero from "@/components/ui/Hero";
import Button from "@/components/ui/Button";
import FeatureGrid from "@/components/ui/FeatureGrid";
import FAQSection from "@/components/ui/FAQSection";
import CTASection from "@/components/ui/CTASection";
import Footer from "@/components/ui/Footer";
import Modal from "@/components/ui/Modal";
import "./parla.css";

const LANGUAGES = [
  { name: "Inglés", greeting: "Hello!", code: "EN", count: 3 },
  { name: "Francés", greeting: "Bonjour!", code: "FR", count: 2 },
  { name: "Italiano", greeting: "Ciao!", code: "IT", count: 1 },
  { name: "Español", greeting: "¡Hola!", code: "ES", count: 2 },
];

const TUTORS = [
  { name: "Clara M.", country: "España", image: "/img/inspiraciones/ahora/profe-clara.webp", languages: ["Inglés", "Español"], focus: "Conversación sin miedo a equivocarte.", price: 18, rating: "4,9", reviews: 86, tag: "Conversación" },
  { name: "James W.", country: "Reino Unido", image: "/img/parla/james.jpg", languages: ["Inglés", "Francés"], focus: "Tu próxima reunión, en inglés.", price: 24, rating: "5,0", reviews: 124, tag: "Para el trabajo" },
  { name: "Marco R.", country: "Italia", image: "/img/inspiraciones/ahora/profe-alan.webp", languages: ["Italiano", "Inglés", "Francés", "Español"], focus: "Un idioma nuevo. Un mundo más grande.", price: 16, rating: "4,9", reviews: 72, tag: "Desde cero" },
];
type Tutor = typeof TUTORS[number];
const TIMES = ["Lunes · 10:00", "Martes · 18:30", "Jueves · 17:00"];

export default function ParlaLanding(_props: { hud: boolean }) {
  const [language, setLanguage] = useState("Inglés");
  const [budget, setBudget] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [time, setTime] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [goal, setGoal] = useState("Conversar con confianza");
  const bookingTrigger = useRef<HTMLElement | null>(null);
  const visibleTutors = TUTORS.filter(t => t.languages.includes(language) && (budget === "all" || t.price <= 20) && (!savedOnly || favorites.includes(t.name)));
  const chosenLanguage = LANGUAGES.find(l => l.name === language)!;

  useEffect(() => {
    document.documentElement.classList.add("scrollable");
    return () => document.documentElement.classList.remove("scrollable");
  }, []);

  useEffect(() => {
    if (tutor) return () => bookingTrigger.current?.focus();
  }, [tutor]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  function chooseLanguage(value: string) {
    setLanguage(value);
    setSavedOnly(false);
    document.getElementById("profesores")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  function openBooking(person: Tutor) { bookingTrigger.current = document.activeElement as HTMLElement; setTutor(person); setTime(""); setConfirmed(false); }
  function submitBooking(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setConfirmed(true); }

  return (
    <GuideFrame guide="cercano" className="parla" as="main">
      <a className="parla-skip" href="#profesores">Saltar a profesores</a>
      <div className="parla-announcement"><span>Tu próxima conversación empieza aquí.</span><a href="#profesores">Encuentra a tu profe <ArrowRight size={14} /></a></div>
      <header className="parla-nav parla-wrap">
        <a className="parla-logo" href="#inicio" aria-label="Parla, inicio">parla<span aria-hidden>✳</span></a>
        <nav aria-label="Navegación principal" className={menuOpen ? "parla-links is-open" : "parla-links"}>
          <a href="#profesores" onClick={() => setMenuOpen(false)}>Encuentra tu profe</a>
          <a href="#como-funciona" onClick={() => setMenuOpen(false)}>Cómo funciona</a>
          <a href="#preguntas" onClick={() => setMenuOpen(false)}>Tus preguntas</a>
        </nav>
        <div className="parla-nav-actions"><span className="parla-locale"><Globe2 size={16} /> ES · EUR</span><Button label="Empezar" href="#profesores" variant="outline" className="parla-button parla-button--outline" /><button className="parla-menu" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={24} /> : <span>Menú +</span>}</button></div>
      </header>

      <div className="parla-hero-band" id="inicio">
        <div className="parla-hero parla-wrap">
          <div className="parla-hero-copy">
            <span className="parla-eyebrow"><span aria-hidden>↔</span> EL IDIOMA CAMBIA. TÚ CONECTAS.</span>
            <Hero kicker="" title="Hay un mundo al otro lado de un hola." subtitle="Atrévete a hablarlo. Encuentra a esa persona que hace que aprender un idioma se sienta como una buena conversación." primaryCta="Encuentra tu profe" primaryHref="#profesores" secondaryCta="" badges="" align="left" backdrop="none" variant="outline" className="parla-kit-hero" />
            <div className="parla-hero-note"><span className="parla-mini-faces" aria-hidden><img src={TUTORS[0].image} alt="" width="30" height="30" /><img src={TUTORS[1].image} alt="" width="30" height="30" /><img src={TUTORS[2].image} alt="" width="30" height="30" /></span><span>Personas reales. Tu propio ritmo.</span></div>
          </div>
          <div className="parla-call" aria-label="Una conversación entre dos personas, ilustración de una clase online">
            <div className="parla-call-photo"><img src="/img/parla/conversation.jpg" alt="Una mujer sonríe durante una conversación" width="1000" height="1200" fetchPriority="high" /><span className="parla-call-live"><span /> En buena compañía</span><div className="parla-call-caption">Un pequeño hola.<br /><strong>Un gran comienzo.</strong></div></div>
            <div className="parla-call-tutor"><img src={TUTORS[1].image} alt="Retrato del interlocutor" width="600" height="600" /><span>James · Tu profe</span></div>
            <span className="parla-speech">Hello, <em>you!</em><span aria-hidden>✦</span></span>
            <div className="parla-call-controls" aria-hidden><span><Mic size={19} /></span><span><Video size={20} /></span><span><Monitor size={19} /></span><span className="parla-call-end"><MessageCircle size={19} /></span></div>
            <span className="parla-call-sticker">Aquí se viene<br />a <u>soltarse.</u><ArrowDown size={30} /></span>
          </div>
        </div>
        <div className="parla-hero-bottom parla-wrap"><span>CLASES ONLINE. CONEXIONES DE VERDAD.</span><a href="#idiomas">¿Qué te apetece hablar? <ArrowDown size={16} /></a></div>
      </div>

      <section className="parla-languages parla-wrap" id="idiomas" aria-labelledby="idiomas-titulo">
        <div><p className="parla-kicker">EMPIEZA POR UNA PALABRA</p><h2 id="idiomas-titulo">¿En qué idioma<br />será tu próximo hola?</h2></div>
        <div className="parla-language-grid">{LANGUAGES.map(l => <button key={l.name} onClick={() => chooseLanguage(l.name)} className="parla-language"><span className="parla-language-code">{l.code}</span><span><strong>{l.name}</strong><small>{l.greeting}</small></span><ArrowRight size={21} /></button>)}</div>
      </section>

      <section className="parla-tutors parla-wrap" id="profesores" aria-labelledby="profesores-titulo">
        <div className="parla-section-head"><div><p className="parla-kicker">EL BUEN APRENDIZAJE ES PERSONAL</p><h2 id="profesores-titulo">Tu idioma. Tu persona.</h2></div><p>Hay un profe para tu manera de aprender.<br />Y para todo eso que quieres contar.</p></div>
        <div className="parla-filters"><label>Quiero aprender<select value={language} onChange={e => setLanguage(e.target.value)}>{LANGUAGES.map(l => <option key={l.name}>{l.name}</option>)}</select></label><label>Precio por clase<select value={budget} onChange={e => setBudget(e.target.value)}><option value="all">Cualquier precio</option><option value="20">Hasta 20 €</option></select></label><button className={`parla-saved ${savedOnly ? "is-active" : ""}`} aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}><Heart size={17} /> Mis favoritos ({favorites.length})</button></div>
        <p className="parla-result-count" role="status">{visibleTutors.length} {visibleTutors.length === 1 ? "profe disponible" : "profes de ejemplo"} de {language.toLowerCase()}</p>
        <div className="parla-tutor-grid">{visibleTutors.map(person => <article className="parla-tutor" key={person.name}>
          <div className="parla-tutor-photo"><img src={person.image} alt={`Retrato de ${person.name}`} width="600" height="600" loading="lazy" /><span className="parla-tutor-tag">{person.tag}</span><button aria-label={`${favorites.includes(person.name) ? "Quitar de" : "Añadir a"} favoritos a ${person.name}`} aria-pressed={favorites.includes(person.name)} onClick={() => setFavorites(favorites.includes(person.name) ? favorites.filter(n => n !== person.name) : [...favorites, person.name])}><Heart size={21} fill={favorites.includes(person.name) ? "currentColor" : "none"} /></button></div>
          <div className="parla-tutor-body"><div className="parla-tutor-name"><h3>{person.name}</h3><span>★ {person.rating} <small>({person.reviews})</small></span></div><p className="parla-tutor-country">{person.country} · {language}</p><p className="parla-tutor-focus">{person.focus}</p><div className="parla-tutor-price"><span><strong>{person.price} €</strong> / 50 min</span><span>Clase individual</span></div><Button label={`Conocer a ${person.name.split(" ")[0]}`} glyph="→" onClick={() => openBooking(person)} variant="outline" fullWidth className="parla-button parla-button--outline" /></div>
        </article>)}</div>
        {!visibleTutors.length && <div className="parla-empty"><MessageCircle size={32} /><h3>Aún no hay un hola por aquí.</h3><p>{savedOnly ? "Guarda un profe con el corazón o vuelve a verlos todos." : "Prueba con otro idioma o amplía tu presupuesto."}</p><Button label="Ver todos los profes" onClick={() => { setBudget("all"); setSavedOnly(false); }} variant="outline" className="parla-button parla-button--dark" /></div>}
        <p className="parla-demo-note">Perfiles, valoraciones y precios ficticios para esta demo.</p>
      </section>

      <section id="como-funciona" className="parla-how parla-wrap" aria-label="Cómo funciona Parla">
        <FeatureGrid kicker="DE LAS GANAS A LAS PALABRAS" title="Hablar empieza por conectar." subtitle="Sin un camino igual para todos. Con alguien que recorre el tuyo contigo." variant="outline" className="parla-steps" items={"01|Encuentra a tu persona|Elige el idioma, conoce a los profes y encuentra a alguien con quien te apetezca hablar.\n02|Hazlo tuyo|Una primera clase para compartir tus objetivos, tu nivel y eso que te gustaría conseguir.\n03|Sigue la conversación|Reserva un rato para ti. Practica, equivócate y descubre todo lo que ya puedes decir."} />
      </section>

      <section className="parla-manifesto parla-wrap" aria-labelledby="manifiesto-titulo"><span className="parla-manifesto-icon" aria-hidden>“</span><div><p className="parla-kicker">MÁS ALLÁ DEL LIBRO DE TEXTO</p><h2 id="manifiesto-titulo">Para pedir ese café.<br />Para decir lo que piensas.<br /><span>Para ser tú, en otro idioma.</span></h2><p>No necesitas tener todas las palabras.<br />Solo a alguien con quien empezar.</p><a href="#profesores">Encuentra tu primera conversación <ArrowRight size={19} /></a></div><span className="parla-word" aria-hidden>{chosenLanguage.greeting}</span></section>

      <div id="preguntas" className="parla-faq parla-wrap"><FAQSection kicker="ANTES DE DECIR HOLA" title="¿Hablamos de tus dudas?" subtitle="" layout="split" align="left" presentation="lines" variant="minimal" defaultOpen={0} items={"¿Necesito tener un nivel mínimo?|Puedes empezar desde cero. Comparte tu nivel y tus objetivos al elegir tu primera clase para que el profe adapte la conversación.\n¿Cómo son las clases?|Son sesiones individuales online de 50 minutos. En una plataforma real recibirías un enlace para conectarte a tu aula.\n¿Puedo cambiar de profe?|Sí. La conexión importa: puedes explorar otros perfiles hasta encontrar una forma de aprender que encaje contigo.\n¿Se cobra al reservar en esta demo?|No. La reserva es una simulación local: no solicita pago, no guarda datos y no agenda una clase real."} /></div>
      <div className="parla-final"><CTASection kicker="TU VOZ TIENE MUCHO QUE CONTAR" title="Todo empieza con un hola." subtitle="El siguiente puede ser el tuyo." primaryCta="Encuentra tu profe" primaryHref="#profesores" secondaryCta="" variant="outline" className="parla-final-cta" /></div>
      <div className="parla-footer"><Footer brand="parla✳" tagline="Más idiomas. Más tú." columns="Explora: Profesores=#profesores, Idiomas=#idiomas, Cómo funciona=#como-funciona; Trama: Ver la guía=/guias/cercano, Más demos=/demos, Estudio de Preply=/docs/preply" social="" copyright="PARLA es una marca ficticia · Demo de Trama inspirada en Preply · 2026" variant="minimal" /></div>

      <Modal open={!!tutor} onOpenChange={open => { if (!open) setTutor(null); }} title={confirmed ? "Tu próximo hola ya tiene hora." : `Tu primera clase con ${tutor?.name ?? "tu profe"}`} body="" variant="outline" actions={[]} className="parla-booking">
        {confirmed ? <div className="parla-confirmation"><Check size={36} /><p><strong>{language} · {time}</strong><br />50 minutos con {tutor?.name}. Objetivo: {goal.toLowerCase()}.</p><p>Reserva de demostración completada. No se ha guardado ningún dato, realizado ningún cobro ni agendado una clase real.</p><Button label="Seguir explorando" variant="outline" className="parla-button parla-button--dark" onClick={() => setTutor(null)} /></div> : <form onSubmit={submitBooking} className="parla-booking-form"><p>Una conversación para conoceros, ver tu nivel y preparar un plan a tu medida.</p><label>¿Qué quieres conseguir?<select value={goal} onChange={e => setGoal(e.target.value)}><option>Conversar con confianza</option><option>Usarlo en el trabajo</option><option>Preparar un viaje</option><option>Empezar desde cero</option></select></label><fieldset><legend>Elige un hueco de ejemplo · hora de Madrid</legend>{TIMES.map(slot => <label key={slot} className={time === slot ? "parla-slot is-selected" : "parla-slot"}><input type="radio" name="time" value={slot} required checked={time === slot} onChange={() => setTime(slot)} />{slot}</label>)}</fieldset><div className="parla-booking-total"><span>{language} · 50 minutos</span><strong>{tutor?.price} €</strong></div><p className="parla-demo-note">Simulación sin pago ni reserva real.</p><Button label="Confirmar clase de prueba" type="submit" variant="outline" className="parla-button parla-button--dark" fullWidth /><button type="button" className="parla-cancel" onClick={() => setTutor(null)}>Volver a los perfiles</button></form>}
      </Modal>
    </GuideFrame>
  );
}
