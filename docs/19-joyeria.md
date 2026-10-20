# Joyería: relato solo con servicios, luz por finalidad y configurador de piezas sencillas y complejas (Quilate)

> Ronda 9 (21-10-2026), rama `feat/joyeria`. La [`17`](./17-sectores-comerciales.md) §6 dejó la ficha del sector joyería y
> propuso la demo **Quilate** (§11). Esta ronda la construye con el método de estudio de Trama: **referencias medidas**
> (rondas [`07`](./07-formulas-webs-top.md), [`09`](./09-ronda-4-threejs.md), [`16`](./16-guias-de-estilo-plan.md)),
> **sector** ([`11`](./11-estudio-sectores-2026.md), [`17`](./17-sectores-comerciales.md)) y **Awwwards** ([`15`](./15-evaluacion-proximas-demos.md)).
> El encargo tenía tres condiciones: personalizar joyas **sencillas y complejas**; contar la historia de la joyería **solo
> con sus servicios y su filosofía**, con storytelling documentado, e **iluminar** cada elemento según la sección y su
> finalidad, con luz dinámica y reactiva.
>
> **Método y límites.** 12 joyerías españolas y 15 webs internacionales abiertas con Playwright headless (`npm run refs:probe`
> y scripts de recorrido con clics; nunca Claude in Chrome), más lectura de fuentes sobre relato e iluminación (46 fuentes).
> Etiquetas: **[medido]**, sale del script; **[captura]**, visto en una captura; **[fuente]**, lo dice la propia web, el
> estudio, Awwwards u otra publicación. Cartier, Tiffany y Brilliant Earth bloquean el agente de Chromium headless
> (Akamai y Cloudflare) y solo entran con un agente de Chrome normal. Carrera y Carrera (403) y Bulgari (403) no se
> midieron. Las cifras de luz que vienen de fabricantes van marcadas.

## 0. Conclusiones

1. **En España nadie hace lo que pide el encargo** [medido]. Las 12 webs estudiadas tienen 0 lienzos, 0 WebGL y 0 visores
   360°. Ninguna ofrece configurador con precio en vivo ni medidor de talla interactivo. Todas cuentan la historia con
   el año de fundación en el logotipo. El hueco es claro: pieza 3D, luz que responde, proceso de encargo como relato y
   cita que se lleva el diseño (§1).
2. **Fuera, los premios van al relato y no al configurador** [fuente]. Cartier gana casi un SOTD al año; el último es
   Le Chœur des Pierres (SOTD y Developer, 20-10-2026). El mejor configurador premiado, Jenn Zeiss (iJewel), se quedó
   en mención de honor. Quilate junta las dos cosas: relato de capítulos con un objeto que guía (R2 de la `16`) y un
   configurador serio (§2).
3. **La luz por sección ya existe en lo premiado, pero dentro del motor** [medido]. Cartier W&W carga un entorno EXR y
   sus armónicos esféricos por escena (`SC00`–`SC06`), más un entorno aparte solo para los relojes. Jenn Zeiss usa un
   entorno para las gemas y otro para el metal. Le Chœur cambia de papel blanco a terciopelo, a gouache y a azul noche
   según si eliges, presentas, cuentas el oficio o das el dato. Trama lo convierte en **pieza del kit**: `LightScroll`,
   una luz descrita con magnitudes físicas y elegida por finalidad (§5).
4. **El relato solo con servicios tiene marco documentado** (§4). Cada capítulo es un servicio, con el cliente como sujeto
   (StoryBrand) y con el porqué, el cómo y el qué (Sinek), en el orden del viaje del cliente (NN/g). Cada uno enseña algo
   de la trastienda, es decir, cruza la línea de visibilidad del service blueprint (Shostack). El tono es de tiempo,
   rareza y ritual (Kapferer y Bastien). No hay ninguna fecha de fundación: la continuidad la cuenta el capítulo «Heredar».
5. **Dos piezas nuevas en el kit**: `LightScroll` (con `useLight`, `LIGHT_PRESETS` y `kelvinToRgb` en `lib/ui/light.ts`)
   y `BeforeAfter`, pendiente desde la `11` §5 y la `15` §3. Lo propio de la web, que es el anillo procedural, el grabado
   con luz rasante y el medidor de talla, vive en `components/sites/quilate/` (guía §12).

## 1. Joyerías top de España (12 webs)

