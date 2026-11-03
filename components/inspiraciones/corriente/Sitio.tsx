"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import ContactForm from "@/components/ui/ContactForm";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import Reveal from "@/components/ui/Reveal";
import { FOTOS, PROMOCIONES, VALORES, type Promocion, type Vivienda } from "./data";
import { corrienteHref } from "./enlaces";
import "./corriente.css";

/*
 * Nada Corriente (docs/60), a partir de Normal is Boring: promotora de viviendas. Blanco, una serifa editorial ultrafina
 * en mayúsculas con las palabras escalonadas por la pantalla, la marca partida entre dos esquinas («NADA» arriba,
 * «corriente» volteado abajo), un texto vertical en el borde, fotos que se solapan, bloques negro, azul claro y coral y
 * palabras gigantes cortadas por el borde. Flujos: proyectos por estado, disponibilidad de viviendas con filtro y visita.
 */

const NAV: [string, string][] = [
  ["proyectos", "Proyectos"],
  ["conocenos", "Conócenos"],
  ["contacto", "Contacto"],
];
const eur = (n: number) => `${n.toLocaleString("es-ES")} €`;

/** la foto del menú abierto */
function FotoMenu() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={FOTOS.salon} alt="" />;
}

export function Shell({ children }: { children: ReactNode }) {
  const ruta = usePathname().split("/")[3] ?? "";
  const links = [{ label: "Inicio", href: corrienteHref() }, ...NAV.map(([p, l]) => ({ label: l, href: corrienteHref(p) }))];
  return (
    <div className="nc" id="top">
      <header className="nc-head">
        <a href={corrienteHref()} className="nc-head__marca">
          NADA
        </a>
        <nav aria-label="Principal" className="nc-head__nav">
          {NAV.map(([p, l]) => (
            <a key={p} href={corrienteHref(p)} aria-current={ruta === p ? "page" : undefined}>
              {l}
            </a>
          ))}
        </nav>
        <FullscreenMenu trigger="text" layout="split" reveal="fade" align="center" size="md" linkHover="dim" brand="Nada Corriente" openLabel="Menú" closeLabel="Cerrar" note="Valencia" aside={<FotoMenu />} links={links} className="nc-menu" />
      </header>
      <p className="nc-vertical" aria-hidden>
        Valores · Diseño · Calma
      </p>
      <p className="nc-firma" aria-hidden>
        <i>es</i> corriente
      </p>
      {children}
      <Pie />
    </div>
  );
}

function Pie() {
  return (
    <footer className="nc-pie">
      <div className="nc-pie__fila">
        <a href={`mailto:hola@nadacorriente.example`}>hola@nadacorriente.example</a>
        <span>Instagram</span>
      </div>
      <p className="nc-pie__gigante" aria-hidden>
        Corriente
      </p>
      <small>Nada Corriente · promotora de demostración de Trama. Promociones, viviendas y precios inventados.</small>
    </footer>
  );
}

