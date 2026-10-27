"use client";

import { useState } from "react";
import OpeningHours from "@/components/ui/OpeningHours";
import { CLUBES } from "./data";
import { viveHref } from "./enlaces";

/**
 * El mapa de los cuatro clubes: cada punto es un botón que cambia la ficha (foto, dirección, abierto ahora y zonas). Con
 * el teclado, los puntos se recorren con el tabulador; la lista de debajo hace lo mismo para quien no ve el mapa.
 */
export function MapaClubes({ conLista = false }: { conLista?: boolean }) {
  const [sel, setSel] = useState(CLUBES[0].id);
  const c = CLUBES.find((x) => x.id === sel)!;
  return (
    <>
      <div className="vv-mapa__plano" aria-label="Mapa de los cuatro clubes">
        {CLUBES.map((x) => (
          <button key={x.id} type="button" className="vv-pin" style={{ left: `${x.x}%`, top: `${x.y}%` }} aria-pressed={sel === x.id} aria-label={x.nombre} onClick={() => setSel(x.id)}>
            <span>{x.nombre.replace("Vive ", "")}</span>
          </button>
        ))}
        <div className="vv-mapa__ficha" key={c.id} aria-live="polite">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/inspiraciones/vive/mapa-club.webp" alt="" />
          <div>
            <p>
              <b>{c.nombre.toUpperCase()}</b>
              <br />
              {c.dir}, Madrid
              <br />
              <a href={`mailto:${c.correo}`}>{c.correo}</a>
            </p>
            <OpeningHours hours={c.horario} layout="badge" title="" variant="minimal" />
            <a href={viveHref(`clases?club=${c.id}`)} className="vv-mas">
              CLASES EN ESTE CLUB [+]
            </a>
          </div>
        </div>
      </div>
      {conLista && (
        <ul className="vv-clubes">
          {CLUBES.map((x) => (
            <li key={x.id}>
              <button type="button" aria-pressed={sel === x.id} onClick={() => setSel(x.id)}>
                <b>{x.nombre}</b>
                <span>{x.dir}</span>
                <span>{x.zonas}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
