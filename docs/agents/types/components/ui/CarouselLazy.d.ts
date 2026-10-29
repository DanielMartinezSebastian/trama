import type { CarouselProps } from "./Carousel.js";
import "./swiperCss.js";
/**
 * `Carousel` con el JS de Swiper (~35 KB gz) aparte: lo usan las secciones con `layout="carousel"`, que así no lo envían
 * cuando pintan rejilla. Se renderiza en servidor igual que `Carousel` (el CSS de Swiper va estático, sin parpadeo); solo
 * en una navegación en cliente se ve un instante la rejilla de respaldo mientras llega el fragmento.
 */
export default function CarouselLazy(props: CarouselProps): import("react").JSX.Element;
