# Ronda 7 (evaluación): qué demos clonar a continuación y qué concepto estrena cada una (20-10-2026)

> Objetivo: decidir las próximas demos de forma que **cada una itere una fórmula** que se pueda reutilizar en proyectos y
> **estrene al menos un concepto nuevo** en el kit. Parte de lo ya documentado (rondas [`06`](./06-indice-replicar-webs-premiadas.md)
> a [`14`](./14-transiciones-entre-rutas.md), sectores en [`11`](./11-estudio-sectores-2026.md)) y de una lectura nueva de
> [Awwwards · Sites of the Day](https://www.awwwards.com/websites/sites_of_the_day/) (página 1, 20-sep → 20-oct-2026).
> **Esta ronda solo leyó las fichas de Awwwards** (categoría, etiquetas, tecnología, paleta, elementos destacados): no se
> abrió ninguna web en Chrome. Lo que se dice de la interacción sale de esas fichas y va marcado como «según ficha».

## 0. Conclusiones

1. **Las rondas 1–6 se han centrado en estudios, portfolios, producto y lujo arquitectónico.** Hay 19 webs en `/sitios`, pero
   **ninguna de los sectores de pyme** de la [`11`](./11-estudio-sectores-2026.md) §6 salvo Vértice: faltan clínica, hotel,
   restaurante, inmobiliaria, gimnasio y oficios, que son los que más se venden.
2. **Awwwards de este mes trae justo esos sectores premiados**: una clínica de medicina estética (Odyssée), un lodge de lujo
   (Tengile Malamala), dos inmobiliarias (Realevate, Sobha Privy) y una fintech (Moto Finance). Se pueden clonar con
   referencia premiada **y** con sector de pyme a la vez.
3. **18 SOTD de la lista no aparecen en ninguna ronda.** De ellas salen seis conceptos que el kit no tiene (§3); dos encajan
   especialmente con la seña de Trama (ASCII, puntos, pixel): la **nube de puntos / escaneo de terreno** (Lidar Drone
   Scanning) y la **campaña jugable** (The Tie-break).
4. **Dos referencias distintas piden lo mismo**: un objeto 3D que gira con el scroll (casco de Nick Ho, tarjeta de Moto
   Finance). Es una opción de `ObjectStage`, no un componente nuevo (regla de modularidad, guía §12).
5. **Recomendación (§4):** la ronda siguiente monta tres demos — **Clínica** (Odyssée), **Lodge** (Tengile) y **Escáner**
   (Lidar) — y añade `ObjectStage scroll` de paso. Antes de construir, abrir las tres referencias en Chrome con el método de
   [`07`](./07-formulas-webs-top.md) §4.

## 1. Lo que ya cubren las demos (para no repetir)

| Fórmula | Demo(s) | Ronda |
|---|---|---|
| Estudio editorial | Estudio (Marea), Alzado | 06, 09 |
| Plano técnico | Plano | 07 |
| Evento con wordmark | Foro | 07 |
| Arquitectura tranquila | Arbor | 07 |
| Experiencia sonora / mapa explorable | Sonar, Mota | 08, 09 |
| Corporativo claro | Vértice | 12 |
| Atleta en voltaje | Volt | 13 |
| Producto nocturno | Faro | 13 |
| Escritorio Y2K | Hamaca | 13 |
| Continuidad entre rutas (vídeo vivo) | Travesía | 14 |
| SaaS dashboard / tienda | Pulso, Barro | 06 (fase 4) |

Recetas **sin demo** aún: «iridiscente claro» y «tienda industrial» ([`13`](./13-ronda-5-esteticas.md) §3).

## 2. Awwwards hoy: SOTD que no estaban en la documentación

Leídas el 20-10-2026. Ya revisadas en rondas anteriores (y no repetidas aquí): FORMAT, Signal-A, Belgrade Arbor, OFFFForum,
Overworld Audio, Huy Phan, Neutomni, Heron AI, LPAS, Santioni Spirits.

| Fecha | Web | Sector | Según ficha | Concepto que el kit no tiene |
|---|---|---|---|---|
| 20-10 | [Cartier · Le Chœur des Pierres](https://www.cartier.com/en-fr/lechoeurdespierres) (makemepulse) | Joyería / lujo | WebGL; blanco y negro; la gema presenta cada pieza; **revelado de gouache**; scroll animado en las fichas | **Revelado pintado**: la imagen aparece como pinceladas (máscara de pincel) |
| 11-10 | [Nick Ho](https://nickho-motorsports.nl) (BORING) | Deportista | Webflow, GSAP, three; acento amarillo `#FED60A`; **casco 3D que gira 360° con el scroll**; historia animada | Objeto 3D en «tocadiscos» ligado al scroll |
| 09-10 | [Maria Vasilyeva](https://mariavasilyeva.com) (Mia Renard) | Portfolio | WebGL, Sanity; casi negro y hueso; inspirado en música y ritmo | Maquetación «a compás» (bajo valor para el kit; no se propone) |
| 08-10 | [Odyssée](https://odysseeclinic.com.au) (NIGHTJAR) | **Clínica estética** | Next.js, GSAP, Sanity; marino `#1E305E` + hueso `#F6F4F2`; lujo, limpio, transiciones y microinteracciones | Fórmula «clínica de lujo» en dos colores (sector S sin demo) |
| 06-10 | [Lidar Drone Scanning](https://drone.riotters.com) (Riotters) | I+D / datos | Next.js, three; gris azulado y pizarra; **nube de puntos LIDAR en tiempo real**; efecto de escaneo del terreno; selector de contenido | **Nube de puntos** y barrido de escaneo |
| 04-10 | [EDOLUS](https://edolus.com) | IA / experimental | WebGL, GLSL, GSAP; negro; escenas que responden al ratón y diseño sonoro | Se solapa con Sonar y Overworld; no se propone |
| 03-10 | [Tengile Malamala](https://tengilemalamala.com) (DashDigital) | **Hotel / lodge** | React, Sanity; hueso `#FBF8F6` + oliva `#5C6E21`; «lujo tranquilo con relato cinematográfico»; menú horizontal, preloader, **línea de tiempo** en «Sobre nosotros», galería | Reserva con rango de fechas sobre relato a sangre (sector H sin demo) |
| 02-10 | [Milledollars](https://milledollars.fr) (Magnetism) | Productora de vídeo | Vue, GSAP; un gris; loader y galería | Cubierto por Travesía |
| 01-10 | [Colonia Zacamil](https://coloniazacamil.com) (Adoratorio) | Institución / arte público | Vue, three; beige y negro; mapa de murales con **día/noche y presente/pasado**; vídeo | **Conmutador de tiempo** sobre un mapa (antes/ahora, día/noche) |
| 30-09 | [CoMinVi](https://cominvi.com.mx) (HOLOGRAPHIK) | — | ficha no leída | — |
| 28-09 | [Butter](https://butter.video) (ToyFight) | App de vídeo | WebGL, React, p5.js; casi negro y blanco; estilo app, la **línea de tiempo** del editor como hero | Línea de tiempo de edición como hero (se solapa con Faro) |
| 27-09 | [Realevate](https://realevate.agency) | **Inmobiliaria** | GSAP; marino y blanco; loader, transiciones entre enlaces, **paso a la página siguiente al acabar el scroll**, selección por tarjetas | **Scroll que continúa en la ruta siguiente** |
| 25-09 | [The Tie-break](https://thetiebreak.merci-michel.com) (Merci Michel) | Campaña de moda | three; blanco; **campaña jugable** («juega y explora la colección»), revelado de la zapatilla | **Minijuego como escaparate** |
| 24-09 | [Moto Finance](https://moto-card.com) (Properly) | **Fintech** | Webflow, GSAP, three; casi negro + gris claro; una página, parallax, tarjeta 3D | Objeto 3D girado por scroll (igual que Nick Ho) |
| 23-09 | [Sobha Privy Collection](https://sobha-privy-collection.com) | **Inmobiliaria de lujo** | three; blanco y negro; **galería 3D**, mapa 3D, **zoom con el scroll**, selector de producto | Zoom con el scroll hacia la siguiente escena |
| 22-09 / 21-09 / 20-09 | bleibtgleich'26, Gil Huybrecht, Pensatori Irrazionali | — | fichas no leídas | — |

**No fiable:** las fichas de `twks` y `Jesper Landberg` que devolvió Awwwards eran de ediciones antiguas (2020, otra web);
quedan sin revisar.

### Lo que se repite este mes

1. **Paleta de dos colores** en casi todas (marino + hueso, oliva + hueso, negro + gris). Confirma la regla de un acento de
   [`07`](./07-formulas-webs-top.md) §1 y la lleva más lejos: **sin acento**, solo dos tintas.
2. **El scroll mueve una sola cosa grande** (casco, tarjeta, gema, nube de puntos, cámara sobre un mapa).
3. **Sectores «de pyme» en versión lujo**: clínica, hotel, inmobiliaria y tarjeta financiera ganan premio con la misma
   contención que un estudio.

## 3. Conceptos nuevos candidatos (con decisión de modularidad)

| Concepto | Referencia | ¿Nuevo o opción? | Encaje con Trama |
|---|---|---|---|
| Nube de puntos con barrido de escaneo | Lidar Drone | **Nuevo** `PointCloud` (three, subruta como `ObjectStage`) con versión 2D en `dotmatrix` sin WebGL; datos de `lib/sites/maqueta.ts` o un `.ply` pequeño | Alto: es la estética de puntos del kit en 3D |
| Objeto 3D girado por scroll | Nick Ho, Moto Finance | **Opción** `ObjectStage scroll="turntable"` (progreso de `PinnedSection` → rotación) | Medio; lo usarían Volt y una demo fintech |
| Revelado pintado | Cartier | **Opción** `ImageReveal mask="brush"` (máscara SVG de trazos animada con `stroke-dashoffset`, reutiliza lo aprendido en `LineDraw`) | Alto y barato; sirve a lujo, arte, restauración |
| Conmutador de tiempo (antes/ahora, día/noche) | Colonia Zacamil | **Nuevo** `BeforeAfter` (deslizador accesible, `role="slider"`) que ya pedía la [`11`](./11-estudio-sectores-2026.md) §5 para clínicas y reformas, con `mode="toggle"` para día/noche | Alto: un componente, dos referencias y tres sectores |
| Scroll que continúa en la ruta siguiente | Realevate, Sobha Privy | **Opción** de `BigFooter` o pieza pequeña `NextPage` que, al llegar al final, navega con `Traveler`/`SharedTransition` (la portada del siguiente pasa a ser la cabecera) | Alto: extiende la ronda 6 sin motor nuevo |
| Minijuego como escaparate | The Tie-break | Receta con `RetroCanvas` + `lib/sketches`; sin componente hasta ver si se repite | Alto (pixel art), pero es demo, no kit |
| Reserva por rango de fechas | Tengile (y [`11`](./11-estudio-sectores-2026.md) §6 Albar) | **Nuevo** `DatePicker mode="single" \| "range"` con `slots` (pendiente desde la fase 4) | Imprescindible para H, R, S, F |

## 4. Demos propuestas, por prioridad

Criterio: valor comercial del sector × concepto nuevo × cuánto reutiliza.

| # | Demo | Clona la fórmula de | Sector ([`11`](./11-estudio-sectores-2026.md)) | Concepto que estrena | Reutiliza |
|---|---|---|---|---|---|
| 1 | **Clínica** (la «Clínica Ribera» de la `11`) | Odyssée | S | `BeforeAfter`, `DatePicker` con huecos (cita por tratamiento), tema de dos tintas «marino y hueso» | `SplitText`, `FeatureExplorer` (tratamientos), `OpeningHours` si se hace, `FAQSection` |
| 2 | **Lodge** (la «Albar» de la `11`) | Tengile Malamala | H | `DatePicker mode="range"` en barra de reserva fija, `ImageReveal mask="brush"` | `Timeline`, `Preloader`, vídeo de la biblioteca (`naturaleza`), `ThemeScroll` |
| 3 | **Escáner** (topografía / inspección industrial) | Lidar Drone Scanning | B2B industria | `PointCloud` + barrido; versión `dotmatrix` sin WebGL | `PinnedSection`, `BlueprintFrame`, `MetaTable`, `ExplorableCanvas` |
| 4 | **Umbral** (inmobiliaria) | Realevate + Sobha Privy | I | `NextPage` (scroll que sigue en la ruta siguiente), ficha de inmueble (`ProductCard kind="property"`) | `Traveler`, `FilterBar`, `ExplorableCanvas depth="3d"` |
| 5 | **Tarjeta** (fintech, cierra la receta «iridiscente claro») | Moto Finance + Stripe | T / fintech | `ObjectStage scroll="turntable"` | `GradientField kind="ribbon"`, `BentoGrid`, `PricingSection` |
| 6 | **Barrio** (institución, museo, ayuntamiento) | Colonia Zacamil | Institucional | `BeforeAfter mode="toggle"` sobre `ExplorableCanvas` (día/noche) | `ExplorableCanvas`, `VideoPlayer` |
| 7 | **Campaña jugable** | The Tie-break | Comercio / marca | Minijuego pixel como escaparate (receta) | `RetroCanvas`, `ProductCard`, `CartDrawer` |
| 8 | **Brasa** (restaurante) | Dishoom (de la `11` §9; sin SOTD este mes) | R | `MenuList`, `OpeningHours` | `DatePicker` (de la demo 1), `ImageReveal mask="brush"` |

Las tres primeras forman una ronda equilibrada: dos sectores de pyme que no tienen demo y un concepto técnico muy propio de
Trama. `BeforeAfter` y `DatePicker` desbloquean después Brasa, Núcleo y Arista casi sin piezas nuevas.

**Fuera de esta lista a propósito:** EDOLUS y Maria Vasilyeva (se solapan con Sonar y Estudio), Milledollars (Travesía) y Butter
(Faro). Los sitios del año pendientes de la [`13`](./13-ronda-5-esteticas.md) §6 (Igloo Inc, Lusion v3, Messenger, Opal Tadpole,
Bruno Simon) siguen siendo útiles para conceptos 3D, pero no aportan sector.

## 5. Siguiente paso

1. Abrir en Chrome Odyssée, Tengile Malamala y Lidar Drone Scanning (método de [`07`](./07-formulas-webs-top.md) §4): librerías,
   tipografía del titular, fijos, lienzos, y la acción principal (pedir cita, reservar) paso a paso. Anotar lo observado aquí
   y corregir lo que esta lectura de fichas haya supuesto mal.
2. Construir primero las piezas compartidas (`DatePicker`, `BeforeAfter`), luego las demos 1 y 2, y `PointCloud` con la 3.
3. Por demo: criterio de «terminada» de la [`11`](./11-estudio-sectores-2026.md) §7 y receta en `CATALOG.md`.
