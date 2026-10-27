"use client";

import CohortList, { type CohortProgram } from "@/components/ui/CohortList";
import LineDraw from "@/components/ui/LineDraw";
import "./remada.css";

/*
 * Remada, la academia de surf de Lucía Mar: réplica de Surfing Academy (docs/50 §3.6), la academia de una persona. Todo
 * en minúsculas, títulos entre paréntesis y asteriscos, garabatos a mano dibujándose (LineDraw), naranja y verde sobre
 * gris claro, botones con sombra dura; el avatar de la autora fijo arriba, los viajes por convocatoria (CohortList), la
 * ficha «sobre mí» como un billete troquelado, cifras, la primera clase regalada y las opiniones.
 */

const V = "/video/";
const VIAJES: CohortProgram[] = [
  { title: "Indonesia, islas Mentawai, Playground", levels: ["intermedio", "avanzado"], summary: "Un archipiélago con el que sueña cualquier surfista: aquí entiendes lo que es «la ola perfecta».", image: `${V}costa/01-olas-islandia.jpg`, cohorts: [{ label: "diciembre 2026", dates: ["03.12 – 10.12", "10.12 – 17.12", "17.12 – 24.12"] }, { label: "enero 2027", dates: ["14.01 – 21.01", "21.01 – 28.01"] }], status: "open", href: "#viajes", cta: "saber más" },
  { title: "Corea del Sur (ola artificial)", levels: ["principiante", "intermedio", "avanzado"], summary: "El campo de entrenamiento perfecto: olas idénticas y surfskate para afinar la técnica y progresar rápido.", image: `${V}oceano/01-arrecife.jpg`, cohorts: [{ label: "mayo 2027", dates: ["20.05 – 30.05"] }, { label: "septiembre 2027", dates: ["20.09 – 01.10"] }], status: "few", href: "#viajes", cta: "saber más" },
  { title: "China, Hainan (ola artificial)", levels: ["principiante", "intermedio", "avanzado"], summary: "Tecnología de ola perfecta, entrenamiento de surfskate y comodidad de hotel.", image: `${V}costa/03-playa-tunez.jpg`, cohorts: [{ label: "noviembre 2026", dates: ["03.11 – 12.11"] }, { label: "febrero 2027", dates: ["22.02 – 03.03"] }], status: "open", href: "#viajes", cta: "saber más" },
  { title: "Indonesia, Java, G-Land", levels: ["intermedio", "avanzado"], summary: "Una casa de campo en un parque nacional, olas amables con poca gente y la comida de siempre.", image: `${V}costa/02-costa-oregon.jpg`, cohorts: [{ label: "2027", dates: [] }], status: "soon", href: "#viajes", cta: "saber más" },
];
const NUCLEO = [
  { t: "análisis en vídeo de los errores", d: "El vídeo es el espejo de tu surf: ves desde fuera cómo surfeas de verdad. Así se progresa más rápido." },
  { t: "el método de los pasos pequeños", d: "Convierto lo complejo en sencillo. Partimos cada movimiento en pasos, en tierra y en el agua." },
  { t: "surfskate", d: "Si grabación y estructura ayudan a ver el movimiento, el surfskate es donde se nota, se ensaya y se fija." },
  { t: "un campamento con todo", d: "Dos sesiones al día, práctica constante y decenas de olas: una semana vale más que meses sueltos en casa." },
];

export default function Remada() {
  return (
    <div className="rm">
      <div className="rm-cinta-top"><span><b>es</b> en</span></div>
      <a href="#sobre-mi" className="rm-avatar" aria-label="Lucía Mar, sobre mí">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/retratos/03-pixie-cut-unsplash.jpg" alt="" />
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
            <img src={`${V}costa/01-olas-islandia.jpg`} alt="" />
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
              <img src={[`${V}oceano/03-delfines-hawai.jpg`, `${V}costa/02-costa-oregon.jpg`, `${V}oceano/02-tiburon-puntas-negras.jpg`, `${V}costa/03-playa-tunez.jpg`][i]} alt="" loading="lazy" style={{ rotate: `${[-6, 4, -3, 7][i]}deg` }} />
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
          <img src={`${V}costa/03-playa-tunez.jpg`} alt="" />
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

      <a href="#opiniones" className="rm-chat" aria-label="Escríbeme">💬</a>
    </div>
  );
}
