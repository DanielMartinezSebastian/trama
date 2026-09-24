# Changelog de Trama

Formato: una entrada por versión publicada en npm (`npm run pkg:build` → `npm publish` desde `dist-npm/`). Sigue
[SemVer](https://semver.org/lang/es/): cambiar el nombre o el significado de una prop es un cambio mayor; los
renombrados de esta primera versión dejan el nombre antiguo como alias `@deprecated`.

## 0.1.0 — primera versión publicable

- 72 componentes en 13 categorías (fondos, texto, tarjetas, interacción, transiciones, datos, navegación,
  formularios, feedback, galerías y vídeo, secciones, overlays, pixel art), 7 estilos (`variant`) y tema por tokens.
- Vocabulario común de props: `variant`, `intent`, `emphasis`, `tone`, `fill` (ver guía, glosario).
- Entradas: `trama` (todos los componentes por nombre), `trama/<Componente>`, `trama/styles.css`, `trama/fonts`,
  `trama/tokens`, `trama/assets/*`; CLI `npx trama assets`.
- Probado en un proyecto Next.js 16 vacío instalando el `.tgz`: build con Turbopack y con webpack, sin configuración.
