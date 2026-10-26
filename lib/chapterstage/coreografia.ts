/*
 * Coreografía de `ChapterStage` (docs/30 §3), medida en meermohsin.me con el gancho del DOM. Todo en pantallas de scroll
 * desde que la sección se fija: en cada frontera la palabra saliente sube con curva en S en las 0,38 pantallas antes
 * (LEGACY: 0 → −329 px en 273 px de scroll a 720 px de alto) y la entrante llega desde abajo frenando en las 0,45 después
 * (UI - UX: +257 → 0 en 327 px). La tarjeta cambia de imagen en la frontera, con el fallo de señal en su pico.
 */

export const SALIDA = 0.38;
export const ENTRADA = 0.45;
export const FALLO = 0.45;
/** la primera palabra no está al fijarse la sección: entra subiendo 0,41 pantallas después (LEGACY a los 3 587 px) */
export const PRIMERA = 0.41;
/** y casi de golpe (0,13 s en la referencia, con un rebote corto de las letras): 0,12 pantallas */
export const ENTRADA_PRIMERA = 0.12;

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** power2.inOut */
export const enS = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
/** power3.out */
export const frena = (t: number) => 1 - (1 - t) ** 3;

/** fronteras de los capítulos (pantallas desde el inicio del fijado) a partir de lo que dura cada uno */
export function fronteras(duraciones: number[]) {
  const b = [0];
  for (const d of duraciones) b.push(b[b.length - 1] + d);
  return b;
}

/** desplazamiento vertical de la palabra k (en alturas de la máscara: 1 = debajo, 0 = en su sitio, −1,28 = arriba) */
export function posicionPalabra(k: number, y: number, b: number[]) {
  const n = b.length - 1;
  const entra = k === 0 ? frena(clamp01((y - PRIMERA) / ENTRADA_PRIMERA)) : frena(clamp01((y - b[k]) / ENTRADA));
  const sale = k === n - 1 ? 0 : enS(clamp01((y - (b[k + 1] - SALIDA)) / SALIDA));
  return (1 - entra) * 1 - sale * 1.28;
}

/** capítulo activo (el de la tarjeta y la barra) y la fuerza del fallo de señal (1 en la frontera) */
export function estadoTarjeta(y: number, b: number[]) {
  const n = b.length - 1;
  let activo = 0;
  for (let k = 1; k < n; k++) if (y >= b[k]) activo = k;
  let fallo = 0;
  for (let k = 1; k < n; k++) fallo = Math.max(fallo, 1 - Math.abs(y - b[k]) / FALLO);
  return { activo, fallo: clamp01(fallo) };
}
