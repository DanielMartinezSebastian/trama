---
titulo: Parla, idiomas que conectan — estudio de Preply y guía Aprendizaje cercano
fecha: 2026-11-01
tipo: demo
estado: hecho
referencias: [https://preply.com/]
fichas: [docs/estudio-preply.md]
ruta: /demo/th-parla
codigo: [components/landings/parla/ParlaLanding.tsx, components/landings/parla/parla.css, lib/ui/guides.ts]
colores: [#ffffff, #121117, #ff7aac, #c5b8f4, #f6f5f3]
fuentes: [Inter Tight, Inter]
sector: [academia]
guia: [aprendizaje cercano]
tono: [cercano, seguro]
paleta: [fondo claro, acento único saturado]
tipografia: [grotesca, titular grande]
patrones: [portada partida, equipo con fotos, preguntas frecuentes, reserva por persona]
movimiento: [hover de color]
piezas: [GuideFrame, Hero, Button, FeatureGrid, FAQSection, CTASection, Footer, Modal]
piezas-nuevas: []
relacionados: []
---

## Concepto

Una plataforma ficticia de clases de idiomas centrada en la conexión entre dos personas. Traduce la dirección visual de
Preply a una guía reutilizable de Trama: rosa, negro, titulares contundentes y retratos en una composición de videollamada.
La guía está en `/guias/cercano`; la demo permite filtrar profesores, guardar favoritos durante la visita y simular una clase.

## Qué se midió

Inspección con Chromium a 1440 y 390 px y sonda `refs:probe`. El original entregó dos variantes de portada en distintas
cargas; se registran sin atribuirlas a una causa no comprobada. Titular Platform 700 a 64/68 px, tracking −0,32 px;
rosa `#ff7aac`, tinta `#121117`; CTA de radio 8 px, transición de color de 0,22 s con curva `cubic-bezier(.22,1,.36,1)`.
La primera captura contiene el consentimiento de cookies; la inspección posterior lo cierra y separa sus mediciones.

## Qué se hizo

- Guía `cercano` registrada en `STYLE_GUIDES`, con excepciones justificadas de peso e interlineado.
- Demo compuesta con ocho piezas existentes; el buscador y la escena visual son composición propia.
- Idiomas, presupuesto, favoritos, vacío explicativo y reserva por objetivo y horario con validación nativa.
- Confirmación explícitamente simulada, sin pago, envío de datos ni persistencia.
- Menú móvil, foco visible, cierre por Escape, devolución del foco y respeto a movimiento reducido.

## Diferencias con la referencia

Es una interpretación, no una réplica: marca, textos, retratos y composición propios. Inter Tight e Inter sustituyen
Platform y Figtree; los pasos se simplifican y no se trasladan las cifras comerciales del original. Lila, menta y amarillo
se reservan para pequeños apoyos. No se reutilizan las imágenes ni el logotipo de Preply.

El par final queda próximo en 15 de 19 medidas. Las diferencias restantes son el ancho de lectura (31 frente a 22 em),
el margen de escritorio (64 frente a 80 px) y la longitud de página, más corta en Parla tanto en escritorio como en móvil.
No se presentan como una réplica exacta. Los datos de la guía y de la demo se incorporan a `components/site/guias/repo.json`
con fecha y origen propios, sin volver a medir ni reclasificar las páginas anteriores.

## Aprendido

El rosa funciona como una superficie extensa con texto negro, no como texto pequeño sobre blanco. La prueba del servicio
es la relación entre personas; una tarjeta de videollamada con dos retratos comunica mejor ese vínculo que un fondo abstracto.
El original cambia entre cargas: una captura y la extracción de texto no bastan para fijar su composición.

## Siguiente

La guía se puede aplicar con `GuideFrame guide="cercano" textContrast`. Para convertir Parla en un producto real harían falta
agenda, perfiles, identidad y pagos. Esta demo queda deliberadamente en simulación local.

## Comprobaciones

- `doctor --cine --browser`: correcto; avisos de recursos opcionales ausentes.
- Sonda de la guía en escritorio y móvil: 11/11 reglas, con las excepciones documentadas del original.
- Par Preply–Parla: 15/19 medidas próximas; informes en `.refs3d/pares/preply-parla/`.
- Contraste a 320, 390, 768 y 1440 px: cero violaciones. La etiqueta amarilla a 320 requiere revisión visual por
  solapamiento; usa tinta `#121117` sobre fondo opaco `#f8e48e`, con contraste superior a 14:1.
- Revisión de imágenes y desbordes a los cuatro anchos, filtros combinados, favoritos, vacío, validación de horario,
  confirmación, Escape, devolución de foco y movimiento reducido.
- Build de producción aislado en `.cache/parla-next`; smoke de demo y guía sin errores ni sombras oscuras.
- `npm run verify`: correcto, incluidos TypeScript, catálogo, pruebas de UI/agentes/cine, sombras e índice de 66 fichas.
- Los ejemplos de la hoja activan `textContrast`, destacan el precio con borde y usan tinta neutra para insignias y cinta;
  el rosa conserva su papel de superficie y borde.
- La hoja pasa contraste a 390 y 1440 px; sus casos incompletos por solapamiento de navegación se inspeccionaron en capturas
  específicas. Demo, guía y estudio público responden correctamente en producción; revisión final sin recursos fallidos.
