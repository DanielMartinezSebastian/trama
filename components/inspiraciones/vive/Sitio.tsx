"use client";

import { Suspense, useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ClassSchedule from "@/components/ui/ClassSchedule";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import MemberArea from "@/components/ui/MemberArea";
import MembershipFlow from "@/components/ui/MembershipFlow";
import { useMembership } from "@/lib/commerce/membership";
import { CLASES, CLUBES, PLANES, VENTAJAS, ZONAS_DEL_PLAN } from "./data";
import { viveHref } from "./enlaces";
import { MapaClubes } from "./MapaClubes";
import "./vive.css";
import Portada from "./Vive";

/*
 * Vive Club con varias páginas (docs/56): la portada (Vive.tsx) y clases (horario por zonas: cada plan reserva las suyas;
 * sin plan, un pase de prueba), clubes (mapa interactivo), membresías (alta con MembershipFlow), ventajas (con «invita a un
 * amigo») y mi cuenta. El marco persiste: la cabecera con el menú en isla (en el móvil, a pantalla completa) y el pie.
 */

const SOCIO = "trama:vive:socio";
const NAV: [string, string][] = [["clases", "Clases"], ["ventajas", "Ventajas"], ["membresias", "Membresías"], ["clubes", "Clubes"]];

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <div className="vv" id="top">
      <header className="vv-head">
        <a href={viveHref()} className="vv-logo">
          VIVE<span>●</span>
        </a>
        <nav className="vv-isla" aria-label="Principal">
          {NAV.map(([p, l]) => (
            <a key={p} href={viveHref(p)} aria-current={path.startsWith(viveHref(p)) ? "page" : undefined}>
              {l}
            </a>
          ))}
        </nav>
        <a href={viveHref("mi-cuenta")} className="vv-unete">
          Mi cuenta [+]
        </a>
        <FullscreenMenu brand="Vive" trigger="burger" openLabel="Menú" closeLabel="Cerrar" note="4 clubes · de 6:00 a 23:00" links={[{ label: "Inicio", href: viveHref() }, ...NAV.map(([p, l]) => ({ label: l, href: viveHref(p) })), { label: "Mi cuenta", href: viveHref("mi-cuenta") }]} className="vv-menu" />
      </header>
      {children}
      <footer className="vv-pie">
        <div className="vv-pie__nav">
          <a href={viveHref()} className="vv-logo">
            VIVE<span>●</span>
          </a>
          <nav aria-label="Pie">
            {NAV.map(([p, l]) => (
              <a key={p} href={viveHref(p)}>
                {l}
              </a>
            ))}
          </nav>
          <nav aria-label="Cuenta">
            <a href={viveHref("mi-cuenta")}>Mi cuenta</a>
            <a href={viveHref("membresias")}>Únete</a>
          </nav>
          <a href="#top" className="vv-arriba" aria-label="Volver arriba">
            ↑
          </a>
        </div>
        <p className="vv-pie__lema">TÚ TIENES EL CONTROL</p>
        <div className="vv-pie__legal">
          <span>Castellana · Retiro · Arganzuela · Pozuelo · de 6:00 a 23:00</span>
          <span>© 2026 Vive Club · club de demostración de Trama</span>
        </div>
      </footer>
    </div>
  );
}

function Cab({ titulo, naranja, texto }: { titulo: string; naranja?: string; texto?: string }) {
  return (
    <header className="vv-pag__cab">
      <h1>
        {titulo} {naranja && <span className="vv-naranja">{naranja}</span>}
      </h1>
      {texto && <p>{texto}</p>}
    </header>
  );
}

