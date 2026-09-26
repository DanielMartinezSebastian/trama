"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { toast as sonnerToast } from "sonner";
import Accordion from "@/components/ui/Accordion";
import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import CTASection from "@/components/ui/CTASection";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/ui/Hero";
import ImageGallery from "@/components/ui/ImageGallery";
import LogoCloud from "@/components/ui/LogoCloud";
import NavBar from "@/components/ui/NavBar";
import Prose from "@/components/ui/Prose";
import RadioGroup from "@/components/ui/RadioGroup";
import SectionHeader from "@/components/ui/SectionHeader";
import Select from "@/components/ui/Select";
import Stepper from "@/components/ui/Stepper";
import TableOfContents from "@/components/ui/TableOfContents";
import Tabs from "@/components/ui/Tabs";
import TestimonialSection from "@/components/ui/TestimonialSection";
import TextField from "@/components/ui/TextField";
import Toast from "@/components/ui/Toast";
import { renderGlyph } from "@/components/ui/Icon";
import { assetArt } from "@/lib/sites/art";
import { tokensToStyle } from "@/lib/ui/tokens";
import { PageHeader, Section, SiteFrame, euros, siteHref, useActiveIndex, useSiteNavigate } from "../shared";
import { CATEGORIES, COUPONS, FAQ, LEGAL, LICENSES, PRODUCTS, SLUG, VAT, type LicenseId, type Product } from "./data";
import "./pixelforge.css";

const TOKENS: CSSProperties = tokensToStyle({
  bg: "#140b26",
  fg: "#f4efff",
  mut: "#a99cc9",
  acc: "#ffcc4d",
  acc2: "#ff5c8a",
  card: "rgba(255,255,255,0.05)",
  ln: "rgba(255,255,255,0.14)",
  r: 6,
  font: 'var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif',
  display: 'var(--font-silkscreen), var(--font-space-mono), monospace',
});

const href = (p = "") => siteHref(SLUG, p);
const TOAST = "pf-toast";
const art = (p: Product, i = 0) => assetArt(p.seed + i * 5, i === 0 ? p.art : i === 1 ? (p.art === "sprite" ? "fx" : p.art) : "ui");
const licensePrice = (p: Product, l: LicenseId) => p.price * (LICENSES.find((x) => x.id === l)?.factor ?? 1);

/* ---------- carrito: contexto + localStorage (sobrevive a la navegación y a recargar) ---------- */
type Line = { slug: string; license: LicenseId; qty: number };
type Cart = {
  lines: Line[];
  add: (slug: string, license: LicenseId) => void;
  setQty: (i: number, qty: number) => void;
  remove: (i: number) => void;
  clear: () => void;
  count: number;
};
const CartCtx = createContext<Cart | null>(null);
const useCart = () => useContext(CartCtx)!;
const KEY = "pixelforge-cart";

function CartProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(saved)) setLines(saved.filter((l) => PRODUCTS.some((p) => p.slug === l.slug)));
    } catch {
      /* almacenamiento no disponible: el carrito vive solo en memoria */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* sin almacenamiento */
    }
  }, [lines, ready]);
  const cart: Cart = {
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    add: (slug, license) => {
      setLines((ls) => {
        const i = ls.findIndex((l) => l.slug === slug && l.license === license);
        if (i >= 0) return ls.map((l, k) => (k === i ? { ...l, qty: l.qty + 1 } : l));
        return [...ls, { slug, license, qty: 1 }];
      });
      const p = PRODUCTS.find((x) => x.slug === slug);
      sonnerToast.success(`${p?.name} en el carrito`, { description: `Licencia ${LICENSES.find((l) => l.id === license)?.name}.`, toasterId: TOAST, action: { label: "Ver carrito", onClick: () => router.push(href("carrito")) } });
    },
    setQty: (i, qty) => setLines((ls) => ls.map((l, k) => (k === i ? { ...l, qty: Math.max(1, Math.min(10, qty)) } : l))),
    remove: (i) => setLines((ls) => ls.filter((_, k) => k !== i)),
    clear: () => setLines([]),
  };
  return <CartCtx.Provider value={cart}>{children}</CartCtx.Provider>;
}

