---
titulo: Semilla, memoria articulada de NÁDIR
fecha: 2026-10-28
tipo: concepto
estado: hecho
referencias: []
fichas: []
ruta: /sitios/nadir
codigo: [components/sites/nadir/seed-model.ts, components/sites/nadir/Scene.tsx, scripts/gen-nadir-semilla.mts]
colores: [#071923, #123442, #e8b693, #b3ebdf]
fuentes: [Archivo, Instrument Sans, IBM Plex Mono]
sector: []
guia: []
tono: []
paleta: [fondo oscuro]
tipografia: []
patrones: [relato por scroll]
movimiento: [cámara coreografiada]
piezas: [ScrollProgress, Hero, Button, Footer, SmoothScroll]
piezas-nuevas: []
relacionados: []
---

## Concepto

Sustituir el mecanismo de anillos de NÁDIR por la Semilla del concept art: una cápsula mineral que protege una memoria de agua y luz. Seis valvas se abren durante El descenso y revelan sus nervaduras de cobre, el collar y la ampolla central.

## Qué se midió

Encuadres: en escritorio 1440×1000 la escala del modelo pasa de 0,797 a 1,823 (2,29×), y la altura proyectada del núcleo de 26% a 55% del viewport. Pruebas de macro, centro, lectura, móvil y movimiento reducido; 24 encuadres revisados distinguiendo generales completos de detalles recortados. Evidencias en .refs3d/nadir/escala/.

Ampliación de mecánica y luz: 324 estados de apertura/despiece; sectores exclusivos para valvas, nervaduras y bisagras; holgura mínima del collar 0,138 unidades y máxima longitud del actuador 1,426. Envolvente del núcleo libre. Ciclo de 26 s con pausa abierta de 6 s y bandas de apertura sin solapamiento entre URLs. Prueba de navegador con reloj de cine: pausa estable, apertura progresiva, luz con sombras y regreso por historial.

Pruebas del casco macizo: cada arista pertenece a dos triángulos, volumen positivo, normales y UV finitos. Rig reversible, superficies diferentes entre valvas, GLB poblado con 28 mapas y dos clips completos. Pruebas de navegador: 24 encuadres medidos proyectando todos los vértices de Semilla, traslado, zoom, despiece, canvas persistente e historial; audio, mensaje, diario, entrada directa a los capítulos y anchuras 320–1920. Sin errores JavaScript.

## Qué se hizo

Scroll con inercia: SmoothScroll del kit en el marco de Nadir, feel cinematic como Quilate y syncGsap false para compartir el reloj RAF del relato sin cargar ScrollTrigger. El botón de entrada usa scrollToAnchor, con cabecera descontada y foco accesible. La instancia se renueva por URL y el nuevo capítulo arranca arriba sin arrastrar la rueda anterior; los enlaces con fragmento en la carga inicial se conservan. El componente mantiene scroll nativo en táctil y con movimiento reducido. Prueba de navegador con rueda real, ancla, navegación durante inercia y canvas persistente; informe en .refs3d/nadir/lenis/.

Movimiento de reposo: giro angular lento y acotado, con entrada suave tras detener el scroll y amplitud menor en macros. Seguimiento amortiguado del ratón mediante eventos de ventana, incluidos los que pasan sobre el texto; vuelve al centro al salir o perder foco. No responde a gestos táctiles y conserva la alternativa estática con movimiento reducido. Prueba con reloj de cine: giro en reposo, inercia en ambos ejes y núcleo anclado al mismo punto del macro. Evidencias en .refs3d/nadir/reposo/.

Ampliación de encuadres, inspirada en Quilate: lectura de sus BEATS (generales, macro, centro) y de su cámara que enfoca piedra, grabado y pavé; revisión visual de portada y pasos 4, 8 y 11 en localhost:3020/sitios/quilate. Nadir incorpora seed-framing.ts, planos generales mayores medidos con cajas de las piezas reales, macro del núcleo y grandes interludios centrales. Se permite recorte intencional de valvas en detalles, manteniendo el núcleo dentro del cuadro. Una máscara suave del lienzo protege la columna de lectura; en móvil se centra el núcleo sobre el texto y se corrige el ángulo para evitar que lo tape una valva.

Ampliación de coreografía y óptica: cuatro poses mantenidas por capítulo con despieces distintos (hasta 0,90), elevación del núcleo, inclinación y energía. Las entradas a registros disparan una descarga con ataque de 0,24 s y cola hasta 2,4 s; señales autónomas cada 18 s y descarga especial al revelar el mensaje. Lens flare WebGL con oclusión de Three.js, halo, haz horizontal y reflejos, generado sin imágenes externas. Se preserva el alfa del lienzo para evitar halos oscuros sobre la atmósfera CSS. Capturas exactas muestran un pico de intensidad de 125 frente a un reposo cercano a 22.

Se corrigió el sentido del giro, que antes hacía pasar las valvas por el centro. Las bisagras ahora están en radio 0,32 y Y −2,75. El collar baja antes de extraer y girar; seis actuadores muestran la unión con el bastidor. Nueva luz puntual dentro de la ampolla, sombras, filamentos emisivos y halo ocluido. GLB y planos actualizados con luz, potencia emisiva y clips a 30 fps. La primera URL entreabre, la segunda abre el interior y la tercera conserva la apertura máxima.

Constructor compartido entre escena, exportación GLB y planos. Seis cascos con caras interiores/exteriores y canto, seis conjuntos de nervaduras, doce segmentos de collar, bastidor, ampolla, filamentos y puntos de memoria. Texturas procedurales individuales para mineral y cobre de cada valva. Apertura radial y despiece independientes, conservando el muestreo de cámara y el scroll existentes. Nueva alternativa SVG cerrada/abierta para movimiento reducido y ausencia de WebGL.

Entregables en `public/models/nadir-semilla/`: GLB, 28 PNG de superficies, manifiesto y tres láminas en SVG/PNG, además de README con jerarquía, pivotes, UV y regeneración.

## Diferencias con la referencia

La pintura se interpreta como seis valvas repetibles con geometría curva cerrada, en lugar de calcar irregularidades sin volumen definido. El modelo utiliza texturas propias deterministas y nervaduras físicas; la imagen no se proyecta sobre el objeto. La ampolla incorpora filamentos y memorias luminosas. El GLB incluye color/metallic-roughness; el bump queda disponible en el canal R de los mapas para su configuración en Blender.

## Aprendido

Generar los planos desde la misma geometría evita discrepancias entre esquema, volumen y pivotes. El brillo de material no ilumina otras superficies: hace falta una luz real. El orden collar → extracción → giro, la dirección de las bisagras y los sectores exclusivos evitan interferencias; se verifican con geometría, no solo mirando capturas. La apertura debe depender del capítulo y del avance narrativo, mientras que el despiece de transición conserva su propio control reversible. Medir todos los vértices de las piezas evita aprobar encuadres comprobando únicamente el collar.

## Siguiente

Modelo integrado y editable. Para cambiar proporciones o superficies, modificar el constructor y regenerar los entregables. La demo conserva el mensaje final y la navegación preexistentes.
