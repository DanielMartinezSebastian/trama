"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** la puntuación del usuario de una demo frente a su referencia (docs/36 A9); la guarda la ruta /lab/cine/puntuar */
export default function Puntuar({ receta }: { receta: string }) {
  const router = useRouter();
  const [sensacion, setSensacion] = useState(0);
  const [profundidad, setProfundidad] = useState(0);
  const [nota, setNota] = useState("");
  const [estado, setEstado] = useState<"" | "enviando" | "ok" | "error">("");

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado("enviando");
    const res = await fetch("/lab/cine/puntuar", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ receta, sensacion, profundidad, nota }) }).catch(() => null);
    if (!res?.ok) return setEstado("error");
    setEstado("ok");
    setNota("");
    router.refresh();
  };

  const escala = (nombre: string, valor: number, poner: (v: number) => void) => (
    <fieldset className="cpl-puntuar__escala">
      <legend>{nombre}</legend>
      {[1, 2, 3, 4, 5].map((v) => (
        <label key={v} className={v <= valor ? "is-on" : ""}>
          <input type="radio" name={`${receta}-${nombre}`} value={v} checked={valor === v} onChange={() => poner(v)} />
          {v}
        </label>
      ))}
    </fieldset>
  );

  return (
    <form className="cpl-puntuar" onSubmit={enviar}>
      {escala("Sensación", sensacion, setSensacion)}
      {escala("Profundidad", profundidad, setProfundidad)}
      <textarea value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Qué falta para que se sienta como la referencia" rows={2} maxLength={600} />
      <button type="submit" className="cpl-boton" disabled={!sensacion || !profundidad || estado === "enviando"}>
        {estado === "enviando" ? "Guardando…" : "Puntuar la última vuelta"}
      </button>
      {estado === "ok" && <span className="cpl-mut">Guardada.</span>}
      {estado === "error" && <span className="cpl-mut">No se pudo guardar.</span>}
    </form>
  );
}
