"use client";

import { createContext, useContext, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import CartDrawer from "@/components/ui/CartDrawer";
import EmptyState from "@/components/ui/EmptyState";
import FilterBar from "@/components/ui/FilterBar";
import OptionPicker from "@/components/ui/OptionPicker";
import PriceTag from "@/components/ui/PriceTag";
import ProductCard from "@/components/ui/ProductCard";
import ProductGallery from "@/components/ui/ProductGallery";
import QuantityStepper from "@/components/ui/QuantityStepper";
import RadioGroup from "@/components/ui/RadioGroup";
import RollLink from "@/components/ui/RollLink";
import SplitText from "@/components/ui/SplitText";
import Stepper from "@/components/ui/Stepper";
import TextField from "@/components/ui/TextField";
import { useCart } from "@/lib/commerce/cart";
import { money } from "@/lib/commerce/money";
import { photo } from "@/lib/sites/photos";
import { potteryArt } from "@/lib/sites/art";
import { editorialTokens, tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame, siteHref } from "../shared";
import { FREE_SHIPPING, MATERIALS, PRODUCTS, SHIPPING, SLUG, TYPES, type Product } from "./data";
import "./barro.css";

// tema del kit `editorialTokens` con la paleta de la marca (arcilla y terracota)
const TOKENS: CSSProperties = tokensToStyle({ ...editorialTokens, bg: "#f4eee4", fg: "#231a14", mut: "#4f4338", card: "#eadfce", ln: "rgba(35,26,20,0.16)", acc: "#b5532f", acc2: "#231a14", r: 14 });

const href = (p = "") => siteHref(SLUG, p);
const img = (p: Product, glazeIdx = 0, view = 0) => potteryArt(p.seed + view, p.kind, p.glazes[glazeIdx]?.color);
const firstAvailable = (p: Product) => Math.max(0, p.glazes.findIndex((g) => !g.soldOut));

type Cart = ReturnType<typeof useCart> & { openCart: () => void };
const CartCtx = createContext<Cart | null>(null);
const useShop = () => useContext(CartCtx)!;

/* ---------- marco ---------- */
export function Shell({ children }: { children: ReactNode }) {
  const cart = useCart("trama:barro");
  const [open, setOpen] = useState(false);
  const value = useMemo<Cart>(() => ({ ...cart, openCart: () => setOpen(true) }), [cart]);
  return (
    <SiteFrame tokens={TOKENS} className="br">
      <CartCtx.Provider value={value}>
        <header className="br-head">
          <a className="br-brand" href={href()}>Barro</a>
          <nav className="br-nav" aria-label="Principal">
            <RollLink label="Tienda" href={href("tienda")} />
          </nav>
          <button type="button" className="br-cartbtn" onClick={() => setOpen(true)} aria-haspopup="dialog">
            <span>Carrito</span>
            <b aria-label={`${cart.count} artículos`}>{cart.count}</b>
          </button>
        </header>
        <main id="contenido">{children}</main>
        <footer className="br-wrap" style={{ padding: "48px var(--st-gutter) 32px", borderTop: "1px solid var(--ln)", color: "var(--mut)", fontSize: 14, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12 }}>
          <span>© 2026 Barro · Cerámica hecha a mano en Teruel</span>
          <span>Demo de Trama: no se cobra ni se envía nada · <a href="/creditos">Créditos de las imágenes</a></span>
        </footer>
        <CartDrawer
          open={open}
          onOpenChange={setOpen}
          lines={cart.lines}
          onQty={cart.setQty}
          onRemove={cart.remove}
          freeShippingFrom={FREE_SHIPPING}
          checkoutHref={href("pedido")}
          continueHref={href("tienda")}
          emptyText="Aún no has añadido nada. Las piezas más bonitas se agotan pronto."
        />
      </CartCtx.Provider>
    </SiteFrame>
  );
}

/* ---------- inicio ---------- */
function cardOf(p: Product) {
  const gi = firstAvailable(p);
  const allOut = p.glazes.every((g) => g.soldOut);
  return <ProductCard key={p.slug} title={p.title} price={p.price} compareAt={p.compareAt} badge={p.badge} meta={`${p.type} · ${p.material}`} image={img(p, gi)} hoverImage={img(p, gi, 2)} alt={`${p.title}, ${p.glazes[gi].label}`} href={href(`producto/${p.slug}`)} soldOut={allOut} />;
}

function Home() {
  return (
    <>
      <div className="br-wrap br-hero">
        <div className="br-hero__copy">
          <SplitText as="h1" by="lines" trigger="mount" className="br-h1">Cerámica para el día a día.</SplitText>
          <p className="br-lead">Piezas torneadas y esmaltadas a mano en un taller pequeño. Cada una sale un poco distinta, y por eso nos gustan.</p>
          <a className="br-cta" href={href("tienda")}>Ver la tienda</a>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo("objetos", 4).src} alt="Jarrón de cerámica con tulipanes sobre una mesa" />
      </div>
      <section className="br-wrap br-sec">
        <div className="br-row"><h2 className="br-h2">Lo más querido</h2><RollLink label="Ver todo →" href={href("tienda")} /></div>
        <div className="br-grid">{PRODUCTS.slice(0, 4).map(cardOf)}</div>
      </section>
      <section className="br-wrap br-sec" style={{ paddingTop: 0 }}>
        <div className="br-values">
          <div><b>Hecho a mano</b><p>Torneado y esmaltado pieza a pieza. Pequeñas diferencias son parte del encanto.</p></div>
          <div><b>Envío gratis desde {money(FREE_SHIPPING, "EUR", "es-ES", true)}</b><p>Embalado con papel y sin plásticos. Entrega en 2–4 días laborables.</p></div>
          <div><b>30 días para devolver</b><p>Si no es lo que esperabas, la recogemos y te devolvemos el importe.</p></div>
        </div>
      </section>
    </>
  );
}

