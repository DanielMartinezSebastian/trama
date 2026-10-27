"use client";

import Marquee from "@/components/ui/Marquee";
import FluidCursor from "@/components/ui/FluidCursor";
import ThornEmblem from "@/components/ui/ThornEmblem";

/*
 * La portada de Brasa (inspiración basada en meermohsin.me, docs/41 §1 y docs/55), con las medidas del DOM de la referencia en una vista de
 * 1440 × 900 pasadas a vw/vh:
 *   P1 degradado de 223,86° · P2 retrato a sangre con su sombra abajo · P3 cinta «Siempre iba a ser así.» a
 *   228 px por encima de la cara · P5 humo con el puntero (FluidCursor, opacidad 0,6) · P6 logo que gira como una tarjeta
 *   · P7 navegación en dos columnas · P8 párrafo · P9 roles · P10 CTA «EN LÍNEA · Hablemos» · P11 sonido · P12 barra de
 *   abajo con TENSIÓN · INMERSIÓN · IMPACTO. La máscara 3D (P4) la pone Relato encima de todo.
 */

const NAV = [
  ["INICIO", "SOBRE MÍ", "SERVICIOS", "TRABAJOS", "BLOG", "CONTACTO"],
  ["TIKTOK", "INSTAGRAM", "BEHANCE"],
];

export default function Portada() {
  return (
    <>
      <style>{CSS}</style>
      <section className="mmh" aria-label="Portada">
        <img className="mmh__cara" src="/img/inspiraciones/brasa/retrato.webp" alt="" />
        <div className="mmh__sombra" aria-hidden />
        <div className="mmh__cinta">
          <Marquee text="Siempre iba a ser así." separator="  " rows={1} direction="left" duration={22} variant="minimal" tone="fg" pauseOnHover={false} className="mmh__marquee" />
        </div>
        <p className="mmh__intro">
          Hago experiencias digitales que no solo se ven: se sienten. De la primera impresión a la interacción más pequeña, busco que cada experiencia sea clara, inmersiva y difícil de olvidar.
        </p>
        <p className="mmh__roles">
          NARRADOR VISUAL
          <br />
          DISEÑADOR UI/UX
          <br />
          DESARROLLADOR WEB 3D
        </p>
      </section>

      {/* lo fijo: logo, navegación, CTA, sonido, barra de abajo y humo */}
      <div className="mmh__logo" aria-hidden>
        <div className="mmh__logo-gira">
          <ThornEmblem height="100%" shape="wings" color="#f4f4f4" interactive={false} scale={1.05} />
        </div>
      </div>
      <nav className="mmh__nav" aria-label="Principal">
        {NAV.map((col, k) => (
          <ul key={k}>
            {col.map((t) => (
              <li key={t}>
                <a href="#">
                  {t}
                  <span aria-hidden>+</span>
                </a>
              </li>
            ))}
          </ul>
        ))}
      </nav>
      <a className="mmh__cta" href="#">
        <img src="/img/inspiraciones/brasa/avatar.webp" alt="" />
        <span>
          <small>
            EN LÍNEA <i aria-hidden />
          </small>
          Hablemos
        </span>
      </a>
      <button className="mmh__sonido" type="button" aria-label="Sonido">
        {Array.from({ length: 34 }, (_, k) => (
          <i key={k} style={{ animationDelay: `${(k % 7) * -0.13}s` }} />
        ))}
      </button>
      <div className="mmh__barra" aria-hidden>
        <b>+</b>
        <span>TENSIÓN</span>
        <b>+</b>
        <span>INMERSIÓN</span>
        <b>+</b>
        <span>IMPACTO</span>
        <b>+</b>
      </div>
      <FluidCursor color="#e60000" />
    </>
  );
}

