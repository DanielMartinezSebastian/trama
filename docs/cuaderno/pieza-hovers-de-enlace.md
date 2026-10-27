---
titulo: Hovers de enlace medidos — NavBar linkHover, RollLink fade y el botón de menú que se rellena
fecha: 2026-10-27
tipo: pieza
estado: hecho
referencias: [https://hairmeup.pl, https://www.marcoambrosi.salon/, https://coreatelierpilates.com/, https://www.fenriz-gym.com/, https://coachsportifecublens.com/, https://k72.ca/en]
fichas: [docs/53 §5, docs/CATALOG.md]
ruta: /componentes
codigo: [components/ui/NavBar.tsx, components/ui/RollLink.tsx, components/ui/FullscreenMenu.tsx]
colores: []
fuentes: []
sector: [peluquería, gimnasio, agencia]
guia: []
tono: []
paleta: []
tipografia: []
patrones: []
movimiento: [subrayado que crece, texto que rueda, relleno que baja]
piezas: [NavBar, RollLink, FullscreenMenu]
piezas-nuevas: [NavBar, RollLink, FullscreenMenu]
relacionados: [replica-melena, replica-raiz, replica-nucleo, replica-lobo, replica-impulso, replica-q47, herramienta-probe-par]
---

## Concepto

Los gestos al pasar el ratón que más se repiten en las webs estudiadas, sacados de la sonda de hover de `refs:probe` (que
mira también `::before` y `::after`), no de la memoria.

## Qué se midió

| Gesto | Webs | Cómo lo hacen |
|---|---|---|
| **Subrayado que crece** bajo los enlaces de navegación | Hair Me Up, Marco Ambrosi, Core Atelier («Sign in», con flecha) | `::after` de 0 al 100 % de ancho |
| **Texto que rueda** («rolling text») | Essor, Fenriz, K72 | la palabra sube y entra una copia; en Fenriz, además, se funde |
| **Relleno que baja** sobre el botón del menú | K72 | `::after` del acento de −100 % a 0 en 0,15 s, easeOutCubic |

## Qué se hizo

- `NavBar linkHover="underline"`: una raya que crece de izquierda a derecha bajo cada enlace, también en el activo y con
  foco.
- `RollLink fade`: la palabra que sale se funde y la que entra aparece.
- `FullscreenMenu triggerHover="fill"`: el acento baja sobre el botón y el contenido pasa al color del fondo.
- Los tres están en el catálogo y se usan en Q47, Lobo e Impulso.

## Aprendido

- Los hovers se repiten más que las secciones: tres webs de tres sectores con el mismo subrayado. Medir el hover de cada
  web (y no solo la maqueta) es lo que los saca a la luz.
- `RollLink` ya existía; el gesto se buscaba por su nombre en la web («rolling text») y no por su efecto. Por eso conviene
  buscar en el kit por lo que hace la pieza.

## Siguiente

- Si el subrayado con flecha (Core Atelier) se repite, una variante `underline-arrow`.
