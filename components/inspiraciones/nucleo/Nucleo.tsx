"use client";

import { useState } from "react";
import ClassSchedule, { type ScheduleBooking } from "@/components/ui/ClassSchedule";
import FeatureExplorer from "@/components/ui/FeatureExplorer";
import { Albert_Sans, Crimson_Pro } from "next/font/google";
import "./nucleo.css";

// Minion Pro (de pago) → Crimson Pro, su alternativa libre más cercana; Albert Sans, la del original, es libre. Se cargan
// en la réplica, no en el kit (docs/cuaderno/replica-nucleo.md)
const crimson = Crimson_Pro({ subsets: ["latin"], style: ["normal", "italic"], variable: "--nc-crimson", display: "swap" });
const albert = Albert_Sans({ subsets: ["latin"], variable: "--nc-albert", display: "swap" });

/*
 * Núcleo, estudio de pilates: réplica de Core Atelier Pilates (docs/50 §3.4). Rosa empolvado, marrón y casi negro; serif
 * con la mitad del titular en cursiva y una sans limpia; los aparatos en un acordeón que cambia la foto de al lado
 * (FeatureExplorer), las sesiones privadas en tres tarjetas y el horario con reserva (ClassSchedule).
 */

const APARATOS = [
  `Reformer|Descubre lo versátil que es el reformer para ganar fuerza y flexibilidad y afinar la alineación. Una clase dinámica de cuerpo entero que te deja equilibrada, fuerte y con ganas.|/img/inspiraciones/nucleo/aparato-reformer.webp|Ejercicio de movilidad guiado`,
  `Silla de estabilidad|Control y precisión con la silla: fortalece el centro, mejora el equilibrio y trabaja los músculos pequeños para una práctica más honda.|/img/inspiraciones/nucleo/aparato-silla.webp|Sentadilla con kettlebell`,
  `Torre y barril|La torre y el barril combinados: resistencia y curva para estirar, fortalecer y alargar. Perfecto para retarse o para recuperarse.|/img/inspiraciones/nucleo/aparato-torre.webp|Clase en grupo en el estudio`,
  `A elección de Núcleo|Entra sin plan y deja que te guíe tu instructora: según el día, reformer, silla, torre o barril, en una sesión pensada para ti.|/img/inspiraciones/nucleo/aparato-eleccion.webp|El estudio con su patio`,
].join("\n");

const PRIVADAS = [
  { img: `/img/inspiraciones/nucleo/sesion-privada.webp`, titulo: "privadas", texto: "Sesiones uno a uno con tus objetivos y tus necesidades: atención total para llevar tu práctica más lejos." },
  { img: `/img/inspiraciones/nucleo/sesion-pareja.webp`, titulo: "en pareja", texto: "Para dos: sesiones semiprivadas para entrenar con alguien y aun así recibir indicaciones personales." },
  { img: `/img/inspiraciones/nucleo/sesion-trio.webp`, titulo: "en trío", texto: "Sesiones privadas para tres, ideales para empresas pequeñas o amigas que comparten la práctica." },
];

const CLASES = "08:00|Reformer|50|Reformer|Todos|Inés|Estudio 1|3|2|1,2,3,4,5\n09:30|Silla de estabilidad|50|Silla|Intermedio|Nico|Estudio 2|3|3|1,3,5\n12:00|Torre y barril|50|Torre|Todos|Inés|Estudio 1|3|1|2,4\n18:30|Reformer al atardecer|50|Reformer|Inicio|Dani|Estudio 1|3|2|1,2,3,4,5\n10:00|A elección de Núcleo|55|Reformer|Todos|Nico|Estudio 2|3|0|6,0";

export default function Nucleo() {
  const [reservas, setReservas] = useState<ScheduleBooking[]>([]);
  return (
    <div className={`nc ${crimson.variable} ${albert.variable}`}>
      <header className="nc-head">
        <a href="#inicio" className="nc-logo">núcleo</a>
        <nav aria-label="Principal">
          <a href="#estudio">Estudio</a>
          <a href="#clases">Clases</a>
          <a href="#reservar">Reservar ▾</a>
          <a href="#tienda">Tienda</a>
          <a href="#eventos">Eventos</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <a href="#reservar" className="nc-entrar">Entrar</a>
      </header>

      <section className="nc-hero" id="inicio">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/img/inspiraciones/nucleo/estudio.webp`} alt="El estudio de pilates con suelo de madera y luz natural" />
      </section>

      <section className="nc-intro" id="estudio">
        <h1>núcleo <em>clases</em></h1>
        <div className="nc-intro__fila">
          <p>En Núcleo hay sesiones semiprivadas y privadas para conocer a fondo el pilates. Gana fuerza, mejora la flexibilidad y afina la alineación en un entrenamiento que te deja equilibrada, fuerte e inspirada.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/img/inspiraciones/nucleo/detalle.webp`} alt="" />
        </div>
      </section>

      <section className="nc-semi" id="clases">
        <div className="nc-semi__txt">
          <h2>semiprivadas<br /><em>en grupo pequeño</em></h2>
          <p>Atención cercana y personal en clases de hasta tres personas.</p>
        </div>
        <FeatureExplorer items={APARATOS} mediaSide="right" ratio="4 / 5" variant="minimal" className="nc-aparatos" />
      </section>

      <section className="nc-privadas">
        <h2>clases <em>privadas</em></h2>
        <div className="nc-privadas__fila">
          {PRIVADAS.map((p) => (
            <article key={p.titulo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt="" loading="lazy" />
              <h3>sesiones <em>{p.titulo}</em></h3>
              <p>{p.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="nc-reserva" id="reservar">
        <h2>tu clase <em>te espera</em></h2>
        <p>Necesitas un bono para reservar. La primera clase de prueba va por nuestra cuenta.</p>
        <ClassSchedule classes={CLASES} startOffset={1} bookings={reservas} onBook={(c, date, waitlist) => setReservas((r) => [...r, { classId: c.id, date, waitlist }])} filters="category" bookLabel="Reservar" waitlistLabel="En espera" fullLabel="Completa" variant="minimal" className="nc-horario" />
      </section>

      <footer className="nc-pie" id="contacto">
        <strong>núcleo</strong>
        <p>Calle de Jorge Juan 18 · Madrid<br />hola@nucleo.example</p>
        <p>Trabaja con nosotras · Prensa · Eventos</p>
      </footer>
    </div>
  );
}
