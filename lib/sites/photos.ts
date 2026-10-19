/**
 * Fotografías de las demos (`public/img/<tema>/…`, descargadas con `npm run images:fetch` de Wikimedia Commons con licencias que
 * permiten redistribuir: CC0, dominio público y CC BY). La atribución de cada una está en `photo-credits.json` y se muestra en
 * `/creditos`; las demos enlazan a esa página desde el pie, sin recargar el diseño.
 */
import credits from "./photo-credits.json";

export type PhotoTopic = "arquitectura" | "interiores" | "eventos" | "objetos" | "estudio" | "naturaleza" | "ciudad" | "gastronomia";
export type Photo = { file: string; topic: string; title: string; author: string; license: string; licenseUrl: string; page: string; width: number; height: number; src: string };

const all: Photo[] = (credits as Omit<Photo, "src">[]).map((c) => ({ ...c, src: `/img/${c.file}` }));

/** Todas las fotos de un tema, en orden. */
export const photos = (topic: PhotoTopic): Photo[] => all.filter((p) => p.topic === topic);
/** Una foto de un tema por posición (da la vuelta si te pasas). */
export const photo = (topic: PhotoTopic, i = 0): Photo => {
  const list = photos(topic);
  return list[((i % list.length) + list.length) % list.length];
};
export const allPhotos = all;