const CSS = `
.mmh { position: relative; z-index: 2; height: 100vh; overflow: hidden; background-color: #000;
  background-image: linear-gradient(223.86deg, rgba(192,4,6,.894) 0%, rgba(0,0,0,.894) 89.5%); font-family: var(--font-stack), var(--font-sans), sans-serif; }
/* el retrato a sangre: en blanco y negro, multiplicado por el degradado (lo claro se vuelve rojo, como la luz de la
   referencia); la sombra lo funde con el negro abajo */
.mmh__cara { position: absolute; left: 50%; top: 2vh; height: 108vh; width: auto; transform: translateX(-50%);
  filter: grayscale(.55) sepia(.6) saturate(3.2) hue-rotate(-28deg) brightness(1.15) contrast(1.1); mix-blend-mode: screen;
  -webkit-mask-image: radial-gradient(ellipse 34% 52% at 50% 46%, #000 55%, transparent 100%); mask-image: radial-gradient(ellipse 34% 52% at 50% 46%, #000 55%, transparent 100%); }
.mmh__sombra { position: absolute; left: 0; right: 0; bottom: 0; height: 55vh; background: linear-gradient(to bottom, transparent, #000 85%); }
.mmh__cinta { position: absolute; left: 0; right: 0; top: 37.3vh; }
.mmh__marquee, .mmh__marquee * { color: #fff; font-family: var(--font-stack), sans-serif !important; font-weight: 200 !important; line-height: 1; letter-spacing: -0.02em; font-size: 15.83vw !important; text-transform: none; }
.mmh__intro, .mmh__roles { font-family: var(--font-stack), sans-serif !important; }
.mmh__intro { position: absolute; left: 3vw; top: 21vh; width: 21vw; margin: 0; font-size: max(11px, 0.92vw); line-height: 1.2; font-weight: 200; color: #f5f5f5; }
.mmh__roles { position: absolute; right: 3vw; top: 70vh; margin: 0; text-align: right; font-size: max(11px, 1vw); line-height: 1.25; font-weight: 200; color: #f5f5f5; }
.mmh__logo { position: fixed; left: 2vw; top: 3vh; width: 120px; height: 120px; z-index: 2100; perspective: 600px; pointer-events: none; }
.mmh__logo-gira { width: 100%; height: 100%; animation: mmh-gira 5s linear infinite; transform-style: preserve-3d; }
@keyframes mmh-gira { to { transform: rotateY(360deg); } }
.mmh__nav { position: fixed; right: 10.5vw; top: 3.3vh; z-index: 1000; display: flex; gap: 2.8vw; font-family: var(--font-stack), sans-serif; }
.mmh__nav ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; align-content: start; }
.mmh__nav a { display: inline-flex; gap: 6px; color: #f5f5f5; text-decoration: none; font-size: 14.4px; font-weight: 200; letter-spacing: 0.02em; }
.mmh__nav a span { opacity: 0; transform: rotate(-90deg); transition: opacity .25s, transform .35s; }
.mmh__nav a:hover span { opacity: 1; transform: none; }
.mmh__cta { position: fixed; right: 2vw; bottom: 9vh; z-index: 1000; display: flex; gap: 10px; align-items: center; padding: 5px 10px 5px 6px;
  border: 1px solid rgba(255,255,255,.25); background: rgba(0,0,0,.35); color: #f1f1f1; text-decoration: none; font-family: var(--font-stack), sans-serif; transition: background .3s, color .3s; }
.mmh__cta:hover { background: #cf0808; color: #000; border-color: rgba(221,8,8,.486); }
.mmh__cta img { width: 29px; height: 32px; object-fit: cover; filter: grayscale(1) sepia(1) saturate(5) hue-rotate(-40deg); }
.mmh__cta span { display: grid; font-size: 13.2px; line-height: 1.15; }
.mmh__cta small { display: flex; align-items: center; gap: 6px; font-size: 9px; letter-spacing: .08em; }
.mmh__cta i { width: 6px; height: 6px; border-radius: 50%; animation: mmh-vivo 1.5s infinite; }
@keyframes mmh-vivo { 0% { background: #0c0c0c; box-shadow: 0 0 #111111b3; transform: scale(.8); } 50% { background: #ff2b2b; box-shadow: 0 0 0 8px #ff2b2b00; transform: scale(1); } 100% { background: #111; transform: scale(.8); } }
.mmh__sonido { position: fixed; left: 3vw; bottom: 9.5vh; z-index: 500; display: flex; gap: 2px; align-items: center; height: 12px; padding: 0; border: 0; background: none; cursor: pointer; mix-blend-mode: difference; }
.mmh__sonido i { width: 2px; height: 10px; background: #ff3030; animation: mmh-onda .9s ease-in-out infinite alternate; }
@keyframes mmh-onda { from { transform: scaleY(.25); } to { transform: scaleY(1); } }
.mmh__barra { position: fixed; left: 0; right: 0; bottom: 1vh; height: 47px; z-index: 900; display: flex; justify-content: space-around; align-items: center; pointer-events: none;
  color: #f5f5f5; font-family: var(--font-stack), sans-serif; font-size: 12px; font-weight: 400; letter-spacing: .06em; }
.mmh__barra b { font-weight: 200; font-size: 22px; animation: mmh-cruz 6s linear infinite; }
@keyframes mmh-cruz { to { transform: rotate(360deg); } }
@media (max-width: 720px) { .mmh__nav, .mmh__intro { display: none; } .mmh__marquee { font-size: 26vw !important; } }
`;
