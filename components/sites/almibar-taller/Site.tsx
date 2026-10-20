"use client";

import { createContext, useContext, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import ActionBar from "@/components/ui/ActionBar";
import CheckboxGroup from "@/components/ui/CheckboxGroup";
import CookieBanner from "@/components/ui/CookieBanner";
import DatePicker from "@/components/ui/DatePicker";
import EmptyState from "@/components/ui/EmptyState";
import ExpandingPanels from "@/components/ui/ExpandingPanels";
import FAQSection from "@/components/ui/FAQSection";
import GradientField from "@/components/ui/GradientField";
import { ALLERGENS } from "@/components/ui/MenuList";
import Modal from "@/components/ui/Modal";
import OpeningHours from "@/components/ui/OpeningHours";
import OptionPicker from "@/components/ui/OptionPicker";
import PinnedSection from "@/components/ui/PinnedSection";
import SplitText from "@/components/ui/SplitText";
import Table from "@/components/ui/Table";
import TestimonialSection from "@/components/ui/TestimonialSection";
import TextField from "@/components/ui/TextField";
import Timeline from "@/components/ui/Timeline";
import { money } from "@/lib/commerce/money";
import { BRAND, CAKE, LEGAL, REVIEWS, STORES, bakeryJsonLd, cakeAllergens, cakePrice, pickupSlots } from "@/lib/sites/almibar";
import { photo } from "@/lib/sites/photos";
import { phosphorLight } from "@/lib/ui/icons-phosphor-light";
import { tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame, siteHref, useSiteNavigate } from "../shared";
import CakeStage, { CakeFlat } from "./CakeStage";
import { DEFAULT_CAKE, describe, labelOf, leadDaysOf, type CakeSel } from "./cake";
import { CLIENTS, COLLECTIONS, CORPORATE_TABLE, HOME_FAQ, PHASES, SLUG, TASTING_SLOTS, WEDDING, WEDDING_FAQ, WEDDING_STEPS } from "./data";
import "./taller.css";

// rubor y crema, tinta de chocolate, frambuesa de acento y albaricoque de segundo color (el GradientField mezcla los dos)
const TOKENS: CSSProperties = tokensToStyle({
  bg: "#f6ece8",
  fg: "#2b1a1e",
  mut: "#6b5458",
  acc: "#b4475d",
  acc2: "#d9967c",
  card: "#efdfd9",
  ln: "rgba(43,26,30,0.14)",
  r: 18,
  font: 'var(--font-instrument-sans), var(--font-inter), ui-sans-serif, system-ui, sans-serif',
  display: 'var(--font-fraunces), Georgia, serif',
  accentFont: 'var(--font-instrument-serif), Georgia, serif',
});

const href = (p = "") => siteHref(SLUG, p);
const STORE = STORES[0];
const NAV = [
  { label: "Diseña", path: "disena" },
  { label: "Bodas", path: "bodas" },
  { label: "Empresas", path: "empresas" },
];

/* ---------- estado compartido: la tarta diseñada y la recogida ---------- */
type Order = { sel: CakeSel; date: string; slot: string; store: string } | null;
type Ctx = { sel: CakeSel; setSel: (s: CakeSel) => void; order: Order; setOrder: (o: Order) => void };
const CakeCtx = createContext<Ctx | null>(null);
const useCake = () => useContext(CakeCtx)!;
const KEY = "trama:almibar-taller";

export function Shell({ children }: { children: ReactNode }) {
  const [sel, setSel] = useState<CakeSel>(DEFAULT_CAKE);
  const [order, setOrder] = useState<Order>(null);
  // la tarta sobrevive a recargar la página (sessionStorage): se lee tras montar para no desajustar la hidratación
  useEffect(() => {
    try {
      const s = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
      if (s?.sel) setSel({ ...DEFAULT_CAKE, ...s.sel });
      if (s?.order) setOrder(s.order);
    } catch {
      /* sin almacenamiento */
    }
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ sel, order }));
    } catch {
      /* nada */
    }
  }, [sel, order]);
  const value = useMemo(() => ({ sel, setSel, order, setOrder }), [sel, order]);
  const navigate = useSiteNavigate();
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  useEffect(() => setMenu(false), [path]);

  return (
    <SiteFrame tokens={TOKENS} className="tl" icons={{ set: phosphorLight, weight: "light" }}>
      <CakeCtx.Provider value={value}>
        <a className="tl-skip" href="#contenido">Saltar al contenido</a>
        <header className="tl-head">
          <a className="tl-brand" href={href()}>
            Almíbar <em>Taller</em>
          </a>
          <nav className="tl-nav" aria-label="Principal" data-open={menu ? "" : undefined} id="tl-menu">
            {NAV.map((n) => (
              <a key={n.path} href={href(n.path)} aria-current={path === href(n.path) ? "page" : undefined}>{n.label}</a>
            ))}
            <a href={siteHref("almibar")}>La pastelería</a>
          </nav>
          <a className="tl-btn tl-btn--sm tl-head__cta" href={href("disena")}>Diseñar tarta</a>
          <button type="button" className="tl-burger" aria-expanded={menu} aria-controls="tl-menu" onClick={() => setMenu((m) => !m)}>
            {menu ? "Cerrar" : "Menú"}
          </button>
        </header>
        <main id="contenido">{children}</main>
        <Footer />
        <ActionBar
          actions={[
            { label: "Llamar", href: BRAND.phoneHref, icon: "phone" },
            { label: "WhatsApp", href: BRAND.whatsappHref, icon: "message" },
            { label: "Diseñar tarta", href: href("disena"), icon: "sparkles", primary: true },
          ]}
          onNavigate={(h) => navigate({ href: h })}
          variant="minimal"
        />
        <CookieBanner storageKey="almibar-taller-cookies" policyHref="#cookies" position="bottom-right" title="¿Unas cookies?" text="Solo las necesarias para que funcione el diseñador. Las de medición, si nos dejas." variant="minimal" />
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bakeryJsonLd(href())).replace(/</g, "\\u003c") }} />
      </CakeCtx.Provider>
    </SiteFrame>
  );
}

