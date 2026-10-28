# 55 · Inspiraciones: las webs clonadas, convertidas en demos

> 27-10-2026. El usuario pide convertir en demos todas las webs clonadas en el laboratorio, también las anteriores a la
> última sesión, meterlas en /demos en la categoría «Inspiraciones» y enlazarlas desde las guías de estilo. Sus imágenes
> no tenían que ver con la temática ni con el estilo: se cambian con el agente de Codex del usuario («trama-codex»).

## 0. Conclusiones

1. **18 inspiraciones**:
   - las 16 réplicas de los estudios por sector (docs/50);
   - las dos webs 3D enteras del laboratorio de cine: **Cénit**, basada en Lusion (docs/43), y **Brasa**, basada en Meer
     Mohsin (docs/41).
   Todas tienen marca inventada y textos en español. Cénit y Brasa llevaban la marca real y textos en inglés; se
   rehicieron antes de publicarlas.
2. **Son demos públicas** en `/inspiraciones/<slug>`, en el grupo «Inspiraciones» de `/demos`. El laboratorio sigue
   sirviéndolas para medir contra la original:
   - `/lab/estudios/<slug>`, con `refs:probe --par` (docs/53);
   - `/lab/cine/lusion-web` y `/lab/cine/relato`, con `cine:compare`.
3. **Cada una sigue una guía de estilo.** Su hoja `/guias/<guía>` la enseña en «Inspiraciones y páginas del repo». El
   índice de `/guias` cuenta las inspiraciones de cada guía.
4. **Cada hueco de imagen tiene su propia foto**: 221 en total. Antes eran fotos prestadas de otras demos (un gimnasio en
   el estudio de pilates, una persona en la camiseta de la tienda). Hasta que lleguen las de Codex, cada archivo es una
   provisional recortada de la foto vieja, así que la página nunca se rompe.

## 1. Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Código de cada inspiración | `components/inspiraciones/<slug>/`: `data.ts` (datos y `PAGINAS`), `enlaces.ts`, la portada y `Sitio.tsx` (`Shell` y `Pagina`); docs/56 §7 |
| Registro: marca, referencia, sector, firma, guía y acento | `components/inspiraciones/registro.ts` (`REPLICAS`) |
| Carga por separado de cada una | `components/inspiraciones/Cargador.tsx` |
| Rutas públicas | `app/inspiraciones/[slug]/layout.tsx` (el `Shell` persiste) y `[[...ruta]]/page.tsx` (cada página, con `PageTransition`) |
| Grupo de /demos | `demoGroups()` en `lib/site-data.ts` |
| Guías | `datosDeGuia()` (`inspiraciones`) en `components/site/guias/fuentes.ts`; `GuideSheet` §08 y `GuideIndex` |
| Catálogo para agentes | sección «Inspiraciones» de `docs/CATALOG.md` (la escribe `npm run catalog` y comprueba que cada guía existe) |
| Encargo de imágenes | `docs/encargo-imagenes-inspiraciones.md` (y `.json`); archivos en `public/img/inspiraciones/<slug>/` |

| Inspiración | Basada en | Guía |
|---|---|---|
| Matiz, Nura, Melena | Il Colorista, ALICE Hair & Art, Hair Me Up | `salon` |
| Cita Barbers, Raíz, Patrón | Rendezvous, Marco Ambrosi, Don Barber & Groom | `barberia` |
| Impulso, Vive, Talla, Lobo, Q47 | Essor, FIT AND YOU, Skulpt, Fenriz, K72 | `club` |
| Núcleo | Core Atelier Pilates | `boutique` |
| Remada | Surfing Academy | `autor` |
| Ahora, Oficio | Future London Academy, Honhar | `escuela` |
| Abuela Rosa | Peppa Sauce | `marca` |
| Cénit | Lusion | `monocromo` |
| Brasa | Meer Mohsin | `electrico` |

## 2. Las imágenes

- **Un hueco, una imagen.** El encargo nombra cada archivo por lo que enseña, no por la foto que había: por ejemplo
  `tienda-camiseta`, `aparato-reformer` o `blog-armocromia`. Cuando la misma foto vieja servía para dos cosas (el servicio
  y el artículo del blog), ahora son dos imágenes.
- **Estilo por inspiración.** Cada una tiene un párrafo de estilo, sacado de su ficha en docs/50 y de la paleta medida.
  Todas sus fotos tienen que parecer de la misma sesión.
- **Provisionales.** El script que cambió las rutas recortó la foto vieja al formato de cada hueco. Codex sobrescribe los
  archivos sin tocar el código.
- **Videos.** Siguen los de `/video/` (reel de Q47, Cénit y Brasa): el encargo es solo de imágenes.
- **Entrega.** trama-codex no aparece entre las sesiones a las que llega Claude (`ListAgents`): el encargo queda escrito
  para dárselo. Al entregar, revisar cada inspiración en escritorio y móvil y volver a medir su par si cambió el color de
  las fotos.

## 3. Cómo añadir una inspiración

1. Estudia la web: `cine:web` o `refs:probe` (docs/50 y docs/53).
2. Haz la réplica en `components/inspiraciones/<slug>/` con piezas del kit, con marca y textos propios. No uses la marca,
   los clientes ni el texto de la original. Separa la portada del marco: `Sitio.tsx` exporta `Shell` (cabecera, menú
   del móvil, estado y pie) y `Pagina({ ruta })`; los datos y `PAGINAS` van en `data.ts` (docs/56 §7).
3. Regístrala:
   - en `registro.ts`, con su `guia`, su `acento`, `paginas` y `transicion`;
   - en `Cargador.tsx`, con `sitio(() => import("./<slug>/Sitio"))`.
4. Mide el par: `refs:probe --par <original> http://localhost:<puerto>/lab/estudios/<slug>`.
5. Anota la ficha del cuaderno, con `ruta: /inspiraciones/<slug>`.
6. Encarga sus imágenes a Codex en `public/img/inspiraciones/<slug>/`.
7. Ejecuta `npm run catalog` y vuelve a medir el repo con `refs:probe --repo` (docs/54).
8. Pasa el revisor de interacción por todas sus páginas (`npm run smoke -- <url> --auditar`) y prueba su flujo de
   negocio de punta a punta.

## 4. Pendiente

- Hecho (28-10-2026): las 221 imágenes de Codex y las 18 con varias páginas y su flujo (docs/56 §7).
- Un segundo encargo de imágenes para las fichas nuevas que reutilizan fotos (docs/56 §7).
- Volver a medir las 18 con `--par` tras las imágenes: la paleta por superficie cambia.
- Brasa y Cénit no tienen ficha propia en el cuaderno; su estudio está en docs/41–43.
