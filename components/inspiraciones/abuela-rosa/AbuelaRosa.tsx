"use client";

import Marquee from "@/components/ui/Marquee";
import { abuelaHref } from "./enlaces";

/*
 * Abuela Rosa, mojo picante: réplica de Peppa Sauce (docs/50 §3.8). Dos tintas (azul noche y crema) como una serigrafía,
 * una grotesca ancha y gruesa; el bote se queda fijo en el centro mientras la página pasa por detrás, tarjetas con marco
 * de etiqueta antigua (estrellas, llamas, gotas y lunas en las esquinas), una cinta de compra fija (Marquee), los
 * maridajes en palabras gigantes y lo que no, con humor. El bote es CSS (y en la tienda, uno por sabor). Cabecera con la
 * cinta, pie y demás páginas en Sitio.tsx (docs/56).
 */

export const Esquinas = () => (
  <>
    <i className="ar-esq ar-esq--a" aria-hidden>✦</i>
    <i className="ar-esq ar-esq--b" aria-hidden>✶</i>
    <i className="ar-esq ar-esq--c" aria-hidden>❍</i>
    <i className="ar-esq ar-esq--d" aria-hidden>☾</i>
  </>
);

const Huevo = () => <svg viewBox="0 0 100 120" aria-hidden><path d="M50 8C28 8 12 50 12 76c0 22 17 36 38 36s38-14 38-36C88 50 72 8 50 8Z" /><path d="M20 58l14-10 10 12 12-14 12 12 12-10" className="ar-hueco" /></svg>;
const Pollo = () => <svg viewBox="0 0 120 110" aria-hidden><path d="M30 70c0-22 14-38 32-38 6-14 22-18 28-8-8 2-10 8-8 14 16 8 22 24 14 40-8 14-26 20-44 18-14-2-22-12-22-26Z" /><path d="M48 90l-4 16M70 92l2 14" className="ar-hueco" /></svg>;
const Toro = () => <svg viewBox="0 0 140 100" aria-hidden><path d="M20 40c10-6 20-6 30 0h40c10-6 22-6 30 0-6 6-14 8-20 6l-6 20c-4 16-14 24-34 24S30 82 26 66l-6-20c-6 2-12 0-16-6 6-4 12-4 16 0Z" /></svg>;
const Hoja = () => <svg viewBox="0 0 100 120" aria-hidden><path d="M50 6C20 30 14 70 50 114 86 70 80 30 50 6Z" /><path d="M50 20v90" className="ar-hueco" /></svg>;

