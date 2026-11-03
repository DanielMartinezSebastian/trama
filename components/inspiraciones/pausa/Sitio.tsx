"use client";

import { Suspense, useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import BookingFlow from "@/components/ui/BookingFlow";
import FAQSection from "@/components/ui/FAQSection";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import Reveal from "@/components/ui/Reveal";
import { CATEGORIAS, EQUIPO, FOTOS, HORARIO, PREOCUPACIONES, RAZONES, TRATAMIENTOS } from "./data";
import { pausaHref } from "./enlaces";
import "./pausa.css";

/*
 * Pausa (docs/59), a partir de Odyssée: clínica de medicina estética. Marfil rgb(255,252,248) y azul tinta rgb(30,48,94); una
 * serifa de libro (psTimes → Newsreader) para todo lo que se lee y una grotesca diminuta en mayúsculas para la navegación y las
 * etiquetas. Las fotos van en duotono azul y recuperan el color al pasar; los párrafos grandes empiezan con sangría. Flujos:
 * buscar por preocupación y reservar consulta (BookingFlow) con tratamiento y profesional.
 */

const NAV: [string, string][] = [
  ["tratamientos", "Tratamientos"],
  ["preocupaciones", "Preocupaciones"],
  ["clinica", "La clínica"],
];
const eur = (n: number) => `${n.toLocaleString("es-ES")} €`;

export function Shell({ children }: { children: ReactNode }) {
  const ruta = usePathname().split("/")[3] ?? "";
  return (
    <div className={`pa ${ruta ? "" : "pa--inicio"}`} id="top">
      <header className="pa-head">
        <a href={pausaHref()} className="pa-logo">
          Pausa
        </a>
        <p className="pa-head__lema">Medicina estética para resultados que duran.</p>
        <nav aria-label="Principal">
          {NAV.map(([p, l]) => (
            <a key={p} href={pausaHref(p)} aria-current={ruta === p ? "page" : undefined}>
              {l}
            </a>
          ))}
          <a href={pausaHref("consulta")} className="pa-head__cita">
            Reservar consulta
          </a>
        </nav>
        <div className="pa-burger">
          <FullscreenMenu
            trigger="label"
            layout="drop"
            reveal="fade"
            size="md"
            align="center"
            rules
            className="pa-menu"
            brand="Pausa"
            openLabel="Menú"
            closeLabel="Cerrar"
            note="Calle de Fortuny 21 · Madrid"
            links={[{ label: "Inicio", href: pausaHref() }, ...NAV.map(([p, l]) => ({ label: l, href: pausaHref(p) })), { label: "Reservar consulta", href: pausaHref("consulta") }]}
          />
        </div>
      </header>
      {children}
      <footer className="pa-pie">
        <p className="pa-pie__lema">Medicina estética para resultados que duran.</p>
        <div className="pa-pie__cols">
          <div>
            <span className="pa-etiqueta">A.</span>
            <p>
              Calle de Fortuny 21, bajo
              <br />
              28010 Madrid
            </p>
          </div>
          <dl>
            {HORARIO.map(([d, h]) => (
              <div key={d}>
                <dt>{d}</dt>
                <dd>{h}</dd>
              </div>
            ))}
          </dl>
          <div>
            <span className="pa-etiqueta">C.</span>
            <p>
              910 000 000
              <br />
              hola@pausa.example
            </p>
          </div>
        </div>
        <p className="pa-pie__logo" aria-hidden>
          Pausa
        </p>
        <small>Pausa · clínica de demostración de Trama. Tratamientos, precios y equipo inventados; no es consejo médico.</small>
      </footer>
    </div>
  );
}

/** foto en duotono azul que recupera el color al pasar */
const Duo = ({ src, alt = "", className = "" }: { src: string; alt?: string; className?: string }) => (
  <span className={`pa-duo ${className}`}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={src} alt={alt} loading="lazy" />
  </span>
);

function Razones() {
  const [i, setI] = useState(0);
  return (
    <section className="pa-razones">
      <header>
        <span className="pa-etiqueta">
          {i + 1} · {RAZONES.length}
        </span>
        <span className="pa-etiqueta">¿Por qué Pausa?</span>
      </header>
      <div className="pa-razones__barra" aria-hidden>
        <i style={{ width: `${((i + 1) / RAZONES.length) * 100}%` }} />
      </div>
      <div className="pa-razones__fila">
        {RAZONES.map((r, k) => (
          <button key={r.t} type="button" className="pa-razon" aria-pressed={i === k} onClick={() => setI(k)} onMouseEnter={() => setI(k)}>
            <Duo src={r.img} />
            <b>{r.t}</b>
            <span>{r.d}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function Portada() {
  return (
    <main>
      <section className="pa-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FOTOS.portada} alt="Retrato con la piel natural" />
      </section>

      <section className="pa-intro">
        <Duo src={FOTOS.hombre} className="pa-intro__foto" />
        <div>
          <Reveal kind="slide" as="p" className="pa-grande pa-sangria">
            En Pausa empezamos por escucharte. Ven a la clínica de Fortuny y sal con un plan que se parezca a ti, no a una moda.
          </Reveal>
          <p className="pa-pequeno">Primero la claridad, después el tratamiento. Cada plan sale de una consulta larga, con ciencia, precisión y cuidado.</p>
          <a href={pausaHref("consulta")} className="pa-enlace">
            Reservar consulta
          </a>
        </div>
      </section>

      <Razones />

      <section className="pa-dos-fotos">
        <a href={pausaHref("preocupaciones")}>
          <Duo src={FOTOS.preocupaciones} />
          <span className="pa-etiqueta">Preocupaciones</span>
        </a>
        <a href={pausaHref("tratamientos")}>
          <Duo src={FOTOS.tratamientos} />
          <span className="pa-etiqueta">Tratamientos</span>
        </a>
      </section>

      <section className="pa-filosofia">
        <span className="pa-etiqueta">Nuestra filosofía</span>
        <p className="pa-grande pa-sangria">Cada tratamiento en Pausa se apoya en medicina basada en pruebas y en lo último de la ciencia de la piel. Combinamos precisión anatómica con técnicas estudiadas para que el resultado sea seguro y dure.</p>
      </section>

      <section className="pa-metodo">
        <h2>Método, no mito.</h2>
        <div className="pa-metodo__fotos">
          <Duo src={FOTOS.gel} className="pa-metodo__a" />
          <Duo src={FOTOS.labios} className="pa-metodo__b" />
        </div>
        <p className="pa-pequeno">Detrás de cada tratamiento hay investigación y años de práctica. Si algo no tiene pruebas, no lo hacemos.</p>
      </section>

      <section className="pa-enfoque">
        <span className="pa-etiqueta">Nuestro enfoque</span>
        <div className="pa-enfoque__txt">
          <p>Cada tratamiento se ajusta a tu estilo de vida, a lo que quieres conseguir, a tu tipo de piel y al tiempo que tienes para recuperarte.</p>
          <p>Conoce los tratamientos con los que trabajamos y al equipo que los aplica.</p>
        </div>
        <div className="pa-enfoque__fotos">
          <a href={pausaHref("tratamientos")}>
            <Duo src={FOTOS.piel} />
            <span className="pa-etiqueta">Tratamientos</span>
          </a>
          <a href={pausaHref("clinica")}>
            <Duo src={EQUIPO[1].foto} />
            <span className="pa-etiqueta">Equipo</span>
          </a>
        </div>
      </section>
    </main>
  );
}

const Cab = ({ titulo, texto, etiqueta }: { titulo: string; texto?: string; etiqueta?: string }) => (
  <header className="pa-cab">
    {etiqueta && <span className="pa-etiqueta">{etiqueta}</span>}
    <h1>{titulo}</h1>
    {texto && <p className="pa-sangria">{texto}</p>}
  </header>
);

function Tratamientos() {
  return (
    <main className="pa-pag">
      <Cab etiqueta="Tratamientos" titulo="Lo que hacemos" texto="Pocos tratamientos, bien estudiados. Todos empiezan con una consulta." />
      {CATEGORIAS.map((c) => (
        <section key={c} className="pa-cat">
          <span className="pa-etiqueta">{c}</span>
          <ul>
            {TRATAMIENTOS.filter((t) => t.category === c).map((t) => (
              <li key={t.id}>
                <a href={pausaHref(`tratamientos/${t.id}`)}>
                  <Duo src={t.img} />
                  <b>{t.name}</b>
                  <span>{t.lema}</span>
                  <small>
                    {t.from ? "Desde " : ""}
                    {eur(t.price ?? 0)} · {t.minutes} min
                  </small>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

function Ficha({ id }: { id: string }) {
  const t = TRATAMIENTOS.find((x) => x.id === id);
  if (!t) return <NoHay />;
  const faq = [
    `¿Duele?|Molesta poco: usamos crema anestésica y agujas muy finas. La mayoría lo describe como un pellizco.`,
    `¿Cuándo veré el resultado?|${t.resultados}.`,
    `¿Cuántas sesiones necesito?|${t.sesiones}.`,
    `¿Puedo hacer vida normal?|Recuperación: ${t.recuperacion.toLowerCase()}. Evita el sol fuerte y el ejercicio intenso las primeras 24 horas.`,
  ].join("\n");
  return (
    <main className="pa-pag">
      <Cab etiqueta={t.category} titulo={t.name} texto={t.lema} />
      <div className="pa-ficha">
        <Duo src={t.img} className="pa-ficha__foto" />
        <div>
          <p className="pa-grande pa-sangria">{t.description}</p>
          <dl className="pa-datos">
            {[
              ["Duración", `${t.minutes} minutos`],
              ["Recuperación", t.recuperacion],
              ["Resultados", t.resultados],
              ["Sesiones", t.sesiones],
              ["Precio", `${t.from ? "Desde " : ""}${eur(t.price ?? 0)}`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="pa-etiqueta">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <a href={pausaHref(`consulta?servicio=${t.id}`)} className="pa-boton">
            Reservar {t.id === "consulta" ? "la consulta" : "este tratamiento"}
          </a>
        </div>
      </div>
      <FAQSection kicker="" title="Preguntas" subtitle="" items={faq} presentation="lines" variant="minimal" className="pa-faq" />
    </main>
  );
}

function Preocupaciones() {
  const [sel, setSel] = useState(PREOCUPACIONES[0].id);
  const p = PREOCUPACIONES.find((x) => x.id === sel)!;
  return (
    <main className="pa-pag">
      <Cab etiqueta="Preocupaciones" titulo="¿Qué te gustaría cambiar?" texto="Elige lo que más te importa y te contamos cómo lo trataríamos." />
      <div className="pa-preo">
        <div role="radiogroup" aria-label="Preocupación" className="pa-preo__lista">
          {PREOCUPACIONES.map((x) => (
            <button key={x.id} type="button" role="radio" aria-checked={sel === x.id} onClick={() => setSel(x.id)}>
              {x.n}
            </button>
          ))}
        </div>
        <div className="pa-preo__res" aria-live="polite">
          <p className="pa-grande pa-sangria">{p.texto}</p>
          <span className="pa-etiqueta">Lo trataríamos con</span>
          <ul>
            {p.tratamientos.map((id) => {
              const t = TRATAMIENTOS.find((x) => x.id === id)!;
              return (
                <li key={id}>
                  <a href={pausaHref(`tratamientos/${id}`)}>
                    <Duo src={t.img} />
                    <div>
                      <b>{t.name}</b>
                      <span>{t.lema}</span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
          <a href={pausaHref("consulta?servicio=consulta")} className="pa-boton">
            Empezar con una consulta
          </a>
        </div>
      </div>
    </main>
  );
}

function Clinica() {
  return (
    <main className="pa-pag">
      <Cab etiqueta="La clínica" titulo="Quién te atiende" texto="Tres personas, una sala con luz de mañana y tiempo de sobra para cada cita." />
      <div className="pa-equipo">
        {EQUIPO.map((e) => (
          <article key={e.name}>
            <Duo src={e.foto} />
            <b>{e.name}</b>
            <span className="pa-etiqueta">{e.role}</span>
            <p>{e.bio}</p>
          </article>
        ))}
      </div>
      <Duo src={FOTOS.sala} className="pa-ancha" alt="Sala de tratamiento" />
    </main>
  );
}

function Consulta() {
  const q = useSearchParams();
  return (
    <main className="pa-pag">
      <Cab etiqueta="Reservar" titulo="Reservar consulta" texto="Elige tratamiento, profesional y hora. Si dudas, empieza por la consulta de valoración." />
      <BookingFlow
        key={q.get("servicio") ?? ""}
        className="pa-flujo"
        services={TRATAMIENTOS}
        staff={EQUIPO}
        initialService={q.get("servicio") ?? undefined}
        times="10:00, 11:00, 12:00, 13:00, 16:00, 17:00, 18:00"
        closedDays="0, 2"
        closesAt={{ 6: "14:00" }}
        storageKey="trama:pausa:citas"
        serviceLabel="Tratamiento"
        staffLabel="Profesional"
        anyStaffLabel="Quien tenga hueco"
        business="Pausa"
        location="Calle de Fortuny 21, Madrid"
        note="Cita de demostración: no se guarda fuera de tu navegador."
        variant="minimal"
      />
    </main>
  );
}

function NoHay() {
  return (
    <main className="pa-pag">
      <Cab titulo="No encontramos esta página" texto="Quizá buscabas un tratamiento." />
      <a href={pausaHref("tratamientos")} className="pa-boton pa-solo">
        Ver tratamientos
      </a>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "tratamientos" && b) return <Ficha id={b} />;
  if (a === "consulta")
    return (
      <Suspense>
        <Consulta />
      </Suspense>
    );
  const P = { tratamientos: Tratamientos, preocupaciones: Preocupaciones, clinica: Clinica }[a];
  return P ? <P /> : <NoHay />;
}
