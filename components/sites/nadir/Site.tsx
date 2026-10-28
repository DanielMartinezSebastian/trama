"use client";

import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type MutableRefObject, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Hero from "@/components/ui/Hero";
import Button from "@/components/ui/Button";
import Footer from "@/components/ui/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { scrollToAnchor } from "@/lib/motion/anchors";
import { getLenis } from "@/lib/motion/lenis";
import { GLBoundary, useGLGate } from "@/lib/ui/gl";
import { tokensToStyle } from "@/lib/ui/tokens";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { useScrollStory, type StoryFrame } from "@/lib/story/useScrollStory";
import { SiteFrame, siteHref } from "../shared";
import { CHAPTERS, COLORS, ROUTES, SLUG } from "./data";
import type { Flight } from "./Scene";
import { SEED_MECHANICS } from "./seed-motion";
import "./nadir.css";

const Scene = lazy(() => import("./Scene"));
const href = (path = "") => siteHref(SLUG, path);
const TOKENS = {
  ...tokensToStyle({ bg: COLORS.abyss, fg: COLORS.ice, mut: COLORS.mist, acc: COLORS.copper, acc2: COLORS.signal, card: COLORS.mineral, ln: "rgba(166,189,195,0.24)", r: 2, font: "var(--font-instrument-sans), Arial, sans-serif", display: "var(--font-archivo), Arial, sans-serif", glow: false }),
  "--nd-mono": "var(--font-ibm-plex-mono), monospace",
} as CSSProperties;
const FlightContext = createContext<MutableRefObject<Flight> | null>(null);

function SeedFallback({ open }: { open: number }) {
  return <div className="nd-fallback" aria-hidden="true"><svg viewBox="0 0 700 700" fill="none">
    <defs>
      <linearGradient id="nd-shell" x1="200" y1="100" x2="480" y2="600" gradientUnits="userSpaceOnUse"><stop stopColor={COLORS.mineral} /><stop offset=".55" stopColor={COLORS.abyss} /><stop offset="1" stopColor={COLORS.mist} stopOpacity=".35" /></linearGradient>
      <radialGradient id="nd-core"><stop stopColor={COLORS.ice} /><stop offset="1" stopColor={COLORS.signal} stopOpacity=".22" /></radialGradient>
    </defs>
    <g transform="translate(350 350) rotate(-12)">
      <path d="M0-145C-18-112-58-28-46 46C-31 133 42 139 48 47C54-26 24-110 0-145Z" fill="url(#nd-core)" stroke={COLORS.signal} />
      {[-1, 1].map(side => <g key={side} transform={"translate(" + (open * side * 85) + " 0) rotate(" + (open * side * -32) + " 0 235)"}>
        <path d={"M0-250C" + (side * 145) + " -170 " + (side * 180) + " 105 0 250C" + (side * 45) + " 80 " + (side * 65) + " -90 0 -250Z"} fill="url(#nd-shell)" stroke={COLORS.copper} strokeWidth="2" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <path key={i} d={"M" + (side * (35 + Math.sin(i / 7 * Math.PI) * 10)) + " " + (-155 + i * 44) + "Q" + (side * 85) + " " + (-175 + i * 44) + " " + (side * (65 + Math.sin(i / 7 * Math.PI) * 62)) + " " + (-150 + i * 44)} stroke={COLORS.copper} opacity=".55" />)}
      </g>)}
      <ellipse rx={147 + open * 38} ry="24" cy="275" stroke={COLORS.copper} strokeWidth="8" strokeDasharray="64 8" />
      <path d="M0 100V-82M0 40-24 9M0-9 27-38M0-45-15-68" stroke={COLORS.signal} strokeWidth="2" />
    </g>
  </svg></div>;
}

function Stage({ flight, chapter }: { flight: MutableRefObject<Flight>; chapter: number }) {
  const el = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const gate = useGLGate(el, { want: !reduced });
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  return <div ref={el} className={`nd-stage ${ready && gate.use3d ? "is-ready" : ""}`} aria-hidden="true">
    <div className="nd-atmosphere" />
    <SeedFallback open={SEED_MECHANICS.bands[chapter][0]} />
    {gate.use3d && gate.mounted && <div className="nd-webgl"><GLBoundary onError={gate.fail}><Suspense fallback={null}><Scene flight={flight} onReady={onReady} /></Suspense></GLBoundary></div>}
    <div className="nd-crosshair nd-crosshair--one" /><div className="nd-crosshair nd-crosshair--two" />
    <div className="nd-grain" />
  </div>;
}

