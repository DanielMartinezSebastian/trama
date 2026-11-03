# 60 · Quinta ronda de inspiraciones: elegir por los huecos de las guías

> 03-11-2026. El usuario pide ocho inspiraciones más, esta vez para mejorar las guías o crear las que falten, siguiendo
> las skills `trama-research`, `trama-kit-evolution` y `trama-style`. Rama `feat/inspiraciones-5`, en su worktree
> `trama-inspiraciones-5`, con un único dev en el puerto 3000 (el usuario pidió parar los demás). Registro de la tarea en
> `docs/tareas/inspiraciones-5.md`.

## 0. Conclusiones

1. **La mitad del hueco estaba en la medida.** Antes de buscar webs se midió el repo: 28 páginas sin guía afín y 22 de 36
   réplicas más cerca de otra guía que de la suya. Cuatro correcciones de la sonda (§2) bajan las páginas sin guía a 14
   sin tocar ninguna guía.
2. **Se cambiaron guías solo con evidencia limpia.** Se midieron otra vez las 36 webs originales: `salon` y `trattoria` se
   ajustaron a sus originales, y se creó `bloque`, la única familia con varias fuentes y sin guía (§3).
3. **Las webs se eligieron por esos huecos**, no por sector (§1), y cada una refuerza una guía (§4).
4. **Dos mejoras del kit** salieron de los flujos: `CheckoutFlow delivery="digital"` y `useCart` sincronizado (§5).

## 1. Criba

Se midieron 74 candidatas de los premios del día de junio a noviembre de 2026 con `refs:probe` y su afinidad con las 45
guías (`.refs/ronda-5/candidatas*/`). Se descartaron las que devolvían 403 o pedían verificación (las de Obys,
Serotoninn, Hobro), las de escena WebGL o vídeo como medio dominante (IL CAPO, Tresmares) y las de sectores ya cubiertos
sin aportar a una guía. Cada elegida pasó por `cine:web` (mapa de secciones, técnica y transición) y su matriz de firma.

| Slug | Marca propia | Referencia | Hueco o guía que refuerza | Firma | Flujo |
|---|---|---|---|---|---|
| `bolo` | Bolo | Truck'N Roll | familia sin guía → `bloque` | condensada de 900 a pantalla completa con fotos entre las palabras, pegatina girada, pie violeta con cintas | planificar la gira con presupuesto; candidatura |
| `grano` | Grano | Glitch&Grit | familia sin guía → `bloque` | muro de proyectos fijado al scroll, dos mitades y nombre pastel con glitch | trabajo filtrable, ficha, presupuesto |
| `turia` | Turia Grotesk | PP Neue Montreal | color pleno (sin segunda fuente) → `cartel` | tipografía como guía de viaje, carta de pesos, cintas de acentos | probador, licencias con pago digital |
| `majo` | Majo | Fauna Robotics | `papel` (segunda fuente) | crema cálido, figuras de formas, tarjetas redondeadas | configurar y reservar con señal |
| `corriente` | Nada Corriente | Normal is Boring | `sabana` (segunda fuente) | serifa ultrafina escalonada, marca partida, palabras gigantes cortadas | disponibilidad por vivienda y visita |
| `tueste` | Tueste | CoffeeTech | `monocromo` (segunda fuente) | portada negra con grotesca enorme, catálogo gris, corchetes | catálogo, comparador, presupuesto |
| `trocha` | Trocha | Radian | `papel` | visor de la moto por ángulos con puntos de detalle | configurar y reservar con señal |
| `llave` | Llave | Units | `manchas` (segunda fuente) | rejilla de tarjetas de color, lateral de pestañas, aviso de oferta | residencia, habitación y reserva |

Units tapa su web con un aviso y la mueve con una escena WebGL secundaria: se tradujo la rejilla en DOM. El aviso de Llave
sale una vez y se recuerda.

## 2. La sonda

`scripts/probe-refs.mts` y `scripts/guias-afinidad.mts` (ficha `herramienta-afinidad-de-guias`):

