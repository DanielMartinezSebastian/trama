"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import ActionBar from "@/components/ui/ActionBar";
import BeforeAfter from "@/components/ui/BeforeAfter";
import CookieBanner from "@/components/ui/CookieBanner";
import DatePicker from "@/components/ui/DatePicker";
import FAQSection from "@/components/ui/FAQSection";
import LightScroll, { useLight } from "@/components/ui/LightScroll";
import MetaTable from "@/components/ui/MetaTable";
import OpeningHours from "@/components/ui/OpeningHours";
import OptionPicker from "@/components/ui/OptionPicker";
import QRCode from "@/components/ui/QRCode";
import SplitText from "@/components/ui/SplitText";
import TestimonialSection from "@/components/ui/TestimonialSection";
import TextField from "@/components/ui/TextField";
import { money } from "@/lib/commerce/money";
import { LIGHT_PRESETS, type LightPresetName } from "@/lib/ui/light";
import { phosphor } from "@/lib/ui/icons-phosphor";
import { photo } from "@/lib/sites/photos";
import { tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame, siteHref, useSiteNavigate } from "../shared";
import RingStage, { RingFlat } from "./RingStage";
import {
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
import { ARCHIVE_SAMPLE, BRAND, CHAPTERS, FAQ, LEGAL, REASONS, REVIEWS, SERVICES, SLUG, appointmentSlots, jewelryJsonLd } from "./data";
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

export function Shell({ children }: { children: ReactNode }) {
  const [band, setBand] = useState<RingSel>(DEFAULT_BAND);
  const [sol, setSol] = useState<RingSel>(DEFAULT_SOLITAIRE);
  const [carry, setCarry] = useState<RingSel | null>(null);
  const [cue, setCue] = useState<LightPresetName | null>(null);
  const path = usePathname();
  const navigate = useSiteNavigate();
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    setMenu(false);
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
    <SiteFrame tokens={TOKENS} className="ql" icons={{ set: phosphor, weight: "light" }}>
      <QCtx.Provider value={value}>
        <LightScroll cues={CUES} initial="vitrina" cue={cue ?? undefined} duration={1.1}>
          <a className="ql-skip" href="#contenido">Saltar al contenido</a>
          <header className="ql-head">
            <a className="ql-brand" href={href()}>Quilate</a>
            <nav className="ql-nav" aria-label="Principal" id="ql-menu" data-open={menu ? "" : undefined}>
              {NAV.map((n) => (
                <a key={n.path} href={href(n.path)} aria-current={path === href(n.path) ? "page" : undefined}>{n.label}</a>
              ))}
            </nav>
            <a className="ql-btn ql-btn--sm ql-head__cta" href={href("cita")}>Pedir cita</a>
            <button type="button" className="ql-burger" aria-expanded={menu} aria-controls="ql-menu" onClick={() => setMenu((m) => !m)}>{menu ? "Cerrar" : "Menú"}</button>
          </header>
          <main id="contenido">{children}</main>
          <Footer />
          <LightBadge />
        </LightScroll>
        <ActionBar
          actions={[
            { label: "Llamar", href: BRAND.phoneHref, icon: "phone" },
            { label: "WhatsApp", href: BRAND.whatsappHref, icon: "message" },
            { label: "Pedir cita", href: href("cita"), icon: "calendar", primary: true },
          ]}
          onNavigate={(h) => navigate({ href: h })}
          variant="minimal"
        />
        <CookieBanner storageKey="quilate-cookies" policyHref="#cookies" title="Cookies" text="Solo las necesarias para guardar tu diseño. Las de medición, si nos dejas." variant="minimal" />
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jewelryJsonLd(href())).replace(/</g, "\\u003c") }} />
      </QCtx.Provider>
    </SiteFrame>
  );
}

