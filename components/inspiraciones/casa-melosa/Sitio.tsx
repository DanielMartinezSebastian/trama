"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import BriefFlow from "@/components/ui/BriefFlow";
import CartDrawer from "@/components/ui/CartDrawer";
import CheckoutFlow from "@/components/ui/CheckoutFlow";
import FitText from "@/components/ui/FitText";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import ImageTrail from "@/components/ui/ImageTrail";
import Marquee from "@/components/ui/Marquee";
import OptionPicker from "@/components/ui/OptionPicker";
import Parallax from "@/components/ui/Parallax";
import Reveal from "@/components/ui/Reveal";
import { useCart } from "@/lib/commerce/cart";
import { CARTAS, ESPACIOS, ESTUDIO, OBJETOS, PORTADA, PRENSA, SERVICIOS } from "./data";
import { melosaHref } from "./enlaces";
import "./casa-melosa.css";

/*
 * Casa Melosa (docs/58), a partir de House of Honey: interiorismo. Rosa #edccbe y chocolate #331917, palabra ultranegra de
 * borde a borde con una «de» caligráfica cruzándola, foto a sangre, serifa en mayúsculas a tamaño de frase, y una
 * alternancia de rosa y chocolate entre secciones. Cabecera de enlaces pequeños con píldora al pasar. Tienda con bolsa,
 * consultorio («Querida Melosa») y encargo con BriefFlow.
 */

const NAV: [string, string][] = [
  ["estudio", "Estudio"],
  ["espacios", "Espacios"],
  ["tienda", "Tienda"],
  ["querida", "Querida Melosa"],
];
const eur = (n: number) => `${n.toLocaleString("es-ES")} €`;

const Bolsa = createContext<{ carrito: ReturnType<typeof useCart>; abrir: () => void } | null>(null);
const useBolsa = () => useContext(Bolsa)!;

function Marca({ className = "" }: { className?: string }) {
  return (
    <span className={`cm-marca ${className}`}>
      <b>CASA</b>
      <i>muy</i>
      <b>MELOSA</b>
    </span>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [bolsa, setBolsa] = useState(false);
  const carrito = useCart("trama:casa-melosa:bolsa");
  const ruta = usePathname().split("/")[3] ?? "";
  const links = [{ label: "Inicio", href: melosaHref() }, ...NAV.map(([p, l]) => ({ label: l, href: melosaHref(p) })), { label: "Contacto", href: melosaHref("contacto") }];
  return (
    <Bolsa.Provider value={{ carrito, abrir: () => setBolsa(true) }}>
      <div className="cm" id="top">
        <header className="cm-head">
          <a href={melosaHref()} className="cm-sello" aria-label="Casa Melosa, inicio">
            <i />
            <i />
          </a>
          <nav aria-label="Principal">
            {NAV.map(([p, l]) => (
              <a key={p} href={melosaHref(p)} aria-current={ruta === p ? "page" : undefined}>
                {l}
              </a>
            ))}
          </nav>
          <button type="button" className="cm-enlace" onClick={() => setBolsa(true)}>
            Bolsa ({carrito.count})
          </button>
          <a href={melosaHref("contacto")} className="cm-enlace cm-enlace--flecha">
            Hablemos <span aria-hidden>→</span>
          </a>
          <div className="cm-burger">
            <FullscreenMenu trigger="burger" layout="split" tone="fg" align="center" aside={<img src="/img/inspiraciones/casa-melosa/portada-salon.webp" alt="" />} brand="Casa Melosa" openLabel="Menú" closeLabel="Cerrar" note="Interiores, objetos y ambientes" links={links} />
          </div>
        </header>
        {children}
        <footer className="cm-pie">
          <FitText className="cm-pie__marca">MELOSA</FitText>
          <div>
            <p>
              Calle de la Colmena 12, Madrid
              <br />
              <a href="mailto:hola@casamelosa.example">hola@casamelosa.example</a>
            </p>
            <nav aria-label="Pie">
              {NAV.map(([p, l]) => (
                <a key={p} href={melosaHref(p)}>
                  {l}
                </a>
              ))}
            </nav>
            <small>Estudio de demostración de Trama. Proyectos inventados.</small>
          </div>
        </footer>
        <CartDrawer open={bolsa} onOpenChange={setBolsa} lines={carrito.lines} onQty={carrito.setQty} onRemove={carrito.remove} title="Tu bolsa" checkoutHref={melosaHref("pedido")} checkoutLabel="Finalizar pedido" emptyText="Aún no hay nada aquí." continueHref={melosaHref("tienda")} />
      </div>
    </Bolsa.Provider>
  );
}

function Portada() {
  return (
    <main>
      <section className="cm-hero">
        <h1 className="sr-only">Casa Melosa, interiores, objetos y ambientes</h1>
        <Marca />
        <div className="cm-hero__lemas">
          <p>
            Interiores, objetos
            <br />y ambientes
          </p>
          <p>
            Pensados para
            <br />
            el placer
          </p>
        </div>
      </section>
      <div className="cm-sangre">
        <Parallax speed={0.1}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PORTADA} alt="Salón con ventanal en arco, vigas de madera y sofá curvo" />
      </Parallax>
      </div>

      <section className="cm-oscuro">
        <p className="cm-etq">Estudio</p>
        <Reveal kind="slide">
          <p className="cm-frase">Casa Melosa es un colectivo de mujeres que hacen casas para vivirlas. Tenemos gusto por lo inesperado y un respeto enorme por el detalle.</p>
        </Reveal>
        <a href={melosaHref("estudio")} className="cm-mas">
          Conócenos <span aria-hidden>→</span>
        </a>
      </section>

      <section className="cm-oscuro cm-espacios" aria-label="Espacios destacados">
        {ESPACIOS.slice(0, 3).map((e) => (
          <a key={e.id} href={melosaHref(`espacios/${e.id}`)} className="cm-foto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={e.img} alt={`${e.nombre}, ${e.lugar}`} loading="lazy" />
            <span>{e.nombre}</span>
          </a>
        ))}
      </section>

      <Marquee variant="minimal" text={PRENSA.join("  ·  ")} separator="   ·   " rows={1} duration={30} tone="fg" pauseOnHover={false} className="cm-cinta" />

      <section className="cm-tienda-rastro">
        <div>
          <h2>Objetos para vivir mejor</h2>
          <a href={melosaHref("tienda")} className="cm-mas">
            Ir a la tienda <span aria-hidden>→</span>
          </a>
        </div>
        <ImageTrail images={OBJETOS.map((o) => o.img).join(",")} className="cm-rastro">
          <p>pasa por aquí</p>
        </ImageTrail>
      </section>

      <section className="cm-oscuro cm-querida">
        <p className="cm-etq">Querida Melosa</p>
        {CARTAS.map((c) => (
          <a key={c.id} href={melosaHref(`querida/${c.id}`)}>
            <span>{c.asunto}</span>
            <small>Leer →</small>
          </a>
        ))}
      </section>
    </main>
  );
}

