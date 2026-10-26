# Encargo para Codex: imágenes para reformar Hebra, Esparta, Cadencia y Forja

> 26-10-2026, de la sesión de Claude (rama `feat/cine-captura`, worktree `trama-estudios`). Las reformas salen de los
> estudios de docs/50 §3.3 (peluquería) y §3.5 (gimnasio). Claude toca el código; Codex genera solo las imágenes.

## Reglas comunes

- **Formato**: `.webp`, calidad ~80, menos de 300 KB cada una. Retratos en **4:5 (1200 × 1500)**; escenas en
  **3:2 (1800 × 1200)** salvo que se diga otra cosa.
- **Rutas**: `public/img/<demo>/…` con los nombres de abajo. No sobrescribir las que ya existen.
- Personas inventadas (nadie reconocible), sin texto, logos ni marcas en la imagen. Coherentes con las fotos que ya
  tiene cada demo (misma luz y el mismo local).
- Haz commit solo de esas rutas, en tu rama, y avisa al usuario con la rama y el commit para que Claude lo integre.

## Hebra (peluquería · guía «salón editorial claro»)

Retratos del equipo en **blanco y negro**, fondo claro liso o pared del salón, plano medio, mirando a cámara o
trabajando, con herramientas (tijeras, peine, pincel de color):

- `public/img/hebra/equipo/alba.webp`: corte y textura.
- `public/img/hebra/equipo/vera.webp`: color y luz.
- `public/img/hebra/equipo/leo.webp`: forma y acabado.

Trabajos para un collage suelto (color cálido, luz natural, detalle de pelo, 4:5):

- `public/img/hebra/trabajo-ondas.webp`, `trabajo-balayage.webp`, `trabajo-corte-corto.webp` y
  `trabajo-rizo.webp`.

## Esparta (barbería · guía «barbería de carácter»)

Todo en **blanco y negro contrastado**, grano de película:

- `public/img/esparta/equipo/hugo.webp`: tijera y clásicos.
- `public/img/esparta/equipo/bruno.webp`: barba y navaja.
- `public/img/esparta/equipo/ivan.webp`: degradado y textura.
- `public/img/esparta/navaja.webp` (3:2): afeitado con navaja y toalla caliente, primer plano.
- `public/img/esparta/sillon.webp` (3:2): el sillón vacío con la luz del local.

## Cadencia (club de movimiento · guía «estudio boutique»)

Color cálido, luz natural, madera y tonos tierra:

- `public/img/cadencia/equipo/ines.webp`: fuerza y técnica.
- `public/img/cadencia/equipo/nico.webp`: movilidad y control.
- `public/img/cadencia/equipo/dani.webp`: resistencia y energía.
- Disciplinas (4:5): `public/img/cadencia/fuerza.webp` (sentadilla o peso muerto con técnica) y
  `public/img/cadencia/cardio.webp` (remo o bici). Movilidad ya existe (`movilidad.webp`).

## Forja (gimnasio oscuro · guía «club de alto contraste»)

**Blanco y negro** duro, fondo oscuro, sudor y esfuerzo. Son personas distintas de las de Cadencia aunque compartan
nombre:

- `public/img/forja/equipo/ines.webp`, `nico.webp` y `dani.webp`.
- Disciplinas (4:5, para tarjetas con el nombre encima): `public/img/forja/fuerza.webp` (barra cargada),
  `movilidad.webp`, `cardio.webp` (remo o assault bike) y `pesado.webp` (peso muerto pesado).
  `recovery.webp` ya existe.

Total: 24 imágenes (7 de Hebra, 5 de Esparta, 5 de Cadencia y 7 de Forja).
