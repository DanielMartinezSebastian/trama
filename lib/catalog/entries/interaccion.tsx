"use client";

import { Fragment } from "react";
import Button, { BUTTON_INTENTS, BUTTON_EMPHASES } from "@/components/ui/Button";
import GlyphCursor from "@/components/ui/GlyphCursor";
import HoverFX, { HOVERFX_EFFECTS } from "@/components/ui/HoverFX";
import MagneticButton from "@/components/ui/MagneticButton";
import ScrollArea from "@/components/ui/ScrollArea";
import Spotlight from "@/components/ui/Spotlight";
import { vcls } from "@/components/ui/variants";
import type { CatalogEntry } from "../schema";
import { ALL_STYLES, toneProp, variantProp } from "./shared";

export const interaccion: CatalogEntry[] = [
  {
    id: "button",
    component: "Button",
    path: "@/components/ui/Button",
    name: "Botón",
    category: "interaccion",
    styles: ALL_STYLES,
    description:
      "Botón del sistema: 6 colores (acento, neutro, éxito, info, aviso, peligro) × 5 énfasis (relleno, superficie, borde, fantasma, enlace), estados pulsado, cargando y deshabilitado, solo icono y como enlace. Siete estilos.",
    stageHeight: 420,
    notes: [
      "intent cambia el color y tone el énfasis: son independientes, cualquier color con cualquier énfasis y estilo.",
      "active pone aria-pressed (botón conmutable); loading pone aria-busy y bloquea el clic; con href se pinta como <a>.",
      "iconOnly usa glyph como contenido y label como aria-label.",
    ],
    props: [
      { key: "preview", label: "Vista", type: "select", default: "matrix", options: ["matrix", "single"], labels: { matrix: "todos los colores × énfasis", single: "un botón configurable" }, noCode: true },
      { key: "label", label: "Texto", type: "text", default: "Reservar clase" },
      variantProp("solid"),
      { key: "intent", label: "Color (intent)", type: "select", default: "accent", options: BUTTON_INTENTS, labels: { accent: "acento del tema", neutral: "neutro", success: "éxito", info: "info", warning: "aviso", danger: "peligro" }, when: (p) => p.preview === "single" },
      { key: "emphasis", label: "Énfasis (emphasis)", type: "select", default: "primary", options: BUTTON_EMPHASES, labels: { primary: "relleno", secondary: "superficie", outline: "borde", ghost: "fantasma", link: "enlace" }, when: (p) => p.preview === "single" },
      { key: "size", label: "Tamaño", type: "select", default: "md", options: ["sm", "md", "lg"] },
      { key: "glyph", label: "Carácter o icono (icon:nombre)", type: "text", default: "" },
      { key: "glyphPosition", label: "Posición del carácter", type: "select", default: "end", options: ["start", "end"], when: (p) => Boolean(p.glyph) && p.iconOnly !== true },
      { key: "iconOnly", label: "Solo icono", type: "boolean", default: false, when: (p) => p.preview === "single" },
      { key: "active", label: "Pulsado (active)", type: "boolean", default: false, when: (p) => p.preview === "single" },
      { key: "loading", label: "Cargando", type: "boolean", default: false },
      { key: "disabled", label: "Deshabilitado", type: "boolean", default: false },
      { key: "href", label: "Enlace (vacío = <button>)", type: "text", default: "", when: (p) => p.preview === "single" },
      { key: "fullWidth", label: "Ancho completo", type: "boolean", default: false, when: (p) => p.preview === "single" },
    ],
    render: (p) => {
      const common = {
        variant: p.variant as never,
        size: p.size as never,
        glyph: p.glyph as string,
        glyphPosition: p.glyphPosition as never,
        loading: p.loading as boolean,
        disabled: p.disabled as boolean,
      };
      if (p.preview === "matrix")
        return (
          <div className="ui-center">
            <div className="pg-btns">
              <span />
              {BUTTON_EMPHASES.map((t) => (
                <span key={t} className="pg-btns__head">{t}</span>
              ))}
              {BUTTON_INTENTS.map((i) => (
                <Fragment key={i}>
                  <span className="pg-btns__head">{i}</span>
                  {BUTTON_EMPHASES.map((t) => (
                    <Button key={t} {...common} label={i === "danger" ? "Eliminar" : i === "success" ? "Guardar" : i === "warning" ? "Revisar" : i === "info" ? "Detalles" : (p.label as string) || " "} intent={i} emphasis={t} />
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
        );
      return (
        <div className="ui-center">
          <div style={{ width: p.fullWidth ? 320 : undefined }}>
            <Button
              {...common}
              label={(p.label as string) || " "}
              intent={p.intent as never}
              emphasis={p.emphasis as never}
              iconOnly={p.iconOnly as boolean}
              active={p.active ? true : undefined}
              href={(p.href as string) || undefined}
              fullWidth={p.fullWidth as boolean}
            />
          </div>
        </div>
      );
    },
  },
  {
    id: "magnetic-button",
    component: "MagneticButton",
    path: "@/components/ui/MagneticButton",
    name: "Botón magnético",
    category: "interaccion",
    styles: ALL_STYLES,
    description: "Button que se desplaza (y gira un poco) hacia el puntero cuando se acerca. Sin efecto en táctil.",
    stageHeight: 260,
    props: [
      { key: "label", label: "Texto", type: "text", default: "Reservar clase" },
      variantProp("solid"),
      { key: "emphasis", label: "Tono", type: "select", default: "primary", options: ["primary", "secondary", "ghost"] },
      { key: "size", label: "Tamaño", type: "select", default: "md", options: ["sm", "md", "lg"] },
      { key: "glyph", label: "Carácter decorativo", type: "text", default: "" },
      { key: "strength", label: "Fuerza", type: "number", default: 0.35, min: 0, max: 1, step: 0.05 },
      { key: "radius", label: "Radio de atracción (px)", type: "number", default: 160, min: 40, max: 400, step: 10 },
      { key: "tilt", label: "Giro (°)", type: "number", default: 0, min: 0, max: 20, step: 1 },
    ],
    render: (p) => (
      <div className="ui-center">
        <MagneticButton label={(p.label as string) || " "} variant={p.variant as never} emphasis={p.emphasis as never} size={p.size as never} glyph={p.glyph as string} strength={p.strength as number} radius={p.radius as number} tilt={p.tilt as number} />
      </div>
    ),
  },
  {
    id: "glyph-cursor",
    component: "GlyphCursor",
    path: "@/components/ui/GlyphCursor",
    name: "Cursor personalizado",
    category: "interaccion",
    styles: ["neon", "minimal", "terminal", "retro"],
    description: "Un carácter, un anillo o un punto que persigue al puntero dentro de su contenedor. Colócalo como hijo del área donde debe actuar.",
    stageHeight: 260,
    props: [
      { key: "mode", label: "Modo", type: "select", default: "glyph", options: ["glyph", "ring", "dot"] },
      { key: "glyph", label: "Carácter", type: "text", default: "*", when: (p) => p.mode === "glyph" },
      toneProp("acc"),
      { key: "cursorSize", label: "Tamaño (px)", type: "number", default: 22, min: 10, max: 48, step: 1 },
      { key: "lag", label: "Retardo (s)", type: "number", default: 0.45, min: 0.05, max: 1.2, step: 0.05 },
      { key: "offset", label: "Distancia al puntero", type: "number", default: 14, min: 0, max: 40, step: 1, when: (p) => p.mode === "glyph" },
      { key: "spin", label: "Gira", type: "boolean", default: true, when: (p) => p.mode === "glyph" },
      { key: "glow", label: "Halo", type: "boolean", default: true },
    ],
    render: (p) => (
      <div className="ui-center ui-center--full">
        <span className="ui-hint">Mueve el puntero por el escenario</span>
        <GlyphCursor mode={p.mode as never} glyph={(p.glyph as string) || "*"} tone={p.tone as never} cursorSize={p.cursorSize as number} lag={p.lag as number} offset={p.offset as number} spin={p.spin as boolean} glow={p.glow as boolean} />
      </div>
    ),
  },
  {
    id: "spotlight",
    component: "Spotlight",
    path: "@/components/ui/Spotlight",
    name: "Foco que sigue al puntero",
    category: "interaccion",
    styles: ALL_STYLES,
    description: "Superficie con un foco de luz (y borde iluminado) bajo el puntero. Envuelve cualquier contenido.",
    stageHeight: 300,
    children: "<h3>Pasa el puntero</h3>\n<p>Un foco de luz sigue tu cursor.</p>",
    props: [
      { key: "radius", label: "Radio (px)", type: "number", default: 220, min: 60, max: 500, step: 10 },
      { key: "intensity", label: "Intensidad (%)", type: "number", default: 30, min: 5, max: 80, step: 5 },
      { key: "border", label: "Ilumina el borde", type: "boolean", default: true },
      { key: "tone", label: "Color (token)", type: "select", default: "acc", options: ["acc", "acc2", "fg"] },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <Spotlight radius={p.radius as number} intensity={p.intensity as number} border={p.border as boolean} tone={p.tone as never} variant={p.variant as never}>
          <div style={{ padding: 32, width: 320 }}>
            <strong style={{ fontSize: 18 }}>Pasa el puntero</strong>
            <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.6, opacity: 0.8 }}>Un foco de luz sigue tu cursor y ilumina el borde de la tarjeta.</p>
          </div>
        </Spotlight>
      </div>
    ),
  },
  {
    id: "hover-fx",
    component: "HoverFX",
    path: "@/components/ui/HoverFX",
    name: "Efectos de hover",
    category: "interaccion",
    styles: ALL_STYLES,
    description:
      "Envoltorio de hover reutilizable en cualquier contenido: elevación, escala, inclinación 3D, brillo que sigue al puntero, destello, barrido de escaneo, micro-glitch, corchetes de objetivo o subrayado.",
    stageHeight: 300,
    children: "<PricingCard plan=\"Pro\" />",
    notes: [
      "La mayoría de efectos son CSS puro; «tilt» y «glow» siguen el puntero con GSAP.",
      "Se puede combinar con Presence: HoverFX dentro, Presence fuera (o al revés) para tener entrada/salida y hover a la vez.",
      "Todo componente del catálogo puede envolverse así: activa el panel «FX» de la cabecera para probarlo con cualquier demo.",
    ],
    props: [
      { key: "effect", label: "Efecto", type: "select", default: "glow", options: HOVERFX_EFFECTS.map((e) => e.id) },
      { key: "strength", label: "Fuerza", type: "number", default: 0.6, min: 0.1, max: 1, step: 0.05 },
      { key: "tone", label: "Color (token)", type: "select", default: "acc", options: ["acc", "acc2", "fg", "mut"] },
      { key: "radius", label: "Radio del brillo (px)", type: "number", default: 220, min: 60, max: 460, step: 10, when: (p) => p.effect === "glow" },
      { key: "tiltMax", label: "Inclinación máxima (°)", type: "number", default: 10, min: 2, max: 25, step: 1, when: (p) => p.effect === "tilt" },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <span className="ui-hint">Pasa el puntero por la tarjeta</span>
        <HoverFX effect={p.effect as never} strength={p.strength as number} tone={p.tone as never} radius={p.radius as number} tiltMax={p.tiltMax as number}>
          <div className={`ui-surface ${vcls(p.variant as never)}`} style={{ padding: 26, width: 280, maxWidth: "100%" }}>
            <strong style={{ display: "block", marginBottom: 8, fontSize: 16 }}>root@sistema:~#</strong>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>Cualquier tarjeta, botón o panel puede llevar este envoltorio.</p>
          </div>
        </HoverFX>
      </div>
    ),
  },
  {
    id: "scroll-area",
    component: "ScrollArea",
    path: "@/components/ui/ScrollArea",
    name: "Área con scroll",
    category: "interaccion",
    styles: ALL_STYLES,
    description: "Caja de contenido largo (registro de cambios, comentarios, salida de terminal…) con su propia barra de desplazamiento, distinta en cada estilo.",
    stageHeight: 300,
    notes: ["La barra de scroll no es exclusiva de este componente: cualquier superficie ui-s--<variante> la hereda automáticamente (ver components/ui/styles/ui-kit.css)."],
    props: [
      {
        key: "content",
        label: "Contenido (un párrafo por línea; el primero se resalta)",
        type: "text",
        multiline: true,
        default:
          "Registro de cambios\nv1.4.0 — Panel de tokens con selector de tipografía y fuentes de Google autoalojadas.\nv1.3.0 — Categoría «Secciones»: hero, contacto, precios, FAQ y más, listos para pegar.\nv1.2.0 — Entrada, salida y hover por composición (Presence y HoverFX) para todo el catálogo.\nv1.1.0 — Comparador de los 7 estilos y vista «en caso real» por categoría.\nv1.0.0 — Primera versión del catálogo: tokens, sistema de estilos y 20 componentes.",
      },
      { key: "height", label: "Altura (px)", type: "number", default: 220, min: 120, max: 400, step: 10 },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <ScrollArea content={p.content as string} height={p.height as number} variant={p.variant as never} />
      </div>
    ),
  },
];
