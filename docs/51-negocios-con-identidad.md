# Cuatro negocios, cuatro identidades

Revisión de Hebra, Esparta, Cadencia y Forja, 26 de octubre de 2026. Esta receta sustituye las direcciones visuales de los documentos 46 y 47; conserva sus flujos de reserva locales. Rama `feat/demos-peluqueria-gimnasio`, worktree `C:/COMPARTIDO/trama-cine`. Desarrollo existente: `http://localhost:3000`. Build y producción de comprobación: worktree independiente `C:/COMPARTIDO/trama-negocios-check`, puerto 3012.

## Investigación reproducible

Se consultaron las fuentes y el método de `06`, `07`, `13`, `15`, `16` y `35`: primero negocios comparables, después referencias transversales; observar composición, imagen, tipografía y acciones, sin copiar recursos ni marcas. `npx tsx scripts/refs-negocios.mts` visita las ocho webs oficiales, guarda capturas al entrar y al bajar, y registra respuesta HTTP, titulares, fuentes y canvas. Evidencia local en `.refs3d/negocios-reestudio/referencias/`. Un canvas detectado no identifica WebGPU ni justifica reproducirlo.

| Fuente consultada | Observación e interpretación aplicable |
| --- | --- |
| [Balls, ficha Awwwards](https://www.awwwards.com/sites/balls-barbershop) · [web](https://ballsbarbershop.com.ua/) | Oficio, trabajo fotografiado y datos del local. Esparta toma el contexto de barbería; lo combina con señalética de comercio y un ticket de servicio. No reutiliza ilustraciones ni fotos. |
| [Skulpt, ficha Awwwards](https://www.awwwards.com/sites/skulpt-fitness) · [web](https://www.skulptfitness.nl/) | Contraste entre titulares de gran escala, espacio y CTA. Forja combina escala deportiva con una hoja de sesión: cada capítulo explica qué sucede antes de ofrecer una clase. |
| [Tracksmith, ficha Awwwards](https://www.awwwards.com/sites/tracksmith) · [web](https://www.tracksmith.com/) | Deporte narrado desde la comunidad y fotografía editorial. Cadencia combina ese enfoque con un pequeño calendario de frecuencia elegida. La captura inicial contiene un aviso de cookies; no se infiere su flujo completo de alta. |
| [Alice Hair & Art](https://www.alicehairart.se/) | Distribución abierta de fotos de pelo, manos trabajando y retratos, con tipografía funcional. Hebra adopta variedad de escalas y relación entre oficio y resultado. |
| [Il Colorista](https://ilcolorista.salon/) | Composición asimétrica, serif y recortes de pelo. La captura de entrada incluye una transición: no se toma su bajo contraste como objetivo. Hebra mezcla composición editorial y una carta de servicios utilizable. |
| [Pangram Pangram](https://pangrampangram.com/) | Tipografía como contenido y grandes superficies editoriales. Hebra transforma Forma / Textura / Color en un índice navegable conectado a reservas. |
| [Bluetit](https://bluetitlondon.com/) | Marca y servicio de peluquería con identidad propia; referencia de categoría complementaria, sin trasladar su identidad literal. |
| [Lando Norris](https://landonorris.com/) | Referencia transversal de energía y escala. Se descarta introducir un objeto espectacular sin relación con el servicio. |

Las fichas de Awwwards se utilizan para localizar referencias; el reconocimiento de una web no prueba conversión ni eficacia comercial. Las fórmulas de esta tabla son decisiones de diseño propias, no afirmaciones de sus autores. No se copian código, fotografías ni modelos.

## Diferenciación verificable

| Demo | Composición y voz | Gesto propio | Precios |
| --- | --- | --- | --- |
| Hebra | Revista rosa/plum, collage de dos fotos, Instrument Serif con marca Syne; conversación sobre pelo y rutina | Índice tipográfico Forma / Textura / Color que conduce al servicio correspondiente | Carta editorial con duración, condiciones y reserva por servicio |
| Esparta | Navegación lateral azul tinta, fondo de papel, Archivo, fotos de máquina y barba; letrero de comercio | Contactos fotográficos y ticket del ritual; selector con precio y tiempo reales de la demo | Carta de pared sin tarjetas de suscripción |
| Cadencia | Club luminoso, verde y vino, Fraunces; entrenamiento cotidiano y compañía | Frecuencia 1/2/3 días que cambia la semana sugerida y el plan de partida | Tabla comparativa de clases, sala y acompañamiento |
| Forja | Cuaderno oscuro, Archivo y Mona Sans, fotografía de grupo en blanco y negro, naranja | Una sesión de 50 minutos explicada en tres capítulos con barra 3D | Lista horizontal de cuotas, condiciones y selección |

No se acepta diferenciar únicamente cambiando color, fuente o foto del mismo hero. Las cuatro entradas tienen otra jerarquía, composición, proporción de imagen y primera interacción. Las páginas operativas reutilizan los patrones probados del kit: seleccionar servicio, fecha, profesional, plaza o plan debe seguir siendo familiar.

## Auditoría e iteración

Primera evaluación: portadas demasiado intercambiables, una sola campaña repetida, iconografía militar que tapaba el oficio y controles 3D sin argumento comercial. Se retiraron las campañas antiguas y sus componentes sin uso.

Primera pasada: cuatro estructuras nuevas, ocho imágenes de oficio/comunidad y nuevas composiciones de precios de la librería. Segunda revisión visual en 1440 y 390 px: se corrigieron alineación de precios, reserva de espacio de la insignia, textos invertidos sobre fondos, encabezados duplicados y repetición de imágenes. Se añadieron cuatro escenas de color/local/recuperación; se retiraron los falsos avatares de iniciales. Equipo y disponibilidad siguen identificados como ficticios.

Otros indicadores evaluados: cifras de éxito sin evidencia, testimonios inventados, filas de iconos de relleno, CTA sin destino, fotos de culturistas ajenas al público, todas las tarifas en tres cajas idénticas y animación que interrumpe una decisión. No se utilizan como atajos de credibilidad. Los enlaces de cada gesto propio llegan a servicios, clases o planes efectivos de la demo.

## PricingSection como pieza del kit

Se amplía el componente existente, sin crear cuatro tablas privadas ni importar marcas al kit. `plans` mantiene el formato de texto del catálogo y admite `PricingPlan[]`. Nuevos campos: `id`, `meta`, `note`, `cta`, `href`. El resto del contrato y los layouts grid/joined/list/carousel se conserva.

```tsx
import PricingSection, { type PricingPlan } from "@/components/ui/PricingSection";

const services: PricingPlan[] = [
  { id: "corte", name: "Corte", price: "24 €", meta: "45 min",
    description: "Consulta, corte y acabado.", href: "/reservar?servicio=corte", cta: "Reservar" },
];
<PricingSection kicker="" title="La carta" subtitle="IVA incluido"
  layout="menu" variant="minimal" plans={services} footnote="Precio confirmado antes de empezar." />
```

`layout="comparison"` genera una tabla semántica con caption, encabezados de fila y columna y desplazamiento horizontal enfocable en móvil. `comparison` admite líneas `Prestación|valor plan 1|valor plan 2|…`; sin ellas compara las features. `caption` y `footnote` son configurables. Los botones respetan enlaces por plan o `onSelectPlan`, que añade el id opcional a los datos existentes. El pago anual muestra su total anual y no una equivalencia mensual inventada. `PricingCard` recibe `meta` para duración/frecuencia; alturas y acciones se alinean desde CSS de la librería.

Colores y radios mediante tokens; variantes existentes. Entradas de catálogo, ejemplos, README y export del tipo en el paquete actualizados. Prueba de datos y compatibilidad: `npx tsx scripts/pricing.test.mts`.

## Un uso concreto del 3D

Forja cuenta una sesión ilustrativa: aprender (10 min, barra vacía), trabajar (30 min, discos) y recuperar (10 min, descargar). Cada selección cambia postura/carga visual, explica una finalidad y enlaza a la clase correspondiente. No prescribe kilos. No hay despiece ni selector de carga por entretenimiento.

Es WebGL, no WebGPU: geometría procedural local, carga diferida y colores del tema. Con movimiento reducido o sin WebGL permanece una representación SVG con los mismos capítulos y enlaces. El usuario puede tomar la misma decisión sin el canvas. Las otras tres demos no necesitan escena 3D.

## Recursos y límites

Doce imágenes originales generadas, tres por marca: [briefs reproducibles y rutas](./52-prompts-negocios.md). WebP local; originales conservados fuera del repo. Registro en `lib/sites/generated-business-art.ts` y declaración pública en `/creditos`. No se presentan como resultados ni empleados reales.

Reservas, cambios, cancelaciones, lista de espera y planes funcionan mediante almacenamiento local independiente por marca. No hay backend, cobro, envío de correos ni reserva real. Exportar calendario sí genera un archivo local.

## Comprobaciones

`npm run verify`, `npm run pkg:build`, build aislado y smoke de las cuatro portadas. `negocios.test.mts` y `negocios-oscuros.test.mts` prueban reservas, cambios, persistencia, cancelación, calendario, planes y espera. `negocios-redesign.test.mts` recorre 20 rutas a 1440/390 px, verifica imágenes, un h1 y ausencia de desbordamiento; comprueba índice, frecuencia, precios, los tres estados WebGL y la alternativa sin movimiento. Capturas e informe en `.refs3d/negocios-reestudio/revision/` para revisión humana, además de las aserciones. El resultado final y la URL se registran en `docs/tareas/negocios-reestudio.md`.
