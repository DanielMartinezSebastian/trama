/* Datos de No mires abajo (docs/58): reglas de la partida, decisiones y frases de la gente. Datos puros. */

export const META = 1e12;
export const INICIO = { dinero: 792e6, gente: 40, enfado: 12, comision: 5 };

export type Accion = { id: string; nombre: string; nota: string; coste: number; enfado: number; gente: number; multi: number; repetible: boolean };

export const ACCIONES: Accion[] = [
  { id: "feria", nombre: "Una distracción", nota: "Fuegos artificiales con tu cara. Baja el enfado.", coste: 40e6, enfado: -22, gente: 6, multi: 1, repetible: true },
  { id: "sueldos", nombre: "Subir los sueldos", nota: "Solo un poquito. Baja el enfado para siempre.", coste: 180e6, enfado: -12, gente: 0, multi: 0.92, repetible: true },
  { id: "app", nombre: "Lanzar una aplicación", nota: "Más gente a tus pies. Ganas más, se enfadan antes.", coste: 300e6, enfado: 8, gente: 34, multi: 1.2, repetible: true },
  { id: "periodico", nombre: "Comprar un periódico", nota: "Ahora las noticias son sobre lo bien que hueles.", coste: 2e9, enfado: -30, gente: 0, multi: 1, repetible: false },
  { id: "cohete", nombre: "Construir un cohete", nota: "No sirve para nada. Multiplica tu fortuna, no sabemos cómo.", coste: 12e9, enfado: 16, gente: 0, multi: 3, repetible: false },
  { id: "isla", nombre: "Comprar una isla", nota: "Por si acaso. Te da tiempo cuando todo arde.", coste: 90e9, enfado: -40, gente: 0, multi: 2, repetible: false },
];

export const FRASES = {
  tranquila: ["hola", "qué alto", "buenas", "¿llueve?", "vale", "ok", "ah, hola", "qué zapatos"],
  molesta: ["oye", "¿y mi nómina?", "pesas", "me pisas", "¡eh!", "¿perdona?"],
  furiosa: ["¡BÁJATE!", "¡abajo!", "¡tus impuestos!", "¡YA BASTA!", "¡a por los cordones!"],
};

export const PASOS = [
  { t: "Gana", d: "Cuanta más gente tengas a tus pies y más alta sea tu comisión, más dinero entra cada segundo." },
  { t: "Vigila", d: "La comisión enfada. Si el enfado llega a 100, te tiran. No hay segunda vida: eres multimillonario, no un gato." },
  { t: "Distrae", d: "Gasta en distracciones, sueldos y periódicos para que no suban por tus cordones." },
  { t: "Llega", d: "Gana cuando tengas un billón. Nadie te felicitará." },
];

export const PAGINAS = [
  { path: "jugar", titulo: "Jugar" },
  { path: "como-jugar", titulo: "Cómo jugar" },
  { path: "clasificacion", titulo: "Clasificación" },
  { path: "creditos", titulo: "Créditos" },
];