No hay un ranking cualitativo serio de 2025–2026; se eligieron por facturación y presencia [fuente]:
- elEconomista, CNAE 4777, datos de 2024: Tous es la primera, con 424 M€.
- Modaes: Rabat facturó 173,1 M€ en 2025.
- IPMARK 2025: Tous es el segundo anunciante del sector.
- Premios Madridjoya 2026: excelencia comercial para José Luis Joyerías.
- Se añadieron Jorge Juan Joyeros y The Bright Club porque las guías de compromiso las citan y son las únicas que
  enseñan cómo se encarga una pieza.
- No se encontró ninguna joyería española con Awwwards, CSSDA ni FWA. Es una conclusión por ausencia en los buscadores.

| Joyería | Acción principal | Servicios visibles | Configurador | Cita | Historia contada por… | Luz (captura) |
|---|---|---|---|---|---|---|
| **Suárez** | Comprar | Sur Mesure, primer grabado gratis, primer ajuste, mantenimiento, chat «Concierge» | No (filtros) | No | «Casa Suarez · **Saber hacer**» (diamante, perla, artesanía): lo más cercano al oficio | Foco único cálido sobre crema oscuro; vídeo de taller con soplete |
| **Rabat** | Comprar + **reservar cita** | Mantenimiento, relojes de segunda mano, guías de diamante y talla | Metal y diamante en la ficha, precio «a partir de» | **Sí, con fecha del evento** | Magazine, «Artesanía y savoir faire» | Moda saturada, mármol rojo |
| **Tous** | Comprar | Personal Shopper, TOUS by You, posventa, certificados | TOUS by You: metal, tipografía, cordón; precio fijo, **sin vista previa** | No | Pie «About us» | Vídeo de campaña a pleno sol |
| **Yanes** | Comprar | WhatsApp destacado, guía de tallas, cuidado | No | No | «Una historia de familia», «1861» | Luz de ventana difusa |
| **Grassy** | Relojes | Casi solo relojería | No | No | «Madrid 1929» en el logotipo | **La mejor**: blanco perla con haz especular → azul noche con diamantes que destellan → negro (fotos fijas) |
| **Aristocrazy** | Comprar | **Servicios como «experiencias» con nombre** (Engraving Lab, TA-TU, Piercing) | Mix&Match | No | Ninguna | Retrato en penumbra ocre |
| **UNOde50** | Comprar | Personalización de pulseras | No | No | «Universo UNO» | Gris liso, luz lateral suave |
| **Masriera** | Venta con asesor | Esmalte al fuego como oficio | No | No | «Legado», «Desde 1839», técnica | Luz plana sobre agua turquesa |
| **Carrera y Carrera** | Colecciones | Cita privada, grabado [fuente] | No | Sí [fuente] | «Más de 140 años» | no medida (403) |
| **Chocrón** | Comprar | Compromiso, Pre-owned, Lab Diamonds | No | sin comprobar | «Desde 1948» | Luz natural exterior |
| **Jorge Juan Joyeros** | Compromiso | **Taller visible**, sello GIA en la cabecera, WhatsApp | No | No | Taller y «más de 45 años» | Piel cálida y diamantes, luz lateral suave |
| **The Bright Club** | **Pedir cita** | **«Nuestro proceso» en 5 pasos** (render 3D → cera → fabricación, 20–25 días), grabado, talla durante 1 año | Por consulta, sin precio en vivo | **Online o showroom** | El proceso y el porqué del laboratorio | Estudio gris frío |

**Patrones** [medido y captura]:
- La portada es un escaparate (campaña → categorías → colecciones → newsletter) y la acción principal es comprar.
- Los servicios van al pie o a una franja de iconos; los repetidos son grabado, talla, financiación y guía de tallas.
- En vez de configurador, contacto humano: WhatsApp, chat o personal shopper.
- Fondo blanco con serifa en los titulares.
- Ninguna usa Lenis y solo Yanes carga GSAP.

**Huecos** (la ventaja de Quilate):
- Configurador con precio en vivo y desglosado.
- Pieza 3D con luz que responde.
- El proceso de encargo como hilo de la web.
- Medidor de talla en pantalla.
- Cita que conserva la configuración.
- Certificado y punzón ligados a la pieza.
- La posventa como parte del relato.

## 2. Referencias internacionales y premiadas (15 webs)

