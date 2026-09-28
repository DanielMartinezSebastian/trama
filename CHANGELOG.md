# Changelog de Trama

Formato: una entrada por versión publicada en npm (`npm run pkg:build` → `npm publish` desde `dist-npm/`). Sigue
[SemVer](https://semver.org/lang/es/): cambiar el nombre o el significado de una prop es un cambio mayor; los
renombrados de esta primera versión dejan el nombre antiguo como alias `@deprecated`.

## 0.2.0 — accesibilidad, audio, modelos 3D y markdown

- 82 componentes en 14 categorías (antes 72/13): `ScrollProgress`, `RetroFX`, `RetroShapes`, `RetroModel` (modelos
  glTF), `AudioPlayer` con motor propio (`lib/ui/audio.ts`, reproducción de archivo y síntesis), `ChatWidget`,
  y `Article`/`ArticleHeader`/`Callout`/`Prose`/`TableOfContents` con render de Markdown (`lib/ui/markdown.tsx`,
  `lib/ui/markdownInline.tsx`).
- Octava variante de estilo: `dotmatrix`.
- Accesibilidad: foco visible en toda interacción del kit; `prefers-reduced-motion` respetado (WCAG 2.3.3) en fondos
  generativos (`AsciiBackground`, `TextmodeBackground`), destellos (`SceneFlash`) y cursores/spinners; roles ARIA en
  `ChatWidget`, `Testimonial`, `Footer`, `ScrollArea`; texto para lectores de pantalla en `Typewriter`; nueva prop
  `headingLevel` en `BlogCard` y `Panel` para no romper el orden de encabezados de la página que los usa.
- Rework de `NavBar` (más variantes y comportamiento) y mejoras en `Tooltip`, `Toast`, `Toggle`, `PricingCard`/
  `PricingSection`, `GridBackground`, `CTASection` y formularios (`TextField`, `Select`, `RadioGroup`,
  `CheckboxGroup`, `Pagination`, `Table`, `Tabs`).
- Sin cambios de nombre o significado de props existentes: compatible con proyectos en `0.1.0`.

## 0.1.0 — primera versión publicable

- 72 componentes en 13 categorías (fondos, texto, tarjetas, interacción, transiciones, datos, navegación,
  formularios, feedback, galerías y vídeo, secciones, overlays, pixel art), 7 estilos (`variant`) y tema por tokens.
- Vocabulario común de props: `variant`, `intent`, `emphasis`, `tone`, `fill` (ver guía, glosario).
- Entradas: `trama-ui` (todos los componentes por nombre), `trama-ui/<Componente>`, `trama-ui/styles.css`, `trama-ui/fonts`,
  `trama-ui/tokens`, `trama-ui/assets/*`; CLI `npx trama-ui assets`.
- Probado en un proyecto Next.js 16 vacío instalando el `.tgz`: build con Turbopack y con webpack, sin configuración.
