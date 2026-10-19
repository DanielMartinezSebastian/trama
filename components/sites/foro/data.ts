/** ArcoForo — festival ficticio de diseño y cultura digital. Fórmula: OFFFForum (wordmark gigante, hero a sangre con fundido, ficha de datos). Datos puros. */
export const SLUG = "foro";

export const meta = {
  slug: SLUG,
  name: "ArcoForo",
  title: "ArcoForo · una semana de diseño, arte y cultura digital",
  blurb:
    "Web de un festival con la fórmula «evento»: preloader con la marca que se rellena, wordmark de borde a borde en dos tipografías, hero a sangre con fotografías que se funden (con botón de pausa), ficha de datos en caja de línea fina, programa con filtros por día y pie con la marca gigante. Usa Preloader (fill), FitText, CrossfadeHero, MetaTable, FilterBar y ProjectList.",
  accent: "#d3300a",
  tag: "evento · wordmark",
};

export const ROUTES = [
  { path: "", title: "Inicio" },
  { path: "programa", title: "Programa" },
];

export const FACTS = [
  { k: "Foro", v: "15 de septiembre de 2027" },
  { k: "Festival", v: "16 y 17 de septiembre" },
  { k: "Lugar", v: "Sala de las Artes Tecnológicas, Montreal" },
  { k: "Entradas", v: "Desde 45 € · plazas limitadas" },
];

export type Talk = { title: string; who: string; day: "15" | "16" | "17"; hour: string; seed: number };

export const TALKS: Talk[] = [
  { title: "Diseñar con las manos", who: "Inés Valdés", day: "15", hour: "10:00", seed: 1 },
  { title: "La web como lugar", who: "Marc Orsini", day: "15", hour: "11:30", seed: 2 },
  { title: "Tipografía en movimiento", who: "Yuki Aoyama", day: "15", hour: "16:00", seed: 3 },
  { title: "Color, luz y pantalla", who: "Lola Rivet", day: "16", hour: "10:30", seed: 4 },
  { title: "Prototipos que se rompen", who: "Samuel Okafor", day: "16", hour: "12:00", seed: 5 },
  { title: "Sonido para interfaces", who: "Greta Lund", day: "16", hour: "17:00", seed: 6 },
  { title: "Archivos vivos", who: "Tomás Pereira", day: "17", hour: "11:00", seed: 7 },
  { title: "Diseño y territorio", who: "Aya Benali", day: "17", hour: "15:30", seed: 8 },
];

export const DAYS = [
  { value: "15", label: "15 sep · Foro" },
  { value: "16", label: "16 sep · Festival" },
  { value: "17", label: "17 sep · Festival" },
];