function Portada() {
  return (
    <main>
      <section className="nc-hero">
        <h1 className="nc-escalon">
          <span>Espacios</span>
          <span>de vida</span>
          <span>que desafían</span>
          <span>
            lo <em>ordinario</em>
          </span>
        </h1>
        <p className="nc-hero__txt">En Nada Corriente construimos casas para quedarse: volúmenes contemporáneos, abiertos al exterior, pensados para que la vida pase despacio.</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="nc-hero__a" src={FOTOS.salon} alt="Salón con sofá de lino y luz de tarde" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="nc-hero__b" src={FOTOS.terraza} alt="" />
      </section>

      <section className="nc-casas">
        <h2 className="nc-escalon nc-escalon--centro">
          <span>Casas que invitan</span>
          <span>a detener</span>
          <span>el tiempo</span>
          <span>y desconectar</span>
        </h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.cocina} alt="Cocina abierta con isla de madera" loading="lazy" />
      </section>

      <section className="nc-negro">
        <p>En Nada Corriente construimos viviendas que destacan por su calidad y su diseño, de volúmenes contemporáneos, abiertas al exterior. Espacios que mejoran la vida de quienes los habitan, con más confort, más sostenibilidad, más belleza y más emoción.</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.piscina} alt="Piscina comunitaria entre jardines" loading="lazy" />
        <p className="nc-negro__vertical" aria-hidden>
          Valores
        </p>
      </section>

      <section className="nc-valores" aria-label="Valores">
        {VALORES.slice(0, 2).map((v, k) => (
          <div key={v} className={`nc-valor nc-valor--${k}`}>
            <p aria-hidden>{v}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={[FOTOS.dormitorio, FOTOS.bano][k]} alt="" loading="lazy" />
            <span className="nc-sr">{v}</span>
          </div>
        ))}
      </section>

      <section className="nc-proyectos">
        <h2 className="nc-sobre">Proyectos</h2>
        <ul>
          {PROMOCIONES.map((p, k) => (
            <Reveal key={p.id} as="li" kind="fade" delay={k * 0.06}>
              <a href={corrienteHref(`proyectos/${p.id}`)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt="" loading="lazy" />
                <b>{p.n}</b>
                <small>
                  {p.ciudad} · {p.estado}
                </small>
              </a>
            </Reveal>
          ))}
        </ul>
        <a href={corrienteHref("proyectos")} className="nc-enlace">
          Ver todos →
        </a>
      </section>

      <section className="nc-coral">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.bano} alt="Baño con lavabo de piedra y luz natural" loading="lazy" />
        <p className="nc-escalon">
          <span>Quién dijo</span>
          <span>que el placer</span>
          <span>
            era <em>corriente</em>
          </span>
        </p>
      </section>

      <section className="nc-sueno">
        <p className="nc-gigante">Desbloquea</p>
        <p className="nc-gigante nc-gigante--b">tu sueño</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.dormitorio} alt="" loading="lazy" />
        <a href={corrienteHref("contacto")} className="nc-boton">
          Contacto
        </a>
      </section>
    </main>
  );
}

