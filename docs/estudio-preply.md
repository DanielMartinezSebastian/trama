# Preply → Aprendizaje cercano → Parla

Inspección del 1 de noviembre de 2026 de [Preply](https://preply.com/). Resultado: guía
[`cercano`](/guias/cercano) y demo [`Parla`](/demo/th-parla), integradas en las galerías de Trama.

## Lectura de la referencia

La portada ofrece una acción principal: encontrar un profesor. A continuación aparecen cifras de confianza, acceso por
idioma, evidencia del aprendizaje, explicación en tres pasos, garantía, captación de profesores y formación para empresas.
El pie oscuro concentra la navegación de soporte y los directorios. La jerarquía permite pasar de la promesa al catálogo
sin tener que leer la página entera.

Chromium recibió dos portadas en cargas separadas: una escena de conversación con indicadores de progreso y otra con
retratos superpuestos. No se ha comprobado si la variación responde a un experimento, localización u otra condición.
Las dos conservan rosa vivo, titulares negros, retratos y un CTA oscuro. La extracción web de texto devolvió la primera
variante; las medidas sin consentimiento de cookies corresponden a la segunda. No se mezclan como una única medición.

## Medidas y traducción

| Decisión | Preply observado | Guía de Trama |
|---|---|---|
| Superficies | Blanco, rosa `#ff7aac`, negro `#121117` | Se conservan como base, acento y tinta |
| Titular principal | Platform 700, 64/68 px, tracking −0,32 px a 1440 | Inter Tight 700, hasta 64 px, interlineado 1,0625 |
| Tipografía de lectura | Figtree en la sonda | Inter de la biblioteca de fuentes |
| Grandes llamadas de sección | Platform 700, hasta 96/96 px | Se moderan para la demo y las composiciones genéricas |
| Botón de portada | Negro y texto blanco, radio 8 px | Negro y blanco, rectángulo de 6–8 px |
| Hover | Colores, 0,22 s, `cubic-bezier(.22,1,.36,1)` | Misma duración y curva; desplazamiento de 2 px en CTA |
| Fotografía | Personas aprendiendo y tutores | Retratos locales, conversación con dos interlocutores |
| Movimiento | DOM sin canvas o vídeo en el momento inspeccionado | DOM/CSS, sin animación ambiental; modo reducido |

El negro sobre rosa tiene contraste holgado para texto. El rosa sobre blanco no sirve para texto normal: el acento se usa
como superficie con tinta negra. Los apoyos lila `#c5b8f4`, menta `#bce5d4` y amarillo `#f8e48e` son decisiones de Parla,
no mediciones atribuidas a Preply. Todos los colores de la demo se consumen mediante tokens.

```tsx
import GuideFrame from "@/components/ui/GuideFrame";

<GuideFrame guide="cercano" textContrast>
  <h1 className="ui-g-h1">Aprende con alguien que te entiende.</h1>
  <p className="ui-g-body">Un idioma nuevo, una conversación cada vez.</p>
</GuideFrame>
```

## Firma y límites

La firma reutilizable une una superficie rosa extensa, frase en minúsculas de peso fuerte, CTA negro y un encuentro
entre dos personas. Las tarjetas son contenidas, de radios pequeños, con información legible y acciones claras.
La adaptación se aleja deliberadamente de la serifa editorial, los degradados y el movimiento ornamental.

Parla sirve para descubrir un profesor y preparar una clase: filtros de idioma y presupuesto, favoritos de sesión,
estado vacío, elección de objetivo y horario, validación y confirmación. No hay backend, pago, cuenta ni calendario real.
Los perfiles, precios y reseñas son ficticios y se indican como tales junto al catálogo.

## Imágenes

- Retrato principal: [Michael Starkie, Unsplash](https://unsplash.com/photos/a-woman-with-long-curly-hair-smiling-YOpW7lvK794), descargado en `public/img/parla/conversation.jpg`.
- Segundo retrato: [imagen de Unsplash](https://images.unsplash.com/photo-1500648767791-00dcc994a43e), `public/img/parla/james.jpg` (identificador de imagen `photo-1500648767791-00dcc994a43e`).
- Clara y Marco reutilizan recursos locales ya presentes en `public/img/inspiraciones/ahora/`; sus nombres y perfiles en Parla son ficticios.
- Ningún recurso visual de Preply se distribuye en la demo.

## Evidencias locales

Las capturas e informes se guardan en `.refs3d/`, ignorado por Git:

- `preply/original/`: primera sonda, con consentimiento visible; no usar su paleta por superficie como medida limpia.
- `preply/inspection/`: extracción y capturas con el consentimiento cerrado.
- `preply/guia/`: medición de la guía en escritorio y móvil.
- `pares/preply-parla/`: comparación cuantitativa, informativa porque la demo no busca igualdad visual.
- `preply/`: capturas de escritorio, móvil, diálogo y revisión de interacciones.

La ficha enlazada en el cuaderno conserva el resultado y las verificaciones finales.

El par final queda próximo en 15 de 19 medidas. Las cuatro diferencias son ancho de lectura (22 → 31 em), margen de
escritorio (80 → 64 px) y longitud de página en escritorio y móvil. La demo conserva la jerarquía y los colores, con menos
secciones que el original. La guía cumple 11/11 reglas de la sonda con sus excepciones de peso e interlineado.

En producción se consulta este estudio en `/docs/preply`. El cuaderno `/lab/cuaderno/demo-parla` se consulta únicamente
en desarrollo, como el resto del laboratorio. Para aislar la salida de un servidor ajeno, `next.config.ts` acepta
`TRAMA_DIST_DIR`; en este ejercicio se usa `.cache/parla-next` y el puerto 3461.
