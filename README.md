# Trama

Componentes, guías visuales y recetas para construir webs con carácter en React / Next.js: composición, tokens,
movimiento y patrones de negocio. ASCII, textmode y pixel art siguen siendo parte del kit. El catálogo generado
es la referencia de piezas y variantes; el [recorrido para agentes](docs/57-agentes.md) es experimental.

Este repositorio es la librería **y** el sitio que la enseña: una galería de demos, un catálogo interactivo
(`/componentes`) con props editables, y landings de referencia construidas solo con Trama.

## Usarla en un proyecto

```bash
# Desde este repo: generar el paquete de la versión de esta rama
npm run pkg:pack
# Desde el consumidor: instalar ese .tgz exacto
npm i /ruta/al/trama-ui-x.y.z.tgz
# Opcional: instalar las skills de la dependencia local
npx --no-install trama-ui skills install --client codex
```

```tsx
import "trama-ui/styles.css";                      // app/layout.tsx
import { Hero, PricingSection, Button } from "trama-ui";
```

Referencia de props: [`docs/CATALOG.md`](docs/CATALOG.md) (generada; también en `catalog.json`).

La consulta pública de npm del 29-10-2026 devolvió `latest` 0.2.0; no equivale a 0.13.0 de esta rama. El paquete
local distribuye `knowledge/` y skills; no se ha publicado esta evolución. [Evidencia y canales](docs/evolucion-agentes/p0-matriz.md).

## Desarrollar

Para trabajar con Claude Code y Codex, preparar worktrees y verificar capturas: [flujo de agentes](docs/flujo-agentes.md).

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
