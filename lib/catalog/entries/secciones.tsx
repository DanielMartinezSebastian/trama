"use client";

import ArticlesSection, { DEFAULT_ARTICLES } from "@/components/ui/ArticlesSection";
import ContactForm from "@/components/ui/ContactForm";
import CTASection from "@/components/ui/CTASection";
import FAQSection from "@/components/ui/FAQSection";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/ui/Hero";
import LogoCloud from "@/components/ui/LogoCloud";
import PricingSection, { DEFAULT_PLANS } from "@/components/ui/PricingSection";
import StatsSection from "@/components/ui/StatsSection";
import TeamSection from "@/components/ui/TeamSection";
import TestimonialSection from "@/components/ui/TestimonialSection";
import type { CatalogEntry } from "../schema";
import { ALL_STYLES, toneProp, variantProp } from "./shared";

/**
 * Bloques compuestos: combinan componentes de otras categorías en secciones enteras de página,
 * listas para pegar en una landing (hero, contacto, precios, FAQ, cifras, testimonios, pie). No
 * inventan estilo propio: pasan `variant` a las piezas que envuelven (guía §2.2) y leen los mismos
 * tokens que todo lo demás.
 */
export const secciones: CatalogEntry[] = [
  {
    id: "hero",
    component: "Hero",
    path: "@/components/ui/Hero",
    name: "Hero",
    category: "secciones",
    styles: ALL_STYLES,
    description: "Cabecera de landing: sobretítulo, titular, subtítulo, una o dos llamadas a la acción e insignias de confianza. El fondo decorativo es CSS puro.",
    stageHeight: 460,
    props: [
      { key: "kicker", label: "Sobretítulo", type: "text", default: "ESCUELA DE SURF · CANTABRIA" },
      { key: "title", label: "Titular", type: "text", default: "Aprende a leer el mar" },
      { key: "subtitle", label: "Subtítulo", type: "text", multiline: true, default: "Del primer remo a tu primera ola verde. Neopreno, tabla y monitores titulados incluidos." },
      { key: "primaryCta", label: "CTA principal", type: "text", default: "Reservar clase" },
      { key: "secondaryCta", label: "CTA secundaria", type: "text", default: "Ver horarios" },
      { key: "badges", label: "Insignias (separadas por comas)", type: "text", default: "+500 alumnos, 4.9 ★ valoración, Grupos de 6", hint: "Escribe \\, para una coma dentro de un elemento (\"99\\,5 %\")" },
      { key: "align", label: "Alineación", type: "select", default: "center", options: ["left", "center"] },
      { key: "backdrop", label: "Fondo decorativo", type: "select", default: "grid", options: ["none", "grid", "dots", "glow"] },
      variantProp("minimal"),
    ],
    render: (p) => (
      <div className="ui-center ui-center--top" style={{ padding: 0, justifyItems: "stretch" }}>
        <Hero
          kicker={p.kicker as string}
          title={p.title as string}
          subtitle={p.subtitle as string}
          primaryCta={p.primaryCta as string}
          secondaryCta={p.secondaryCta as string}
          badges={p.badges as string}
          align={p.align as never}
          backdrop={p.backdrop as never}
          variant={p.variant as never}
        />
      </div>
    ),
  },
  {
    id: "contact-form",
    component: "ContactForm",
    path: "@/components/ui/ContactForm",
    name: "Formulario de contacto",
    category: "secciones",
    styles: ALL_STYLES,
    description: "Nombre, email y mensaje (o solo email, en línea, para un boletín) con estado de envío propio (carga, error y éxito). Conecta el envío real con la prop `onSubmit`.",
    stageHeight: 580,
    notes: [
      "`onSubmit(data)` puede ser `async`: mientras la promesa está pendiente el botón muestra la carga; si resuelve `{ ok: false, message }` o lanza, sale un `Alert` danger (`role=\"alert\"`) con `errorTitle` y el mensaje (o `errorMessage`) y lo escrito se conserva; si resuelve `{ ok: true }` o nada, el estado de éxito. Sin `onSubmit`, o con uno síncrono sin retorno, siempre éxito (como la demo).",
      "Ej.: `onSubmit={async (d) => { const r = await fetch(\"/api/contacto\", { method: \"POST\", body: JSON.stringify(d) }); return r.ok ? { ok: true } : { ok: false, message: \"El servidor no respondió.\" }; }}`",
    ],
    props: [
      { key: "title", label: "Título", type: "text", default: "Escríbenos" },
      { key: "subtitle", label: "Subtítulo", type: "text", default: "Te respondemos en menos de 24 horas." },
      { key: "fields", label: "Campos", type: "select", default: "name,email,message", options: ["name,email,message", "email"] },
      { key: "layout", label: "Disposición", type: "select", default: "stacked", options: ["stacked", "inline"] },
      { key: "submitLabel", label: "Botón", type: "text", default: "Enviar mensaje" },
      { key: "successMessage", label: "Mensaje de éxito", type: "text", default: "Gracias, te contestaremos pronto." },
      { key: "errorTitle", label: "Título del error", type: "text", default: "No se pudo enviar" },
      { key: "simulate", label: "Simular envío", type: "select", default: "ok", options: ["ok", "error"], labels: { ok: "éxito inmediato", error: "fallo tras 1 s" }, noCode: true },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center">
        <ContactForm
          key={p.simulate as string}
          errorTitle={p.errorTitle as string}
          onSubmit={
            p.simulate === "error"
              ? () => new Promise((r) => setTimeout(() => r({ ok: false, message: "El servidor no respondió (simulado)." }), 1000))
              : undefined
          }
          title={p.title as string}
          subtitle={p.subtitle as string}
          fields={p.fields as string}
          layout={p.layout as never}
          submitLabel={p.submitLabel as string}
          successMessage={p.successMessage as string}
          variant={p.variant as never}
        />
      </div>
    ),
  },
  {
    id: "cta-section",
    component: "CTASection",
    path: "@/components/ui/CTASection",
    name: "Banner de llamada a la acción",
    category: "secciones",
    styles: ALL_STYLES,
    description: "Cierre de página: titular corto, una frase y uno o dos botones sobre una superficie destacada.",
    stageHeight: 300,
    props: [
      { key: "kicker", label: "Sobretítulo", type: "text", default: "" },
      { key: "title", label: "Titular", type: "text", default: "El swell llega el sábado" },
      { key: "subtitle", label: "Subtítulo", type: "text", default: "Quedan doce plazas. Trae toalla, nosotros ponemos el resto." },
      { key: "primaryCta", label: "CTA principal", type: "text", default: "Apuntarme" },
      { key: "secondaryCta", label: "CTA secundaria", type: "text", default: "" },
      { key: "align", label: "Alineación", type: "select", default: "center", options: ["left", "center"] },
      variantProp("neon"),
    ],
    render: (p) => (
      <div className="ui-center ui-center--top" style={{ padding: 0, justifyItems: "stretch" }}>
        <CTASection
          kicker={p.kicker as string}
          title={p.title as string}
          subtitle={p.subtitle as string}
          primaryCta={p.primaryCta as string}
          secondaryCta={p.secondaryCta as string}
          align={p.align as never}
          variant={p.variant as never}
        />
      </div>
    ),
  },
  {
    id: "faq-section",
    component: "FAQSection",
    path: "@/components/ui/FAQSection",
    name: "Sección de FAQ",
    category: "secciones",
    styles: ALL_STYLES,
    description: "FAQ con cabecera superior o lateral en escritorio, acordeón de tarjetas o líneas, respuestas alineables y apertura inicial configurable. Incluye navegación por teclado y paneles accesibles.",
    stageHeight: 480,
    props: [
      { key: "kicker", label: "Sobretítulo", type: "text", default: "Preguntas frecuentes" },
      { key: "title", label: "Titular", type: "text", default: "Todo lo que necesitas saber" },
      {
        key: "items",
        label: "Preguntas (una por línea, «Pregunta|Respuesta»)",
        type: "text",
        multiline: true,
        default: "¿Necesito experiencia?|Ninguna. Empezamos desde cero con material blando.\n¿Qué incluye el precio?|Neopreno, tabla, monitor titulado y seguro.\n¿Puedo cancelar?|Hasta 24 horas antes, sin coste.",
      },
      { key: "multiple", label: "Varios paneles abiertos", type: "boolean", default: true },
      { key: "align", label: "Alineación de cabecera", type: "select", default: "center", options: ["left", "center"] },
      { key: "layout", label: "Composición", type: "select", default: "stack", options: ["stack", "split"] },
      { key: "presentation", label: "Acordeón", type: "select", default: "cards", options: ["cards", "lines"] },
      { key: "answerAlign", label: "Alineación de respuestas", type: "select", default: "inherit", options: ["inherit", "left", "center"] },
      { key: "defaultOpen", label: "Abierto al inicio (-1 = ninguno)", type: "number", default: 0, min: -1, max: 5, step: 1 },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center ui-center--top" style={{ padding: 0, justifyItems: "stretch" }}>
        <FAQSection layout={p.layout as "stack" | "split"} presentation={p.presentation as "cards" | "lines"} answerAlign={p.answerAlign as "inherit" | "left" | "center"} align={p.align as "left" | "center"} defaultOpen={p.defaultOpen as number} kicker={p.kicker as string} title={p.title as string} items={p.items as string} multiple={p.multiple as boolean} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "stats-section",
    component: "StatsSection",
    path: "@/components/ui/StatsSection",
    name: "Sección de cifras",
    category: "secciones",
    styles: ["minimal", "neon", "terminal", "retro", "dotmatrix"],
    description: "Cabecera de sección más una fila de cifras ASCII que cuentan hacia arriba (StatCounter): la sección de «resultados» típica.",
    stageHeight: 320,
    replayable: true,
    props: [
      { key: "kicker", label: "Sobretítulo", type: "text", default: "En números" },
      { key: "title", label: "Titular", type: "text", default: "Diez años enseñando a leer el mar" },
      {
        key: "stats",
        label: "Cifras (una por línea, «valor|sufijo|etiqueta»)",
        type: "text",
        multiline: true,
        hint: "El sufijo se dibuja en fuente bitmap ASCII: usa símbolos (+, %) y deja las palabras en la etiqueta.",
        default: "500|+|Alumnos formados\n4.9||Valoración media\n12||Años de experiencia",
      },
      toneProp("acc"),
    ],
    render: (p, { replay }) => (
      <div className="ui-center ui-center--top" style={{ padding: 0, justifyItems: "stretch" }}>
        <StatsSection kicker={p.kicker as string} title={p.title as string} stats={p.stats as string} tone={p.tone as never} playKey={replay} />
      </div>
    ),
  },
  {
    id: "pricing-section",
    component: "PricingSection",
    path: "@/components/ui/PricingSection",
    name: "Sección de precios",
    category: "secciones",
    styles: ALL_STYLES,
    description: "Precios con datos tipados o texto, selector mensual/anual y condiciones visibles. Tarjetas, columnas unidas, lista, carrusel, carta de servicios (menu) y tabla comparativa accesible (comparison). El mismo componente se adapta a una peluquería o un club sin duplicar su lógica.",
    notes: ["Fórmula de producto: joined + lift. Servicios: menu + planes tipados con meta (duración), note (condición) y href. Club social: comparison con filas de prestaciones; gimnasio de fuerza: list. Ejemplos en Hebra, Esparta, Cadencia y Forja.", "plans acepta PricingPlan[] además del texto. El texto permite dos columnas nuevas al final: meta y nota. Un precio anual igual al mensual mantiene su periodo. El total anual no se presenta como una equivalencia mensual sin calcular."],
    stageHeight: 720,
    props: [
      { key: "kicker", label: "Sobretítulo", type: "text", default: "Precios" },
      { key: "title", label: "Titular", type: "text", default: "Un plan para cada tamaño" },
      { key: "subtitle", label: "Subtítulo", type: "text", default: "Cambia o cancela cuando quieras." },
      {
        key: "plans",
        label: "Planes (uno por línea: «nombre|precio|periodo|destacado si/no|características;…|descripción|precio anual»; «-» delante = no incluida)",
        type: "text",
        multiline: true,
        default: DEFAULT_PLANS,
      },
      { key: "layout", label: "Disposición", type: "select", default: "grid", options: ["grid", "joined", "list", "carousel", "menu", "comparison"], labels: { grid: "rejilla", joined: "una pieza con columnas", list: "lista horizontal", carousel: "carrusel", menu: "carta de servicios", comparison: "tabla comparativa" } },
      { key: "comparison", label: "Comparación: prestación|plan 1|plan 2|plan 3", type: "text", multiline: true, default: "Proyectos|1|Sin límite|Sin límite\nPuestos|1|1|5\nSoporte|Email|Prioritario|Prioritario", when: (p) => p.layout === "comparison" },
      { key: "caption", label: "Nombre accesible de la tabla", type: "text", default: "Comparación de planes", when: (p) => p.layout === "comparison" },
      { key: "footnote", label: "Condiciones bajo los precios", type: "text", default: "" },
      { key: "cardLayout", label: "Tarjetas", type: "select", default: "classic", options: ["classic", "compact"], when: (p) => p.layout !== "list" && p.layout !== "joined" },
      { key: "highlight", label: "Plan destacado", type: "select", default: "invert", options: ["invert", "glow", "border", "lift"], labels: { invert: "invertido (fondo de acento)", glow: "halo de acento", border: "borde grueso", lift: "luz cenital (producto)" } },
      { key: "badge", label: "Insignia del destacado", type: "text", default: "Más popular" },
      { key: "planCase", label: "Nombre del plan", type: "select", default: "upper", options: ["upper", "none"], labels: { upper: "versalitas", none: "tal cual" } },
      { key: "marker", label: "Marca de las características", type: "select", default: "plus", options: ["plus", "check"], labels: { plus: "+", check: "✓ fina (no incluidas sin tachar)" } },
      { key: "toggle", label: "Selector mensual/anual", type: "select", default: "accent", options: ["accent", "neutral"], labels: { accent: "en el acento", neutral: "neutro" } },
      { key: "fill", label: "Fondo del resto", type: "select", default: "surface", options: ["surface", "tint", "gradient", "pattern"], labels: { surface: "el de la variante", tint: "tinte de acento", gradient: "degradado", pattern: "trama" } },
      { key: "yearlyNote", label: "Etiqueta de ahorro anual", type: "text", default: "2 meses gratis" },
      { key: "cta", label: "Botón de cada plan", type: "text", default: "Empezar ahora" },
      { key: "perView", label: "Visibles en pantalla ancha", type: "number", default: 3, min: 1, max: 4, step: 1, when: (p) => p.layout === "carousel" },
      { key: "autoplay", label: "Reproducción automática (s, 0 = manual)", type: "number", default: 0, min: 0, max: 8, step: 1, when: (p) => p.layout === "carousel" },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center ui-center--top" style={{ padding: 0, justifyItems: "stretch" }}>
        <PricingSection
          kicker={p.kicker as string}
          title={p.title as string}
          subtitle={p.subtitle as string}
          plans={p.plans as string}
          layout={p.layout as never}
          comparison={p.comparison as string}
          caption={p.caption as string}
          footnote={p.footnote as string}
          cardLayout={p.cardLayout as never}
          highlight={p.highlight as never}
          badge={p.badge as string}
          planCase={p.planCase as never}
          marker={p.marker as never}
          toggle={p.toggle as never}
          fill={p.fill as never}
          yearlyNote={p.yearlyNote as string}
          cta={p.cta as string}
          perView={p.perView as number}
          autoplay={p.autoplay as number}
          variant={p.variant as never}
        />
      </div>
    ),
  },
  {
    id: "testimonial-section",
    component: "TestimonialSection",
    path: "@/components/ui/TestimonialSection",
    name: "Sección de testimonios",
    category: "secciones",
    styles: ALL_STYLES,
    description: "Prueba social lista para pegar: cabecera, resumen de valoraciones (media con estrellas parciales, número y fuente enlazada, reparto por estrellas que filtra las citas) y las citas en rejilla o en slider, siempre a la misma altura con el autor abajo. Con align=\"left\" y quoteFont=\"display\" encaja en webs editoriales.",
    stageHeight: 540,
    props: [
      { key: "kicker", label: "Sobretítulo", type: "text", default: "Lo que dicen" },
      { key: "title", label: "Titular", type: "text", default: "Alumnos que ya cogieron su ola" },
      {
        key: "items",
        label: "Reseñas (una por línea, «cita|autor|rol|valoración|avatar URL opcional»)",
        type: "text",
        multiline: true,
        default:
          "Levanté la tabla el primer día. El equipo es paciente y el mar, una maravilla.|Lucía Pardo|Alumna, iniciación|5\nVinimos en familia y los peques no querían salir del agua.|Marcos Ibáñez|Curso familiar|5\nEl monitor grabó mis olas y corregimos la técnica al momento.|Diego Rus|Clases privadas|4",
      },
      { key: "layout", label: "Disposición", type: "select", default: "grid", options: ["grid", "carousel"], hint: "carousel usa Swiper: arrastre, flechas y puntos" },
      { key: "perView", label: "Visibles en pantalla ancha", type: "number", default: 3, min: 1, max: 4, step: 1, when: (p) => p.layout === "carousel" && p.effect === "slide" },
      { key: "autoplay", label: "Reproducción automática (s, 0 = manual)", type: "number", default: 0, min: 0, max: 8, step: 1, when: (p) => p.layout === "carousel" },
      { key: "effect", label: "Efecto del carrusel", type: "select", default: "slide", options: ["slide", "fade", "cards"], when: (p) => p.layout === "carousel", hint: "fade = una cita que se funde con la siguiente" },
      { key: "align", label: "Alineación", type: "select", default: "center", options: ["center", "left"], labels: { center: "centrada (landing)", left: "a la izquierda (editorial)" } },
      { key: "rating", label: "Nota media del resumen (0 = sin resumen)", type: "number", default: 4.8, min: 0, max: 5, step: 0.1 },
      { key: "count", label: "Número de reseñas", type: "number", default: 214, min: 0, max: 5000, step: 1, when: (p) => (p.rating as number) > 0 },
      { key: "source", label: "Fuente", type: "text", default: "Google", when: (p) => (p.rating as number) > 0 },
      { key: "distribution", label: "Reparto por estrellas (filtra las citas)", type: "text", default: "5:180, 4:26, 3:6, 2:1, 1:1", when: (p) => (p.rating as number) > 0 },
      { key: "pageSize", label: "Citas al principio (0 = todas; rejilla)", type: "number", default: 0, min: 0, max: 6, step: 1, when: (p) => p.layout === "grid" },
      { key: "quoteFont", label: "Fuente de la cita", type: "select", default: "body", options: ["body", "display"], labels: { body: "la del texto", display: "la de titulares" } },
      { key: "avatars", label: "Mostrar avatares (foto o iniciales)", type: "boolean", default: true },
      { key: "avatarSize", label: "Tamaño de los retratos", type: "select", default: "md", options: ["sm", "md", "lg"] },
      { key: "avatarShape", label: "Forma del avatar", type: "select", default: "theme", options: ["theme", "circle"] },
      { key: "presentation", label: "Tratamiento de las citas", type: "select", default: "card", options: ["card", "soft", "plain"] },
      variantProp("glass"),
    ],
    notes: ["Las tarjetas llenan su celda (rejilla) o su diapositiva (slider): todas a la misma altura, con la cita arriba y el autor abajo.", "El reparto filtra por estrellas (aria-pressed); las estrellas sin citas quedan deshabilitadas. Ver /sitios/almibar."],
    render: (p) => (
      <div className="ui-center ui-center--top" style={{ padding: 0, justifyItems: "stretch" }}>
        <TestimonialSection presentation={p.presentation as "card" | "soft" | "plain"} avatarSize={p.avatarSize as "sm" | "md" | "lg"} avatarShape={p.avatarShape as "theme" | "circle"} kicker={p.kicker as string} title={p.title as string} items={p.items as string} layout={p.layout as never} perView={p.perView as number} autoplay={p.autoplay as number} effect={p.effect as never} align={p.align as never} rating={p.rating as number} count={p.count as number} source={p.source as string} distribution={p.distribution as string} pageSize={p.pageSize as number} quoteFont={p.quoteFont as never} avatars={p.avatars as boolean} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "footer",
    component: "Footer",
    path: "@/components/ui/Footer",
    name: "Pie de página",
    category: "secciones",
    styles: ALL_STYLES,
    description: "Marca, columnas de enlaces, redes y línea de copyright: el cierre habitual de cualquier landing.",
    stageHeight: 340,
    props: [
      { key: "brand", label: "Marca", type: "text", default: "Maré Surf Club" },
      { key: "tagline", label: "Eslogan", type: "text", default: "Del primer remo a tu primera ola verde." },
      {
        key: "columns",
        label: "Columnas («Título: enlace, enlace; Título: enlace»)",
        type: "text",
        multiline: true,
        default: "Escuela: Clases, Monitores, Ubicación; Ayuda: Reservas, Cancelaciones, FAQ; Legal: Privacidad, Términos, Cookies",
      },
      { key: "social", label: "Redes (separadas por comas)", type: "text", default: "X, IG, YT", hint: "Escribe \\, para una coma dentro de un elemento (\"99\\,5 %\")" },
      { key: "copyright", label: "Copyright", type: "text", default: "© 2026 Maré Surf Club. Todos los derechos reservados." },
      variantProp("minimal"),
    ],
    render: (p) => (
      <div className="ui-center ui-center--top" style={{ padding: 0, justifyItems: "stretch" }}>
        <Footer
          brand={p.brand as string}
          tagline={p.tagline as string}
          columns={p.columns as string}
          social={p.social as string}
          copyright={p.copyright as string}
          variant={p.variant as never}
        />
      </div>
    ),
  },
  {
    id: "feature-grid",
    component: "FeatureGrid",
    path: "@/components/ui/FeatureGrid",
    name: "Rejilla de ventajas",
    category: "secciones",
    styles: ALL_STYLES,
    description: "Cabecera de sección + rejilla de «por qué elegirnos» (glifo + título + texto): la sección más pedida en cualquier landing.",
    stageHeight: 420,
    props: [
      { key: "kicker", label: "Sobretítulo", type: "text", default: "Por qué nosotros" },
      { key: "title", label: "Titular", type: "text", default: "Lo que nos hace distintos" },
      {
        key: "items",
        label: "Ventajas (una por línea, «glifo|título|texto»)",
        type: "text",
        multiline: true,
        default:
          "~|Monitores titulados|Todo el equipo tiene titulación oficial de escuela de surf y primeros auxilios.\n#|Grupos reducidos|Máximo seis alumnos por clase para que cada uno reciba atención de verdad.\n+|Material incluido|Neopreno, tabla y bolsa de deporte, sin coste extra ni sorpresas.",
      },
      { key: "layout", label: "Disposición", type: "select", default: "grid", options: ["grid", "carousel"], hint: "carousel usa Swiper: arrastre, flechas y puntos" },
      { key: "perView", label: "Visibles en pantalla ancha", type: "number", default: 3, min: 1, max: 4, step: 1, when: (p) => p.layout === "carousel" },
      { key: "autoplay", label: "Reproducción automática (s, 0 = manual)", type: "number", default: 0, min: 0, max: 8, step: 1, when: (p) => p.layout === "carousel" },
      variantProp("minimal"),
    ],
    render: (p) => (
      <div className="ui-center ui-center--top" style={{ padding: 0, justifyItems: "stretch" }}>
        <FeatureGrid kicker={p.kicker as string} title={p.title as string} items={p.items as string} layout={p.layout as never} perView={p.perView as number} autoplay={p.autoplay as number} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "team-section",
    component: "TeamSection",
    path: "@/components/ui/TeamSection",
    name: "Sección de equipo",
    category: "secciones",
    styles: ALL_STYLES,
    description: "Cabecera de sección + perfiles del equipo: foto con marco y tratamiento (o avatar de iniciales), biografía y enlace por persona para reservar con ella; en rejilla, carrusel o filas.",
    stageHeight: 560,
    props: [
      { key: "kicker", label: "Sobretítulo", type: "text", default: "El equipo" },
      { key: "title", label: "Titular", type: "text", default: "Quién te va a enseñar" },
      {
        key: "people",
        label: "Personas (una por línea, «nombre|rol|foto|bio|enlace»)",
        type: "text",
        multiline: true,
        default: "Marta Solé|Directora y monitora|/img/retratos/03-pixie-cut-unsplash.jpg|Doce años en el agua y una regla: nadie sale sin coger su ola.|#reservar\nEnzo Rial|Monitor de iniciación|/img/retratos/06-man-with-crossed-arms-unsplash.jpg|Paciencia infinita con el primer remo.|#reservar\nCarla Duque|Monitora y fotógrafa|/img/retratos/01-a-friend-unsplash.jpg|Te enseña y luego te lo enseña en foto.|#reservar",
        hint: "Sin foto, avatar de iniciales; sin enlace, sin botón",
      },
      { key: "layout", label: "Disposición", type: "select", default: "grid", options: ["grid", "carousel", "rows", "wall"], hint: "carousel usa Swiper; rows es una fila por persona, como en los salones; wall es un muro denso de retratos" },
      { key: "perView", label: "Visibles en pantalla ancha", type: "number", default: 3, min: 1, max: 4, step: 1, when: (p) => p.layout === "carousel" },
      { key: "autoplay", label: "Reproducción automática (s, 0 = manual)", type: "number", default: 0, min: 0, max: 8, step: 1, when: (p) => p.layout === "carousel" },
      { key: "shape", label: "Marco de la foto", type: "select", default: "portrait", options: ["portrait", "square", "circle", "oval"] },
      { key: "photoTone", label: "Tratamiento", type: "select", default: "color", options: ["color", "mono", "mono-hover"], hint: "mono-hover: blanco y negro que se colorea al pasar" },
      { key: "align", label: "Alineación", type: "select", default: "center", options: ["center", "left"] },
      { key: "linkLabel", label: "Texto del enlace", type: "text", default: "Reservar" },
      { key: "rowLink", label: "Fila entera como enlace (filas)", type: "boolean", default: false },
      { key: "titleSize", label: "Titular", type: "select", default: "md", options: ["md", "giant"] },
      { key: "backdrop", label: "Palabra de fondo", type: "text", default: "" },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center ui-center--top" style={{ padding: 0, justifyItems: "stretch" }}>
        <TeamSection kicker={p.kicker as string} title={p.title as string} people={p.people as string} layout={p.layout as never} perView={p.perView as number} autoplay={p.autoplay as number} shape={p.shape as never} photoTone={p.photoTone as never} align={p.align as never} linkLabel={p.linkLabel as string} rowLink={p.rowLink as boolean} titleSize={p.titleSize as never} backdrop={p.backdrop as string} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "logo-cloud",
    component: "LogoCloud",
    path: "@/components/ui/LogoCloud",
    name: "Tira de marcas",
    category: "secciones",
    styles: ALL_STYLES,
    description: "«Con la confianza de…»: marcas en texto, sin depender de imágenes que el kit no tiene.",
    stageHeight: 180,
    props: [
      { key: "label", label: "Etiqueta", type: "text", default: "Con la confianza de" },
      { key: "brands", label: "Marcas (separadas por comas)", type: "text", default: "Nautilus, Costa Brava FM, Surfrider, Deporte Norte, Vela & Mar", hint: "Escribe \\, para una coma dentro de un elemento (\"99\\,5 %\")" },
      { key: "layout", label: "Disposición", type: "select", default: "row", options: ["row", "ticker"], hint: "ticker = cinta continua con Swiper" },
      { key: "awards", label: "Premios con laureles", type: "text", default: "", hint: "Premio | categoría, separados por comas: Webby 2026 | Corporativo, Red Dot | Marca" },
      variantProp("minimal"),
    ],
    render: (p) => (
      <div className="ui-center ui-center--top" style={{ padding: 0, justifyItems: "stretch" }}>
        <LogoCloud label={p.label as string} brands={p.brands as string} layout={p.layout as never} awards={p.awards as string} variant={p.variant as never} />
      </div>
    ),
  },
  {
    id: "articles-section",
    component: "ArticlesSection",
    path: "@/components/ui/ArticlesSection",
    name: "Sección de blog",
    category: "secciones",
    styles: ALL_STYLES,
    description: "Cabecera + artículos (BlogCard) en rejilla, destacado (el primero grande con imagen de fondo), lista o carrusel. Cada tarjeta varía trama y acento sola.",
    stageHeight: 640,
    props: [
      { key: "kicker", label: "Sobretítulo", type: "text", default: "El blog" },
      { key: "title", label: "Titular", type: "text", default: "Últimas entradas" },
      {
        key: "articles",
        label: "Artículos (uno por línea: «categoría|título|extracto|fecha|min de lectura|imagen (URL o gen:N)|enlace»; los dos últimos opcionales)",
        type: "text",
        multiline: true,
        default: DEFAULT_ARTICLES,
      },
      { key: "layout", label: "Disposición", type: "select", default: "grid", options: ["grid", "featured", "list", "carousel"], labels: { grid: "rejilla", featured: "destacado + columna", list: "lista", carousel: "carrusel (Swiper)" } },
      { key: "cardLayout", label: "Tarjetas", type: "select", default: "stacked", options: ["stacked", "overlay", "minimal"], labels: { stacked: "apiladas", overlay: "superpuestas (imagen de fondo)", minimal: "mínimas" }, when: (p) => p.layout === "grid" || p.layout === "carousel" },
      { key: "fill", label: "Fondo", type: "select", default: "surface", options: ["surface", "tint", "gradient"], labels: { surface: "el de la variante", tint: "tinte de acento", gradient: "degradado" } },
      { key: "vary", label: "Variar trama y acento por tarjeta", type: "boolean", default: true },
      { key: "perView", label: "Visibles en pantalla ancha", type: "number", default: 3, min: 1, max: 4, step: 1, when: (p) => p.layout === "carousel" },
      { key: "autoplay", label: "Reproducción automática (s, 0 = manual)", type: "number", default: 0, min: 0, max: 8, step: 1, when: (p) => p.layout === "carousel" },
      variantProp("glass"),
    ],
    render: (p) => (
      <div className="ui-center ui-center--top" style={{ padding: 0, justifyItems: "stretch" }}>
        <ArticlesSection
          kicker={p.kicker as string}
          title={p.title as string}
          articles={p.articles as string}
          layout={p.layout as never}
          cardLayout={p.cardLayout as never}
          fill={p.fill as never}
          vary={p.vary as boolean}
          perView={p.perView as number}
          autoplay={p.autoplay as number}
          variant={p.variant as never}
        />
      </div>
    ),
  },
];
