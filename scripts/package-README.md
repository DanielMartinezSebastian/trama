# Trama

Componentes React / Next.js de **ASCII, textmode y pixel art**: fondos de caracteres animados, tarjetas con capas
ASCII, secciones de landing completas (hero, precios, FAQ, blog…), formularios, overlays y más. Siete estilos
(`glass solid outline neon retro terminal minimal dotmatrix`) y tema por tokens CSS.

## Instalación

```bash
npm i trama-ui
```

Requiere React 19. Pensado para **Next.js (App Router)**, sin configuración extra (probado con Turbopack y con
webpack); los componentes interactivos ya llevan `"use client"`.

## Uso

```tsx
// app/layout.tsx
import "trama-ui/styles.css";
import { fontVariables } from "trama-ui/fonts"; // opcional: las fuentes del kit, autoalojadas con next/font

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// cualquier página
import { Hero, PricingSection, Button } from "trama-ui";
// o, un componente por archivo:
import FAQSection from "trama-ui/FAQSection";

export default function Page() {
  return (
    <main style={{ "--acc": "#ff4fa3" } as React.CSSProperties}>
      <Hero title="Mi producto" subtitle="Lo que hace, en una línea." primaryCta="Empezar" variant="glass" />
      <PricingSection highlight="invert" />
      <FAQSection variant="outline" />
      <Button label="Eliminar" intent="danger" emphasis="outline" />
    </main>
  );
}
```

**Pasa siempre las props de texto**: los valores por defecto son textos de demostración.

## Tema

Define estos tokens en `:root` o en cualquier contenedor (sin ellos se usa un tema neutro oscuro):

```css
--bg --fg --mut --acc --acc2 --card --ln --r
```

Vocabulario común de props: `variant` = estilo visual · `intent` = color semántico (`accent neutral success info
warning danger`) · `emphasis` = énfasis de un botón · `tone` = token de color · `fill` = fondo de una tarjeta.

## Recursos pixel art

`PixelFrame` y `Sprite` usan imágenes (Kenney «Pixel UI», CC0) que tienen que servirse desde tu `public/`:

```bash
npx trama-ui assets        # copia a ./public/pixel/kenney-pixel-ui
```

## Referencia completa

`CATALOG.md` (incluido en el paquete; `npx trama-ui catalog` imprime su ruta) lista cada componente con su import, sus
props, tipos y valores por defecto. Es la referencia pensada para agentes de IA.

## Licencia

MIT. Recursos de terceros en `THIRD-PARTY.md`.