| Web | Qué se aprende | Técnica [medido] |
|---|---|---|
| **Cartier · Le Chœur des Pierres** (SOTD + Developer 20-10-2026, makemepulse) | **La luz y el color de cada sección salen de la piedra elegida**. Papel blanco para elegir, donde la piedra proyecta una sombra de color. Al pasar el cursor, un halo de pigmento y la otra piedra desenfocada. Terciopelo del color de la piedra con haces para presentar. Una lente bajo el cursor que descubre el dibujo gouache, con bordes de arcoíris. Azul noche con bokeh para el dato técnico | WebGL2 con planos de foto y gouache (GLB con texturas Basis) y vídeos de transición; la joya **no es un modelo 3D** |
| **Cartier · Watches & Wonders 2026** (SOTD 25-05-2026, Immersive Garden) | Un entorno de luz por escena y otro aparte para la pieza. La marca se cuenta con artesanos en sus mesas («Tailored crafts serving one form») | three r183, `SCxx_oct.exr` + `_sh.json` por escena y `watches_oct.exr` |
| **Tiffany · Ring Studio** | No hay configurador online: **el configurador es la cita**. La página son servicios (grabado, caja azul, expertos, guía, «A Lifetime of Service») | foto |
| **Blue Nile · Creative Studio** | Tres pasos (montura → diamante → anillo); 16 cabezas, 16 aros y 10 tallas; «Consult an expert» siempre a la vista | three r185; anillo **modular** (aro, cabeza y piedra en glTF separados); **un matcap por metal**; panorama por talla para el diamante |
| **Brilliant Earth · alianza a medida** | La plantilla exacta de la pieza sencilla: perfil (4), ancho de 4 a 7,5 mm, acabado (4), metal, talla y grabado por +40 $, con precio en vivo | fotos por combinación, 360° y vídeo |
| **VRAI** | Setting → Diamond → Review y «See it in real life» (la cita) | renders fotográficos |
| **Jenn Zeiss** (HM 25-06-2024, Bornfight) | **La cámara cambia con cada paso**: en el grabado se acerca al interior del aro | three r153 + iJewel; **un entorno para las gemas y otro para el metal** |
| **Graff · Chaumet · Van Cleef · Boucheron · Messika · Mejuri** | Sin configurador. Graff pone a cada montura el nombre de un diamante histórico. Chaumet organiza el pie en *Find us / Our services / Our maison*. Van Cleef usa luz rasante sobre textil. Todas tienen «Book an appointment» | — |

**Joyería en Awwwards, 2024–2026** [fuente]:
- Cartier: Le Chœur des Pierres (SOTD 2026), W&W 2026 (SOTD), W&W 2025 (SOTM), 365 (SOTD 2025) y W&W 2024 (SOTD).
- Menciones de honor: Bulgari Eclettica, Jenn Zeiss, Nida Tabba, Happy Ring, Phoria, Eden Garden, Diamond Rose Sanctuary y otras.
- Antes de 2024, ORE Bespoke (SOTD + Developer 2022) es el único ganador de **joyería a medida**.

**Patrones de luz**:
1. La luz la decide la sección, no la página.
2. La pieza tiene su propio entorno, estable, y no cambia de color con la escena.
3. Para el metal basta un matcap o un entorno de estudio.
4. El diamante pide un entorno de alto contraste: el «patrón» claro y oscuro.
5. La gema tiñe la escena.
6. Claro para elegir, oscuro para presentar.
7. Contraluz y cáusticas como firma de «aquí hay luz de verdad».

**Patrones de configurador**:
1. Tres a cinco pasos con una barra fija y clicable.
2. Muestras visuales con «Opción: valor».
3. Precio en vivo.
4. Grabado con la cámara en el interior del aro.
5. Salida humana siempre visible.
6. Modelo modular: aro, cabeza y piedra por separado.

## 3. Lo que se toma y lo que no

| De | Se toma | No se toma |
|---|---|---|
| Cartier W&W, Jenn Zeiss | Entorno de luz por sección y **entorno propio de la gema** (sala negra con paneles: el patrón de facetas) | Los EXR de 2–8 MB: aquí el entorno se genera con código y no pesa nada |
| Cartier Le Chœur | La luz cambia con la finalidad; en el paso «piedra», un halo del color de la piedra detrás | Los planos de foto en WebGL: la pieza aquí es procedural y cambia con cada opción |
| Blue Nile | Pieza modular (aro + cabeza + piedra) y pasos con barra | Los glTF por pieza: aquí aro y talla son geometría generada |
| Brilliant Earth | Las opciones exactas de la alianza | — |
| Tiffany, The Bright Club, Rabat | **La cita es la acción principal** y se lleva el diseño, con la fecha del evento | El configurador escondido tras la cita |
| Grassy, Suárez | Fondo oscuro con un solo foco, la joya como única luz | La historia por fechas |

## 4. Relato: la casa contada solo con sus servicios

