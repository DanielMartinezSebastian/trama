"use client";

import dynamic from "next/dynamic";
import { createContext, useContext, useState, type CSSProperties, type ReactNode } from "react";
import CartDrawer from "@/components/ui/CartDrawer";
import CheckoutFlow from "@/components/ui/CheckoutFlow";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import Marquee from "@/components/ui/Marquee";
import OptionPicker from "@/components/ui/OptionPicker";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { useCart } from "@/lib/commerce/cart";
import { money } from "@/lib/commerce/money";
import { Esquinas } from "./AbuelaRosa";
import { HISTORIA, MOJOS, RECETAS, TAMANOS, type Mojo } from "./data";
import { abuelaHref } from "./enlaces";
import "./abuela-rosa.css";

/*
 * Abuela Rosa con varias páginas (docs/56): la portada (AbuelaRosa.tsx) y la tienda con la ficha de cada mojo (tamaño,
 * cantidad y nivel de picante), la bolsa (CartDrawer) y el pedido (CheckoutFlow), las recetas con su mojo y la historia.
 * Los botes de la tienda son el mismo bote en CSS de la portada, cada uno con su tinta; en la bolsa, un SVG pequeño. El
 * marco persiste: la cinta «COMPRA YA» con la navegación (menú a pantalla completa en el móvil) y el pie.
 */

const Portada = dynamic(() => import("./AbuelaRosa"));
const Bolsa = createContext<{ carrito: ReturnType<typeof useCart>; abrir: () => void } | null>(null);
const useBolsa = () => useContext(Bolsa)!;
const NAV: [string, string][] = [
  ["tienda", "TIENDA"],
  ["recetas", "RECETAS"],
  ["historia", "HISTORIA"],
];
const COLOR: Record<string, string> = { "mojo-picon": "#e8612c", "mojo-verde": "#5c9a2e", "mojo-diablo": "#9c1a14", trio: "#e8612c" };

/** el bote en SVG para las líneas de la bolsa y el pedido */
const miniatura = (id: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><rect width="60" height="60" fill="#141329"/><rect x="25" y="6" width="10" height="7" rx="1" fill="#222"/><rect x="25" y="13" width="10" height="11" fill="#1b1b1b"/><rect x="16" y="22" width="28" height="34" rx="6" fill="${COLOR[id] ?? "#e8612c"}"/><rect x="19" y="32" width="22" height="14" fill="#fff3e6"/></svg>`)}`;

export function Bote({ mojo, className = "" }: { mojo: Mojo; className?: string }) {
  return (
    <div className={`ar-bote ar-bote--prod ${className}`} style={{ "--tinta": mojo.tinta } as CSSProperties} aria-hidden>
      <span className="ar-bote__tapon" />
      <span className="ar-bote__cuello">
        <b>ABUELA ROSA</b>
      </span>
      <span className="ar-bote__cuerpo">
        <span className="ar-bote__etiqueta">
          <small>ABUELA ROSA</small>
          <b>
            {mojo.etiqueta.split("\n").map((l, i) => (
              <span key={l}>
                {i > 0 && <br />}
                {l}
              </span>
            ))}
          </b>
          <small>{mojo.shu}</small>
        </span>
      </span>
    </div>
  );
}

const Llamas = ({ n }: { n: number }) => (
  <span className="ar-llamas" aria-label={`Picante: ${n} de 5`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <i key={i} aria-hidden className={i <= n ? "is-on" : ""}>
        ▲
      </i>
    ))}
  </span>
);

