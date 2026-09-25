import type { ReactNode } from "react";
import { renderMarkdown } from "@/lib/ui/markdown";
import { tcls, vcls, type Tone, type Variant } from "./variants";

export type ProseProps = {
  /** documento en Markdown (ver lib/ui/markdown.tsx); si hay `children`, se usan esos en su lugar */
  markdown?: string;
  /** HTML/MDX propio: recibe la misma tipografía (h1–h4, p, listas, citas, code, pre, tablas, figure…) */
  children?: ReactNode;
  /** tamaño del texto de cuerpo */
  size?: "sm" | "md" | "lg";
  /** ancho máximo de línea: narrow ≈ 60 caracteres · normal ≈ 70 · wide ≈ 84 · full = el del contenedor */
  measure?: "narrow" | "normal" | "wide" | "full";
  /** letra capital en el primer párrafo */
  dropCap?: boolean;
  /** enlace «#» junto a cada título, al pasar el ratón */
  anchors?: boolean;
  /** color de enlaces, viñetas y citas */
  tone?: Tone;
  /** variante de los bloques de código del Markdown */
  codeVariant?: Variant;
  variant?: Variant;
  className?: string;
};

export const DEMO_MARKDOWN = `# Tu primera clase de surf

Todo lo que necesitas saber **antes de meterte al agua**: qué traer, cómo es la clase y qué hacer si algo sale mal. Léelo con calma; son *cinco minutos* y te ahorran la mitad de los revolcones.

## Qué traer

- Bañador y una toalla grande
- Crema solar resistente al agua (==factor 50==)
- Agua y algo de comer para después
  - Fruta o frutos secos
  - Nada pesado justo antes de entrar

El neopreno, la tabla y el leash los ponemos nosotros. Si tienes tu propio material, tráelo y lo revisamos.

## Cómo es la clase

1. **Calentamiento** en la arena, diez minutos.
2. **Técnica en seco**: remada, *take-off* y posición sobre la tabla.
3. **Agua**: espuma blanda, siempre con un monitor a menos de cinco metros.

> [!TIP] Lo que más ayuda
> Mira siempre hacia donde quieres ir, no a tus pies. La tabla sigue a la cabeza.

### Horarios

| Turno | Hora | Plazas |
|:--|:--:|--:|
| Mañana | 9:30 | 6 |
| Mediodía | 12:00 | 6 |
| Tarde | 17:30 | 4 |

## Antes de reservar

- [x] Saber nadar 50 metros
- [x] Tener más de 8 años
- [ ] Traer autorización si eres menor

> [!WARNING]
> Si hay bandera roja, la clase se aplaza sin coste. Te avisamos por mensaje antes de las 8:00.

![Pico de la playa al amanecer](gen:0 "La playa de la escuela, con marea baja.")

## Si reservas desde la web

Pulsa [[Reservar]] y elige turno. Si integras las reservas en tu propia web, este es el formato del aviso que enviamos:

\`\`\`ts reserva.ts
export type Reserva = {
  turno: "mañana" | "mediodía" | "tarde";
  plazas: number;
};
\`\`\`

---

> El mar no se domina: se aprende a leer. La primera ola que coges de verdad no se olvida.
> — Lucía Ferrán, monitora jefe

¿Dudas? Escríbenos a [hola@mare.surf](mailto:hola@mare.surf) o pásate por la escuela. ~~Abrimos los lunes~~ Abrimos todos los días.`;

/**
 * Texto largo con formato: la tipografía de un artículo o una página de documentación. Acepta Markdown (`markdown`) o
 * HTML/MDX propio (`children`) y les da la misma tipografía, que sale del tema y de la variante. El Markdown se convierte a
 * elementos React (sin HTML crudo), con ids en los títulos para `TableOfContents`.
 */
export default function Prose({
  markdown = DEMO_MARKDOWN,
  children,
  size = "md",
  measure = "normal",
  dropCap = false,
  anchors = true,
  tone = "acc",
  codeVariant = "terminal",
  variant = "minimal",
  className = "",
}: ProseProps) {
  const cls = ["ui-prose", `ui-prose--${size}`, `ui-prose--${measure}`, dropCap && "ui-prose--dropcap", vcls(variant), tcls(tone), className].filter(Boolean).join(" ");
  return <div className={cls}>{children ?? renderMarkdown(markdown, { anchors, codeVariant, calloutVariant: variant })}</div>;
}
