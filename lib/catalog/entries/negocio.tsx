"use client";

import { useState } from "react";
import ActionBar from "@/components/ui/ActionBar";
import CohortList from "@/components/ui/CohortList";
import ClassSchedule, { type ScheduleBooking, type ClassScheduleProps } from "@/components/ui/ClassSchedule";
import DatePicker from "@/components/ui/DatePicker";
import MenuList from "@/components/ui/MenuList";
import OpeningHours from "@/components/ui/OpeningHours";
import QRCode from "@/components/ui/QRCode";
import type { CatalogEntry } from "../schema";
import { ALL_STYLES, toneProp, variantProp } from "./shared";

/** Negocio local: las piezas funcionales que piden restauración, comercio, salud y fitness (docs/11 §5 y docs/17). */

const HOURS = "L-V|07:30-14:00 17:00-20:30\nS|08:00-14:30\nD|cerrado";
const MENU =
  "#Bollería|Del horno, cada mañana desde las 6\nCroissant de mantequilla|Hojaldre de 27 capas con mantequilla de Soria|1,90|gluten,huevo,leche|\nNapolitana de chocolate|Con chocolate negro al 70 %|2,20|gluten,huevo,leche,soja|\nPan de masa madre|Fermentación de 24 horas, 750 g|4,50|gluten|vegano\n#Tartas|Porción o entera por encargo\nTarta de queso|Al horno, cremosa por dentro|4,80|leche,huevo,gluten|la más pedida\nTarta de almendra|Sin harina de trigo|4,50|huevo,frutos de cáscara|sin gluten\nBizcocho de aceite y limón|Esponjoso, sin lácteos|3,20|gluten,huevo|sin lactosa";

function ScheduleDemo(p: ClassScheduleProps) {
  const [bookings, setBookings] = useState<ScheduleBooking[]>([]);
  return <ClassSchedule {...p} bookings={bookings} onBook={(c, date, waitlist) => setBookings((b) => [...b, { classId: c.id, date, waitlist }])} />;
}

function DateDemo({ mode, months, slots, shortcuts, calendar }: { mode: "single" | "range"; months: 1 | 2; slots: boolean; shortcuts: number; calendar: "open" | "collapsed" }) {
  const [v, setV] = useState("");
  const [s, setS] = useState("");
  return (
    <DatePicker
      mode={mode}
      months={months}
      shortcuts={shortcuts}
      calendar={calendar}
      value={v}
      onChange={setV}
      slot={s}
      onSlotChange={setS}
      min={mode === "single" ? 1 : 0}
      closedDays="0"
      slots={slots && mode === "single" ? (d) => ["09:00", "10:30", "12:00", "17:30", "19:00"].map((t, i) => ({ time: t, disabled: (Number(d.slice(8)) + i) % 4 === 0, note: i === 2 ? "último" : undefined })) : ""}
    />
  );
}

function MenuDemo({ layout, filter, add }: { layout: "list" | "columns" | "cards"; filter: boolean; add: boolean }) {
  const [n, setN] = useState(0);
  return (
    <>
      {add && <p style={{ margin: "0 0 12px", fontSize: 13, opacity: 0.7 }}>En el pedido: {n}</p>}
      <MenuList menu={MENU} layout={layout} filter={filter} onAdd={add ? () => setN((x) => x + 1) : undefined} />
    </>
  );
}

