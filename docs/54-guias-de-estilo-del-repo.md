# 54 · Guías de estilo sacadas de todo el repo

> 27-10-2026. Lo aprendido en los estudios, las réplicas y el cuaderno tiene que servir para generar guías de estilo.
> El usuario pide que la página `/guias` incluya todo lo que hay en el repo, que ya es bastante grande para empezar a
> construir guías.

## 0. Conclusiones

1. **Ahora hay tres fuentes de guías y todas pasan por la misma medida.**
   - Las ocho de las webs premiadas (docs/16 §5.1).
   - Las siete de los estudios por sector (docs/16 §5.1b, cuaderno).
   - Las cuatro de la estética propia del repo (§3).
   Cada una se mide en el navegador con `refs:probe` y se compara con los mismos once rangos.
2. **El repo entero queda clasificado.** `refs:probe --repo` mide las webs, landings y réplicas y les asigna la guía más
   afín. Una página con poca afinidad indica una de dos cosas: una estética sin guía, o una página que se ha desviado
   de la suya.
3. **Cada guía tiene una hoja de estilo** en `/guias/<id>`. Junta todo lo que el repo sabe de ella: color con contraste,
   letra, espacio, movimiento, componentes del kit, familia del cuaderno, receta, páginas afines, reglas y código.

## 1. Las fuentes de cada hoja

| Sección de la hoja | De dónde sale |
|---|---|
| Portada, color, tipografía, espacio, código | `STYLE_GUIDES` (`lib/ui/guides.ts`), aplicada con `GuideFrame` |
| Contraste | WCAG calculado entre las tintas (`contraste()` en `components/site/guias/fuentes.ts`) |
| Valores medidos | la guía medida en `/guias/relato/<id>/<relato>` (`repo.json`, `tipo: "guia"`) |
| Movimiento y gestos | `motion` de la guía, más los gestos del cuaderno traducidos a piezas del kit (`GESTOS_KIT`) |
| Componentes | NavBar, Button, Badge, TextField, PricingSection, TestimonialSection y FAQSection con la variante de la guía |
| Familia y patrones | fichas del cuaderno cuya etiqueta `guia` es el nombre de la guía en minúsculas |
| Receta | `RECETAS_SECTOR` (`lib/catalog/sectores.ts`) |
| En el repo | páginas de `repo.json` cuya guía más afín es esta |
| Reglas | `GUIDE_RULES` y `GUIDE_EXCEPTIONS` (`lib/ui/guides.ts`), las mismas que usa la sonda |

El índice de `/guias` (`GuideIndex`) agrupa las guías por origen (`source`). Enseña una tarjeta por guía y una tabla con
el repo entero, cada página con su guía y sus dos siguientes. Debajo sigue el laboratorio de composiciones y relatos.

## 2. `refs:probe --repo`

```bash
npm run refs:probe -- --repo http://localhost:3020 --no-shots --limite 120 --out .refs3d/repo
```

- **Páginas.** Toma de `docs/CATALOG.md` las webs (`/sitios/*`) y las landings (`/demo/*`) y añade las réplicas de
  `components/lab/estudios/registro.ts`. Mide además todas las guías, como hace `--guides`.
- **Escritura.** Escribe `components/site/guias/repo.json` con la fecha, la base, las medidas de cada página, sus rasgos
  y sus tres guías más afines. Las réplicas solo existen en local; en la tabla salen sin enlace.
- **Afinidad.** La calcula `scripts/guias-afinidad.mts`.
  - Rasgos que compara:
    - luminancia del fondo;
    - saturación y tono del color más saturado con al menos un 2 % de superficie;
    - categoría de la letra del titular: pixel, mono, condensada, serifa, redonda o grotesca;
    - tamaño en vw, peso, tracking, mayúsculas e interlineado del titular;
    - tamaño del texto;
    - píldoras.
  - Pesos de la distancia: el fondo pesa 3, la letra 1,5 y el resto entre 0,5 y 1.
  - Afinidad = `1 / (1 + distancia)`.
- **Lectura.**
  - Por encima de 0,35, la página es claramente de esa guía.
  - Por debajo de 0,25, no se parece a ninguna.
- **Límites.**
  - Un titular en letra de píxel sin titular grande en el primer pantallazo se mide mal (1 vw): pesan más el fondo y la
    letra.
  - Quilate tumba el navegador headless (`Target crashed`) y queda en `fallidas`.

