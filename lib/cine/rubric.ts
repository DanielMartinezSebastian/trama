import type { Eje } from "./schema";

/**
 * Rúbrica de 1 a 5 por eje de la ficha (docs/26 §4), con anclas descritas: se puntúa igual la referencia y la recreación,
 * y la diferencia dice qué depurar. Las anclas describen lo que se ve, no la técnica: un 5 en «post» puede ser una sola
 * pasada muy bien medida. Junto a cada nota va el porqué (`Rubrica` en schema.ts).
 */
export const EJE_NOMBRE: Record<Eje, string> = {
  camara: "Plano y cámara",
  luz: "Luz y materiales",
  atmosfera: "Atmósfera",
  post: "Posprocesado",
  movimiento: "Movimiento",
  interaccion: "Interacción",
  interfaz: "Integración con la interfaz",
  presupuesto: "Presupuesto técnico",
};

export const ANCLAS: Record<Eje, [string, string, string, string, string]> = {
  camara: [
    "Cámara por defecto: encuadre centrado sin intención, objetivo genérico, el objeto corta mal en móvil.",
    "Encuadre correcto pero plano; movimientos lineales o de golpe; sin idea de lente.",
    "Planos con intención (tamaño y ángulo elegidos), movimientos suaves con curva; algún corte o meseta mal medido.",
    "Lenguaje de cámara coherente: cada plano cuenta algo, curvas con anticipación y llegada, mesetas para leer, lente elegida.",
    "Dirección de fotografía: ritmo de planos, profundidad de campo y cambios de foco al servicio del relato; nunca se nota la máquina.",
  ],
  luz: [
    "Luz ambiente plana o un solo foco duro; materiales por defecto; nada parece de un material concreto.",
    "Entorno genérico y una luz principal; PBR correcto pero sin carácter; sombras ausentes o duras.",
    "Esquema de luz reconocible (principal, relleno, contra) o un HDRI elegido; materiales creíbles; sombras suaves.",
    "La luz modela el objeto y separa del fondo; materiales con matiz (rugosidad variable, barniz, transmisión bien medida).",
    "Luz con intención narrativa que cambia por capítulo; materiales que se sienten al tacto; color de luz y sombra controlado.",
  ],
  atmosfera: [
    "Fondo vacío o de color plano; el objeto flota sin espacio.",
    "Algo de niebla o degradado que no relaciona el objeto con el espacio.",
    "Profundidad clara (niebla, fondo desenfocado o partículas) que sitúa el objeto.",
    "Atmósfera con volumen (rayos, polvo, volumétricos) que acompaña la luz.",
    "El aire se lee como material: la atmósfera responde al movimiento y a la luz, y define el tono de la pieza.",
  ],
  post: [
    "Sin posprocesado, con dientes de sierra, o con efectos de plantilla subidos al máximo.",
    "Uno o dos efectos con valores por defecto (bloom que lava, viñeta marcada).",
    "Pila sobria y medida: tone mapping elegido, bloom con umbral, antialias; nada se nota como efecto.",
    "Pila al servicio del tono (grano fino, aberración en bordes, DOF físico, LUT propia) y estable en movimiento.",
    "Imagen de cine: la pila no se distingue de la fotografía; cambia con intención por capítulo o transición.",
  ],
  movimiento: [
    "Animaciones lineales o de golpe; todo se mueve a la vez.",
    "Curvas estándar (ease-out) sin variación; sin anticipación ni inercia.",
    "Curvas elegidas por movimiento, escalonado entre elementos; alguna inercia.",
    "Anticipación, inercia y solapamiento visibles; el ritmo de la página tiene respiración.",
    "Movimiento con personalidad propia y coherente en toda la pieza; las transiciones encadenan sin costuras.",
  ],
  interaccion: [
    "La escena no responde, o responde con saltos.",
    "Respuesta básica (seguir al puntero) sin suavizado.",
    "Respuesta suavizada y proporcionada; algún elemento clicable con estado.",
    "La interacción descubre algo (revela, separa, cambia de material) y se siente física.",
    "Juguete: invita a quedarse; la respuesta tiene peso, sonido y consecuencias en el relato.",
  ],
  interfaz: [
    "Texto encima del lienzo sin relación con la escena; tapa el objeto.",
    "Texto legible pero desconectado de lo que hace la cámara.",
    "Texto y escena coordinados por capítulos; capas resueltas (qué va delante del 3D).",
    "Texto que entra con la cámara, anotaciones ancladas al objeto, tipografía integrada en la escena.",
    "Interfaz y escena son una sola pieza: la tipografía vive en el espacio 3D sin perder accesibilidad.",
  ],
  presupuesto: [
    "Se cae por debajo de 30 fps en un portátil o descarga decenas de MB antes de pintar.",
    "Fluido en escritorio, roto o en blanco en móvil; sin respaldo.",
    "Fluido en escritorio y móvil medio; carga perezosa; respaldo sin WebGL.",
    "Presupuesto medido por dispositivo (DPR, calidad), pantalla de carga real, menos de 100 llamadas de dibujo.",
    "Todo lo anterior con WebGPU donde ayuda, degradación elegante y carga casi instantánea.",
  ],
};