1. **Titular de las portadas con foto**: por debajo de 2,5 vw, lo mayor de las tres primeras pantallas, sin el pie.
2. **Marca y titular de las guías por separado**: siete relatos abrían con la marca de borde a borde (27–47 vw) y se
   medían por ella.
3. **Letra por familia genérica**: las serifas de fundición (PP Fragment, Ivy Mode, Forvm…) salían como grotescas.
4. **Fondo de la primera pantalla**: una portada negra sobre una página clara cuenta como las dos.

| Medida del repo | Al empezar | Tras la sonda | Al final |
|---|---|---|---|
| páginas por debajo de 0,25 | 28 | 14 | ver §7 |
| páginas por encima de 0,35 | 27 | 40 | ver §7 |

## 3. Guías

- `salon`: tarjetas en salmón claro, como el mosaico de Il Colorista y el arco de Hair Me Up.
- `trattoria`: fondo rojo con texto crema, como Délice y Bocado.
- `bloque` (nueva, «Bloque nocturno»): negro, Archivo 900 en mayúsculas a 12 vw, tarjetas violeta; excepción de peso
  medida. Bolo, Grano, Brasa (K72) e Impulso (Essor) la siguen. La primera versión pasaba los once rangos y no atraía a su
  familia; se rehízo (ficha `concepto-guias-revisadas-ronda-5`).
- `electrico` no cambia: Brasa estaba mal asignada.

Las tres pasan los once rangos con `refs:probe --guides --solo`.

## 4. Pares

`refs:probe --par` con fotos provisionales, el 03-11-2026:

| Web | Medidas cerca | Largo de la portada (pantallas) |
|---|---|---|
| Bolo | 11/20 | 12,4 → 7,6 |
| Grano | 8/14 | 14,5 → 6,9 |
| Turia | 10/20 | 25,2 → 8,9 |
| Majo | 13/20 | 10,6 → 6,8 |
| Nada Corriente | 10/20 | 16,8 → 7,8 |
| Tueste | 12/20 | 9,3 → 6 |
| Trocha | 10/17 | 12,6 → 6,2 |
| Llave | 11/20 | 9,6 → 1,6 |

Como en las rondas anteriores, las portadas son más cortas. Llave es la más corta: Units alarga la suya con una escena
fijada de quince pantallas que no se tradujo.

## 5. Kit

- `CheckoutFlow delivery="digital"`: datos y pago, sin envío; lo usan Turia, Majo, Trocha y Llave.
- `useCart`: las instancias con la misma clave se avisan (evento propio y `storage`).
- Recetas por sector nuevas en `lib/catalog/sectores.ts`: logística de eventos, productora, tipografía, robótica de
  consumo, promotora, maquinaria, vehículo eléctrico y residencia.

## 6. Aprendido

- Medir el repo antes de elegir webs cambió la ronda: el primer hueco era de la herramienta.
- Pasar los once rangos no hace buena una guía: hay que medir su afinidad con sus propias fuentes.
- Un color cuenta en una guía si es superficie en su relato, no un botón.
- La sonda no pasa avisos de cookies: ERA y Spyker siguen sin medirse bien.

## 7. Comprobaciones

- `qa:contrast` en las ocho portadas a 320, 390, 556, 700, 768, 830, 1024, 1072, 1150, 1440 y 1920 px. Los fallos reales
  se corrigieron: textos sobre colores de tarjeta, botones naranja, franjas de la carta de pesos, la firma y el texto
  vertical fijos de Nada Corriente y las tarjetas inactivas del carrusel de Trocha. Lo que queda son elementos medidos a
  media animación de `Reveal` o del glitch de Grano, revisados en captura.
- `qa:visual-text` en las mismas portadas y anchos.
- Capturas a 1440 y 390 px de cada portada y de una página de flujo: sin errores de consola ni desbordes.
- Medida final del repo: pendiente de cerrar en el registro de la tarea.

## 8. Pendiente

- Imágenes definitivas: `docs/encargo-imagenes-inspiraciones-5.md` (92) para Codex; después, volver a medir los pares.
- Que la sonda acepte avisos de cookies.
- Una guía de color pleno si aparece una segunda fuente de la familia de Neue Montreal.