**Marcos** (fuentes completas en el informe de la ronda; resumen):

| Marco | Qué aporta aquí |
|---|---|
| **Golden Circle** (Sinek, 2009) | Cada capítulo abre con su **porqué** (frase-tesis), sigue con el **cómo** y cierra con el **qué** (servicio y acción). El porqué de la casa se repite en cada capítulo en lugar de contarse una vez en «nuestra historia» |
| **StoryBrand / SB7** (Miller, 2017) | **El cliente es el sujeto** («te escuchamos», «tu mano») y la casa es la guía. Los capítulos son el plan en pasos y la acción es siempre la misma: pedir cita |
| **Customer journey** (NN/g, Gibbons 2018) | El orden de los capítulos es el viaje real: descubrir → elegir → encargar → llevar → cuidar → legar |
| **Service blueprint** (Shostack, *HBR* 1984; NN/g 2017) | Cada capítulo **cruza la línea de visibilidad** y enseña algo de la trastienda: cera, engaste, soldadura de talla, ultrasonidos, el archivo |
| **«Show, don't tell»** (carta de Chéjov de 1886, según Quote Investigator) | Nada de «somos artesanos apasionados»: el banco, la lupa, el antes y el después. El ejemplo de Chéjov es un cristal que destella, y aquí la luz hace ese trabajo |
| **Experience Economy** (Pine y Gilmore, 1998) | La cita es una escena (luz baja, una hora sin prisa), no un formulario |
| **The Luxury Strategy** (Kapferer y Bastien, 2009/2012) | **Tiempo** (plazos largos dichos como virtud), **rareza** (piedras una a una) y **ritual** (la cita). Tensión con StoryBrand: la claridad va en el plan y el sueño en el tono y la luz |

**Los siete capítulos** (`CHAPTERS` en `components/sites/quilate/data.ts`):

| # | Servicio | Frase-tesis (porqué) | Trastienda que se enseña (cómo) | Qué y acción | Luz | El anillo |
|---|---|---|---|---|---|---|
| 01 | **Escuchar** | «Antes de dibujar nada, te escuchamos.» | Mesa, cuaderno y una hora sin prisa | Cita de 60 min en el taller o por vídeo · Pedir cita | `lampara` 2600 K | en **boceto** (alambre) |
| 02 | **Elegir** | «Una piedra se elige con luz honesta, no con focos.» | Dos luces: foco para el fuego y luz de día para el color | Piedras certificadas · Ver piedras | `fuego` 4800 K, sigue al puntero | **solo la piedra**, de cerca |
| 03 | **Dar forma** | «Lo hacemos a mano, y a mano lleva semanas.» | Cera → fundición → limado → engaste → pulido | 12 días una alianza, 4–6 semanas un solitario · Diseñar una alianza | `taller` 4200 K | en **cera** |
| 04 | **Ajustar** | «Si no encaja en tu mano, no está terminada.» | Medir, ajustar la talla en el banco, grabado a buril y punzón | Talla gratis el primer año · Medir mi talla | `rasante` 8°, 4000 K | acabado |
| 05 | **Cuidar** | «Lo que sale de aquí vuelve aquí cuando lo necesite.» | Ultrasonidos y revisión de garras, con la **misma luz antes y después** | Limpieza de por vida · botón «Limpiar la pieza» | `honesta` 6500 K | **apagado** → limpio |
| 06 | **Transformar** | «El oro de una herencia puede volver a llevarse.» | Desmontar, recuperar piedras, refinar el oro | Boceto gratis · Traer una pieza | `memoria` 3100 K | otra pieza (oro rosa, bisel) |
| 07 | **Heredar** | «Lo hacemos para quien la lleve después de ti.» | La ficha de archivo (boceto, piedra, certificado, ley, punzón, fechas) con QR en el estuche | Garantía transmisible · Pedir cita | `vitrina` 3600 K con destellos | acabado |

Reglas que se cumplen:
- No hay sección de historia ni fecha de fundación. La continuidad la cuenta el capítulo 07.
- La acción principal (cita) está en la cabecera, en la barra móvil y al final de cada capítulo.
- Cada capítulo se entiende solo: frase-tesis más un dato concreto (`11` §4).
- Las páginas interiores siguen la misma idea: el taller presenta seis servicios con precio, plazo y su propia luz.

## 5. Luz por finalidad (`LightScroll`)

