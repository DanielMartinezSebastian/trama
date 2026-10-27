"use client";

import CohortList, { type CohortProgram } from "@/components/ui/CohortList";
import ContactForm from "@/components/ui/ContactForm";
import FAQSection from "@/components/ui/FAQSection";
import LineDraw from "@/components/ui/LineDraw";
import SmoothScroll from "@/components/ui/SmoothScroll";
import "./remada.css";

/*
 * Remada, la academia de surf de Lucía Mar: réplica de Surfing Academy (docs/50 §3.6), la academia de una persona. Todo
 * en minúsculas, títulos entre paréntesis y asteriscos, garabatos a mano dibujándose (LineDraw), naranja y verde sobre
 * gris claro, botones con sombra dura; el avatar de la autora fijo arriba, los viajes por convocatoria (CohortList), la
 * ficha «sobre mí» como un billete troquelado, cifras, la primera clase regalada y las opiniones.
 */

const VIAJES: CohortProgram[] = [
  { title: "Indonesia, islas Mentawai, Playground", levels: ["intermedio", "avanzado"], summary: "Un archipiélago con el que sueña cualquier surfista: aquí entiendes lo que es «la ola perfecta».", image: `/img/inspiraciones/remada/viaje-mentawai.webp`, cohorts: [{ label: "diciembre 2026", dates: ["03.12 – 10.12", "10.12 – 17.12", "17.12 – 24.12"] }, { label: "enero 2027", dates: ["14.01 – 21.01", "21.01 – 28.01"] }], status: "open", href: "#viajes", cta: "saber más" },
  { title: "Corea del Sur (ola artificial)", levels: ["principiante", "intermedio", "avanzado"], summary: "El campo de entrenamiento perfecto: olas idénticas y surfskate para afinar la técnica y progresar rápido.", image: `/img/inspiraciones/remada/viaje-corea.webp`, cohorts: [{ label: "mayo 2027", dates: ["20.05 – 30.05"] }, { label: "septiembre 2027", dates: ["20.09 – 01.10"] }], status: "few", href: "#viajes", cta: "saber más" },
  { title: "China, Hainan (ola artificial)", levels: ["principiante", "intermedio", "avanzado"], summary: "Tecnología de ola perfecta, entrenamiento de surfskate y comodidad de hotel.", image: `/img/inspiraciones/remada/viaje-hainan.webp`, cohorts: [{ label: "noviembre 2026", dates: ["03.11 – 12.11"] }, { label: "febrero 2027", dates: ["22.02 – 03.03"] }], status: "open", href: "#viajes", cta: "saber más" },
  { title: "Indonesia, Java, G-Land", levels: ["intermedio", "avanzado"], summary: "Una casa de campo en un parque nacional, olas amables con poca gente y la comida de siempre.", image: `/img/inspiraciones/remada/viaje-gland.webp`, cohorts: [{ label: "2027", dates: [] }], status: "soon", href: "#viajes", cta: "saber más" },
];
const NUCLEO = [
  { t: "análisis en vídeo de los errores", d: "El vídeo es el espejo de tu surf: ves desde fuera cómo surfeas de verdad. Así se progresa más rápido." },
  { t: "el método de los pasos pequeños", d: "Convierto lo complejo en sencillo. Partimos cada movimiento en pasos, en tierra y en el agua." },
  { t: "surfskate", d: "Si grabación y estructura ayudan a ver el movimiento, el surfskate es donde se nota, se ensaya y se fija." },
  { t: "un campamento con todo", d: "Dos sesiones al día, práctica constante y decenas de olas: una semana vale más que meses sueltos en casa." },
];

const VLOGS = [
  { t: "#vlog islas mentawai", f: "diciembre 17", img: `/img/inspiraciones/remada/vlog-mentawai.webp` },
  { t: "#vlog g-land, java", f: "diciembre 24", img: `/img/inspiraciones/remada/vlog-gland.webp` },
  { t: "#vlog corea del sur", f: "enero 03", img: `/img/inspiraciones/remada/vlog-corea.webp` },
];
const AMIGOS = [`/img/inspiraciones/remada/amigo-1.webp`, "/img/inspiraciones/remada/amigo-2.webp", `/img/inspiraciones/remada/amigo-3.webp`, `/img/inspiraciones/remada/amigo-4.webp`, `/img/inspiraciones/remada/amigo-5.webp`, `/img/inspiraciones/remada/amigo-6.webp`, `/img/inspiraciones/remada/amigo-7.webp`];

