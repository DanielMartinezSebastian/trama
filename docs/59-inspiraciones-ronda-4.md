# 59 · Cuarta ronda de inspiraciones

> 03-11-2026. El usuario pide ocho inspiraciones más, sin parar hasta acabar, y que las imágenes de Codex se encarguen al
> final. Rama `feat/evolucion-agentes`, en su worktree, con el dev del usuario en el puerto 3000; los builds, en
> `trama-inspiraciones` (desacoplado al commit y de vuelta a su rama).

## 1. Criba

Lista viva de Awwwards (premios del día de agosto a noviembre de 2026 y categoría «Restaurant & Hotel»), cruzada con los
sectores que ya cubría la librería. Se capturaron 18 candidatas con Playwright (`.refs/ronda-4/`, fuera del repo) y se
eligieron ocho, una por sector nuevo y con estéticas lejos entre sí y de las anteriores.

| Slug | Marca propia | Referencia | Premio | Tipo de web | Firma | Flujo |
|---|---|---|---|---|---|---|
| `tierra-ancha` | Tierra Ancha | Tengile MalaMala Collection | Site of the Day | campamentos de safari | crema y oliva, serifa finísima en mayúsculas, collage de fauna que flota | planificar la estancia con presupuesto |
| `bocado` | Bocado | Délice | Mención de honor | restaurante y pizzería | bloques de color pleno, serifa blanda, platos en círculos bajo un arco | reservar mesa, pedido a domicilio, tarjeta regalo |
| `pausa` | Pausa | Odyssée | Site of the Day | clínica de medicina estética | marfil y azul tinta, duotono que recupera el color, sangrías | buscar por preocupación y reservar consulta |
| `solera` | Solera Arquitectura | LPAS | Site of the Day | estudio de arquitectura | paneles de color tierra por sector que se ensanchan | filtrar proyectos y escribir al estudio |
| `vencejo` | Vencejo | Spyker Cars | Site of the Day | deportivos hechos a mano | penumbra petróleo, condensada en mayúsculas, herencia en blanco y negro | configurador con el coche dibujado y boutique |
| `nacar` | Nácar | Moto | Site of the Day | tarjeta privada | piedra negra, tarjeta de acero en 3D, galería en profundidad, niebla de divisas | solicitar acceso con lista de espera |
| `nimbo` | Nimbo | Cerebrium | Site of the Day | infraestructura de IA | cinta de luz magenta, tarjetas blancas con datos vivos | calculadora de precio, código copiable, demo |
| `pleno` | PLENO | OFFF Forum | Site of the Day | semana de diseño | blanco y negro, fotos de escenario bajo un titular en serifa, logotipo de formas | agenda guardable y entradas |

Descartadas: Santioni Spirits (escena WebGL tras un aviso de edad que no se deja pasar sin navegador real), Colonia Zacamil y
CoMinVi (una sola pantalla con scroll secuestrado), Oimachi (otra agencia), White Desert (mismo sector que Tengile), Lingers,
Faith Ibiza, Agrumea y Palmo (menciones menores o fuera de servicio).

## 2. Guías

Ocho guías nuevas, de 37 a 45. Se añaden al final de las premiadas en `STYLE_GUIDES`.

| Guía | Sale de | Lo que la separa de las demás |
|---|---|---|
| `sabana` | Tierra Ancha | serifa de peso 300 en mayúsculas, crema y oliva, ritmo lento |
| `trattoria` | Bocado | colores plenos alternos, serifa blanda con cursiva, botones con filete |
| `clinica` | Pausa | serifa de libro también para el texto, etiquetas de 10 px, duotono |
| `terracota` | Solera | grotesca sin negritas y cinco colores tierra por línea de trabajo |
| `motor` | Vencejo | condensada en mayúsculas con +4 % de aire y botones con letra de 9 px |
| `obsidiana` | Nácar | negro piedra, grotesca 500 en mayúsculas, píldoras y radio 18 |
| `cinta` | Nimbo | grotesca 300 grande, mono en mayúsculas, radio 14 y datos en directo |
| `foro` | PLENO | serifa en mayúsculas centrada sobre foto, filetes negros, píldoras |

Las ocho pasan los once rangos con `refs:probe --guides --solo`. Una excepción nueva en `GUIDE_EXCEPTIONS`: el tracking de
`motor` (+4 %, medido en Spyker). Dos ajustes tras la primera medida: el `h2` de `sabana` sube de 1,6 a 2 rem (en el móvil
quedaba en 6,6 vw) y el peso de `motor` baja a 500, el medido.

## 3. Imágenes

101 imágenes en `docs/encargo-imagenes-inspiraciones-4.md` (y `.json`), generado por `.refs/encargo4.py` a partir de la lista
de cada web. Mientras tanto, cada archivo fue un recorte de una foto del repo al tamaño exacto.

