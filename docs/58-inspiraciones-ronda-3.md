# 58 · Tercera ronda de inspiraciones y guías más distintas

> 02-11-2026. El usuario pide más variedad en las guías de estilo («que difieran mucho entre sí»), que las últimas webs
> inspiradas estén representadas en ellas y al menos 10 inspiraciones más (mínimo 8 clones de sitios premiados) para cubrir
> más tipos de web. Rama `feat/inspiraciones-3`, worktree `C:/COMPARTIDO/trama-inspiraciones`, puerto 3040.

## 0. Diagnóstico

- 20 guías, pero 13 caen en dos familias: negro con condensada, y claro con serifa o grotesca.
- Ningún fondo de color pleno salvo rosa empolvado y ciruela.
- Ninguna guía nace de SONDA, Polaris, Rizo, Umbral, Bruma o La Tramoya.
- Las 18 inspiraciones solo cubren seis sectores: peluquería, gimnasio, academia, producto, agencia y estudio creativo.

## 1. Criba

Lista viva de Awwwards (SOTD de agosto a noviembre de 2026), cruzada con docs/06–16 y docs/50. Se capturaron 31 candidatas
y se eligieron 10 por distancia de sector y de estética.

| Slug | Marca propia | Referencia | Tipo de web | Firma | Flujo |
|---|---|---|---|---|---|
| `polilla` | Polilla | Aardvark Book Club | club de lectura por suscripción | amarillo con manchas orgánicas, ultranegra, libros 3D que caen | elegir libros, caja y alta |
| `sesion-doble` | Sesión Doble | A24 (concepto de Ravi Klaassens) | distribuidora de cine | discos 3D que giran y se deslizan, ficha técnica, críticas con estrellas | catálogo, filtro y entradas |
| `casa-melosa` | Casa Melosa | House of Honey | interiorismo | rosa, ultranegra con cursiva caligráfica entre palabras | proyectos, tienda de objetos y encargo |
| `marejada` | Marejada | Seasats | robótica marina | columna de menú como degradado de color, serifa fina sobre mar | comparador y pedir demostración |
| `alba` | Alba Residencia | ERA Residence | promoción residencial | burdeos, didona, caligrafía gigante de fondo, marco biselado | selector de viviendas y visita |
| `no-mires-abajo` | No mires abajo | Don't Look Up | videojuego de navegador | tinta a mano, sátira de gestión incremental | la partida entera |
| `cantera` | Cantera | Aspen Search | selección de personal | mosaico de baldosas, semitono, relojes por ciudad | ofertas y candidatura |
| `ultramar` | Ultramar | United Carriers | logística | globo de puntos con rutas, cifras gigantes | seguimiento de envío y presupuesto |
| `zanco` | Zanco | Noho | mueble y tienda | catálogo de color, fichas con variantes, premios | tienda completa |
| `pulso-lento` | Pulso Lento | Paul Kalkbrenner | música | blanco suizo, foto dentro del nombre, disco, gira | escucha, gira y entradas |

## 2. Guías nuevas

17 guías, de 20 a 37 contando `cercano` en la otra rama. Se insertan tras `marca` en `STYLE_GUIDES`.

| Guía | Sale de | Lo que la separa de las demás |
|---|---|---|
| `manchas` | Polilla | fondo amarillo pleno, formas orgánicas, ultranegra, manuscrita |
| `filmoteca` | Sesión Doble | gris plata, didona apretada en mayúsculas |
| `goloso` | Casa Melosa | rosa y chocolate alternos, ultranegra con caligráfica |
| `sereno` | Marejada | tarjeta y columna de color, serifa fina clara |
| `burdeos` | Alba | fondo burdeos, didona, caligrafía fantasma, marco biselado |
| `tinta` | No mires abajo | papel y tinta, gorda de cómic, manuscrita, sombra de viñeta |
| `baldosa` | Cantera | sin aire entre bloques, filetes, semitono, menta |
| `orbital` | Ultramar | negro espacial, extendida en mayúsculas |
| `catalogo` | Zanco | beige con objetos de color, 600 apretada |
| `cartel` | Pulso Lento | blanco, 700 con interlineado cerrado, bloques planos |
| `mineral` | SONDA Materia | gris mineral y verde bosque |
| `ambar` | SONDA Ritual | negro cálido y ámbar, serifa lenta |
| `glaciar` | Polaris | azul glaciar, cursiva y mono |
| `ilustrado` | Inés Bruma | papel con tintas planas, serifa expresiva |
| `senal` | Rizo | papel mineral, azul eléctrico, lima |
| `festival` | Umbral | rosa pastel, azul real, etiquetas en píxel |
| `varietes` | La Tramoya | crema, rojo telón, letra de cartel |

