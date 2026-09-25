/** Pixelforge — tienda de assets para videojuegos. Datos puros (sin React). */
import type { AssetKind } from "@/lib/sites/art";

export const SLUG = "pixelforge";

export const meta = {
  slug: SLUG,
  name: "Pixelforge",
  title: "Pixelforge · tienda de assets",
  blurb: "Tienda de assets para videojuegos: catálogo con filtros, orden y búsqueda, fichas con licencias, carrito que se guarda entre páginas, cupón, pago en pasos, FAQ y páginas legales.",
  accent: "#ffcc4d",
  tag: "tienda · carrito",
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  art: AssetKind;
  seed: number;
  short: string;
  long: string;
  includes: string[];
  formats: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
};

export const CATEGORIES = ["Sprites", "Tilesets", "Sonido", "Fuentes", "Interfaz", "Efectos"];

export const LICENSES = [
  { id: "personal", name: "Personal", factor: 1, note: "Proyectos no comerciales y game jams" },
  { id: "comercial", name: "Comercial", factor: 2.5, note: "Un juego comercial, ventas ilimitadas" },
  { id: "estudio", name: "Estudio", factor: 6, note: "Todos los juegos de un estudio de hasta 10 personas" },
] as const;
export type LicenseId = (typeof LICENSES)[number]["id"];

export const PRODUCTS: Product[] = [
  { slug: "heroes-16-bit", name: "Héroes 16-bit", category: "Sprites", price: 12, art: "sprite", seed: 3, short: "32 personajes animados en 4 direcciones.", long: "Treinta y dos héroes y heroínas de 32×32 con animaciones de caminar, correr, atacar, recibir daño y morir en cuatro direcciones. Paleta cerrada de 24 colores para que combinen entre sí.", includes: ["32 personajes × 6 animaciones", "Hojas de sprites y frames sueltos", "Archivo fuente de Aseprite", "Paleta .gpl y .ase"], formats: "PNG · Aseprite · JSON (Godot, Unity, Phaser)", rating: 4.9, reviews: 312 },
  { slug: "mazmorra-modular", name: "Mazmorra modular", category: "Tilesets", price: 9, art: "tiles", seed: 7, short: "Más de 400 tiles para mazmorras y cuevas.", long: "Un tileset de 16×16 pensado para autotiling: suelos, paredes, puertas, trampas y decoración para mazmorras, cuevas y criptas. Incluye reglas listas para Godot y Tiled.", includes: ["412 tiles de 16×16", "Reglas de autotile para Godot 4 y Tiled", "Mapa de ejemplo", "Versión con y sin sombras"], formats: "PNG · TMX · TRES (Godot)", rating: 4.8, reviews: 204 },
  { slug: "retro-sfx", name: "Retro SFX · 300", category: "Sonido", price: 15, art: "sfx", seed: 11, short: "300 efectos de sonido chiptune.", long: "Saltos, monedas, explosiones, menús, poderes y golpes con sonido de consola de 8 bits, en tres variaciones cada uno para que no se repitan. Normalizados y sin silencios al principio.", includes: ["300 efectos en 3 variaciones", "WAV 44,1 kHz y OGG", "Hoja de nombres por categoría", "Proyectos de sfxr editables"], formats: "WAV · OGG · sfxr", rating: 4.7, reviews: 158, isNew: true },
  { slug: "pixel-sans", name: "Pixel Sans", category: "Fuentes", price: 7, art: "font", seed: 2, short: "Fuente pixel legible en 8 y 16 px, con tildes.", long: "Una fuente pixel pensada para interfaces: legible a 8 y 16 px, con acentos, ñ, símbolos de moneda y flechas. Tres pesos y versión monoespaciada para diálogos.", includes: ["3 pesos + monoespaciada", "Latín extendido completo (á, ñ, ç…)", "TTF y fuente bitmap (BMFont)", "Licencia para incrustar en el juego"], formats: "TTF · OTF · BMFont", rating: 4.9, reviews: 97 },
  { slug: "interfaz-rpg", name: "Interfaz RPG", category: "Interfaz", price: 11, art: "ui", seed: 5, short: "Ventanas, botones y barras para RPG.", long: "Todo lo que necesita la interfaz de un RPG: ventanas de diálogo, inventario, barras de vida y maná, botones en tres estados, iconos de objetos y cursores. Todo en 9 cortes para escalar sin deformar.", includes: ["60 piezas en 9 cortes", "120 iconos de objetos", "Botones en reposo, encima y pulsado", "Plantilla de pantalla de inventario"], formats: "PNG · Aseprite · Figma", rating: 4.6, reviews: 131 },
  { slug: "magia-y-particulas", name: "Magia y partículas", category: "Efectos", price: 10, art: "fx", seed: 13, short: "48 efectos animados de hechizos e impactos.", long: "Explosiones, rayos, curaciones, portales y chispas en 48 efectos animados, en versión pixel art y en versión suave para motores con partículas.", includes: ["48 efectos animados", "Frames sueltos y hojas de sprites", "Presets de partículas para Godot", "Variantes de color"], formats: "PNG · GIF · Godot", rating: 4.8, reviews: 88, isNew: true },
  { slug: "bosque-encantado", name: "Bosque encantado", category: "Tilesets", price: 9, art: "tiles", seed: 19, short: "Tileset de exterior con estaciones.", long: "Bosque, río, puentes y ruinas en cuatro estaciones: la misma escena en primavera, verano, otoño e invierno para cambiar el ambiente sin rehacer el mapa.", includes: ["380 tiles × 4 estaciones", "Árboles animados", "Reglas de autotile", "Mapa de ejemplo"], formats: "PNG · TMX · TRES", rating: 4.7, reviews: 176 },
  { slug: "monstruos-vol-1", name: "Monstruos vol. 1", category: "Sprites", price: 12, art: "sprite", seed: 23, short: "24 enemigos con ataques y jefes.", long: "Veinticuatro enemigos de 32×32 y tres jefes de 64×64, con animaciones de reposo, ataque y derrota. Pensados para combinar con Héroes 16-bit.", includes: ["24 enemigos + 3 jefes", "Ataques y derrotas animados", "Archivo fuente de Aseprite", "Misma paleta que Héroes 16-bit"], formats: "PNG · Aseprite · JSON", rating: 4.8, reviews: 143 },
];