export default function Remada() {
  return (
    <div className="rm">
      <SmoothScroll />
      <div className="rm-cinta-top"><span><b>es</b> en</span></div>
      <a href="#sobre-mi" className="rm-avatar" aria-label="Lucía Mar, sobre mí">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/inspiraciones/remada/autora.webp" alt="" />
        <span>Lucía<br />Mar</span>
      </a>
      <nav className="rm-nav" aria-label="Principal">
        <a href="#viajes">→ calendario de viajes</a>
        <a href="#sobre-mi">→ sobre mí</a>
        <a href="#online">→ clases en línea</a>
        <a href="#opiniones">→ opiniones</a>
        <a href="#online">→ vlogs</a>
        <a href="#opiniones">→ contacto</a>
      </nav>
      <a href="#opiniones" className="rm-escribeme">• escríbeme</a>

      <section className="rm-hero">
        <span className="rm-garabato rm-garabato--ojos" aria-hidden>× ×<br />‿</span>
        <span className="rm-garabato rm-garabato--llama" aria-hidden>🔥</span>
        <h1>tu progreso en el surf<br /><span>(empieza aquí)</span></h1>
        <LineDraw shape="underline" trigger="mount" duration={1.4} delay={0.6} tone="acc" strokeWidth={5} className="rm-subrayado" />
        <p>viajes de surf de autora por todo el mundo<br />que dan resultados de verdad</p>
        <a href="#viajes" className="rm-boton">únete al próximo viaje →</a>
        <div className="rm-dibujo" aria-hidden>
          <LineDraw
            viewBox="0 0 1200 420"
            d="M20 330C160 250 260 140 420 130C560 122 640 220 600 290C570 340 500 330 500 280C500 230 560 210 610 230M640 330C760 300 880 260 1000 270C1080 276 1140 300 1180 320M150 380C420 360 720 360 1050 380M330 250C430 225 560 222 700 240C820 255 900 285 980 300C900 318 800 320 700 312C560 300 430 285 330 250Z"
            trigger="inview"
            duration={2.6}
            tone="fg"
            strokeWidth={3}
            fit="contain"
          />
          <ul className="rm-notas">
            <li><b>• método de entrenamiento propio:</b> te enseño a surfear más rápido y mejor de lo que esperas. mi método te ahorra años de prueba y error.</li>
            <li><b>• 5 años de mentoría con leyendas del surf:</b> una experiencia y un aval que comparto contigo.</li>
            <li><b>• los mejores destinos:</b> solo campamentos en sitios con olas estables y buenas. cada viaje es un salto en tu surf.</li>
          </ul>
        </div>
      </section>

      <section className="rm-viajes" id="viajes">
        <h2>solo <span className="rm-naranja">*</span>los spots más constantes</h2>
        <CohortList programs={VIAJES} layout="rows" cta="saber más" variant="minimal" className="rm-lista" statusLabels={{ open: "plazas abiertas", few: "últimas plazas", soon: "fechas en breve" }} />
      </section>

      <section className="rm-sobre" id="sobre-mi">
        <h2>(sobre mí)</h2>
        <div className="rm-billete">
          <div className="rm-billete__foto">
            <span>abril 2022</span><span>mentawai</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/img/inspiraciones/remada/billete.webp`} alt="" />
          </div>
          <span className="rm-handle">@luciamar
            <LineDraw shape="circle" trigger="inview" duration={1.2} tone="fg" strokeWidth={2} className="rm-handle__circulo" />
          </span>
          <hr />
          <div className="rm-billete__txt">
            <p className="rm-mision">mi misión es encontrar la felicidad en lo que vivo —surf, surfskate y viajes— y convertir esa experiencia en alegría y progreso para otras personas</p>
            <p>enseño a entender, no a copiar. en vez de memorizar movimientos, te explico la física y la lógica de cada uno: el entrenamiento se vuelve consciente y avanzas mucho más deprisa.</p>
          </div>
        </div>
      </section>

      <section className="rm-nucleo">
        <h2><span className="rm-naranja">*</span>el núcleo de mi método</h2>
        <div className="rm-nucleo__fila">
          {NUCLEO.map((n, i) => (
            <article key={n.t}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={[`/img/inspiraciones/remada/metodo-video.webp`, `/img/inspiraciones/remada/metodo-pasos.webp`, `/img/inspiraciones/remada/metodo-surfskate.webp`, `/img/inspiraciones/remada/metodo-campamento.webp`][i]} alt="" loading="lazy" style={{ rotate: `${[-6, 4, -3, 7][i]}deg` }} />
              <h3>{n.t}</h3>
              <p>{n.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rm-online" id="online">
        <h2>(clases en línea<br />que de verdad funcionan)</h2>
        <div className="rm-cifras">
          <div><b>140 000+</b><span>personas siguen el método</span></div>
          <div><b>30 000 000+</b><span>reproducciones del método de surfskate</span></div>
          <div><b>1 000+</b><span>alumnos que lo han logrado en línea</span></div>
        </div>
        <h2 className="rm-regalo">(¡la primera clase es <span className="rm-naranja">un regalo</span>!)
          <LineDraw shape="arrow" trigger="inview" duration={1} tone="fg" strokeWidth={3} className="rm-flecha" />
        </h2>
        <figure className="rm-video">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/img/inspiraciones/remada/video.webp`} alt="" />
          <span className="rm-rec">● REC</span>
          <span className="rm-sello">clases<br />en línea</span>
        </figure>
        <a href="#online" className="rm-banda rm-banda--azul">analicemos tus errores en línea <i>→</i></a>
        <a href="#online" className="rm-banda rm-banda--naranja">acelera tu progreso con el curso <i>→</i></a>
      </section>

      <section className="rm-opiniones" id="opiniones">
        <h2>((opiniones))</h2>
        <div className="rm-opiniones__fila">
          {["el ambiente siempre es positivo, cercano y divertido", "volví con otra manera de mirar las olas", "en una semana corregí lo que arrastraba desde hacía años"].map((t, i) => (
            <blockquote key={t}>
              <b>“</b>
              <p className="rm-op__t">{t}</p>
              <p>lucía, ¡hola! quería darte las gracias otra vez por el viaje. me alegro muchísimo de haber ido: la forma en que explicas cada movimiento me ha cambiado el surf. <a href="#opiniones">[leer más]</a></p>
              <cite>— {["marta", "jon", "ainhoa"][i]}</cite>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="rm-vlogs" id="vlogs">
        <h2>(vlogs)</h2>
        {VLOGS.map((v) => (
          <article key={v.t}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={v.img} alt="" loading="lazy" />
            <div><b>{v.t}</b><small>{v.f}</small></div>
          </article>
        ))}
      </section>

      <section className="rm-amigos">
        <h2><span className="rm-naranja">*</span>libertad, humor, amistad</h2>
        <div className="rm-amigos__fotos">
          {AMIGOS.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" loading="lazy" className={`rm-amigo rm-amigo--${i}`} />
          ))}
          <p>el ambiente de un viaje de surf lo hacen las personas: buena gente, humor y ganas de aprender. eso es lo que buscamos en cada viaje.</p>
          <LineDraw shape="signature" trigger="inview" duration={1.6} tone="fg" strokeWidth={2} className="rm-amigos__trazo" />
        </div>
      </section>

      <section className="rm-faq">
        <FAQSection kicker="" title="faq." layout="split" presentation="lines" align="left" defaultOpen={-1} variant="minimal" className="rm-faq__lista"
          items={"¿qué tan rápido veré progreso?|en la primera semana ya notas cambios: el vídeo te enseña qué corregir y lo practicas al día siguiente.\n¿qué tipo de gente viene a los viajes?|de todo: desde quien empieza hasta quien lleva años; agrupamos por nivel.\n¿es para mí si soy principiante?|sí, los destinos con ola artificial son perfectos para empezar.\n¿qué garantías hay de que haya olas?|elegimos spots constantes y fechas de temporada; si un día no hay olas, hay surfskate y análisis.\n¿cómo es un día normal en el viaje?|dos sesiones de agua, análisis de vídeo y surfskate al atardecer.\n¿qué incluye el programa?|alojamiento, traslados, sesiones guiadas, vídeo y análisis."} />
      </section>

      <section className="rm-contacto" id="contacto">
        <h2>contacto</h2>
        <div className="rm-contacto__cuerpo">
          <p>instagram <b>@luciamar.surf</b><br />telegram <b>@luciamar</b></p>
          <div className="rm-contacto__form">
            <ContactForm title="déjame tus datos y te escribo pronto" subtitle="" submitLabel="enviar →" successMessage="¡gracias! te escribo enseguida." variant="minimal" />
          </div>
        </div>
      </section>

      <footer className="rm-pie">
        <nav aria-label="Pie">
          <b>navegación</b>
          <a href="#viajes">calendario de viajes</a><a href="#sobre-mi">sobre mí</a><a href="#online">clases en línea</a><a href="#opiniones">opiniones</a><a href="#vlogs">vlogs</a><a href="#contacto">contacto</a>
        </nav>
        <nav aria-label="Viajes">
          <b>viajes</b>
          <a href="#viajes">mentawai, playground</a><a href="#viajes">corea del sur</a><a href="#viajes">china, hainan</a><a href="#viajes">java, g-land</a>
        </nav>
        <a href="#inicio" className="rm-pie__arriba">volver arriba ↑</a>
        <small>política de privacidad · © 2026 remada</small>
      </footer>

      <a href="#opiniones" className="rm-chat" aria-label="Escríbeme">💬</a>
    </div>
  );
}
