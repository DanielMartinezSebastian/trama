"use client";

import { createContext, useContext, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast as sonnerToast } from "sonner";
import ActionBar from "@/components/ui/ActionBar";
import CartDrawer from "@/components/ui/CartDrawer";
import CheckboxGroup from "@/components/ui/CheckboxGroup";
import CookieBanner from "@/components/ui/CookieBanner";
import DatePicker from "@/components/ui/DatePicker";
import EmptyState from "@/components/ui/EmptyState";
import FAQSection from "@/components/ui/FAQSection";
import FilterBar from "@/components/ui/FilterBar";
import GradientField from "@/components/ui/GradientField";
import ImageReveal from "@/components/ui/ImageReveal";
import MenuList, { ALLERGENS } from "@/components/ui/MenuList";
import Modal from "@/components/ui/Modal";
import OpeningHours from "@/components/ui/OpeningHours";
import OptionPicker from "@/components/ui/OptionPicker";
import PageTransition, { PageTransitionPersist } from "@/components/ui/PageTransition";
import QuantityStepper from "@/components/ui/QuantityStepper";
import Reveal from "@/components/ui/Reveal";
import SplitText from "@/components/ui/SplitText";
import TeamSection from "@/components/ui/TeamSection";
import TestimonialSection from "@/components/ui/TestimonialSection";
import TextField from "@/components/ui/TextField";
import Timeline from "@/components/ui/Timeline";
import Toast from "@/components/ui/Toast";
import { useCart } from "@/lib/commerce/cart";
import { money } from "@/lib/commerce/money";
import { JsonLd } from "@/lib/seo";
import { BRAND, CAKE, CATEGORIES, FAQ, LEGAL, PRODUCTS, RATING_DISTRIBUTION, REVIEWS, STORES, bakeryJsonLd, cakeAllergens, cakePrice, menuSections, pickupSlots, type Product } from "@/lib/sites/almibar";
import { photo } from "@/lib/sites/photos";
import { video, videos } from "@/lib/sites/videos";
import { phosphorLight } from "@/lib/ui/icons-phosphor-light";
import { editorialTokens, tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame, siteHref } from "../shared";
import { HISTORY, NAV, PRODUCT_PHOTO, PROVENANCE, SLUG, TEAM, TILE, VALUES } from "./data";
import "./almibar.css";

// tema editorial con la paleta de la marca: crema, tinta marrón y frambuesa; titulares en Fraunces
const TOKENS: CSSProperties = tokensToStyle({
  ...editorialTokens,
  bg: "#f7f1e8",
  fg: "#2a1d16",
  mut: "#6b5a4e",
  acc: "#b8344f",
  acc2: "#2a1d16",
  card: "#efe5d8",
  ln: "rgba(42,29,22,0.16)",
  r: 18,
  display: 'var(--font-fraunces), Georgia, "Times New Roman", serif',
  accentFont: 'var(--font-fraunces), Georgia, serif',
});

const href = (p = "") => siteHref(SLUG, p);
const TOAST = "al-toast";
const ALG = Object.fromEntries(ALLERGENS.map((a) => [a.id, a.label]));
const algText = (ids: string[]) => (ids.length ? ids.map((a) => ALG[a]?.toLowerCase() ?? a).join(", ") : "ninguno de los 14");
/** Franjas de recogida: las de hoy que ya han pasado (o empiezan en menos de 45 min) no se pueden elegir. */
const slotsFor = (date: string) => {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const limit = now.getHours() * 60 + now.getMinutes() + 45;
  return pickupSlots(date).map((s) => {
    const [h, m] = s.time.split(":").map(Number);
    return date === today && h * 60 + m < limit ? { ...s, disabled: true, note: "ya no llega" } : s;
  });
};
/** Solo los próximos cuatro festivos (la tabla del kit lista todos, también los pasados). */
const upcoming = (exceptions: string) => {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return exceptions.split("\n").filter((l) => l.slice(0, 10) >= today).slice(0, 4).join("\n");
};
/** Al cambiar de paso, el formulario vuelve a su cabecera (en móvil el botón «Continuar» queda muy abajo). */

type Shop = ReturnType<typeof useCart> & { openCart: () => void };
const ShopCtx = createContext<Shop | null>(null);
const useShop = () => useContext(ShopCtx)!;

