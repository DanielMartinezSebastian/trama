/** Arbor — complejo residencial ficticio. Fórmula: Belgrade Arbor (isla de navegación, marca serif que se dispersa, verde y oro). Datos puros. */
export const SLUG = "arbor";

export const meta = {
  slug: SLUG,
  name: "Arbor",
  title: "Arbor · residencias entre árboles",
  blurb:
    "Web de un complejo residencial con la fórmula «arquitectura de lujo tranquilo»: navegación en forma de isla (píldora de vidrio) con el menú a pantalla completa debajo, hero a sangre con la marca en serif que se dispersa al hacer scroll, paneles verticales que se expanden, ficha de datos, botón circular dentro del titular y pestaña lateral de visita. Usa IslandNav, ScatterText, ExpandingPanels, MetaTable, CircleButton, EdgeTab y el tema forestTokens.",
  accent: "#d9b45a",
  tag: "arquitectura · isla",
};

export const ROUTES = [
  { path: "", title: "Inicio" },
  { path: "residencias", title: "Residencias" },
];

export const FACTS = [
  { k: "Superficie", v: "42.000 m² de parcela" },
  { k: "Viviendas", v: "186 · de 1 a 4 dormitorios" },
  { k: "Plantas", v: "8, con jardines en cubierta" },
  { k: "Zonas verdes", v: "El 46 % de la parcela" },
  { k: "Entrega", v: "Primer trimestre de 2028" },
];

export const AREAS = [
  { title: "Residencias", meta: "186 viviendas", color: "#3d5233", seed: 1 },
  { title: "Oficinas", meta: "6.400 m²", color: "#4a4a30", seed: 2 },
  { title: "Jardines", meta: "19.000 m²", color: "#2f4a3a", seed: 3 },
  { title: "Comercio", meta: "2.100 m²", color: "#5b4a2c", seed: 4 },
];

export const HOMES = [
  { name: "Tipo A · Copa", beds: "1 dormitorio", m2: "58 m²", from: "310.000 €" },
  { name: "Tipo B · Tronco", beds: "2 dormitorios", m2: "92 m²", from: "470.000 €" },
  { name: "Tipo C · Raíz", beds: "3 dormitorios", m2: "128 m²", from: "640.000 €" },
  { name: "Ático · Claro", beds: "4 dormitorios", m2: "210 m²", from: "1.150.000 €" },
];
