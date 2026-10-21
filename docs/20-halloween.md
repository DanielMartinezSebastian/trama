# 20 · Ánima: una fiesta de Halloween con una calavera 3D procedural

> Ronda 10 (21-10-2026). Petición: «otra demo similar a Quilate, pero de miedo, con calaveras: un evento de Halloween». La web
> es **Ánima** (`/sitios/anima`, `components/sites/anima/`), una fiesta ficticia en Valencia el 31 de octubre. Reutiliza la
> fórmula de Quilate (docs/19 §7) y estrena dos cosas: una **calavera modelada con una función de distancia** y la pieza
> de kit **`Countdown`**.

**Referencias.** La búsqueda en Awwwards (SOTD de 2025 con Halloween, calaveras o three.js) no dio ninguna web premiada del
tema; se parte de la fórmula de Quilate, ya medida, y del lenguaje habitual de los eventos (fecha, lugar, entradas y cuenta
atrás desde la portada).

## 1. La noche contada en actos

La portada dice qué es, cuándo y dónde: «La fiesta de Halloween más terrorífica de Valencia», 31 de octubre, con la
cuenta atrás y dos llamadas (entradas y programa). Después, la noche en seis actos, cada uno con su hora:

| Acto | Hora | Cuadro | La calavera | Interludio (cintas) |
|---|---|---|---|---|
| 01 La puerta | 21:00 | precios y maquillaje gratis | de tres cuartos, despertando | «Niebla · calabazas · velas» / «La noche más larga del año» |
| 02 El pasaje | 21:30 | pasaje del terror de 90 m | la cámara entra en la cuenca | «No mires atrás» / «Seis personas · diez minutos · ninguna salida» |
| 03 La pista | 22:00 | tres DJs, dos salas | castañetea al ritmo | «Bailar hasta que salga el sol» / «Techno · Thriller · gritos» |
| 04 El concurso | 1:00 | 500 € al mejor disfraz | de perfil; después, el trío | «Calaveras · brujas · vampiros» / «El público vota, el jurado decide» |
| 05 La cena de los muertos | 21:00–4:00 | food trucks y barra | el cráneo se abre | «Pan de muerto · ponche · tacos» / «Se come con las manos» |
| 06 Medianoche | 0:00 | un minuto a oscuras y fuego | los ojos en rojo, riendo | «Un minuto a oscuras» / «Y después, fuego» |

Todo como en Quilate:
- **Capas** (de atrás adelante): salas de niebla de color, líneas técnicas, cintas de detrás y prólogo, cuadros, calavera y
  cintas de delante.
- **Cuadros**: de cristal, suben con el scroll, llegan desde abajo desenfocados y se van por arriba, por detrás de la calavera.
- **Prólogo**: el manifiesto se rellena palabra a palabra; en escritorio, a la izquierda; en móvil, a pantalla completa.
- **Navegación**: isla con hamburguesa, menú de vidrio a todo el alto y barra inferior suave.

Las cintas van en **Jacquard 24** (gótica) y los titulares en **Gloock**. Las salas son degradados en CSS (violeta,
calabaza, verde y sangre) que se funden al ritmo del scroll.

## 2. La calavera (`skullGeometry.ts`, `skullScene.tsx`)

- **Modelado con una función de distancia (SDF)**, sin modelos que descargar:
  - el cráneo, a base de elipsoides y cápsulas con uniones suaves (`smin`): bóveda, cara, cejas, pómulos, arco cigomático
    y maxilar;
  - con restas suaves para la nuca, las sienes, el hundido bajo los pómulos, las cuencas y la nariz;
  - la mandíbula, aparte, para que se abra sobre su bisagra;
  - los dientes, cajas en arco: incisivos, colmillos más largos y muelas más anchas.
- **Triangulación con `MarchingCubes` de three**: la escena rellena su campo con la SDF (`field = −sdf`, `isolation = 0`) y
  copia el resultado a una geometría estática. Resolución 92 para la principal y 60 para las acompañantes; se triangula
  una vez y se comparte.
- **Oclusión ambiental por vértice** con la propia SDF: se mira a lo largo de la normal cuánto espacio libre hay. Va como
  color de vértice y oscurece las cuencas, la nariz y las juntas sin texturas ni pasadas extra.
- **Luz**: luna fría arriba, un relleno cálido, una vela abajo que parpadea (tres senos) y un contraluz verde. Los ojos son
  ascuas con un halo y una luz puntual muy baja (si no, queman las paredes de la cuenca); pasan de naranja a rojo con `red`.
- **Ambiente**: ascuas que suben (220 puntos aditivos) y bancos de niebla que derivan.
- **Pose por scroll** (`SkullPose`): `yaw`, `x`, `y`, `zoom`, `jaw`, `talk` (castañeteo), `eye`, `red`, `close` (la cámara
  en la cuenca), `split` (la tapa sube y la mandíbula baja) y `trio` (dos calaveras más a los lados).
- **En móvil**: centrada en la mitad de arriba, sin trío y con la cámara menos dentro de la cuenca. Las líneas técnicas
  se centran en lo que enseña la cámara (`focus`).
- **Sin WebGL o con movimiento reducido**: una calavera plana en SVG (`SkullFlat`).

## 3. Páginas

- **Programa**: `Timeline` del kit con las horas y los seis actos con su detalle.
- **Entradas**:
  - tipo (`OptionPicker`, con la anticipada agotada), cantidad (`QuantityStepper`, hasta 8) y nombre;
  - resumen con los gastos de gestión y una «reserva» de mentira que da un QR;
  - no hay formulario de pago ni se piden datos de pago.
- **Info**: lugar, normas (edad, accesibilidad, avisos de luces estroboscópicas, pago) y preguntas frecuentes.
- **Datos estructurados**: JSON-LD `Event` con fechas, lugar y entradas en venta.

## 4. Pieza nueva del kit: `Countdown`

Cuenta atrás hasta una fecha (eventos, lanzamientos, rebajas), en `components/ui/Countdown.tsx` y en el catálogo (datos):
- **Cálculo**: en el navegador; antes de hidratar enseña guiones, sin desajustes. Se alinea con el cambio de segundo para
  que todas las cifras salten a la vez.
- **Cifras**: entran con un desplazamiento al cambiar (sin animación con movimiento reducido).
- **Al llegar a cero**: enseña el texto de `done`.
- **Accesibilidad**: `role="timer"`, con la fecha en un `<time>`. El texto para lectores de pantalla se actualiza al
  minuto, no al segundo.
- **Estilo**: sirve con las nueve variantes.

## 5. Pendiente

- Probar la calavera en un móvil real (coste de MarchingCubes a resolución 92 en la primera carga: unos cientos de ms).
- Una variante «calavera de azúcar» (Día de Muertos) pintada con una textura proyectada.
