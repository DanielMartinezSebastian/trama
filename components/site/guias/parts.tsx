"use client";

import { useId, useState } from "react";
import type { GuideContent } from "./content";

/**
 * Piezas interactivas de los relatos de /guias. Son versiones mínimas, solo para enseñar la estructura: el antes/después
 * definitivo es la pieza `BeforeAfter` pendiente de la fase F5 de docs/16.
 */

/** R8 · Antes / después con un deslizador nativo (teclado y lector de pantalla gratis). */
export function BeforeAfterLite({ c }: { c: GuideContent }) {
  const [v, setV] = useState(50);
  const id = useId();
  return (
    <div className="gx-ba">
      <div className="gx-ba__stage" style={{ "--ba": `${v}%` } as React.CSSProperties}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.after.src} alt={`Después: ${c.after.alt}`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="gx-ba__before" src={c.before.src} alt={`Antes: ${c.before.alt}`} />
        <span className="gx-ba__tag gx-ba__tag--a ui-g-label">Antes</span>
        <span className="gx-ba__tag gx-ba__tag--b ui-g-label">Después</span>
        <span className="gx-ba__handle" aria-hidden />
      </div>
      <label className="ui-g-label" htmlFor={id}>
        Desliza para comparar
      </label>
      <input id={id} className="gx-ba__range" type="range" min={0} max={100} value={v} onChange={(e) => setV(Number(e.target.value))} />
    </div>
  );
}

/** R6 · Una imagen que hace de mapa: cada punto es un botón real que abre su ficha. */
export function Hotspots({ c }: { c: GuideContent }) {
  const [open, setOpen] = useState(0);
  const s = c.spots[open];
  return (
    <div className="gx-spots">
      <div className="gx-spots__map">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.wide.src} alt={c.wide.alt} />
        {c.spots.map((p, n) => (
          <button key={p.title} type="button" className={`gx-spots__dot ${n === open ? "is-on" : ""}`} style={{ left: `${p.x}%`, top: `${p.y}%` }} aria-pressed={n === open} onClick={() => setOpen(n)}>
            <span className="ui-sr-only">{p.title}</span>
          </button>
        ))}
      </div>
      <div className="gx-spots__card ui-g-card" aria-live="polite">
        <p className="ui-g-label ui-g-muted">
          {String(open + 1).padStart(2, "0")} / {String(c.spots.length).padStart(2, "0")}
        </p>
        <h3 className="ui-g-h2">{s.title}</h3>
        <p className="ui-g-body">{s.text}</p>
      </div>
    </div>
  );
}

/** R9 · Webfilm: un billete de entrada y escenas que avanzan con decisiones (botones reales, sin canvas). */
export function Webfilm({ c }: { c: GuideContent }) {
  const [scene, setScene] = useState(-1);
  const [path, setPath] = useState<"dia" | "noche">("dia");
  if (scene < 0)
    return (
      <div className="gx-film gx-film--ticket ui-g-card">
        <p className="ui-g-label ui-g-muted">Billete · {c.brand}</p>
        <p className="ui-g-h2">Un día de luz en Casa Levante</p>
        <p className="ui-g-body ui-g-muted">Tres escenas, dos decisiones. Unos dos minutos.</p>
        <button type="button" className="ui-g-btn" onClick={() => setScene(0)}>
          Empezar
        </button>
      </div>
    );
  const steps = [c.states[0], path === "dia" ? c.states[1] : c.states[3], c.states[2]];
  const st = steps[Math.min(scene, steps.length - 1)];
  const last = scene >= steps.length - 1;
  return (
    <div className="gx-film ui-g-card" aria-live="polite">
      <p className="ui-g-label ui-g-muted">
        Escena {scene + 1} de {steps.length}
      </p>
      <p className="ui-g-h2">{st.title}</p>
      <p className="ui-g-body">{st.text}</p>
      <div className="gx-row">
        {scene === 0 ? (
          <>
            <button type="button" className="ui-g-btn" onClick={() => { setPath("dia"); setScene(1); }}>
              Seguir la luz del día
            </button>
            <button type="button" className="ui-g-btn ui-g-btn--ghost" onClick={() => { setPath("noche"); setScene(1); }}>
              Saltar a la noche
            </button>
          </>
        ) : last ? (
          <button type="button" className="ui-g-btn" onClick={() => setScene(-1)}>
            Volver a empezar
          </button>
        ) : (
          <button type="button" className="ui-g-btn" onClick={() => setScene(scene + 1)}>
            Continuar
          </button>
        )}
      </div>
    </div>
  );
}