function Clases() {
  const q = useSearchParams();
  const socio = useMembership(SOCIO);
  const [aviso, setAviso] = useState("");
  const zonas = socio.plan ? ZONAS_DEL_PLAN[socio.plan.id] ?? [] : [];
  const club = CLUBES.find((c) => c.id === q.get("club"));
  const clases = club ? CLASES.filter((c) => c.room === club.nombre.replace("Vive ", "")) : CLASES;
  const prueba = !socio.plan && socio.bookings.length === 0;
  return (
    <main className="vv-pag">
      <Cab titulo="NUESTRAS" naranja="CLASES" texto={club ? `Clases en ${club.nombre}. ` : "Cuarenta y cinco minutos, veinte actividades y cuatro clubes."} />
      <p className="vv-nota">
        {socio.plan ? (zonas.length ? `Tu plan ${socio.plan.name} incluye: ${zonas.join(", ").toLowerCase()}.` : `Tu plan ${socio.plan.name} es solo de sala: para clases, sube de plan.`) : prueba ? "Sin plan tienes un pase de prueba: reserva una clase gratis." : "Ya usaste tu pase de prueba. Hazte socio para reservar más."}
        {club && (
          <>
            {" "}
            <a href={viveHref("clases")}>Ver todos los clubes</a>
          </>
        )}
      </p>
      <ClassSchedule
        classes={clases}
        startOffset={0}
        bookings={socio.bookings}
        defaultCategory={q.get("zona") ?? ""}
        onBook={(c, d, espera) => {
          if (!socio.plan && !prueba) return setAviso("Ya usaste tu pase de prueba: elige una membresía para seguir.");
          if (socio.plan && !zonas.includes(c.category ?? "")) return setAviso(`${c.category} no entra en tu plan ${socio.plan.name}.`);
          setAviso("");
          socio.book(c.id, d, espera);
        }}
        freePlaces={(c, d) => Math.max(0, (c.capacity ?? 10) - (c.booked ?? 0) - (Number(d.slice(-1)) % 3) - (socio.bookings.some((b) => b.classId === c.id && b.date === d && !b.waitlist) ? 1 : 0))}
        filters="category"
        bookLabel="Reservar [+]"
        waitlistLabel="Lista de espera"
        bookedHref={viveHref("mi-cuenta")}
        bookedCta="Mi cuenta"
        variant="minimal"
        className="vv-horario"
      />
      {aviso && (
        <p className="vv-aviso" role="alert">
          {aviso} <a href={viveHref("membresias")}>Ver membresías [+]</a>
        </p>
      )}
    </main>
  );
}

function Clubes() {
  return (
    <main className="vv-pag">
      <Cab titulo="ENCUENTRA TU CLUB" naranja="MÁS CERCANO" texto="Con cualquier membresía entras en los cuatro." />
      <div className="vv-mapa vv-mapa--pag">
        <MapaClubes conLista />
      </div>
    </main>
  );
}

function Membresias() {
  const q = useSearchParams();
  return (
    <main className="vv-pag">
      <Cab titulo="ELIGE TU" naranja="PLAN" texto="Sin matrícula ni permanencia. Acceso a los cuatro clubes." />
      <MembershipFlow className="vv-flujo" plans={PLANES} initialPlan={q.get("plan") ?? undefined} storageKey={SOCIO} club="Vive" scheduleHref={viveHref("clases")} accountHref={viveHref("mi-cuenta")} />
    </main>
  );
}

function Invita() {
  const [f, setF] = useState({ tuyo: "", amigo: "" });
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");
  if (ok) return <p className="vv-aviso" role="status">Pase enviado a {f.amigo}. Si se apunta, los dos tenéis un mes al 50 % (demostración: no se envía nada).</p>;
  return (
    <form className="vv-invita" noValidate onSubmit={(e) => { e.preventDefault(); if (f.tuyo.trim().length < 2) return setError("Escribe tu nombre."); if (!/^\S+@\S+\.\S+$/.test(f.amigo.trim())) return setError("Revisa el correo de tu amigo."); setOk(true); }}>
      <label>
        Tu nombre
        <input value={f.tuyo} onChange={(e) => setF({ ...f, tuyo: e.target.value })} autoComplete="name" />
      </label>
      <label>
        Correo de tu amigo
        <input type="email" value={f.amigo} onChange={(e) => setF({ ...f, amigo: e.target.value })} />
      </label>
      {error && <small role="alert">{error}</small>}
      <button type="submit" className="vv-unete">
        Enviar pase [+]
      </button>
    </form>
  );
}

function Ventajas() {
  return (
    <main className="vv-pag">
      <Cab titulo="VENTAJAS" naranja="PARA TI" />
      <ol className="vv-ventajas-lista">
        {VENTAJAS.map((v) => (
          <li key={v.n} id={`v${v.n}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={v.img} alt="" loading="lazy" />
            <div>
              <span className="vv-naranja">{v.n}</span>
              <h2>{v.titulo}</h2>
              <p>{v.texto}</p>
              {v.n === "03" && <Invita />}
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}

function MiCuenta() {
  return (
    <main className="vv-pag">
      <Cab titulo="MI" naranja="CUENTA" texto="Tu plan, tu pase y tus clases. Guardado en este navegador." />
      <MemberArea classes={CLASES} storageKey={SOCIO} club="Vive" plansHref={viveHref("membresias")} scheduleHref={viveHref("clases")} className="vv-cuenta" />
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a] = ruta;
  const espera = <main className="vv-pag" role="status">Cargando…</main>;
  if (!a) return <Portada />;
  if (a === "clases") return <Suspense fallback={espera}><Clases /></Suspense>;
  if (a === "clubes") return <Clubes />;
  if (a === "membresias") return <Suspense fallback={espera}><Membresias /></Suspense>;
  if (a === "ventajas") return <Ventajas />;
  if (a === "mi-cuenta") return <MiCuenta />;
  return null;
}
