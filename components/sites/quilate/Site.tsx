"use client";

import { Fragment, createContext, useContext, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Preloader from "@/components/ui/Preloader";
import ActionBar from "@/components/ui/ActionBar";
import BeforeAfter from "@/components/ui/BeforeAfter";
import BentoGrid from "@/components/ui/BentoGrid";
import CookieBanner from "@/components/ui/CookieBanner";
import DatePicker from "@/components/ui/DatePicker";
import ExpandingPanels from "@/components/ui/ExpandingPanels";
import FAQSection from "@/components/ui/FAQSection";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import Hero from "@/components/ui/Hero";
import HorizontalScroll from "@/components/ui/HorizontalScroll";
import ImageReveal from "@/components/ui/ImageReveal";
import IslandNav from "@/components/ui/IslandNav";
import LightScroll from "@/components/ui/LightScroll";
import Marquee from "@/components/ui/Marquee";
import MetaTable from "@/components/ui/MetaTable";
import OpeningHours from "@/components/ui/OpeningHours";
import OptionPicker from "@/components/ui/OptionPicker";
import QRCode from "@/components/ui/QRCode";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { useScrollStory } from "@/lib/story/useScrollStory";
import TestimonialSection from "@/components/ui/TestimonialSection";
import TextField from "@/components/ui/TextField";
import { money } from "@/lib/commerce/money";
import { getLenis } from "@/lib/motion/lenis";
import { LIGHT_PRESETS, type LightPresetName } from "@/lib/ui/light";
import { phosphorLight } from "@/lib/ui/icons-phosphor-light";
import { photo } from "@/lib/sites/photos";
import { tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame, siteHref, useSiteNavigate } from "../shared";
import RingStage, { RingFlat } from "./RingStage";
import type { RingLook, RingPose } from "./ringScene";
import {
  BAND_SHANKS,
  CLASSIC_SOLITAIRE,
  KIT,
  KIT_BASE,
  PROCEDURAL_SHAPES,
  headShapes,
  kitPiece,
  CUSTOM_NOTICE,
  DEFAULT_BAND,
  DEFAULT_SOLITAIRE,
  ENGRAVE_MAX,
  FINISHES,
  FONTS,
  METALS,
  PROFILES,
  SETTINGS,
  SHAPES,
  SIZES,
  STONES,
  describe,
  mmToSize,
  priceLines,
  priceOf,
  sizeToMm,
  stoneOf,
  workDays,
  type RingSel,
} from "./ring";
import { ARCHIVE_SAMPLE, BRAND, CHAPTERS, FAQ, LEGAL, REASONS, REVIEWS, SERVICES, SLUG, appointmentSlots, jewelryJsonLd, type Ribbons } from "./data";
import "./quilate.css";

// noche cálida: tinta casi negra con un punto de sepia, hueso de texto y oro viejo de acento (G1 «lujo tranquilo» en oscuro)
const TOKENS: CSSProperties = tokensToStyle({
  bg: "#0e0c0a",
  fg: "#efe7da",
  mut: "#b2a796",
  acc: "#d2ae72",
  acc2: "#8fb2c4",
  card: "#1a1714",
  ln: "rgba(239,231,218,0.14)",
  r: 2,
  font: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
  display: 'var(--font-cormorant-garamond), Georgia, serif',
  accentFont: 'var(--font-cormorant-garamond), Georgia, serif',
});

const href = (p = "") => siteHref(SLUG, p);
const NAV = [
  { label: "Alianzas", path: "alianzas" },
  { label: "Compromiso", path: "compromiso" },
  { label: "Taller", path: "taller" },
  { label: "Tu talla", path: "talla" },
];

/** Para qué sirve cada luz (el rótulo fijo la nombra: la luz también es contenido). */
const LIGHT_LABEL: Record<LightPresetName, string> = {
  vitrina: "Vitrina · foco con destellos",
  fuego: "Fuego · foco duro que se mueve",
  honesta: "Luz de día · difusa y neutra",
  calida: "Luz cálida · interior",
  rasante: "Rasante · para leer el grabado",
  lampara: "Lámpara · para conversar",
  taller: "Flexo · para trabajar",
  lupa: "Lupa · frontal y uniforme",
  memoria: "Cálida · la luz de una casa",
};
const CUES = LIGHT_PRESETS as Record<LightPresetName, (typeof LIGHT_PRESETS)[LightPresetName]>;

/* ---------- estado compartido: las dos piezas, la que va a la cita y la luz forzada ---------- */
type Ctx = {
  band: RingSel;
  setBand: (s: RingSel) => void;
  sol: RingSel;
  setSol: (s: RingSel) => void;
  /** la pieza que se lleva la cita */
  carry: RingSel | null;
  setCarry: (s: RingSel | null) => void;
  /** luz que manda la página (un paso del configurador); null = la de la sección en pantalla */
  setCue: (c: LightPresetName | null) => void;
};
const QCtx = createContext<Ctx | null>(null);
const useQ = () => useContext(QCtx)!;
const KEY = "trama:quilate";

/** El perfil de un brillante: mesa, corona y pabellón; cada faceta se dibuja en su turno (`--i`). */
const FACETS = [
  "M-30 -34 L30 -34", // la mesa
  "M-30 -34 L-62 -14 M30 -34 L62 -14", // la corona
  "M-62 -14 L62 -14", // el filetín
  "M-62 -14 L0 66 M62 -14 L0 66", // el pabellón
  "M-30 -34 L-12 -14 L0 -34 L12 -14 L30 -34 M-62 -14 L-30 -34 M62 -14 L30 -34", // facetas de la corona
  "M-38 -14 L0 66 M-14 -14 L0 66 M14 -14 L0 66 M38 -14 L0 66", // facetas del pabellón
];
function CutLoading() {
  return (
    <svg className="ql-load" viewBox="-100 -100 200 200" aria-hidden>
      {FACETS.map((d, i) => (
        // estilos en línea: el dibujo sale bien antes de que llegue el CSS de la web (viene con su JS)
        <path key={i} d={d} pathLength={1} fill="none" stroke="var(--acc)" strokeWidth={0.9} strokeLinejoin="round" strokeDasharray={1} style={{ "--i": i, strokeDashoffset: `calc(1 - clamp(0, var(--p, 0) * 6.4 - ${i}, 1))` } as CSSProperties} />
      ))}
      <circle className="ql-load__spark" cx="22" cy="-30" r="3" fill="var(--fg)" style={{ opacity: "clamp(0, var(--p, 0) * 10 - 9, 1)" }} />
    </svg>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [band, setBand] = useState<RingSel>(DEFAULT_BAND);
  const [sol, setSol] = useState<RingSel>(DEFAULT_SOLITAIRE);
  const [carry, setCarry] = useState<RingSel | null>(null);
  const [cue, setCue] = useState<LightPresetName | null>(null);
  const path = usePathname();
  const navigate = useSiteNavigate();
  useEffect(() => {
    setCue(null);
  }, [path]);
  // las piezas sobreviven a recargar (sessionStorage), leídas tras montar para no desajustar la hidratación
  useEffect(() => {
    try {
      const s = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
      if (s?.band) setBand({ ...DEFAULT_BAND, ...s.band });
      if (s?.sol) setSol({ ...DEFAULT_SOLITAIRE, ...s.sol });
      if (s?.carry) setCarry(s.carry);
    } catch {
      /* sin almacenamiento */
    }
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ band, sol, carry }));
    } catch {
      /* nada */
    }
  }, [band, sol, carry]);
  const value = useMemo(() => ({ band, setBand, sol, setSol, carry, setCarry, setCue }), [band, sol, carry]);

  return (
    <SiteFrame tokens={TOKENS} className="ql" icons={{ set: phosphorLight, weight: "light" }}>
      {/* la carga: el brillante se talla faceta a faceta mientras bajan la escena y la luz (HDR) de las gemas */}
      <Preloader
        className="ql-pre"
        once="always"
        duration={1.4}
        exit="iris"
        label="Tallando la piedra"
        brand="Quilate"
        meta="Joyería a medida"
        assets={["/models/hdr/aerodynamics_workshop_1k.hdr"]}
        modules={[() => import("./ringScene")]}
        waitFor={{ root: ".ql-stage__gl", ready: ".is-on" }}
        art={<CutLoading />}
      />
      <QCtx.Provider value={value}>
        <LightScroll cues={CUES} initial="vitrina" cue={cue ?? undefined} duration={1.1}>
          {/* scroll con inercia (Lenis): aceleración y frenada largas, para que el recorrido del anillo se sienta continuo */}
          {/* la sensación cinematic (lerp 0,04, rueda × 0,85): la frenada es larga, con mucha cola al soltar la rueda */}
          <SmoothScroll feel="cinematic" syncGsap={false} />
          <PointerGlow />
          <a className="ql-skip" href="#contenido">Saltar al contenido</a>
          {/* navegación isla (como Arbor): píldora flotante con menú a pantalla completa, la marca y la cita */}
          <IslandNav
            className="ql-island"
            brandAlign="exact"
            leading={
              <FullscreenMenu
                brand="Quilate"
                openLabel="Abrir el menú"
                closeLabel="Cerrar el menú"
                trigger="burger"
                cover
                backdrop="blur"
                align="center"
                links={[{ label: "Inicio", href: href() }, ...NAV.map((n) => ({ label: n.label, href: href(n.path) })), { label: "Pedir cita", href: href("cita") }]}
                footer={[{ label: BRAND.phone, href: BRAND.phoneHref }, { label: "WhatsApp", href: BRAND.whatsappHref }, { label: BRAND.email, href: `mailto:${BRAND.email}` }]}
                note={`Quilate · taller de joyería · ${BRAND.city}`}
              />
            }
            brand={<a className="ql-brand" href={href()} aria-label="Quilate, inicio" onClick={toTopIfHome}>Quilate</a>}
            trailing={<a className="ql-island__cta" href={href("cita")}><span className="ql-island__long">Pedir </span>cita <span aria-hidden>→</span></a>}
          />
          <main id="contenido">{children}</main>
          <Footer />
        </LightScroll>
        <ActionBar
          actions={[
            { label: "Llamar", href: BRAND.phoneHref, icon: "phone" },
            { label: "WhatsApp", href: BRAND.whatsappHref, icon: "message" },
            { label: "Pedir cita", href: href("cita"), icon: "calendar", primary: true },
          ]}
          onNavigate={(h) => navigate({ href: h })}
          soft
          variant="minimal"
        />
        <CookieBanner storageKey="quilate-cookies" policyHref="#cookies" title="Cookies" text="Solo las necesarias para guardar tu diseño. Las de medición, si nos dejas." variant="minimal" />
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jewelryJsonLd(href())).replace(/</g, "\\u003c") }} />
      </QCtx.Provider>
    </SiteFrame>
  );
}