export const COUPONS: Record<string, number> = { PIXEL10: 0.1, FORJA20: 0.2 };
export const VAT = 0.21;

export const FAQ = [
  { group: "Compras", items: "¿Cómo recibo los archivos?|Al terminar el pago tienes los enlaces de descarga en pantalla y en tu correo. Puedes volver a descargarlos cuando quieras desde tu cuenta.\n¿Qué métodos de pago aceptáis?|Tarjeta, PayPal y transferencia para pedidos de estudio.\n¿Puedo pedir factura?|Sí: todas las compras generan factura con IVA. Si eres empresa, añade tu CIF en el paso de datos." },
  { group: "Licencias", items: "¿Qué licencia necesito?|Personal para proyectos sin ánimo de lucro y game jams; Comercial para vender un juego; Estudio si vas a usarlo en varios juegos o en un equipo.\n¿Puedo modificar los assets?|Sí, en todas las licencias. Lo que no puedes es revenderlos como assets, ni modificados ni sin modificar.\n¿Tengo que dar crédito?|No es obligatorio, pero lo agradecemos: «Assets de Pixelforge» en los créditos es suficiente." },
  { group: "Descargas y soporte", items: "¿Las actualizaciones son gratis?|Sí: si un pack recibe tiles o sprites nuevos, los tienes sin pagar de nuevo.\n¿Qué motores son compatibles?|Todos: son PNG, WAV y fuentes estándar. Además incluimos importadores para Godot, Unity y Phaser cuando tiene sentido.\n¿Y si algo no funciona?|Escríbenos a soporte@pixelforge.dev y lo resolvemos en 48 horas laborables." },
];

