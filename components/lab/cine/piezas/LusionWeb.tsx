"use client";

import { useEffect, useState } from "react";
import CrossCluster from "@/components/ui/CrossCluster";
import LineDraw from "@/components/ui/LineDraw";
import FloatingVideo from "@/components/ui/FloatingVideo";
import ScrollExpand from "@/components/ui/ScrollExpand";
import SmoothScroll from "@/components/ui/SmoothScroll";

/*
 * La portada de lusion.co en el banco (docs/43), con piezas del kit. En la referencia todo es un lienzo WebGL bajo una capa
 * de DOM fija; aquí el DOM es la página y el 3D va donde hace falta:
 *   - cabecera fija: logo, sonido, «Let's talk» (oscuro, con flecha y punto) y «Menu» (claro, con dos puntos, que abre
 *     enlaces y el boletín);
 *   - portada: tarjeta oscura con el racimo de cruces (CrossCluster) y «SCROLL TO EXPLORE» entre cruces;
 *   - «Bold Ideas, Brought to Life» con la cinta azul que se dibuja con el scroll (LineDraw tube), el párrafo y «Our
 *     approach»; la tarjeta pequeña crece hasta el reel a sangre con «PLAY ● REEL» (ScrollExpand);
 *   - «Featured Work»: doce proyectos en dos columnas (imagen, etiquetas y título) y «See all projects»;
 *   - «Where Creative Ideas Become Immersive Experiences» con la cinta cian, los párrafos y la tableta con la Tierra que
 *     crece hasta la escena negra del astronauta.
 */

const PROYECTOS = [
  ["Oryzo AI", "/img/objetos/01-wood-table-in-front-of-white-wall-unsplash.jpg", "Concept · Web · Design · Development · 3D · Animation"],
  ["Atlas Motion", "/img/naturaleza/02-lush-green-pine-forest-unsplash.jpg", "Concept · Web · Design · Development · 3D"],
  ["Devin AI", "/img/estudio/04-workspace-unsplash.jpg", "Web · Design · Development · 3D"],
  ["Of The Oak", "/img/naturaleza/01-root-covered-path-through-green-forest-unsplash.jpg", "Web · Design · Development · 3D · Animation"],
  ["Everswap", "/img/arquitectura/02-glass-dome-with-criss-cross-unsplash.jpg", "Concept · Web · Design · Development · 3D"],
  ["Porsche: Dream Machine", "/img/deporte/01-old-arc-de-triomphe-photograph-with-cars-unsplas.jpg", "Concept · 3D Illustration · Motion · Web"],
  ["Synthetic Human", "/img/eventos/03-front-row-audience-unsplash.jpg", "Web · Design · Development · 3D"],
  ["Meta: Spatial Fusion", "/img/ciudad/03-colorful-asian-street-market-unsplash.jpg", "Web · Design · Development · 3D"],
  ["Spaace · NFT Marketplace", "/img/interiores/03-pictures-on-wall-with-table-unsplash.jpg", "Web · Design · Development · 3D · Web3"],
  ["DDD 2024", "/img/eventos/02-concert-photos-unsplash.jpg", "Web · Design · Development · 3D"],
  ["Choo Choo World", "/img/verano/01-positano-s-sunset-unsplash.jpg", "Concept · Web · Game design · 3D"],
  ["Soda Experience", "/img/gastronomia/02-fresh-bread-unsplash.jpg", "AR · Development · 3D"],
] as const;

const REEL = ["/video/cielo/01-nubes-atardecer.mp4", "/video/oceano/01-arrecife.mp4", "/video/ciudad/01-rascacielos-noche.mp4", "/video/oceano/03-delfines-hawai.mp4"];

/** cambia de clip cada 3 s, con un fundido: el reel de la referencia */
function Reel() {
  const [k, setK] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setK((x) => (x + 1) % REEL.length), 3000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="lw-reel">
      {REEL.map((src, i) => (
        <video key={src} src={src} muted loop playsInline autoPlay preload="metadata" style={{ opacity: i === k ? 1 : 0 }} />
      ))}
    </div>
  );
}

function Pastilla({ texto, oscura = false }: { texto: string; oscura?: boolean }) {
  return (
    <a href="#" className={`lw-pill ${oscura ? "is-dark" : ""}`}>
      <i aria-hidden />
      {texto}
    </a>
  );
}