**Lo que dice la evidencia** (GIA salvo indicación):
- El **brillo** se ve con luz difusa; el **fuego** se acentúa con luz puntual y la difusa lo suprime; el **centelleo**
  necesita movimiento de la luz, la pieza o el observador (Moses et al., *Gems & Gemology* 2004; blog 4Cs de GIA, 2015).
- Para **graduar el color**, GIA usa luz equivalente a la de día en un entorno gris neutro: el blanco esconde fugas y el
  negro oscurece la piedra.
- Las **piedras que cambian de color** se comparan bajo D65 (6500 K) y bajo A (2700 K) (Lab Notes de GIA, 2019).
- La **luz rasante** (≤ 20°, a veces 5–10°) revela incisiones y marcas de herramienta (AIC, MFA Boston, Canadian Conservation
  Institute).
- Temperaturas de vitrina **[fabricante]**: oro a 2700–3000 K, plata y platino a unos 4000 K, diamante a 4500–5000 K.
  6500 K «se lee clínico». CRI ≥ 90–95 y R9 alto para el rubí.
- Sobre percepción no hay pruebas concluyentes de intención de compra. Con prudencia: lo cálido da intimidad a la escena
  y lo neutro o frío es para la piedra.

**Las nueve tomas** (`LIGHT_PRESETS` en `lib/ui/light.ts`):

| Toma | Finalidad | K | Tipo · dureza | Ambiente | Extra |
|---|---|---|---|---|---|
| `vitrina` | emocionar (portada, cierre) | 3600 | foco · dura | 0,12 (fondo en sombra) | destellos |
| `fuego` | ver el fuego y el centelleo | 4800 | foco pequeño · muy dura | 0,08 | **sigue al puntero**, destellos |
| `honesta` | comparar color y quilates, medir, antes/después | 6500 | baño difuso | 0,9 | fondo **gris neutro** en el configurador |
| `calida` | la otra mitad del conmutador para piedras de color | 2700 | baño difuso | 0,75 | — |
| `rasante` | leer un grabado o un punzón | 4000 | rasante a 8° · dura | 0,15 | — |
| `lampara` | conversar (cita) | 2600 | foco bajo y lateral · difusa | 0,18 | — |
| `taller` | trabajar (oficio) | 4200 | flexo cenital | 0,4 | — |
| `lupa` | documentos, tasación | 5500 | baño frontal uniforme | 0,8 | — |
| `memoria` | herencia, reseñas, pie | 3100 | foco suave | 0,35 | pocos destellos |

**Cómo funciona.**
- Cada sección declara `data-light="toma"`. La que cruza la línea media manda, igual que en `ThemeScroll`.
- `cue` fuerza una toma: los pasos del configurador y el conmutador de luz.
- Un bucle interpola la toma (kelvin, posición, radio, dureza, ambiente) y escribe variables CSS en el contenedor
  (`--light-rgb`, `--light-x`, `--light-i`…). Se duerme cuando llega a la toma y no sigue al puntero.
- La capa de luz son dos degradados detrás del contenido: un foco radial (o una lineal para la rasante) y un baño del
  resto de la escena. La dureza mueve el borde del núcleo. Los destellos son siete estrellas de cuatro puntas en CSS.
- **La misma toma ilumina el 3D**: `useLight().live` es una referencia que la escena lee en cada fotograma, sin pasar
  por React. El color de la luz principal sale de los kelvin y su posición del foco, o casi tangente si es rasante. Una
  toma difusa da más entorno (brillo) y una dura más foco y puntos de destello (fuego).
- **Accesibilidad**:
  - Con movimiento reducido, la luz cambia sin fundido, no sigue al puntero y no hay destellos.
  - Los destellos son pequeños y lentos: unos 2 por segundo entre todos (WCAG 2.3.1).
  - El texto nunca depende de la luz y mantiene su contraste en todas las tomas.
  - Un **rótulo fijo** dice qué luz hay y para qué («Luz de día · difusa y neutra · 6500 K»): la luz también es
    contenido y se explica, no solo se nota.
- **Honestidad** (regla de la ronda): en los antes y después, y al comparar, la luz no cambia entre las dos imágenes.
  El conmutador de luz es siempre explícito, nunca automático.

## 6. La pieza sencilla y la compleja

