"use client";

import dynamic from "next/dynamic";
import { Suspense, useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import AppointmentList from "@/components/ui/AppointmentList";
import BookingFlow from "@/components/ui/BookingFlow";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import OpeningHours from "@/components/ui/OpeningHours";
import { money } from "@/lib/commerce/money";
import { ARTISTA, ESTILISTAS, OBRAS, SERVICIOS } from "./data";
import { nuraHref } from "./enlaces";
import { Obra } from "./Nura";
import "./nura.css";

/*
 * Nura con varias páginas (docs/56): la portada (Nura.tsx) y pelo (servicios y estilistas), arte (la exposición y la ficha
 * de cada obra, con «pedir información» y «reservar una visita»), reservar, mis citas e info. El marco persiste: en las
 * páginas interiores una barra arriba (menú a pantalla completa en el móvil), el pie con el formulario y la barra fija de
 * abajo, cuyos accesos se rellenan al pasar.
 */

const Portada = dynamic(() => import("./Nura"));
const CITAS = "trama:nura:citas";
const NAV: [string, string][] = [["pelo", "Pelo"], ["arte", "& Arte"], ["reservar", "Reservar"], ["mis-citas", "Mis citas"], ["info", "Info"]];

function Formulario({ asunto = "" }: { asunto?: string }) {
  const [f, setF] = useState({ nombre: "", correo: "", mensaje: asunto });
  const [estado, setEstado] = useState<"" | "error" | "ok">("");
  if (estado === "ok")
    return (
      <div className="nu-form" role="status">
        <span>Gracias, {f.nombre.split(" ")[0]}</span>
        <p>Te contestamos en un día (demostración: no se ha enviado nada).</p>
      </div>
    );
  return (
    <form className="nu-form" noValidate onSubmit={(e) => { e.preventDefault(); setEstado(f.nombre.trim().length > 1 && /^\S+@\S+\.\S+$/.test(f.correo.trim()) && f.mensaje.trim().length > 3 ? "ok" : "error"); }}>
      <span>Pelo &nbsp; &amp; Arte</span>
      <p>Para consultas del salón o sobre arte y exposiciones: hola@nura.example o el formulario.</p>
      <label>
        Nombre
        <input name="nombre" autoComplete="name" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} />
      </label>
      <label>
        Correo
        <input name="correo" type="email" autoComplete="email" value={f.correo} onChange={(e) => setF({ ...f, correo: e.target.value })} />
      </label>
      <label>
        Tu mensaje
        <textarea name="mensaje" rows={4} value={f.mensaje} onChange={(e) => setF({ ...f, mensaje: e.target.value })} />
      </label>
      {estado === "error" && <p role="alert">Revisa el nombre, el correo y el mensaje.</p>}
      <button type="submit">Enviar</button>
    </form>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const portada = path === nuraHref();
  return (
    <div className="nu" id="top">
      {!portada && (
        <header className="nu-arriba">
          <a href={nuraHref()} className="nu-arriba__marca">
            N U R A
          </a>
          <nav aria-label="Principal" className="nu-arriba__nav">
            {NAV.map(([p, l]) => (
              <a key={p} href={nuraHref(p)} aria-current={path.startsWith(nuraHref(p)) ? "page" : undefined}>
                {l}
              </a>
            ))}
          </nav>
          <FullscreenMenu brand="Nura" trigger="burger" openLabel="Menú" closeLabel="Cerrar" note="Calle del Espíritu Santo 12 · Madrid" links={[{ label: "Inicio", href: nuraHref() }, ...NAV.map(([p, l]) => ({ label: l, href: nuraHref(p) }))]} className="nu-menu" />
        </header>
      )}
      {children}
      <footer className="nu-pie">
        <strong className="nu-pie__marca">N U R A</strong>
        <Formulario />
        <div className="nu-pie__col">
          <span>Calle del Espíritu Santo 12, MAD</span>
          <span className="nu-pie__mut">Reservar</span>
          {ESTILISTAS.map((e) => (
            <a key={e.name} href={nuraHref(`reservar?estilista=${encodeURIComponent(e.name)}`)}>
              {e.name}
            </a>
          ))}
        </div>
      </footer>
      <nav className="nu-barra-fija" aria-label="Accesos">
        <a href={nuraHref("info")}>Info</a>
        <a href="mailto:hola@nura.example">hola@nura.example</a>
        <a href={nuraHref("arte")}>@nurapeloyarte</a>
        <a href="#top">Arriba ↑</a>
      </nav>
    </div>
  );
}

function Cab({ titulo, texto }: { titulo: string; texto?: string }) {
  return (
    <header className="nu-pag__cab">
      <h1>/ {titulo}</h1>
      {texto && <p>{texto}</p>}
    </header>
  );
}

function Pelo() {
  return (
    <main className="nu-pag">
      <Cab titulo="Pelo" texto="Un equipo escogido de estilistas independientes, cada uno con su estilo. Atentos a lo que imaginas, juntamos creatividad y oficio para hacerte tu mejor versión." />
      <ul className="nu-lista">
        {SERVICIOS.map((s) => (
          <li key={s.id}>
            <span>{s.name}</span>
            <span className="nu-lista__mut">{s.description}</span>
            <span>
              {s.from ? "desde " : ""}
              {money(s.price ?? 0, "EUR", "es-ES", true)} · {s.minutes} min
            </span>
            <a href={nuraHref(`reservar?servicio=${s.id}`)}>Reservar →</a>
          </li>
        ))}
      </ul>
      <ul className="nu-estilistas">
        {ESTILISTAS.map((e) => (
          <li key={e.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={e.photo} alt={e.name} loading="lazy" />
            <span>{e.name}</span>
            <span className="nu-lista__mut">{e.ig}</span>
            <p>{e.bio}</p>
            <a href={nuraHref(`reservar?estilista=${encodeURIComponent(e.name)}`)}>Reservar con {e.name.split(" ")[0]} →</a>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Arte() {
  return (
    <main className="nu-pag">
      <Cab titulo="Exposición actual" texto={`${ARTISTA.nombre}: ${ARTISTA.bio}`} />
      <div className="nu-sala nu-sala--pag">
        {OBRAS.map((o) => (
          <Obra key={o.slug} o={o} />
        ))}
      </div>
      <p className="nu-nota">Las obras se ven en la sala del salón de martes a sábado, con o sin cita de pelo.</p>
    </main>
  );
}

function FichaObra({ slug }: { slug: string }) {
  const o = OBRAS.find((x) => x.slug === slug)!;
  const [quiere, setQuiere] = useState(false);
  return (
    <main className="nu-pag">
      <a href={nuraHref("arte")} className="nu-volver">
        ← Exposición actual
      </a>
      <div className="nu-ficha">
        <Obra o={o} grande />
        <div className="nu-ficha__txt">
          <h1>{o.titulo}</h1>
          <p className="nu-lista__mut">
            {ARTISTA.nombre} · {o.tecnica} · {o.medida}
          </p>
          <p>{o.texto}</p>
          <p>{o.vendida ? "Vendida" : money(o.precio, "EUR", "es-ES", true)}</p>
          {!o.vendida && (
            <button type="button" className="nu-vertodo" onClick={() => setQuiere(true)}>
              Pedir información <i aria-hidden>▶</i>
            </button>
          )}
          <a href={nuraHref("reservar?servicio=secado")} className="nu-enlace">
            Ven a verla mientras te peinamos →
          </a>
        </div>
      </div>
      {quiere && (
        <section className="nu-pide" aria-label="Pedir información">
          <Formulario asunto={`Me interesa «${o.titulo}».`} />
        </section>
      )}
    </main>
  );
}

function Reservar() {
  const q = useSearchParams();
  return (
    <main className="nu-pag">
      <Cab titulo="Reservar" />
      <BookingFlow
        key={`${q.get("editar") ?? ""}${q.get("servicio") ?? ""}${q.get("estilista") ?? ""}`}
        className="nu-flujo"
        services={SERVICIOS}
        staff={ESTILISTAS}
        initialService={q.get("servicio") ?? undefined}
        initialStaff={q.get("estilista") ?? undefined}
        editId={q.get("editar") ?? undefined}
        times="10:00, 11:00, 12:00, 13:00, 16:00, 17:00, 18:00, 19:00"
        closedDays="0,1"
        closesAt={{ 6: "15:00" }}
        storageKey={CITAS}
        serviceLabel="Servicio"
        staffLabel="Estilista"
        business="Nura"
        location="Calle del Espíritu Santo 12, Madrid"
        appointmentsHref={nuraHref("mis-citas")}
      />
    </main>
  );
}

function MisCitas() {
  return (
    <main className="nu-pag">
      <Cab titulo="Mis citas" />
      <AppointmentList services={SERVICIOS} storageKey={CITAS} bookHref={nuraHref("reservar")} business="Nura" location="Calle del Espíritu Santo 12, Madrid" />
    </main>
  );
}

function Info() {
  return (
    <main className="nu-pag">
      <Cab titulo="Info" texto="Peluquería y sala de arte en Malasaña desde 2016. La sala expone a una artista cada trimestre." />
      <div className="nu-info">
        <OpeningHours hours={"L|cerrado\nM-V|10:00-20:00\nS|10:00-15:00\nD|cerrado"} title="Horario" variant="minimal" />
        <p>
          Calle del Espíritu Santo 12
          <br />
          28004 Madrid · Metro Noviciado y Tribunal
          <br />
          <a href="mailto:hola@nura.example">hola@nura.example</a>
        </p>
      </div>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "pelo") return <Pelo />;
  if (a === "arte") return b ? <FichaObra slug={b} /> : <Arte />;
  if (a === "reservar")
    return (
      <Suspense fallback={<main className="nu-pag" role="status">Cargando…</main>}>
        <Reservar />
      </Suspense>
    );
  if (a === "mis-citas") return <MisCitas />;
  if (a === "info") return <Info />;
  return null;
}
