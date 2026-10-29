---
titulo: Linde, consumidor limpio para el piloto de agentes
fecha: 2026-10-29
tipo: demo
estado: en curso
referencias: []
fichas: [docs/57-agentes.md, docs/evolucion-agentes/research-piloto.md]
ruta:
codigo: [examples/agent-pilot/app/page.tsx.txt, examples/agent-pilot/app/ui/booking.tsx.txt, scripts/test-agent-pilot.mts]
colores: [#ffffff, #1f1f1f, #963e13, #f5a490]
fuentes: [Cormorant Garamond, Manrope]
sector: [peluquería]
guia: [salón editorial claro]
tono: [cálido, editorial]
paleta: []
tipografia: []
patrones: []
movimiento: []
piezas: [GuideFrame, PricingSection, TeamSection, TestimonialSection, ImageReveal, OpeningHours, BookingFlow, AppointmentList, ActionBar]
piezas-nuevas: []
relacionados: [demo-hebra, herramienta-conocimiento-agentes]
---

## Concepto

Comprobar el .tgz de Trama sin depender del repo para imports, CSS, conocimiento o fuentes. Un salón ficticio con
portada, reserva y citas locales pone a prueba dirección editorial, APIs de datos/callbacks y estados de negocio.

## Qué se midió

Build Next 16.3.5/Turbopack del consumidor, carga efectiva de Manrope/Cormorant desde el paquete, tres rutas a 1440×900 y
390×844, errores de formulario, persistencia, .ics, reprogramación, colisión local, anulación, corte a 24 h, query inválida,
teclado y almacenamiento bloqueado. Axe sin violaciones WCAG2A/AA automáticas en estados iniciales; algunos contrastes
quedan como incompletos de la herramienta, no una certificación global.

## Qué se hizo

Plantilla reproducible en examples/agent-pilot; materialización dentro de .cache con dependencias y .next propios.
Ilustraciones SVG originales y copy ficticio. Se probó transpilePackages para transformar next/font y raíz de build propia.
Las evidencias y capturas regenerables quedan en .refs3d/agent-pilot y .refs3d/agent-research.

## Diferencias con la referencia

No se replica Hebra ni una web comercial: se usa la receta salon con otra marca y sin sus fotografías/estado/CSS propios.
El acento pastel pasa a superficie; tinta de acción y texto secundario se oscurecen localmente. Se retira un backdrop que
interfería con legibilidad; no se cambia la guía global.

## Aprendido

Los tokens inline de GuideFrame prevalecen ante una clase del mismo nodo: adaptar mediante style o una guía local.
OpeningHours recibe tramos con guion ASCII; otro separador producía NaN. Compilar fuentes no acredita su carga: se
comprobó el navegador. La reserva no es agenda real; el almacenamiento por instancia limita estados entre rutas.

## Siguiente

Conservar estos recorridos como regresión del paquete y separar sus resultados de la evaluación de agentes.
