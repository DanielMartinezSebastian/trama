"use client";

import { useState } from "react";
import { vcls, type Variant } from "./variants";

export type CodeBlockProps = {
  code?: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  variant?: Variant;
  className?: string;
};

/** Bloque de código con cabecera, numeración de línea opcional y botón de copiar. Sin resaltado de sintaxis. */
export default function CodeBlock({
  code = 'export function greet(name: string) {\n  return `Hola, ${name}`;\n}',
  language = "tsx",
  filename = "",
  showLineNumbers = true,
  variant = "terminal",
  className = "",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* portapapeles no disponible */
    }
  };

  return (
    <div className={`ui-code ui-surface ${vcls(variant)} ${className}`}>
      <div className="ui-code__head">
        <div className="ui-code__dots" aria-hidden>
          <i />
          <i />
          <i />
        </div>
        <span className="ui-code__name">{filename || language}</span>
        <button type="button" className="ui-code__copy" onClick={copy}>
          {copied ? "Copiado ✓" : "Copiar"}
        </button>
      </div>
      {/* enfocable: si una línea no cabe, el bloque se desplaza también con el teclado */}
      <pre className="ui-code__pre" tabIndex={0} aria-label={`Código${filename ? ` · ${filename}` : language ? ` · ${language}` : ""}`}>
        <code>
          {lines.map((line, i) => (
            <span key={i} className="ui-code__line">
              {showLineNumbers && (
                <span className="ui-code__ln" aria-hidden>
                  {i + 1}
                </span>
              )}
              <span>{line || " "}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
