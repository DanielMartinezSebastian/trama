"use client";

import BeforeAfter from "@/components/ui/BeforeAfter";
import TestimonialSection from "@/components/ui/TestimonialSection";
import "./raiz.css";

/*
 * Raíz Concept Salon: réplica de Marco Ambrosi (docs/50 §3.2), un salón especialista en extensiones. Oscuro con cobre,
 * titulares en serif y texto en sans fina; por qué con un profesional, la comparación «lo barato / lo bien hecho», los
 * servicios con «desde», el antes y el después con tirador (BeforeAfter), los trabajos, el salón en movimiento y las
 * reseñas (TestimonialSection). La reserva es un botón de WhatsApp.
 */

const H = "/img/hebra/";
const RAZONES = [
  { icono: "⌕", titulo: "Primero se mira tu pelo", texto: "Densidad, grosor, estado del cuero cabelludo. No todas las cabezas aguantan el mismo método ni la misma cantidad: quien solo vende, no lo valora." },
  { icono: "⇅", titulo: "El peso se reparte", texto: "Mechones demasiado pesados o mal colocados tiran. La tracción continua debilita el anclaje y los cabellos de alrededor." },
  { icono: "◐", titulo: "El color se funde, no se pega", texto: "Un mechón comprado casi nunca coincide con el tuyo. Matizamos extensión y pelo natural juntos para que la unión desaparezca." },
  { icono: "✓", titulo: "Quitarlas cuenta tanto como ponerlas", texto: "Es el momento de más riesgo. Hecho por quien las puso, el pelo queda como antes: sin nudos ni roturas." },
];
const SERVICIOS = [
  { titulo: "Extensiones por ultrasonido", texto: "Aplicación mechón a mechón con queratina activada por ultrasonido: la solución más duradera para pelo fino.", desde: 115 },
  { titulo: "Extensiones adhesivas", texto: "Bandas finas e invisibles, aplicación rápida: dura hasta cuatro meses. Ideal para probar volumen y largo.", desde: 115 },
  { titulo: "Extensiones cosidas", texto: "Cortinas cosidas a una trenza fina y pegada: sin pegamento ni calor. Volumen pleno y uniforme.", desde: 340 },
  { titulo: "Infoltimento", texto: "Media cabeza para dar cuerpo donde hace falta, sin cambiar el largo. Perfecto para pelo fino.", desde: 115 },
  { titulo: "Color y balayage", texto: "Degradado y matiz pensados para fundir extensión y pelo natural en un solo color.", desde: 40 },
];
const ANTES_DESPUES = [
  { antes: `${H}trabajo-corte-corto.webp`, despues: `${H}trabajo-ondas.webp`, pie: "Corte y peinado, ondas suaves" },
  { antes: `${H}rizos.webp`, despues: `${H}trabajo-balayage.webp`, pie: "Extensiones cosidas: largo y volumen" },
  { antes: `${H}corte.webp`, despues: `${H}trabajo-rizo.webp`, pie: "Corte y color: movimiento recuperado" },
];
const TRABAJOS = [
  { img: `${H}trabajo-ondas.webp`, pie: "Largo y ondas suaves" },
  { img: `${H}trabajo-balayage.webp`, pie: "Balayage caramelo difuminado" },
  { img: `${H}rizos.webp`, pie: "El rizo, en la puerta del salón" },
  { img: `${H}color.webp`, pie: "La fase de estudio, en el sillón" },
  { img: `${H}corte.webp`, pie: "El detalle del corte" },
  { img: `${H}salon.webp`, pie: "El salón, por dentro" },
];
const CLIPS = [
  { img: `${H}color.webp`, pie: "El peinado final" },
  { img: `${H}corte.webp`, pie: "En el sillón" },
  { img: `${H}trabajo-rizo.webp`, pie: "Las manos en el pelo" },
  { img: `${H}salon.webp`, pie: "Dentro del salón" },
];

const Whatsapp = ({ texto = "Reserva por WhatsApp" }: { texto?: string }) => (
  <a href="#contacto" className="rz-wa"><span aria-hidden>✆</span>{texto}</a>
);

