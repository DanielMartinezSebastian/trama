import type { Metadata } from "next";
import { allPhotos } from "@/lib/sites/photos";
import "./creditos.css";

export const metadata: Metadata = {
  title: "Créditos de las imágenes · Trama",
  description: "Autoría y licencia de las fotografías, los modelos 3D y los datos de mapa que usan las webs de demostración de Trama.",
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
      <section aria-labelledby="t-modelos">
        <h2 id="t-modelos">Modelos 3D y mapas</h2>
        <ul className="cr__lead">
          <li>
            <b>Clínica de la demo Plano</b> (<code>/models/clinica/</code>): BSI (2020) «Medical-Dental Test Files», buildingSMART International,{" "}
            <a href="https://github.com/buildingsmart-community/Community-Sample-Test-Files/tree/main/IFC%202.3.0.1%20(IFC%202x3)/Medical-Dental%20Clinic">Community-Sample-Test-Files</a>, con licencia{" "}
            <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Cambios: se juntaron los modelos de arquitectura, estructura y climatización, se
            simplificaron pilares, vigas, conductos y ventanas a cajas, se quitaron mobiliario, puertas y cimentación y se pasó a GLB por capas con la planta baja en SVG
            (<code>scripts/maqueta/ifc_to_glb.py</code>).
          </li>
          <li>
            <b>Eixample de Barcelona del catálogo</b> (<code>/models/eixample/</code>): datos ©{" "}
            <a href="https://www.openstreetmap.org/copyright">colaboradores de OpenStreetMap</a>, con licencia{" "}
            <a href="https://opendatacommons.org/licenses/odbl/">ODbL</a> (alturas por plantas procedentes del Catastro). Extruido a GLB con{" "}
            <code>scripts/maqueta/osm_to_glb.py</code>.
          </li>
        </ul>
      </section>
    </main>
  );
}