export default function AbuelaRosa() {
  return (
    <>
      <div className="ar-bote" aria-hidden>
        <span className="ar-bote__tapon" />
        <span className="ar-bote__cuello"><b>ABUELA ROSA</b></span>
        <span className="ar-bote__cuerpo">
          <span className="ar-bote__etiqueta"><small>5 FL OZ</small><b>ABUELA<br />ROSA<br />MOJO<br />PICÓN</b><small>148 ML</small></span>
        </span>
      </div>

      <section className="ar-tripticos">
        <article className="ar-marco">
          <Esquinas />
          <h2>LA ALEGRÍA DEL MOJO PICÓN</h2>
          <p>«ABUELA ROSA» LLEVA CASI 50 AÑOS HACIENDO ESTA SALSA EN MORTERO PARA SU FAMILIA Y SUS AMIGOS. REPARTIENDO LA ALEGRÍA DEL MOJO.</p>
        </article>
        <article className="ar-marco ar-sello">
          <Esquinas />
          <span className="ar-sello__anillo">
            <svg viewBox="0 0 200 200" aria-hidden>
              <defs><path id="ar-circ" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" /></defs>
              <text><textPath href="#ar-circ">ABUELA ROSA ✦ MOJO PICÓN ✦ QUE ARDE ✦</textPath></text>
            </svg>
          </span>
        </article>
        <article className="ar-marco ar-fuego">
          <Esquinas />
          <h2>MOJO PICÓN CANARIO</h2>
          <svg viewBox="0 0 100 140" className="ar-llama" aria-hidden><path d="M50 4c10 30 40 44 40 82 0 28-18 48-40 48S10 114 10 90c0-22 14-30 18-48 8 12 6 22 14 26C48 48 40 26 50 4Z" /><path d="M50 70c6 14 18 20 18 36 0 12-8 20-18 20s-18-8-18-18c0-10 8-14 10-22 4 6 4 10 8 12 2-10-2-18 0-28Z" className="ar-hueco" /></svg>
          <b>2.400 SHU</b>
        </article>
      </section>

      <section className="ar-marco ar-ancho">
        <Esquinas />
        <Marquee variant="minimal" text="¿QUÉ ES EL MOJO?" separator="  ✶  " rows={1} duration={24} className="ar-marco__cinta" />
        <h2 className="ar-gigante">UN SABOR<br />DE CANARIAS</h2>
        <p>LA ISLA QUE QUIZÁ CREÍAS EN ÁFRICA ES ESPAÑA, Y EN SUS COCINAS SE MACHACAN AJO, PIMIENTA PALMERA, COMINO Y ACEITE DESDE HACE SIGLOS. CADA FAMILIA TIENE SU RECETA; ESTA ES LA DE LA ABUELA ROSA.</p>
      </section>

      <section className="ar-maridajes">
        <div className="ar-fila"><Huevo /><small>LO MEJOR<br />CON</small><b>HUEVO</b><small>LO MEJOR<br />CON</small><Huevo /></div>
        <div className="ar-fila"><Pollo /><small>VA GENIAL<br />CON</small><b>POLLO</b><small>VA GENIAL<br />CON</small><Pollo /></div>
        <div className="ar-fila"><Toro /><b>FILETE</b><small>Y CON<br />PAPAS</small><Toro /></div>
        <a href={abuelaHref("recetas")} className="ar-mas">RECETAS CON MOJO →</a>
      </section>

      <section className="ar-tripticos">
        <article className="ar-marco">
          <Esquinas />
          <h2>DE NUESTRA FAMILIA A LA TUYA</h2>
          <p>TE TRAEMOS UNA TRADICIÓN DE GENERACIONES: UNA RECETA PROBADA DE MOJO EXPLOSIVO, DE NUESTRA FAMILIA A LA TUYA.</p>
        </article>
        <article className="ar-marco ar-abuela">
          <Esquinas />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/inspiraciones/abuela-rosa/abuela.webp" alt="" />
        </article>
        <article className="ar-marco">
          <Esquinas />
          <h2>HECHO A MORTERO</h2>
          <p>SIN ATAJOS. TODAVÍA A MORTERO, COMO SE HA HECHO LOS ÚLTIMOS CIEN AÑOS.</p>
          <a href={abuelaHref("historia")} className="ar-mas">NUESTRA HISTORIA →</a>
        </article>
      </section>

      <section className="ar-todo">
        <small>ESTA<br />SALSA<br />NO ES<br />PARA</small>
        <b>TODO</b>
        <small>ESTA<br />SALSA<br />NO ES<br />PARA</small>
      </section>

      <section className="ar-marco ar-ancho">
        <Esquinas />
        <Marquee variant="minimal" text="¿QUÉ LLEVA EL MOJO?" separator="  ✶  " rows={1} duration={24} className="ar-marco__cinta" />
        <h2 className="ar-gigante">SABOR<br />Y FUEGO</h2>
        <p>LA MAYORÍA DE LAS SALSAS PICANTES SABEN A VINAGRE CON UN FONDO DE PICANTE Y POCO MÁS. EL MOJO DE LA ABUELA ROSA ES OTRA COSA: AJO, PIMIENTA Y COMINO PRIMERO, Y EL FUEGO DESPUÉS.</p>
      </section>

      <section className="ar-maridajes ar-maridajes--no">
        <div className="ar-fila"><Hoja /><small>NO LO<br />ESTROPEES CON</small><b>MENTA</b><small>NO LO<br />ESTROPEES CON</small><Hoja /></div>
        <div className="ar-fila"><Hoja /><small>OLVÍDATE<br />DE LA</small><b>FRAMBUESA</b><Hoja /></div>
        <div className="ar-fila"><b>CEREALES</b><small>NI SE TE<br />OCURRA</small></div>
      </section>

      <section className="ar-final">
        <h2 className="ar-gigante">COMPRA<br />ESTA COSA</h2>
        <a href={abuelaHref("tienda/mojo-picon")} className="ar-comprar" id="comprar">COMPRAR · 12 €</a>
      </section>
    </>
  );
}