/** Rótulo fijo con la luz activa y su finalidad: la iluminación se explica, no solo se nota. */
function LightBadge() {
  const l = useLight();
  if (!l) return null;
  const name = l.name as LightPresetName;
  return (
    <p className="ql-badge" aria-live="polite">
      <span className="ql-badge__dot" aria-hidden />
      <span>{LIGHT_LABEL[name] ?? name}</span>
      <b>{Math.round(l.target.kelvin)} K</b>
    </p>
  );
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
function Rating() {
  return (
    <p className="ql-rating">
      <span aria-hidden>★★★★★</span> <b>{BRAND.rating.value.toLocaleString("es-ES")}</b> · {BRAND.rating.count} reseñas en {BRAND.rating.source}
    </p>
  );
}

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
const HERO_RING: RingSel = { ...DEFAULT_SOLITAIRE, metal: "amarillo", setting: "garras6", carat: 1, pave: true };

function Home() {
  const [active, setActive] = useState(0);
  const [clean, setClean] = useState(false);
  const list = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const items = Array.from(list.current?.querySelectorAll<HTMLElement>("[data-chapter]") ?? []);
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(Number(e.target.getAttribute("data-chapter")))), { rootMargin: "-50% 0px -50% 0px" });
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, []);
  const ch = CHAPTERS[active];
  const look = ch.id === "cuidar" && clean ? "final" : ch.look;
  const sel = ch.id === "transformar" ? { ...HERO_RING, metal: "rosa" as const, setting: "bisel" as const, pave: false } : HERO_RING;

  return (
    <>
      <section className="ql-hero" data-light="vitrina">
        <div className="ql-wrap ql-hero__in">
          <div className="ql-hero__copy">
            <p className="ql-kicker">Taller de joyería · {BRAND.city}</p>
            <SplitText as="h1" by="words" trigger="mount" className="ql-h1">{"Siete gestos para una joya."}</SplitText>
            <p className="ql-lead">No te contamos nuestra historia: te enseñamos lo que hacemos con la tuya. Escuchar, elegir, dar forma, ajustar, cuidar, transformar y heredar.</p>
            <div className="ql-row">
              <a className="ql-btn" href={href("cita")}>Pedir cita en el taller</a>
              <a className="ql-btn ql-btn--ghost" href={href("alianzas")}>Diseñar una alianza</a>
            </div>
            <Rating />
          </div>
          <RingStage sel={HERO_RING} height="min(72vh, 640px)" alt="Solitario de oro amarillo con un diamante de un quilate en seis garras y pavé en el aro, girando bajo un foco" className="ql-hero__ring" />
        </div>
        <p className="ql-wrap ql-hero__from">Alianzas desde {money(priceOf({ ...DEFAULT_BAND, width: 2 }), "EUR", "es-ES", true)} · solitarios desde {money(priceOf({ ...DEFAULT_SOLITAIRE, carat: 0.3, stone: "diamante-lab", setting: "garras4" }), "EUR", "es-ES", true)} · precio cerrado antes de empezar</p>
      </section>

      <section className="ql-chapters" aria-label="Lo que hacemos, en siete servicios">
        <div className="ql-chapters__stage">
          <RingStage sel={sel} look={look} framing={ch.framing ?? "ring"} height="100%" alt={`El anillo en el capítulo «${ch.title}»`} />
          <p className="ql-chapters__now" aria-hidden>
            <span>{ch.k}</span> {ch.title}
          </p>
        </div>
        <ol className="ql-chapters__list" ref={list}>
          {CHAPTERS.map((c, i) => (
            <li key={c.id} id={c.id} data-chapter={i} data-light={c.light} className="ql-chapter">
              <p className="ql-chapter__k">{c.k} · {c.title}</p>
              <h2 className="ql-h2">{c.thesis}</h2>
              <p className="ql-chapter__how">{c.how}</p>
              <p className="ql-chapter__what">{c.what}</p>
              {c.id === "cuidar" && (
                <button type="button" className="ql-chip" aria-pressed={clean} onClick={() => setClean((v) => !v)}>
                  {clean ? "Ver cómo llegó" : "Limpiar la pieza"}
                </button>
              )}
              {c.id === "heredar" && (
                <div className="ql-archive">
                  <MetaTable label="Ficha de archivo (ejemplo)" rows={ARCHIVE_SAMPLE.split("\n").map((l) => ({ k: l.split("|")[0], v: l.split("|")[1] }))} />
                  <QRCode value="https://quilate.example/archivo/0000" shape="rounded" codeSize={120} caption="El QR del estuche abre la ficha" />
                </div>
              )}
              <p className="ql-chapter__light"><span aria-hidden>◐</span> Luz: {c.why}</p>
              <a className="ql-link ql-chapter__cta" href={href(c.cta.href)}>{c.cta.label} →</a>
            </li>
          ))}
        </ol>
      </section>

      <section className="ql-wrap ql-sec" data-light="vitrina">
        <div className="ql-sechead">
          <h2 className="ql-h2">Dos maneras de empezar</h2>
          <p className="ql-mut">Las dos con precio cerrado, plazo dicho y cita antes de fundir nada.</p>
        </div>
        <div className="ql-doors">
          <a className="ql-door" href={href("alianzas")}>
            <img src={photo("joyeria", 1).src} alt="Dos alianzas de oro sobre una superficie clara" loading="lazy" />
            <span className="ql-door__k">Sencilla</span>
            <b>Alianza</b>
            <span>Metal, ancho, perfil, acabado y grabado. 12 días.</span>
          </a>
          <a className="ql-door" href={href("compromiso")}>
            <img src={photo("joyeria", 8).src} alt="Mano con un anillo de compromiso con una piedra grande" loading="lazy" />
            <span className="ql-door__k">Compleja</span>
            <b>Solitario</b>
            <span>Montura, piedra con certificado, quilates, metal y pavé. 4 a 6 semanas.</span>
          </a>
        </div>
      </section>

      <section className="ql-wrap ql-sec" data-light="lupa">
        <div className="ql-trust">
          {[
            ["Contraste y punzón", "Cada pieza lleva la ley del metal y nuestro punzón, como pide la ley de metales preciosos."],
            ["Piedras certificadas", "GIA o IGI en diamantes; origen y tratamiento declarados en piedras de color."],
            ["Precio cerrado", "El desglose que ves es el que pagas. Sin «desde» al final."],
            ["De por vida", "Limpieza y revisión gratis; ajuste de talla gratis el primer año."],
          ].map(([t, d]) => (
            <div key={t}>
              <h3 className="ql-h3">{t}</h3>
              <p className="ql-mut">{d}</p>
            </div>
          ))}
        </div>
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
        {engraving ? <Engraving sel={band} /> : <RingStage sel={band} draggable height="100%" alt={`Tu alianza: ${describe(band)}`} />}
        <div className="ql-cfg__tools">
          {!engraving && <LightSwitch value={view} onChange={setView} options={["vitrina", "honesta", "calida"]} />}
          <span className="ql-mut ql-hide-sm">{engraving ? "Mueve el puntero: la luz rasante cambia de lado" : "Arrastra para girarla"}</span>
        </div>
      </div>
      <div className="ql-cfg__panel">
        <p className="ql-kicker">Alianza a medida</p>
        <h1 className="ql-h2">La sencilla, bien hecha</h1>
        <OptionPicker label="Metal" kind="swatch" showValue options={METALS.map((m) => ({ value: m.value, label: `${m.label} · ${m.ley}`, color: m.color }))} value={band.metal} onChange={(v) => set("metal", v as RingSel["metal"])} />
        <Range label="Ancho" value={band.width} min={2} max={6} step={0.5} unit="mm" onChange={(v) => set("width", v)} />
        <OptionPicker label="Perfil" kind="chip" options={PROFILES.map((p) => ({ value: p.value, label: p.label }))} value={band.profile} onChange={(v) => set("profile", v as RingSel["profile"])} />
        <p className="ql-hint">{PROFILES.find((p) => p.value === band.profile)?.note}</p>
        <OptionPicker label="Acabado" kind="chip" options={FINISHES.map((p) => ({ value: p.value, label: p.label }))} value={band.finish} onChange={(v) => set("finish", v as RingSel["finish"])} />
        <label className="ql-check">
          <input type="checkbox" checked={band.pave} onChange={(e) => set("pave", e.target.checked)} /> Pavé de 14 diamantes en la mitad superior
        </label>
        <SizeField sel={band} onChange={(v) => set("size", v)} />
        <div className="ql-group" onFocus={() => setEngraving(true)} onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setEngraving(false)}>
          <TextField label={`Grabado interior (hasta ${ENGRAVE_MAX} caracteres)`} placeholder="21·06·2027 · A & M" value={band.engraving} onChange={(v) => set("engraving", v.slice(0, ENGRAVE_MAX))} variant="minimal" />
          <OptionPicker label="Letra del grabado" kind="chip" options={FONTS.map((f) => ({ value: f.value, label: f.label }))} value={band.font} onChange={(v) => set("font", v as RingSel["font"])} />
          <button type="button" className="ql-chip" aria-pressed={engraving} onClick={() => setEngraving((e) => !e)}>{engraving ? "Volver a la alianza" : "Ver el grabado con luz rasante"}</button>
        </div>
        <PriceBox sel={band} onCita={() => { setCarry(band); navigate({ href: href("cita?motivo=alianzas") }); }} />
      </div>
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
        {engraving && sol.engraving ? <Engraving sel={sol} /> : <RingStage sel={sol} framing={s.id === "piedra" ? "head" : "ring"} draggable height="100%" alt={`Tu solitario: ${describe(sol)}`} />}
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
            <OptionPicker label="Montura" kind="chip" options={SETTINGS.map((x) => ({ value: x.value, label: x.label }))} value={sol.setting} onChange={(v) => set("setting", v as RingSel["setting"])} />
            <p className="ql-hint">{SETTINGS.find((x) => x.value === sol.setting)?.note}</p>
          </>
        )}
        {s.id === "piedra" && (
          <>
            <OptionPicker label="Piedra" kind="swatch" showValue options={STONES.map((x) => ({ value: x.value, label: x.label, color: x.color }))} value={sol.stone} onChange={(v) => set("stone", v as RingSel["stone"])} />
            <OptionPicker label="Talla" kind="chip" options={SHAPES.map((x) => ({ value: x.value, label: x.label }))} value={sol.shape} onChange={(v) => set("shape", v as RingSel["shape"])} />
            <Range label="Quilates" value={sol.carat} min={0.3} max={2} step={0.05} unit="ct" onChange={(v) => set("carat", Math.round(v * 100) / 100)} />
            <MetaTable rows={[{ k: "Certificado", v: stone.cert }, { k: "Dureza", v: stone.hard }, { k: "Diámetro aprox.", v: `${(6.5 * Math.cbrt(sol.carat)).toLocaleString("es-ES", { maximumFractionDigits: 1 })} mm` }]} />
            {colored && <p className="ql-hint">Las piedras de color cambian con la luz: mírala con luz de día y con luz cálida antes de decidir (así las compara un laboratorio gemológico).</p>}
          </>
        )}
        {s.id === "metal" && (
          <>
            <OptionPicker label="Metal" kind="swatch" showValue options={METALS.map((m) => ({ value: m.value, label: `${m.label} · ${m.ley}`, color: m.color }))} value={sol.metal} onChange={(v) => set("metal", v as RingSel["metal"])} />
            <Range label="Ancho del aro" value={sol.width} min={1.6} max={3} step={0.1} unit="mm" onChange={(v) => set("width", Math.round(v * 10) / 10)} />
            <OptionPicker label="Perfil" kind="chip" options={PROFILES.map((p) => ({ value: p.value, label: p.label }))} value={sol.profile} onChange={(v) => set("profile", v as RingSel["profile"])} />
            <OptionPicker label="Acabado" kind="chip" options={FINISHES.map((p) => ({ value: p.value, label: p.label }))} value={sol.finish} onChange={(v) => set("finish", v as RingSel["finish"])} />
            <label className="ql-check">
              <input type="checkbox" checked={sol.pave} onChange={(e) => set("pave", e.target.checked)} /> Pavé en el aro
            </label>
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
                <img src={photo("joyeria", s.id === "talla" ? 3 : s.id === "reparacion" ? 0 : 9).src} alt="" loading="lazy" />
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