| | Alianza (sencilla, `/alianzas`) | Solitario (compleja, `/compromiso`) |
|---|---|---|
| Opciones | metal (4, con ley) · ancho de 2 a 6 mm · perfil (confort, media caña, plana) · acabado (pulido, satinado, martillado) · pavé · talla · grabado y su letra | **5 pasos**: montura (4 garras, 6 garras, bisel, halo, trilogía) → piedra (diamante natural o de laboratorio, zafiro, esmeralda, rubí) · talla (brillante, oval, princesa, esmeralda) · quilates de 0,3 a 2 → metal y aro (ancho, perfil, acabado, pavé) → talla y grabado → resumen |
| Luz | conmutador escaparate / día / cálida; al enfocar el grabado pasa a **rasante** y la cámara entra en el aro (como Jenn Zeiss) | una toma por paso: vitrina → **fuego** (con conmutador a luz de día, y a cálida en piedras de color) → vitrina → rasante → lámpara |
| Precio | desglose en vivo: gramos de metal según talla, ancho, perfil y densidad, hechura, acabado, pavé y grabado (el primero gratis) | lo mismo más la piedra (precio por quilate con exponente según tipo y factor de talla) y la montura |
| Plazo y aviso | días de taller según opciones; señal del 30 %; **aviso de que lo personalizado no tiene desistimiento** antes de pagar (`17` §6) | igual; la piedra se reserva 7 días para verla en persona |
| Salida | «Pedir cita con esta pieza»: la cita se lleva el diseño (miniatura, descripción y presupuesto) | ídem |

**El anillo 3D** (`ringScene.tsx`, sin modelos):
- El **aro** es la revolución de su sección: superelipse en confort, media caña con el interior plano y plana con cantos.
- La **talla brillante** es geometría propia de 49 facetas (mesa, estrellas, cometas, medias lunas, faja, pabellón);
  princesa y esmeralda se hacen por revolución con pocas caras.
- **Garras, bisel, halo de 18 piedras, trilogía y pavé de 14** se colocan alrededor.
- **Martillado** con un mapa de normales generado (120 golpes); **satinado** con más rugosidad.
- **Gemas con trazado de rayos real** (`gemMaterial.ts`). Una talla es un poliedro convexo, así que el punto por el que
  sale un rayo es el plano de faceta más cercano en su dirección, sin BVH. Los planos se sacan de la geometría (hasta 96).
  En cada píxel:
  - reflexión exterior con Fresnel;
  - refracción hacia dentro (Snell);
  - hasta 6 rebotes, con reflexión interna total cuando se supera el ángulo crítico (24,4° en el diamante);
  - **dispersión**: un trazado por canal, con el índice de cada color (diamante 2,407 · 2,418 · 2,451; corindón ~1,77;
    berilo ~1,58);
  - las piedras de color absorben según la distancia recorrida dentro (Beer–Lambert).

  La toma de luz tiñe el entorno y añade el reflejo del foco. En pantallas táctiles se traza un solo canal, sin
  dispersión, para ahorrar GPU.
- **Entorno de gema propio**: un cubemap de caja de luz gris con diez paneles HDR y cinco banderas negras, que da a la
  vez brillo y el patrón de facetas claras y oscuras (GIA). El metal usa el `RoomEnvironment` de three.
- **Aspectos por capítulo**: boceto (alambre), cera (verde de modelar), gema (solo la piedra, con la cámara en la
  cabeza), apagado (sin brillo y sin iridiscencia, para «Cuidar») y final.
- **Respaldo**: el mismo anillo en SVG sin WebGL, con movimiento reducido y como miniatura en la cita.

**El grabado, en el propio editor 3D.** Se escribe y se ve en vivo dentro del anillo, sin vista aparte:
- El texto, con la letra elegida y seguido del punzón `750 · QLT`, se dibuja en un lienzo que hace de color y de **relieve**
  (`bumpMap`): las letras quedan más bajas que el metal.
- Se coloca en una franja pegada al interior del aro, abajo (la cabeza está arriba), y la máscara de las letras deja ver el
  aro real alrededor, sin que se note la franja.
- La letra mide el 55 % del ancho del aro y se reduce si el texto no cabe en 1,5 rad, lo que se ve de una vez.
- Al escribir o elegir la letra, la toma pasa a **rasante**, el aro deja de girar, se queda de frente y la cámara entra por
  su boca. Al arrastrar se inclina el aro, cambia el ángulo de la luz y las letras se dibujan más o menos.

**Deconstrucción de un solitario clásico** (foto de referencia del usuario, 21-10-2026): un anillo comercial de plata
bañada en oro (marca interior «S925»). Se descompone en las piezas del generador y se reconstruye como «Solitario clásico»
(`CLASSIC_SOLITAIRE`, botón «Partir de un modelo» en `/compromiso`):

