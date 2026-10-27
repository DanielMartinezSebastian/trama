# Encargo para Codex: imágenes para las réplicas de los estudios por sector

> 27-10-2026, de la sesión de Claude (rama `feat/cine-captura`, worktree `trama-estudios`). Cada web estudiada en
> docs/50 §3 se reproduce en `/lab/estudios/<slug>` con una marca inventada y la estética del original. Claude monta
> las páginas con fotos provisionales; Codex genera estas para sustituirlas.

## Reglas comunes

- **Formato**: `.webp`, calidad ~80, menos de 250 KB cada una. Retratos y verticales en **4:5 (1200 × 1500)**;
  horizontales en **3:2 (1800 × 1200)**; cuadradas en **1:1 (1200 × 1200)**.
- **Rutas**: `public/img/replicas/<slug>/<nombre>.webp`. No sobrescribir nada existente.
- Personas inventadas, nadie reconocible; sin texto, logos ni marcas en la imagen. Fotografía documental o editorial
  realista salvo donde se pida ilustración.
- Commit solo de esas rutas en tu rama y aviso al usuario con rama y commit.
- Si no da tiempo a todo, el orden de la lista es la prioridad.

## Peluquería y barbería

| Slug (marca inventada) | Referencia | Imágenes |
|---|---|---|
| `matiz` (atelier de color) | Il Colorista | `trabajo-1…4` (1:1): melenas de color salmón, cobrizo y rubio sobre fondo crema, recortables en círculo; `equipo-1…3` (1:1, B/N): retratos de estilistas; `menu` (3:2): pinceladas de acuarela verdeazuladas sobre papel crema |
| `nura` (pelo y arte, Estocolmo) | ALICE Hair & Art | `collage-1…5` (4:5 y 1:1, mezcla B/N y color): estilistas trabajando, un corte rubio platino, retrato de pareja; `arte-1…3` (1:1): cuadros de colores saturados, paisaje surrealista con cactus y sol |
| `cita` (barberías urbanas) | Rendezvous | `local-1…5` (4:5): retratos masculinos de calle con camisa clara frente a piedra o ventanal; `video-still` (3:2): barbero con máquina en penumbra cálida; `resena-1…2` (4:5, B/N) |
| `melena` (salón, tienda y academia) | Hair Me Up | `producto-1…4` (1:1): frascos de champú y aceite sin marca sobre fondo melocotón; `academia` (3:2): clase de corte con maniquíes |
| `raiz` (extensiones, oscuro) | Marco Ambrosi | `antes-1…3` y `despues-1…3` (4:5): misma persona de espaldas con pelo corto y luego largo y ondulado; `portada` (3:2): melena larga castaña |
| `patron` (barbería de lujo) | Don Barber & Groom | `local` (4:5): barbería de madera y latón con luz cálida; `dueno` (4:5): barbero calvo con barba gris sobre fondo azul gris; `servicio-1…3` (3:2): sala de tratamiento, manicura, sillón |

## Gimnasio y estudio

| Slug | Referencia | Imágenes |
|---|---|---|
| `nucleo` (pilates) | Core Atelier | `reformer-1…4` (4:5): mujer en reformer, silla y barril de pilates, estudio con suelo de madera, tonos rosados y marrones |
| `impulso` (coach personal) | Essor Fitness | `coach` (4:5): entrenador sonriente con polo negro; `studio-1…3` (3:2): estudio privado pequeño con máquinas, apretón de manos |
| `vive` (club premium) | FIT AND YOU | `club-1…4` (3:2, oscuro): TRX, pilates, spa, sala con luces lineales; `bonus-1…4` (1:1): socios sonrientes entrenando |
| `talla` (gimnasio de barrio) | Skulpt | `sala` (3:2), `coach`, `cafe` y `maquinas` (4:5): gimnasio industrial, café en máquina espresso |
| `lobo` (artes marciales) | Fenriz | `muay-thai`, `bjj`, `mma`, `boxeo`, `fitness`, `recovery` (4:5, B/N contrastado) |

## Academia, producto y agencia

| Slug | Referencia | Imágenes |
|---|---|---|
| `remada` (academia de surf de autor) | Surfing Academy | `surfistas` (ilustración de línea negra sobre fondo transparente o blanco: cuatro surfistas con una tabla); `destino-1…5` (3:2): olas tubulares, ola artificial, playa tropical; `autor` (1:1): surfista con gafas de sol, fondo naranja |
| `ahora` (escuela de diseño y negocio) | Future London Academy | `clase-1…3` (3:2): talleres con post-its y gente de pie; `profe-1…6` (1:1): retratos de profesores de 30 a 60 años |
| `oficio` (instituto de formación) | Honhar | `aula` (3:2, B/N): alumnos en un aula; `mentor-1…3` (4:5, B/N) |
| `abuela-rosa` (salsa picante) | Peppa Sauce | `bote` (PNG con fondo transparente, 900 × 1600): botella de salsa naranja con etiqueta ilustrada sin texto legible; `abuela` (ilustración de línea crema sobre azul noche) |
| `q47` (agencia creativa) | K72 | `reel-1…6` (3:2): fotogramas de campañas: producto sobre azul, gato junto a un árbol de Navidad, coche de noche, cartel en la calle, ilustración de una cara |