/** Audio sintetizado, solo tras un gesto; se cierra al abandonar la web. */
function SignalAudio() {
  const flight = useContext(FlightContext)!;
  const context = useRef<AudioContext | null>(null);
  const voices = useRef<OscillatorNode[]>([]);
  const pulse = useRef<GainNode | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [failed, setFailed] = useState(false);
  const busy = useRef(false);
  useEffect(() => () => { void context.current?.close(); }, []);
  useEffect(() => {
    if (!enabled || !context.current || !pulse.current) return;
    const audio = context.current;
    const envelope = pulse.current.gain;
    let nextPulse = audio.currentTime + 0.15;
    const update = () => {
      if (audio.state === "closed") return;
      const { chapter, progress, revealed } = flight.current;
      voices.current.forEach((voice, i) => voice.frequency.setTargetAtTime([55, 82.41, 110.2][i] * (1 + chapter * 0.12 + progress * 0.025 + (revealed ? 0.08 : 0)), audio.currentTime, 1.8));
      if (audio.currentTime + 0.3 >= nextPulse) {
        const at = Math.max(audio.currentTime, nextPulse);
        envelope.setValueAtTime(0, at);
        envelope.linearRampToValueAtTime(0.045, at + 0.08);
        envelope.exponentialRampToValueAtTime(0.0001, at + 1.6);
        nextPulse = at + 38;
      }
    };
    update();
    const timer = window.setInterval(update, 250);
    return () => window.clearInterval(timer);
  }, [enabled, flight]);
  const toggle = async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      if (context.current) {
        await context.current.close(); context.current = null; setEnabled(false);
      } else {
        const audio = new AudioContext(); context.current = audio;
        const gain = audio.createGain(); gain.gain.value = 0.016; gain.connect(audio.destination);
        voices.current = [];
        for (const hz of [55, 82.41, 110.2]) {
          const osc = audio.createOscillator(); osc.frequency.value = hz; osc.type = "sine"; osc.connect(gain); osc.start();
          voices.current.push(osc);
        }
        const signal = audio.createOscillator(); signal.frequency.value = 440; signal.type = "sine";
        pulse.current = audio.createGain(); pulse.current.gain.value = 0;
        signal.connect(pulse.current); pulse.current.connect(audio.destination); signal.start();
        await audio.resume(); setEnabled(true); setFailed(false);
      }
    } catch { void context.current?.close(); context.current = null; setEnabled(false); setFailed(true); }
    finally { busy.current = false; }
  };
  return <button className="nd-sound" type="button" aria-pressed={enabled} onClick={() => void toggle()} aria-label={failed ? "Audio no disponible. Reintentar activar sonido" : enabled ? "Desactivar sonido ambiental" : "Activar sonido ambiental"}>
    <span className={`nd-wave ${enabled ? "is-on" : ""}`} aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ "--i": i } as CSSProperties} />)}</span>
    <span>{failed ? "Reintentar audio" : `Sonido ${enabled ? "on" : "off"}`}</span>
  </button>;
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (location.hash) return;
    getLenis()?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  const index = Math.max(0, CHAPTERS.findIndex((c) => pathname === href(c.path)));
  const flight = useRef<Flight>({ chapter: index, progress: 0, side: 1, reading: 0, message: 0, revealed: false });
  return <SiteFrame tokens={TOKENS} className={`nd nd-world--${index}`}>
    <FlightContext.Provider value={flight}>
      <SmoothScroll key={"scroll:" + pathname} feel="cinematic" syncGsap={false} />
      <a className="nd-skip" href="#nd-content">Saltar al relato</a>
      <Stage flight={flight} chapter={index} />
      <header className="nd-header">
        <a className="nd-brand" href={href()} aria-label="Nádir, primera señal"><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M5 26V6L27 26V6M1 16H31" stroke="currentColor" strokeWidth="1.5" /><circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="0.65" /></svg><span>NÁDIR<small>EXPLORATION PROGRAM</small></span></a>
        <nav aria-label="Capítulos de la expedición">{CHAPTERS.map((chapter, i) => <a key={chapter.number} href={href(chapter.path)} aria-current={index === i ? "page" : undefined}><span>{chapter.number}</span><b>{chapter.title}</b></a>)}</nav>
        <SignalAudio />
      </header>
      <ScrollProgress placement="top" kind="bar" variant="minimal" size="sm" smooth={!useReducedMotion()} label="Avance del capítulo" className="nd-progress" />
      <div className="nd-route" key={pathname}>{children}</div>
    </FlightContext.Provider>
  </SiteFrame>;
}