| Pieza | Lo que se ve en la foto | Cómo se hace aquí |
|---|---|---|
| Aro | Fino (~2 mm), sección redondeada, pulido espejo; **se estrecha y adelgaza al subir** hasta fundirse con la cabeza | perfil nuevo `afinado`: el aro es un barrido de su sección alrededor del dedo, con la anchura (−38 %) y el grueso (−18 %) reducidos según una campana centrada en la cabeza |
| Cabeza | **Cuatro garras planas** de sección cuadrada, rectas y verticales, cortadas en recto, que bajan hasta el aro; una **galería** (aro fino) las une bajo la piedra; piedra **montada baja** | montura nueva `clasico`: garras en caja orientadas al centro, galería en toro, filetín a 0,42 R sobre el aro |
| Piedra | Brillante redondo de ~5 mm (≈ 0,5 ct), blanca (probablemente circonita) | brillante de 0,5 ct con el trazado de rayos; en la web, diamante de laboratorio |
| Metal | Plata 925 con baño de oro amarillo | metal nuevo `vermeil` (plata de ley con baño de oro de 18 k) |
| Marca interior | Logotipo de la marca + «S925» | **no se copia**: va el contraste y el punzón de la casa (`750 · QLT` en el grabado) |

**Kit de piezas modelado en Blender** (`public/models/anillos/`, CC0, sesión «blender» del 21-10-2026):
- **Qué trae**: 9 aros, 11 cabezas y 11 piedras, con su miniatura y un `manifest.json`.
  - Los aros: liso, afinado, filo de cuchillo, catedral, partido, torsade, bypass, pavé de 22 y canal de 22.
  - Las cabezas: 4 y 6 garras, garras dobles, de pico, bisel, medio bisel, halo redondo y oval, oval de 4 y de 6, y trilogía.
  - Las piedras: brillante de 57 facetas, oval, princesa, esmeralda, asscher, cojín, radiante, pera, marquesa, baguette y melé.
  - Todas están generadas por script (`bpy`), en mm, con materiales `metal`/`gem` y Empties de anclaje (`attach_head`,
    `attach_shank`, `seat`, `seat_side_L/R`, `pave_NN`, `halo_NN`). Las piedras son convexas y cerradas, que es lo que
    necesita el trazador.
- **Peso**: sin Draco ni meshopt, porque la CSP no permite los decodificadores de WebAssembly. Al integrarlas se pasaron
  por `@gltf-transform/cli@4.1.1` (`weld`, `quantize` con `KHR_mesh_quantization` y `dedup`), que three lee sin
  decodificador: de 2,9 a 2,2 MB en GLB; la pieza más pesada es la trilogía, con 178 KB.
- **Cómo se montan** (`pieces.ts`): se hornean las transformaciones, las posiciones cuantizadas se pasan a float y los mm a
  las unidades de la escena.
  - La cabeza, hecha para 1 ct, se apoya en `attach_head` del aro y se escala con la raíz cúbica de los quilates.
  - La piedra va en `seat` y la melé en cada `pave_NN` y `halo_NN` (a 1,1 mm en los halos).
  - Los laterales de la trilogía van en `seat_side_L/R`.
- **Planos de faceta en textura**: el cojín y la marquesa tienen hasta 169 caras, así que los planos pasan de uniforms a
  una textura de hasta 256.
- **En el configurador**:
  - Selector con miniaturas: «Montura del taller» y «Aro del taller», más la opción «a medida» procedural.
  - Las tallas se filtran por la cabeza (`compatibles`) y se avisa de las combinaciones no recomendadas (catedral con
    trilogía).
  - La alianza ofrece solo los aros que tienen sentido sin cabeza.

**El medidor de talla** (`/talla`):
- Se calibra la pantalla con una tarjeta de 85,6 mm y se ajusta un círculo a un anillo que ya tienes.
- También se puede medir con un hilo (talla española = circunferencia − 40).
- Tabla de equivalencias. Va con luz honesta, porque aquí manda el milímetro.

## 7. La web: Quilate (`/sitios/quilate`)

Taller de joyería ficticio en Valencia. Guía visual G1 «lujo tranquilo» en oscuro:
- Colores: tinta sepia `#0e0c0a`, hueso `#efe7da` y oro viejo `#d2ae72`.
- Tipografía: Cormorant Garamond 300 en los titulares (`clamp(52px, 9vw, 140px)`, interlineado 0,92) e Inter en el cuerpo.
- Radio de 2 px.
- Fondo oscuro: la luz se ve y la pieza es la única luz fuerte (Grassy, Cartier W&W).

