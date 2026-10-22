/** Cota — topografía con dron y gemelos digitales en Zaragoza (ficticia). Un terreno medido punto a punto, contado en cinco
 * pasos con una nube de puntos 3D (`PointCloud`, docs/23). Datos puros. */

export const SLUG = "cota";

export const meta = {
  slug: SLUG,
  name: "Cota",
  title: "Cota · topografía con dron y gemelos digitales",
  blurb:
    "Topografía con dron contada con una nube de puntos 3D procedural (PointCloud del kit): un barrido que revela el terreno con una estela de luz, color por cota, línea de medida con su cifra, edificios que se levantan como gemelo digital y una lupa que lee la X/Y/Z bajo el ratón (un clic lanza un pulso de escaneo). Recorrido en cinco pasos con useScrollStory, servicios, cifras y contacto.",
  accent: "#ffb347",
  tag: "datos · nube de puntos · 3D",
};

export const ROUTES = [{ path: "", title: "Inicio" }];

export const BRAND = {
  name: "Cota",
  legal: "Cota Geomática S. L. (empresa ficticia de demostración)",
  city: "Zaragoza",
  email: "hola@cota.example",
  phone: "+34 976 000 222",
  phoneHref: "tel:+34976000222",
};

export type Chapter = { id: string; k: string; title: string; thesis: string; what: string; stat: string };

export const CHAPTERS: Chapter[] = [
  { id: "vuelo", k: "01", title: "Vuelo", thesis: "Un dron, un plan de vuelo y una mañana.", what: "Planificamos la pasada sobre el terreno y volamos con puntos de control en el suelo. Sin cortar la obra.", stat: "120 ha por vuelo" },
  { id: "escaneo", k: "02", title: "Escaneo", thesis: "Millones de puntos, cada uno con su altura.", what: "LIDAR y fotogrametría: el relieve entero, incluido lo que hay bajo los árboles. El color es la cota: del valle a la cumbre.", stat: "± 2 cm de precisión" },
  { id: "medicion", k: "03", title: "Medición", thesis: "Distancias, desniveles y volúmenes sin pisar el terreno.", what: "Medimos sobre la nube: perfiles, curvas de nivel y el volumen exacto de un desmonte. Prueba: pasa el ratón por el terreno.", stat: "Volúmenes en 24 h" },
  { id: "gemelo", k: "04", title: "Gemelo digital", thesis: "El solar, como modelo para decidir.", what: "Levantamos lo construido y lo proyectado sobre el terreno real. Para licencias, mediciones de obra y para que todos vean lo mismo.", stat: "BIM · IFC · DWG" },
];

export const SERVICES = [
  { title: "Topografía con dron", text: "Levantamientos, curvas de nivel y modelos digitales del terreno.", stat: "2 cm", span: "2x1" },
  { title: "LIDAR", text: "El suelo bajo la vegetación.", span: "1x1" },
  { title: "Volúmenes", text: "Acopios, desmontes y rellenos, medidos cada semana.", span: "1x1" },
  { title: "Gemelos digitales", text: "Obra y proyecto sobre el terreno real, en BIM.", stat: "IFC", span: "1x2" },
  { title: "Inspección", text: "Cubiertas, fachadas y líneas sin andamios.", span: "1x1" },
  { title: "Patrimonio", text: "Escaneo de edificios históricos para restauración.", span: "2x1" },
] as const;

/** cifras («valor|sufijo|texto», el formato de StatsSection) */
export const STATS = "1400| ha|levantadas en 2025\n2| cm|de precisión en planta\n24| h|del vuelo al informe\n312||obras medidas cada semana";
