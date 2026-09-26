"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore, type MouseEvent } from "react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import TextField from "@/components/ui/TextField";
import { SITE_STYLE } from "@/components/site/theme";
import type { DemoMeta } from "@/lib/demos";
import { BANNER_FONTS, HOVER_EFFECTS, textStore } from "@/lib/text/store";
import "./demo-hud.css";

type Props = {
  demo: DemoMeta;
  /** posición en la secuencia navegable (demos de efectos: sin landings ni webs) */
  index: number;
  total: number;
  prev: DemoMeta;
  next: DemoMeta;
  visible: boolean;
  onToggle: () => void;
  onFullscreen: () => void;
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Interfaz del visor de demos de efectos (fondos, texto, scroll) con la estética de la web de Trama: franjas negras con
 * línea punteada, etiquetas monoespaciadas y el rojo de acento, hechas con piezas del kit (`Button`, `TextField`, `Select`
 * en variante minimal) sobre los tokens de la web. Las landings y las webs completas no la llevan: se ven como en producción.
 */
export default function DemoHud({ demo, index, total, prev, next, visible, onToggle, onFullscreen }: Props) {
  const router = useRouter();
  const tag = [demo.lib, demo.reactive ? "reactivo" : "ambiente"].filter(Boolean).join(" · ");
  const withText = demo.family === "text" || demo.text;

  // los Button con href del kit son <a> normales: aquí navegan sin recargar (la demo siguiente monta su propio lienzo)
  const clientNav = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest("a");
    const href = a?.getAttribute("href");
    if (!href?.startsWith("/") || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    router.push(href);
  };

  return (
    <div className={`dh ${visible ? "" : "dh--hidden"}`} style={SITE_STYLE} onClickCapture={clientNav}>
      <header className="dh__top" inert={!visible}>
        <div className="dh__left">
          <Link href="/" className="dh__brand" aria-label="Trama, inicio">
            <span className="dh__mark" aria-hidden />
            TRAMA
          </Link>
          <Button label="Demos" href="/demos" variant="minimal" emphasis="ghost" intent="neutral" size="sm" glyph="←" glyphPosition="start" aria-keyshortcuts="Escape" className="dh__back" />
        </div>
        <div className="dh__title">
          <p className="dh__label">
            <span className="dh__accent" style={{ background: demo.accent }} aria-hidden />
            <span>
              [{pad(index + 1)}/{pad(total)}]
            </span>
            <span className="dh__tag">{tag}</span>
          </p>
          <h1>{demo.title}</h1>
        </div>
        <div className="dh__right">
          <Button label="Ocultar" onClick={onToggle} variant="minimal" emphasis="ghost" intent="neutral" size="sm" aria-keyshortcuts="H" className="dh__hide" />
          <Button label="Pantalla completa" iconOnly glyph="⛶" onClick={onFullscreen} variant="minimal" emphasis="ghost" intent="neutral" size="sm" aria-keyshortcuts="F" />
        </div>
      </header>

      {withText && <TextBar controls={demo.controls ?? []} inert={!visible} />}

      <footer className="dh__bottom" inert={!visible}>
        <nav className="dh__nav" aria-label="Demos">
          <Button label={prev.title} href={`/demo/${prev.slug}`} variant="minimal" emphasis="ghost" intent="neutral" size="sm" glyph="←" glyphPosition="start" aria-keyshortcuts="ArrowLeft" className="dh__prev" />
          <p className="dh__hint">{demo.hint}</p>
          <Button label={next.title} href={`/demo/${next.slug}`} variant="minimal" emphasis="ghost" intent="neutral" size="sm" glyph="→" aria-keyshortcuts="ArrowRight" className="dh__next" />
        </nav>
        <p className="dh__keys" aria-hidden>
          ← → demos · H interfaz · F pantalla completa · Esc salir
        </p>
      </footer>

      {/* con la interfaz oculta solo queda esto, pequeño, para volver a mostrarla */}
      {!visible && <Button label="Mostrar interfaz" onClick={onToggle} variant="minimal" emphasis="ghost" intent="neutral" size="sm" className="dh__show" aria-keyshortcuts="H" />}
    </div>
  );
}

/** Texto (y fuente/efecto) de las demos de texto: los sketches leen `textStore` en cada fotograma. */
function TextBar({ controls, inert }: { controls: ("font" | "effect")[]; inert: boolean }) {
  const state = useSyncExternalStore(textStore.subscribe, textStore.get, textStore.server);
  return (
    <section className="dh__text" inert={inert} aria-label="Texto de la demo">
      <TextField label="Texto" value={state.text} onChange={(v) => textStore.set({ text: v.slice(0, 40) })} placeholder="Escribe un texto…" variant="minimal" size="sm" />
      {controls.includes("font") && <Select label="Fuente" options={BANNER_FONTS.join(", ")} value={state.font} onChange={(v) => textStore.set({ font: v })} variant="minimal" size="sm" />}
      {controls.includes("effect") && <Select label="Efecto al pasar" options={HOVER_EFFECTS.join(", ")} value={state.effect} onChange={(v) => textStore.set({ effect: v })} variant="minimal" size="sm" />}
    </section>
  );
}
