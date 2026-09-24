# Trama

Componentes React / Next.js de **ASCII, textmode y pixel art**: fondos de caracteres animados, tarjetas con capas
ASCII, secciones de landing completas (hero, precios, FAQ, blog…), formularios, overlays y más. 72 componentes,
siete estilos (`glass solid outline neon retro terminal minimal`) y tema por tokens CSS.

Este repositorio es la librería **y** el sitio que la enseña: una galería de demos, un catálogo interactivo
(`/componentes`) con props editables, y landings de referencia construidas solo con Trama.

## Usarla en un proyecto

```bash
npm i trama            # cuando esté publicada; mientras tanto: npm run pkg:pack y npm i ./dist-npm/trama-x.y.z.tgz
npx trama assets       # copia las imágenes de PixelFrame y Sprite a public/
```

```tsx
import "trama/styles.css";                      // app/layout.tsx
import { Hero, PricingSection, Button } from "trama";
```

Referencia de props: [`docs/CATALOG.md`](docs/CATALOG.md) (generada; también en `catalog.json`).

## Desarrollar

```bash
npm install
npm run dev            # http://localhost:3000 — galería, /componentes, /demo/<slug>
npm run typecheck
npm run catalog:check  # valida catálogo ↔ archivos ↔ docs y las reglas de nombres
```

| Comando | Para qué |
|---|---|
| `npm run catalog` | regenera `docs/CATALOG.md` y `docs/catalog.json` desde el catálogo |
| `npm run pkg:build` / `pkg:pack` | construye el paquete npm en `dist-npm/` (y el `.tgz`) |
| `npm run kit:export -- <ruta>` | copia el kit a otro proyecto para adaptarlo |
| `npm run kit:pull -- <ruta>` | trae de vuelta lo que hayas mejorado allí |

## Documentación

- [`docs/README.md`](docs/README.md) — qué es librería y qué es sitio, npm vs copia, publicar.
- [`docs/02-guia-de-componentes.md`](docs/02-guia-de-componentes.md) — cómo crear componentes coherentes.
- [`docs/01-evaluacion.md`](docs/01-evaluacion.md) — historial de decisiones.
- [`AGENTS.md`](AGENTS.md) — cómo trabajar en el repo (pensado también para agentes de IA).

## Licencia

MIT. Recursos de terceros: Kenney «Pixel UI» (CC0) y Pixelarticons (MIT).
