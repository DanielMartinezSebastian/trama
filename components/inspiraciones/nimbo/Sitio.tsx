"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import BriefFlow from "@/components/ui/BriefFlow";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import { ARRANQUES, BLOG, CODIGO, EJEMPLOS, EQUIPO_IMG, FUNCIONES, GPUS, PLANES, RAZONES, REGIONES } from "./data";
import { nimboHref } from "./enlaces";
import "./nimbo.css";

/*
 * Nimbo (docs/59), a partir de Cerebrium: GPU sin servidor para IA en tiempo real. Portada de negro a violeta con una cinta
 * de luz magenta que se dibuja sola; titular en grotesca fina (ABC Favorit 300 → Mona Sans 300) y etiquetas en mono
 * mayúscula. Después, gris claro con texto azul marino rgb(23,43,118): la lista de razones a la izquierda y, a la derecha,
 * barras de arranque, mapa de regiones y una gráfica que se mueve. Flujos: calculadora de precio por GPU, documentación con
 * código copiable y petición de demo.
 */

const NAV: [string, string][] = [
  ["casos", "Casos de uso"],
  ["precios", "Precios"],
  ["docs", "Docs"],
  ["blog", "Blog"],
  ["empresa", "Empresa"],
];
const eur = (n: number, d = 0) => `${n.toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d })} €`;

export function Shell({ children }: { children: ReactNode }) {
  const ruta = usePathname().split("/")[3] ?? "";
  return (
    <div className="ni" id="top">
      <header className="ni-head">
        <a href={nimboHref()} className="ni-logo">
          <span aria-hidden>≡</span>Nimbo
        </a>
        <nav aria-label="Principal">
          {NAV.map(([p, l]) => (
            <a key={p} href={nimboHref(p)} aria-current={ruta === p ? "page" : undefined}>
              {l}
            </a>
          ))}
        </nav>
        <div className="ni-head__acciones">
          <a href={nimboHref("docs")} className="ni-boton ni-boton--gris">
            Entrar
          </a>
          <a href={nimboHref("precios")} className="ni-boton">
            Regístrate
          </a>
        </div>
        <div className="ni-burger">
          <FullscreenMenu
            trigger="label"
            layout="drop"
            tone="fg"
            reveal="slide"
            size="sm"
            className="ni-menu"
            brand="Nimbo"
            openLabel="Menú"
            closeLabel="Cerrar"
            note="GPU sin servidor"
            links={[{ label: "Inicio", href: nimboHref() }, ...NAV.map(([p, l]) => ({ label: l, href: nimboHref(p) })), { label: "Pide una demo", href: nimboHref("demo") }]}
          />
        </div>
      </header>
      {children}
      <footer className="ni-pie">
        <div>
          <a href={nimboHref()} className="ni-logo">
            <span aria-hidden>≡</span>Nimbo
          </a>
          <p>Infraestructura de IA en tiempo real.</p>
        </div>
        <nav aria-label="Pie">
          {NAV.map(([p, l]) => (
            <a key={p} href={nimboHref(p)}>
              {l}
            </a>
          ))}
          <a href={nimboHref("demo")}>Pide una demo</a>
        </nav>
        <small>Nimbo · plataforma de demostración de Trama. Clientes, cifras y precios inventados.</small>
      </footer>
    </div>
  );
}

/** la cinta de luz: dos trazos con degradado que fluyen; con movimiento reducido, quieta */
function Cinta({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1000 700" className={`ni-cinta ${className}`} aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ni-g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ff3d8b" stopOpacity="0" />
          <stop offset="0.35" stopColor="#ff3d8b" />
          <stop offset="0.7" stopColor="#b14dff" />
          <stop offset="1" stopColor="#5b2bff" stopOpacity="0" />
        </linearGradient>
        <filter id="ni-blur">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>
      <path className="ni-cinta__halo" d="M-40 640 C 220 520 300 160 560 170 C 820 180 760 520 1040 430" fill="none" stroke="url(#ni-g)" strokeWidth="120" filter="url(#ni-blur)" opacity="0.45" />
      <path className="ni-cinta__a" d="M-40 640 C 220 520 300 160 560 170 C 820 180 760 520 1040 430" fill="none" stroke="url(#ni-g)" strokeWidth="46" strokeLinecap="round" />
      <path className="ni-cinta__b" d="M-40 600 C 240 500 320 210 560 215 C 800 220 760 500 1040 470" fill="none" stroke="#ffd2e6" strokeWidth="2" strokeDasharray="6 14" opacity="0.7" />
    </svg>
  );
}

function useVisible<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setV(true), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, v] as const;
}