function downloadLog() {
  const text = ["NÁDIR — Diario de expedición", "Relato de ficción · Demo de Trama", "", ...CHAPTERS.flatMap((c) => [c.title.toUpperCase(), c.intro, ...c.steps.map((s) => `${s.title.replace(/\n/g, " ")}\n${s.body}`), ""]), "MENSAJE RECUPERADO", "Mientras haya alguien capaz de asombrarse, no estaremos solos."].join("\n\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  const a = document.createElement("a"); a.href = url; a.download = "nadir-diario-de-expedicion.txt"; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Chapter({ index }: { index: number }) {
  const chapter = CHAPTERS[index];
  const flight = useContext(FlightContext)!;
  const list = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const [revealed, setRevealed] = useState(false);
  const updateReadout = useCallback(() => {
    const progress = flight.current.progress;
    const value = index === 2 ? Math.min(flight.current.revealed ? 100 : 99, Math.round(progress * 100)) : Math.round(progress * 100);
    if (readout.current) readout.current.textContent = `${String(value).padStart(3, "0")}%`;
  }, [flight, index]);
  const onFrame = useCallback(({ j, next, t }: StoryFrame) => {
    flight.current.chapter = index;
    const position = j + (next - j) * t;
    flight.current.progress = position / (chapter.steps.length + (index === 2 ? 1 : 0));
    flight.current.reading = Math.min(1, position);
    flight.current.message = index === 2 ? Math.max(0, position - chapter.steps.length) : 0;
    const sides = [1, 1, -1, 1];
    flight.current.side = sides[j] + (sides[next] - sides[j]) * t;
    updateReadout();
  }, [chapter.steps.length, flight, index, updateReadout]);
  useScrollStory(list, stage, { plateau: 0.7, cards: false, onFrame });
  useEffect(() => { flight.current.revealed = revealed; updateReadout(); }, [revealed, flight, updateReadout]);
  const enter = () => { scrollToAnchor("#nd-step-1", { duration: 1.4 }); };
  return <main ref={list} id="nd-content" className={`nd-chapter nd-chapter--${index}`} tabIndex={-1}>
    <div ref={stage} className="nd-readout"><span><i /> {chapter.telemetry}</span><span ref={readout}>000%</span></div>
    <section className="nd-opening" data-step>
      <div className="nd-topline"><span>EXPEDICIÓN N−07 / CAPÍTULO {chapter.number}</span><span>{chapter.coordinate}</span></div>
      <Hero kicker="" title={chapter.word} subtitle="" primaryCta="" secondaryCta="" badges="" backdrop="none" align="left" variant="minimal" className="nd-hero" />
      <div className="nd-opening-bottom">
        <div><p className="nd-deck">{chapter.sub}</p><p className="nd-intro">{chapter.intro}</p></div>
        <button type="button" className="nd-enter" onClick={enter}><span>Desliza para {index === 0 ? "escuchar" : index === 1 ? "descender" : "descubrir"}<small>EL RELATO SIGUE TU SCROLL</small></span><span className="nd-arrow" aria-hidden="true">↓</span></button>
      </div>
      <span className="nd-object-label" aria-hidden="true">FIG. N−07<br />{index === 0 ? "LA SEÑAL" : index === 1 ? "EL MECANISMO" : "LA MEMORIA"}<span>↗</span></span>
    </section>
    {chapter.steps.map((step, i) => <section key={step.label} id={`nd-step-${i + 1}`} className={`nd-story-step ${i % 2 ? "nd-story-step--right" : ""}`} data-step>
      <div className="nd-story-copy"><p className="nd-eyebrow">{step.label}</p><h2>{step.title}</h2><p className="nd-body">{step.body}</p><p className="nd-detail"><span aria-hidden="true">↳</span> {step.detail}</p></div>
      <div className="nd-measure" aria-label={`${step.value}, ${step.caption}`}><span>{step.value}</span><small>{step.caption}</small><div className="nd-measure-ticks" aria-hidden="true" /></div>
    </section>)}
    {index === 2 && <section className={`nd-message ${revealed ? "is-revealed" : ""}`} data-step aria-labelledby="nd-message-title">
      <p className="nd-eyebrow">ARCHIVO N−07 / DESTINATARIO: TÚ</p>
      <h2 id="nd-message-title">{revealed ? "Ya eres parte\nde la señal." : "Al otro lado,\nalguien escucha."}</h2>
      {!revealed && <Button label="Abrir el mensaje" glyph="↗" variant="minimal" emphasis="outline" size="lg" onClick={() => setRevealed(true)} />}
      <div className="nd-message-reveal" aria-live="polite">{revealed && <><p>«Mientras haya alguien capaz de asombrarse,<br />no estaremos solos.»</p><span className="nd-eyebrow">FIN DE LA TRANSMISIÓN. PRINCIPIO DE TODO LO DEMÁS.</span><Button label="Guardar el diario de expedición" glyph="↓" variant="minimal" emphasis="outline" onClick={downloadLog} /></>}</div>
    </section>}
    <section className="nd-next" aria-label="Continuar la expedición"><span className="nd-eyebrow">{index === 2 ? "TODA HISTORIA EMPIEZA POR ESCUCHAR" : `CONTINÚA LA EXPEDICIÓN / CAPÍTULO ${String(index + 2).padStart(2, "0")}`}</span><a href={href(chapter.next)}><span>{chapter.nextLabel}</span><span aria-hidden="true">↗</span></a><p>{index === 2 ? "Vuelve al lugar donde empezó todo." : index === 0 ? "La señal tiene un origen. Vamos a encontrarlo." : "El mecanismo se ha abierto. La historia acaba de empezar."}</p></section>
    <Footer brand="NÁDIR" tagline="Un relato sobre la necesidad de explorar." columns={`Expedición: La señal=${href()}, El descenso=${href("descenso")}, El hallazgo=${href("hallazgo")}`} social="" copyright="Expedición de ficción · Una experiencia de Trama · 2026" variant="minimal" className="nd-footer" />
  </main>;
}

export function Page({ path }: { path: string[] }) {
  const index = ROUTES.findIndex((r) => r.path === path.join("/"));
  return index < 0 ? null : <Chapter key={index} index={index} />;
}
