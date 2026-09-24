"use client";

import { ASCII_SCENES, ASCII_STYLES } from "@/components/ui/AsciiBackground";
import AsciiCard from "@/components/ui/AsciiCard";
import { CARD_CHARSETS, CARD_FIELDS } from "@/lib/ui/card-fields";
import BlogCard from "@/components/ui/BlogCard";
import Panel from "@/components/ui/Panel";
import PricingCard from "@/components/ui/PricingCard";
import Testimonial from "@/components/ui/Testimonial";
import { CARD_FILLS, CARD_PATTERNS } from "@/components/ui/fill";
import type { CatalogEntry } from "../schema";
import { ALL_STYLES, HOVER_FX, fillSpecs, fillValues, variantProp } from "./shared";

export const tarjetas: CatalogEntry[] = [
  {
    id: "ascii-card",
    component: "AsciiCard",
    path: "@/components/ui/AsciiCard",
    name: "Tarjeta ASCII",
    category: "tarjetas",
    styles: ALL_STYLES,
    description: "Número bitmap, fondo ASCII (15 campos procedurales animados × 8 juegos de caracteres, texto repetido o una escena de AsciiBackground), revelado e inclinación hacia el puntero. Siete estilos.",
    stageHeight: 420,
    replayable: true,
    notes: [
      "El color sale de --bg, --mut, --acc y --acc2 y se actualiza al cambiar de tema sin repetir el revelado.",
      "reveal: dissolve dibuja celdas ASCII opacas que se apagan.",
      "Con movimiento reducido o táctil se desactivan tilt y scramble.",
      "El campo animado corre a ~30 fps y solo mientras la tarjeta está a la vista; «scene» monta un AsciiBackground por tarjeta (más pesado).",
      "index sirve de semilla: tres tarjetas con el mismo campo no salen iguales.",
    ],
    props: [
      { key: "title", label: "Título", type: "text", default: "Iniciación" },
      { key: "text", label: "Texto", type: "text", default: "Grupos de seis, espuma blanda y mucha paciencia. Te levantas el primer día.", multiline: true },
      { key: "meta", label: "Meta", type: "text", default: "2 h · desde 35 €" },
      variantProp("glass"),
      { key: "align", label: "Alineación", type: "select", default: "left", options: ["left", "center"] },
      { key: "minHeight", label: "Altura mínima (px)", type: "number", default: 250, min: 160, max: 420, step: 10 },
      { key: "reveal", label: "Revelado", type: "select", default: "rise", options: ["none", "wipe", "rise", "dissolve"] },
      { key: "revealDuration", label: "Duración del revelado (s)", type: "number", default: 0.9, min: 0.3, max: 3, step: 0.1, when: (p) => p.reveal !== "none" },
      { key: "dissolveCell", label: "Celda de la disolución (px)", type: "number", default: 14, min: 8, max: 30, step: 1, when: (p) => p.reveal === "dissolve" },
      { key: "trigger", label: "Se revela", type: "select", default: "mount", options: ["mount", "inview"] },
      { key: "background", label: "Fondo ASCII", type: "select", default: "field", options: ["field", "text", "scene", "none"], labels: { field: "campo procedural", text: "texto repetido", scene: "escena de AsciiBackground", none: "ninguno" } },
      { key: "field", label: "Campo", type: "select", default: "plasma", options: CARD_FIELDS, when: (p) => p.background === "field" },
      { key: "charset", label: "Caracteres", type: "select", default: "detailed", options: Object.keys(CARD_CHARSETS), when: (p) => p.background === "field" && !["maze", "grid", "binary"].includes(String(p.field)) },
      { key: "fieldColor", label: "Color del campo", type: "select", default: "mut", options: ["mut", "accent", "gradient", "value"], labels: { mut: "discreto (--mut)", accent: "acento", gradient: "degradado --acc → --acc2", value: "según intensidad" }, when: (p) => p.background === "field" },
      { key: "fieldHover", label: "Reacción al puntero", type: "select", default: "glow", options: ["none", "glow", "ripple", "repel", "reveal"], labels: { none: "ninguna", glow: "ilumina", ripple: "ondas", repel: "aparta", reveal: "linterna (solo cerca)" }, when: (p) => p.background === "field" },
      { key: "animate", label: "Animado", type: "boolean", default: true, when: (p) => p.background === "field" },
      { key: "speed", label: "Velocidad", type: "number", default: 1, min: 0.1, max: 3, step: 0.1, when: (p) => p.background === "field" && p.animate === true },
      { key: "scene", label: "Escena", type: "select", default: "waves", options: ASCII_SCENES.map((s) => s.id), when: (p) => p.background === "scene" },
      { key: "sceneStyle", label: "Estilo de la escena", type: "select", default: "braille", options: ASCII_STYLES, when: (p) => p.background === "scene" },
      { key: "tile", label: "Texto repetido", type: "text", default: "OLA · MAR · SAL · ", when: (p) => p.background === "text" },
      { key: "textHover", label: "Hover del texto", type: "select", default: "trail", options: HOVER_FX, when: (p) => p.background === "text" },
      { key: "hoverStrength", label: "Fuerza del hover", type: "number", default: 0.9, min: 0, max: 1, step: 0.05, when: (p) => p.background === "text" },
      { key: "hoverRadius", label: "Radio del hover", type: "number", default: 0.4, min: 0.1, max: 0.8, step: 0.05, when: (p) => p.background === "text" },
      { key: "tileSize", label: "Tamaño de celda (px)", type: "number", default: 11, min: 6, max: 24, step: 1, when: (p) => p.background !== "none" },
      { key: "tileOpacity", label: "Opacidad del fondo ASCII", type: "number", default: 110, min: 10, max: 255, step: 5, when: (p) => p.background !== "none" },
      { key: "showNumeral", label: "Mostrar número", type: "boolean", default: true },
      { key: "index", label: "Número", type: "number", default: 1, min: 1, max: 9, step: 1, when: (p) => p.showNumeral === true },
      { key: "glyph", label: "Carácter del número", type: "text", default: "#" },
      { key: "glow", label: "Brillo que sigue al ratón", type: "boolean", default: true },
      { key: "tilt", label: "Inclinación 3D", type: "boolean", default: true },
      { key: "tiltMax", label: "Inclinación máxima (°)", type: "number", default: 10, min: 2, max: 25, step: 1, when: (p) => p.tilt === true },
      { key: "scramble", label: "Título descifrado", type: "boolean", default: true },
      { key: "chars", label: "Caracteres del scramble", type: "text", default: "~-=^_", when: (p) => p.scramble === true },
      ...fillSpecs(),
    ],
    render: (p, { replay }) => (
      <div className="ui-center">
        <div style={{ width: 340, maxWidth: "100%" }}>
          <AsciiCard
            title={p.title as string}
            text={p.text as string}
            meta={p.meta as string}
            variant={p.variant as never}
            align={p.align as never}
            minHeight={p.minHeight as number}
            reveal={p.reveal as never}
            revealDuration={p.revealDuration as number}
            dissolveCell={p.dissolveCell as number}
            trigger={p.trigger as never}
            textHover={p.textHover as never}
            hoverStrength={p.hoverStrength as number}
            hoverRadius={p.hoverRadius as number}
            background={p.background as never}
            field={p.field as never}
            charset={p.charset as never}
            fieldColor={p.fieldColor as never}
            fieldHover={p.fieldHover as never}
            animate={p.animate as boolean}
            speed={p.speed as number}
            scene={p.scene as never}
            sceneStyle={p.sceneStyle as never}
            tile={(p.tile as string) || " "}
            tileSize={p.tileSize as number}
            tileOpacity={p.tileOpacity as number}
            showNumeral={p.showNumeral as boolean}
            index={p.index as number}
            glyph={(p.glyph as string) || "#"}
            glow={p.glow as boolean}
            tilt={p.tilt as boolean}
            tiltMax={p.tiltMax as number}
            scramble={p.scramble as boolean}
            chars={(p.chars as string) || "#"}
            {...fillValues(p)}
            playKey={replay}
          />
        </div>
      </div>
    ),
  },
  {
    id: "panel",
    component: "Panel",
    path: "@/components/ui/Panel",
    name: "Panel",
    category: "tarjetas",
    styles: ALL_STYLES,
    description: "Superficie genérica con barra opcional, título, cuerpo y pie. Base de cualquier tarjeta simple.",
    stageHeight: 340,
    props: [
      { key: "title", label: "Título", type: "text", default: "Resumen de reserva" },
      { key: "body", label: "Cuerpo", type: "text", multiline: true, default: "Dos clases de iniciación el sábado por la mañana, con neopreno y tabla incluidos." },
      { key: "footer", label: "Pie", type: "text", default: "Cancelación gratuita hasta 24 h antes" },
      { key: "bar", label: "Texto de la barra", type: "text", default: "reserva.txt", hint: "Vacío = sin barra" },
      { key: "cornerGlyph", label: "Carácter en las esquinas", type: "text", default: "" },
      ...fillSpecs(),
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <Panel title={p.title as string} body={p.body as string} footer={p.footer as string} bar={p.bar as string} cornerGlyph={p.cornerGlyph as string} variant={p.variant as never} {...fillValues(p)} />
      </div>
    ),
  },
  {
    id: "pricing-card",
    component: "PricingCard",
    path: "@/components/ui/PricingCard",
    name: "Tarjeta de precios",
    category: "tarjetas",
    styles: ALL_STYLES,
    description: "Plan con precio, características (incluidas y no incluidas) y llamada a la acción. Tres maquetaciones, tres formas de destacar (halo, invertida, borde), precio tachado y nota.",
    stageHeight: 480,
    props: [
      { key: "layout", label: "Maquetación", type: "select", default: "classic", options: ["classic", "compact", "horizontal"] },
      { key: "plan", label: "Plan", type: "text", default: "Pro" },
      { key: "description", label: "Descripción", type: "text", default: "Para quien publica cada semana" },
      { key: "price", label: "Precio", type: "text", default: "29 €" },
      { key: "originalPrice", label: "Precio anterior (tachado)", type: "text", default: "" },
      { key: "period", label: "Periodo", type: "text", default: "/ mes" },
      { key: "note", label: "Nota bajo el precio", type: "text", default: "" },
      { key: "features", label: "Características (una por línea; «-» = no incluida)", type: "text", multiline: true, default: "Proyectos ilimitados\nSoporte prioritario\nExportación a PNG y SVG\n-Facturación centralizada" },
      { key: "cta", label: "Botón", type: "text", default: "Empezar ahora" },
      { key: "highlighted", label: "Destacada", type: "boolean", default: true },
      { key: "highlight", label: "Forma de destacar", type: "select", default: "invert", options: ["glow", "invert", "border"], labels: { glow: "halo de acento", invert: "invertida (fondo de acento)", border: "borde grueso" }, when: (p) => p.highlighted === true },
      { key: "badge", label: "Insignia", type: "text", default: "Más popular", when: (p) => p.highlighted === true },
      variantProp("glass"),
      ...fillSpecs(),
    ],
    render: (p) => (
      <div className="ui-center">
        <div style={{ width: p.layout === "horizontal" ? 640 : 300, maxWidth: "100%" }}>
          <PricingCard
            layout={p.layout as never}
            plan={p.plan as string}
            description={p.description as string}
            price={p.price as string}
            originalPrice={p.originalPrice as string}
            period={p.period as string}
            note={p.note as string}
            features={p.features as string}
            cta={p.cta as string}
            highlighted={p.highlighted as boolean}
            highlight={p.highlight as never}
            badge={p.badge as string}
            variant={p.variant as never}
            {...fillValues(p)}
          />
        </div>
      </div>
    ),
  },
  {
    id: "testimonial",
    component: "Testimonial",
    path: "@/components/ui/Testimonial",
    name: "Testimonio",
    category: "tarjetas",
    styles: ALL_STYLES,
    description: "Cita con avatar de iniciales, autor, cargo y valoración.",
    stageHeight: 340,
    props: [
      { key: "quote", label: "Cita", type: "text", multiline: true, default: "Levanté la tabla el primer día. El equipo es paciente y el mar, una maravilla." },
      { key: "author", label: "Autor", type: "text", default: "Lucía Pardo" },
      { key: "role", label: "Cargo", type: "text", default: "Alumna, curso de iniciación" },
      { key: "rating", label: "Estrellas", type: "number", default: 5, min: 0, max: 5, step: 1 },
      ...fillSpecs(),
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <Testimonial quote={p.quote as string} author={p.author as string} role={p.role as string} rating={p.rating as number} variant={p.variant as never} {...fillValues(p)} />
      </div>
    ),
  },
  {
    id: "blog-card",
    component: "BlogCard",
    path: "@/components/ui/BlogCard",
    name: "Tarjeta de artículo",
    category: "tarjetas",
    styles: ALL_STYLES,
    description: "Artículo con cabecera (imagen, trama de CSS o caracteres), categoría, titular, extracto, autor y meta. Cuatro maquetaciones: apilada, horizontal, superpuesta (imagen de fondo) y mínima. Con href, toda la tarjeta es un enlace.",
    stageHeight: 440,
    props: [
      { key: "layout", label: "Maquetación", type: "select", default: "stacked", options: ["stacked", "horizontal", "overlay", "minimal"], labels: { stacked: "apilada", horizontal: "horizontal", overlay: "superpuesta (imagen de fondo)", minimal: "mínima (sin cabecera)" } },
      { key: "media", label: "Cabecera", type: "select", default: "image", options: ["image", "pattern", "glyph", "none"], labels: { image: "imagen", pattern: "trama de CSS", glyph: "patrón de caracteres", none: "ninguna" }, when: (p) => p.layout !== "minimal" },
      { key: "image", label: "Imagen (URL o gen:N)", type: "text", default: "gen:1", when: (p) => p.media === "image" && p.layout !== "minimal" },
      { key: "pattern", label: "Trama", type: "select", default: "waves", options: CARD_PATTERNS, when: (p) => p.media === "pattern" && p.layout !== "minimal" },
      { key: "glyph", label: "Carácter del patrón", type: "text", default: "~", when: (p) => p.media === "glyph" && p.layout !== "minimal" },
      { key: "category", label: "Categoría", type: "text", default: "Técnica" },
      { key: "title", label: "Titular", type: "text", default: "Cinco errores al remar que te frenan la primera ola" },
      { key: "excerpt", label: "Extracto", type: "text", multiline: true, default: "El remo cuenta más que la fuerza: la postura y el timing son lo que de verdad te sube a la tabla." },
      { key: "author", label: "Autor", type: "text", default: "Nora Vidal" },
      { key: "date", label: "Fecha", type: "text", default: "12 mar 2026" },
      { key: "readTime", label: "Tiempo de lectura", type: "text", default: "4 min" },
      { key: "href", label: "Enlace (vacío = no es enlace)", type: "text", default: "#" },
      variantProp("glass"),
      { key: "fill", label: "Fondo", type: "select", default: "surface", options: CARD_FILLS.filter((f) => f !== "image" && f !== "pattern"), labels: { surface: "el de la variante", tint: "tinte de acento", gradient: "degradado", accent: "acento (invertida)" } },
      { key: "tone", label: "Acento", type: "select", default: "acc", options: ["acc", "acc2"], labels: { acc: "principal (--acc)", acc2: "secundario (--acc2)" } },
    ],
    render: (p) => (
      <div className="ui-center">
        <div style={{ width: p.layout === "horizontal" ? 560 : 330, maxWidth: "100%" }}>
          <BlogCard
            layout={p.layout as never}
            media={p.media as never}
            image={p.image as string}
            pattern={p.pattern as never}
            glyph={p.glyph as string}
            category={p.category as string}
            title={p.title as string}
            excerpt={p.excerpt as string}
            author={p.author as string}
            date={p.date as string}
            readTime={p.readTime as string}
            href={(p.href as string) || undefined}
            fill={p.fill as never}
            tone={p.tone as never}
            variant={p.variant as never}
          />
        </div>
      </div>
    ),
  },
];