/** La marca en la portada: en vez de recargar la misma página, sube al principio (con Lenis, con su frenada). */
function toTopIfHome(e: { currentTarget: HTMLAnchorElement; preventDefault: () => void }) {
  const u = new URL(e.currentTarget.href, location.href);
  if (u.pathname !== location.pathname || u.search !== location.search || u.hash) return;
  e.preventDefault();
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(0, { duration: 1.4 });
  else scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * El puntero lleva luz: un halo cálido y grande que lo sigue con retraso y algo apartado (como una linterna en la mano, no un
 * cursor), por encima del fondo y por debajo del contenido. Solo con ratón y sin «reducir movimiento». El anillo 3D tiene
 * además su propia luz de puntero (ringScene).
 */
function PointerGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const goal = { x: innerWidth / 2, y: innerHeight / 2 };
    const pos = { ...goal };
    let on = 0;
    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016;
      last = t;
      const k = 1 - Math.exp(-dt * 3.2);
      // apartado del puntero, hacia arriba a la izquierda: la luz llega «desde la mano»
      pos.x += (goal.x - 70 - pos.x) * k;
      pos.y += (goal.y - 50 - pos.y) * k;
      el.style.setProperty("--gx", `${pos.x.toFixed(1)}px`);
      el.style.setProperty("--gy", `${pos.y.toFixed(1)}px`);
      el.style.setProperty("--go", String(on));
      raf = Math.abs(goal.x - 70 - pos.x) + Math.abs(goal.y - 50 - pos.y) > 0.5 ? requestAnimationFrame(tick) : 0;
      if (!raf) last = 0;
    };
    const move = (e: PointerEvent) => {
      goal.x = e.clientX;
      goal.y = e.clientY;
      on = 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const leave = () => {
      on = 0;
      el.style.setProperty("--go", "0");
    };
    addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);
  return <div ref={ref} className="ql-glow" aria-hidden />;
}

function Footer() {
  return (
    <footer className="ql-foot" data-light="memoria">
      <div className="ql-wrap ql-foot__grid">
        <div>
          <p className="ql-brand">Quilate</p>
          <p className="ql-mut">Taller de joyería en {BRAND.city}. Escuchamos, elegimos, damos forma, ajustamos, cuidamos, transformamos y archivamos.</p>
          <p className="ql-mut">
            <a href={BRAND.phoneHref}>{BRAND.phone}</a> · <a href={BRAND.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a> · <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
          </p>
        </div>
        <div>
          <p className="ql-label">El taller</p>
          <p className="ql-mut">{BRAND.address}<br />{BRAND.zone} · <a href={BRAND.map} target="_blank" rel="noopener noreferrer">Cómo llegar</a></p>
          <OpeningHours hours={BRAND.hours} exceptions={BRAND.exceptions} layout="compact" title="" />
        </div>
        <div>
          <p className="ql-label">Legal</p>
          <ul className="ql-list">
            {LEGAL.map((l) => (
              <li key={l.label}><a href={l.href}>{l.label}</a></li>
            ))}
            <li>
              <button type="button" className="ql-link" onClick={() => { try { localStorage.removeItem("quilate-cookies"); } catch { /* nada */ } location.reload(); }}>Configurar cookies</button>
            </li>
          </ul>
        </div>
      </div>
      <p className="ql-wrap ql-foot__small">
        {BRAND.legal} · Punzón {BRAND.hallmark} · Demo de Trama: no se cobra ni se encarga nada · <a href="/creditos">Créditos de las imágenes</a>
      </p>
    </footer>
  );
}

/* ---------- piezas comunes ---------- */
/** Conmutador de luz para mirar una pieza (GIA: verla con varias luces). Cambio explícito, nunca automático. */
function LightSwitch({ value, onChange, options }: { value: LightPresetName; onChange: (v: LightPresetName) => void; options: LightPresetName[] }) {
  return (
    <div className="ql-switch" role="radiogroup" aria-label="Luz para mirar la pieza">
      {options.map((o) => (
        <button key={o} type="button" role="radio" aria-checked={value === o} className="ql-chip" onClick={() => onChange(o)}>
          {LIGHT_LABEL[o].split(" · ")[0]} <small>{LIGHT_PRESETS[o].kelvin} K</small>
        </button>
      ))}
    </div>
  );
}

function PriceBox({ sel, onCita }: { sel: RingSel; onCita: () => void }) {
  const lines = priceLines(sel);
  const total = priceOf(sel);
  return (
    <div className="ql-sum">
      <dl className="ql-sum__lines">
        {lines.map((l) => (
          <div key={l.label}>
            <dt>{l.label}</dt>
            <dd>{l.amount ? money(l.amount, "EUR", "es-ES", true) : "gratis"}</dd>
          </div>
        ))}
      </dl>
      <p className="ql-sum__total"><span>Total, IVA incluido</span> <b>{money(total, "EUR", "es-ES", true)}</b></p>
      <p className="ql-mut">{workDays(sel)} días laborables de taller · señal del 30 % ({money(Math.round(total * 0.3), "EUR", "es-ES", true)}) al aprobar el boceto.</p>
      <p className="ql-note">{CUSTOM_NOTICE}</p>
      <button type="button" className="ql-btn ql-btn--block" onClick={onCita}>Pedir cita con esta pieza</button>
      <p className="ql-mut ql-center">La vemos juntos en el taller o por videollamada antes de empezar.</p>
    </div>
  );
}

/** El interior del aro con el grabado, iluminado con luz rasante: la luz llega por el lado del puntero. */
function Engraving({ sel }: { sel: RingSel }) {
  const ref = useRef<HTMLDivElement>(null);
  const font = FONTS.find((f) => f.value === sel.font)!;
  const metal = METALS.find((m) => m.value === sel.metal)!;
  const text = sel.engraving.trim() || "Tu grabado";
  return (
    <div
      ref={ref}
      className="ql-engrave"
      style={{ "--metal": metal.color, "--eng-font": font.css, "--rake": "0" } as CSSProperties}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (r) ref.current!.style.setProperty("--rake", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      }}
      aria-label={`Vista del grabado interior: ${text}`}
      role="img"
    >
      <span className="ql-engrave__lit" aria-hidden>{text}</span>
      <span className="ql-engrave__cut" aria-hidden>{text}</span>
      <span className="ql-engrave__mark" aria-hidden>750 · QLT</span>
    </div>
  );
}

/* ---------- inicio: la casa contada por sus siete servicios ---------- */
// el anillo del recorrido se monta con piezas del kit de Blender: aro de pavé y cesta de seis garras
const HERO_RING: RingSel = { ...DEFAULT_SOLITAIRE, metal: "amarillo", setting: "garras6", carat: 1, pave: true, shank: "aro-pave", head: "cabeza-6-garras", engraving: "Para ti · siempre" };

/** Pose completa a partir de lo que cambia (lo demás, en reposo). */
const P = (p: Partial<RingPose>): RingPose => ({ explode: 0, head: 0, engrave: 0, pave: 0, yaw: 0, x: 0, y: 0, zoom: 1, solo: 0, trio: 0, face: 0, gem: 0, ...p });
type Scene = { kind: "photo" | "velvet" | "rake" | "lightbox" | "lamp"; photo?: number };
type Companions = { sel: RingSel; side: -1 | 1 }[];
// la pieza que sale de una herencia (capítulo «Transformar» y su interludio)
const ROSE_RING: RingSel = { ...HERO_RING, metal: "rosa", head: "cabeza-bisel", shank: "aro-afinado" };
/** Trío tras «Elegir»: las tres gemas de la casa (diamante en el centro, zafiro y esmeralda a los lados). */
const TRIO_GEMS: Companions = [
  { side: -1, sel: { ...HERO_RING, metal: "blanco", stone: "zafiro", shape: "oval", head: "cabeza-oval-4-garras", shank: "aro-liso-confort", pave: false, engraving: "" } },
  { side: 1, sel: { ...HERO_RING, stone: "esmeralda", shape: "esmeralda", head: "cabeza-4-garras", shank: "aro-afinado", pave: false, engraving: "" } },
];
/** Trío del final: los oros de la casa (amarillo en el centro, blanco con halo y rosa a los lados). */
const TRIO_METALS: Companions = [
  { side: -1, sel: { ...HERO_RING, metal: "blanco", head: "cabeza-halo-redondo", shank: "aro-catedral", engraving: "" } },
  { side: 1, sel: { ...HERO_RING, metal: "rosa", head: "cabeza-4-garras", shank: "aro-torsade", engraving: "" } },
];

