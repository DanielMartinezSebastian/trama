"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import SeatMap from "@/components/ui/SeatMap";
import TextField from "@/components/ui/TextField";
import { BUTACAS, GENEROS, PRECIO, TITULOS, ZONAS, type Critica, type Titulo } from "./data";
import { sesionHref } from "./enlaces";
import "./sesion-doble.css";

/*
 * Sesión Doble (docs/58), a partir del concepto de A24 de Ravi Klaassens: una distribuidora cuyo catálogo es una fila de
 * discos que giran. La portada no tiene scroll: la rueda, las flechas o arrastrar pasan de disco, y la ficha técnica y las
 * críticas cambian con él. Índice filtrable, ficha con sesiones y compra de una butaca doble (SeatMap) que queda en «mis
 * entradas». Discos en CSS 3D, sin WebGL.
 */

const CLAVE = "trama:sesion-doble:entradas";
type Entrada = { ref: string; titulo: string; sesion: string; butaca: string; nombre: string };

const leer = (): Entrada[] => {
  try {
    const v = JSON.parse(localStorage.getItem(CLAVE) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};
const guardar = (v: Entrada[]) => {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(v));
  } catch {
    /* sin almacenamiento: no se recuerdan */
  }
};

export function Shell({ children }: { children: ReactNode }) {
  const ruta = usePathname().split("/")[3] ?? "";
  const links = [
    { label: "Discos", href: sesionHref() },
    { label: "Índice", href: sesionHref("indice") },
    { label: "Mis entradas", href: sesionHref("mis-entradas") },
  ];
  return (
    <div className={`sd ${ruta ? "" : "sd--inicio"}`}>
      <header className="sd-head">
        <a href={sesionHref()} className="sd-logo" aria-label="Sesión Doble, inicio">
          S<i>2</i>
        </a>
        <nav aria-label="Principal">
          <a href={sesionHref()} aria-current={!ruta ? "page" : undefined}>
            Discos
          </a>
          <a href={sesionHref("indice")} aria-current={ruta === "indice" ? "page" : undefined}>
            Índice
          </a>
          <a href={sesionHref("mis-entradas")} aria-current={ruta === "mis-entradas" ? "page" : undefined}>
            Entradas
          </a>
        </nav>
        <div className="sd-burger">
          <FullscreenMenu brand="Sesión Doble" trigger="burger" openLabel="Menú" closeLabel="Cerrar" note="Distribuidora" links={links} />
        </div>
      </header>
      {children}
    </div>
  );
}

const Estrellas = ({ n }: { n: number }) => (
  <span className="sd-estrellas" role="img" aria-label={`${n} de 5 estrellas`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <i key={i} style={{ "--f": `${Math.max(0, Math.min(1, n - i + 1)) * 100}%` } as CSSProperties} />
    ))}
  </span>
);

const Cita = ({ c }: { c: Critica }) => (
  <figure className="sd-cita">
    <Estrellas n={c.estrellas} />
    <figcaption>{c.medio}</figcaption>
    <blockquote>«{c.frase}»</blockquote>
  </figure>
);

/** un disco: la carátula recortada en círculo, el reflejo que gira con él y el agujero central */
function Disco({ t, giro, inclinado = true }: { t: Titulo; giro: number; inclinado?: boolean }) {
  return (
    <span className={`sd-disco ${inclinado ? "sd-disco--tumbado" : ""}`} style={{ "--giro": `${giro}deg`, "--tinta": t.tinta } as CSSProperties}>
      <span className="sd-disco__cara" style={{ backgroundImage: `url(${t.img})` }}>
        <b>{t.titulo}</b>
        <small>SD · {t.ano}</small>
      </span>
      <span className="sd-disco__brillo" />
      <span className="sd-disco__agujero" />
    </span>
  );
}

