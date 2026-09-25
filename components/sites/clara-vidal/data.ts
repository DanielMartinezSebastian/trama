/** Clara Vidal — estilismo y moda, estética minimalista. Datos puros (sin React). */
import type { LookKind } from "@/lib/sites/art";

export const SLUG = "clara-vidal";

export const meta = {
  slug: SLUG,
  name: "Clara Vidal",
  title: "Clara Vidal · estilismo",
  blurb: "Web de una estilista con estética minimalista (fondo claro, mucho aire, tipografía grande): servicios con precios, lookbook, diario con artículos, página personal y reserva de cita con huecos disponibles.",
  accent: "#1d1d1f",
  tag: "servicios · reservas",
};

export type Service = { slug: string; name: string; tagline: string; body: string; price: string; duration: string; art: LookKind; seed: number };

export const SERVICES: Service[] = [
  { slug: "asesoria", name: "Asesoría de imagen", tagline: "Descubre qué te sienta bien, y por qué.", body: "Una sesión de dos horas para entender tus colores, tus proporciones y tu estilo. Sales con una guía personal que puedes aplicar a lo que ya tienes.", price: "120 €", duration: "2 h", art: "arch", seed: 2 },
  { slug: "armario-capsula", name: "Armario cápsula", tagline: "Menos prendas. Más combinaciones.", body: "Revisamos tu armario juntas, decidimos qué se queda y qué falta, y diseñamos un armario de unas 30 prendas que combinan entre sí para toda la temporada.", price: "390 €", duration: "2 sesiones", art: "coat", seed: 4 },
  { slug: "personal-shopper", name: "Personal shopper", tagline: "Compras con criterio, sin perder la tarde.", body: "Preparo una selección antes de salir y vamos directas a las tiendas que encajan contigo y con tu presupuesto. Sin compras por impulso.", price: "90 € / h", duration: "desde 2 h", art: "dress", seed: 6 },
];

export type Post = { slug: string; title: string; excerpt: string; date: string; art: LookKind; seed: number; body: string };

export const POSTS: Post[] = [
  {
    slug: "armario-capsula-30-prendas",
    title: "Treinta prendas, cien combinaciones",
    excerpt: "Un armario cápsula no va de tener poco. Va de que todo lo que tienes funcione junto.",
    date: "14 sep 2026",
    art: "shirt",
    seed: 1,
    body: `La primera pregunta de casi todas mis clientas es la misma: *¿cuántas prendas son un armario cápsula?* La respuesta corta es **alrededor de treinta**. La larga es que el número importa menos que la regla que las une.

## La regla

Cada prenda tiene que combinar con **al menos tres** de las demás. Si no, no entra. Esa regla, aplicada con honestidad, hace el resto del trabajo.

## Cómo repartirlas

| Tipo | Prendas |
|:--|--:|
| Partes de arriba | 10 |
| Partes de abajo | 6 |
| Vestidos y monos | 3 |
| Capas de abrigo | 4 |
| Calzado | 5 |
| Bolsos | 2 |

## Por dónde empezar

1. Saca todo lo que no te has puesto en un año.
2. Elige **tres colores base** y dos de acento.
3. Completa lo que falte, de uno en uno, sin prisa.

> Tener menos no es renunciar. Es dejar de elegir cada mañana entre cosas que no te convencen.

Cuando termines, cuenta las combinaciones. La mayoría de las veces pasan de cien.`,
  },
  {
    slug: "abrigo-que-dure",
    title: "Cómo elegir un abrigo que dure diez años",
    excerpt: "Es la prenda que más se ve y la que más se amortiza. Merece la pena elegirla despacio.",
    date: "28 ago 2026",
    art: "coat",
    seed: 3,
    body: `Un buen abrigo es la prenda que más se ve y la que más se amortiza. Si lo eliges bien, te acompaña una década.

## Tres cosas que mirar

- **El tejido**: al menos un 70 % de lana. Pellizca la tela: si recupera la forma, bien.
- **Los hombros**: la costura debe caer justo en el hueso del hombro, ni antes ni después.
- **El largo**: por debajo de la rodilla alarga; a la cadera es más informal y más versátil.

## El color

Camel, gris medio o azul marino. Los tres combinan con casi todo y envejecen bien. El negro es seguro, pero en invierno apaga la cara.

> [!TIP] Un truco en el probador
> Pruébatelo con el jersey más grueso que tengas. Si con él te sigue quedando bien, el tamaño es el correcto.`,
  },
  {
    slug: "colores-que-te-favorecen",
    title: "Los colores que te favorecen, sin test de estaciones",
    excerpt: "No hace falta clasificarte en primavera u otoño. Basta con un espejo, luz natural y diez minutos.",
    date: "9 ago 2026",
    art: "fabric",
    seed: 5,
    body: `Los test de estaciones tienen su gracia, pero hay una forma más directa de saber qué colores te sientan bien: **mirarte**.

## El método del espejo

Ponte delante de una ventana, con la cara lavada, y acerca a la barbilla prendas de distintos colores. Fíjate en tres cosas:

1. ¿Las sombras bajo los ojos se suavizan o se marcan?
2. ¿La piel se ve más luminosa o más apagada?
3. ¿Miras antes la ropa o tu cara?

Si miras antes tu cara, ese color es tuyo.

## Cálidos o fríos

Si el dorado te favorece más que el plateado, probablemente te sientan mejor los **tonos cálidos**: camel, oliva, terracota. Si es al revés, los **fríos**: gris, azul, burdeos.

Y recuerda: el color que más te favorece suele ser el que ya tienes repetido en el armario sin darte cuenta.`,
  },
];

/** huecos de agenda de las próximas dos semanas (fijos: la demo no depende de la fecha) */
export const SLOTS = ["Lun 29 sep · 10:00", "Lun 29 sep · 16:30", "Mar 30 sep · 11:00", "Mié 1 oct · 10:00", "Mié 1 oct · 18:00", "Jue 2 oct · 12:00", "Vie 3 oct · 10:00", "Vie 3 oct · 17:00", "Lun 6 oct · 11:30", "Mar 7 oct · 16:00"];

export const ROUTES = [
  { path: "", title: "Inicio" },
  { path: "servicios", title: "Servicios" },
  { path: "lookbook", title: "Lookbook" },
  { path: "diario", title: "Diario" },
  ...POSTS.map((p) => ({ path: `diario/${p.slug}`, title: p.title })),
  { path: "sobre-mi", title: "Sobre mí" },
  { path: "reservar", title: "Reservar" },
];
