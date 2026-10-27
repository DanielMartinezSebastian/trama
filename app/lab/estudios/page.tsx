import type { Metadata } from "next";
import Link from "next/link";
import Desplazable from "@/components/lab/cine/Desplazable";
import { REPLICAS } from "@/components/lab/estudios/registro";
import "@/components/lab/cine/panel/panel.css";

/* Índice de las réplicas de los estudios por sector (docs/50 §2 E13), con la referencia y sus capturas al lado. */

export const metadata: Metadata = { title: "Réplicas de los estudios · Trama", robots: { index: false, follow: false } };

const CAPTURAS: Record<string, string> = {
  matiz: "ilcolorista-salon/montaje.jpg",
  nura: "alicehairart-se/estudio/montaje.jpg",
  cita: "myrendezvous-ca/estudio/montaje.jpg",
  melena: "hairmeup-pl/estudio/montaje.jpg",
  raiz: "marcoambrosi-salon/estudio/montaje.jpg",
  patron: "don-barber-gr-en/estudio/montaje.jpg",
  nucleo: "coreatelierpilates-com/estudio/montaje.jpg",
  impulso: "coachsportifecublens-com/estudio/montaje.jpg",
  vive: "fit-and-you-webflow-io/estudio/montaje.jpg",
  talla: "skulptfitness-nl/estudio/montaje.jpg",
  lobo: "fenriz-gym-com/estudio/montaje.jpg",
  remada: "surfing-academy/estudio/montaje.jpg",
  ahora: "futurelondonacademy-co-uk/estudio/montaje.jpg",
  oficio: "honhar-in/estudio/montaje.jpg",
  "abuela-rosa": "peppasauce-love/estudio/montaje.jpg",
  q47: "k72-ca-en/estudio/montaje.jpg",
};

export default function Page() {
  return (
    <main className="cine-panel" style={{ padding: "48px clamp(16px, 4vw, 48px)", display: "grid", gap: 24 }}>
      <Desplazable />
      <header>
        <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6 }}>Laboratorio · docs/50 E13</p>
        <h1 style={{ margin: "8px 0" }}>Réplicas de los estudios por sector</h1>
        <p style={{ margin: 0, maxWidth: "70ch", opacity: 0.75 }}>
          Cada web estudiada, reproducida con piezas de Trama: marca y textos inventados, la estructura y la estética de la referencia.{" "}
          <Link href="/lab/cine/docs/50-estudios-sectores">Fichas y síntesis</Link>.
        </p>
      </header>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {REPLICAS.map((r) => (
          <li key={r.slug} style={{ border: "1px solid color-mix(in srgb, currentColor 20%, transparent)", borderRadius: 10, overflow: "hidden", display: "grid" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/lab/cine/archivo/.refs3d/webs/${CAPTURAS[r.slug]}`} alt={`Capturas de ${r.ref}`} loading="lazy" style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover", objectPosition: "top" }} />
            <div style={{ padding: 14, display: "grid", gap: 6 }}>
              <small style={{ opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{r.sector} · {r.ficha}</small>
              <strong style={{ fontSize: 20 }}>{r.nombre}</strong>
              <span style={{ opacity: 0.75, fontSize: 14 }}>
                Réplica de <a href={r.url} target="_blank" rel="noreferrer">{r.ref}</a>: {r.firma}.
              </span>
              {r.hecha ? <Link href={`/lab/estudios/${r.slug}`}>Abrir la réplica →</Link> : <span style={{ opacity: 0.5 }}>Pendiente</span>}
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