function Portada() {
  const [i, setI] = useState(0);
  const [pos, setPos] = useState(0);
  const pos0 = useRef(0);
  const objetivo = useRef(0);
  const n = TITULOS.length;
  const router = useRouter();
  const arrastre = useRef<{ x: number; o: number; movio: boolean } | null>(null);

  const ir = useCallback((v: number) => {
    objetivo.current = Math.max(0, Math.min(n - 1, v));
  }, [n]);

  useEffect(() => {
    let raf = 0;
    const paso = () => {
      const s = pos0.current + (objetivo.current - pos0.current) * 0.09;
      pos0.current = Math.abs(s - objetivo.current) < 0.0005 ? objetivo.current : s;
      setPos(pos0.current);
      setI(Math.round(pos0.current));
      raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const rueda = (e: WheelEvent) => {
      e.preventDefault();
      ir(objetivo.current + (e.deltaY + e.deltaX) / 420);
    };
    const teclas = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") ir(Math.round(objetivo.current) + 1);
      if (e.key === "ArrowLeft") ir(Math.round(objetivo.current) - 1);
    };
    addEventListener("wheel", rueda, { passive: false });
    addEventListener("keydown", teclas);
    return () => {
      removeEventListener("wheel", rueda);
      removeEventListener("keydown", teclas);
    };
  }, [ir]);

  const t = TITULOS[i];
  return (
    <main
      className="sd-rueda"
      onPointerDown={(e) => {
        arrastre.current = { x: e.clientX, o: objetivo.current, movio: false };
      }}
      onPointerMove={(e) => {
        const a = arrastre.current;
        if (!a) return;
        const d = (a.x - e.clientX) / Math.min(520, innerWidth * 0.7);
        if (Math.abs(d) > 0.02) a.movio = true;
        ir(a.o + d);
      }}
      onPointerUp={() => {
        ir(Math.round(objetivo.current));
        arrastre.current = null;
      }}
    >
      <h1 className="sr-only">Sesión Doble, distribuidora de cine</h1>
      <aside className="sd-ficha" aria-live="polite">
        <h2>{t.titulo}</h2>
        <dl>
          <div>
            <dt>Dirige</dt>
            <dd>{t.direccion}</dd>
          </div>
          <div>
            <dt>Año</dt>
            <dd>{t.ano}</dd>
          </div>
          <div>
            <dt>Reparto</dt>
            <dd>
              {t.reparto.map((r) => (
                <span key={r}>{r}</span>
              ))}
            </dd>
          </div>
        </dl>
      </aside>
      <div className="sd-pista" aria-hidden>
        {TITULOS.map((x, k) => {
          const d = k - pos;
          if (Math.abs(d) > 2.6) return null;
          return (
            <button
              key={x.id}
              type="button"
              tabIndex={-1}
              className="sd-pista__item"
              style={{ transform: `translate3d(calc(${d} * var(--paso)), ${d * d * 26}px, ${-Math.abs(d) * 90}px)` }}
              onClick={() => {
                if (arrastre.current?.movio) return;
                if (k === i) router.push(sesionHref(`titulo/${x.id}`));
                else ir(k);
              }}
            >
              <Disco t={x} giro={pos * 150 + k * 40} />
            </button>
          );
        })}
      </div>
      <div className="sd-criticas" aria-live="polite">
        <Cita c={t.criticas[0]} />
        <Cita c={t.criticas[1]} />
      </div>
      <div className="sd-mandos">
        <button type="button" aria-label="Disco anterior" disabled={i === 0} onClick={() => ir(i - 1)}>
          ←
        </button>
        <span>
          {String(i + 1).padStart(2, "0")} / {n}
        </span>
        <button type="button" aria-label="Disco siguiente" disabled={i === n - 1} onClick={() => ir(i + 1)}>
          →
        </button>
        <a href={sesionHref(`titulo/${t.id}`)}>Ver {t.titulo}</a>
      </div>
    </main>
  );
}