/**
 * Escena de scrollytelling (docs/19 §7): portada, prólogo y, por cada capítulo, un **cuadro** (un solo anillo, a un lado,
 * enseñando el detalle del que habla) seguido de un **interludio** largo sin cuadro: dos cintas de texto (una detrás del
 * lienzo y otra delante) mientras el anillo hace otra cosa en el centro (composiciones `centro`, `trío`, `frente` y
 * `macro`). El recorrido acaba en un interludio. Entre pasos todo se interpola con la posición del scroll (no con el
 * tiempo), así que hacia atrás deshace exactamente lo mismo. Los cuadros son los puntos de control de siempre.
 */
type Beat = {
  pose: RingPose;
  /** la sala detrás del anillo (como las escenas de Oryzo), fundida con la siguiente al ritmo del scroll */
  scene: Scene;
  /** capítulo del cuadro, o el que cierra el interludio (−1 = portada y prólogo) */
  chapter: number;
  kind: "hero" | "intro" | "card" | "interlude";
  /** composición del interludio (la hace la pose; se apunta para leer el guion) */
  layout?: "centro" | "trío" | "frente" | "macro";
  /** aspecto del anillo en los interludios (en los cuadros manda el capítulo) */
  look?: RingLook;
  sel?: RingSel;
  /** líneas técnicas: rotulan el detalle que enseña el cuadro */
  hud?: { r: number; labels: string[] };
};
const BEATS: Beat[] = [
  { kind: "hero", chapter: -1, pose: P({ head: 1.8, y: 0.1, solo: 1 }), scene: { kind: "velvet" } }, // solo la piedra, centrada
  { kind: "intro", chapter: -1, pose: P({ x: 0.2, zoom: 0.85 }), scene: { kind: "photo", photo: 13 } }, // el anillo entero, a la derecha del manifiesto (en móvil, delante)
  // 01 Escuchar: el boceto en alambre → interludio: en el centro, el boceto se hace oro mientras gira
  { kind: "card", chapter: 0, pose: P({ yaw: 0.7, x: 0.22 }), scene: { kind: "lamp", photo: 5 } },
  { kind: "interlude", chapter: 0, layout: "centro", look: "final", pose: P({ yaw: 2.3, zoom: 0.76, y: -0.03 }), scene: { kind: "lamp", photo: 5 } },
  // 02 Elegir: la piedra sola, de cerca → interludio: trío de gemas (zafiro, diamante, esmeralda)
  // `gem`: al llegar a «Elegir», el engarce y el aro se van en niebla y queda la piedra
  { kind: "card", chapter: 1, pose: P({ explode: 0.822, head: 0.5, yaw: 1.1, x: -0.2, gem: 1 }), scene: { kind: "velvet" }, hud: { r: 168, labels: ["57 facetas", "brillante · 1,00 ct", "fuego: luz en colores"] } },
  { kind: "interlude", chapter: 1, layout: "trío", look: "final", pose: P({ trio: 1, yaw: 2.6, zoom: 1.14, y: 0.03 }), scene: { kind: "velvet" } },
  // 03 Dar forma: las tres piezas separadas → interludio: el aro de frente, como una «O»; la cinta de detrás pasa por el hueco
  { kind: "card", chapter: 2, pose: P({ explode: 1, yaw: 1.9, x: 0.2, zoom: 0.9 }), scene: { kind: "photo", photo: 1 }, hud: { r: 150, labels: ["3 piezas", "piedra · 1,00 ct", "montura · 6 garras", "aro · pavé · oro 750"] } },
  { kind: "interlude", chapter: 2, layout: "frente", look: "final", pose: P({ face: 1, zoom: 0.96, y: -0.04 }), scene: { kind: "rake" } },
  // 04 Ajustar: dentro del aro (la «O» de antes, de cerca) → interludio: la cámara sale y el anillo gira en el centro
  { kind: "card", chapter: 3, pose: P({ engrave: 1, x: -0.18, y: 0.1 }), scene: { kind: "rake" }, hud: { r: 220, labels: ["Talla 14", "Ø 17,2 mm · 54 mm", "grabado a buril", "punzón 750 · QLT"] } },
  { kind: "interlude", chapter: 3, layout: "centro", look: "final", pose: P({ yaw: 3.1, zoom: 0.8, y: -0.03 }), scene: { kind: "rake" } },
  // 05 Cuidar: el pavé apagado → interludio: el mismo pavé, limpio y centrado, llenando la pantalla
  { kind: "card", chapter: 4, pose: P({ pave: 1, yaw: 0.35, x: 0.2 }), scene: { kind: "lightbox" }, hud: { r: 100, labels: ["Pavé · 1,3 mm", "grasa: la luz no entra", "ultrasonidos · 20 min"] } },
  { kind: "interlude", chapter: 4, layout: "macro", look: "final", pose: P({ pave: 1, yaw: 0.95 }), scene: { kind: "lightbox" } },
  // 06 Transformar: el bisel nuevo → interludio: la pieza se abre en el centro (piedra, bisel y aro)
  { kind: "card", chapter: 5, sel: ROSE_RING, pose: P({ head: 0.4, yaw: 3.4, x: -0.12 }), scene: { kind: "photo", photo: 7 }, hud: { r: 295, labels: ["Bisel", "oro rosa 750", "la piedra de antes"] } },
  { kind: "interlude", chapter: 5, layout: "centro", look: "final", sel: ROSE_RING, pose: P({ explode: 0.75, yaw: 4.3, zoom: 0.84 }), scene: { kind: "photo", photo: 7 } },
  // 07 Heredar: el anillo acabado, con su ficha → final: trío de los oros de la casa
  { kind: "card", chapter: 6, pose: P({ head: 0.92, yaw: 4.4, x: 0.18 }), scene: { kind: "photo", photo: 8 }, hud: { r: 150, labels: ["Ficha nº 0000", "oro 750 · 1,00 ct", "punzón QLT · GIA"] } },
  { kind: "interlude", chapter: 6, layout: "trío", look: "final", pose: P({ trio: 1, yaw: 5.3, zoom: 1.14, y: 0.03 }), scene: { kind: "photo", photo: 8 } },
];
const MANIFESTO = "No te contamos nuestra historia. Te enseñamos lo que hacemos con la tuya: siete gestos, siete luces, un anillo que se abre y se vuelve a cerrar delante de ti.";
const MANIFESTO_WORDS = MANIFESTO.split(" ");
const POSE_KEYS = ["explode", "head", "engrave", "pave", "yaw", "x", "y", "zoom", "solo", "trio", "face", "gem"] as const;
/** el paso del cuadro de cada capítulo */
const cardStep = (c: number) => BEATS.findIndex((b) => b.kind === "card" && b.chapter === c);
/** palabras sueltas con su índice, para que el titular se monte palabra a palabra con el scroll */
const words = (t: string) =>
  t.split(" ").map((w, i) => (
    <Fragment key={i}>
      <span className="ql-w" style={{ "--i": i } as CSSProperties}>{w}</span>{" "}
    </Fragment>
  ));

