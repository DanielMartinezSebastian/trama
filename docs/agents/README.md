# Conocimiento de Trama — piloto salon

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./index.json).

- [guide: Salón editorial claro](./guides/salon.md)
- [recipe: Peluquería y color, estética](./recipes/salon.md)
- [component: ActionBar](./components/action-bar.md)
- [component: AppointmentList](./components/appointment-list.md)
- [component: ArticlesSection](./components/articles-section.md)
- [component: BeforeAfter](./components/before-after.md)
- [component: BookingFlow](./components/booking-flow.md)
- [component: Footer](./components/footer.md)
- [component: GuideFrame](./components/guide-frame.md)
- [component: ImageGallery](./components/image-gallery.md)
- [component: ImageReveal](./components/image-reveal.md)
- [component: MenuList](./components/menu-list.md)
- [component: NavBar](./components/navbar.md)
- [component: OpeningHours](./components/opening-hours.md)
- [component: PricingSection](./components/pricing-section.md)
- [component: ProductCard](./components/product-card.md)
- [component: SectionHeader](./components/section-header.md)
- [component: ShapeMosaic](./components/shape-mosaic.md)
- [component: TeamSection](./components/team-section.md)
- [component: TestimonialSection](./components/testimonial-section.md)

## validation

```json
{
  "publicTypes": "generated-from-source",
  "packageExamples": "not-certified-by-generation",
  "browserFlow": "not-certified-by-generation"
}
```

## scope

pilot

## Selección

| Tipo | ID | Uso |
| --- | --- | --- |
| guide | salon | Blanco y gris claro con un pastel cálido, serifa muy fina y texto grande y ligero; formas o fotos de trabajos como único adorno. |
| recipe | salon | Un salón que vende oficio y calma: el equipo y los trabajos son el producto. |
| component | action-bar | Llamar, WhatsApp, cómo llegar y la acción principal (reservar, pedir, pedir cita) fijos abajo en móvil, en la zona del pulgar: objetivos de 56 px, safe-area-inset-bottom y un hueco al final de la página para no tapar el… |
| component | appointment-list | Las citas guardadas por BookingFlow en este navegador, por fecha: añadir al calendario, cambiar de día y anular con confirmación |
| component | articles-section | Cabecera + artículos (BlogCard) en rejilla, destacado (el primero grande con imagen de fondo), lista o carrusel |
| component | before-after | Comparador de dos imágenes (o de dos contenidos cualesquiera): un corte que se arrastra, accesible como deslizador (flechas, Inicio, Fin), o un botón que alterna entre los dos (día/noche, apagado/encendido) |
| component | booking-flow | Reserva de cita en pasos (peluquería, barbería, estética, consulta): local si hay varios, servicio y profesional (o «me da igual»); día y hueco con DatePicker; datos con validación; y confirmación con «Añadir al… |
| component | footer | Marca, columnas de enlaces, redes y línea de copyright: el cierre habitual de cualquier landing. |
| component | guide-frame | Aplica una de las diecinueve guías de estilo (las ocho de las webs premiadas —lujo tranquilo, monocromo de agencia, técnico de producto, producto nocturno, acento eléctrico, rótulo cinético, editorial cálido, lúdico—,… |
| component | image-gallery | Ocho presentaciones de las mismas fotos: imagen grande con miniaturas, coverflow 3D, baraja, fundido, cubo, creativa, tira libre y mosaico de dos filas |
| component | image-reveal | Imagen que se abre con una máscara (clip-path) mientras se asienta de una ampliación a su tamaño |
| component | menu-list | Carta en HTML con secciones, precios con puntos guía, etiquetas, los 14 alérgenos del Reglamento UE 1169/2011 (abreviatura visible y nombre para el lector de pantalla), filtro «Sin gluten / sin leche…» que oculta lo que… |
| component | navbar | Barra de navegación completa: siete disposiciones (o piezas en el orden que quieras), seis formas de barra, submenús desplegables o mega menú con categorías, barra de búsqueda o paleta ⌘K, menú móvil propio, anuncio,… |
| component | opening-hours | «Abierto ahora · cierra a las 20:30» calculado en la zona horaria del negocio, con tramos partidos, días cerrados, festivos y aperturas especiales |
| component | pricing-section | Precios con datos tipados o texto, selector mensual/anual y condiciones visibles |
| component | product-card | Imagen con segunda imagen al pasar el puntero, etiqueta, título, material y precio |
| component | section-header | Sobretítulo, titular, subtítulo y regla decorativa; titular gigante y palabra de fondo opcionales. |
| component | shape-mosaic | Rejilla de círculos y cuadrados en tres tonos del acento, con foto dentro de algunas formas |
| component | team-section | Cabecera de sección + perfiles del equipo: foto con marco y tratamiento (o avatar de iniciales), biografía y enlace por persona para reservar con ella; en rejilla, carrusel o filas. |
| component | testimonial-section | Prueba social lista para pegar: cabecera, resumen de valoraciones (media con estrellas parciales, número y fuente enlazada, reparto por estrellas que filtra las citas) y las citas en rejilla o en slider, siempre a la… |

## requirements

```json
[
  "Abrir solo la guía, receta o piezas necesarias; las fichas enlazan declaraciones completas."
]
```

## Ejemplos

Sin ejemplo específico; consultar receta/guía y declaración completa.

## limitations

```json
[
  "Selección parcial: no es inventario completo del paquete.",
  "La generación no acredita instalación, descubrimiento del cliente ni recorrido. Los entornos/casos ensayados se documentan en la entrega; sin promesa universal de compatibilidad o ahorro."
]
```
