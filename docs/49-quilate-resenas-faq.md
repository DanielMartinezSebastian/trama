# Quilate: reseñas y preguntas frecuentes

Revisión de interfaz en `/sitios/quilate`, continuando la mejora de los paneles de servicios. No incluye un análisis nuevo de la escena 3D.

## Reseñas

La presentación anterior consistía en tarjetas rígidas, texto de cuerpo y avatares de iniciales cuyo borde dependía de la variante. Se añadieron tres tratamientos a `Testimonial` y `TestimonialSection`, independientes del tema:

- `presentation="card"`: superficie habitual de la variante.
- `presentation="soft"`: contorno discreto, esquinas suaves y mayor espacio interior.
- `presentation="plain"`: cita abierta sin caja.

Los retratos reutilizan `Avatar`, con tamaños `sm`, `md` y `lg`, carga diferida y respaldo de iniciales cuando falla la imagen. `avatarShape="circle"` activa el retrato circular; el valor predeterminado `theme` conserva la forma anterior del avatar y su markup de iniciales. `Testimonial` acepta `avatarSrc`; la sección conserva su formato de texto y añade una quinta columna opcional: `cita|autor|rol|estrellas|URL de avatar`. Los datos antiguos siguen siendo válidos.

Quilate usa `soft`, retratos grandes y la tipografía de titulares para las citas. Las fotos de ejemplo reutilizan los recursos de retratos existentes del repositorio. Los colores siguen procediendo de los tokens del tema. Los fondos explícitos (`fill`) continúan funcionando con los tratamientos.

## FAQ

La sección anterior centraba una columna de acordeón de 520 px y las respuestas heredaban el centrado. Ahora `FAQSection` ofrece `layout="stack"|"split"`, presentación `cards` o `lines`, `answerAlign` y `defaultOpen`.

En Quilate, la cabecera ocupa la columna izquierda y las preguntas la derecha en escritorio; se apilan hasta 800 px. Las respuestas se alinean a la izquierda, la longitud de lectura se limita a 65 caracteres y en móvil se aprovecha el ancho disponible. Solo una respuesta se abre a la vez.

En presentación de líneas, el acordeón llena su contenedor; en tarjetas conserva el máximo anterior de 520 px. Enlaza botones y paneles mediante identificadores únicos, oculta los paneles cerrados a tecnologías de asistencia y añade navegación con flechas, Home y End. Enter y Espacio conservan el comportamiento nativo del botón. Las transiciones respetan la preferencia de movimiento reducido.

## Compatibilidad

Las nuevas opciones son optativas. Los valores predeterminados conservan la tarjeta de la variante, el avatar de iniciales anterior, la cabecera encima del FAQ, el ancho del acordeón y la alineación heredada de las respuestas (`answerAlign="inherit"`). Quilate activa explícitamente la superficie suave, retratos circulares, composición lateral, líneas y alineación izquierda. La recuperación de iniciales si falla una imagen y las mejoras de teclado se aplican sin cambiar el aspecto de los usos anteriores.

## Comprobaciones

Se revisaron las fotos, su forma circular y la ausencia de desbordamiento horizontal en escritorio y móvil. La prueba de error de imagen mostró las iniciales del autor. Se comprobaron Home, End, desplazamiento de foco, apertura y cierre con Enter y Espacio, la exclusividad de la respuesta abierta y las asociaciones ARIA.

Los controles del catálogo cambiaron correctamente entre `card`, `soft` y `plain`. Las capturas están en `.refs3d/quilate/reviews-*.png` y `faq-*.png`; los scripts locales de comprobación también están en esa carpeta ignorada por Git.
