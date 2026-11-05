"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import AsciiChart from "@/components/ui/AsciiChart";
import BitmapText from "@/components/ui/BitmapText";
import Button from "@/components/ui/Button";
import Kbd from "@/components/ui/Kbd";
import TerminalTyper from "@/components/ui/TerminalTyper";
import "./consola.css";

/*
 * Propuesta «Consola» para la portada de Trama: la web como sistema de texto. Una línea de órdenes que responde con
 * los datos reales (categorías, demos por sector, variantes) y ventanas con piezas del kit vivas. Se usa con el
 * teclado: «/» enfoca la orden, ↑ recupera la anterior y las sugerencias se pulsan como botones.
 */

type Counts = { components: number; categories: number; styles: number; demos: number; sites: number };
type Cat = { id: string; label: string; count: number; first: string };
type Grupo = { id: string; kind: "sector" | "tecnica"; label: string; items: { href: string; title: string }[] };
type Salida = { orden: string; cuerpo: ReactNode };

const VARIANTS = ["glass", "solid", "outline", "neon", "retro", "terminal", "minimal", "dotmatrix", "editorial"] as const;
const SUGERENCIAS = ["ayuda", "ls componentes", "demos peluqueria", "sectores", "estilos", "instalar", "agentes"];
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

const AGENTES = `$ claude "landing para una barbería en Valencia"
[skill] trama-research · brief y firma de la referencia
[skill] trama-style · guía «barberia», contraste medido
[skill] trama-build · Hero + OpeningHours + BookingFlow
[qa] contraste AA en 11 anchos · 0 incumplimientos
[ok] página lista para revisar`;

