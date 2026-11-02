# P6 · Variedad con Claude como constructor

**Fecha:** 2 de noviembre de 2026
**Rama/worktree:** `feat/evolucion-agentes`, `C:/COMPARTIDO/trama-evolucion-agentes`
**Constructor:** Claude Code con Opus 5.5, una generación por concepto, leyendo `trama-build`, `trama-style` y sus referencias.
**Demo:** `/lucero/horario`, `/lucero/vagon`, `/lucero/ventanilla`; aparte, `/lucero/maqueta` (reinterpreta Night Train).
**Ficha:** [lucero-cuatro-conceptos](../cuaderno/lucero-cuatro-conceptos.md)

## Pregunta

Pedidos tres conceptos para un mismo uso, ¿salen tres diseños realmente distintos o se incumple la solicitud?

## Veredicto

**No se incumple: con Claude, las tres landings son estructuralmente distintas.** Se cumple en una prueba favorable y con
un solo intento, así que no responde todavía a lo observado con Codex.

## Cómo se separaron

Candidatas consideradas: tabla, corte lateral, ventanilla, conversación con el revisor, billete rellenable y cuaderno de
viaje. Se eligieron tres ejes del propio servicio: qué y cuánto (datos), dónde (espacio) y cuándo (tiempo).

| Eje libre | Horario | Vagón | Ventanilla | Maqueta (aparte) |
|---|---|---|---|---|
| Premisa | La página es la tabla | El tren se recorre por dentro | Una noche en un plano | Mirar el tren desde arriba |
| Medio | Solo HTML | CSS y SVG | R3F procedural | R3F con GLB |
| Interacción | Elegir filas | Scroll lateral y tocar asiento | Scroll como tiempo | Tocar asiento en 3D |
| Composición | Tabla y panel | Tira horizontal | Ventana con pared | Escena a sangre y panel |
| Tipografía | Archivo, cifras enormes | Bricolage y Onest | Newsreader cursiva | Instrument Sans y Geist Mono |
| Navegación | Ninguna | Pestañas por coche | Raíl de paradas | Mandos por coche |
| Tono | Cívico | Lúdico | Contemplativo | Técnico |

Comparación con demos recientes, como pide `trama-style`: SONDA (producto y compra), POLARIS (objeto y cámara), Inés Bruma
(collage). Ventanilla es la más cercana a POLARIS por medio y scroll; se distingue porque no hay objeto protagonista y el
punto de vista es fijo.

## Medidas

`npm run qa:variedad -- --nombre lucero <urls> --control`. Luminancia reducida a 48×30, tres encuadres y dos anchos. El
control mide cada página contra sí misma con el tono girado 180°: una variante que solo cambia la pintura.

| Par | Silueta | Bordes | Paleta |
|---|---|---|---|
| Horario / Vagón | 0,21 | 0,06 | 0,00 |
| Horario / Ventanilla | 0,07 | 0,04 | 0,05 |
| Vagón / Ventanilla | 0,17 | 0,04 | 0,05 |
| Horario / Maqueta | 0,08 | -0,07 | 0,14 |
| Vagón / Maqueta | 0,08 | -0,01 | 0,01 |
| Ventanilla / Maqueta | 0,05 | 0,01 | 0,23 |
| **Control: misma página, otro tono** | **0,96–1,00** | **0,96–1,00** | 0,13–0,79 |

La silueta separa bien el cambio de pintura del cambio de estructura. No hay umbral calibrado: falta medir pares que una
persona juzgue parecidos, como dos demos reales que se repitan.

## Lo que se repitió

- **Columna derecha:** Horario, Ventanilla y Maqueta colocan algo a la derecha (panel o raíl). La métrica no lo detecta
  porque compara la pantalla entera. Es la convergencia más clara y no fue una decisión consciente.
- **Formulario:** nombre, correo y botón son iguales en las cuatro, en parte por requisito y en parte por compartir
  `ReservaCampos`. Cerca de la reserva las versiones se parecen más que en el resto del recorrido.
- **Elegir tocando el asiento:** Vagón y Maqueta comparten la mecánica y una zona que confirma la plaza.
- **Oscuro con scroll vertical:** Ventanilla y Maqueta coinciden en parte de la noche y en el gesto; son el par con más
  cruce de paleta (0,23).

Ninguna cae en el centro estadístico que describe `design-directions.md`: no hay hero fotográfico ni rejilla de tarjetas.

## Límites

- **Claude no equivale a Codex.** Esto no explica ni descarta la repetición que se ve con Codex.
- **Petición favorable:** pedía literalmente patrones totalmente diferentes. P5 ya avisó de ese sesgo.
- **Sin ciego:** el mismo agente construyó y evaluó, y conocía las skills y el objetivo.
- **Skills leídas, no activadas:** no aparecen en la lista de skills de esta sesión y se abrieron a mano.
- **Una muestra:** una generación por concepto, en el repo completo, sin el consumidor limpio de P4.
- **Encuadres:** el 100 % de Ventanilla es la zona de reserva, no la película, así que la media mezcla ambas.
- **Headless por software:** el WebGL se midió con SwiftShader, sin comprobar en una GPU real.

## Comprobaciones

- Reserva completa en Playwright: Horario, Vagón y Ventanilla a 1440 y 390 px; Maqueta a 900 y 390 px, tras corregir un
  fallo real que impedía saltar entre coches. No se repitió el recorrido completo de Maqueta a 1440 px.
- Clic real en un asiento 3D a 1440 px: selecciona la plaza 44 del coche 1. Se probó antes de aislar `<Canvas>` y no se
  repitió después.
- `qa:contrast`: cero incumplimientos (Horario y Vagón a 390, 768 y 1440; Ventanilla y Maqueta a 390 y 1440). Vagón deja 38
  puntos para revisión visual y Maqueta solo cubre el estado inicial del panel.
- `smoke --auditar`: 200, sin errores ni sombras. Avisos de botón sin efecto en Vagón y Ventanilla, sin revisar uno a uno.
- `npm run build` **no se ejecutó**: el servidor de desarrollo de este worktree sigue en marcha.

## Siguiente paso

Prueba que sí responde a lo observado con Codex: el mismo encargo, sin la palabra «diferente», varias generaciones con
Codex y con Claude, y `qa:variedad` más revisión de miniaturas por alguien que no haya construido.