/* ---------- tienda ---------- */
function Shop() {
  const [values, setValues] = useState<Record<string, string[]>>({ tipo: [], material: [] });
  const [sort, setSort] = useState("destacados");
  const shown = useMemo(() => {
    let out = PRODUCTS.filter((p) => (values.tipo.length === 0 || values.tipo.includes(p.type)) && (values.material.length === 0 || values.material.includes(p.material)));
    if (sort === "precio-asc") out = [...out].sort((a, b) => a.price - b.price);
    if (sort === "precio-desc") out = [...out].sort((a, b) => b.price - a.price);
    return out;
  }, [values, sort]);
  const count = (key: "type" | "material", v: string) => PRODUCTS.filter((p) => p[key] === v).length;
  return (
    <section className="br-wrap br-sec">
      <div className="br-row"><h1 className="br-h2">Tienda</h1></div>
      <FilterBar
        groups={[
          { id: "tipo", label: "Tipo", options: TYPES.map((t) => ({ value: t, label: t, count: count("type", t) })) },
          { id: "material", label: "Material", options: MATERIALS.map((m) => ({ value: m, label: m[0].toUpperCase() + m.slice(1), count: count("material", m) })) },
        ]}
        values={values}
        onChange={setValues}
        sort={{ value: sort, onChange: setSort, options: [{ value: "destacados", label: "Destacados" }, { value: "precio-asc", label: "Precio: de menor a mayor" }, { value: "precio-desc", label: "Precio: de mayor a menor" }] }}
        total={shown.length}
        noun="piezas"
      />
      <div className="br-grid" style={{ marginTop: 28 }}>{shown.map(cardOf)}</div>
      {shown.length === 0 && <EmptyState title="Ninguna pieza con esos filtros" text="Prueba a quitar alguno para ver más." glyph="◌" />}
    </section>
  );
}