export default function Raiz() {
  return (
    <div className="rz">
      <header className="rz-head">
        <a href="#inicio" className="rz-logo"><span aria-hidden>R</span><b>Raíz<small>Concept Salon</small></b></a>
        <nav aria-label="Principal">
          <a href="#porque">Por qué nosotros</a>
          <a href="#servicios">Servicios</a>
          <a href="#antes">Antes y después</a>
          <a href="#resenas">Reseñas</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <Whatsapp />
      </header>

      <section className="rz-hero" id="inicio">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${H}trabajo-ondas.webp`} alt="" />
        <div className="rz-hero__txt">
          <span className="rz-raya" aria-hidden />
          <p className="rz-kicker">Especialista en extensiones · Valencia</p>
          <h1>Pelo más largo,<br />más lleno. <em>Tuyo.</em></h1>
          <p>Extensiones aplicadas a tu medida por Raquel: efecto natural, color estudiado sobre ti. Se ve el resultado, no la extensión.</p>
          <div className="rz-botones"><Whatsapp /><a href="#trabajos" className="rz-borde">Ver los trabajos</a></div>
        </div>
        <span className="rz-scroll">Baja</span>
      </section>

      <section className="rz-porque" id="porque">
        <p className="rz-kicker">Antes de elegir</p>
        <h2>Por qué las extensiones<br />las tiene que poner un profesional</h2>
        <p className="rz-intro">Las extensiones no son un accesorio que se pega. Son un trabajo técnico sobre tu pelo, y tu pelo es el único que tienes.</p>
        <div className="rz-sellos">
          <div><span aria-hidden>◈</span><b>Salón Platino de la marca</b><small>El único en Valencia y provincia</small></div>
          <div><span aria-hidden>✦</span><b>Top Peluqueros 2026</b><small>En la guía de los mejores salones</small></div>
        </div>
        <div className="rz-razones">
          {RAZONES.map((r) => (
            <article key={r.titulo}><span aria-hidden>{r.icono}</span><h3>{r.titulo}</h3><p>{r.texto}</p></article>
          ))}
        </div>
        <div className="rz-compara">
          <article><p className="rz-kicker">El presupuesto más bajo</p><ul className="rz-no"><li>Ninguna valoración previa del pelo</li><li>Mechones de origen dudoso, que se apagan en un mes</li><li>Uniones que se notan al recogerse el pelo</li><li>Nadie responde si algo va mal</li></ul></article>
          <article className="rz-compara__si"><p className="rz-kicker">El trabajo hecho en el salón</p><ul className="rz-si"><li>Consulta antes de cualquier cita</li><li>Método elegido para tu pelo, no por la tarifa</li><li>Color fundido, uniones invisibles también recogido</li><li>Revisiones, mantenimiento y retirada a cargo de quien las puso</li></ul></article>
        </div>
      </section>

      <section className="rz-servicios" id="servicios">
        <h2>Los servicios de extensiones</h2>
        <p className="rz-intro">Tres técnicas de aplicación: ultrasonido, adhesivas y cosidas. Todo parte de una consulta en el salón: método, largo y color se deciden juntos.</p>
        <div className="rz-tarjetas">
          {SERVICIOS.map((s, i) => (
            <article key={s.titulo}>
              <span className="rz-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.titulo}</h3>
              <p>{s.texto}</p>
              <div className="rz-desde"><small>Desde</small><b>{s.desde} €</b></div>
            </article>
          ))}
        </div>
      </section>

      <section className="rz-antes" id="antes">
        <p className="rz-kicker">Antes y después</p>
        <h2>La misma clienta, la misma luz</h2>
        <p className="rz-intro">Arrastra el tirador para ver el cambio.</p>
        <div className="rz-ad">
          {ANTES_DESPUES.map((a) => (
            <figure key={a.pie}>
              <BeforeAfter
                // el componente pinta `after` a la izquierda: el antes va ahí, como en la referencia (PRIMA | DOPO)
                before={/* eslint-disable-next-line @next/next/no-img-element */ <img src={a.despues} alt="Después" />}
                after={/* eslint-disable-next-line @next/next/no-img-element */ <img src={a.antes} alt="Antes" />}
                beforeLabel="Después"
                afterLabel="Antes"
                ratio={0.8}
                variant="minimal"
              />
              <figcaption>· {a.pie}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="rz-trabajos" id="trabajos">
        <h2>Los trabajos que salen del salón</h2>
        <p className="rz-intro">Fotos del salón. Cada cabeza es un trabajo distinto: largo, color y corte se deciden frente al espejo, no en la tarifa.</p>
        <div className="rz-rejilla">
          {TRABAJOS.map((t) => (
            <figure key={t.pie}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.img} alt="" loading="lazy" />
              <figcaption>· {t.pie}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="rz-movimiento">
        <h2>El salón en movimiento</h2>
        <p className="rz-intro">Cuatro clips grabados en un día de trabajo. Toca para oírlos.</p>
        <div className="rz-clips">
          {CLIPS.map((c) => (
            <figure key={c.pie}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.img} alt="" loading="lazy" />
              <span className="rz-play" aria-hidden>▶</span>
              <figcaption>{c.pie}</figcaption>
            </figure>
          ))}
        </div>
        <a href="#contacto" className="rz-borde rz-ig">Más trabajos en Instagram</a>
      </section>

      <div id="resenas">
        <TestimonialSection
          kicker="Reseñas"
          title="La voz de las clientas"
          subtitle="Lo que cuentan las clientas después de su cita en el salón."
          items={"Por fin unas extensiones que no se notan ni con coleta. Raquel me explicó todo antes de empezar.|Ramona G.|Extensiones y corte de rizo|5\nVine por un desastre de otro sitio. Me las quitó sin romper nada y ahora llevo el pelo como quería.|Lucía M.|Retirada y cosidas|5\nEl color fundido es increíble: nadie se cree que no es mi pelo.|Paula R.|Ultrasonido y balayage|5"}
          layout="grid"
          variant="minimal"
          quoteFont="display"
          className="rz-resenas"
        />
      </div>

      <footer className="rz-pie" id="contacto">
        <div><h2>Pide tu consulta</h2><p className="rz-intro">Escríbenos por WhatsApp con una foto de tu pelo con luz natural. Te contestamos el mismo día.</p><Whatsapp texto="Escribir por WhatsApp" /></div>
        <div className="rz-datos"><p>Calle del Doctor Sumsi 14<br />46005 Valencia</p><p>Martes a sábado<br />9:30 – 19:30</p><p>hola@raiz.example</p></div>
      </footer>
    </div>
  );
}