function Indice() {
  const [genero, setGenero] = useState("");
  const [tipo, setTipo] = useState("");
  const lista = TITULOS.filter((t) => (!genero || t.genero === genero) && (!tipo || t.tipo === tipo));
  const [foco, setFoco] = useState(TITULOS[0]);
  return (
    <main className="sd-pag">
      <div className="sd-indice">
        <div>
          <h1>
            Índice<sup>{lista.length}</sup>
          </h1>
          <div className="sd-filtros" role="group" aria-label="Formato">
            {["", "Cine", "Serie"].map((f) => (
              <button key={f || "todo"} type="button" aria-pressed={tipo === f} onClick={() => setTipo(f)}>
                {f || "Todo"}
              </button>
            ))}
          </div>
          <div className="sd-filtros" role="group" aria-label="Género">
            {["", ...GENEROS].map((g) => (
              <button key={g || "todos"} type="button" aria-pressed={genero === g} onClick={() => setGenero(g)}>
                {g || "Todos"}
              </button>
            ))}
          </div>
          {lista.length ? (
            <ol className="sd-lista">
              {lista.map((t) => (
                <li key={t.id}>
                  <a href={sesionHref(`titulo/${t.id}`)} onMouseEnter={() => setFoco(t)} onFocus={() => setFoco(t)}>
                    <b>{t.titulo}</b>
                    <span>{t.direccion}</span>
                    <span>{t.ano}</span>
                    <span>{t.estado}</span>
                  </a>
                </li>
              ))}
            </ol>
          ) : (
            <p className="sd-vacio">No hay nada con ese filtro.</p>
          )}
        </div>
        <div className="sd-indice__disco" aria-hidden>
          <Disco t={foco} giro={0} inclinado={false} />
        </div>
      </div>
    </main>
  );
}

function Ficha({ id }: { id: string }) {
  const i = TITULOS.findIndex((t) => t.id === id);
  if (i < 0) return <NoHay />;
  const t = TITULOS[i];
  const sig = TITULOS[(i + 1) % TITULOS.length];
  return (
    <main className="sd-pag">
      <article className="sd-titulo">
        <div className="sd-titulo__disco">
          <Disco t={t} giro={-14} />
        </div>
        <div>
          <p className="sd-etq">
            {t.tipo} · {t.genero} · {t.duracion} · {t.estado}
          </p>
          <h1>{t.titulo}</h1>
          <p className="sd-sinopsis">{t.sinopsis}</p>
          <dl className="sd-datos">
            <div>
              <dt>Dirige</dt>
              <dd>{t.direccion}</dd>
            </div>
            <div>
              <dt>Reparto</dt>
              <dd>{t.reparto.join(", ")}</dd>
            </div>
            <div>
              <dt>Año</dt>
              <dd>{t.ano}</dd>
            </div>
          </dl>
          <div className="sd-citas">
            <Cita c={t.criticas[0]} />
            <Cita c={t.criticas[1]} />
          </div>
          {t.sesiones ? (
            <section aria-label="Sesiones">
              <h2 className="sd-etq">Sesiones en Cines Doble</h2>
              <div className="sd-sesiones">
                {t.sesiones.map((s) => (
                  <a key={s} href={`${sesionHref("entradas")}?t=${t.id}&s=${encodeURIComponent(s)}`}>
                    {s}
                  </a>
                ))}
              </div>
            </section>
          ) : (
            <p className="sd-etq">{t.estado === "Próximamente" ? "Se estrena pronto." : "Ya no está en salas."}</p>
          )}
        </div>
      </article>
      <a className="sd-siguiente" href={sesionHref(`titulo/${sig.id}`)}>
        <small>Siguiente disco</small>
        {sig.titulo}
      </a>
    </main>
  );
}

