# Primeros pasos

Trama es una librería de componentes React para Next.js: fondos ASCII y textmode, efectos de texto, pixel art y
**secciones de landing** listas para pegar. Todos los componentes comparten tres cosas: el **tema** (ocho tokens CSS),
el **estilo** (`variant`) y el **color semántico** (`intent`). Esta página lleva de cero a una landing montada.

## Instalar

Dos caminos, según quieras usar el kit tal cual o adaptarlo a fondo en tu proyecto:

| | npm | copia del código |
|---|---|---|
| Para qué | usarlo como dependencia y actualizar con `npm update` | modificarlo en tu proyecto y devolver las mejoras |
| Instalar | `npm i trama-ui` | `npm run kit:export -- ../mi-web` (desde este repo) |
| Imports | `import { Hero } from "trama-ui"` | `import Hero from "@/components/ui/Hero"` |
| CSS | `import "trama-ui/styles.css"` | `import "@/components/ui/styles/kit.css"` |

Con npm, el CSS va una sola vez en el layout raíz:

```tsx app/layout.tsx
import "trama-ui/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

Con la copia, `kit:export` trae solo lo que pidas y sus dependencias, y te dice qué paquetes npm faltan:

```bash
npm run kit:export -- ../mi-web --only Hero,PricingSection,FAQSection,Footer
```

> [!TIP] Tipografías
> En modo copia, añade también `fontVariables` de `@/lib/ui/fonts` al `<html>`: son las fuentes (Inter, JetBrains Mono y
> las pixel) autoalojadas con `next/font`.

## Poner el tema

El tema son ocho variables CSS en cualquier contenedor (o en `:root`). Sin ellas se usa el neutro oscuro del kit.

| token | para qué |
|---|---|
| `--bg` | fondo |
| `--fg` | texto |
| `--mut` | texto secundario |
| `--acc` | acento: botones, enlaces, activo |
| `--acc2` | segundo acento: degradados, detalles |
| `--card` | superficie de tarjetas y paneles |
| `--ln` | líneas y bordes |
| `--r` | radio de las esquinas |

```tsx app/page.tsx
<main style={{
  "--bg": "#000", "--fg": "#ededed", "--mut": "#8a8a8a",
  "--acc": "#ff3b3b", "--acc2": "#8a8a8a",
  "--card": "transparent", "--ln": "rgba(255,255,255,.14)", "--r": "0px",
} as React.CSSProperties}>
  …
</main>
```

No añadas colores fijos a los componentes: si algo necesita otro color, cambia un token en su contenedor.

## Elegir estilo e intención

- **`variant`** cambia el acabado de cualquier componente: `glass` · `solid` · `outline` · `neon` · `retro` ·
  `terminal` · `minimal` · `dotmatrix`. Una página suele usar uno solo.
- **`intent`** da el color semántico, igual en `Button`, `Badge`, `Alert`, `TextField`, `Toast` y `Modal`:
  `accent` · `neutral` · `success` · `info` · `warning` · `danger`.

```tsx
<Button label="Desplegar" variant="minimal" intent="accent" />
<Alert title="Sin conexión" message="Reintentando en 5 s." variant="minimal" intent="warning" />
```

Pruébalos en vivo en [la portada](/#componentes) o, componente a componente, en el [catálogo interactivo](/componentes).

## Montar una página

Compón con **secciones** primero y baja a piezas sueltas solo para lo que falte:

```tsx app/page.tsx
import { Hero, FeatureGrid, PricingSection, FAQSection, ContactForm, Footer } from "trama-ui";

export default function Page() {
  return (
    <main>
      <Hero variant="minimal" kicker="" title="Tu producto" subtitle="Una frase que lo explique." primaryCta="Empezar" secondaryCta="" />
      <FeatureGrid variant="minimal" title="Qué hace" items="…" />
      <PricingSection variant="minimal" />
      <FAQSection variant="minimal" />
      <ContactForm variant="minimal" />
      <Footer variant="minimal" brand="Tu marca" />
    </main>
  );
}
```

> [!IMPORTANT] Pasa siempre el texto
> Los valores por defecto son copy de demostración (una escuela de surf). En un proyecto real pasa todas las props de
> texto; una cadena vacía (`""`) oculta un texto opcional.

Las listas se pasan como texto: una entrada por línea o separadas por comas, con los campos separados por `|`. El
[catálogo de props](/docs/catalogo) enseña el formato de cada una con su valor por defecto.

## Partir de un ejemplo

- **Landings de referencia** (`/demo/<slug>`): páginas completas hechas solo con el kit. En el
  [catálogo de props](/docs/catalogo) está la receta de cada una con los componentes que usa, en orden.
- **Webs completas** (`/sitios/<slug>`): blog, tienda con carrito, servicios con chatbot, fabricante y portfolio, con
  navegación entre páginas y estado compartido. Ver [Webs completas](/docs/webs-completas).

Todas están en [Demos](/demos).

## Siguiente

- [Catálogo de props](/docs/catalogo): referencia de todos los componentes.
- [Componentes en vivo](/componentes): props editables, comparador de estilos y código de uso.
- [Crear componentes](/docs/guia): tokens, sistema de estilos y trampas conocidas, para ampliar el kit.