export const negocio: CatalogEntry[] = [
  {
    id: "opening-hours",
    component: "OpeningHours",
    path: "@/components/ui/OpeningHours",
    name: "Horario con estado (abierto ahora)",
    category: "datos",
    styles: ALL_STYLES,
    description: "«Abierto ahora · cierra a las 20:30» calculado en la zona horaria del negocio, con tramos partidos, días cerrados, festivos y aperturas especiales. La semana se pinta en el servidor y el estado al montar. openingHoursSchema() da el mismo horario en schema.org para el JSON-LD.",
    stageHeight: 380,
    props: [
      { key: "hours", label: "Horario (días|tramos)", type: "text", default: HOURS, multiline: true, hint: "Días L M X J V S D, en rango (L-V) o lista (L,X); tramos 07:30-14:00 17:00-20:30 o «cerrado»" },
      { key: "exceptions", label: "Festivos (fecha|motivo|tramos)", type: "text", default: "2026-12-25|Navidad\n2026-12-24|Nochebuena|08:00-14:00", multiline: true },
      { key: "layout", label: "Forma", type: "select", default: "full", options: ["full", "compact", "badge"], labels: { full: "semana completa", compact: "solo hoy", badge: "solo el estado" } },
      { key: "timeZone", label: "Zona horaria", type: "text", default: "Europe/Madrid" },
      { key: "soonMinutes", label: "«Cierra pronto» (min antes)", type: "number", default: 30, min: 0, max: 120, step: 5 },
      { key: "title", label: "Título", type: "text", default: "Horario" },
      variantProp("minimal"),
    ],
    notes: ["El estado depende de la hora del navegador convertida a la zona del negocio: un visitante de otro país ve si abre según la hora de allí.", "Para la ficha de Google y la búsqueda con IA: <JsonLd data={{ \"@type\": \"Bakery\", openingHoursSpecification: openingHoursSchema(hours, exceptions) }} />."],
    render: (p) => (
      <div style={{ width: "min(100%, 380px)", padding: 16 }}>
        <OpeningHours hours={p.hours as string} exceptions={p.exceptions as string} layout={p.layout as never} timeZone={(p.timeZone as string) || "Europe/Madrid"} soonMinutes={p.soonMinutes as number} title={p.title as string} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "class-schedule",
    component: "ClassSchedule",
    path: "@/components/ui/ClassSchedule",
    name: "Horario de clases",
    category: "datos",
    styles: ALL_STYLES,
    description: "Clases de gimnasio, estudio o academia en los próximos días: filtro por disciplina y nivel, plazas libres, lista de espera y reservas hechas. No guarda nada: las reservas entran por bookings y salen por onBook. Un día en filas o la semana en columnas.",
    stageHeight: 520,
    props: [
      { key: "classes", label: "Clases (hora|nombre|min|disciplina|nivel|monitor|sala|plazas|ocupadas|días)", type: "text", multiline: true, default: "07:30|Fuerza base|50|Fuerza|Inicio|Inés|Sala 1|12|8|1,3,5\n09:00|Movilidad|45|Movilidad|Todos|Nico|Sala 2|10|5\n13:30|Engine|45|Cardio|Intermedio|Dani|Sala 1|12|12|1,2,3,4,5\n18:00|Fuerza en grupo|55|Fuerza|Intermedio|Inés|Sala 1|12|11|1,2,3,4\n19:00|Reset|40|Movilidad|Inicio|Nico|Sala 2|10|7", hint: "Días: 0 = domingo … 6 = sábado; sin días, todos" },
      { key: "layout", label: "Forma", type: "select", default: "list", options: ["list", "week"], labels: { list: "un día en filas", week: "semana en columnas" } },
      { key: "daysAhead", label: "Días a la vista", type: "number", default: 7, min: 1, max: 14, step: 1 },
      { key: "filters", label: "Filtros", type: "select", default: "both", options: ["both", "category", "none"] },
      { key: "bookLabel", label: "Botón de reserva", type: "text", default: "Reservar" },
      variantProp("glass"),
    ],
    notes: ["Las reservas las guarda la web (estado, localStorage o servidor): pásalas en bookings y actualízalas en onBook(clase, fecha, espera).", "Los días se calculan en el navegador para no desajustar la hidratación."],
    render: (p) => (
      <div style={{ width: "min(100%, 860px)", padding: 16 }}>
        <ScheduleDemo classes={p.classes as string} layout={p.layout as never} daysAhead={p.daysAhead as number} filters={p.filters as never} bookLabel={p.bookLabel as string} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "cohort-list",
    component: "CohortList",
    path: "@/components/ui/CohortList",
    name: "Programas por convocatoria",
    category: "datos",
    styles: ALL_STYLES,
    description: "Programas de academia, escuela o viajes con convocatorias: nivel, formato en chips, fechas de cada convocatoria, estado (plazas abiertas, últimas plazas, próximamente) y botón para solicitar plaza. En filas o en tarjetas.",
    stageHeight: 520,
    props: [
      { key: "layout", label: "Forma", type: "select", default: "rows", options: ["rows", "cards"], labels: { rows: "filas con fechas en columnas", cards: "tarjetas" } },
      { key: "cta", label: "Botón", type: "text", default: "Ver el programa" },
      variantProp("minimal"),
    ],
    render: (p) => (
      <div style={{ width: "min(100%, 980px)", padding: 16 }}>
        <CohortList layout={p.layout as never} cta={p.cta as string} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "menu-list",
    component: "MenuList",
    path: "@/components/ui/MenuList",
    name: "Carta con alérgenos",
    category: "contenido",
    styles: ALL_STYLES,
    description: "Carta en HTML con secciones, precios con puntos guía, etiquetas, los 14 alérgenos del Reglamento UE 1169/2011 (abreviatura visible y nombre para el lector de pantalla), filtro «Sin gluten / sin leche…» que oculta lo que no puedes tomar, agotados del día y botón de añadir para el pedido en mesa o para recoger.",
    stageHeight: 620,
    props: [
      { key: "layout", label: "Forma", type: "select", default: "list", options: ["list", "columns", "cards"], labels: { list: "lista con puntos guía", columns: "dos columnas", cards: "tarjetas" } },
      { key: "filter", label: "Filtro de alérgenos", type: "boolean", default: true },
      { key: "add", label: "Botón «Añadir» (onAdd)", type: "boolean", default: false, noCode: true },
      variantProp("minimal"),
    ],
    notes: ["La carta como texto: `#Sección|nota` y una línea por plato `Nombre|descripción|precio|alérgenos|etiquetas`. O como datos: `MenuSection[]` con `soldOut` e `image` por plato.", "Es la carta que abre el QR de la mesa: ver QRCode y /sitios/almibar-barrio/mesa/7."],
    render: (p) => (
      <div style={{ width: "100%", padding: 16 }}>
        <MenuDemo key={`${p.layout}-${p.add}`} layout={p.layout as never} filter={p.filter as boolean} add={p.add as boolean} />
      </div>
    ),
  },
  {
    id: "date-picker",
    component: "DatePicker",
    path: "@/components/ui/DatePicker",
    name: "Selector de fecha y hueco",
    category: "formularios",
    styles: ALL_STYLES,
    description: "Calendario en línea para un día (cita, encargo, recogida) o un rango (hotel), con antelación mínima, días cerrados, festivos y los huecos del día elegido. Cuadrícula ARIA con teclado completo (flechas, Inicio/Fin, RePág/AvPág). Valores en ISO: «2026-10-24» o «2026-10-24/2026-10-27».",
    stageHeight: 560,
    props: [
      { key: "mode", label: "Modo", type: "select", default: "single", options: ["single", "range"], labels: { single: "un día", range: "rango (llegada y salida)" } },
      { key: "months", label: "Meses a la vista", type: "select", default: "1", options: ["1", "2"] },
      { key: "slots", label: "Huecos del día (slots)", type: "boolean", default: true, noCode: true, when: (p) => p.mode === "single" },
      { key: "shortcuts", label: "Atajos («Hoy», «Mañana»…)", type: "number", default: 0, min: 0, max: 6, step: 1, when: (p) => p.mode === "single" },
      { key: "calendar", label: "Calendario", type: "select", default: "open", options: ["open", "collapsed"], labels: { open: "siempre a la vista", collapsed: "plegado tras «Otro día…»" }, when: (p) => p.mode === "single" && (p.shortcuts as number) > 0 },
      variantProp("minimal"),
    ],
    notes: ["La demo: domingos cerrados, encargo desde mañana y huecos con disponibilidad que cambia por día (slots como función).", "`min` y `max` aceptan una fecha ISO o días desde hoy: `min={2}` = 48 h de antelación.", "Para pedidos rápidos (recoger hoy o mañana): shortcuts={4} calendar=\"collapsed\" — los próximos días disponibles como botones y el calendario solo si se pide (ver /sitios/almibar/pedido)."],
    render: (p) => (
      <div style={{ width: `min(100%, ${p.months === "2" ? 640 : 380}px)`, padding: 16 }}>
        <DateDemo key={`${p.mode}-${p.months}-${p.slots}-${p.shortcuts}-${p.calendar}`} mode={p.mode as never} months={Number(p.months) as 1 | 2} slots={p.slots as boolean} shortcuts={p.shortcuts as number} calendar={p.calendar as never} />
      </div>
    ),
  },
  {
    id: "action-bar",
    component: "ActionBar",
    path: "@/components/ui/ActionBar",
    name: "Barra de acciones en móvil",
    category: "navegacion",
    styles: ALL_STYLES,
    description: "Llamar, WhatsApp, cómo llegar y la acción principal (reservar, pedir, pedir cita) fijos abajo en móvil, en la zona del pulgar: objetivos de 56 px, safe-area-inset-bottom y un hueco al final de la página para no tapar el pie. Por encima de 760 px se oculta (show=\"mobile\"). Con soft, sin bandeja ni botón relleno: vidrio que se difumina hacia arriba, acciones iguales e iconos con brillo (la principal, en el acento).",
    stageHeight: 160,
    props: [
      { key: "actions", label: "Acciones (etiqueta|enlace|icono|primary)", type: "text", default: "Llamar|tel:+34976000000|phone\nWhatsApp|https://wa.me/34600000000|message\nCómo llegar|https://maps.google.com/?q=Zaragoza|map-pin\nReservar|#reservar|calendar|primary", multiline: true },
      { key: "show", label: "Cuándo", type: "select", default: "mobile", options: ["mobile", "always"], labels: { mobile: "solo en móvil", always: "siempre" } },
      { key: "position", label: "Posición", type: "select", default: "static", options: ["fixed", "static"], labels: { fixed: "fija abajo", static: "en el flujo" } },
      { key: "soft", label: "Suave (vidrio difuminado)", type: "boolean", default: false },
      variantProp("solid"),
    ],
    notes: ["En el catálogo va «en el flujo» para verla en la ficha; en una web, position=\"fixed\" (el valor por defecto).", "Una sola acción primary: es la que el negocio quiere que hagas (B15 en docs/11)."],
    render: (p) => (
      <div style={{ width: "min(100%, 420px)", padding: 16 }}>
        <ActionBar actions={p.actions as string} show="always" position={p.position as never} soft={p.soft as boolean} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "qr-code",
    component: "QRCode",
    path: "@/components/ui/QRCode",
    name: "Código QR",
    category: "datos",
    styles: ALL_STYLES,
    description: "Código QR en SVG generado en el propio componente (sin dependencias ni servicios externos; modo byte UTF-8, versiones 1–10, niveles L/M/Q/H). Módulos cuadrados, en puntos (dot matrix) o redondeados, en el color del tema. Para la carta de cada mesa, el enlace de reserva o la ficha de una pieza en el escaparate.",
    stageHeight: 320,
    props: [
      { key: "value", label: "Texto o URL", type: "text", default: "https://trama.dev/sitios/almibar-barrio/mesa/7" },
      { key: "shape", label: "Módulos", type: "select", default: "square", options: ["square", "dots", "rounded"], labels: { square: "cuadrados", dots: "puntos", rounded: "redondeados" } },
      { key: "ecc", label: "Corrección de errores", type: "select", default: "M", options: ["L", "M", "Q", "H"], labels: { L: "L · 7 %", M: "M · 15 %", Q: "Q · 25 %", H: "H · 30 %" } },
      { key: "codeSize", label: "Ancho (px)", type: "number", default: 200, min: 80, max: 360, step: 10 },
      toneProp("fg"),
      { key: "contrast", label: "Contraste", type: "select", default: "auto", options: ["auto", "theme"], labels: { auto: "auto (oscuro sobre claro)", theme: "colores del tema" } },
      { key: "caption", label: "Texto debajo", type: "text", default: "Mesa 7 · escanea para ver la carta" },
    ],
    notes: ["Comprobado con un decodificador real (OpenCV): todas las versiones y niveles, en las tres formas. Los buscadores de las esquinas van siempre cuadrados: redondeados o en círculo, OpenCV no los encuentra.", "En un tema oscuro, contrast=\"auto\" pinta módulos oscuros sobre un cuadro claro (--fg): un QR claro sobre fondo oscuro no lo leen todos los lectores.", "Para imprimir: contraste alto entre el color de los módulos y --bg, al menos 2 × 2 cm y el margen de 4 módulos alrededor."],
    render: (p) => (
      <div className="ui-center" style={{ padding: 16 }}>
        <QRCode value={p.value as string} shape={p.shape as never} ecc={p.ecc as never} codeSize={p.size as number} tone={p.tone as never} contrast={p.contrast as never} caption={p.caption as string} />
      </div>
    ),
  },
];