export const LEGAL: Record<string, { title: string; lead: string; body: string }> = {
  terminos: {
    title: "Términos y condiciones",
    lead: "Las condiciones de compra y uso de la tienda. Última actualización: 1 de septiembre de 2026.",
    body: `## Quiénes somos

Pixelforge es una tienda de recursos digitales para videojuegos. Esta página es un **ejemplo** para una demo: no hay tienda real detrás.

## Compras

- Los precios incluyen el precio de la licencia elegida; el IVA se añade en el carrito.
- La compra se completa cuando recibes el correo de confirmación con los enlaces de descarga.
- Puedes descargar los archivos tantas veces como quieras desde tu cuenta.

## Derecho de desistimiento

Al tratarse de contenido digital que se entrega de forma inmediata, **aceptas perder el derecho de desistimiento** en el momento en que empieza la descarga, conforme al artículo 103 m) de la Ley General para la Defensa de los Consumidores.

> [!NOTE]
> Si un archivo está dañado o no corresponde con la ficha, te devolvemos el dinero o lo sustituimos, aunque ya lo hayas descargado.

## Responsabilidad

Los assets se entregan tal cual. Nos comprometemos a corregir errores de los archivos en un plazo razonable, pero no respondemos de los daños indirectos derivados de su uso.

## Ley aplicable

Estos términos se rigen por la legislación española. Para cualquier conflicto, los juzgados del domicilio del consumidor.`,
  },
  privacidad: {
    title: "Política de privacidad",
    lead: "Qué datos guardamos, para qué y cómo pedir que los borremos.",
    body: `## Datos que tratamos

| Dato | Para qué | Cuánto tiempo |
|:--|:--|:--|
| Correo | Enviarte la compra y las facturas | Mientras tengas cuenta |
| Nombre y país | Emitir la factura | 6 años (obligación fiscal) |
| Carrito | Recordar lo que ibas a comprar | En tu navegador, hasta que lo vacíes |

**No** guardamos datos de tarjeta: el pago lo procesa directamente la pasarela.

## Tus derechos

Puedes acceder, rectificar, suprimir u oponerte al tratamiento de tus datos escribiendo a [privacidad@pixelforge.dev](mailto:privacidad@pixelforge.dev). También puedes reclamar ante la Agencia Española de Protección de Datos.

## Cookies

Solo usamos almacenamiento local para el carrito y una cookie técnica de sesión. Sin analítica de terceros ni publicidad.`,
  },
  licencias: {
    title: "Licencias",
    lead: "Qué puedes hacer con los assets según la licencia que elijas.",
    body: `## Resumen

| Puedes… | Personal | Comercial | Estudio |
|:--|:--:|:--:|:--:|
| Usarlos en proyectos no comerciales | ✓ | ✓ | ✓ |
| Vender un juego que los incluye | — | ✓ | ✓ |
| Usarlos en varios juegos | — | — | ✓ |
| Compartirlos con tu equipo (hasta 10) | — | — | ✓ |
| Modificarlos | ✓ | ✓ | ✓ |
| Revenderlos como assets | — | — | — |

## Personal

Para aprender, prototipos, game jams y proyectos sin ánimo de lucro. Si el proyecto pasa a ser comercial, basta con **pagar la diferencia** hasta la licencia Comercial.

## Comercial

Un juego comercial, con ventas ilimitadas y en todas las plataformas. Incluye actualizaciones del pack.

## Estudio

Todos los juegos de un estudio de hasta diez personas, presentes y futuros, mientras el estudio exista.

> [!IMPORTANT] Lo que ninguna licencia permite
> Redistribuir los archivos como assets, dentro de otro pack o en un generador. Los assets pueden ir *dentro* de tu juego, no *sueltos*.`,
  },
};

export const ROUTES = [
  { path: "", title: "Inicio" },
  { path: "tienda", title: "Tienda" },
  ...PRODUCTS.map((p) => ({ path: `producto/${p.slug}`, title: p.name })),
  { path: "carrito", title: "Carrito" },
  { path: "faq", title: "Preguntas frecuentes" },
  ...Object.entries(LEGAL).map(([k, v]) => ({ path: `legal/${k}`, title: v.title })),
];