function Barras() {
  const [ref, v] = useVisible<HTMLDivElement>();
  const max = Math.max(...ARRANQUES.map(([, s]) => s));
  return (
    <div className="ni-tarjeta ni-barras" ref={ref}>
      <p className="ni-mono">Arranque en frío, en segundos</p>
      {ARRANQUES.map(([n, s], i) => (
        <div key={n} className={i < 2 ? "is-nimbo" : ""}>
          <span>{n}</span>
          <i style={{ width: v ? `${Math.max(2, (s / max) * 100)}%` : "0%" }} />
          <b>{s} s</b>
        </div>
      ))}
    </div>
  );
}

function Mapa() {
  return (
    <div className="ni-tarjeta ni-mapa">
      <p className="ni-mono">Capacidad · 3.700+ GPU</p>
      <div className="ni-mapa__puntos" aria-label="Regiones con GPU">
        {Array.from({ length: 420 }, (_, k) => {
          const x = (k % 35) * 2.9 + 1, y = Math.floor(k / 35) * 8 + 2;
          const tierra = Math.sin(x * 0.11) * Math.cos(y * 0.09) + Math.sin((x + y) * 0.05) > 0.15;
          return tierra ? <i key={k} style={{ left: `${x}%`, top: `${y}%` }} /> : null;
        })}
        {REGIONES.map((r) => (
          <span key={r.n} style={{ left: `${r.x}%`, top: `${r.y}%` } as CSSProperties} title={`${r.n}: ${r.gpu} GPU`}>
            <b>{r.gpu}+</b>
          </span>
        ))}
      </div>
    </div>
  );
}

function Grafica() {
  const [datos, setDatos] = useState(() => Array.from({ length: 24 }, (_, i) => [40 + Math.sin(i / 2) * 12, 30 + Math.cos(i / 3) * 10]));
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setDatos((d) => [...d.slice(1), [Math.max(10, Math.min(80, d[d.length - 1][0] + (Math.random() - 0.5) * 16)), Math.max(8, Math.min(70, d[d.length - 1][1] + (Math.random() - 0.5) * 12))]]), 900);
    return () => clearInterval(t);
  }, []);
  const linea = (k: number) => datos.map((p, i) => `${(i / 23) * 300},${100 - p[k]}`).join(" ");
  return (
    <div className="ni-tarjeta ni-grafica">
      <p className="ni-mono">Memoria máxima (GB) · en directo</p>
      <svg viewBox="0 0 300 100" preserveAspectRatio="none" aria-label="Gráfica de memoria por réplica">
        {[25, 50, 75].map((y) => (
          <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="rgba(23,43,118,0.12)" />
        ))}
        <polyline points={linea(0)} fill="none" stroke="#ff3d8b" strokeWidth="1.6" />
        <polyline points={linea(1)} fill="none" stroke="#5b6fd6" strokeWidth="1.6" />
      </svg>
      <div className="ni-leyenda">
        <span className="is-a">P99</span>
        <span className="is-b">Media</span>
      </div>
    </div>
  );
}

function Codigo({ inicial = "python" }: { inicial?: keyof typeof CODIGO }) {
  const [tab, setTab] = useState<keyof typeof CODIGO>(inicial);
  const [copiado, setCopiado] = useState(false);
  return (
    <div className="ni-codigo">
      <div role="tablist" aria-label="Lenguaje">
        {(Object.keys(CODIGO) as (keyof typeof CODIGO)[]).map((k) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>
            {k}
          </button>
        ))}
        <button
          type="button"
          className="ni-codigo__copiar"
          onClick={() => {
            navigator.clipboard?.writeText(CODIGO[tab]).catch(() => {});
            setCopiado(true);
            setTimeout(() => setCopiado(false), 1600);
          }}
        >
          {copiado ? "Copiado" : "Copiar"}
        </button>
      </div>
      <pre>
        <code>{CODIGO[tab]}</code>
      </pre>
    </div>
  );
}