/* ---------- piezas comunes ---------- */
function ProductImage({ p, ratio = "4 / 5" }: { p: Product; ratio?: string }) {
  const ph = PRODUCT_PHOTO[p.id];
  if (ph) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="al-pimg" src={photo(ph.topic, ph.i).src} alt={ph.alt} loading="lazy" style={{ aspectRatio: ratio }} />;
  }
  // sin foto que encaje: ficha tipográfica (mejor que una foto que no es el producto)
  return (
    <div className="al-ptile" style={{ aspectRatio: ratio }} aria-hidden>
      <span>{TILE[p.id] ?? p.name.split(" ")[0]}</span>
      <small>{p.cat}</small>
    </div>
  );
}

function Rating() {
  return (
    <p className="al-rating">
      <b>{BRAND.rating.value.toString().replace(".", ",")}</b>
      <span aria-hidden>★★★★★</span>
      <span>
        {BRAND.rating.count} reseñas en {BRAND.rating.source}
      </span>
    </p>
  );
}

function Head({ kicker, title, lead, as = "h2" }: { kicker?: string; title: string; lead?: string; as?: "h1" | "h2" }) {
  const H = as;
  return (
    <header className="al-shead">
      {kicker && <p className="al-kicker">{kicker}</p>}
      <H className={as === "h1" ? "al-h1" : "al-h2"}>{title}</H>
      {lead && <p className="al-lead">{lead}</p>}
    </header>
  );
}

