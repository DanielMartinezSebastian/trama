---
titulo: Conocimiento generado y selectivo para agentes
fecha: 2026-10-29
tipo: herramienta
estado: hecho
referencias: []
fichas: [docs/evolucion-agentes/p1-contrato-piloto.md]
ruta:
codigo: [scripts/agent-knowledge.mts, scripts/package-surface.mts, scripts/check-agent-package.mts]
colores: []
fuentes: []
sector: [peluquería]
guia: [salón editorial claro]
tono: []
paleta: []
tipografia: []
patrones: []
movimiento: []
piezas: [GuideFrame, BookingFlow, AppointmentList]
piezas-nuevas: []
relacionados: [herramienta-cuaderno, demo-hebra, replica-matiz]
---

## Concepto

Derivar un índice pequeño y fichas de diseño/composición/API desde las fuentes actuales, sin crear otro catálogo manual.
La primera selección usa la receta y guía salon, y distingue interfaz de reserva local de servicios conectados.

## Qué se midió

Generación determinista, enlaces, selección inválida, tipos de objetos/callbacks y exports reales del paquete construido.
Tres ejemplos de estilo, reserva/lista y fuentes compilados; cierre de declaraciones comparado con el paquete.
No se ha medido ahorro de tokens/tiempo ni probado el recorrido visual de un consumidor.

## Qué se hizo

`npm run catalog` genera `docs/agents/`: índice, guía, receta, 18 piezas, declaraciones transitivas y fixtures de consumo.
`catalog:check` detecta deriva y salidas extra; `agents:test` prueba contrato/fallos; `agents:check-package` contrasta
ejemplos y tipos con el paquete construido. Exports compartidos con el empaquetador. Las props de muestra title/lead de
GuideFrame se marcan como controles del visor y el snippet se genera con hijos reales, sin cambiar la API del componente.

## Diferencias con la referencia

No es una réplica visual. Hebra solo aporta contexto de negocio: sus tokens, CSS y reserva propios no prueban esta selección.
Sin skills, distribución de knowledge en npm ni instalación limpia aún.

## Aprendido

Los controles del visor no son firmas: services/staff/onBooked requieren declaraciones completas y su cierre de tipos.
Las salidas de compilación deben quedar fuera del typecheck del sitio; el contrato público debe compartirse con el empaquetador.
La procedencia conserva la foto de generación mientras contenido y hashes sean iguales, evitando deriva por commits ajenos.

## Siguiente

P2: distribuir knowledge desde estas salidas, instalar un .tgz exacto en consumidor limpio y comprobar CSS/fuentes y recorrido.