const Cab = ({ titulo, texto }: { titulo: string; texto?: string }) => (
  <header className="cm-cab">
    <h1>{titulo}</h1>
    {texto && <p>{texto}</p>}
  </header>
);

function Estudio() {
  return (
    <main className="cm-pag">
      <Cab titulo="Estudio" texto="Cuatro socias, un taller en Madrid y una regla: si no apetece quedarse a cenar, no está terminado." />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ESTUDIO} alt="Las cuatro socias del estudio alrededor de una mesa de muestras" className="cm-ancha" />
      <div className="cm-dos">
        <p>Empezamos en 2016 pintando el piso de una amiga. Hoy hacemos casas, hoteles y restaurantes, y seguimos eligiendo cada tirador en persona.</p>
        <p>Trabajamos con talleres de aquí: ceramistas de La Bisbal, ebanistas de Valencia y tejedoras de Mallorca. Parte de lo que hacen acaba en nuestra tienda.</p>
      </div>
    </main>
  );
}

function Espacios() {
  return (
    <main className="cm-pag cm-pag--oscura">
      <Cab titulo="Espacios" />
      <div className="cm-lista">
        {ESPACIOS.map((e) => (
          <a key={e.id} href={melosaHref(`espacios/${e.id}`)} className="cm-foto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={e.img} alt={`${e.nombre}, ${e.lugar}`} loading="lazy" />
            <span>
              {e.nombre} · {e.lugar}, {e.ano}
            </span>
          </a>
        ))}
      </div>
    </main>
  );
}