function Ejemplos() {
  const [tipo, setTipo] = useState<"Voz" | "LLM" | "Otros">("Voz");
  return (
    <section className="ni-ejemplos">
      <Cinta className="ni-cinta--fondo" />
      <h2>Hecho con Nimbo</h2>
      <div className="ni-seg" role="tablist" aria-label="Tipo de ejemplo">
        {(["Voz", "LLM", "Otros"] as const).map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tipo === t} onClick={() => setTipo(t)}>
            {t}
          </button>
        ))}
      </div>
      <div className="ni-ejemplos__rejilla">
        {EJEMPLOS.filter((e) => e.tipo === tipo).map((e) => (
          <article key={e.id}>
            <span aria-hidden>{e.icono}</span>
            <div>
              <b>{e.t}</b>
              <p>{e.d}</p>
              <a href={nimboHref("docs")} className="ni-mono">
                Probar ahora
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Portada() {
  return (
    <main>
      <section className="ni-hero">
        <Cinta />
        <h1>
          Infraestructura de IA en tiempo real que <em>crece</em> contigo
        </h1>
        <div className="ni-hero__lado">
          <p>Despliega agentes de voz, modelos de vídeo, LLM y cualquier carga de IA con arranques de segundos y escalado automático. Para equipos que necesitan que funcione siempre.</p>
          <div>
            <a href={nimboHref("precios")} className="ni-boton">
              Pruébalo
            </a>
            <a href={nimboHref("demo")} className="ni-boton ni-boton--oscuro">
              Pide una demo
            </a>
          </div>
        </div>
      </section>

      <section className="ni-clientes" aria-label="Equipos que usan Nimbo">
        {["Velarta", "ondaSur", "Kerno", "PAPYRA", "Lumo Health", "tesela"].map((c) => (
          <span key={c}>{c}</span>
        ))}
      </section>

      <section className="ni-por-que">
        <div className="ni-por-que__lista">
          <p className="ni-mono">Por qué Nimbo</p>
          {RAZONES.map((r) => (
            <h3 key={r.t}>{r.t}</h3>
          ))}
        </div>
        <div className="ni-por-que__tarjetas">
          <Barras />
          <p className="ni-por-que__txt">
            <b>Baja latencia desde la primera petición.</b> {RAZONES[0].d}
          </p>
          <Mapa />
          <p className="ni-por-que__txt">
            <b>Sin reservas ni permanencia.</b> {RAZONES[1].d}
          </p>
          <Codigo />
          <p className="ni-por-que__txt">
            <b>Trae tu código; nosotros lo ejecutamos.</b> {RAZONES[2].d}
          </p>
          <Grafica />
          <p className="ni-por-que__txt">
            <b>Observabilidad de punta a punta.</b> {RAZONES[3].d}
          </p>
        </div>
      </section>

      <section className="ni-funciones">
        <p className="ni-mono">Todo lo que necesitas para producción</p>
        <ul>
          {FUNCIONES.map((f) => (
            <li key={f}>
              <a href={nimboHref("docs")}>
                {f} <span aria-hidden>→</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Ejemplos />

      <section className="ni-blog">
        <header>
          <h2>Lo último del blog</h2>
          <a href={nimboHref("blog")} className="ni-boton ni-boton--blanco">
            Ver todo
          </a>
        </header>
        <div>
          {BLOG.map((b) => (
            <a key={b.id} href={nimboHref(`blog/${b.id}`)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.img} alt="" loading="lazy" />
              <small className="ni-mono">{b.f}</small>
              <b>{b.t}</b>
            </a>
          ))}
        </div>
      </section>

      <section className="ni-final">
        <Cinta />
        <h2>Lleva tu modelo a producción esta tarde</h2>
        <div>
          <a href={nimboHref("precios")} className="ni-boton">
            Empieza gratis
          </a>
          <a href={nimboHref("demo")} className="ni-boton ni-boton--oscuro">
            Habla con ingeniería
          </a>
        </div>
      </section>
    </main>
  );
}

const Cab = ({ titulo, texto, sobre }: { titulo: string; texto?: string; sobre?: string }) => (
  <header className="ni-cab">
    {sobre && <p className="ni-mono">{sobre}</p>}
    <h1>{titulo}</h1>
    {texto && <p>{texto}</p>}
  </header>
);

function Casos() {
  return (
    <main className="ni-pag">
      <Cab sobre="Casos de uso" titulo="Lo que se despliega en Nimbo" texto="Voz, lenguaje, imagen y vídeo, con la misma plataforma." />
      <Ejemplos />
    </main>
  );
}

function Precios() {
  const [gpu, setGpu] = useState(GPUS[1].id);
  const [peticiones, setPeticiones] = useState(20000);
  const [segundos, setSegundos] = useState(1.5);
  const g = GPUS.find((x) => x.id === gpu)!;
  const mes = g.seg * segundos * peticiones * 30;
  return (
    <main className="ni-pag ni-pag--clara">
      <Cab sobre="Precios" titulo="Pagas por segundo de GPU" texto="Sin cuota mínima en el plan de pruebas. Cuando no hay peticiones, no pagas." />
      <div className="ni-calc">
        <div className="ni-tarjeta">
          <label>
            <span className="ni-mono">GPU</span>
            <select value={gpu} onChange={(e) => setGpu(e.target.value)}>
              {GPUS.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.n} · {eur(x.seg * 3600, 2)}/h
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="ni-mono">Peticiones al día: {peticiones.toLocaleString("es-ES")}</span>
            <input type="range" min={1000} max={500000} step={1000} value={peticiones} onChange={(e) => setPeticiones(Number(e.target.value))} />
          </label>
          <label>
            <span className="ni-mono">Segundos de GPU por petición: {segundos.toLocaleString("es-ES")}</span>
            <input type="range" min={0.1} max={10} step={0.1} value={segundos} onChange={(e) => setSegundos(Number(e.target.value))} />
          </label>
        </div>
        <div className="ni-tarjeta ni-calc__total" aria-live="polite">
          <p className="ni-mono">Coste estimado al mes</p>
          <b>{eur(mes, mes < 100 ? 2 : 0)}</b>
          <small>{((peticiones * segundos * 30) / 3600).toLocaleString("es-ES", { maximumFractionDigits: 0 })} horas de GPU · sin impuestos</small>
        </div>
      </div>
      <div className="ni-planes">
        {PLANES.map((p) => (
          <article key={p.n} className="ni-tarjeta">
            <p className="ni-mono">{p.n}</p>
            <b>{p.precio}</b>
            <span>{p.d}</span>
            <ul>
              {p.rasgos.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <a href={nimboHref(p.n === "Empresa" ? "demo" : "docs")} className={`ni-boton ${p.n === "Equipo" ? "" : "ni-boton--blanco"}`}>
              {p.n === "Empresa" ? "Hablar con ventas" : "Empezar"}
            </a>
          </article>
        ))}
      </div>
    </main>
  );
}

function Docs() {
  return (
    <main className="ni-pag ni-pag--clara">
      <Cab sobre="Documentación" titulo="Del portátil a producción en tres comandos" />
      <ol className="ni-pasos">
        <li>
          <b>Instala la CLI y entra</b>
          <Codigo inicial="terminal" />
        </li>
        <li>
          <b>Marca tu función como endpoint</b>
          <Codigo inicial="python" />
        </li>
        <li>
          <b>Llámala desde donde quieras</b>
          <Codigo inicial="curl" />
        </li>
      </ol>
    </main>
  );
}

function Blog() {
  return (
    <main className="ni-pag">
      <Cab sobre="Blog" titulo="Ingeniería, costes y casos reales" />
      <section className="ni-blog ni-blog--pag">
        <div>
          {BLOG.map((b) => (
            <a key={b.id} href={nimboHref(`blog/${b.id}`)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.img} alt="" loading="lazy" />
              <small className="ni-mono">{b.f}</small>
              <b>{b.t}</b>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function Post({ id }: { id: string }) {
  const b = BLOG.find((x) => x.id === id);
  if (!b) return <NoHay />;
  return (
    <main className="ni-pag ni-pag--clara ni-post">
      <Cab sobre={b.f} titulo={b.t} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={b.img} alt="" />
      {b.texto.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <a href={nimboHref("blog")} className="ni-mono">
        ← Volver al blog
      </a>
    </main>
  );
}

function Empresa() {
  return (
    <main className="ni-pag ni-pag--clara">
      <Cab sobre="Empresa" titulo="Diecinueve personas entre Madrid y Lisboa" texto="Montamos Nimbo en 2023 porque desplegar un modelo nos costaba más que entrenarlo." />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={EQUIPO_IMG} alt="El equipo de Nimbo" className="ni-ancha" />
      <div className="ni-cifras">
        {[
          ["2023", "fundada"],
          ["3.700+", "GPU en siete regiones"],
          ["1.200 M", "peticiones al mes"],
        ].map(([a, b]) => (
          <div key={b}>
            <b>{a}</b>
            <span>{b}</span>
          </div>
        ))}
      </div>
    </main>
  );
}

function Demo() {
  return (
    <main className="ni-pag ni-pag--clara">
      <Cab sobre="Demo" titulo="Habla con ingeniería" texto="Treinta minutos con alguien que ha desplegado cargas como la tuya." />
      <BriefFlow className="ni-flujo" title="Pedir una demo" services={[{ label: "Agentes de voz" }, { label: "LLM propio" }, { label: "Imagen y vídeo" }, { label: "Otra carga" }]} servicesLabel="¿Qué quieres desplegar?" budgets="Menos de 1.000 €/mes, 1.000–10.000 €/mes, Más de 10.000 €/mes" budgetLabel="Gasto previsto en GPU" question="Cuéntanos tu modelo, el tráfico y la latencia que necesitas" fields="company" prefix="NB" variant="minimal" />
    </main>
  );
}

function NoHay() {
  return (
    <main className="ni-pag">
      <Cab sobre="404" titulo="Este endpoint no responde" texto="Prueba con la portada o la documentación." />
    </main>
  );
}

export function Pagina({ ruta }: { ruta: string[] }) {
  const [a, b] = ruta;
  if (!a) return <Portada />;
  if (a === "blog" && b) return <Post id={b} />;
  const P = { casos: Casos, precios: Precios, docs: Docs, blog: Blog, empresa: Empresa, demo: Demo }[a];
  return P ? <P /> : <NoHay />;
}
