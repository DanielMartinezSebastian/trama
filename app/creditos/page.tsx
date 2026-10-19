import type { Metadata } from "next";
import { allPhotos } from "@/lib/sites/photos";
import "./creditos.css";

export const metadata: Metadata = {
  title: "Créditos de las imágenes · Trama",
  description: "Autoría y licencia de las fotografías que usan las webs de demostración de Trama.",
  alternates: { canonical: "/creditos" },
};

const TOPICS: Record<string, string> = {
  arquitectura: "Arquitectura",
  interiores: "Interiores",
  eventos: "Eventos",
  objetos: "Objetos",
  estudio: "Estudio",
  naturaleza: "Naturaleza",
  ciudad: "Ciudad",
  gastronomia: "Gastronomía",
};

/** Atribución de las fotografías de las demos: autor, licencia y página de origen de cada una. Sale de `lib/sites/photo-credits.json`. */
export default function CreditosPage() {
  return (
    <main id="contenido" className="cr">
      <h1>Créditos de las imágenes</h1>
      <p className="cr__lead">
        Las fotografías de las webs de demostración vienen de <a href="https://commons.wikimedia.org/">Wikimedia Commons</a> y se usan con licencias que permiten
        reutilizarlas y redistribuirlas (CC0, dominio público o CC BY). Gracias a quienes las hicieron y las compartieron. Cada foto enlaza a su página de origen.
      </p>
      {Object.entries(TOPICS).map(([topic, label]) => {
        const list = allPhotos.filter((p) => p.topic === topic);
        if (list.length === 0) return null;
        return (
          <section key={topic} aria-labelledby={`t-${topic}`}>
            <h2 id={`t-${topic}`}>{label}</h2>
            <ul className="cr__grid">
              {list.map((p) => (
                <li key={p.file} className="cr__item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} alt="" loading="lazy" width={160} height={Math.round((160 * p.height) / p.width)} />
                  <div>
                    <a href={p.page}>{p.title.replace(/\.jpe?g$/i, "").replace(/[_-]+/g, " ")}</a>
                    <span>{p.author}</span>
                    <a className="cr__lic" href={p.licenseUrl || p.page}>{p.license}</a>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