Las 17 pasan los once rangos con `refs:probe --guides`. Excepciones nuevas, con su medida en `GUIDE_EXCEPTIONS`: peso en `orbital`, `catalogo` y `cartel`; interlineado en `orbital`; sombras en `tinta` y `festival`.

SONDA Esencial no tiene guía propia: su editorial neutra cae en `papel`.

## 3. Imágenes

No hay generación de imágenes en esta sesión. Las páginas funcionan con provisionales recortadas de fotos del repo y `docs/encargo-imagenes-inspiraciones-3.md` pide 66 imágenes a Codex.

Polilla, No mires abajo y Cantera no necesitan fotos: sus visuales son CSS, lienzo o semitono. Zanco solo pide tres.

## 4. Pares medidos

`refs:probe --par` del 02-11-2026, antes de activar el scroll suave en ocho de ellas.

| Inspiración | Cerca | Lo que queda lejos |
|---|---|---|
| Polilla | 8/14 | largo de página, sombras, cuerpo |
| Sesión Doble | 10/14 | sombras, hover |
| Casa Melosa | 7/17 | titular (la original lo tiene en SVG y no se mide igual), largo |
| Marejada | 10/14 | largo de página, hover |
| Alba | 7/19 | largo de página, márgenes, medida del texto |
| No mires abajo | 8/12 | cuerpo, familias, hover |
| Cantera | 11/20 | largo de página, tracking, medida |
| Ultramar | 13/20 | largo de página, cuerpo, hover |
| Zanco | 10/16 | largo de página, titular móvil |
| Pulso Lento | 12/20 | largo de página, titular, hover |

**La diferencia sistemática es el largo**: las originales miden de 10 a 38 pantallas y las réplicas de 3 a 7. Las portadas resumen; el contenido restante está repartido por las páginas internas.

## 5. Recetas

Diez recetas nuevas en `lib/catalog/sectores.ts`: suscripción, catálogo cultural, interiorismo, hardware, promoción, juego de navegador, selección, logística, tienda de diseño y música.

## 6. Aprendido

- `.x a { color: inherit }` gana a `.x-boton` por especificidad: se usa `:where(.x) a`.
- `FullscreenMenu className` va al panel, no al botón: para ocultarlo en escritorio hay que envolverlo.
- `Parallax` mueve su propio nodo: el recorte va en un contenedor por fuera.
- Un primer pedido a una ruta recién registrada puede dar 404 mientras Next recompila.
- Un juego incremental necesita coste creciente: si no, una decisión barata anula la tensión.
- Candidatas al kit si se repiten: selector de unidades de Alba y comparador de Marejada.

## 7. Comprobaciones

- `npm run verify` pasa y `npm run build` termina sin errores.
- `smoke --auditar` en las 122 páginas de las diez: sin errores de consola ni sombras prohibidas.
  - Avisos descartados: las puertas de Alba estaban desactivadas por el filtro «Solo libres» que el auditor acababa de pulsar (probado a mano); el botón del reproductor lo tapaba el distintivo de `next dev` (en producción no aparece).
  - Aviso corregido: «Escuchar» ahora dice «Sonando» si ese disco ya suena.
- Flujos probados en producción: color y bolsa de Zanco, caja de Polilla, compra y rueda de Sesión Doble, seguimiento de Ultramar con código bueno y malo, validación de la visita de Alba, reproductor que sigue sonando al navegar en Pulso Lento y las dos formas de acabar de No mires abajo.
- `refs:probe --repo`: 72 páginas medidas, con 23 guías como la más afín de alguna página. 25 siguen por debajo de 0,25. Quilate sigue sin poder medirse (`Target crashed`).

## 8. Pendiente

- Encargo de 66 imágenes a Codex (§3) y revisión posterior.
- Volver a medir los pares con las fotos reales. Con scroll suave, 02-11-2026: entre 8/19 (Alba) y 14/20 (Ultramar).
- Decidir si las portadas crecen hacia el largo de las originales.

Integrada en `feat/evolucion-agentes` el 02-11-2026 (5137d15), con la guía `cercano`: 37 guías. `proyectos/` sigue sin commit.