Codex las entregó el 03-11-2026 (commit `3c90d6c`): las 101, en WebP al tamaño exacto y por debajo de 300 KB. Rehízo nueve
(letras en neumáticos, caracteres inventados en un vidrio, un segundo coche al fondo, recortes que cortaban caras o manos en
móvil). Revisadas en hoja de contacto y en las portadas: cada web mantiene una sola sesión de fotos (Vencejo, el mismo coupé
verde en todas; PLENO, retratos en blanco y negro).

Las fotos reales destaparon tres fallos de la réplica, ya corregidos:

- **Pausa**: la cabecera de la portada iba en blanco sobre la foto, que ahora es clara. En escritorio pasa a azul tinta; en
  móvil, donde caía sobre el pelo, tiene fondo propio.
- **Vencejo**: con interlineado 0,88, la tilde de «CAPÍTULO» y «MÁS» tocaba la línea de arriba; sube a 0,96. El titular de la
  portada tocaba los bordes en móvil: margen lateral y 2,4 rem de mínimo.
- **Solera**: la foto del estudio es más luminosa; el oscurecido baja de 0,82 a 0,68 para que se lean los textos de 12 px.

## 4. Pares

`refs:probe --par <original> <réplica>` el 03-11-2026, con fotos provisionales:

| Web | Medidas cerca | Largo de la portada (pantallas) |
|---|---|---|
| Tierra Ancha | 11/20 | 12,8 → 7,3 |
| Bocado | 7/19 | 16 → 6,9 |
| Pausa | 8/14 | 10,1 → 5,7 |
| Solera | 8/20 | 10,4 → 4,6 |
| Vencejo | 8/14 | 10,6 → 5,9 |
| Nácar | 12/20 | 13,3 → 9 |
| Nimbo | 11/19 | 12,1 → 6 |
| PLENO | 10/16 | 1,6 → 3,3 |

Como en la ronda 3, la diferencia que más se repite es el largo: las portadas miden de 3 a 9 pantallas y las originales, de 10 a 16. PLENO es la excepción: OFFF es una página de 1,6 pantallas y la réplica añade ponentes, los dos eventos y el programa. Las fotos provisionales no cuentan en la medida de estilo, pero sí en el color de las superficies.

## 5. Recetas

Ocho recetas nuevas en `lib/catalog/sectores.ts`: safari, restaurante, clínica, arquitectura, automoción, tarjeta,
software y conferencia, cada una con su guía, secciones con piezas del kit, llamada y lo que no hay que olvidar.

## 6. Aprendido

- Una marca inventada a partir de un logotipo geométrico se acerca demasiado al original sin querer: el primer logotipo de
  PLENO (círculo y barras) se leía como «OFFF» y se cambió por círculo, cuadrado, triángulo y píldora.
- El texto blanco sobre una foto se decide con la foto definitiva: un recorte provisional oscuro escondió que la portada de
  Pausa no se leía con la imagen real.
- Las condensadas en mayúsculas con interlineado por debajo de 0,95 chocan en español: las tildes de las mayúsculas suben.
- Las páginas claras dentro de una web oscura tienen que redefinir los tokens, no solo el color: las piezas del kit (BriefFlow)
  leen `--fg` y `--bg`, y en Nimbo salían con botones invisibles.
- El rojo de Délice (#de2b2b) no llega a 4,5:1 con texto crema; Bocado usa #cc2629.

## 7. Comprobaciones

- `verify` y `build` sin errores; `smoke` en las ocho portadas, sin errores de consola ni sombras.
- Recorrido de cada web en escritorio y móvil (portada y tres o cuatro páginas internas): todas responden 200 y ninguna desborda.
- Flujos de punta a punta en el navegador: planificar estancia, reservar mesa, pedido a domicilio, tarjeta regalo,
  preocupación y consulta, filtro de proyectos, configurador (485.000 € → 515.200 € con marfil, turbina y maletas), bolsa
  y pedido, solicitud de acceso, calculadora de GPU, copiar código, agenda que sobrevive a recargar y compra de entradas.
- Menús móviles de las ocho a 390 px: abren, cierran con `Esc` y no desbordan. Arreglo en la librería: la isla de
  `FullscreenMenu` tomaba `--r` del tema como radio y, con un tema de píldoras (999 px), salía circular; ahora tiene tope de 28 px.
- `refs:probe --repo`: 83 páginas repartidas entre 31 guías; 28 por debajo de 0,25 de afinidad; Quilate sigue sin poder medirse.
  Tierra Ancha cae más cerca de `lujo` (0,66) que de `sabana`: comparten crema y serifa fina.

## 8. Pendiente

- Alargar las portadas hacia el largo de las originales, la diferencia que más se repite en los pares.