function Proyectos() {
  const estados = ["Todos", "En venta", "Próximamente", "Entregada"];
  const [estado, setEstado] = useState("Todos");
  const lista = PROMOCIONES.filter((p) => estado === "Todos" || p.estado === estado);
  return (
    <main className="nc-pag">
      <h1 className="nc-escalon">
        <span>Proyectos</span>
        <span>
          nada <em>corrientes</em>
        </span>
      </h1>
      <div className="nc-filtro" role="group" aria-label="Estado">
        {estados.map((e) => (
          <button key={e} type="button" aria-pressed={estado === e} onClick={() => setEstado(e)}>
            {e}
          </button>
        ))}
      </div>
      <ul className="nc-lista" aria-live="polite">
        {lista.map((p) => (
          <li key={p.id}>
            <a href={corrienteHref(`proyectos/${p.id}`)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt="" loading="lazy" />
              <span>
                <b>{p.n}</b>
                <small>{p.ciudad}</small>
              </span>
              <span className="nc-lista__estado">{p.estado}</span>
              <span className="nc-lista__desde">{p.viviendas.some((x) => x.estado === "Disponible") ? `desde ${eur(Math.min(...p.viviendas.filter((x) => x.estado === "Disponible").map((x) => x.precio)))}` : "agotada"}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Ficha({ p }: { p: Promocion }) {
  const [dorm, setDorm] = useState(0);
  const [elegida, setElegida] = useState<Vivienda | null>(null);
  const lista = p.viviendas.filter((x) => !dorm || x.dorm === dorm);
  const dorms = [...new Set(p.viviendas.map((x) => x.dorm))].sort();
  return (
    <main className="nc-pag">
      <p className="nc-sobre">
        {p.ciudad} · {p.estado} · {p.entrega}
      </p>
      <h1 className="nc-gigante nc-gigante--ficha">{p.n}</h1>
      <div className="nc-ficha">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.galeria[0]} alt={`${p.n}: interior`} />
        <p>{p.texto}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.galeria[1]} alt="" loading="lazy" />
      </div>
      <section aria-labelledby="nc-disp" className="nc-disp">
        <h2 id="nc-disp" className="nc-sobre">
          Disponibilidad
        </h2>
        <div className="nc-filtro" role="group" aria-label="Dormitorios">
          <button type="button" aria-pressed={!dorm} onClick={() => setDorm(0)}>
            Todas
          </button>
          {dorms.map((d) => (
            <button key={d} type="button" aria-pressed={dorm === d} onClick={() => setDorm(d)}>
              {d} dorm.
            </button>
          ))}
        </div>
        <table>
          <thead>
            <tr>
              <th scope="col">Vivienda</th>
              <th scope="col">Dormitorios</th>
              <th scope="col">m²</th>
              <th scope="col">Planta</th>
              <th scope="col">Precio</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((x) => (
              <tr key={x.id} data-estado={x.estado}>
                <th scope="row">{x.tipo} {x.id.toUpperCase()}</th>
                <td>{x.dorm}</td>
                <td>{x.m2}</td>
                <td>{x.planta}</td>
                <td>{x.estado === "Vendida" ? "—" : eur(x.precio)}</td>
                <td>
                  {x.estado === "Disponible" ? (
                    <button type="button" className="nc-boton nc-boton--fino" onClick={() => setElegida(x)} aria-pressed={elegida?.id === x.id}>
                      Me interesa
                    </button>
                  ) : (
                    x.estado
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="nc-visita" aria-live="polite">
        {elegida ? (
          <ContactForm key={elegida.id} title={`Visita a la vivienda ${elegida.id.toUpperCase()}`} subtitle={`${p.n} · ${elegida.tipo}, ${elegida.dorm} dormitorios, ${elegida.m2} m² · ${eur(elegida.precio)}. Te llamamos para fijar el día.`} submitLabel="Pedir visita" successMessage={`Recibido. Te llamamos para enseñarte la ${elegida.id.toUpperCase()} de ${p.n}.`} variant="minimal" />
        ) : (
          <p>Elige una vivienda disponible para pedir una visita o el dosier con planos.</p>
        )}
      </section>
    </main>
  );
}

function Conocenos() {
  return (
    <main className="nc-pag">
      <h1 className="nc-escalon">
        <span>Quiénes</span>
        <span>
          <em>somos</em>
        </span>
      </h1>
      <div className="nc-ficha">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.jardin} alt="Jardín de una de las promociones" loading="lazy" />
        <p>Somos una promotora pequeña de Valencia: cuatro socios, un estudio de arquitectura de confianza y obras de pocas viviendas. Preferimos hacer una casa bien que diez rápido.</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.salon} alt="" loading="lazy" />
      </div>
    </main>
  );
}

function Contacto() {
  return (
    <main className="nc-pag">
      <h1 className="nc-escalon">
        <span>Hablemos</span>
        <span>
          de tu <em>casa</em>
        </span>
      </h1>
      <div className="nc-contacto">
        <ContactForm title="Escríbenos" subtitle="Contestamos en un día laborable. Si ya sabes qué vivienda te interesa, dínoslo." submitLabel="Enviar" successMessage="Gracias, te escribimos mañana." variant="minimal" />
        <address>
          <b>Oficina</b>
          <span>Calle de Sueca 30, Russafa</span>
          <span>46006 Valencia</span>
          <span>960 000 000</span>
        </address>
      </div>
    </main>
  );
}

function NoHay() {
  return (
    <main className="nc-pag">
      <h1 className="nc-escalon">
        <span>Esta página</span>
        <span>
          no <em>existe</em>
        </span>
      </h1>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "proyectos" && b) {
    const p = PROMOCIONES.find((x) => x.id === b);
    return p ? <Ficha p={p} /> : <NoHay />;
  }
  const P = { proyectos: Proyectos, conocenos: Conocenos, contacto: Contacto }[a];
  return P ? <P /> : <NoHay />;
}