function Footer() {
  return (
    <footer className="tl-foot">
      <div className="tl-wrap tl-foot__grid">
        <div>
          <p className="tl-brand">Almíbar <em>Taller</em></p>
          <p className="tl-mut">Tartas a medida del obrador de {BRAND.name}, {BRAND.city}. {BRAND.tagline}.</p>
          <p className="tl-mut">
            <a href={BRAND.phoneHref}>{BRAND.phone}</a> · <a href={BRAND.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a> · <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
          </p>
        </div>
        <div>
          <p className="tl-label">Recogida en el obrador</p>
          <p className="tl-mut">{STORE.address}<br />{STORE.zone}</p>
          <OpeningHours hours={STORE.hours} exceptions={STORE.exceptions} layout="compact" title="" />
        </div>
        <div>
          <p className="tl-label">Legal</p>
          <ul className="tl-list">
            {LEGAL.map((l) => (
              <li key={l.label}><a href={l.href}>{l.label}</a></li>
            ))}
            <li>
              <button type="button" className="tl-link" onClick={() => { try { localStorage.removeItem("almibar-taller-cookies"); } catch { /* nada */ } location.reload(); }}>Configurar cookies</button>
            </li>
          </ul>
        </div>
      </div>
      <p className="tl-wrap tl-foot__small">
        {BRAND.legal} · {BRAND.sanitary} · Demo de Trama: no se cobra ni se encarga nada · <a href="/creditos">Créditos de las imágenes</a>
      </p>
    </footer>
  );
}

/* ---------- piezas comunes ---------- */
function Rating() {
  return (
    <p className="tl-rating">
      <span aria-hidden>★★★★★</span> <b>{BRAND.rating.value.toLocaleString("es-ES")}</b> · {BRAND.rating.count} reseñas en {BRAND.rating.source}
    </p>
  );
}
const algLabel = (ids: string[]) => ids.map((a) => ALLERGENS.find((x) => x.id === a)?.label.toLowerCase() ?? a).join(", ");
const reviewItems = REVIEWS.slice(0, 3).map((r) => `${r.quote}|${r.name}|${r.role}|${r.rating}`).join("\n");

/* ---------- inicio ---------- */
const HERO_CAKE: CakeSel = { size: "24", sponge: "chocolate", filling: "frambuesa", covering: "desnuda", toppings: ["frutos-rojos", "flores"], message: "" };
const STORY_CAKE: CakeSel = { size: "16", sponge: "redvelvet", filling: "pastelera", covering: "buttercream", toppings: ["frutos-rojos", "velas"], message: "" };

function Home() {
  return (
    <>
      <section className="tl-hero">
        <GradientField kind="mesh" intensity={0.45} speed={0.6} />
        <div className="tl-wrap tl-hero__in">
          <div className="tl-hero__copy">
            <p className="tl-kicker">Almíbar Taller · tartas a medida en {BRAND.city}</p>
            <SplitText as="h1" by="words" trigger="mount" className="tl-h1" emphasis>{"Tu tarta, *capa a capa.*"}</SplitText>
            <p className="tl-lead">Elige bizcocho, relleno, cobertura y decoración, y mírala girar antes de encargarla. La horneamos en el obrador y la recoges en 48 horas.</p>
            <div className="tl-row">
              <a className="tl-btn" href={href("disena")}>Diseñar tu tarta</a>
              <a className="tl-btn tl-btn--ghost" href={href("bodas")}>Bodas y eventos</a>
            </div>
            <Rating />
          </div>
          <CakeStage sel={HERO_CAKE} height="min(68vh, 620px)" alt="Tarta de dos pisos desnuda: bizcocho de chocolate con capas de frambuesa, frutos rojos y flores, girando" className="tl-hero__cake" />
        </div>
        <p className="tl-wrap tl-hero__from">Desde {money(CAKE.sizes[0].price, "EUR", "es-ES", true)} · 6 raciones · señal del 30 % al encargar</p>
      </section>

      <PinnedSection length={3} className="tl-story">
        <div className="tl-story__in">
          <div className="tl-story__cake">
            <CakeStage sel={STORY_CAKE} explodeVar="--pin-p" explodeRange={STORY_RANGE} explodeCurve={storyCurve} height="100%" alt="Despiece de una tarta de red velvet: las capas de bizcocho y crema se separan, la cobertura de buttercream se levanta y arriba quedan frutos rojos y velas" />
          </div>
          <ol className="tl-story__steps" aria-label="Cómo se hace una tarta, capa a capa">
            {PHASES.map((p, i) => (
              <li key={p.k} style={{ "--i": i } as CSSProperties}>
                <span className="tl-story__k">{p.k}</span>
                <h2>{p.title}</h2>
                <p>{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </PinnedSection>

      <section className="tl-wrap tl-sec">
        <div className="tl-sechead">
          <h2 className="tl-h2">Para cada celebración</h2>
          <p className="tl-mut">Cumpleaños con 48 horas; bodas y eventos, con degustación previa.</p>
        </div>
        <ExpandingPanels height="min(62vh, 520px)" panels={COLLECTIONS.map((c) => ({ title: c.title, meta: c.meta, image: photo("pasteleria", c.photo).src, alt: c.alt, href: href(c.href) }))} />
      </section>

      <section className="tl-wrap tl-sec tl-split">
        <div>
          <h2 className="tl-h2">Precio claro antes de encargar</h2>
          <p className="tl-lead">El diseñador suma cada opción mientras eliges. Sin sorpresas al recoger.</p>
        </div>
        <ul className="tl-prices">
          {CAKE.sizes.map((s) => (
            <li key={s.value}>
              <span>{s.label}{s.note ? <small> · {s.note}</small> : null}</span>
              <b>desde {money(s.price, "EUR", "es-ES", true)}</b>
            </li>
          ))}
        </ul>
      </section>

      <TestimonialSection kicker={`${BRAND.rating.value.toLocaleString("es-ES")} · ${BRAND.rating.count} reseñas en Google`} title="Lo que dicen al recogerla" subtitle="" items={reviewItems} variant="minimal" className="tl-reviews" />

      <section className="tl-wrap tl-sec">
        <FAQSection kicker="Antes de encargar" title="Preguntas frecuentes" subtitle="" items={HOME_FAQ} variant="minimal" />
      </section>

      <section className="tl-wrap tl-sec tl-cta">
        <h2 className="tl-h2">¿La diseñamos?</h2>
        <p className="tl-lead">Cinco minutos en el diseñador o un mensaje por WhatsApp. Te contestamos el mismo día.</p>
        <div className="tl-row">
          <a className="tl-btn" href={href("disena")}>Empezar el diseño</a>
          <a className="tl-btn tl-btn--ghost" href={BRAND.whatsappHref} target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a>
        </div>
      </section>
    </>
  );
}
const STORY_RANGE: [number, number] = [0, 1];
/** el despiece se abre en las tres primeras fases y la tarta se vuelve a montar en «Decoración» */
const storyCurve = (t: number) => (t < 0.1 ? 0 : t < 0.45 ? (t - 0.1) / 0.35 : t < 0.68 ? 1 : t < 0.86 ? 1 - (t - 0.68) / 0.18 : 0);

/* ---------- diseñador ---------- */
function Design() {
  const { sel, setSel, setOrder } = useCake();
  const navigate = useSiteNavigate();
  const [exploded, setExploded] = useState(false);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [store, setStore] = useState(STORE.id);
  const set = <K extends keyof CakeSel>(k: K, v: CakeSel[K]) => setSel({ ...sel, [k]: v });
  const price = cakePrice(sel);
  const algs = cakeAllergens(sel);
  const lead = leadDaysOf(sel.size);
  const TOPS = CAKE.toppings.map((t) => t.label).join(", ");
  const ok = !!date && !!slot;

  // si se cambia a una tarta de pisos, la fecha puede quedar antes del mínimo: se vacía
  useEffect(() => {
    if (!date) return;
    const min = new Date();
    min.setDate(min.getDate() + lead);
    if (new Date(`${date}T23:59:00`) < min) {
      setDate("");
      setSlot("");
    }
  }, [lead, date]);

  return (
    <div className="tl-design">
      <div className="tl-design__stage">
        <CakeStage sel={sel} explode={exploded ? 1 : 0} draggable height="100%" alt={`Tu tarta: ${describe(sel)}`} />
        <div className="tl-design__tools">
          <button type="button" className="tl-chip" aria-pressed={exploded} onClick={() => setExploded((e) => !e)}>{exploded ? "Montar la tarta" : "Ver despiece"}</button>
          <span className="tl-mut tl-hide-sm">Arrastra para girarla</span>
        </div>
      </div>
      <div className="tl-design__panel">
        <p className="tl-kicker">Diseña tu tarta</p>
        <h1 className="tl-h2">Capa a capa</h1>
        <OptionPicker label="Tamaño" kind="chip" options={CAKE.sizes.map((s) => ({ value: s.value, label: s.label }))} value={sel.size} onChange={(v) => set("size", v)} />
        <OptionPicker label="Bizcocho" kind="swatch" options={CAKE.sponges.map((s) => ({ value: s.value, label: s.label, color: s.color }))} value={sel.sponge} onChange={(v) => set("sponge", v)} />
        <OptionPicker label="Relleno" kind="swatch" options={CAKE.fillings.map((s) => ({ value: s.value, label: s.label, color: s.color }))} value={sel.filling} onChange={(v) => set("filling", v)} />
        <OptionPicker label="Cobertura" kind="chip" options={CAKE.coverings.map((s) => ({ value: s.value, label: s.label }))} value={sel.covering} onChange={(v) => set("covering", v)} />
        <CheckboxGroup
          label="Decoración"
          options={TOPS}
          defaultValue={sel.toppings.map((t) => labelOf(CAKE.toppings, t)).join(", ")}
          onChange={(labels) => set("toppings", CAKE.toppings.filter((t) => labels.includes(t.label)).map((t) => t.value))}
          variant="minimal"
        />
        {sel.toppings.includes("mensaje") && (
          <TextField label="Mensaje (hasta 30 letras)" placeholder="Feliz 30, Ana" className="tl-field" value={sel.message} onChange={(v) => set("message", v.slice(0, 30))} variant="minimal" />
        )}
        <div className="tl-sum">
          <p className="tl-sum__price"><span>Precio</span> <b>{money(price)}</b></p>
          <p className="tl-mut">Señal del 30 % al confirmar: {money(Math.round(price * 0.3 * 100) / 100)}. El resto, al recoger.</p>
          <p className="tl-mut"><b>Contiene:</b> {algLabel(algs) || "—"}. Elaborada en un obrador donde se manipulan los 14 alérgenos.</p>
        </div>
        <div className="tl-pickup">
          <p className="tl-label">Recogida</p>
          <OptionPicker label="Tienda" kind="chip" options={STORES.map((s) => ({ value: s.id, label: s.name.replace("Almíbar ", "") }))} value={store} onChange={setStore} />
          <DatePicker
            key={lead}
            label={`Día de recogida (desde ${lead === 2 ? "pasado mañana" : "dentro de 7 días"})`}
            value={date}
            onChange={(v) => { setDate(v); setSlot(""); }}
            min={lead}
            max={120}
            closedDays={store === "delicias" ? "0" : ""}
            disabledDates={STORE.exceptions.split("\n").filter((l) => l.split("|").length === 2).map((l) => l.split("|")[0]).join(",")}
            slots={pickupSlots}
            slot={slot}
            onSlotChange={setSlot}
            slotsLabel="Hora de recogida"
          />
        </div>
        <button
          type="button"
          className="tl-btn tl-btn--block"
          disabled={!ok}
          onClick={() => {
            setOrder({ sel, date, slot, store });
            navigate({ href: href("solicitud") });
          }}
        >
          {ok ? `Solicitar · ${money(price)}` : "Elige día y hora de recogida"}
        </button>
      </div>
    </div>
  );
}

/* ---------- bodas ---------- */
function Weddings() {
  const [guests, setGuests] = useState(90);
  const [table, setTable] = useState(true);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [sent, setSent] = useState(false);
  const total = guests * WEDDING.perGuest + (table ? guests * WEDDING.sweetTable : 0);
  return (
    <>
      <section className="tl-wrap tl-phead">
        <p className="tl-kicker">Bodas y eventos</p>
        <h1 className="tl-h1 tl-h1--md">Una sola boda por día, <em>con degustación.</em></h1>
        <p className="tl-lead">Tarta nupcial de pisos y mesa dulce, montadas en vuestro espacio. Primero probáis en el obrador; después cerramos diseño y precio.</p>
      </section>
      <section className="tl-wrap tl-gallery" aria-label="Algunas mesas dulces">
        {[6, 9, 10, 1].map((i, k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={photo("pasteleria", i).src} alt={["Postres emplatados en fila para un banquete", "Tartaletas de frutas sobre una tabla de madera", "Cupcakes con crema en espiral", "Porción de tarta de chocolate con una fresa"][k]} loading="lazy" />
        ))}
      </section>
      <section className="tl-wrap tl-sec tl-split">
        <div>
          <h2 className="tl-h2">Cuánto costaría</h2>
          <p className="tl-lead">Orientativo, con montaje en Zaragoza y hasta 60 km. El presupuesto cerrado llega tras la degustación.</p>
        </div>
        <div className="tl-box">
          <label className="tl-range">
            <span>Invitados <b>{guests}</b></span>
            <input type="range" min={WEDDING.min} max={WEDDING.max} step={10} value={guests} onChange={(e) => setGuests(Number(e.target.value))} aria-valuetext={`${guests} invitados`} />
          </label>
          <label className="tl-check">
            <input type="checkbox" checked={table} onChange={(e) => setTable(e.target.checked)} /> Añadir mesa dulce ({money(WEDDING.sweetTable)} por invitado)
          </label>
          <p className="tl-sum__price"><span>Desde</span> <b>{money(Math.round(total))}</b></p>
          <p className="tl-mut">Tarta de {guests >= 120 ? "4" : "3"} pisos ({money(WEDDING.perGuest)} por invitado){table ? " + mesa dulce" : ""}. IVA incluido.</p>
        </div>
      </section>
      <section className="tl-wrap tl-sec">
        <h2 className="tl-h2">Cómo trabajamos</h2>
        <Timeline steps={WEDDING_STEPS} variant="minimal" className="tl-steps" />
      </section>
      <section className="tl-wrap tl-sec tl-split" id="degustacion">
        <div>
          <h2 className="tl-h2">Reserva la degustación</h2>
          <p className="tl-lead">En el obrador del Centro, de martes a sábado. {money(WEDDING.tastingFee)} por pareja, que se descuentan del pedido.</p>
        </div>
        <div className="tl-box">
          {sent ? (
            <div className="tl-done" role="status">
              <p className="tl-h3">Degustación reservada</p>
              <p className="tl-mut">{date && new Date(`${date}T12:00:00`).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })} a las {slot}. Te escribimos por WhatsApp para confirmar. (Demo: no se reserva nada.)</p>
              <button type="button" className="tl-link" onClick={() => setSent(false)}>Cambiar</button>
            </div>
          ) : (
            <>
              <DatePicker value={date} onChange={(v) => { setDate(v); setSlot(""); }} slot={slot} onSlotChange={setSlot} min={3} max={150} closedDays="0,1" slots={(d) => TASTING_SLOTS.map((t, i) => ({ time: t, disabled: (Number(d.slice(8)) + i) % 3 === 0 }))} label="Elige el día" slotsLabel="Hora" />
              <button type="button" className="tl-btn tl-btn--block" disabled={!date || !slot} onClick={() => setSent(true)}>
                {date && slot ? "Reservar degustación" : "Elige día y hora"}
              </button>
            </>
          )}
        </div>
      </section>
      <section className="tl-wrap tl-sec">
        <FAQSection kicker="Bodas" title="Lo que nos preguntáis" subtitle="" items={WEDDING_FAQ} variant="minimal" />
      </section>
    </>
  );
}

/* ---------- empresas ---------- */
function Business() {
  const [f, setF] = useState({ company: "", email: "", units: "", note: "" });
  const [sent, setSent] = useState(false);
  const valid = f.company.trim() && /\S+@\S+\.\S+/.test(f.email) && f.units.trim();
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));
  return (
    <>
      <section className="tl-wrap tl-phead">
        <p className="tl-kicker">Empresas</p>
        <h1 className="tl-h1 tl-h1--md">Desayunos y regalos <em>con tu logo.</em></h1>
        <p className="tl-lead">Cajas para reuniones, aniversarios y clientes, con factura y entrega en la oficina. Pedidos sueltos o cada semana.</p>
      </section>
      <section className="tl-wrap tl-sec tl-biz">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo("pasteleria", 13).src} alt="Caja de cartón con bollería atada con cuerda junto a un ramo de flores" loading="lazy" />
        <div>
          <h2 className="tl-h2">Precios por volumen</h2>
          <Table csv={CORPORATE_TABLE} variant="minimal" />
          <p className="tl-mut">IVA aparte. Entrega en Zaragoza capital incluida a partir de 20 cajas. Galletas y cajas con tu logo desde 50 unidades.</p>
        </div>
      </section>
      <section className="tl-wrap tl-sec tl-split">
        <div>
          <h2 className="tl-h2">Pide presupuesto</h2>
          <p className="tl-lead">Cuatro datos y te respondemos en 24 horas laborables.</p>
          <p className="tl-label" style={{ marginTop: 28 }}>Nos han confiado sus mañanas</p>
          <ul className="tl-clients">{CLIENTS.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
        <form className="tl-box" onSubmit={(e) => { e.preventDefault(); if (valid) setSent(true); }}>
          {sent ? (
            <div className="tl-done" role="status">
              <p className="tl-h3">Recibido, {f.company}</p>
              <p className="tl-mut">Te escribimos a {f.email} con el presupuesto. (Demo: no se envía nada.)</p>
            </div>
          ) : (
            <>
              <TextField label="Empresa" placeholder="Estudio Ejemplo S. L." className="tl-field" value={f.company} onChange={set("company")} name="organization" required variant="minimal" />
              <TextField label="Correo" placeholder="compras@empresa.com" className="tl-field" type="email" value={f.email} onChange={set("email")} name="email" required variant="minimal" />
              <TextField label="¿Cuántas cajas y cada cuánto?" placeholder="30 cajas desayuno, los lunes" className="tl-field" value={f.units} onChange={set("units")} required variant="minimal" />
              <TextField label="Algo más (opcional)" placeholder="" className="tl-field" multiline rows={3} value={f.note} onChange={set("note")} variant="minimal" hint="Alergias del equipo, logo, horario de entrega…" />
              <button type="submit" className="tl-btn tl-btn--block" disabled={!valid}>Pedir presupuesto</button>
            </>
          )}
        </form>
      </section>
    </>
  );
}

/* ---------- solicitud ---------- */
function Request() {
  const { order, setOrder } = useCake();
  const [f, setF] = useState({ name: "", phone: "", email: "" });
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));
  const valid = f.name.trim() && f.phone.replace(/\D/g, "").length >= 9 && /\S+@\S+\.\S+/.test(f.email);

  if (!order) {
    return (
      <div className="tl-wrap tl-sec">
        <EmptyState title="Aún no has diseñado ninguna tarta" text="Empieza por el diseñador: eliges capas, decoración y el día de recogida." glyph="◌">
          <a className="tl-btn" href={href("disena")}>Ir al diseñador</a>
        </EmptyState>
      </div>
    );
  }
  const price = cakePrice(order.sel);
  const store = STORES.find((s) => s.id === order.store) ?? STORE;
  const day = new Date(`${order.date}T12:00:00`).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
  return (
    <div className="tl-wrap tl-sec">
      <p className="tl-kicker">Solicitud</p>
      <h1 className="tl-h2" style={{ marginBottom: 28 }}>Revisa tu tarta</h1>
      <div className="tl-order">
        <aside className="tl-box" aria-label="Tu tarta">
          <CakeFlat sel={order.sel} className="tl-order__flat" />
          <p>{describe(order.sel)}</p>
          {order.sel.toppings.includes("mensaje") && order.sel.message && <p className="tl-mut">Mensaje: «{order.sel.message}»</p>}
          <p className="tl-mut"><b>Contiene:</b> {algLabel(cakeAllergens(order.sel))}.</p>
          <ul className="tl-lines">
            <li><span>Recogida</span><span>{day} · {order.slot}</span></li>
            <li><span>Tienda</span><span>{store.name}</span></li>
            <li><span>Total</span><span>{money(price)}</span></li>
            <li className="tl-lines__b"><span>Señal hoy (30 %)</span><span>{money(Math.round(price * 0.3 * 100) / 100)}</span></li>
          </ul>
          <a className="tl-link" href={href("disena")}>Cambiar el diseño</a>
        </aside>
        <form className="tl-box" onSubmit={(e) => { e.preventDefault(); if (valid) setDone(true); }}>
          <h2 className="tl-h3">Tus datos</h2>
          <TextField label="Nombre" placeholder="Ana Prueba" className="tl-field" value={f.name} onChange={set("name")} name="name" required variant="minimal" />
          <TextField label="Teléfono" placeholder="600 000 000" className="tl-field" value={f.phone} onChange={set("phone")} name="tel" required variant="minimal" hint="Te avisamos por WhatsApp cuando esté lista." />
          <TextField label="Correo" placeholder="ana@ejemplo.com" className="tl-field" type="email" value={f.email} onChange={set("email")} name="email" required variant="minimal" />
          <p className="tl-mut">Demo: no se pide ningún dato de pago ni se cobra la señal.</p>
          <button type="submit" className="tl-btn tl-btn--block" disabled={!valid}>Confirmar solicitud</button>
        </form>
      </div>
      <Modal
        open={done}
        onOpenChange={(o) => {
          setDone(o);
          if (!o) setOrder(null);
        }}
        title="¡Tarta encargada!"
        body={`Gracias, ${f.name.split(" ")[0] || ""}. La tendrás el ${day} a las ${order.slot} en ${store.name}. Te hemos escrito a ${f.email} con el resumen. (Es una web de ejemplo: no se encarga ni se cobra nada.)`}
        confirmLabel="Perfecto"
        cancelLabel=""
        variant="glass"
      />
    </div>
  );
}

export function Page({ path }: { path: string[] }) {
  const [a] = path;
  if (!a) return <Home />;
  if (a === "disena") return <Design />;
  if (a === "bodas") return <Weddings />;
  if (a === "empresas") return <Business />;
  if (a === "solicitud") return <Request />;
  return null;
}

