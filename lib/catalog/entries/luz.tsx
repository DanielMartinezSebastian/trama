"use client";

import BeforeAfter from "@/components/ui/BeforeAfter";
import LightScroll from "@/components/ui/LightScroll";
import { photo } from "@/lib/sites/photos";
import { LIGHT_PRESETS } from "@/lib/ui/light";
import type { CatalogEntry } from "../schema";
import { ALL_STYLES, variantProp } from "./shared";

/** Ronda 9: joyería y luz por finalidad (docs/19-joyeria.md). */
const PRESETS = Object.keys(LIGHT_PRESETS);

export const luz: CatalogEntry[] = [
  {
    id: "light-scroll",
    preview: (p) => !p.cue ? "scroll" : undefined,
    component: "LightScroll",
    path: "@/components/ui/LightScroll",
    name: "Luz que cambia según la finalidad de la sección",
    category: "transiciones",
    styles: ["minimal", "editorial", "glass"],
    description:
      "Contenedor con una luz detrás del contenido que cambia con la sección en pantalla según para qué sirve: foco con destellos para emocionar, luz de día difusa para comparar con honestidad, rasante para leer un grabado, lámpara cálida para conversar. Cada sección elige su toma con data-light; la luz se describe con magnitudes físicas (kelvin, dureza, dirección) y se publica en variables CSS y en useLight() para que una escena 3D se ilumine igual.",
    stageHeight: 460,
    notes: [
      "Nueve tomas documentadas en LIGHT_PRESETS (lib/ui/light.ts): vitrina, fuego, honesta, calida, rasante, lampara, taller, lupa y memoria. Fuentes en docs/19 §5 (GIA, conservación, fabricantes de vitrinas).",
      "`cue` fuerza una toma e ignora el scroll: un paso de un configurador o un conmutador «luz de día / cálida».",
      "Con movimiento reducido la luz cambia sin fundido, no sigue al puntero y no hay destellos. Funciona mejor sobre fondos oscuros o medios.",
      "En el catálogo va con position=\"absolute\"; en una web, `fixed` (la luz es de la ventana). Ver /sitios/quilate.",
    ],
    props: [
      { key: "cue", label: "Toma forzada", type: "select", default: "vitrina", options: ["", ...PRESETS], labels: { "": "la de la sección (scroll)" } },
      { key: "duration", label: "Fundido (s)", type: "number", default: 0.9, min: 0, max: 3, step: 0.1 },
    ],
    render: (p) => (
        <LightScroll cues={LIGHT_PRESETS} cue={(p.cue as string) || undefined} duration={p.duration as number} position={p.cue ? "absolute" : "fixed"} style={{ width: "100%", background: "#0e0c0a", color: "#efe7da", minHeight: 420 }}>
        {(["vitrina", "honesta", "rasante"] as const).map((t) => (
            <section key={t} data-light={t} style={{ minHeight: p.cue ? 420 : "100svh", display: "grid", placeItems: "center", textAlign: "center", padding: 24 }}>
            <div>
              <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.7 }}>data-light=&quot;{t}&quot;</p>
              <p style={{ margin: "8px 0 0", fontSize: 30 }}>{LIGHT_PRESETS[t].kelvin} K</p>
            </div>
          </section>
        ))}
      </LightScroll>
    ),
  },
  {
    id: "before-after",
    component: "BeforeAfter",
    path: "@/components/ui/BeforeAfter",
    name: "Antes / después con control",
    category: "interaccion",
    styles: ALL_STYLES,
    description:
      "Comparador de dos imágenes (o de dos contenidos cualesquiera): un corte que se arrastra, accesible como deslizador (flechas, Inicio, Fin), o un botón que alterna entre los dos (día/noche, apagado/encendido). Para limpiezas, reformas, tratamientos y restauraciones; las dos imágenes con la misma luz.",
    stageHeight: 420,
    notes: ["Lo pedían la docs/11 §5 (clínicas, reformas) y la docs/15 (Colonia Zacamil); la primera web que lo usa es Quilate (limpieza de una joya)."],
    props: [
      { key: "mode", label: "Modo", type: "select", default: "slider", options: ["slider", "toggle"] },
      { key: "orientation", label: "Orientación", type: "select", default: "horizontal", options: ["horizontal", "vertical"] },
      { key: "initial", label: "Posición inicial (%)", type: "number", default: 50, min: 0, max: 100 },
      variantProp("minimal"),
    ],
    render: (p) => (
      <div style={{ width: "min(100%, 520px)" }}>
        <BeforeAfter
          mode={p.mode as "slider" | "toggle"}
          orientation={p.orientation as "horizontal" | "vertical"}
          initial={p.initial as number}
          variant={p.variant as never}
          before={<img src={photo("joyeria", 12).src} alt="Anillo de oro con piedras de colores" style={{ filter: "grayscale(1)" }} />}
          after={<img src={photo("joyeria", 12).src} alt="" />}
          beforeLabel="Blanco y negro"
          afterLabel="Color"
          label="Comparar la foto en blanco y negro y en color"
        />
      </div>
    ),
  },
];