function Home() {
  const [active, setActive] = useState(0);
  const [clean, setClean] = useState(false);
  const list = useRef<HTMLOListElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLParagraphElement>(null);
  const pose = useRef<RingPose>({ ...BEATS[0].pose });
  // desplazamiento lateral añadido a cada paso (fracción del ancho) para que el círculo de las líneas técnicas no toque el
  // cuadro: lo mide el efecto del HUD con el tamaño de pantalla real (solo escritorio); los radios no se tocan
  const shiftX = useRef<number[]>(BEATS.map(() => 0));
  // dónde enseña la cámara el detalle del paso (lo escribe la escena): en móvil, las líneas técnicas se centran ahí
  const focus = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    if (!matchMedia("(max-width: 899px)").matches) return;
    let raf = 0, fx = -1, fy = -1;
    const tick = () => {
      const f = focus.current, st = sticky.current?.style;
      if (f && st && (Math.abs(f.x - fx) > 0.002 || Math.abs(f.y - fy) > 0.002)) {
        fx = f.x;
        fy = f.y;
        st.setProperty("--fx", fx.toFixed(4));
        st.setProperty("--fy", fy.toFixed(4));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  // la pose sale de dónde está la línea media de la ventana entre los centros de dos pasos (el motor del kit,
  // `useScrollStory`, con la sensación cinematic: meseta del 30 % y una S; docs/42). El motor publica también el progreso,
  // el peso de cada escena (--w), las cintas (--r, --o) y los cuadros que se disuelven; aquí va lo propio de Quilate
  useScrollStory(list, sticky, {
    feel: "cinematic",
    onFrame: ({ j, t, centers, mid }) => {
      const a = BEATS[j].pose;
      const b = BEATS[Math.min(j + 1, BEATS.length - 1)].pose;
      const p = pose.current;
      for (const k of POSE_KEYS) p[k] = (a[k] ?? 0) + ((b[k] ?? 0) - (a[k] ?? 0)) * t;
      p.x += shiftX.current[j] * (1 - t) + (shiftX.current[Math.min(j + 1, BEATS.length - 1)] ?? 0) * t;
      // en pantallas estrechas el anillo va centrado en la mitad de arriba (los cuadros, debajo) y los acercamientos son
      // más abiertos: el lienzo es estrecho y una piedra «de cerca» lo llenaría entero
      if (innerWidth < 900) {
        p.x = 0;
        // la piedra sola de la portada, centrada en la mitad de arriba (llena el ancho y no debe cortarla el borde del lienzo)
        p.y = 0;
        // en «Elegir» (de cerca y con la piedra fuera de la cesta) la piedra sube hacia la cámara y se saldría del lienzo
        // estrecho: sale menos (el despiece sin `head`, como «Dar forma», queda igual)
        p.explode *= Math.max(0, 1 - 1.4 * p.head);
        // de cerca, más abierto (el lienzo es estrecho), salvo la piedra sola de la portada, que llena el ancho
        p.head *= 0.3 + 0.7 * p.solo;
        p.pave *= 0.55;
        p.zoom *= 1.08 - 0.22 * p.trio;
      }
      const st = sticky.current?.style;
      st?.setProperty("--ring-x", p.x.toFixed(3));
      // cuánto «interludio» hay ahora (0 en un cuadro, 1 en un interludio): en móvil el anillo baja al centro sin cuadro
      const il = (k: number) => (BEATS[k]?.kind === "interlude" ? 1 : 0);
      st?.setProperty("--ilv", (il(j) * (1 - t) + il(j + 1) * t).toFixed(3));
      // cuánto queda del último paso: el fundido inferior crece en el tramo final
      const last = centers[centers.length - 1];
      st?.setProperty("--story-end", Math.min(1, Math.max(0, (mid - last) / (innerHeight * 0.5))).toFixed(3));
    },
  });
  // el paso activo (para el aspecto del anillo, la palabra gigante y el índice)
  const [step, setStep] = useState(0);
  useEffect(() => {
    const items = Array.from(list.current?.querySelectorAll<HTMLElement>("[data-step]") ?? []);
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = Number(e.target.getAttribute("data-step"));
          setStep(i);
          setActive(Math.max(0, BEATS[i].chapter));
        }),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, []);
  // saltar a un capítulo desde el índice: con Lenis, su propia animación (larga y con frenada); si no, la del navegador
  const go = (i: number) => {
    const el = list.current?.querySelector<HTMLElement>(`[data-step="${i}"]`);
    if (!el) return;
    const lenis = getLenis();
    const y = scrollY + el.getBoundingClientRect().top + el.offsetHeight / 2 - innerHeight / 2;
    if (lenis) lenis.scrollTo(y, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    else scrollTo({ top: y, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const ch = CHAPTERS[active];
  const beat = BEATS[step];
  const look = beat.kind !== "card" ? beat.look ?? "final" : ch.id === "cuidar" && clean ? "final" : ch.look;
  const sel = beat.sel ?? HERO_RING;
  // los acompañantes del trío: las gemas hasta «Cuidar», los oros después (cambian cuando no se ven); solo en pantallas
  // anchas con ratón (en móvil el lienzo es estrecho y el trío no cabe)
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(min-width: 900px) and (pointer: fine)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const companions = wide ? (step < cardStep(4) ? TRIO_GEMS : TRIO_METALS) : undefined;
  // rótulos de las líneas técnicas: a 28 px del borde del cuadro, en el hueco que deja con el centro del anillo (en
  // unidades del viewBox del HUD). Si el hueco no da para el texto, no se pintan (el cuadro ya cuenta lo mismo)
  const [hudX, setHudX] = useState<(number | null)[]>([]);
  useEffect(() => {
    const st = sticky.current;
    const hud = st?.querySelector<SVGSVGElement>(".ql-hud");
    if (!st || !hud) return;
    const place = () => {
      const unit = hud.getBoundingClientRect().width / 400 || 1;
      const W = st.clientWidth, o = st.getBoundingClientRect().left;
      // 1) cuánto apartar el anillo (y con él el HUD) para que el círculo, su anillo fino y sus cotas (r + 40) queden a 16 px
      //    del cuadro como mínimo
      shiftX.current = BEATS.map((b, k) => {
        const card = st.querySelector<HTMLElement>(`[data-card="${k}"] .ql-step__card`);
        if (!b.hud || !card || innerWidth < 900) return 0;
        const r = card.getBoundingClientRect();
        const ring = W * (0.5 + b.pose.x), reach = (b.hud.r + 40) * unit + 16;
        const need = b.pose.x > 0 ? r.right - o - (ring - reach) : ring + reach - (r.left - o);
        return need > 0 ? (b.pose.x > 0 ? need : -need) / W : 0;
      });
      dispatchEvent(new Event("resize"));
      // 2) los rótulos, con el anillo ya en su sitio
      setHudX(
        BEATS.map((b, k) => {
          const card = st.querySelector<HTMLElement>(`[data-card="${k}"] .ql-step__card`);
          if (!b.hud || !card || innerWidth < 900) return null;
          const ring = W * (0.5 + b.pose.x + shiftX.current[k]);
          // el desplazamiento del cuadro es solo vertical: su caja vale para el borde
          const r = card.getBoundingClientRect();
          const edge = b.pose.x > 0 ? r.right - o + 28 : r.left - o - 28;
          return Math.abs(edge - ring) < 180 ? null : (edge - ring) / unit;
        }),
      );
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(st);
    return () => ro.disconnect();
  }, []);
  // el manifiesto, lo más grande que quepa en la pantalla (búsqueda binaria del cuerpo sobre la caja de `ql-intro`)
  useEffect(() => {
    const el = intro.current;
    if (!el) return;
    const fit = () => {
      let lo = 16, hi = 400;
      while (hi - lo > 1) {
        const m = (lo + hi) / 2;
        el.style.fontSize = `${m}px`;
        if (el.scrollHeight <= el.clientHeight && el.scrollWidth <= el.clientWidth) lo = m;
        else hi = m;
      }
      el.style.fontSize = `${lo}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);
  // las cintas de una capa: `back` se pinta antes del lienzo (el anillo pasa por delante) y `front` después. Solo en los
  // interludios, una en cada capa, una arriba y otra abajo y en sentidos contrarios
  const ribbons = (layer: keyof Omit<Ribbons, "flip">) => (
    <div className={`ql-ribbons ql-ribbons--${layer}`} aria-hidden>
      {BEATS.map((b, k) => {
        if (b.kind !== "interlude") return null;
        const it = CHAPTERS[b.chapter].interlude;
        const top = (layer === "back") !== !!it.flip;
        return (
          <p key={k} className="ql-ribbon" data-pos={top ? "top" : "bottom"} style={{ "--r": `var(--r${k}, -1)`, "--o": `var(--o${k}, 0)`, "--dir": top ? 1 : -1 } as CSSProperties}>
            {[0, 1, 2].map((n) => (
              <span key={n}>{it[layer]}<i> ✦ </i></span>
            ))}
          </p>
        );
      })}
    </div>
  );

  return (
    <>

      <section className="ql-story" aria-label="Lo que hacemos, en siete servicios">
        <div className="ql-story__sticky" ref={sticky}>
          <div className="ql-scenes" aria-hidden>
            {BEATS.map(({ scene: sc }, k) => (
              <div key={k} className={`ql-scene ql-scene--${sc.kind}`} style={{ "--w": `var(--w${k}, ${k === 0 ? 1 : 0})`, ...(sc.photo != null ? { backgroundImage: `url(${photo("joyeria", sc.photo).src})` } : {}) } as CSSProperties} />
            ))}
            <div className="ql-scenes__vignette" />
          </div>
          {/* los cuadros, por debajo del lienzo: suben con el scroll, llegan desde abajo desenfocados y se van por arriba,
              por detrás del anillo, igual (el desenfoque crece con la distancia a la línea media, como un tilt-shift) */}
          <div className="ql-cards">
            {BEATS.map((b, k) => {
              if (b.kind !== "card") return null;
              const c = CHAPTERS[b.chapter];
              return (
                <div key={k} className="ql-card" data-card={k} data-side={b.pose.x > 0 ? "left" : "right"}>
                <div className="ql-step__card">
                  <span className="ql-step__num" aria-hidden>{c.k}</span>
                  <p className="ql-chapter__k">
                    <span className="ui-sr">{c.k} · </span>
                    {c.title}
                    <span className="ql-chapter__kelvin" aria-hidden>{c.why.split(" · ")[1]}</span>
                  </p>
                  <h2 className="ql-h2 ql-step__thesis">{words(c.thesis)}</h2>
                  {/* el «cómo» se ve en grande en las cintas del interludio; aquí queda entero para lectores de pantalla */}
                  <p className="ui-sr">{c.how}</p>
                  <p className="ql-chapter__what">{c.what}</p>
                  {c.id === "cuidar" && (
                    <button type="button" className="ql-chip" aria-pressed={clean} onClick={() => setClean((v) => !v)}>
                      {clean ? "Ver cómo llegó" : "Limpiar la pieza"}
                    </button>
                  )}
                  {c.id === "heredar" && (
                    // en el cuadro, el QR del estuche; la ficha de ejemplo se despliega (lo que enumera la cinta)
                    <div className="ql-step__qr">
                      <QRCode value="https://quilate.example/archivo/0000" shape="rounded" codeSize={84} caption="" />
                      <p>El QR del estuche abre la ficha de la pieza.</p>
                      <details className="ql-step__ficha">
                        <summary>Ver una ficha de ejemplo</summary>
                        <MetaTable rows={ARCHIVE_SAMPLE.split("\n").map((l) => ({ k: l.split("|")[0], v: l.split("|")[1] }))} />
                      </details>
                    </div>
                  )}
                  <div className="ql-step__foot">
                    <a className="ql-link ql-chapter__cta" href={href(c.cta.href)}>{c.cta.label} →</a>
                    <p className="ql-chapter__light"><span aria-hidden>◐</span> Luz: {c.why}</p>
                  </div>
                </div>
                </div>
              );
            })}
          </div>
          <svg className="ql-hud" viewBox="-200 -200 400 400" aria-hidden>
            <defs>
              <filter id="ql-veil-soft" x="-20%" y="-60%" width="140%" height="220%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
              {(["l", "r"] as const).map((d) => (
                <linearGradient key={d} id={`ql-veil-${d}`} x1={d === "l" ? 0 : 1} x2={d === "l" ? 1 : 0} y1={0} y2={0}>
                  <stop offset="0" style={{ stopColor: "var(--bg)", stopOpacity: 0.55 }} />
                  <stop offset="0.7" style={{ stopColor: "var(--bg)", stopOpacity: 0.3 }} />
                  <stop offset="1" style={{ stopColor: "var(--bg)", stopOpacity: 0 }} />
                </linearGradient>
              ))}
            </defs>
            {BEATS.map(({ hud: h, pose: bp }, k) => h && (
              <g key={k} className="ql-hud__g" style={{ "--w": `var(--w${k}, 0)` } as CSSProperties}>
                <circle r={h.r} pathLength={1} />
                <circle r={h.r + 14} pathLength={1} className="ql-hud__thin" />
                <line x1={-h.r - 40} y1={0} x2={-h.r - 8} y2={0} pathLength={1} />
                <line x1={h.r + 8} y1={0} x2={h.r + 40} y2={0} pathLength={1} />
                <line x1={0} y1={-h.r - 40} x2={0} y2={-h.r - 8} pathLength={1} />
                {/* los datos van en el hueco entre el anillo y el cuadro, pegados al cuadro (no dependen del radio del círculo) */}
                {hudX[k] != null && (() => {
                  // velo detrás de los datos (caen sobre el metal o el pavé): sin caja, un degradado que se apaga hacia el
                  // anillo y un filo de oro del lado del cuadro, como una cota más. Ancho aproximado por carácter de la mono
                  const w = Math.max(...h.labels.map((l, i) => l.length * (i === 0 ? 8.2 : 6.2))) + 40;
                  const y = -h.r * 0.55 - 18, hh = h.labels.length * 15 + 14, left = bp.x > 0;
                  const x0 = left ? hudX[k]! - 12 : hudX[k]! + 12;
                  return (
                    <>
                      <rect className="ql-hud__veil" x={left ? x0 : x0 - w} y={y} width={w} height={hh} fill={`url(#ql-veil-${left ? "l" : "r"})`} filter="url(#ql-veil-soft)" />
                      <line className="ql-hud__edge" x1={x0} y1={y + 2} x2={x0} y2={y + hh - 2} pathLength={1} />
                    </>
                  );
                })()}
                {hudX[k] != null && h.labels.map((l, i) => (
                  <text key={i} x={hudX[k]!} y={-h.r * 0.55 + i * 15} textAnchor={bp.x > 0 ? "start" : "end"} className={i === 0 ? "ql-hud__big" : ""}>{l}</text>
                ))}
              </g>
            ))}
          </svg>
          {ribbons("back")}
          {/* el prólogo: el manifiesto a pantalla completa, detrás del anillo, y se rellena palabra a palabra con el scroll */}
          <p className="ql-intro" ref={intro} aria-hidden style={{ "--n": MANIFESTO_WORDS.length } as CSSProperties}>
            {MANIFESTO_WORDS.map((w, i) => (
              <Fragment key={i}>
                <span style={{ "--i": i } as CSSProperties}>{w}</span>{" "}
              </Fragment>
            ))}
          </p>
          <RingStage sel={sel} look={look} pose={pose} focus={focus} companions={companions} motionFx height="100%" alt={step === 0 ? "Un diamante talla brillante, de cerca, girando bajo un foco" : step === 1 ? "El anillo de la casa, entero" : `El anillo en el capítulo «${ch.title}»`} className="ql-story__ring" />
          {ribbons("front")}
          <nav className="ql-story__rail" aria-label="Capítulos">
            {CHAPTERS.map((c, i) => (
              <button key={c.id} type="button" aria-current={beat.chapter === i ? "step" : undefined} onClick={() => go(cardStep(i))}>
                <span>{c.k}</span> <b>{c.title}</b>
              </button>
            ))}
          </nav>
          <span className="ql-story__bar" aria-hidden />
        </div>
        <ol className="ql-story__steps" ref={list}>
          <li data-step={0} data-light="vitrina" className="ql-step ql-step--hero" data-side="center">
            <div className="ql-step__hero">
            <Hero
              align="center"
              backdrop="none"
              variant="minimal"
              kicker={`Orfebres en ${BRAND.city}`}
              title="Joyas hechas a mano en nuestro taller."
              subtitle="Anillos de compromiso, alianzas y piezas a medida: las dibujamos contigo, fundimos el oro, engastamos cada piedra y las pulimos en nuestro propio banco."
              primaryCta="Pedir cita en el taller"
              primaryHref={href("cita")}
              secondaryCta="Diseñar un solitario"
              secondaryHref={href("compromiso")}
              badges={`★ ${BRAND.rating.value.toLocaleString("es-ES").replace(",", "\\,")} · ${BRAND.rating.count} reseñas en Google, Precio cerrado antes de empezar, Taller propio`}
              className="ql-step__herokit"
            />
            </div>
          </li>
          <li data-step={1} data-light="vitrina" className="ql-step ql-step--intro" data-side="left">
            {/* el manifiesto se ve en el escenario (`ql-intro`); aquí queda para lectores de pantalla */}
            <p className="ui-sr">{MANIFESTO}</p>
          </li>
          {BEATS.map((b, k) => {
            if (b.kind === "interlude") {
              // interludio: sin cuadro, solo recorrido (las cintas y el anillo van en el escenario); toma la luz del siguiente
              const next = CHAPTERS[b.chapter + 1];
              return <li key={k} data-step={k} data-light={next?.light ?? "vitrina"} className="ql-step ql-step--interlude" aria-hidden />;
            }
            if (b.kind !== "card") return null;
            const c = CHAPTERS[b.chapter];
            // el cuadro se pinta en el escenario (detrás del anillo); el paso solo marca el recorrido y el ancla del capítulo
            return <li key={c.id} id={c.id} data-step={k} data-light={c.light} className="ql-step ql-step--card" aria-hidden />;
          })}
        </ol>
      </section>

      {/* tras el recorrido: el oficio en una cinta, los caminos en paneles que se abren, el taller en un recorrido horizontal
          de fotos que se descubren y las garantías en una rejilla bento con fotos */}
      <div className="ql-band" data-light="taller" aria-hidden>
        <Marquee text="Hecho a mano en Valencia · Oro 750 · Platino 950 · Engaste garra a garra · Grabado a buril · Piedras certificadas" separator="✦" rows={1} duration={48} fontSize={40} variant="minimal" tone="fg" edgeFade pauseOnHover={false} className="ql-band__m" />
      </div>

      <section className="ql-wrap ql-sec" data-light="vitrina">
        <div className="ql-sechead">
          <p className="ql-kicker">Cuatro maneras de empezar</p>
          <h2 className="ql-h2">¿Qué quieres que hagamos?</h2>
          <p className="ql-mut">Todas con precio cerrado, plazo dicho y cita antes de fundir nada.</p>
        </div>
        <ExpandingPanels
          height="min(68svh, 560px)"
          grow={3.2}
          className="ql-paths"
          panels={[
            { title: "Alianzas", meta: "Metal, ancho, perfil y grabado · 12 días", image: photo("joyeria", 11).src, alt: "Anillo de oro con piedras de colores engastadas en el aro", href: href("alianzas") },
            { title: "Compromiso", meta: "Solitario con piedra certificada · 4 a 6 semanas", image: photo("joyeria", 12).src, alt: "Anillo de oro con zafiros, esmeralda y diamantes engastados en línea", href: href("compromiso") },
            { title: "A medida", meta: "Del boceto a la pieza, contigo en el taller", image: photo("joyeria", 1).src, alt: "Joyas hechas a mano sobre la mesa de un orfebre", href: href("cita") },
            { title: "Transformar", meta: "Una joya heredada, rehecha para hoy", image: photo("joyeria", 10).src, alt: "Anillo antiguo de oro con una piedra azul", href: href("taller") },
          ]}
        />
      </section>

      <section className="ql-gal" data-light="taller" aria-label="El taller, en fotos">
        <div className="ql-wrap ql-sechead">
          <p className="ql-kicker">Del banco a la vitrina</p>
          <h2 className="ql-h2">Así se hace una joya.</h2>
        </div>
        <HorizontalScroll gap={28} minWidth={900} className="ql-gal__hs">
          {[
            { i: 5, from: "bottom", cap: "El banco", t: "Flexo, limas y cera: aquí empieza todo.", alt: "Banco de joyero con flexo, limas y piezas a medio hacer" },
            { i: 4, from: "left", cap: "La fundición", t: "El oro se funde y se vierte en el molde.", alt: "Molde de piedra para fundir joyas" },
            { i: 0, from: "top", cap: "El hilo", t: "Torcido y soldado a mano, vuelta a vuelta.", alt: "Joyas de hilo de metal retorcido" },
            { i: 6, from: "bottom", cap: "El esmalte", t: "Color al fuego entre oro y piedra.", alt: "Cadena de oro con piedras y esmalte" },
            { i: 1, from: "left", cap: "La mesa", t: "Cada pieza, terminada a mano antes de salir.", alt: "Joyas hechas a mano sobre la mesa de un orfebre" },
            { i: 11, from: "bottom", cap: "El engaste", t: "Piedra a piedra, garra a garra, con lupa.", alt: "Anillo de oro con piedras de colores engastadas en el aro" },
            { i: 9, from: "right", cap: "El oficio", t: "Dos mil años haciendo anillos igual: a mano.", alt: "Anillo romano de oro" },
            { i: 10, from: "top", cap: "La herencia", t: "Una joya antigua se puede rehacer sin perder su historia.", alt: "Anillo medieval de oro con una piedra azul" },
            { i: 8, from: "bottom", cap: "El museo", t: "Lo bien hecho dura siglos.", alt: "Corona de hojas de laurel en oro en una vitrina de museo" },
            { i: 7, from: "center", cap: "La vitrina", t: "Y al final, la luz que la hace brillar.", alt: "Vitrina con brazaletes de oro iluminados" },
          ].map((f, n) => (
            <figure key={f.i} className="ql-gal__panel" data-tall={n % 2 === 0 ? "" : undefined}>
              <ImageReveal src={photo("joyeria", f.i).src} alt={f.alt} ratio={n % 2 === 0 ? "4 / 5" : "5 / 4"} from={f.from as never} zoom={1.2} />
              <figcaption>
                <span className="ql-gal__n">{String(n + 1).padStart(2, "0")}</span>
                <b>{f.cap}</b>
                <span>{f.t}</span>
              </figcaption>
            </figure>
          ))}
        </HorizontalScroll>
      </section>

      <section className="ql-wrap ql-sec" data-light="lupa">
        <div className="ql-sechead">
          <p className="ql-kicker">Por qué fiarte</p>
          <h2 className="ql-h2">Lo que firmamos con cada pieza.</h2>
        </div>
        <BentoGrid
          columns={4}
          variant="minimal"
          className="ql-bento"
          cells={[
            { title: "Contraste y punzón", text: "Cada pieza lleva la ley del metal y nuestro punzón, como pide la ley de metales preciosos.", stat: "750", span: "2x1", image: photo("joyeria", 8).src },
            { title: "Piedras certificadas", text: "GIA o IGI en diamantes; origen y tratamiento declarados en piedras de color.", stat: "GIA", span: "1x2", image: photo("joyeria", 12).src },
            { title: "Precio cerrado", text: "El desglose que ves es el que pagas. Sin «desde» al final.", span: "1x1" },
            { title: "De por vida", text: "Limpieza y revisión gratis; ajuste de talla gratis el primer año.", stat: "∞", span: "1x1" },
            { title: "Hecho aquí", text: "Sin intermediarios: lo que encargas se dibuja, funde y engasta en el taller.", span: "2x1", image: photo("joyeria", 5).src },
          ]}
        />
      </section>

      <div data-light="memoria">
        <TestimonialSection kicker="" title="Lo que cuentan al recogerla" subtitle="" items={REVIEWS} rating={BRAND.rating.value} count={BRAND.rating.count} source={BRAND.rating.source} align="left" variant="minimal" className="ql-reviews" />
      </div>

      <section className="ql-wrap ql-sec" data-light="lampara">
        <FAQSection kicker="Antes de venir" title="Preguntas frecuentes" subtitle="" items={FAQ} variant="minimal" />
      </section>

      <section className="ql-wrap ql-sec ql-cta" data-light="lampara">
        <h2 className="ql-h2">Empieza por una conversación.</h2>
        <p className="ql-lead">Una hora en el taller o por videollamada. Trae lo que tengas: una idea, una foto, una joya heredada.</p>
        <div className="ql-row">
          <a className="ql-btn" href={href("cita")}>Pedir cita</a>
          <a className="ql-btn ql-btn--ghost" href={BRAND.whatsappHref} target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a>
        </div>
      </section>
    </>
  );
}

/* ---------- alianzas: la pieza sencilla ---------- */
function Bands() {
  const { band, setBand, setCarry, setCue } = useQ();
  const navigate = useSiteNavigate();
  const [view, setView] = useState<LightPresetName>("vitrina");
  const [engraving, setEngraving] = useState(false);
  const set = <K extends keyof RingSel>(k: K, v: RingSel[K]) => setBand({ ...band, [k]: v });
  useEffect(() => setCue(engraving ? "rasante" : view), [engraving, view, setCue]);

  return (
    <div className="ql-cfg">
      <div className="ql-cfg__stage" data-view={engraving ? "rasante" : view}>
        <RingStage sel={band} framing={engraving ? "engrave" : "ring"} draggable height="100%" alt={engraving ? `Interior de tu alianza con el grabado «${band.engraving.trim() || "sin texto"}»` : `Tu alianza: ${describe(band)}`} />
        <div className="ql-cfg__tools">
          {!engraving && <LightSwitch value={view} onChange={setView} options={["vitrina", "honesta", "calida"]} />}
          <span className="ql-mut ql-hide-sm">{engraving ? "Arrastra: al inclinar el aro, la luz rasante dibuja las letras" : "Arrastra para girarla"}</span>
        </div>
      </div>
      <div className="ql-cfg__panel">
        <p className="ql-kicker">Alianza a medida</p>
        <h1 className="ql-h2">La sencilla, bien hecha</h1>
        <OptionPicker label="Metal" kind="swatch" showValue options={METALS.map((m) => ({ value: m.value, label: `${m.label} · ${m.ley}`, color: m.color }))} value={band.metal} onChange={(v) => set("metal", v as RingSel["metal"])} />
        <KitPicker label="Aro" kind="aro" value={band.shank ?? ""} customLabel="A medida" only={BAND_SHANKS} onChange={(id) => set("shank", id)} />
        {!band.shank && (
          <>
            <Range label="Ancho" value={band.width} min={2} max={6} step={0.5} unit="mm" onChange={(v) => set("width", v)} />
            <OptionPicker label="Perfil" kind="chip" options={PROFILES.map((p) => ({ value: p.value, label: p.label }))} value={band.profile} onChange={(v) => set("profile", v as RingSel["profile"])} />
            <p className="ql-hint">{PROFILES.find((p) => p.value === band.profile)?.note}</p>
          </>
        )}
        <OptionPicker label="Acabado" kind="chip" options={FINISHES.map((p) => ({ value: p.value, label: p.label }))} value={band.finish} onChange={(v) => set("finish", v as RingSel["finish"])} />
        {!band.shank && (
          <label className="ql-check">
            <input type="checkbox" checked={band.pave} onChange={(e) => set("pave", e.target.checked)} /> Pavé de 14 diamantes en la mitad superior
          </label>
        )}
        <SizeField sel={band} onChange={(v) => set("size", v)} />
        <div className="ql-group" onFocus={() => setEngraving(true)} onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setEngraving(false)}>
          <TextField label={`Grabado interior (hasta ${ENGRAVE_MAX} caracteres)`} placeholder="21·06·2027 · A & M" value={band.engraving} onChange={(v) => set("engraving", v.slice(0, ENGRAVE_MAX))} variant="minimal" />
          <OptionPicker label="Letra del grabado" kind="chip" options={FONTS.map((f) => ({ value: f.value, label: f.label }))} value={band.font} onChange={(v) => set("font", v as RingSel["font"])} />
          <button type="button" className="ql-chip" aria-pressed={engraving} onClick={() => setEngraving((e) => !e)}>{engraving ? "Ver la alianza entera" : "Ver el grabado dentro del aro"}</button>
        </div>
        <PriceBox sel={band} onCita={() => { setCarry(band); navigate({ href: href("cita?motivo=alianzas") }); }} />
      </div>
    </div>
  );
}

/**
 * Selector de piezas del kit de Blender con su miniatura. La primera opción es la versión «a medida» (procedural), que
 * deja a la vista los controles finos (perfil, ancho, montura dibujada).
 */
function KitPicker({ label, kind, value, onChange, only, customLabel, warn }: { label: string; kind: "aro" | "cabeza"; value: string; onChange: (id: string) => void; only?: string[]; customLabel: string; warn?: (id: string) => string | undefined }) {
  const list = KIT.filter((p) => p.tipo === kind && (!only || only.includes(p.id)));
  const current = value ? kitPiece(value)?.nombre : customLabel;
  const note = value ? warn?.(value) : undefined;
  return (
    <div className="ql-kit">
      <p className="ql-kit__label">
        {label} <b>{current}</b>
      </p>
      <div className="ql-kit__grid" role="radiogroup" aria-label={label}>
        <button type="button" role="radio" aria-checked={!value} className="ql-kit__item ql-kit__item--custom" onClick={() => onChange("")}>
          <span aria-hidden>✎</span>
          <small>{customLabel}</small>
        </button>
        {list.map((p) => (
          <button key={p.id} type="button" role="radio" aria-checked={value === p.id} className="ql-kit__item" onClick={() => onChange(p.id)} title={p.nombre}>
            <img src={KIT_BASE + p.miniatura} alt="" loading="lazy" width={96} height={96} />
            <small>{p.nombre}</small>
          </button>
        ))}
      </div>
      {note && <p className="ql-note">{note}</p>}
    </div>
  );
}

/** Deslizador nativo controlado (RangeSlider del kit guarda su valor dentro). */
function Range({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void }) {
  return (
    <label className="ql-range">
      <span className="ql-range__head"><span>{label}</span> <b>{value.toLocaleString("es-ES")} {unit}</b></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} />
    </label>
  );
}