function Espacio({ id }: { id: string }) {
  const i = ESPACIOS.findIndex((e) => e.id === id);
  if (i < 0) return <NoHay />;
  const e = ESPACIOS[i];
  const s = ESPACIOS[(i + 1) % ESPACIOS.length];
  return (
    <main className="cm-pag">
      <Cab titulo={e.nombre} texto={`${e.lugar}, ${e.ano}`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={e.img} alt={`${e.nombre}: vista general`} className="cm-ancha" />
      <div className="cm-dos">
        <p>{e.texto}</p>
        <dl>
          {e.datos.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="cm-par">
        {e.extra.map((x, k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={x} src={x} alt={`${e.nombre}: detalle ${k + 1}`} loading="lazy" />
        ))}
      </div>
      <a href={melosaHref(`espacios/${s.id}`)} className="cm-sig">
        Siguiente: {s.nombre} <span aria-hidden>→</span>
      </a>
    </main>
  );
}

function Tienda() {
  return (
    <main className="cm-pag">
      <Cab titulo="Tienda" texto="Piezas de nuestros talleres, las mismas que ponemos en las casas." />
      <div className="cm-objetos">
        {OBJETOS.map((o) => (
          <a key={o.id} href={melosaHref(`tienda/${o.id}`)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={o.img} alt={o.nombre} loading="lazy" />
            <span>{o.nombre}</span>
            <small>{eur(o.precio)}</small>
          </a>
        ))}
      </div>
    </main>
  );
}

function Objeto({ id }: { id: string }) {
  const o = OBJETOS.find((x) => x.id === id);
  const { carrito, abrir } = useBolsa();
  const [color, setColor] = useState(o?.colores[0] ?? "");
  if (!o) return <NoHay />;
  return (
    <main className="cm-pag">
      <div className="cm-objeto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={o.img} alt={o.nombre} />
        <div>
          <h1>{o.nombre}</h1>
          <p className="cm-precio">{eur(o.precio)}</p>
          <p>{o.nota}</p>
          <OptionPicker kind="chip" label="Color" options={o.colores.map((c) => ({ value: c, label: c }))} value={color} onChange={setColor} />
          <button
            type="button"
            className="cm-boton"
            onClick={() => {
              carrito.add({ id: `${o.id}-${color}`, title: o.nombre, price: o.precio, meta: color, image: o.img });
              abrir();
            }}
          >
            Añadir a la bolsa
          </button>
          <a href={melosaHref("tienda")} className="cm-mas">
            ← Volver a la tienda
          </a>
        </div>
      </div>
    </main>
  );
}

function Pedido() {
  const { carrito } = useBolsa();
  return (
    <main className="cm-pag">
      <Cab titulo="Tu pedido" />
      <CheckoutFlow className="cm-flujo" lines={carrito.lines} onQty={carrito.setQty} onClear={carrito.clear} delivery="both" shippingCost={25} freeShippingFrom={500} orderPrefix="CM" shopHref={melosaHref("tienda")} />
    </main>
  );
}

function Querida() {
  return (
    <main className="cm-pag cm-pag--oscura">
      <Cab titulo="Querida Melosa" texto="Nos escribís, os contestamos. Sin tacto." />
      <div className="cm-lista">
        {CARTAS.map((c) => (
          <a key={c.id} href={melosaHref(`querida/${c.id}`)} className="cm-foto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.img} alt="" loading="lazy" />
            <span>{c.asunto}</span>
          </a>
        ))}
      </div>
    </main>
  );
}

function CartaPag({ id }: { id: string }) {
  const c = CARTAS.find((x) => x.id === id);
  if (!c) return <NoHay />;
  return (
    <main className="cm-pag">
      <Cab titulo={c.asunto} />
      <article className="cm-carta">
        <p className="cm-carta__q">«{c.pregunta}»</p>
        <p className="cm-etq">{c.firma}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.img} alt="" />
        {c.respuesta.map((r) => (
          <p key={r}>{r}</p>
        ))}
        <a href={melosaHref("querida")} className="cm-mas">
          ← Más cartas
        </a>
      </article>
    </main>
  );
}

function Contacto() {
  return (
    <main className="cm-pag">
      <Cab titulo="Hablemos" texto="Cuéntanos qué casa tienes y qué te gustaría sentir en ella." />
      <BriefFlow className="cm-flujo" title="Encargo a Casa Melosa" services={SERVICIOS} servicesLabel="¿Qué necesitas?" budgets="Menos de 30.000 €, 30.000–100.000 €, Más de 100.000 €" timelines="Este año, El año que viene, Sin prisa" question="¿Qué te gustaría que cambiara?" prefix="CM" storageKey="trama:casa-melosa:encargo" variant="minimal" />
    </main>
  );
}

function NoHay() {
  return (
    <main className="cm-pag">
      <Cab titulo="Aquí no hay nada" texto="Esta habitación aún está en obras." />
      <a href={melosaHref()} className="cm-mas cm-solo">
        Volver a la entrada
      </a>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "espacios" && b) return <Espacio id={b} />;
  if (a === "tienda" && b) return <Objeto id={b} />;
  if (a === "querida" && b) return <CartaPag id={b} />;
  const P = { estudio: Estudio, espacios: Espacios, tienda: Tienda, pedido: Pedido, querida: Querida, contacto: Contacto }[a];
  return P ? <P /> : <NoHay />;
}
