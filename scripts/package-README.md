# Trama

Componentes, guías visuales y recetas para construir webs con carácter en React / Next.js. Incluye ASCII, textmode,
pixel art, secciones, formularios y patrones de negocio. Consulta `CATALOG.md` para las variantes y piezas disponibles.

## Instalación

```bash
npm i trama-ui
```

Requiere React 19. El piloto usa **Next.js App Router con Turbopack**; los componentes interactivos llevan `"use client"`.
Para transformar `trama-ui/fonts`, configura `transpilePackages: ['trama-ui']` y verifica build y fuentes en navegador.
No se certifica compatibilidad universal con otros frameworks ni equivalencia con `latest` de npm.

El paquete incluye `knowledge/index.json` y las skills experimentales `trama-build`, `trama-style` y `trama-research`.
Instálalas por proyecto con `npx --no-install trama-ui skills install --client codex` (o `claude`). El instalador conserva
instrucciones y modificaciones locales. La CLI `knowledge` imprime el índice de esta versión, no consulta una versión remota.

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

## Transiciones de página

`PageTransition` anima la **ventana entera** al navegar con la View Transitions API (el `<ViewTransition>` de React; en
el App Router de Next funciona sin configurar): `fade`, `slide`, `wipe`, `scan`, `stack`, `blinds`, `pixelate`, `scanline`, `glitch`,
`iris`, `terminal`. Va en cada `page.tsx` (o en un `template.tsx`), nunca en un layout; `PageTransitionPersist` deja
fija la cabecera (y cualquier elemento que deba quedarse quieto). `ElementTransition` aplica las mismas animaciones a la
caja de un elemento suelto y `SharedTransition` transforma un elemento compartido entre dos páginas.

```tsx
import PageTransition, { PageTransitionPersist, NAV_FORWARD, pageTransitionType } from "trama-ui/PageTransition";

// app/layout.tsx
<PageTransitionPersist name="cabecera"><header>…</header></PageTransitionPersist>
// app/**/page.tsx
<PageTransition kind="wipe">{/* contenido de la página */}</PageTransition>
// enlaces
<Link href="/siguiente" transitionTypes={[NAV_FORWARD]}>Siguiente</Link>
<Link href="/contacto" transitionTypes={[pageTransitionType("terminal")]}>Contacto</Link>
```

Los pseudo-elementos de la transición leen los tokens de `:root`. Con «reducir movimiento», solo un fundido breve; sin
soporte, la página cambia sin animar.

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