/* ---------- ficha ---------- */
function ProductPage({ slug }: { slug: string }) {
  const p = PRODUCTS.find((x) => x.slug === slug)!;
  const { add, openCart } = useShop();
  const [gi, setGi] = useState(firstAvailable(p));
  const [size, setSize] = useState(p.sizes[0].value);
  const [qty, setQty] = useState(1);
  const sz = p.sizes.find((s) => s.value === size) ?? p.sizes[0];
  const glaze = p.glazes[gi];
  const price = p.price + sz.extra;
  const out = p.glazes.every((g) => g.soldOut);
  const related = PRODUCTS.filter((x) => x.slug !== p.slug && x.type === p.type).slice(0, 4);
  const images = [0, 1, 2].map((k) => ({ src: img(p, gi, k), alt: `${p.title}, ${glaze.label}, vista ${k + 1}` }));
  const addToCart = () => {
    add({ id: `${p.slug}-${glaze.value}-${sz.value}`, title: p.title, price, image: img(p, gi), meta: `${glaze.label}${p.sizes.length > 1 ? ` · ${sz.label}` : ""}` }, qty);
    openCart();
  };
  return (
    <>
      <div className="br-wrap br-pdp">
        <ProductGallery key={glaze.value} images={images} thumbs="side" />
        <div className="br-buy">
          <p className="br-crumbs"><a href={href("tienda")}>Tienda</a> / {p.type}</p>
          <h1 className="br-h2">{p.title}</h1>
          <PriceTag price={price} compareAt={p.compareAt ? p.compareAt + sz.extra : undefined} size="lg" />
          <p className="br-lead">{p.lead}</p>
          <OptionPicker label="Esmalte" kind="swatch" options={p.glazes.map((g) => ({ value: g.value, label: g.label, color: g.color, disabled: g.soldOut }))} value={glaze.value} onChange={(v) => setGi(p.glazes.findIndex((g) => g.value === v))} />
          {p.sizes.length > 1 && <OptionPicker label="Tamaño" kind="chip" options={p.sizes.map((s) => ({ value: s.value, label: s.label }))} value={size} onChange={setSize} />}
          <div className="br-add">
            <QuantityStepper value={qty} onChange={setQty} label={p.title} max={10} />
            <button type="button" className="br-go" disabled={out || glaze.soldOut} onClick={addToCart}>{out || glaze.soldOut ? "Agotado" : `Añadir al carrito · ${money(price * qty)}`}</button>
          </div>
          <p className="br-note">Envío gratis desde {money(FREE_SHIPPING, "EUR", "es-ES", true)} · 30 días para devolver</p>
          <ul className="br-list">{p.details.map((d) => <li key={d}>{d}</li>)}</ul>
        </div>
      </div>
      {related.length > 0 && (
        <section className="br-wrap br-sec">
          <div className="br-row"><h2 className="br-h2">También te puede gustar</h2></div>
          <div className="br-grid">{related.map(cardOf)}</div>
        </section>
      )}
    </>
  );
}