export default function Consola({ counts, categories, grupos }: { counts: Counts; categories: Cat[]; grupos: Grupo[] }) {
  const [orden, setOrden] = useState("");
  const [log, setLog] = useState<Salida[]>([]);
  const [hist, setHist] = useState<string[]>([]);
  const [pos, setPos] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const fin = useRef<HTMLDivElement>(null);
  const sectores = grupos.filter((g) => g.kind === "sector");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !/INPUT|TEXTAREA/.test(t.tagName)) {
        e.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // la ventana abre con una orden ya ejecutada: las piezas en sus nueve acabados
  useEffect(() => {
    setLog([{ orden: "estilos", cuerpo: responder("estilos") }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (log.length > 1) fin.current?.scrollIntoView({ block: "nearest" });
  }, [log]);

  const responder = (raw: string): ReactNode => {
    const [cmd, ...rest] = norm(raw).split(/\s+/);
    const arg = rest.join(" ");
    if (cmd === "ayuda" || cmd === "help")
      return (
        <ul className="con-out__list">
          {SUGERENCIAS.map((s) => <li key={s}><code>{s}</code></li>)}
          <li><code>abrir &lt;demo&gt;</code> · <code>limpiar</code></li>
        </ul>
      );
    if (cmd === "ls" || cmd === "componentes")
      return (
        <ul className="con-out__list">
          {categories.map((c) => (
            <li key={c.id}><a href={`/componentes?c=${c.id}#${c.first}`}>{c.label.padEnd(28, ".")}</a> {String(c.count).padStart(3, " ")}</li>
          ))}
        </ul>
      );
    if (cmd === "sectores")
      return (
        <ul className="con-out__list">
          {sectores.map((s) => <li key={s.id}><button type="button" onClick={() => ejecutar(`demos ${s.id}`)}>{s.label}</button> {s.items.length}</li>)}
        </ul>
      );
    if (cmd === "demos" || cmd === "abrir") {
      const todos = grupos.flatMap((g) => g.items.map((i) => ({ ...i, g })));
      const hits = arg
        ? todos.filter((i) => norm(`${i.g.id} ${i.g.label} ${i.title}`).includes(arg))
        : todos.filter((i) => i.g.kind === "sector").slice(0, 12);
      if (!hits.length) return <p>Sin resultados para «{arg}». Prueba <code>sectores</code>.</p>;
      if (cmd === "abrir" && hits.length === 1) {
        window.location.href = hits[0].href;
        return <p>abriendo {hits[0].href}…</p>;
      }
      return (
        <ul className="con-out__list">
          {hits.slice(0, 14).map((i) => <li key={i.href}><a href={i.href}>{i.title}</a> <span className="con-dim">{i.g.label}</span></li>)}
          {hits.length > 14 && <li className="con-dim">… y {hits.length - 14} más</li>}
        </ul>
      );
    }
    if (cmd === "estilos" || cmd === "variantes")
      return (
        <div className="con-out__variants">
          {VARIANTS.map((v) => (
            <span key={v} className={v === "neon" ? "con-var--dark" : undefined}>
              <Button label={v} variant={v} size="sm" />
            </span>
          ))}
        </div>
      );
    if (cmd === "instalar" || cmd === "install")
      return (
        <pre className="con-out__pre">{`npm i trama-ui
import "trama-ui/styles.css";
import { Hero, Button } from "trama-ui";`}</pre>
      );
    if (cmd === "agentes" || cmd === "skills")
      return <p>Cuatro skills (research, style, build, kit-evolution) que guían a Claude Code y Codex. <a href="/docs/agentes">Leer la guía →</a></p>;
    return <p>Orden desconocida: «{raw}». Escribe <code>ayuda</code>.</p>;
  };

  function ejecutar(raw: string) {
    const r = raw.trim();
    if (!r) return;
    setHist((h) => [r, ...h].slice(0, 30));
    setPos(-1);
    setOrden("");
    if (norm(r) === "limpiar" || norm(r) === "clear") return setLog([]);
    setLog((l) => [...l.slice(-7), { orden: r, cuerpo: responder(r) }]);
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ejecutar(orden);
  };

  return (
    <div className="con" data-scrollable>
      <header className="con-bar">
        <span className="con-bar__brand">trama/os</span>
        <nav aria-label="Secciones">
          <a href="/componentes">componentes</a>
          <a href="/demos">demos</a>
          <a href="/guias">guías</a>
          <a href="/docs">docs</a>
          <a href="/docs/agentes">agentes</a>
        </nav>
        <span className="con-bar__hint"><Kbd>/</Kbd> escribir orden</span>
      </header>

      <main className="con-desk">
        <section className="con-win con-win--main" aria-labelledby="con-h1">
          <div className="con-win__title"><span>~/trama</span><span>{counts.components} piezas · {counts.styles} acabados</span></div>
          <div className="con-win__body">
            <BitmapText text="TRAMA" font="Standard" fontSize={12} scale={1} tone="acc" glow={false} />
            <h1 id="con-h1">Componentes, guías y recetas para webs con carácter. Se instala con una orden y se compone como texto.</h1>
            <p className="con-dim">React y Next.js. Tokens CSS para el tema, <code>variant</code> para el acabado, tus textos para todo lo demás. Escribe una orden o pulsa una sugerencia.</p>

            <div className="con-log" aria-live="polite">
              {log.map((s, i) => (
                <div key={i} className="con-out">
                  <p className="con-out__cmd"><span aria-hidden>trama ›</span> {s.orden}</p>
                  {s.cuerpo}
                </div>
              ))}
              <div ref={fin} />
            </div>

            <form className="con-prompt" onSubmit={onSubmit}>
              <label htmlFor="con-in">trama ›</label>
              <input
                id="con-in" ref={input} value={orden} autoComplete="off" spellCheck={false} placeholder="ayuda"
                onChange={(e) => setOrden(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" && hist.length) {
                    e.preventDefault();
                    const p = Math.min(pos + 1, hist.length - 1);
                    setPos(p);
                    setOrden(hist[p]);
                  }
                  if (e.key === "ArrowDown" && pos >= 0) {
                    e.preventDefault();
                    const p = pos - 1;
                    setPos(p);
                    setOrden(p < 0 ? "" : hist[p]);
                  }
                }}
              />
            </form>
            <div className="con-sug" role="group" aria-label="Órdenes sugeridas">
              {SUGERENCIAS.map((s) => <button key={s} type="button" onClick={() => ejecutar(s)}>{s}</button>)}
            </div>
          </div>
        </section>

        <section className="con-win" aria-labelledby="con-agentes">
          <div className="con-win__title"><span id="con-agentes">agentes.log</span><span>skills</span></div>
          <div className="con-win__body con-win__body--flush">
            <TerminalTyper lines={AGENTES} variant="terminal" chrome={false} cursor="block" charsPerSecond={40} prompt="" loop />
          </div>
        </section>

        <section className="con-win" aria-labelledby="con-cat">
          <div className="con-win__title"><span id="con-cat">catalogo.mon</span><span>{counts.categories} categorías</span></div>
          <div className="con-win__body">
            <AsciiChart data={categories.map((c) => c.count).join(",")} labels={categories.map((c) => c.label.slice(0, 3)).join(",")} kind="hbars" height={8} variant="terminal" />
          </div>
        </section>

        <section className="con-win" aria-labelledby="con-sec">
          <div className="con-win__title"><span id="con-sec">sectores.dir</span><span>{sectores.reduce((n, s) => n + s.items.length, 0)} demos</span></div>
          <div className="con-win__body">
            <ul className="con-dir">
              {sectores.map((s) => (
                <li key={s.id}>
                  <button type="button" onClick={() => { ejecutar(`demos ${s.id}`); input.current?.focus(); }}>
                    <span>{s.label}</span><span>{String(s.items.length).padStart(2, "0")}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="con-foot">
        <span>{counts.demos} demos · {counts.sites} webs completas</span>
        <a href="/docs/empezar">empezar →</a>
      </footer>
    </div>
  );
}