| Página | Qué hay |
|---|---|
| Inicio | Portada con el solitario bajo luz de vitrina («Siete gestos para una joya») · **los siete capítulos con el anillo fijo** a un lado (encima en móvil) y la luz cambiando por capítulo · dos entradas (sencilla y compleja) · confianza (contraste y punzón, certificados, precio cerrado, de por vida) · reseñas con resumen · FAQ · cita |
| Alianzas / Compromiso | Los dos configuradores (§6) |
| Taller | Seis servicios con precio y plazo, cada uno con su luz: ajuste, grabado (rasante), limpieza (**`BeforeAfter`**), reparación, transformar, tasación (informe) |
| Tu talla | Medidor en pantalla |
| Cita | Motivo (también por `?motivo=`), taller o videollamada, `DatePicker` con huecos y festivos, datos mínimos, la pieza que se lleva y el horario |

**Coreografía del recorrido** (portada):
- El anillo del recorrido se monta con piezas del kit: aro de pavé, cesta de seis garras, 1 ct y grabado «Para ti · siempre».
- Sigue una pose por capítulo (`POSES` en `Site.tsx`):

  | Capítulo | Pose |
  |---|---|
  | Escuchar | entero |
  | Elegir | la piedra sale de la cesta y se ve de cerca |
  | Dar forma | despiece completo en cera |
  | Ajustar | la cámara entra en el aro y lee el grabado con luz rasante |
  | Cuidar | cerca del pavé |
  | Transformar | se abre y se rehace |
  | Heredar | montado, de vitrina |

- La pose se interpola con la **posición del scroll** entre los centros de dos capítulos (con suavizado), no con el tiempo:
  hacia atrás deshace exactamente lo mismo, sin saltos. La escena la sigue de cerca para no ir por detrás del gesto.
- Con movimiento reducido no hay 3D: queda el anillo plano en SVG.
- **Estudio de luz para el metal**: en lugar del `RoomEnvironment`, un estudio de joyería generado con PMREM. Lleva tiras
  verticales largas, un softbox cenital y otro trasero alto, un rebote cálido bajo y banderas negras. El metal pulido se
  lee por las franjas claras y oscuras que corren por el aro al girar.

Base común de la `11` y la `17`:
- `ActionBar` (llamar, WhatsApp, cita) y `OpeningHours`.
- `CookieBanner` con «Rechazar» al mismo nivel y «Configurar cookies» en el pie.
- JSON-LD `JewelryStore` con horario, valoración y servicios como `Offer`.
- Punzón y ley del metal en el pie y en cada metal; aviso de bienes personalizados antes de pagar.
- Fotos reales: nuevo tema `joyeria` en la biblioteca, 10 fotos CC0 de Commons, con el filtro nuevo `match` de
  `images:fetch` para temas con mucho ruido.

## 8. Piezas nuevas y criterio de modularidad

| Pieza | Dónde | Por qué ahí |
|---|---|---|
| `LightScroll` + `useLight` | kit (`components/ui/`, CSS en `ui-impact.css`, catálogo en `entries/luz.tsx`) | Sirve a cualquier producto que se elige mirando: joyería, relojes, cosmética, vino, cerámica, museos, inmobiliaria (día y noche). Es hermana de `ThemeScroll`: aquella cambia los tokens y esta la luz |
| `LIGHT_PRESETS`, `light()`, `kelvinToRgb`, `kelvinToHex`, `lerpCue` | `lib/ui/light.ts` | Datos y física sin React; los lee también three |
| `BeforeAfter` | kit | Pedido por tres sectores (clínica, reformas, estética) y ahora por joyería; `mode="toggle"` para día/noche |
| Anillo procedural, grabado rasante, medidor de talla | `components/sites/quilate/` | Solo sirven a esta web (guía §12). Si una segunda web de joyería los repite, el medidor puede subir al kit como `RingSizer` |

## 9. Pendiente

- **Halo del color de la piedra** en el paso «Piedra» (la sombra de color de Cartier): hoy la luz es por temperatura. Una
  opción `tint` en `LightCue` lo resolvería sin pieza nueva.
- La princesa y la esmeralda se generan por revolución (pocas caras): una talla en escalera propia daría a la esmeralda
  el «salón de espejos» que la caracteriza.
- Medir Quilate con `npm run refs:probe` contra los rangos de la `16` §2 y pasar axe (B9 de la `11`).
- En móvil, que la luz `fuego` siga la orientación del dispositivo (`deviceorientation`) en lugar del puntero.
- Confirmar en fuente primaria la Ley 17/1985 (punzón) y la redacción de la excepción de desistimiento.
