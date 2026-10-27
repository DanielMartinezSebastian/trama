"use client";

import { useEffect, useState } from "react";
import Skeleton, { type SkeletonProps } from "@/components/ui/Skeleton";

export type SkeletonDemoProps = Pick<SkeletonProps, "loading" | "tone" | "animation" | "borderRadius"> & { layout: "card" | "article" | "table" };

/** El mismo contenido y el mismo DOM en ambos estados: cada pieza reserva su geometría. */
export default function SkeletonDemo({ loading = true, tone, animation, borderRadius, layout }: SkeletonDemoProps) {
  const [pending, setPending] = useState(loading);
  useEffect(() => setPending(loading), [loading]);
  const skeleton = { loading: pending, tone, animation, borderRadius };

  return (
    <div className="pg-skeleton-demo">
      <div className="pg-skeleton-demo__bar">
        <p role="status">{pending ? "Cargando contenido…" : "Contenido listo."}</p>
        <button type="button" className="chip" onClick={() => setPending((value) => !value)}>{pending ? "Mostrar contenido" : "Simular carga"}</button>
      </div>
      <div className="pg-skeleton-demo__content" aria-busy={pending} data-layout={layout}>
        {layout === "card" ? (
          <article className="pg-skeleton-card">
            <Skeleton {...skeleton}><div className="pg-skeleton-card__image"><span>TRAMA</span></div></Skeleton>
            <h3><Skeleton {...skeleton}>Una web que se siente tuya</Skeleton></h3>
            <p><Skeleton {...skeleton}>Componentes para dar forma a tu siguiente proyecto, desde la primera idea hasta el último detalle.</Skeleton></p>
            <Skeleton {...skeleton}><a className="pg-skeleton-demo__link" href="/demos" data-skeleton-action>Explorar demos →</a></Skeleton>
          </article>
        ) : layout === "article" ? (
          <article className="pg-skeleton-article">
            <p><Skeleton {...skeleton}>Diseño · 6 minutos de lectura</Skeleton></p>
            <h3><Skeleton {...skeleton}>El contenido marca el ritmo de la página</Skeleton></h3>
            <Skeleton {...skeleton}><img className="pg-skeleton-article__image" src="/img/esparta/corte.webp" alt="Un barbero trabajando en su taller" width={640} height={360} /></Skeleton>
            <p><Skeleton {...skeleton}>Los títulos, las imágenes y los párrafos conservan su sitio mientras llegan los datos. Al terminar la carga, la historia continúa en la misma posición.</Skeleton></p>
          </article>
        ) : (
          <div className="pg-skeleton-table">
            <table>
              <caption>Proyectos del estudio</caption>
              <thead><tr><th scope="col">Proyecto</th><th scope="col">Servicio</th><th scope="col">Estado</th></tr></thead>
              <tbody>
                {[["Casa Alba", "Interiorismo", "Publicado"], ["Tinta y Sal", "Identidad visual", "En revisión"], ["Faro Studio", "Web y movimiento", "En curso"]].map((row) => <tr key={row[0]}>{row.map((value, i) => <td key={i}><Skeleton {...skeleton}>{value}</Skeleton></td>)}</tr>)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