export function Shell({ children }: { children: ReactNode }) {
  const [bolsa, setBolsa] = useState(false);
  const carrito = useCart("trama:abuela-rosa:bolsa");
  const links = [{ label: "INICIO", href: abuelaHref() }, ...NAV.map(([p, l]) => ({ label: l, href: abuelaHref(p) }))];
  return (
    <Bolsa.Provider value={{ carrito, abrir: () => setBolsa(true) }}>
      <div className="ar" id="top">
        <header className="ar-head">
          <a href={abuelaHref("tienda")} className="ar-head__cinta" aria-label="Compra ya: ir a la tienda">
            <Marquee variant="minimal" text="COMPRA YA" separator="  ✶  " rows={1} duration={18} className="ar-cinta" />
          </a>
          <div className="ar-head__fila">
            <a href={abuelaHref()} className="ar-logo">
              ABUELA ROSA
            </a>
            <nav aria-label="Principal">
              {NAV.map(([p, l]) => (
                <a key={p} href={abuelaHref(p)}>
                  {l}
                </a>
              ))}
            </nav>
            <button type="button" className="ar-bolsa" onClick={() => setBolsa(true)}>
              BOLSA ({carrito.count})
            </button>
            <FullscreenMenu brand="ABUELA ROSA" trigger="burger" openLabel="MENÚ" closeLabel="CERRAR" note="MOJO A MORTERO DESDE 1976" links={links} className="ar-menu" />
          </div>
        </header>
        {children}
        <footer className="ar-pie">
          <nav aria-label="Pie">
            {NAV.map(([p, l]) => (
              <a key={p} href={abuelaHref(p)}>
                {l}
              </a>
            ))}
            <a href="mailto:hola@abuelarosa.example">ESCRÍBENOS</a>
          </nav>
          <p>ENVÍO GRATIS DESDE 30 € · ENTREGA EN 48–72 H · HECHO EN CANARIAS</p>
          <small>© 2026 ABUELA ROSA · TIENDA DE DEMOSTRACIÓN DE TRAMA</small>
        </footer>
        <CartDrawer open={bolsa} onOpenChange={setBolsa} lines={carrito.lines} onQty={carrito.setQty} onRemove={carrito.remove} title="Tu bolsa" freeShippingFrom={30} checkoutHref={abuelaHref("pedido")} checkoutLabel="Finalizar pedido" continueHref={abuelaHref("tienda")} />
      </div>
    </Bolsa.Provider>
  );
}

function Cab({ titulo, texto }: { titulo: string; texto?: string }) {
  return (
    <header className="ar-pag__cab">
      <h1 className="ar-gigante">{titulo}</h1>
      {texto && <p>{texto}</p>}
    </header>
  );
}

function Tienda() {
  return (
    <main className="ar-pag">
      <Cab titulo="LA TIENDA" texto="TRES MOJOS Y UNA CAJA PARA LOS TRES. ENVÍO GRATIS DESDE 30 €." />
      <div className="ar-tienda">
        {MOJOS.map((m) => (
          <a key={m.id} href={abuelaHref(`tienda/${m.id}`)} className="ar-marco ar-producto">
            <Esquinas />
            <Bote mojo={m} />
            <h2>{m.nombre}</h2>
            <Llamas n={m.picante} />
            <b>{m.tamanos ? `DESDE ${money(m.precio)}` : money(m.precio)}</b>
          </a>
        ))}
      </div>
    </main>
  );
}

