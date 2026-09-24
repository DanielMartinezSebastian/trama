"use client";

import Panel from "@/components/ui/Panel";
import Presence, { PRESENCE_EFFECTS } from "@/components/ui/Presence";
import Reveal, { REVEAL_KINDS, type RevealDirection, type RevealEasing, type RevealKind } from "@/components/ui/Reveal";
import SceneFlash from "@/components/ui/SceneFlash";
import { vcls } from "@/components/ui/variants";
import { CHARSETS } from "@/lib/ui/fx";
import type { CatalogEntry } from "../schema";
import { ALL_STYLES, variantProp } from "./shared";

const CHAR_OPTIONS = Object.keys(CHARSETS);
const isAscii = (p: Record<string, unknown>) => String(p.effect).startsWith("ascii-");

export const transiciones: CatalogEntry[] = [
  {
    id: "scene-flash",
    component: "SceneFlash",
    path: "@/components/ui/SceneFlash",
    name: "Transición de escena",
    category: "transiciones",
    styles: ["neon", "retro", "minimal", "outline"],
    description: "Barrido, iris, rebanadas, persianas o mosaico de píxeles para acompañar un cambio de sección. Usa --acc y --acc2.",
    stageHeight: 300,
    replayable: true,
    props: [
      { key: "kind", label: "Tipo", type: "select", default: "sweep", options: ["sweep", "iris", "slices", "blinds", "pixels"] },
      { key: "duration", label: "Duración (s)", type: "number", default: 1, min: 0.3, max: 3, step: 0.1 },
      { key: "loop", label: "En bucle", type: "boolean", default: false },
    ],
    render: (p, { replay }) => (
      <>
        <div className="ui-center">
          <span className="ui-hint">Pulsa «Repetir animación» o activa el bucle</span>
        </div>
        <SceneFlash kind={p.kind as never} duration={p.duration as number} loop={p.loop as boolean} playKey={replay} />
      </>
    ),
  },
  {
    id: "reveal",
    component: "Reveal",
    path: "@/components/ui/Reveal",
    name: "Revelado de contenido",
    category: "transiciones",
    styles: ALL_STYLES,
    description:
      "Revela lo que envuelve al montar, al entrar en pantalla o siguiendo el scroll: 7 efectos × 4 direcciones, escalonado de hijos o de palabras/letras, curvas con rebote y repetición al volver a entrar.",
    stageHeight: 460,
    replayable: true,
    children: "<Card />\n<Card />\n<Card />",
    notes: [
      "Con «inview» y «scroll», desplaza el escenario: el contenido empieza debajo.",
      "«stagger» escalona los hijos directos (aquí, las tres tarjetas); «split» trocea un texto plano (aquí, el titular).",
      "El estado oculto viene en el HTML del servidor: no hay parpadeo antes de hidratar. Sin JS o con movimiento reducido se ve directamente.",
      "Al terminar no deja transform/filter/clip-path: un Modal o Drawer dentro sigue funcionando.",
    ],
    props: [
      { key: "kind", label: "Efecto", type: "select", default: "slide", options: REVEAL_KINDS },
      { key: "direction", label: "Dirección", type: "select", default: "up", options: ["up", "down", "left", "right"], when: (p) => ["slide", "blur", "wipe", "flip"].includes(String(p.kind)) },
      { key: "distance", label: "Distancia (px)", type: "number", default: 40, min: 0, max: 160, step: 5, when: (p) => p.kind === "slide" || p.kind === "blur" },
      { key: "trigger", label: "Disparador", type: "select", default: "inview", options: ["mount", "inview", "scroll"], labels: { mount: "al montar", inview: "al entrar en pantalla", scroll: "sigue el scroll" } },
      { key: "once", label: "Solo la primera vez", type: "boolean", default: true, when: (p) => p.trigger === "inview" },
      { key: "threshold", label: "Umbral visible", type: "number", default: 0.2, min: 0, max: 1, step: 0.05, when: (p) => p.trigger === "inview" },
      { key: "duration", label: "Duración (s)", type: "number", default: 0.8, min: 0.2, max: 3, step: 0.1, when: (p) => p.trigger !== "scroll" },
      { key: "delay", label: "Retardo (s)", type: "number", default: 0, min: 0, max: 2, step: 0.1, when: (p) => p.trigger !== "scroll" },
      { key: "easing", label: "Curva", type: "select", default: "out", options: ["out", "in-out", "back", "linear"], labels: { out: "suave (out)", "in-out": "entrada y salida", back: "con rebote", linear: "lineal" }, when: (p) => p.trigger !== "scroll" },
      { key: "stagger", label: "Escalonado de las tarjetas (s)", type: "number", default: 0.12, min: 0, max: 0.5, step: 0.02 },
      { key: "split", label: "Titular troceado", type: "select", default: "words", options: ["none", "words", "chars"], noCode: true },
      { key: "headline", label: "Titular", type: "text", default: "Cada sección entra cuando llegas a ella", noCode: true },
      variantProp("glass"),
    ],
    render: (p, { replay }) => {
      const common = {
        kind: p.kind as RevealKind,
        direction: p.direction as RevealDirection,
        distance: p.distance as number,
        trigger: p.trigger as "mount" | "inview" | "scroll",
        once: p.once as boolean,
        threshold: p.threshold as number,
        duration: p.duration as number,
        delay: p.delay as number,
        easing: p.easing as RevealEasing,
        playKey: replay,
      };
      const scrolls = p.trigger !== "mount";
      return (
        <div className={`ui-center pg-rv ${scrolls ? "pg-rv--scroll" : ""}`}>
          {scrolls && <p className="pg-rv__hint">Desplaza hacia abajo ↓</p>}
          <Reveal {...common} as="h3" split={p.split as never} className="pg-rv__title">
            {p.headline as string}
          </Reveal>
          <Reveal {...common} stagger={p.stagger as number} className="pg-rv__grid">
            {["Arranque", "Escala", "Soporte"].map((t, i) => (
              <Panel key={t} title={t} body={["Despliega en minutos.", "Crece sin tocar nada.", "Personas, no bots."][i]} footer="" bar="" variant={p.variant as never} />
            ))}
          </Reveal>
          {scrolls && <p className="pg-rv__hint">↑ Vuelve arriba{p.once === false && p.trigger === "inview" ? " y baja otra vez: se repite" : ""}</p>}
        </div>
      );
    },
  },
  {
    id: "presence",
    component: "Presence",
    path: "@/components/ui/Presence",
    name: "Aparición / desaparición (hacker)",
    category: "transiciones",
    styles: ALL_STYLES,
    description:
      "Envuelve cualquier contenido y anima su entrada y salida: capas de glifos que se descifran, glitch con separación RGB y corrupción, datamosh, fragmentos, encendido CRT, parpadeo de neón, estática de TV, censura o arranque de sistema.",
    stageHeight: 380,
    children: (p) => `<Panel title=${JSON.stringify(p.title)} body=${JSON.stringify(String(p.text).split("\n")[0] + "…")} variant="${p.variant}" />`,
    replayable: true,
    notes: [
      "El contenido está siempre en el DOM; con movimiento reducido se muestra u oculta sin animar.",
      "Con «Bucle automático» activado se repite sola; desactívalo para controlarla con «Mostrar contenido».",
      "chars, celda y rastro solo aplican a los efectos «ascii-*»; columnas a fragmentos; bandas a datamosh; alto de barra y texto a censura; líneas a arranque.",
      "13 efectos, 7 estilos de superficie para el contenido de ejemplo: 91 combinaciones.",
    ],
    props: [
      { key: "effect", label: "Efecto", type: "select", default: "ascii-rain", options: PRESENCE_EFFECTS.map((e) => e.id) },
      { key: "loop", label: "Bucle automático", type: "boolean", default: true },
      { key: "show", label: "Mostrar contenido", type: "boolean", default: true, when: (p) => p.loop !== true },
      { key: "hold", label: "Pausa del bucle (s)", type: "number", default: 1.2, min: 0.2, max: 4, step: 0.1, when: (p) => p.loop === true },
      { key: "duration", label: "Duración (s)", type: "number", default: 1.2, min: 0.3, max: 3, step: 0.1 },
      { key: "intensity", label: "Intensidad", type: "number", default: 0.7, min: 0.1, max: 1, step: 0.05, when: (p) => p.effect !== "boot" && p.effect !== "redact" },
      { key: "tone", label: "Color del efecto", type: "select", default: "acc", options: ["acc", "acc2", "fg"] },
      { key: "chars", label: "Glifos", type: "select", default: "symbols", options: CHAR_OPTIONS, when: isAscii },
      { key: "cell", label: "Celda (px)", type: "number", default: 14, min: 8, max: 28, step: 1, when: isAscii },
      { key: "edge", label: "Rastro en el borde", type: "boolean", default: true, when: isAscii },
      { key: "tiles", label: "Columnas de fragmentos", type: "number", default: 6, min: 3, max: 10, step: 1, when: (p) => p.effect === "shatter" },
      { key: "bands", label: "Bandas", type: "number", default: 10, min: 4, max: 24, step: 1, when: (p) => p.effect === "slices" },
      { key: "rowHeight", label: "Alto de barra (px)", type: "number", default: 22, min: 12, max: 40, step: 1, when: (p) => p.effect === "redact" },
      { key: "redactLabel", label: "Texto tachado", type: "text", default: "REDACTED", when: (p) => p.effect === "redact" },
      {
        key: "bootLines",
        label: "Líneas de arranque (entrada / --- / salida)",
        type: "text",
        multiline: true,
        default: "[ OK ] montando sistema de archivos\n[ OK ] iniciando servicios\n[ .. ] descifrando interfaz\n[ OK ] acceso concedido\n---\n[ .. ] cerrando sesión\n[ OK ] volcando memoria\n[ OK ] apagado",
        when: (p) => p.effect === "boot",
      },
      // Las tres siguientes son del contenido de ejemplo, no de Presence: van en `children`, no en sus props
      { ...variantProp("terminal"), label: "Estilo del contenido", noCode: true },
      { key: "title", label: "Título del contenido", type: "text", default: "ACCESO_CONCEDIDO.sh", noCode: true },
      { key: "text", label: "Texto del contenido", type: "text", multiline: true, default: "usuario: root\npermisos: rwxrwxrwx\nsesión iniciada 03:14 h", noCode: true },
    ],
    render: (p, { replay }) => (
      <div className="ui-center">
        <Presence
          effect={p.effect as never}
          loop={p.loop as boolean}
          show={p.show as boolean}
          hold={p.hold as number}
          duration={p.duration as number}
          intensity={p.intensity as number}
          tone={p.tone as never}
          chars={p.chars as never}
          cell={p.cell as number}
          edge={p.edge as boolean}
          tiles={p.tiles as number}
          bands={p.bands as number}
          rowHeight={p.rowHeight as number}
          redactLabel={p.redactLabel as string}
          bootLines={p.bootLines as string}
          playKey={replay}
        >
          <div className={`ui-surface ${vcls(p.variant as never)}`} style={{ padding: 22, width: 300, maxWidth: "100%" }}>
            <strong style={{ display: "block", marginBottom: 8, fontSize: 16 }}>{(p.title as string) || " "}</strong>
            <pre style={{ margin: 0, fontSize: 12, lineHeight: 1.6, opacity: 0.85, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{p.text as string}</pre>
          </div>
        </Presence>
      </div>
    ),
  },
];
