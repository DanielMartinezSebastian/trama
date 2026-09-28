# Changelog de Trama

Formato: una entrada por versión publicada en npm (`npm run pkg:build` → `npm publish` desde `dist-npm/`). Sigue
[SemVer](https://semver.org/lang/es/): cambiar el nombre o el significado de una prop es un cambio mayor; los
renombrados de esta primera versión dejan el nombre antiguo como alias `@deprecated`.

## 0.3.0 — envío real en `ContactForm`, ayudas accesibles y listas con escape

Mejoras que salieron al montar martinezsebastian.com con el kit.

- `ContactForm`: `onSubmit` puede ser asíncrono y devolver el resultado
  (`((data) => void) | ((data) => ContactFormResult | Promise<void | ContactFormResult>)`, con
  `ContactFormResult = { ok: boolean; message?: string }`; cualquier objeto con `ok: false`, como una `Response` de
  `fetch`, cuenta como fallo). Mientras la promesa está pendiente el botón muestra `loading`; con `{ ok: false, message }` o
  una excepción pinta un `Alert` danger (`role="alert"`) y conserva lo escrito; con `ok: true` o sin retorno, el estado
  de éxito de siempre. Props nuevas `errorTitle` («No se pudo enviar») y `errorMessage` (texto si falla sin mensaje
  propio). Sin `onSubmit`, o con uno síncrono sin retorno, se comporta como en 0.2. Tipos exportados desde `trama-ui`.
- `TextField`: el `hint` (ayuda o error) se enlaza con `aria-describedby` (id de `useId`) en `<input>` y `<textarea>`,
  y el nombre accesible sale solo de la etiqueta (`aria-labelledby`), así el lector de pantalla anuncia el error.
  `Select`: la etiqueta se enlaza al botón y a la lista (`aria-labelledby`). `CheckboxGroup`, `RadioGroup` y
  `OtpInput` no tienen texto de ayuda: nada que enlazar.
- Listas en texto: el separador se puede escapar con barra invertida (`\,`, `\|`, `\;`), p. ej.
  `badges="+12 proyectos, 99\,5 % disponibilidad"`. Helper común `splitList`/`splitEscaped` en `lib/ui/list.ts`
  (exportado desde `trama-ui`), usado por todos los componentes que parten listas por `,`, `|` o `;`.
- Aviso `THREE.Clock … deprecated` con `RetroCanvas`: viene de `@react-three/fiber` 9.x (su store crea un
  `THREE.Clock`), no de Trama; anotado en `docs/04-pendientes.md`.
- Compatible con 0.2.0: ninguna prop cambia de nombre ni de significado. Cambios observables: una barra invertida
  justo delante del separador de una lista ya no se muestra (ahora es el escape), y un `onSubmit` que ya devolvía
  una promesa (p. ej. `() => fetch(…)` sin `await`) ahora se espera antes de mostrar el éxito.

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