function SizeField({ sel, onChange }: { sel: RingSel; onChange: (v: number) => void }) {
  const mm = sizeToMm(sel.size);
  return (
    <div className="ql-size">
      <label className="ql-select">
        <span>Talla</span>
        <select value={sel.size} onChange={(e) => onChange(Number(e.target.value))}>
          {SIZES.map((s) => (
            <option key={s} value={s}>{s} · Ø {sizeToMm(s).diam.toLocaleString("es-ES", { maximumFractionDigits: 1 })} mm</option>
          ))}
        </select>
      </label>
      <p className="ql-hint">Circunferencia {mm.circ} mm. ¿No la sabes? <a href={href("talla")}>Mídela en pantalla</a>; el primer ajuste es gratis.</p>
    </div>
  );
}

/* ---------- compromiso: la pieza compleja, por pasos ---------- */
const STEPS: { id: string; title: string; light: LightPresetName; why: string }[] = [
  { id: "montura", title: "Montura", light: "vitrina", why: "Foco de vitrina: así se ve la silueta." },
  { id: "piedra", title: "Piedra", light: "fuego", why: "Foco duro que sigue al puntero: el fuego aparece con una luz pequeña que se mueve. Compara después con luz de día." },
  { id: "metal", title: "Metal y aro", light: "vitrina", why: "El metal se lee por sus reflejos: foco y entorno." },
  { id: "talla", title: "Talla y grabado", light: "rasante", why: "Luz rasante: es la que deja leer un grabado." },
  { id: "resumen", title: "Resumen", light: "lampara", why: "Luz de lámpara: lo siguiente es sentarse a hablar." },
];