function Entradas() {
  const q = useSearchParams();
  const cartelera = useMemo(() => TITULOS.filter((t) => t.sesiones), []);
  const t = cartelera.find((x) => x.id === q.get("t")) ?? cartelera[0];
  const sesion = t.sesiones!.includes(q.get("s") ?? "") ? q.get("s")! : t.sesiones![0];
  const ocupadas = useMemo(() => BUTACAS.filter((_, k) => (k * 7 + sesion.length) % 5 === 0).map((b) => b.id), [sesion]);
  const [butaca, setButaca] = useState("");
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [hecha, setHecha] = useState<Entrada | null>(null);
  if (hecha)
    return (
      <main className="sd-pag sd-ok">
        <h1>Disfruta de la doble</h1>
        <p>
          {hecha.titulo}, {hecha.sesion}. Butaca doble {hecha.butaca}. Referencia <b>{hecha.ref}</b>.
        </p>
        <a className="sd-boton" href={sesionHref("mis-entradas")}>
          Ver mis entradas
        </a>
      </main>
    );
  const zona = BUTACAS.find((b) => b.id === butaca)?.zone;
  const precio = PRECIO * 2 + (zona === "lateral" ? -3 : 0);
  return (
    <main className="sd-pag">
      <div className="sd-compra">
        <div>
          <p className="sd-etq">{sesion}</p>
          <h1>{t.titulo}</h1>
          <SeatMap tables={BUTACAS} zones={ZONAS} taken={ocupadas} value={butaca} onChange={setButaca} guests={2} stage="Pantalla" label="Elige tu butaca doble" ratio={16 / 11} variant="minimal" />
        </div>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (!butaca) return setError("Elige una butaca en el plano.");
            if (nombre.trim().length < 2) return setError("Escribe a nombre de quién va la entrada.");
            const ent = { ref: `SD-${Math.floor(1000 + Math.random() * 9000)}`, titulo: t.titulo, sesion, butaca, nombre };
            guardar([ent, ...leer()]);
            setHecha(ent);
          }}
        >
          <p className="sd-etq">Tu sesión</p>
          <p>{butaca ? `Butaca doble ${butaca}` : "Sin butaca todavía"}</p>
          <p className="sd-precio">{butaca ? `${precio.toFixed(2).replace(".", ",")} €` : "—"}</p>
          <TextField label="A nombre de" placeholder="Tu nombre" value={nombre} onChange={setNombre} />
          {error && (
            <p className="sd-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="sd-boton">
            Comprar entrada
          </button>
          <small>Compra simulada: es una demostración.</small>
        </form>
      </div>
    </main>
  );
}

function MisEntradas() {
  const [lista, setLista] = useState<Entrada[]>([]);
  useEffect(() => setLista(leer()), []);
  return (
    <main className="sd-pag">
      <div className="sd-mias">
        <h1>Mis entradas</h1>
        {lista.length ? (
          <ul>
            {lista.map((e) => (
              <li key={e.ref}>
                <b>{e.titulo}</b>
                <span>{e.sesion}</span>
                <span>Butaca {e.butaca}</span>
                <span>{e.ref}</span>
                <button
                  type="button"
                  onClick={() => {
                    const v = lista.filter((x) => x.ref !== e.ref);
                    guardar(v);
                    setLista(v);
                  }}
                >
                  Devolver
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="sd-vacio">
            Todavía no tienes entradas. <a href={sesionHref("indice")}>Mira qué hay en cartel</a>.
          </p>
        )}
      </div>
    </main>
  );
}

function NoHay() {
  return (
    <main className="sd-pag sd-ok">
      <h1>Este disco está rayado</h1>
      <a className="sd-boton" href={sesionHref()}>
        Volver a los discos
      </a>
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "titulo" && b) return <Ficha id={b} />;
  if (a === "indice") return <Indice />;
  if (a === "mis-entradas") return <MisEntradas />;
  if (a === "entradas")
    return (
      <Suspense>
        <Entradas />
      </Suspense>
    );
  return <NoHay />;
}
