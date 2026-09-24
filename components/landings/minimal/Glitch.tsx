"use client";

import { useEffect, useState, type CSSProperties } from "react";

/** Texto que se escribe carácter a carácter con parpadeo "glitch" cuando su sección tiene `data-in`. */
export function Glitch({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={`mn-g ${className}`} aria-label={text}>
      {Array.from(text).map((c, i) => (
        <span key={i} aria-hidden className="mn-g__c" style={{ "--d": `${delay + i * 45 + ((i * 37) % 5) * 20}ms` } as CSSProperties}>
          {c === " " ? " " : c}
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
    <span className={`mn-scr ${className}`} aria-label={text} data-scramble={text}>
      {" ".repeat(text.length)}
    </span>
  );
}