export default function LusionWeb() {
  const [menu, setMenu] = useState(false);
  return (
    <div className="lw">
      <style>{CSS}</style>
      {/* la sensación de la referencia: scroll virtual con inercia larga (docs/42) */}
      <SmoothScroll feel="cinematic" syncGsap={false} />

      <header className="lw-head">
        <a className="lw-logo" href="#" aria-label="Lusion">
          LUSION
        </a>
        <div className="lw-head__right">
          <button className="lw-sound" type="button" aria-label="Sonido">
            {[0, 1, 2, 3].map((i) => (
              <i key={i} style={{ animationDelay: `${i * -0.2}s` }} />
            ))}
          </button>
          <a className="lw-talk" href="#">
            <span aria-hidden>→</span>
            Let&apos;s talk
            <i aria-hidden />
          </a>
          <button className="lw-menu" type="button" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
            {menu ? "Close" : "Menu"}
            <span aria-hidden>
              <i />
              <i />
            </span>
          </button>
          {menu && (
            <div className="lw-dropdown">
              <nav>
                {["Home", "About us", "Projects", "Contact"].map((t) => (
                  <a key={t} href="#">
                    {t}
                  </a>
                ))}
              </nav>
              <div className="lw-news">
                <h3>
                  Subscribe to
                  <br />
                  our newsletter
                </h3>
                <form onSubmit={(e) => e.preventDefault()}>
                  <input type="email" placeholder="Your email" aria-label="Email" />
                  <button type="submit" aria-label="Suscribirse">
                    →
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* portada */}
      <section className="lw-hero">
        <p className="lw-hero__lead">We create 3D visual storytelling and interactive web experiences that help brands stand out</p>
        <div className="lw-hero__card">
          <CrossCluster height="100%" colors={["#061dfb", "#bcbcbc", "#111111"]} />
        </div>
        <div className="lw-rule" aria-hidden>
          <b>+</b>
          <b>+</b>
          <span>SCROLL TO EXPLORE</span>
          <b>+</b>
          <b>+</b>
        </div>
      </section>

      {/* Bold Ideas */}
      <section className="lw-bold">
        {/* la cinta entra por arriba a la izquierda, cruza el titular y baja a rodear la tarjeta del reel (pantallas 04–06) */}
        <LineDraw className="lw-ribbon lw-ribbon--azul" tube trigger="scroll" scrollRange={[0.8, -0.9]} strokeWidth={17} color="#2f3cff" viewBox="0 0 1440 1500" d="M-60 30C120 40 260 110 330 220C410 350 430 520 420 700C410 860 330 960 210 1010C80 1060 60 1200 200 1260C360 1330 560 1250 600 1110C630 1000 560 930 470 950" />
        <h2>
          Bold Ideas,
          <br />
          Brought to Life
        </h2>
        <div className="lw-bold__text">
          <p>We combine design, motion, 3D, and development to create digital experiences that feel visually striking and technically seamless. From campaign launches to immersive brand worlds, we build work that captures attention and invites interaction.</p>
          <Pastilla texto="Our approach" />
        </div>
      </section>
      <ScrollExpand length={2.2} from={{ width: "26vw", height: "16vw" }} offset={{ x: "-26vw", y: "-6vh" }} tilt={18} radius={[14, 18]}
        overlay={
          <p className="lw-playreel">
            PLAY{" "}
            <span aria-hidden>
              <svg viewBox="0 0 24 24">
                <path d="M8.5 5.8v12.4a.6.6 0 0 0 .9.5l9.8-6.2a.6.6 0 0 0 0-1L9.4 5.3a.6.6 0 0 0-.9.5Z" />
              </svg>
            </span>{" "}
            REEL
          </p>
        }>
        <Reel />
      </ScrollExpand>

      {/* Featured Work */}
      <section className="lw-work">
        <div className="lw-work__head">
          <h2>Featured Work</h2>
          <p>A selection of immersive digital experiences created for ambitious brands and forward-thinking teams.</p>
        </div>
        {/* un segundo vídeo, suelto: acompaña al scroll por la columna de proyectos, se mece, sigue un poco al cursor y solo
            crece si se pulsa (la miniatura viaja al centro y se oye) */}
        <div className="lw-float">
          <FloatingVideo src="/video/obrador/02-masa-rodillo.mp4" poster="/video/obrador/02-masa-rodillo.jpg" label="Behind the scenes" caption="Labs · 0:30" title="Ver el making of de Lusion Labs" width="min(280px, 46vw)" tilt={-7} />
        </div>
        <div className="lw-grid">
          {PROYECTOS.map(([titulo, img, tags]) => (
            <a key={titulo} className="lw-card" href="#">
              <span className="lw-card__img">
                <img src={img} alt="" loading="lazy" />
              </span>
              <small>{tags}</small>
              <strong>{titulo}</strong>
            </a>
          ))}
        </div>
        <div className="lw-center">
          <Pastilla texto="See all projects" />
        </div>
      </section>

      {/* Where Creative Ideas */}
      <section className="lw-where">
        {/* la cinta cian sale por la derecha junto a «See all projects», ondula bajo el titular y baja hacia la tableta (pantallas 30–33) */}
        <LineDraw className="lw-ribbon lw-ribbon--cian" tube trigger="scroll" scrollRange={[0.85, -0.8]} strokeWidth={15} color="#3fc8ef" viewBox="0 0 1440 1500" d="M1500 40C1350 20 1220 -10 1120 20C1000 60 1060 160 960 210C820 280 700 230 640 330C580 440 720 520 760 640C800 780 640 880 470 900C300 920 220 1040 300 1180C360 1280 520 1300 600 1240" />
        <h2>
          Where Creative Ideas
          <br />
          Become Immersive
          <br />
          Experiences
        </h2>
        <div className="lw-where__text">
          <p>We do not chase trends or produce work that looks like everyone else. We focus on creating visually distinctive digital experiences that reflect your brand, engage your audience, and make people remember what they saw.</p>
          <p>Our process blends creative direction, 3D craft, and interactive development to build tailored digital journeys that feel original, polished, and built for impact.</p>
        </div>
      </section>
      <ScrollExpand length={2.4} from={{ width: "32vw", height: "22vw" }} offset={{ x: "-22vw", y: "4vh" }} tilt={0} radius={[28, 0]} inset={0}
        overlay={<img className="lw-astro" src="/img/espacio/04-nasa-astronaut-is-pictured-during-a-spacewalk-is.jpg" alt="Un astronauta flota en el espacio" />}>
        <video src="/video/voyager/01-tierra-desde-la-iss.mp4" muted loop playsInline autoPlay preload="metadata" />
      </ScrollExpand>

      <footer className="lw-foot">
        <p className="lw-foot__big">Let&apos;s work together</p>
        <a href="#">hello@lusion.example</a>
      </footer>
    </div>
  );
}

const CSS = `
.lw { --lw-bg: #f0f1fa; --lw-fg: #0b0b12; background: var(--lw-bg); color: var(--lw-fg); font-family: var(--font-lw), system-ui, sans-serif; overflow-x: clip; }
.lw-head { position: fixed; inset: 0 0 auto; z-index: 50; display: flex; justify-content: space-between; align-items: center; padding: 50px 5vw 0; pointer-events: none; }
.lw-head > * { pointer-events: auto; }
.lw-logo { font-size: 26px; font-weight: 700; letter-spacing: -0.04em; color: var(--lw-fg); text-decoration: none; }
.lw-head__right { position: relative; display: flex; gap: 18px; align-items: center; }
.lw-sound { width: 45px; height: 45px; border-radius: 50%; border: 0; background: #e3e4ef; display: flex; gap: 3px; align-items: center; justify-content: center; cursor: pointer; }
.lw-sound i { width: 2px; height: 12px; background: var(--lw-fg); animation: lw-onda .8s ease-in-out infinite alternate; }
@keyframes lw-onda { from { transform: scaleY(.3); } to { transform: scaleY(1); } }
.lw-talk { display: inline-flex; gap: 10px; align-items: center; height: 45px; padding: 0 20px; border-radius: 999px; background: var(--lw-fg); color: #fff; font-size: 14px; font-weight: 500; text-decoration: none; transition: padding .3s; }
.lw-talk:hover { padding: 0 26px; }
.lw-talk i { width: 4px; height: 4px; border-radius: 50%; background: #fff; }
.lw-menu { display: inline-flex; gap: 12px; align-items: center; height: 45px; padding: 0 22px; border: 0; border-radius: 999px; background: #e3e4ef; font: inherit; font-size: 14px; font-weight: 500; cursor: pointer; }
.lw-menu span { display: flex; gap: 2px; } .lw-menu i { width: 4px; height: 4px; border-radius: 50%; background: var(--lw-fg); }
.lw-dropdown { position: absolute; right: 0; top: 58px; width: 310px; display: grid; gap: 10px; }
.lw-dropdown nav, .lw-news { background: #fff; border-radius: 14px; padding: 18px 26px; }
.lw-dropdown nav { display: grid; } .lw-dropdown nav a { padding: 12px 0; font-size: 26px; color: var(--lw-fg); text-decoration: none; transition: transform .3s; } .lw-dropdown nav a:hover { transform: translateX(8px); }
.lw-news h3 { margin: 0 0 16px; font-size: 32px; font-weight: 400; line-height: 1.05; }
.lw-news form { display: flex; border-bottom: 1px solid #ccd; } .lw-news input { flex: 1; border: 0; padding: 10px 0; font: inherit; background: none; } .lw-news button { border: 0; background: none; font-size: 22px; cursor: pointer; }
.lw-hero { min-height: 100svh; padding: 150px 5vw 30px; display: grid; grid-template-rows: auto 1fr auto; gap: 26px; }
.lw-hero__lead { margin: -96px 0 0 15vw; max-width: 330px; font-size: 18px; line-height: 1.2; position: relative; z-index: 60; }
.lw-hero__card { border-radius: 18px; overflow: hidden; background: #111118; min-height: 60svh; }
.lw-rule { display: flex; justify-content: space-between; align-items: center; font-family: var(--font-lw-mono), monospace; font-size: 11px; letter-spacing: .08em; color: #555; }
.lw-rule b { font-weight: 300; font-size: 16px; }
.lw-bold, .lw-where { position: relative; padding: 18vh 5vw 8vh; display: grid; grid-template-columns: 1.2fr 1fr; gap: 4vw; align-items: end; }
.lw-bold h2, .lw-where h2, .lw-work h2 { position: relative; z-index: 1; margin: 0; font-size: clamp(44px, 5.6vw, 92px); font-weight: 400; line-height: 1.02; letter-spacing: -0.03em; }
.lw-bold__text, .lw-where__text { position: relative; z-index: 1; max-width: 420px; font-size: 15px; line-height: 1.35; display: grid; gap: 18px; justify-items: start; }
/* la cinta tiene la proporción de su viewBox (height: auto) y sale de la sección por abajo, hasta la tarjeta siguiente */
.lw-ribbon { position: absolute; left: 0; top: 0; width: 100%; height: auto; z-index: 0; pointer-events: none; }
.lw-ribbon--cian { top: -16vh; }
.lw-pill { display: inline-flex; gap: 10px; align-items: center; padding: 10px 16px; border-radius: 999px; background: #fff; color: var(--lw-fg); text-decoration: none; font-family: var(--font-lw-mono), monospace; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; transition: background .3s, color .3s; }
.lw-pill i { width: 5px; height: 5px; border-radius: 50%; background: currentColor; } .lw-pill:hover { background: var(--lw-fg); color: #fff; }
.lw-reel { position: absolute; inset: 0; background: #000; } .lw-reel video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity .8s; }
.lw-playreel { display: flex; gap: 2.4vw; align-items: center; margin: 0; color: #fff; font-size: clamp(36px, 6vw, 96px); letter-spacing: -0.02em; }
/* la pastilla del play: el triángulo en SVG, centrado a ojo (un glifo ▶ cae fuera de su caja según la fuente) */
.lw-playreel span { display: inline-grid; place-items: center; width: 1.45em; height: .8em; border-radius: 999px; background: #fff; color: var(--lw-fg); }
.lw-playreel svg { width: .42em; height: .42em; fill: currentColor; translate: .03em 0; }
/* clip: el vídeo flotante no sale de la sección (y no rompe el sticky, como haría overflow: hidden) */
.lw-work { padding: 14vh 5vw 10vh; overflow: clip; }
.lw-work__head { display: flex; justify-content: space-between; align-items: end; gap: 4vw; margin-bottom: 40px; }
.lw-work__head p { max-width: 240px; margin: 0; font-family: var(--font-lw-mono), monospace; font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: #555; }
/* sticky de alto 0: el vídeo flota sobre la rejilla mientras dura la sección */
.lw-float { position: sticky; top: 64svh; z-index: 5; height: 0; display: flex; justify-content: flex-end; pointer-events: none; }
.lw-float > * { pointer-events: auto; filter: drop-shadow(0 18px 30px rgb(20 20 60 / .28)); }
.lw-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px 24px; }
.lw-card { display: grid; gap: 10px; color: var(--lw-fg); text-decoration: none; }
.lw-card__img { display: block; overflow: hidden; border-radius: 14px; aspect-ratio: 16 / 10; }
.lw-card__img img { width: 100%; height: 100%; object-fit: cover; transition: transform .8s cubic-bezier(.2,.8,.2,1); }
.lw-card:hover .lw-card__img img { transform: scale(1.06); }
.lw-card small { font-family: var(--font-lw-mono), monospace; font-size: 10px; letter-spacing: .06em; text-transform: uppercase; color: #666; }
.lw-card strong { font-size: 24px; font-weight: 400; }
.lw-center { display: grid; justify-items: center; margin-top: 64px; }
.lw-astro { width: min(52vw, 720px); max-height: 82svh; object-fit: contain; opacity: calc(var(--se-t) * 1.3 - .3);
  -webkit-mask-image: radial-gradient(ellipse 46% 46% at 50% 50%, #000 55%, transparent 100%); mask-image: radial-gradient(ellipse 46% 46% at 50% 50%, #000 55%, transparent 100%); }
.lw-foot { padding: 20vh 5vw; display: grid; gap: 20px; }
.lw-foot__big { margin: 0; font-size: clamp(48px, 9vw, 160px); letter-spacing: -0.04em; line-height: .95; }
.lw-foot a { font-size: 20px; color: var(--lw-fg); }
@media (max-width: 760px) { .lw-bold, .lw-where { grid-template-columns: 1fr; } .lw-grid { grid-template-columns: 1fr; } .lw-hero__lead { margin: 0; } .lw-talk { display: none; } }
`;
