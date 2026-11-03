"use client";

import { createContext, useContext, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import CartDrawer from "@/components/ui/CartDrawer";
import CheckoutFlow from "@/components/ui/CheckoutFlow";
import FAQSection from "@/components/ui/FAQSection";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import OptionPicker from "@/components/ui/OptionPicker";
import Reveal from "@/components/ui/Reveal";
import { useCart } from "@/lib/commerce/cart";
import { COLORES, ENTRADAS, FAQ, FOTOS, MUEBLES, PREMIOS, type Forma, type Mueble } from "./data";
import { zancoHref } from "./enlaces";
import "./zanco.css";

/*
 * Zanco (docs/58), a partir de Noho: mueble ligero con tienda completa. Beige #f1eee9, grotesca 600 muy apretada, y un muro
 * escalonado de baldosas de color con un mueble en cada una. Los muebles son dibujos SVG, así que el selector de color cambia
 * el producto de verdad y la bolsa guarda la variante. Lista de premios y pedido con CheckoutFlow.
 */

const NAV: [string, string][] = [
  ["tienda", "Tienda"],
  ["nosotros", "Nosotros"],
  ["blog", "Blog"],
  ["preguntas", "Preguntas"],
];
const eur = (n: number) => `${n.toLocaleString("es-ES")} €`;
const color = (id: string) => COLORES.find((c) => c.id === id) ?? COLORES[0];

const Bolsa = createContext<{ carrito: ReturnType<typeof useCart>; abrir: () => void } | null>(null);
const useBolsa = () => useContext(Bolsa)!;

/** cinco muebles dibujados con trazos gruesos: el color es el de la pieza */
export function Dibujo({ forma, tinta, className = "" }: { forma: Forma; tinta: string; className?: string }) {
  const s = { fill: "none", stroke: tinta, strokeWidth: 9, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 200 240" className={`zn-dibujo ${className}`} aria-hidden>
      {forma === "silla" && (
        <>
          <path {...s} d="M62 40c-8 40-6 70 2 100 24 6 58 6 82 0" />
          <path {...s} d="M66 142 52 222M146 140l14 82M90 146l-6 62M126 146l8 62" />
        </>
      )}
      {forma === "taburete" && (
        <>
          <ellipse cx="100" cy="66" rx="46" ry="11" fill={tinta} />
          <path {...s} d="m68 74-18 150M132 74l18 150M100 78v146M60 158h80" />
        </>
      )}
      {forma === "mesa" && (
        <>
          <ellipse cx="100" cy="106" rx="76" ry="16" fill={tinta} />
          <path {...s} d="m56 118-14 106M144 118l14 106M100 122v102" />
        </>
      )}
      {forma === "banco" && (
        <>
          <rect x="14" y="100" width="172" height="20" rx="10" fill={tinta} />
          <path {...s} d="m34 120-8 98M166 120l8 98M100 120v98" />
        </>
      )}
      {forma === "perchero" && <path {...s} d="M100 18v200M66 226l34-14 34 14M100 44 72 28M100 44l28-16M100 76 68 62M100 76l32-14M100 108 76 96M100 108l24-12" />}
    </svg>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [bolsa, setBolsa] = useState(false);
  const carrito = useCart("trama:zanco:bolsa");
  const ruta = usePathname().split("/")[3] ?? "";
  const links = [{ label: "Inicio", href: zancoHref() }, ...NAV.map(([p, l]) => ({ label: l, href: zancoHref(p) }))];
  return (
    <Bolsa.Provider value={{ carrito, abrir: () => setBolsa(true) }}>
      <div className="zn" id="top">
        <header className="zn-head">
          <a href={zancoHref()} className="zn-logo">
            zanco
          </a>
          <nav aria-label="Principal">
            {NAV.map(([p, l]) => (
              <a key={p} href={zancoHref(p)} aria-current={ruta === p ? "page" : undefined}>
                {l}
              </a>
            ))}
          </nav>
          <button type="button" className="zn-bolsa" onClick={() => setBolsa(true)}>
            Bolsa ({carrito.count})
          </button>
          <div className="zn-burger">
            <FullscreenMenu trigger="pill" layout="sheet" tone="acc" reveal="slide" size="md" numbered brand="zanco" openLabel="Menú" closeLabel="Cerrar" note="Muebles con patas largas" links={links} />
          </div>
        </header>
        {children}
        <footer className="zn-pie">
          <p>Muebles que aguantan mudanzas.</p>
          <nav aria-label="Pie">
            {NAV.map(([p, l]) => (
              <a key={p} href={zancoHref(p)}>
                {l}
              </a>
            ))}
          </nav>
          <small>Zanco · marca de demostración de Trama. Productos y premios inventados.</small>
        </footer>
        <CartDrawer open={bolsa} onOpenChange={setBolsa} lines={carrito.lines} onQty={carrito.setQty} onRemove={carrito.remove} title="Tu bolsa" freeShippingFrom={400} checkoutHref={zancoHref("pedido")} checkoutLabel="Ir al pedido" emptyText="Tu bolsa está vacía." continueHref={zancoHref("tienda")} />
      </div>
    </Bolsa.Provider>
  );
}

const BALDOSAS: { m: number; c: string; col: number; fila: number }[] = [
  { m: 0, c: "limon", col: 1, fila: 1 },
  { m: 1, c: "tomate", col: 2, fila: 1 },
  { m: 2, c: "lavanda", col: 2, fila: 2 },
  { m: 3, c: "oliva", col: 3, fila: 2 },
  { m: 4, c: "limon", col: 1, fila: 3 },
  { m: 0, c: "tinta", col: 3, fila: 3 },
];

function Portada() {
  return (
    <main>
      <section className="zn-hero">
        <div className="zn-hero__txt">
          <h1>Hacemos muebles flexibles y juguetones para la vida de ahora</h1>
          <p>Diseño nuevo desde Vigo</p>
        </div>
        <div className="zn-muro">
          {BALDOSAS.map((b, i) => {
            const m = MUEBLES[b.m];
            const c = color(b.c);
            return (
              <a key={i} href={zancoHref(`tienda/${m.id}`)} aria-label={m.n} style={{ gridColumn: b.col, gridRow: b.fila, background: c.fondo } as CSSProperties}>
                <Dibujo forma={m.forma} tinta={c.c} />
              </a>
            );
          })}
        </div>
      </section>

      <section className="zn-productos" aria-label="Productos">
        {MUEBLES.slice(0, 2).map((m) => (
          <Destacado key={m.id} m={m} />
        ))}
      </section>

      <section className="zn-premios" aria-labelledby="zn-p-t">
        <h2 id="zn-p-t">Muebles que importan</h2>
        <Reveal kind="slide" stagger={0.08}>
          {PREMIOS.map((g) => (
            <div key={g.g} className="zn-grupo">
              <p>{g.g}</p>
              <ul>
                {g.l.map(([t, a]) => (
                  <li key={t}>
                    <span>{t}</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </section>
    </main>
  );
}

function Destacado({ m }: { m: Mueble }) {
  const [c, setC] = useState(m.colores[0]);
  return (
    <article className="zn-dest" style={{ background: color(c).fondo === "#3c3c3c" ? "#e7e2da" : color(c).fondo }}>
      <a href={zancoHref(`tienda/${m.id}`)} aria-label={m.n}>
        <Dibujo forma={m.forma} tinta={color(c).c} />
      </a>
      <div>
        <div>
          <small>{m.n}</small>
          <b>Desde {eur(m.precio)}</b>
        </div>
        <Muestras m={m} c={c} setC={setC} />
        <a href={zancoHref(`tienda/${m.id}`)} className="zn-boton">
          Saber más
        </a>
      </div>
    </article>
  );
}

const Muestras = ({ m, c, setC }: { m: Mueble; c: string; setC: (v: string) => void }) => (
  <OptionPicker kind="swatch" label="Color" hideLabel options={m.colores.map((id) => ({ value: id, label: color(id).n, color: color(id).c }))} value={c} onChange={setC} />
);

const Cab = ({ titulo, texto }: { titulo: string; texto?: string }) => (
  <header className="zn-cab">
    <h1>{titulo}</h1>
    {texto && <p>{texto}</p>}
  </header>
);

function Tienda() {
  return (
    <main className="zn-pag">
      <Cab titulo="Tienda" texto="Cinco muebles. Nos parecen suficientes." />
      <div className="zn-rejilla">
        {MUEBLES.map((m) => (
          <Destacado key={m.id} m={m} />
        ))}
      </div>
    </main>
  );
}

function Ficha({ id }: { id: string }) {
  const m = MUEBLES.find((x) => x.id === id);
  const { carrito, abrir } = useBolsa();
  const [c, setC] = useState(m?.colores[0] ?? "");
  const [ok, setOk] = useState(false);
  if (!m) return <NoHay />;
  return (
    <main className="zn-pag">
      <div className="zn-ficha">
        <div className="zn-ficha__img" style={{ background: color(c).fondo }}>
          <Dibujo forma={m.forma} tinta={color(c).c} />
        </div>
        <div>
          <h1>{m.n}</h1>
          <p className="zn-lema">{m.lema}</p>
          <p className="zn-precio">{eur(m.precio)}</p>
          <p>{m.texto}</p>
          <p className="zn-sel">Color: {color(c).n}</p>
          <Muestras m={m} c={c} setC={setC} />
          <button
            type="button"
            className="zn-boton zn-boton--oscuro"
            onClick={() => {
              carrito.add({ id: `${m.id}-${c}`, title: m.n, price: m.precio, meta: color(c).n });
              setOk(true);
              abrir();
            }}
          >
            {ok ? "Añadir otro" : "Comprar"}
          </button>
          <dl>
            <div>
              <dt>Medidas</dt>
              <dd>{m.medidas}</dd>
            </div>
            <div>
              <dt>Peso</dt>
              <dd>{m.peso}</dd>
            </div>
            <div>
              <dt>Material</dt>
              <dd>Redes de pesca recicladas</dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
}

function Pedido() {
  const { carrito } = useBolsa();
  return (
    <main className="zn-pag">
      <Cab titulo="Tu pedido" />
      <CheckoutFlow className="zn-flujo" lines={carrito.lines} onQty={carrito.setQty} onClear={carrito.clear} delivery="shipping" shippingCost={29} freeShippingFrom={400} orderPrefix="ZN" shopHref={zancoHref("tienda")} />
    </main>
  );
}

function Nosotros() {
  return (
    <main className="zn-pag">
      <Cab titulo="Nosotros" texto="Nos cansamos de los muebles que pesan más que la persona que los mueve." />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={FOTOS.taller} alt="Taller de moldeado con sillas de colores apiladas" className="zn-ancha" />
      <div className="zn-dos">
        <p>Zanco nació en Vigo en 2019 entre una diseñadora industrial y un pescador jubilado que no sabía qué hacer con cuatro toneladas de red.</p>
        <p>Hoy hacemos todo a menos de cien kilómetros del mar del que sale. Si se rompe, lo recomponemos.</p>
      </div>
    </main>
  );
}

function Blog() {
  return (
    <main className="zn-pag">
      <Cab titulo="Blog" />
      <div className="zn-entradas">
        {ENTRADAS.map((e) => (
          <a key={e.id} href={zancoHref(`blog/${e.id}`)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={e.img} alt="" loading="lazy" />
            <b>{e.t}</b>
            <span>{e.d}</span>
          </a>
        ))}
      </div>
    </main>
  );
}

function Entrada({ id }: { id: string }) {
  const e = ENTRADAS.find((x) => x.id === id);
  if (!e) return <NoHay />;
  return (
    <main className="zn-pag">
      <Cab titulo={e.t} texto={e.d} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={e.img} alt="" className="zn-ancha" />
      <div className="zn-dos">
        <p>{e.c}</p>
        <a href={zancoHref("blog")} className="zn-boton">
          Volver al blog
        </a>
      </div>
    </main>
  );
}

function Preguntas() {
  return (
    <main className="zn-pag">
      <Cab titulo="Preguntas" />
      <div className="zn-faq">
        <FAQSection kicker="" title="" items={FAQ} layout="stack" presentation="lines" align="left" defaultOpen={0} variant="minimal" />
      </div>
    </main>
  );
}

function NoHay() {
  return (
    <main className="zn-pag">
      <Cab titulo="Esto se ha caído" texto="Era la pata corta." />
      <a href={zancoHref("tienda")} className="zn-boton zn-solo">
        Ir a la tienda
      </a>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "tienda" && b) return <Ficha id={decodeURIComponent(b)} />;
  if (a === "blog" && b) return <Entrada id={b} />;
  const P = { tienda: Tienda, pedido: Pedido, nosotros: Nosotros, blog: Blog, preguntas: Preguntas }[a];
  return P ? <P /> : <NoHay />;
}
