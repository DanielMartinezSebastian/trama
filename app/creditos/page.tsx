import type { Metadata } from "next";
import { allPhotos } from "@/lib/sites/photos";
import { generatedBusinessArt } from "@/lib/sites/generated-business-art";
import { allVideos } from "@/lib/sites/videos";
import "./creditos.css";

export const metadata: Metadata = {
  title: "Créditos de las imágenes y los vídeos · Trama",
  description: "Autoría y licencia de las fotografías, los vídeos, los modelos 3D y los datos de mapa que usan las webs de demostración de Trama.",
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
  deporte: "Deporte",
  verano: "Verano",
  peluqueria: "Peluquería",
  fitness: "Fitness",
};

const VIDEO_TOPICS: Record<string, string> = { oceano: "Océano", costa: "Costa", naturaleza: "Naturaleza", ciudad: "Ciudad", cielo: "Cielo" };

/** Atribución de las fotografías de las demos: autor, licencia y página de origen de cada una. Sale de `lib/sites/photo-credits.json`. */
export default function CreditosPage() {
  return (
    <main id="contenido" className="cr">
      <h1>Créditos de las imágenes y los vídeos</h1>
      <p className="cr__lead">
        Las fotografías de las webs de demostración vienen de <a href="https://commons.wikimedia.org/">Wikimedia Commons</a> y se usan con licencias que permiten
        reutilizarlas y redistribuirlas (CC0, dominio público o CC BY). Gracias a quienes las hicieron y las compartieron. Cada foto enlaza a su página de origen.
      </p>
      <section aria-labelledby="t-campanas">
        <h2 id="t-campanas">Imágenes generadas: Hebra, Esparta, Cadencia y Forja</h2>
        <p className="cr__lead">Estas escenas fueron generadas con OpenAI para cuatro marcas ficticias. No representan clientes, equipo ni resultados reales. La barra 3D de Forja está modelada por código, sin recursos de terceros.</p>
        <ul className="cr__grid">{generatedBusinessArt.map(a=><li className="cr__item" key={a.src}><img src={a.src} alt="" width={160} height={100} loading="lazy"/><div><b>{a.title}</b><span>Imagen generada · Escena ficticia</span></div></li>)}</ul>
      </section>
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
      <h2 id="t-videos">Vídeos</h2>
      <p className="cr__lead">
        Los vídeos también vienen de Wikimedia Commons (CC0, dominio público o CC BY). Son tramos de 7 a 12 segundos de cada original, reducidos a 1280 px, sin
        sonido y con un fundido al principio y al final para reproducirlos en bucle; el póster es un fotograma del tramo. Cada uno enlaza a su original.
      </p>
      {Object.entries(VIDEO_TOPICS).map(([topic, label]) => {
        const list = allVideos.filter((v) => v.topic === topic);
        if (list.length === 0) return null;
        return (
          <section key={topic} aria-labelledby={`tv-${topic}`}>
            <h3 id={`tv-${topic}`}>{label}</h3>
            <ul className="cr__grid">
              {list.map((v) => (
                <li key={v.file} className="cr__item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.posterSrc} alt="" loading="lazy" width={160} height={Math.round((160 * v.height) / v.width)} />
                  <div>
                    <a href={v.page}>{v.title.replace(/\.(webm|ogv)$/i, "").replace(/[_-]+/g, " ")}</a>
                    <span>
                      {v.author} · tramo de {Math.round(v.duration)} s
                    </span>
                    <a className="cr__lic" href={v.licenseUrl || v.page}>{v.license}</a>
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
