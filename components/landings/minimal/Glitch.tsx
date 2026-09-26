"use client";

import { useEffect, useState, type CSSProperties } from "react";

/** Texto que se escribe carácter a carácter con parpadeo "glitch" cuando su sección tiene `data-in`. */
export function Glitch({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  // cada letra es un inline-block (para animarla sola): se agrupan por palabras que no se parten, o el navegador cortaría
  // «geometría» en «g / eometría» al final de línea. El índice sigue siendo global para el retardo de cada letra.
  let n = 0;
  const words = text.split(" ").map((w) => Array.from(w).map((c) => ({ c, i: n++ })));
  return (
    // el texto legible va aparte: un aria-label en un <span> sin rol no lo lee ningún lector de pantalla
    <span className={`mn-g ${className}`}>
      <span className="ui-sr-only">{text}</span>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden>
          {wi > 0 && " "}
          <span className="mn-g__w">
            {w.map(({ c, i }) => (
              <span key={i} className="mn-g__c" style={{ "--d": `${delay + (i + wi) * 45 + (((i + wi) * 37) % 5) * 20}ms` } as CSSProperties}>
                {c}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

/** Palabra rotativa: cada cambio la re-escribe con el mismo efecto. */
export function Rotator({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2600);
    return () => clearInterval(id);
  }, [words.length]);
  return (
    <span className="mn-rot">
      <span key={i} className="mn-rot__w">
        <Glitch text={words[i]} className="mn-hl" />
      </span>
    </span>
  );
}

/** Texto que GSAP descifra al entrar en pantalla (lo dirige el contenedor con [data-scramble]). Visible solo con `data-in`. */
export function Scramble({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className}>
      <span className="ui-sr-only">{text}</span>
      <span className="mn-scr" aria-hidden data-scramble={text}>
        {" ".repeat(text.length)}
      </span>
    </span>
  );
}