function CartButton() {
  const { count } = useCart();
  return (
    <Link href={href("carrito")} className="pf__cartbtn" aria-label={`Carrito, ${count} ${count === 1 ? "artículo" : "artículos"}`}>
      {renderGlyph("icon:shopping-cart", 20)}
      <span>Carrito</span>
      {count > 0 && <b>{count}</b>}
    </Link>
  );
}

/* ---------- marco ---------- */
export function Shell({ children }: { children: ReactNode }) {
  const navigate = useSiteNavigate();
  const L = [href(), href("tienda"), href("faq"), href("legal/licencias")];
  const active = useActiveIndex(L);
  return (
    <CartProvider>
      <SiteFrame tokens={TOKENS} className="pf">
        <div className="st-header pf__header">
          <NavBar
            brand="PIXELFORGE"
            links={`Inicio=${L[0]}\nTienda > ${CATEGORIES.map((c) => `${c}=${href("tienda")}#${c.toLowerCase()}`).join("; ")}; Todo el catálogo=${L[1]}\nAyuda=${L[2]}\nLicencias=${L[3]}`}
            defaultActive={active}
            search="button"
            searchPlaceholder="Buscar assets…"
            searchItems={PRODUCTS.map((p) => `${p.name}=${href(`producto/${p.slug}`)}`).join("\n")}
            cta=""
            announcement="Cupón PIXEL10: 10 % en tu primer pedido"
            layout="classic"
            shape="island"
            variant="retro"
            onNavigate={navigate}
          />
          <CartButton />
        </div>
        <main>{children}</main>
        <div className="st-wrap pf__footer">
          <Footer
            brand="PIXELFORGE"
            tagline="Assets de pixel art y sonido para juegos independientes. Hechos a mano en Valencia."
            columns={`Tienda: ${CATEGORIES.slice(0, 4).map((c) => `${c}=${href("tienda")}#${c.toLowerCase()}`).join(", ")}; Ayuda: Preguntas frecuentes=${href("faq")}, Licencias=${href("legal/licencias")}, Carrito=${href("carrito")}; Legal: Términos=${href("legal/terminos")}, Privacidad=${href("legal/privacidad")}`}
            social="icon:github, icon:discord, icon:youtube"
            copyright="© 2026 Pixelforge. Tienda de ejemplo: no se cobra nada."
            variant="retro"
          />
        </div>
        <Toast id={TOAST} position="bottom-right" variant="retro" intentStyle="bar" showTrigger={false} closeButton />
      </SiteFrame>
    </CartProvider>
  );
}

/** `level`: nivel del título según dónde vaya la tarjeta (2 en el listado de la tienda, bajo el h1; 3 bajo una sección). */
function ProductCard({ p, level = 3 }: { p: Product; level?: 2 | 3 }) {
  const H = level === 2 ? "h2" : "h3";
  const { add } = useCart();
  return (
    <article className="pf__card ui-surface ui-s ui-s--retro">
      <Link href={href(`producto/${p.slug}`)} className="pf__card-media">
        <img className="st-media st-media--43" src={art(p)} alt={p.name} loading="lazy" />
        {p.isNew && <span className="pf__new">Nuevo</span>}
      </Link>
      <div className="pf__card-body">
        <Badge text={p.category} variant="retro" intent="neutral" />
        <H>
          <Link href={href(`producto/${p.slug}`)}>{p.name}</Link>
        </H>
        <p className="st-muted">{p.short}</p>
        <div className="pf__card-foot">
          <span className="pf__price">
            desde <strong>{euros(p.price)}</strong>
          </span>
          <Button label="Añadir" size="sm" variant="retro" glyph="icon:plus" onClick={() => add(p.slug, "personal")} />
        </div>
        <span className="pf__rating">
          ★ {p.rating.toFixed(1)} · {p.reviews} reseñas
        </span>
      </div>
    </article>
  );
}

/* ---------- páginas ---------- */
function Home() {
  const best = [...PRODUCTS].sort((a, b) => b.reviews - a.reviews).slice(0, 4);
  return (
    <>
      <Section>
        <div className="pf__hero">
          <Hero
            kicker="ASSETS PARA JUEGOS INDIE"
            title="Tu juego, sin dibujar cada píxel"
            subtitle="Sprites, tilesets, sonido y fuentes hechos a mano, con licencia comercial clara y archivos fuente incluidos."
            primaryCta="Ver la tienda"
            primaryHref={href("tienda")}
            secondaryCta="Cómo funcionan las licencias"
            secondaryHref={href("legal/licencias")}
            badges="12.400 desarrolladores, Archivos fuente incluidos, Actualizaciones gratis"
            align="left"
            backdrop="grid"
            variant="retro"
          />
          <img className="pf__hero-art" src={assetArt(3, "sprite")} alt="" aria-hidden />
        </div>
      </Section>
      <Section tight>
        <SectionHeader kicker="Categorías" title="¿Qué necesita tu juego?" subtitle="" align="left" variant="retro" />
        <div className="pf__cats">
          {CATEGORIES.map((c, i) => (
            <Link key={c} href={`${href("tienda")}#${c.toLowerCase()}`} className="pf__cat ui-surface ui-s ui-s--retro">
              <img src={assetArt(i * 4 + 1, (["sprite", "tiles", "sfx", "font", "ui", "fx"] as const)[i])} alt="" aria-hidden />
              <span>{c}</span>
              <small>{PRODUCTS.filter((p) => p.category === c).length} packs</small>
            </Link>
          ))}
        </div>
      </Section>
      <Section tight>
        <div className="pf__row-head">
          <SectionHeader kicker="Lo más vendido" title="Los packs favoritos" subtitle="" align="left" variant="retro" />
          <Button label="Todo el catálogo" href={href("tienda")} variant="retro" emphasis="secondary" glyph="→" glyphPosition="end" />
        </div>
        <div className="st-grid st-grid--4">
          {best.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </Section>
      <Section tight>
        <LogoCloud label="Usado en juegos publicados en" brands="STEAM, ITCH.IO, NINTENDO ESHOP, GOOGLE PLAY, APP STORE, GOG" variant="retro" />
      </Section>
      <Section tight>
        <TestimonialSection
          kicker="Estudios que ya los usan"
          title="Lo que dicen"
          items={"Montamos el prototipo de nuestra demo en un fin de semana con Héroes y Mazmorra modular.|Leo Garrido|Tiny Anvil Games|5\nLos SFX retro nos ahorraron semanas: están normalizados y tienen variaciones de verdad.|Marta Solé|Estudio Faro|5\nLa licencia de estudio es lo más claro que he leído en una tienda de assets.|Iván Cruz|Productor, Bitlake|5"}
          variant="retro"
        />
      </Section>
      <Section>
        <CTASection title="¿Dudas con la licencia?" subtitle="Te explicamos cuál necesitas en dos líneas, sin letra pequeña." primaryCta="Preguntas frecuentes" primaryHref={href("faq")} secondaryCta="Ver licencias" secondaryHref={href("legal/licencias")} variant="retro" />
      </Section>
    </>
  );
}

const SORTS = ["Relevancia", "Precio: de menor a mayor", "Precio: de mayor a menor", "Mejor valorados", "Novedades"];
function Shop() {
  const [cats, setCats] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState(SORTS[0]);
  useEffect(() => {
    const read = () => {
      const h = decodeURIComponent(location.hash.slice(1));
      const c = CATEGORIES.find((x) => x.toLowerCase() === h);
      if (c) setCats([c]);
    };
    read();
    addEventListener("hashchange", read);
    return () => removeEventListener("hashchange", read);
  }, []);
  const n = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const list = useMemo(() => {
    const r = PRODUCTS.filter((p) => (!cats.length || cats.includes(p.category)) && (!q || n(`${p.name} ${p.short} ${p.category}`).includes(n(q))));
    if (sort === SORTS[1]) r.sort((a, b) => a.price - b.price);
    if (sort === SORTS[2]) r.sort((a, b) => b.price - a.price);
    if (sort === SORTS[3]) r.sort((a, b) => b.rating - a.rating);
    if (sort === SORTS[4]) r.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    return r;
  }, [cats, q, sort]);
  const toggle = (c: string) => setCats((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]));
  return (
    <Section>
      <PageHeader crumbs="Inicio, Tienda" title="Tienda" lead={`${PRODUCTS.length} packs de pixel art, sonido y fuentes. Todos con archivos fuente y actualizaciones gratis.`} />
      <div className="pf__shop">
        <aside className="pf__filters ui-surface ui-s ui-s--retro" aria-label="Filtros">
          <TextField label="Buscar" placeholder="mazmorra, sfx…" type="search" prefix=">" value={q} onChange={setQ} variant="retro" size="sm" />
          <div className="pf__filter-group">
            <span className="pf__filter-title">Categorías</span>
            {CATEGORIES.map((c) => (
              <Button key={c} label={`${c} (${PRODUCTS.filter((p) => p.category === c).length})`} size="sm" variant="retro" emphasis="ghost" active={cats.includes(c)} onClick={() => toggle(c)} />
            ))}
            {cats.length > 0 && <Button label="Quitar filtros" size="sm" variant="retro" emphasis="link" onClick={() => setCats([])} />}
          </div>
        </aside>
        <div className="pf__results">
          <div className="pf__toolbar">
            <p className="st-muted" role="status">
              {list.length} {list.length === 1 ? "pack" : "packs"}
              {cats.length ? ` en ${cats.join(", ")}` : ""}
            </p>
            <Select label="" options={SORTS.join(", ")} value={sort} onChange={setSort} variant="retro" size="sm" />
          </div>
          {list.length ? (
            <div className="st-grid st-grid--3">
              {list.map((p) => (
                <ProductCard key={p.slug} p={p} level={2} />
              ))}
            </div>
          ) : (
            <Alert intent="info" title="Nada por aquí" message="Ningún pack coincide con esos filtros. Prueba a quitar alguno." variant="retro" dismissible={false} />
          )}
        </div>
      </div>
    </Section>
  );
}

function ProductPage({ p }: { p: Product }) {
  const { add } = useCart();
  const [license, setLicense] = useState<LicenseId>("comercial");
  const lic = LICENSES.find((l) => l.id === license)!;
  const related = PRODUCTS.filter((x) => x !== p && (x.category === p.category || x.art === p.art)).concat(PRODUCTS.filter((x) => x !== p)).filter((x, i, a) => a.indexOf(x) === i).slice(0, 4);
  return (
    <>
      <Section>
        <div className="pf__crumbs">
          <Breadcrumbs items={`Inicio, Tienda, ${p.category}, ${p.name}`} variant="minimal" />
        </div>
        <div className="pf__product">
          <ImageGallery layout="thumbs" ratio="4/3" captions={false} images={[0, 1, 2].map((i) => `${art(p, i)}|${p.name}|Vista ${i + 1}`).join("\n")} variant="retro" />
          <div className="pf__buy">
            <Badge text={p.category} variant="retro" intent="neutral" />
            <h1>{p.name}</h1>
            <p className="pf__rating">
              ★ {p.rating.toFixed(1)} · {p.reviews} reseñas {p.isNew && <Badge text="Nuevo" variant="retro" intent="accent" />}
            </p>
            <p className="st-lead">{p.long}</p>
            <RadioGroup label="Licencia" options={LICENSES.map((l) => `${l.name} · ${euros(licensePrice(p, l.id))}`).join(", ")} defaultValue={`${lic.name} · ${euros(licensePrice(p, lic.id))}`} onChange={(v) => setLicense(LICENSES.find((l) => v.startsWith(l.name))!.id)} variant="retro" />
            <p className="st-muted pf__licnote">{lic.note}.</p>
            <div className="pf__buy-row">
              <span className="pf__bigprice">{euros(licensePrice(p, license))}</span>
              <Button label="Añadir al carrito" variant="retro" glyph="icon:shopping-cart" onClick={() => add(p.slug, license)} />
            </div>
            <p className="st-muted pf__formats">Formatos: {p.formats}</p>
          </div>
        </div>
      </Section>
      <Section tight>
        <Tabs
          items="Contenido del pack, Formatos, Licencia"
          content={[p.includes.join(" · "), `Incluye ${p.formats}. Descarga inmediata en un .zip; las actualizaciones llegan a tu cuenta sin coste.`, `${lic.name}: ${lic.note}. Puedes modificar los assets; no puedes revenderlos como assets. Ver la página de licencias para el detalle.`].join("\n")}
          variant="retro"
        />
      </Section>
      <Section tight>
        <SectionHeader kicker="Combina con" title="También te puede servir" subtitle="" align="left" variant="retro" />
        <div className="st-grid st-grid--4">
          {related.map((r) => (
            <ProductCard key={r.slug} p={r} />
          ))}
        </div>
      </Section>
    </>
  );
}

const STEPS = ["Carrito", "Datos", "Pago", "Listo"];
function CartPage() {
  const cart = useCart();
  const [step, setStep] = useState(0);
  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");
  const [buyer, setBuyer] = useState({ name: "", email: "", country: "España" });
  const [order, setOrder] = useState<{ n: string; total: number; items: number } | null>(null);
  const rows = cart.lines.map((l) => ({ ...l, p: PRODUCTS.find((p) => p.slug === l.slug)!, unit: licensePrice(PRODUCTS.find((p) => p.slug === l.slug)!, l.license) }));
  const subtotal = rows.reduce((s, r) => s + r.unit * r.qty, 0);
  const discount = coupon ? subtotal * COUPONS[coupon] : 0;
  const vat = (subtotal - discount) * VAT;
  const total = subtotal - discount + vat;
  const applyCoupon = () => {
    const c = code.trim().toUpperCase();
    if (COUPONS[c]) {
      setCoupon(c);
      setCouponError("");
    } else setCouponError("Ese cupón no existe o ha caducado.");
  };
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email);

  if (order)
    return (
      <Section>
        <div className="pf__done ui-surface ui-s ui-s--retro">
          <Stepper steps={STEPS.join(", ")} current={3} variant="retro" />
          <h1>¡Pedido {order.n} listo!</h1>
          <p className="st-lead">
            {order.items} {order.items === 1 ? "pack" : "packs"} por {euros(order.total)}. Te hemos enviado los enlaces de descarga a {buyer.email}. (Es una tienda de ejemplo: no se ha cobrado nada.)
          </p>
          <div className="st-row">
            <Button label="Seguir comprando" href={href("tienda")} variant="retro" />
            <Button label="Volver al inicio" href={href()} variant="retro" emphasis="secondary" />
          </div>
        </div>
      </Section>
    );

  return (
    <Section>
      <PageHeader crumbs="Inicio, Carrito" title="Carrito" />
      <div className="pf__stepper">
        <Stepper steps={STEPS.join(", ")} current={step} variant="retro" />
      </div>
      {rows.length === 0 ? (
        <div className="pf__empty ui-surface ui-s ui-s--retro">
          <p className="st-lead">Tu carrito está vacío. Los packs que añadas se guardan aunque cierres la pestaña.</p>
          <Button label="Ir a la tienda" href={href("tienda")} variant="retro" />
        </div>
      ) : (
        <div className="pf__checkout">
          <div className="pf__steps">
            {step === 0 && (
              <ul className="pf__lines">
                {rows.map((r, i) => (
                  <li key={`${r.slug}-${r.license}`} className="pf__line ui-surface ui-s ui-s--retro">
                    <img src={art(r.p)} alt="" aria-hidden />
                    <div>
                      <Link href={href(`producto/${r.slug}`)}>
                        <strong>{r.p.name}</strong>
                      </Link>
                      <span className="st-muted">Licencia {LICENSES.find((l) => l.id === r.license)?.name} · {euros(r.unit)}</span>
                    </div>
                    <div className="pf__qty" role="group" aria-label={`Cantidad de ${r.p.name}`}>
                      <button type="button" aria-label="Quitar uno" onClick={() => cart.setQty(i, r.qty - 1)} disabled={r.qty <= 1}>
                        −
                      </button>
                      <output>{r.qty}</output>
                      <button type="button" aria-label="Añadir uno" onClick={() => cart.setQty(i, r.qty + 1)}>
                        +
                      </button>
                    </div>
                    <strong className="pf__line-total">{euros(r.unit * r.qty)}</strong>
                    <Button label={`Quitar ${r.p.name}`} iconOnly glyph="icon:trash" size="sm" variant="retro" emphasis="ghost" onClick={() => cart.remove(i)} />
                  </li>
                ))}
              </ul>
            )}
            {step === 1 && (
              <div className="pf__form ui-surface ui-s ui-s--retro">
                <h2>Tus datos</h2>
                <TextField label="Nombre o estudio" placeholder="Tiny Anvil Games" value={buyer.name} onChange={(v) => setBuyer((b) => ({ ...b, name: v }))} variant="retro" />
                <TextField label="Correo" type="email" placeholder="tu@correo.com" hint="Aquí te llegan los enlaces de descarga y la factura." value={buyer.email} onChange={(v) => setBuyer((b) => ({ ...b, email: v }))} intent={buyer.email && !emailOk ? "danger" : undefined} variant="retro" />
                <Select label="País (para el IVA)" options="España, Portugal, Francia, Alemania, Italia, México, Argentina, Otro" value={buyer.country} onChange={(v) => setBuyer((b) => ({ ...b, country: v }))} variant="retro" />
              </div>
            )}
            {step === 2 && (
              <div className="pf__form ui-surface ui-s ui-s--retro">
                <h2>Pago</h2>
                <RadioGroup label="Método" options="Tarjeta, PayPal, Transferencia" defaultValue="Tarjeta" variant="retro" />
                <Alert intent="info" title="Tienda de ejemplo" message="No se piden datos de tarjeta ni se cobra nada: al confirmar se simula el pedido." variant="retro" dismissible={false} />
              </div>
            )}
          </div>
          <aside className="pf__summary ui-surface ui-s ui-s--retro" aria-label="Resumen del pedido">
            <h2>Resumen</h2>
            <dl>
              <div>
                <dt>Subtotal</dt>
                <dd>{euros(subtotal)}</dd>
              </div>
              {coupon && (
                <div className="pf__discount">
                  <dt>Cupón {coupon}</dt>
                  <dd>−{euros(discount)}</dd>
                </div>
              )}
              <div>
                <dt>IVA (21 %)</dt>
                <dd>{euros(vat)}</dd>
              </div>
              <div className="pf__total">
                <dt>Total</dt>
                <dd>{euros(total)}</dd>
              </div>
            </dl>
            {step === 0 && !coupon && (
              <div className="pf__coupon">
                <TextField label="Cupón" placeholder="PIXEL10" value={code} onChange={setCode} intent={couponError ? "danger" : undefined} hint={couponError} variant="retro" size="sm" />
                <Button label="Aplicar" size="sm" variant="retro" emphasis="secondary" onClick={applyCoupon} />
              </div>
            )}
            <div className="pf__nav">
              {step > 0 && <Button label="Atrás" variant="retro" emphasis="ghost" onClick={() => setStep((s) => s - 1)} />}
              {step < 2 && <Button label={step === 0 ? "Continuar" : "Ir al pago"} variant="retro" fullWidth disabled={step === 1 && (!buyer.name.trim() || !emailOk)} onClick={() => setStep((s) => s + 1)} />}
              {step === 2 && (
                <Button
                  label={`Pagar ${euros(total)}`}
                  variant="retro"
                  fullWidth
                  onClick={() => {
                    setOrder({ n: `PF-${Math.floor(10000 + Math.random() * 89999)}`, total, items: cart.count });
                    cart.clear();
                  }}
                />
              )}
            </div>
          </aside>
        </div>
      )}
    </Section>
  );
}

function FaqPage() {
  return (
    <Section>
      <PageHeader crumbs="Inicio, Preguntas frecuentes" title="Preguntas frecuentes" lead="Compras, licencias y descargas. Si no encuentras lo que buscas, escríbenos a soporte@pixelforge.dev." />
      <div className="pf__faq">
        {FAQ.map((g) => (
          <div key={g.group}>
            <h2>{g.group}</h2>
            <Accordion items={g.items} variant="retro" defaultOpen={-1} />
          </div>
        ))}
      </div>
    </Section>
  );
}

function LegalPage({ k }: { k: string }) {
  const l = LEGAL[k];
  return (
    <Section>
      <PageHeader crumbs={`Inicio, Legal, ${l.title}`} title={l.title} lead={l.lead} />
      <div className="pf__legal">
        <aside>
          <TableOfContents markdown={l.body} title="En esta página" kind="numbered" sticky variant="retro" />
          <nav className="pf__legal-nav" aria-label="Otras páginas legales">
            {Object.entries(LEGAL).map(([key, v]) => (
              <Link key={key} href={href(`legal/${key}`)} aria-current={key === k ? "page" : undefined}>
                {v.title}
              </Link>
            ))}
          </nav>
        </aside>
        <Prose markdown={l.body} variant="minimal" measure="normal" />
      </div>
    </Section>
  );
}

export function Page({ path }: { path: string[] }) {
  const [a, b] = path;
  if (!a) return <Home />;
  if (a === "tienda") return <Shop />;
  if (a === "producto") {
    const p = PRODUCTS.find((x) => x.slug === b);
    if (p) return <ProductPage p={p} />;
  }
  if (a === "carrito") return <CartPage />;
  if (a === "faq") return <FaqPage />;
  if (a === "legal" && b && LEGAL[b]) return <LegalPage k={b} />;
  return null;
}