function Engagement() {
  const { sol, setSol, setCarry, setCue } = useQ();
  const navigate = useSiteNavigate();
  const [step, setStep] = useState(0);
  const [view, setView] = useState<LightPresetName | null>(null);
  const s = STEPS[step];
  const set = <K extends keyof RingSel>(k: K, v: RingSel[K]) => setSol({ ...sol, [k]: v });
  const cue = view ?? s.light;
  useEffect(() => setCue(cue), [cue, setCue]);
  useEffect(() => setView(null), [step]);
  const stone = stoneOf(sol.stone);
  const colored = !sol.stone.startsWith("diamante");
  const engraving = s.id === "talla";

  return (
    <div className="ql-cfg">
      <div className="ql-cfg__stage" data-view={cue}>
        <RingStage sel={sol} framing={s.id === "piedra" ? "head" : engraving && sol.engraving.trim() ? "engrave" : "ring"} draggable height="100%" alt={`Tu solitario: ${describe(sol)}`} />
        <div className="ql-cfg__tools">
          {s.id === "piedra" && (
            <LightSwitch value={cue} onChange={setView} options={colored ? ["fuego", "honesta", "calida"] : ["fuego", "honesta"]} />
          )}
          <span className="ql-mut ql-hide-sm">{s.id === "piedra" && cue === "fuego" ? "Mueve el puntero: la luz te sigue" : "Arrastra para girarlo"}</span>
        </div>
      </div>
      <div className="ql-cfg__panel">
        <p className="ql-kicker">Solitario a medida · paso {step + 1} de {STEPS.length}</p>
        <h1 className="ql-h2">{s.title}</h1>
        <ol className="ql-steps" aria-label="Pasos">
          {STEPS.map((x, i) => (
            <li key={x.id}>
              <button type="button" aria-current={i === step ? "step" : undefined} onClick={() => setStep(i)}>{i + 1}. {x.title}</button>
            </li>
          ))}
        </ol>
        <p className="ql-hint ql-why">◐ {s.why}</p>

        {s.id === "montura" && (
          <>
            <div className="ql-presets">
              <span className="ql-hint">Partir de un modelo:</span>
              <button type="button" className="ql-chip" onClick={() => setSol({ ...CLASSIC_SOLITAIRE, size: sol.size, engraving: sol.engraving })}>Solitario clásico</button>
            </div>
            <KitPicker
              label="Montura del taller"
              kind="cabeza"
              value={sol.head ?? ""}
              customLabel="Dibujada a medida"
              onChange={(id) => {
                // si la talla actual no cabe en la cabeza elegida, se pasa a la primera compatible
                const shapes = id ? headShapes(id) : PROCEDURAL_SHAPES;
                setSol({ ...sol, head: id, shape: shapes.includes(sol.shape) ? sol.shape : shapes[0] });
              }}
              warn={(id) => (sol.shank && kitPiece(id)?.aros_no_recomendados?.includes(sol.shank) ? `Esta montura no se recomienda con el aro ${kitPiece(sol.shank)?.nombre.toLowerCase()}: los postes laterales quedan en el aire.` : undefined)}
            />
            {!sol.head && (
              <>
                <OptionPicker label="Montura dibujada" kind="chip" options={SETTINGS.map((x) => ({ value: x.value, label: x.label }))} value={sol.setting} onChange={(v) => set("setting", v as RingSel["setting"])} />
                <p className="ql-hint">{SETTINGS.find((x) => x.value === sol.setting)?.note}</p>
              </>
            )}
          </>
        )}
        {s.id === "piedra" && (
          <>
            <OptionPicker label="Piedra" kind="swatch" showValue options={STONES.map((x) => ({ value: x.value, label: x.label, color: x.color }))} value={sol.stone} onChange={(v) => set("stone", v as RingSel["stone"])} />
            <OptionPicker label="Talla" kind="chip" options={SHAPES.filter((x) => (sol.head ? headShapes(sol.head) : PROCEDURAL_SHAPES).includes(x.value)).map((x) => ({ value: x.value, label: x.label }))} value={sol.shape} onChange={(v) => set("shape", v as RingSel["shape"])} />
            {sol.head && <p className="ql-hint">Tallas que admite la montura «{kitPiece(sol.head)?.nombre.toLowerCase()}». Para otras, cambia de montura.</p>}
            <Range label="Quilates" value={sol.carat} min={0.3} max={2} step={0.05} unit="ct" onChange={(v) => set("carat", Math.round(v * 100) / 100)} />
            <MetaTable rows={[{ k: "Certificado", v: stone.cert }, { k: "Dureza", v: stone.hard }, { k: "Diámetro aprox.", v: `${(6.5 * Math.cbrt(sol.carat)).toLocaleString("es-ES", { maximumFractionDigits: 1 })} mm` }]} />
            {colored && <p className="ql-hint">Las piedras de color cambian con la luz: mírala con luz de día y con luz cálida antes de decidir (así las compara un laboratorio gemológico).</p>}
          </>
        )}
        {s.id === "metal" && (
          <>
            <OptionPicker label="Metal" kind="swatch" showValue options={METALS.map((m) => ({ value: m.value, label: `${m.label} · ${m.ley}`, color: m.color }))} value={sol.metal} onChange={(v) => set("metal", v as RingSel["metal"])} />
            <KitPicker
              label="Aro del taller"
              kind="aro"
              value={sol.shank ?? ""}
              customLabel="A medida"
              onChange={(id) => set("shank", id)}
              warn={(id) => (sol.head && kitPiece(sol.head)?.aros_no_recomendados?.includes(id) ? `Este aro no se recomienda con la montura ${kitPiece(sol.head)?.nombre.toLowerCase()}.` : undefined)}
            />
            {!sol.shank && (
              <>
                <Range label="Ancho del aro" value={sol.width} min={1.6} max={3} step={0.1} unit="mm" onChange={(v) => set("width", Math.round(v * 10) / 10)} />
                <OptionPicker label="Perfil" kind="chip" options={PROFILES.map((p) => ({ value: p.value, label: p.label }))} value={sol.profile} onChange={(v) => set("profile", v as RingSel["profile"])} />
                <label className="ql-check">
                  <input type="checkbox" checked={sol.pave} onChange={(e) => set("pave", e.target.checked)} /> Pavé en el aro
                </label>
              </>
            )}
            <OptionPicker label="Acabado" kind="chip" options={FINISHES.map((p) => ({ value: p.value, label: p.label }))} value={sol.finish} onChange={(v) => set("finish", v as RingSel["finish"])} />
          </>
        )}
        {s.id === "talla" && (
          <>
            <SizeField sel={sol} onChange={(v) => set("size", v)} />
            <TextField label={`Grabado interior (hasta ${ENGRAVE_MAX} caracteres)`} placeholder="Siempre · 2027" value={sol.engraving} onChange={(v) => set("engraving", v.slice(0, ENGRAVE_MAX))} variant="minimal" />
            <OptionPicker label="Letra del grabado" kind="chip" options={FONTS.map((f) => ({ value: f.value, label: f.label }))} value={sol.font} onChange={(v) => set("font", v as RingSel["font"])} />
          </>
        )}
        {s.id === "resumen" ? (
          <>
            <p className="ql-lead">{describe(sol)}</p>
            <PriceBox sel={sol} onCita={() => { setCarry(sol); navigate({ href: href("cita?motivo=compromiso") }); }} />
          </>
        ) : (
          <div className="ql-sum ql-sum--mini">
            <p className="ql-sum__total"><span>Hasta ahora</span> <b>{money(priceOf(sol), "EUR", "es-ES", true)}</b></p>
            <div className="ql-row">
              {step > 0 && <button type="button" className="ql-btn ql-btn--ghost" onClick={() => setStep(step - 1)}>Atrás</button>}
              <button type="button" className="ql-btn" onClick={() => setStep(step + 1)}>Siguiente: {STEPS[step + 1].title.toLowerCase()}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- taller: los servicios uno a uno, cada uno con su luz ---------- */
function Workshop() {
  const dull: RingSel = { ...DEFAULT_SOLITAIRE, metal: "amarillo" };
  return (
    <>
      <header className="ql-wrap ql-page" data-light="taller">
        <p className="ql-kicker">El taller</p>
        <h1 className="ql-h1 ql-h1--md">Lo que hacemos después de venderla.</h1>
        <p className="ql-lead">Seis servicios con precio y plazo. Para piezas nuestras y de cualquier casa.</p>
      </header>
      <div className="ql-wrap ql-services">
        {SERVICES.map((s) => (
          <section key={s.id} id={s.id} className="ql-service" data-light={s.light}>
            <div>
              <h2 className="ql-h2">{s.title}</h2>
              <p className="ql-chapter__how">{s.text}</p>
              <MetaTable rows={[{ k: "Precio", v: s.price }, { k: "Plazo", v: s.time }]} />
              <p className="ql-chapter__light"><span aria-hidden>◐</span> Luz: {LIGHT_LABEL[s.light]}</p>
            </div>
            <div className="ql-service__media">
              {s.id === "limpieza" ? (
                <BeforeAfter before={<RingFlat sel={dull} look="apagado" />} after={<RingFlat sel={dull} />} beforeLabel="Antes" afterLabel="Después" label="Comparar la pieza antes y después de limpiarla" ratio={1} />
              ) : s.id === "grabado" ? (
                <Engraving sel={{ ...DEFAULT_BAND, engraving: "A & M · 2027" }} />
              ) : s.id === "tasacion" ? (
                <MetaTable label="Informe de tasación (ejemplo)" rows={ARCHIVE_SAMPLE.split("\n").slice(0, 5).map((l) => ({ k: l.split("|")[0], v: l.split("|")[1] }))} />
              ) : (
                <img src={photo("joyeria", s.id === "talla" ? 5 : s.id === "reparacion" ? 1 : 6).src} alt="" loading="lazy" />
              )}
            </div>
          </section>
        ))}
      </div>
      <section className="ql-wrap ql-sec ql-cta" data-light="lampara">
        <h2 className="ql-h2">Tráela y la miramos contigo.</h2>
        <div className="ql-row">
          <a className="ql-btn" href={href("cita?motivo=reparacion")}>Pedir cita</a>
          <a className="ql-btn ql-btn--ghost" href={BRAND.whatsappHref} target="_blank" rel="noopener noreferrer">Mandar una foto por WhatsApp</a>
        </div>
      </section>
    </>
  );
}

/* ---------- tu talla: medidor en pantalla (calibrado con una tarjeta) ---------- */
const CARD_MM = 85.6;

function Sizer() {
  const [pxPerMm, setPxPerMm] = useState<number | null>(null);
  const [cardPx, setCardPx] = useState(320);
  const [diam, setDiam] = useState(17.2);
  const [circ, setCirc] = useState("");
  const ppm = pxPerMm ?? cardPx / CARD_MM;
  const fromThread = Number(circ.replace(",", "."));
  const threadSize = fromThread > 40 ? Math.round(fromThread - 40) : null;
  const ringSize = mmToSize(diam);
  return (
    <>
      <header className="ql-wrap ql-page" data-light="honesta">
        <p className="ql-kicker">Tu talla</p>
        <h1 className="ql-h1 ql-h1--md">Mídela en pantalla, sin moverte.</h1>
        <p className="ql-lead">Con luz de día y sin efectos: aquí lo que importa es el milímetro. Si dudas entre dos tallas, elige la mayor; el primer ajuste es gratis.</p>
      </header>
      <div className="ql-wrap ql-sizer" data-light="honesta">
        <section className="ql-sizer__step">
          <h2 className="ql-h3">1 · Calibra tu pantalla</h2>
          <p className="ql-mut">Apoya una tarjeta bancaria (o cualquiera de 85,6 mm) sobre el rectángulo y ajústalo hasta que mida lo mismo.</p>
          <div className="ql-cardbox" style={{ width: cardPx, height: cardPx / 1.586 }} aria-hidden />
          <Range label="Ancho de la tarjeta en pantalla" value={cardPx} min={200} max={520} step={1} unit="px" onChange={(v) => { setCardPx(v); setPxPerMm(null); }} />
          <button type="button" className="ql-chip" aria-pressed={pxPerMm != null} onClick={() => setPxPerMm(cardPx / CARD_MM)}>{pxPerMm ? "Calibrada" : "Ya coincide"}</button>
        </section>
        <section className="ql-sizer__step">
          <h2 className="ql-h3">2 · Pon encima un anillo que te quede bien</h2>
          <p className="ql-mut">Ajusta el círculo al borde interior del anillo.</p>
          <div className="ql-ringbox">
            <div className="ql-ringbox__c" style={{ width: diam * ppm, height: diam * ppm }} aria-hidden />
          </div>
          <Range label="Diámetro interior" value={diam} min={14} max={22.5} step={0.1} unit="mm" onChange={setDiam} />
          <p className="ql-result" aria-live="polite">Talla <b>{ringSize}</b> · Ø {diam.toLocaleString("es-ES")} mm · circunferencia {(diam * Math.PI).toLocaleString("es-ES", { maximumFractionDigits: 1 })} mm</p>
        </section>
        <section className="ql-sizer__step">
          <h2 className="ql-h3">O con un hilo</h2>
          <p className="ql-mut">Rodea la base del dedo con un hilo, marca donde se cruza y mide en milímetros. Mejor por la tarde: los dedos se hinchan a lo largo del día.</p>
          <TextField label="Circunferencia del dedo (mm)" placeholder="54" value={circ} onChange={setCirc} variant="minimal" />
          <p className="ql-result" aria-live="polite">{threadSize ? <>Talla <b>{threadSize}</b> (española = circunferencia − 40)</> : "Escribe la medida en milímetros."}</p>
        </section>
        <section className="ql-sizer__step">
          <h2 className="ql-h3">Equivalencias</h2>
          <table className="ql-table">
            <thead><tr><th>España</th><th>Circunferencia</th><th>Diámetro</th><th>EE. UU. (aprox.)</th></tr></thead>
            <tbody>
              {SIZES.filter((s) => s % 2 === 0).map((s) => {
                const m = sizeToMm(s);
                return <tr key={s}><td>{s}</td><td>{m.circ} mm</td><td>{m.diam.toLocaleString("es-ES", { maximumFractionDigits: 1 })} mm</td><td>{((m.diam - 11.63) / 0.8128).toLocaleString("es-ES", { maximumFractionDigits: 1 })}</td></tr>;
              })}
            </tbody>
          </table>
          <p className="ql-hint">¿Prefieres no medir? Te mandamos un medidor de plástico a casa, gratis.</p>
        </section>
      </div>
    </>
  );
}

/* ---------- cita: la conversación, con la pieza diseñada ---------- */
function Appointment() {
  const { carry, setCarry } = useQ();
  const [reason, setReason] = useState("compromiso");
  const [mode, setMode] = useState("taller");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    const m = new URLSearchParams(location.search).get("motivo");
    if (m && REASONS.some((r) => r.value === m)) setReason(m);
  }, []);
  const ok = !!date && !!slot && name.trim().length > 1 && phone.replace(/\D/g, "").length >= 9;

  if (done)
    return (
      <section className="ql-wrap ql-page ql-done" data-light="lampara">
        <p className="ql-kicker">Cita reservada (demo)</p>
        <h1 className="ql-h1 ql-h1--md">Te esperamos el {new Date(`${date}T12:00:00`).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })} a las {slot}.</h1>
        <p className="ql-lead">{mode === "video" ? "Te mandamos el enlace de la videollamada por WhatsApp una hora antes." : `En el taller: ${BRAND.address}.`} {carry ? "Tendremos tu diseño abierto en la mesa." : ""}</p>
        <a className="ql-btn" href={href()}>Volver al inicio</a>
      </section>
    );

  return (
    <div className="ql-wrap ql-appt" data-light="lampara">
      <header className="ql-page">
        <p className="ql-kicker">Pedir cita</p>
        <h1 className="ql-h1 ql-h1--md">Una hora, sin prisa.</h1>
        <p className="ql-lead">En el taller o por videollamada. Gratis y sin compromiso.</p>
      </header>
      <div className="ql-appt__grid">
        <div className="ql-appt__form">
          <OptionPicker label="Motivo" kind="chip" options={REASONS} value={reason} onChange={setReason} />
          <OptionPicker label="Dónde" kind="chip" options={[{ value: "taller", label: "En el taller" }, { value: "video", label: "Videollamada" }]} value={mode} onChange={setMode} />
          <DatePicker label="Día" value={date} onChange={(v) => { setDate(v); setSlot(""); }} min={1} max={60} closedDays="0" disabledDates={BRAND.exceptions.split("\n").map((l) => l.split("|")[0]).join(",")} slots={appointmentSlots} slot={slot} onSlotChange={setSlot} slotsLabel="Hora" shortcuts={4} calendar="collapsed" variant="minimal" />
          <TextField label="Nombre" placeholder="Nombre y apellido" value={name} onChange={setName} autoComplete="name" required variant="minimal" />
          <TextField label="Teléfono (o WhatsApp)" placeholder="600 000 000" type="tel" value={phone} onChange={setPhone} autoComplete="tel" required variant="minimal" />
          <button type="button" className="ql-btn ql-btn--block" disabled={!ok} onClick={() => setDone(true)}>Reservar la cita</button>
          {!ok && <p className="ql-hint">Elige día y hora y déjanos un nombre y un teléfono.</p>}
        </div>
        <aside className="ql-appt__piece">
          {carry ? (
            <>
              <p className="ql-label">Te llevas a la cita</p>
              <RingFlat sel={carry} className="ql-appt__flat" />
              <p className="ql-mut">{describe(carry)}</p>
              <p className="ql-sum__total"><span>Presupuesto</span> <b>{money(priceOf(carry), "EUR", "es-ES", true)}</b></p>
              {carry.kind === "solitario" && <p className="ql-hint">Reservamos la piedra 7 días para que la veas en persona.</p>}
              <button type="button" className="ql-link" onClick={() => setCarry(null)}>Quitar la pieza</button>
            </>
          ) : (
            <>
              <p className="ql-label">¿Traes una idea?</p>
              <p className="ql-mut">Puedes diseñar antes una <a href={href("alianzas")}>alianza</a> o un <a href={href("compromiso")}>solitario</a> y la cita se lo lleva. O trae una foto, una joya heredada o nada.</p>
            </>
          )}
          <OpeningHours hours={BRAND.hours} exceptions={BRAND.exceptions} layout="compact" title="Horario del taller" />
        </aside>
      </div>
    </div>
  );
}

export function Page({ path }: { path: string[] }) {
  const p = path[0] ?? "";
  if (p === "alianzas") return <Bands />;
  if (p === "compromiso") return <Engagement />;
  if (p === "taller") return <Workshop />;
  if (p === "talla") return <Sizer />;
  if (p === "cita") return <Appointment />;
  return <Home />;
}