function Producto({ id }: { id: string }) {
  const { carrito, abrir } = useBolsa();
  const m = MOJOS.find((x) => x.id === id)!;
  const [tamano, setTamano] = useState("148");
  const [n, setN] = useState(1);
  const extra = m.tamanos ? (TAMANOS.find((t) => t.value === tamano)?.extra ?? 0) : 0;
  const precio = m.precio + extra;
  const recetas = RECETAS.filter((r) => r.mojo === m.id);
  return (
    <main className="ar-pag">
      <a href={abuelaHref("tienda")} className="ar-volver">
        ← LA TIENDA
      </a>
      <div className="ar-ficha">
        <div className="ar-marco ar-ficha__bote">
          <Esquinas />
          <Bote mojo={m} />
        </div>
        <div className="ar-ficha__info">
          <h1>{m.nombre}</h1>
          <p className="ar-ficha__precio">{money(precio)}</p>
          <Llamas n={m.picante} />
          <p>{m.texto}</p>
          {m.tamanos && <OptionPicker kind="chip" label="TAMAÑO" options={TAMANOS.map((t) => ({ value: t.value, label: t.extra ? `${t.label} (+${money(t.extra)})` : t.label }))} value={tamano} onChange={setTamano} />}
          <QuantityStepper value={n} onChange={setN} min={1} max={12} label="Cantidad" />
          <button
            type="button"
            className="ar-comprar"
            onClick={() => {
              carrito.add({ id: m.tamanos ? `${m.id}-${tamano}` : m.id, title: m.nombre, price: precio, image: miniatura(m.id), meta: m.tamanos ? `${tamano} ml` : "3 × 148 ml" }, n);
              abrir();
            }}
          >
            AÑADIR A LA BOLSA · {money(precio * n)}
          </button>
          <details className="ar-ficha__mas">
            <summary>INGREDIENTES</summary>
            <p>{m.ingredientes}</p>
          </details>
          {recetas.length > 0 && (
            <p className="ar-ficha__receta">
              PRUÉBALO EN:{" "}
              {recetas.map((r) => (
                <a key={r.id} href={abuelaHref(`recetas/${r.id}`)}>
                  {r.t} →
                </a>
              ))}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

function Pedido() {
  const { carrito } = useBolsa();
  return (
    <main className="ar-pag ar-pag--claro">
      <Cab titulo="TU PEDIDO" />
      <CheckoutFlow className="ar-flujo" lines={carrito.lines} onQty={carrito.setQty} onClear={carrito.clear} delivery="shipping" shippingCost={4.9} freeShippingFrom={30} orderPrefix="AR" shopHref={abuelaHref("tienda")} />
    </main>
  );
}

function Recetas() {
  return (
    <main className="ar-pag">
      <Cab titulo="RECETAS" texto="TRES FORMAS DE GASTAR UN BOTE. HAY MÁS, PERO ESTAS SON LAS DE LA ABUELA." />
      <div className="ar-tienda">
        {RECETAS.map((r) => {
          const m = MOJOS.find((x) => x.id === r.mojo)!;
          return (
            <a key={r.id} href={abuelaHref(`recetas/${r.id}`)} className="ar-marco ar-receta">
              <Esquinas />
              <small>
                {r.tiempo} · {r.raciones} PERSONAS
              </small>
              <h2>{r.t}</h2>
              <span>CON {m.nombre} →</span>
            </a>
          );
        })}
      </div>
    </main>
  );
}

function Receta({ id }: { id: string }) {
  const { carrito, abrir } = useBolsa();
  const r = RECETAS.find((x) => x.id === id)!;
  const m = MOJOS.find((x) => x.id === r.mojo)!;
  return (
    <main className="ar-pag">
      <a href={abuelaHref("recetas")} className="ar-volver">
        ← RECETAS
      </a>
      <Cab titulo={r.t} texto={`${r.tiempo} · ${r.raciones} PERSONAS · CON ${m.nombre}`} />
      <div className="ar-ficha">
        <section className="ar-marco ar-receta__lista">
          <Esquinas />
          <h2>LLEVA</h2>
          <ul>
            {r.ingredientes.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <button type="button" className="ar-comprar" onClick={() => { carrito.add({ id: `${m.id}-148`, title: m.nombre, price: m.precio, image: miniatura(m.id), meta: "148 ml" }); abrir(); }}>
            AÑADIR EL {m.nombre} · {money(m.precio)}
          </button>
        </section>
        <ol className="ar-pasos">
          {r.pasos.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
      </div>
    </main>
  );
}

function Historia() {
  return (
    <main className="ar-pag">
      <Cab titulo="LA HISTORIA" texto="CASI CINCUENTA AÑOS DE MOJO A MORTERO, DE UNA COCINA DE LA OROTAVA A TU MESA." />
      <div className="ar-ficha">
        <div className="ar-marco ar-abuela">
          <Esquinas />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/inspiraciones/abuela-rosa/abuela.webp" alt="La abuela Rosa en su cocina" />
        </div>
        <ol className="ar-linea">
          {HISTORIA.map((h) => (
            <li key={h.a}>
              <b>{h.a}</b>
              <h2>{h.t}</h2>
              <p>{h.d}</p>
            </li>
          ))}
        </ol>
      </div>
      <a href={abuelaHref("tienda")} className="ar-comprar ar-centro">
        PRUEBA LA RECETA →
      </a>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "tienda") return b ? <Producto id={b} /> : <Tienda />;
  if (a === "pedido") return <Pedido />;
  if (a === "recetas") return b ? <Receta id={b} /> : <Recetas />;
  if (a === "historia") return <Historia />;
  return null;
}
