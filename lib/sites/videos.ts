/**
 * Vídeos de las demos (`public/video/<tema>/…`, generados con `npm run videos:fetch` a partir de Wikimedia Commons con
 * licencias que permiten redistribuir: CC0, dominio público y CC BY). Clips de 7–12 s, 1280 px, sin audio, con fundido al
 * principio y al final para usarlos en bucle, y un póster `.jpg` del primer fotograma. La atribución está en
 * `video-credits.json` y se muestra en `/creditos`.
 */
import credits from "./video-credits.json";

export type VideoTopic = "oceano" | "costa" | "naturaleza" | "ciudad" | "cielo";
export type Video = {
  file: string;
  poster: string;
  topic: string;
  /** descripción en español: texto alternativo (`aria-label`) del vídeo */
  alt: string;
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  page: string;
  duration: number;
  width: number;
  height: number;
  /** rutas públicas: `<video src={v.src} poster={v.posterSrc}>` */
  src: string;
  posterSrc: string;
};

const all: Video[] = (credits as Omit<Video, "src" | "posterSrc">[]).map((c) => ({ ...c, src: `/video/${c.file}`, posterSrc: `/video/${c.poster}` }));

/** Todos los vídeos de un tema, en orden. */
export const videos = (topic: VideoTopic): Video[] => all.filter((v) => v.topic === topic);
/** Un vídeo de un tema por posición (da la vuelta si te pasas). */
export const video = (topic: VideoTopic, i = 0): Video => {
  const list = videos(topic);
  return list[((i % list.length) + list.length) % list.length];
};
export const allVideos = all;