## 3. Las guías del repo

La primera medida (sin ellas) dejó por debajo de 0,25 las landings ASCII y de terminal, las webs en letra de píxel o de
puntos y las webs de estudio en papel claro. De ellas salen cuatro guías con `source: "repo"`. Tabla en docs/16 §5.1c.

| Guía | Rasgos | Páginas |
|---|---|---|
| `terminal` · Terminal de neón | negro tintado, todo mono a 800 en mayúsculas, un neón, `steps()` | CIPHERGRID, MYCEL, Kernel Log |
| `pixel` · Arcade pixel | ciruela, Silkscreen en titulares, Space Mono para leer, amarillo de moneda, sin radio | Pixelforge, Hamaca, MINIMAL |
| `puntos` · Matriz de puntos | negro puro, Doto 800, IBM Plex Mono gris, un rojo de piloto | DOTMATRIX, Almíbar Barrio |
| `papel` · Estudio en papel | papel crudo, Inter Tight 500 ajustada, filetes, óxido, `quint.out` | Alzado, Estudio, Barro, Plano |

Ajustes al medirlas:
- `pixel` empezaba con el relato de mundo: portada de marca a 23,5 vw, lejos de las páginas pixel del repo (4–6 vw).
  Ahora empieza con el de producto.
- `papel` daba un titular de 2,4 vw: su composición asimétrica pone el titular a tamaño de h2. El h2 sube a
  `clamp(2rem, 3.2vw, 3rem)`, como en salón y boutique, que usan la misma composición.

Las 19 guías quedan dentro de rango con `--guides`, en escritorio y en móvil. Terminal y puntos usan su excepción de
peso.


## 4. Cómo añadir o cambiar una guía

1. Busca en `/guias` (tabla del repo) las páginas con poca afinidad. Si comparten fondo, letra y escala, son una guía.
2. Mide esas páginas (`refs:probe <url…>`) y copia sus valores en una entrada nueva de `STYLE_GUIDES`, con:
   - `source`;
   - `refs`, con la página medida entre paréntesis;
   - letras libres de `lib/ui/fonts.ts`.
3. Si un rasgo sale de los once rangos y es justo lo que define la familia, añádelo a `GUIDE_EXCEPTIONS` con su medida y
   su web. Si no se puede justificar así, es un fallo.
4. Si la guía tiene familia en el cuaderno, pon su nombre en minúsculas en la etiqueta `guia` de las fichas.
5. Comprueba la guía:
   - `npm run refs:probe -- --guides <base> --solo <id>`: debe quedar dentro de rango, o fuera solo por sus
     excepciones. Se mide el primer relato de `stories`, así que ese relato tiene que enseñar el titular en el primer
     pantallazo; si es pequeño, o la escala del titular está mal o el relato no es el adecuado;
   - `--repo <base>`: actualiza `repo.json`;
   - `/guias/<id>`: revísala en escritorio y en móvil.
6. Actualiza la descripción de `GuideFrame` en `lib/catalog/entries/guias.tsx` y `npm run catalog`.

## 5. Estado

- 19 guías: 8 de las premiadas, 7 de sector y 4 del repo.
- 56 páginas del repo medidas y clasificadas: 32 webs, 8 landings y 16 réplicas. Quilate, la web 33, no se pudo medir.
- Reparto por guía:
  - nocturno 14, boutique 7, papel 6, eléctrico 5, puntos 4;
  - terminal, marca y autor 3 cada una;
  - pixel, lúdico, club y barbería 2 cada una;
  - salón, lujo y cálido 1 cada una.
- Siguen por debajo de 0,25 23 páginas: es una afinidad gruesa y sirve para encontrar huecos, no para medir parecido
  fino.
- `/guias` y las hojas revisadas a 1440 y 390 sin desborde.

**Pendiente:**
- Las landings `th-*` con titular ASCII en canvas se miden por su texto de interfaz. Un rasgo «ASCII» (canvas con glifos)
  las separaría mejor.
- Repasar las páginas que queden por debajo de 0,25 después de añadir las cuatro guías: ¿estética nueva o desviación?
- Composiciones y relatos propios de las guías del repo (hoy usan los de las demás).