/* ---------- pedido ---------- */
function Order() {
  const { lines, subtotal, clear, openCart } = useShop();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ name: "", email: "", address: "", city: "" });
  const [ship, setShip] = useState<"Estándar" | "Exprés">("Estándar");
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));
  const shipping = subtotal >= FREE_SHIPPING && ship === "Estándar" ? 0 : ship === "Exprés" ? SHIPPING.expres : SHIPPING.estandar;
  const total = subtotal + (lines.length ? shipping : 0);
  const valid = f.name.trim() && /\S+@\S+\.\S+/.test(f.email) && f.address.trim() && f.city.trim();

  if (done) {
    return (
      <div className="br-wrap br-done">
        <h1 className="br-h2">Gracias, {f.name.split(" ")[0] || "amiga"}.</h1>
        <p className="br-lead">Este era un pedido de demostración: no se ha cobrado ni enviado nada. Si fuera real, te habría llegado un correo a {f.email}.</p>
        <a className="br-cta" href={href("tienda")}>Volver a la tienda</a>
      </div>
    );
  }
  if (lines.length === 0) {
    return (
      <div className="br-wrap br-sec">
        <EmptyState title="Tu carrito está vacío" text="Añade alguna pieza para poder hacer el pedido." glyph="◌">
          <a className="br-cta" href={href("tienda")}>Ir a la tienda</a>
        </EmptyState>
      </div>
    );
  }
  return (
    <div className="br-wrap br-sec">
      <h1 className="br-h2" style={{ marginBottom: 24 }}>Tu pedido</h1>
      <Stepper steps="Datos, Envío, Revisión" current={step} variant="editorial" />
      <div className="br-order" style={{ marginTop: 28 }}>
        <div className="br-box">
          {step === 0 && (
            <>
              <h2>Tus datos</h2>
              <TextField label="Nombre y apellidos" placeholder="Ana Prueba" className="br-field" value={f.name} onChange={set("name")} variant="editorial" name="name" required />
              <TextField label="Correo electrónico" placeholder="ana@ejemplo.com" className="br-field" type="email" value={f.email} onChange={set("email")} variant="editorial" name="email" required hint="Solo para el aviso de envío. Esto es una demo: no se envía a ningún sitio." />
              <TextField label="Dirección" placeholder="Calle Mayor 1" className="br-field" value={f.address} onChange={set("address")} variant="editorial" name="address" required />
              <TextField label="Ciudad" placeholder="Teruel" className="br-field" value={f.city} onChange={set("city")} variant="editorial" name="city" required />
              <div className="br-actions"><span /><button type="button" className="br-cta" disabled={!valid} style={{ border: 0, cursor: valid ? "pointer" : "not-allowed", opacity: valid ? 1 : 0.45 }} onClick={() => setStep(1)}>Continuar</button></div>
            </>
          )}
          {step === 1 && (
            <>
              <h2>Envío</h2>
              <RadioGroup label="Método de envío" options="Estándar, Exprés" defaultValue={ship} onChange={(v) => setShip(v as "Estándar" | "Exprés")} variant="editorial" />
              <p className="br-note">Estándar: 2–4 días, {subtotal >= FREE_SHIPPING ? "gratis" : money(SHIPPING.estandar)}. Exprés: 24 h, {money(SHIPPING.expres)}.</p>
              <div className="br-actions"><button type="button" className="br-cartbtn" style={{ margin: 0 }} onClick={() => setStep(0)}>Atrás</button><button type="button" className="br-cta" style={{ border: 0, cursor: "pointer" }} onClick={() => setStep(2)}>Continuar</button></div>
            </>
          )}
          {step === 2 && (
            <>
              <h2>Revisa y confirma</h2>
              <p className="br-note">{f.name} · {f.address}, {f.city} · {f.email}</p>
              <p className="br-note">Envío {ship.toLowerCase()}. <b>Demo: no se solicita ningún dato de pago ni se cobra nada.</b></p>
              <div className="br-actions"><button type="button" className="br-cartbtn" style={{ margin: 0 }} onClick={() => setStep(1)}>Atrás</button><button type="button" className="br-cta" style={{ border: 0, cursor: "pointer" }} onClick={() => { setDone(true); clear(); }}>Confirmar pedido de prueba</button></div>
            </>
          )}
        </div>
        <aside className="br-box" aria-label="Resumen del pedido">
          <h2>Resumen</h2>
          <ul className="br-sum">
            {lines.map((l) => (
              <li key={l.id}><span>{l.qty} × {l.title}{l.meta ? ` (${l.meta})` : ""}</span><span>{money(l.price * l.qty)}</span></li>
            ))}
            <li><span>Subtotal</span><span>{money(subtotal)}</span></li>
            <li><span>Envío</span><span>{shipping === 0 ? "Gratis" : money(shipping)}</span></li>
            <li className="br-tot"><span>Total</span><span>{money(total)}</span></li>
          </ul>
          <button type="button" className="br-cartbtn" style={{ margin: 0, justifySelf: "start" }} onClick={openCart}>Editar carrito</button>
        </aside>
      </div>
    </div>
  );
}

export function Page({ path }: { path: string[] }) {
  const [a, b] = path;
  if (!a) return <Home />;
  if (a === "tienda") return <Shop />;
  if (a === "producto" && b && PRODUCTS.some((p) => p.slug === b)) return <ProductPage key={b} slug={b} />;
  if (a === "pedido") return <Order />;
  return null;
}