/* ---------- marco ---------- */
export function Shell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const cart = useCart("trama:almibar");
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [cookieKey, setCookieKey] = useState(0);
  const value = useMemo<Shop>(() => ({ ...cart, openCart: () => setOpen(true) }), [cart]);
  const reopenCookies = () => {
    try {
      localStorage.removeItem("trama:almibar:cookies");
    } catch {
      /* sin almacenamiento */
    }
    setCookieKey((k) => k + 1);
  };
  const centro = STORES[0];
  return (
    <SiteFrame tokens={TOKENS} className="al" icons={{ set: phosphorLight, weight: "light" }}>
      <ShopCtx.Provider value={value}>
        <a className="al-skip" href="#contenido">Saltar al contenido</a>
        <PageTransitionPersist name="al-head">
        <header className="al-head">
          <a className="al-brand" href={href()} aria-label="Almíbar, inicio">
            Almíbar<small>obrador · 1987</small>
          </a>
          <nav className="al-nav" aria-label="Principal" data-open={menu ? "" : undefined}>
            {NAV.map((n) => (
              <a key={n.path} href={href(n.path)} onClick={() => setMenu(false)}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="al-head__act">
            <button type="button" className="al-bag" onClick={() => setOpen(true)} aria-haspopup="dialog">
              Bolsa <b aria-label={`${cart.count} productos`}>{cart.count}</b>
            </button>
            <a className="al-btn al-btn--pri al-head__cta" href={href("encargos")}>
              Encargar una tarta
            </a>
            <button type="button" className="al-burger" aria-expanded={menu} aria-label="Menú" onClick={() => setMenu((m) => !m)}>
              <span />
              <span />
            </button>
          </div>
        </header>
        </PageTransitionPersist>
        <main id="contenido">{children}</main>
        <footer className="al-foot">
          <div className="al-wrap al-foot__grid">
            <div>
              <p className="al-foot__brand">Almíbar</p>
              <p className="al-mut">{BRAND.tagline}. Todo lo que vendemos sale de nuestro obrador del Casco Histórico.</p>
              <OpeningHours hours={centro.hours} exceptions={centro.exceptions} layout="badge" title="" variant="minimal" />
            </div>
            <div>
              <p className="al-foot__h">Tiendas</p>
              {STORES.map((s) => (
                <p key={s.id} className="al-mut">
                  <b>{s.name}</b>
                  <br />
                  {s.address}
                </p>
              ))}
            </div>
            <div>
              <p className="al-foot__h">Contacto</p>
              <p className="al-mut">
                <a href={BRAND.phoneHref}>{BRAND.phone}</a>
                <br />
                <a href={BRAND.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp {BRAND.whatsapp}</a>
                <br />
                <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
              </p>
            </div>
            <div>
              <p className="al-foot__h">Legal</p>
              <ul className="al-foot__list">
                {LEGAL.map((l) => (
                  <li key={l.label}>
                    <a href={l.label === "Alérgenos" ? href("carta") : l.href}>{l.label}</a>
                  </li>
                ))}
                <li>
                  <button type="button" className="al-link" onClick={reopenCookies}>Configurar cookies</button>
                </li>
              </ul>
            </div>
          </div>
          <div className="al-wrap al-foot__base">
            <span>© 2026 {BRAND.legal} · {BRAND.sanitary}</span>
            <span>
              Demo de Trama: no se cobra ni se envía nada · <a href="/creditos">Créditos de fotos y vídeos</a>
            </span>
          </div>
        </footer>
        <ActionBar
          variant="minimal"
          onNavigate={(h) => router.push(h)}
          actions={[
            { label: "Llamar", href: BRAND.phoneHref, icon: "phone" },
            { label: "WhatsApp", href: BRAND.whatsappHref, icon: "message" },
            { label: "Cómo llegar", href: href("tiendas"), icon: "map-pin" },
            { label: "Pedir", href: href("tienda"), icon: "shopping-cart", primary: true, badge: cart.count || undefined },
          ]}
        />
        <CartDrawer
          open={open}
          onOpenChange={setOpen}
          lines={cart.lines}
          onQty={cart.setQty}
          onRemove={cart.remove}
          checkoutHref={href("pedido")}
          continueHref={href("tienda")}
          emptyText="La bolsa está vacía. Lo de la vitrina se acaba pronto: el croissant, antes de las 11."
        />
        <Toast id={TOAST} position="top-center" variant="minimal" intentStyle="mono" showTrigger={false} />
        <CookieBanner
          key={cookieKey}
          storageKey="trama:almibar:cookies"
          position="bottom-right"
          variant="minimal"
          title="Cookies, solo las justas"
          text="Usamos las necesarias para que funcionen la bolsa y los encargos. Las de medición, solo si las aceptas."
          policyHref="#cookies"
          className="al-cookies"
        />
      </ShopCtx.Provider>
    </SiteFrame>
  );
}

/* ---------- inicio ---------- */
function Home() {
  const v = video("obrador", 1);
  const centro = STORES[0];
  const daily = ["croissant", "hogaza", "queso", "chocolate"].map((id) => PRODUCTS.find((p) => p.id === id)!);
  const season = PRODUCTS.filter((p) => p.season);
  return (
    <>
      <section className="al-wrap al-hero">
        <div className="al-hero__copy">
          <p className="al-kicker">Pastelería de obrador · Zaragoza</p>
          <SplitText as="h1" by="lines" trigger="mount" className="al-display">Lo de hoy sale del horno a las seis.</SplitText>
          <p className="al-lead">Bollería de mantequilla, pan de masa madre y tartas por encargo, hechos cada madrugada en el Casco Histórico desde 1987.</p>
          <OpeningHours hours={centro.hours} exceptions={centro.exceptions} layout="badge" title="" variant="minimal" className="al-hero__hours" />
          <div className="al-ctas">
            <a className="al-btn al-btn--pri" href={href("encargos")}>Encargar una tarta</a>
            <a className="al-btn" href={href("tienda")}>Pedir para recoger</a>
          </div>
          <Rating />
        </div>
        <figure className="al-hero__media">
          <div className="al-hero__frame">
            <video className="al-video" src={v.src} poster={v.posterSrc} muted loop playsInline autoPlay aria-label={v.alt} />
          </div>
          <figcaption className="al-cap">Laminado del hojaldre, a las 4:30 de la mañana.</figcaption>
        </figure>
      </section>

      <section className="al-wrap al-sec">
        <div className="al-row">
          <Head kicker="Hoy en el horno" title="Lo de cada día" />
          <a className="al-more" href={href("carta")}>Ver la carta completa →</a>
        </div>
        <Reveal kind="slide" stagger={0.08} className="al-grid4">
          {daily.map((p) => (
            <a key={p.id} className="al-card" href={href("tienda")}>
              <ProductImage p={p} />
              <span className="al-card__name">{p.name}</span>
              <span className="al-card__meta">{money(p.price)}{p.whole ? ` · entera ${money(p.whole.price)}` : ""}</span>
            </a>
          ))}
        </Reveal>
      </section>

      <section className="al-band">
        <GradientField kind="mesh" intensity={0.35} speed={0.4} grain />
        <div className="al-wrap al-band__in">
          <div>
            <p className="al-kicker">De temporada · hasta el 2 de noviembre</p>
            <h2 className="al-h2">Todos los Santos</h2>
            <p className="al-lead">Huesos de santo de mazapán y yema, y buñuelos de viento rellenos de crema, nata o trufa. Se hacen por la mañana y se acaban por la tarde: resérvalos para recoger.</p>
            <a className="al-btn al-btn--pri" href={href("tienda")}>Reservar para recoger</a>
          </div>
          <ul className="al-season">
            {season.map((p) => (
              <li key={p.id}>
                <span>{p.name}</span>
                <b>{money(p.price)}</b>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="al-wrap al-sec al-prov">
        <div className="al-prov__img">
          <ImageReveal src={photo("pasteleria", 3).src} alt="Croissant sobre papel blanco junto a una taza de café" ratio="4 / 5" from="bottom" />
        </div>
        <div>
          <Head kicker="De dónde viene" title="Un croissant, cuatro decisiones" lead="No hay secreto: buena materia prima, tiempo y alguien despierto a las cuatro de la mañana." />
          <Timeline steps={PROVENANCE} marker="number" variant="editorial" />
        </div>
      </section>

      <section className="al-wrap al-sec">
        <TestimonialSection
          kicker="Lo que dicen"
          title="642 reseñas, casi todas de vecinos"
          items={REVIEWS.map((r) => `${r.quote}|${r.name}|${r.role}|${r.rating}`).join("\n")}
          layout="carousel"
          perView={3}
          align="left"
          rating={BRAND.rating.value}
          count={BRAND.rating.count}
          source={BRAND.rating.source}
          sourceHref="https://www.google.com/maps/search/pasteler%C3%ADa+Zaragoza"
          distribution={RATING_DISTRIBUTION}
          quoteFont="display"
          variant="editorial"
        />
      </section>

      <section className="al-wrap al-sec">
        <Head kicker="Dos tiendas" title="Ven a por ello" />
        <div className="al-stores">
          {STORES.map((s) => (
            <article key={s.id} className="al-store">
              <h3>{s.name}</h3>
              <p className="al-mut">{s.address} · {s.zone}</p>
              <OpeningHours hours={s.hours} exceptions={s.exceptions} layout="compact" title="" variant="minimal" />
              <a className="al-more" href={href("tiendas")}>Horario completo y cómo llegar →</a>
            </article>
          ))}
        </div>
      </section>

      <section className="al-wrap al-sec">
        <FAQSection kicker="Antes de encargar" title="Preguntas frecuentes" items={FAQ.map((f) => `${f.q}|${f.a}`).join("\n")} variant="editorial" multiple={false} />
      </section>
    </>
  );
}

/* ---------- carta ---------- */
function Carta() {
  return (
    <section className="al-wrap al-sec">
      <Head as="h1" kicker="Carta" title="Todo lo que hacemos" lead="Precios con IVA en tienda. Marca lo que no puedes tomar y ocultamos lo que lo lleva." />
      <MenuList menu={menuSections()} layout="columns" nav filter legend variant="editorial" className="al-menu" footnote="Elaboramos en un obrador donde se manipulan los 14 alérgenos: aunque una receta no los lleve, puede haber trazas. Pregunta en tienda si tienes una alergia grave." />
    </section>
  );
}

/* ---------- tienda (pedido para recoger) ---------- */
function Tienda() {
  const { add, openCart } = useShop();
  const [values, setValues] = useState<Record<string, string[]>>({ cat: [], sin: [] });
  const shown = PRODUCTS.filter((p) => p.cat !== "Café y bebidas").filter((p) => (values.cat.length === 0 || values.cat.includes(p.cat)) && !values.sin.some((a) => p.allergens.includes(a)));
  const cats = CATEGORIES.filter((c) => c !== "Café y bebidas");
  const addOne = (p: Product, whole = false) => {
    add({ id: whole ? `${p.id}-entera` : p.id, title: whole ? `${p.name} (entera)` : p.name, price: whole && p.whole ? p.whole.price : p.price, meta: whole && p.whole ? `${p.whole.serves} raciones` : p.cat, image: PRODUCT_PHOTO[p.id] ? photo(PRODUCT_PHOTO[p.id].topic, PRODUCT_PHOTO[p.id].i).src : undefined });
    sonnerToast.success("En la bolsa", { description: whole ? `${p.name}, entera` : p.name, toasterId: TOAST, action: { label: "Ver bolsa", onClick: openCart } });
  };
  return (
    <section className="al-wrap al-sec">
      <Head as="h1" kicker="Pedir para recoger" title="Lo pides hoy, lo recoges caliente" lead="Elige, di en qué tienda y a qué hora pasas, y lo tendremos apartado con tu nombre. Pagas al recoger." />
      <FilterBar
        groups={[
          { id: "cat", label: "Qué", options: cats.map((c) => ({ value: c, label: c, count: PRODUCTS.filter((p) => p.cat === c).length })) },
          { id: "sin", label: "Sin", options: ["gluten", "leche", "huevo", "frutos-cascara"].map((a) => ({ value: a, label: ALG[a] })) },
        ]}
        values={values}
        onChange={setValues}
        total={shown.length}
        noun="productos"
      />
      {shown.length === 0 ? (
        <EmptyState title="Nada con esos filtros" text="Prueba a quitar alguno: casi todo lo nuestro lleva gluten, huevo o leche." glyph="◌" />
      ) : (
        <ul className="al-shop">
          {shown.map((p) => (
            <li key={p.id} className="al-item" id={p.id}>
              <ProductImage p={p} ratio="1 / 1" />
              <div className="al-item__body">
                <h2 className="al-item__name">{p.name}</h2>
                <p className="al-mut">{p.desc}</p>
                <p className="al-alg">Contiene: {algText(p.allergens)}</p>
                {p.tags?.length ? <p className="al-tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</p> : null}
              </div>
              <div className="al-item__buy">
                <button type="button" className="al-btn al-btn--pri al-btn--sm" onClick={() => addOne(p)}>
                  Añadir · {money(p.price)}
                  <span className="ui-sr"> {p.name}</span>
                </button>
                {p.whole && (
                  <button type="button" className="al-btn al-btn--sm" onClick={() => addOne(p, true)}>
                    Entera · {money(p.whole.price)}
                    <span className="ui-sr"> {p.name}</span>
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ---------- pedido: una sola página (dónde, cuándo, quién) y un botón ---------- */
const longDay = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
const PHONE = /^[+\d\s]{9,}$/;

/** Tienda + día (atajos «Hoy · Mañana…», calendario solo si hace falta) + hora: lo comparten el pedido y el encargo. */
function Pickup({ store, setStore, date, setDate, slot, setSlot, lead = 0, max = 14, extraClosed = "" }: { store: string; setStore: (v: string) => void; date: string; setDate: (v: string) => void; slot: string; setSlot: (v: string) => void; lead?: number; max?: number; extraClosed?: string }) {
  const st = STORES.find((s) => s.id === store) ?? STORES[0];
  return (
    <>
      <OptionPicker label="Tienda" kind="chip" options={STORES.map((s) => ({ value: s.id, label: s.name.replace("Almíbar ", "").replace(" · obrador", "") }))} value={store} onChange={(v) => { setStore(v); setDate(""); setSlot(""); }} />
      <p className="al-mut al-small">{st.address}{st.id === "delicias" ? " · cerrada los domingos" : ""}</p>
      <DatePicker key={`${st.id}-${lead}`} min={lead} max={max} closedDays={st.id === "delicias" ? "0" : ""} disabledDates={["2026-11-01", extraClosed].filter(Boolean).join(", ")} value={date} onChange={(d) => { setDate(d); setSlot(""); }} slots={slotsFor} slot={slot} onSlotChange={setSlot} slotsLabel="Hora" label="Día de recogida" shortcuts={4} calendar="collapsed" variant="minimal" />
    </>
  );
}

/** Nombre y teléfono: lo único que hace falta para apartar algo con tu nombre. */
function Contact({ f, setF, tried, phoneLabel = "Teléfono" }: { f: { name: string; phone: string }; setF: (fn: (s: { name: string; phone: string; notes: string }) => { name: string; phone: string; notes: string }) => void; tried: boolean; phoneLabel?: string }) {
  return (
    <div className="al-pair">
      <TextField label="Nombre" placeholder="Ana" value={f.name} onChange={(v) => setF((s) => ({ ...s, name: v }))} variant="editorial" name="name" autoComplete="given-name" required className="al-field" {...(tried && f.name.trim().length < 2 ? { intent: "danger" as const, hint: "Escribe tu nombre" } : {})} />
      <TextField label={phoneLabel} placeholder="600 000 000" type="tel" value={f.phone} onChange={(v) => setF((s) => ({ ...s, phone: v }))} variant="editorial" name="tel" autoComplete="tel" required className="al-field" {...(tried && !PHONE.test(f.phone.trim()) ? { intent: "danger" as const, hint: "Un teléfono de 9 cifras" } : {})} />
    </div>
  );
}

const missingOf = (date: string, slot: string, f: { name: string; phone: string }) => (!date || !slot ? "Elige día y hora de recogida" : f.name.trim().length < 2 ? "Falta tu nombre" : !PHONE.test(f.phone.trim()) ? "Falta un teléfono válido" : "");

function Pedido() {
  const { lines, subtotal, clear, openCart, setQty } = useShop();
  const [done, setDone] = useState<null | { code: string; when: string; store: string }>(null);
  const [store, setStore] = useState(STORES[0].id);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [f, setF] = useState({ name: "", phone: "", notes: "" });
  const [tried, setTried] = useState(false);
  const st = STORES.find((s) => s.id === store) ?? STORES[0];
  const missing = missingOf(date, slot, f);
  const when = date ? `${longDay(date)} a las ${slot}` : "";

  if (done) {
    return (
      <section className="al-wrap al-sec al-done">
        <p className="al-kicker">Pedido apartado · {done.code}</p>
        <h1 className="al-h1">Te esperamos, {f.name.split(" ")[0]}.</h1>
        <p className="al-lead">Recógelo en {done.store}, {done.when}. Di tu nombre o el código en el mostrador y paga allí. Era un pedido de demostración: no se ha guardado ni enviado nada.</p>
        <div className="al-ctas">
          <a className="al-btn al-btn--pri" href={href()}>Volver al inicio</a>
          <a className="al-btn" href={href("encargos")}>Encargar una tarta</a>
        </div>
      </section>
    );
  }
  if (lines.length === 0) {
    return (
      <section className="al-wrap al-sec">
        <EmptyState title="Tu bolsa está vacía" text="Añade algo de la vitrina para apartarlo con tu nombre." glyph="◌">
          <a className="al-btn al-btn--pri" href={href("tienda")}>Ir a pedir para recoger</a>
        </EmptyState>
      </section>
    );
  }
  const submit = () => {
    setTried(true);
    if (missing) return;
    setDone({ code: `AL-${String((Math.floor(subtotal * 37) % 9000) + 1000)}`, when, store: st.name });
    clear();
  };
  return (
    <section className="al-wrap al-sec">
      <Head as="h1" kicker="Pedido para recoger" title="¿Cuándo pasas?" lead="Lo apartamos con tu nombre y pagas al recoger (tarjeta, Bizum o efectivo). Sin cuenta y sin pago por adelantado." />
      <form className="al-order" onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate>
        <div className="al-box al-flow">
          <fieldset className="al-part">
            <legend><span>1</span> Recogida</legend>
            <Pickup store={store} setStore={setStore} date={date} setDate={setDate} slot={slot} setSlot={setSlot} />
          </fieldset>
          <fieldset className="al-part">
            <legend><span>2</span> A nombre de</legend>
            <Contact f={f} setF={setF} tried={tried} />
            <p className="al-mut al-small">Solo para avisarte si algo se agota. Es una demo: no se envía nada.</p>
          </fieldset>
        </div>
        <aside className="al-box al-sum al-sum--sticky" aria-label="Resumen del pedido">
          <h2>Tu bolsa</h2>
          <ul>
            {lines.map((l) => (
              <li key={l.id}>
                <span>{l.title}</span>
                <QuantityStepper value={l.qty} onChange={(q) => setQty(l.id, q)} label={l.title} max={24} size="sm" />
                <b>{money(l.price * l.qty)}</b>
              </li>
            ))}
          </ul>
          <p className="al-sum__tot"><span>Total · pagas al recoger</span><b>{money(subtotal)}</b></p>
          <p className="al-mut al-small" aria-live="polite">{date && slot ? `${st.name.replace("Almíbar ", "")}, ${when}` : "Elige día y hora de recogida"}</p>
          <button type="submit" className="al-btn al-btn--pri al-btn--block">Apartar mi pedido · {money(subtotal)}</button>
          <p className="al-mut al-small al-missing" aria-live="polite">{tried && missing}</p>
          <button type="button" className="al-link" onClick={openCart}>Editar la bolsa</button>
        </aside>
      </form>
    </section>
  );
}

/* ---------- encargos: la tarta, la recogida y tus datos en una página; el precio y el botón siempre a la vista ---------- */
function Encargos() {
  const [size, setSize] = useState("10");
  const [sponge, setSponge] = useState("vainilla");
  const [filling, setFilling] = useState("pastelera");
  const [covering, setCovering] = useState("nata");
  const [toppings, setToppings] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [store, setStore] = useState(STORES[0].id);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [f, setF] = useState({ name: "", phone: "", notes: "" });
  const [tried, setTried] = useState(false);
  const [ok, setOk] = useState(false);
  const sel = { size, sponge, filling, covering, toppings };
  const price = cakePrice(sel);
  const deposit = price > 60 ? Math.round(price * 0.3) : 0;
  const algs = cakeAllergens(sel);
  const st = STORES.find((s) => s.id === store) ?? STORES[0];
  const lead = Number(size) >= 40 ? 7 : CAKE.leadDays;
  const label = (list: { value: string; label: string }[], v: string) => list.find((o) => o.value === v)?.label ?? v;
  const when = date ? `${longDay(date)}${slot ? ` a las ${slot}` : ""}` : "sin fecha";
  const missing = missingOf(date, slot, f);
  const cake = photo("pasteleria", 13);

  return (
    <section className="al-wrap al-sec">
      <Head as="h1" kicker="Tartas por encargo" title="Una tarta pensada para tu mesa" lead={`Elige y ves el precio al momento. Con ${CAKE.leadDays} días de antelación (7 las de pisos) y recogida en tienda. Te escribimos para confirmar.`} />
      <form className="al-order" onSubmit={(e) => { e.preventDefault(); setTried(true); if (!missing) setOk(true); }} noValidate>
        <div className="al-box al-flow">
          <fieldset className="al-part">
            <legend><span>1</span> La tarta</legend>
            <OptionPicker label="Tamaño" kind="chip" options={CAKE.sizes.map((s) => ({ value: s.value, label: s.label }))} value={size} onChange={(v) => { setSize(v); setDate(""); setSlot(""); }} />
            <OptionPicker label="Bizcocho" kind="swatch" options={CAKE.sponges.map((s) => ({ value: s.value, label: s.label, color: s.color }))} value={sponge} onChange={setSponge} />
            <OptionPicker label="Relleno" kind="swatch" options={CAKE.fillings.map((s) => ({ value: s.value, label: s.label, color: s.color }))} value={filling} onChange={setFilling} />
            <OptionPicker label="Cobertura" kind="chip" options={CAKE.coverings.map((s) => ({ value: s.value, label: s.label }))} value={covering} onChange={setCovering} />
            <CheckboxGroup label="Para decorar (opcional)" options={CAKE.toppings.map((t) => t.label).join(", ")} defaultValue={toppings.map((t) => label(CAKE.toppings, t)).join(", ")} onChange={(vals) => setToppings(CAKE.toppings.filter((t) => vals.includes(t.label)).map((t) => t.value))} variant="editorial" />
            {toppings.includes("mensaje") && <TextField label="Mensaje (máx. 30 letras)" placeholder="¡Feliz cumple, Lola!" value={message} onChange={(v) => setMessage(v.slice(0, 30))} variant="editorial" name="message" className="al-field" />}
          </fieldset>
          <fieldset className="al-part">
            <legend><span>2</span> Recogida</legend>
            <Pickup store={store} setStore={setStore} date={date} setDate={setDate} slot={slot} setSlot={setSlot} lead={lead} max={60} extraClosed="2026-12-25, 2027-01-01" />
          </fieldset>
          <fieldset className="al-part">
            <legend><span>3</span> A nombre de</legend>
            <Contact f={f} setF={setF} tried={tried} phoneLabel="Teléfono o WhatsApp" />
            <TextField label="Alergias o algo que debamos saber (opcional)" placeholder="Ej.: uno de los invitados es celíaco" value={f.notes} onChange={(v) => setF((s) => ({ ...s, notes: v }))} variant="editorial" name="notes" className="al-field" />
          </fieldset>
        </div>
        <aside className="al-box al-sum al-cake al-sum--sticky" aria-label="Tu tarta">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cake.src} alt="Caja de pastelería atada con cordel junto a un ramo de flores" loading="lazy" />
          <h2>Tu tarta</h2>
          <p className="al-mut al-small">{label(CAKE.sizes, size)} · {label(CAKE.sponges, sponge).toLowerCase()} con {label(CAKE.fillings, filling).toLowerCase()} · {label(CAKE.coverings, covering).toLowerCase()}{toppings.length ? ` · ${toppings.map((t) => label(CAKE.toppings, t).toLowerCase()).join(", ")}` : ""}</p>
          <p className="al-alg" aria-live="polite">Alérgenos: {algText(algs)}</p>
          <p className="al-sum__tot" aria-live="polite"><span>Precio</span><b>{money(price, "EUR", "es-ES", true)}</b></p>
          <p className="al-mut al-small">{deposit ? `Señal del 30 % (${money(deposit, "EUR", "es-ES", true)}) al confirmar por WhatsApp; se devuelve si cancelas con 48 h.` : "Sin señal: pagas al recoger."}</p>
          <p className="al-mut al-small" aria-live="polite">{date && slot ? `Recogida: ${st.name.replace("Almíbar ", "")}, ${when}` : "Recogida: sin elegir"}</p>
          <button type="submit" className="al-btn al-btn--pri al-btn--block">Encargar · {money(price, "EUR", "es-ES", true)}</button>
          <p className="al-mut al-small al-missing" aria-live="polite">{tried && missing}</p>
        </aside>
      </form>
      <Modal
        open={ok}
        onOpenChange={setOk}
        title="Encargo recibido"
        variant="editorial"
        confirmLabel="Perfecto"
        cancelLabel="Cerrar"
        onConfirm={() => sonnerToast.success("Encargo enviado", { description: `${label(CAKE.sizes, size)} · ${when}`, toasterId: TOAST })}
      >
        <p>
          {f.name.split(" ")[0] || "Gracias"}, te escribimos al {f.phone} en menos de dos horas (en horario de tienda) para confirmar la tarta de {label(CAKE.sponges, sponge).toLowerCase()} con {label(CAKE.fillings, filling).toLowerCase()}, {money(price, "EUR", "es-ES", true)}, para el {when} en {st.name}.
        </p>
        <p className="al-mut al-small">Web de demostración: no se ha enviado nada.</p>
      </Modal>
    </section>
  );
}

/* ---------- obrador ---------- */
function Obrador() {
  const clips = videos("obrador");
  return (
    <>
      <section className="al-wrap al-sec">
        <Head as="h1" kicker="El obrador" title="Desde 1987, de madrugada" lead="Somos una familia y seis personas más. Horneamos en la calle del Obrador para las dos tiendas, y por las tardes hacemos las tartas por encargo." />
        <div className="al-clips">
          {clips.slice(0, 3).map((c, i) => (
            <figure key={c.file} className={`al-clip al-clip--${i}`}>
              <video src={c.src} poster={c.posterSrc} muted loop playsInline autoPlay aria-label={c.alt} />
              <figcaption className="al-cap">{c.alt}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="al-wrap al-sec al-two">
        <Head kicker="Historia" title="Cinco fechas" />
        <Timeline steps={HISTORY} marker="dot" variant="editorial" />
      </section>
      <section className="al-wrap al-sec">
        <Head kicker="Cómo trabajamos" title="Tres reglas que no cambian" />
        <div className="al-values">
          {VALUES.map((v) => (
            <div key={v.t}>
              <b>{v.t}</b>
              <p>{v.d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="al-wrap al-sec">
        <TeamSection kicker="El equipo" title="Quién hace lo que comes" people={TEAM} variant="editorial" />
        <p className="al-mut al-small">Registro sanitario: {BRAND.sanitary}. Personas y nombres de este ejemplo son ficticios.</p>
      </section>
    </>
  );
}

/* ---------- tiendas ---------- */
function Tiendas() {
  return (
    <section className="al-wrap al-sec">
      <JsonLd data={bakeryJsonLd(href("tiendas"))} />
      <Head as="h1" kicker="Tiendas y horario" title="Dos tiendas, un obrador" lead="El horario se actualiza con los festivos de Zaragoza. Si vienes a por un encargo, pásate en la franja que elegiste." />
      <div className="al-stores al-stores--full">
        {STORES.map((s, i) => (
          <article key={s.id} className="al-store">
            <ImageReveal src={photo("pasteleria", i === 0 ? 0 : 11).src} alt={i === 0 ? "Vitrina de pan del obrador" : "Café con leche y una porción de tarta en una mesa de madera de la terraza"} ratio="16 / 10" from="left" />
            <h2>{s.name}</h2>
            <p className="al-mut">{s.address}<br />{s.zone}</p>
            {s.note && <p>{s.note}</p>}
            <OpeningHours hours={s.hours} exceptions={upcoming(s.exceptions)} layout="full" title="Horario" variant="minimal" />
            <ul className="al-services">
              {s.services.map((x) => <li key={x}>{x}</li>)}
            </ul>
            <div className="al-ctas">
              <a className="al-btn al-btn--pri" href={s.map} target="_blank" rel="noopener noreferrer">Cómo llegar</a>
              <a className="al-btn" href={BRAND.phoneHref}>Llamar</a>
              <a className="al-btn" href={BRAND.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const PAGES: Record<string, () => ReactNode> = { "": Home, carta: Carta, tienda: Tienda, pedido: Pedido, encargos: Encargos, obrador: Obrador, tiendas: Tiendas };

/** Cada página entra con un barrido frambuesa de abajo arriba (la cabecera se queda quieta: PageTransitionPersist). */
export function Page({ path }: { path: string[] }) {
  const route = path[0] ?? "";
  const P = PAGES[route];
  if (!P) return null;
  return (
    <PageTransition key={route} kind="wipe" direction="up" pace="normal" tone="acc">
      <P />
    </PageTransition>
  );
}
