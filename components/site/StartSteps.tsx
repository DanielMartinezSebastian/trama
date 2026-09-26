"use client";

import { useState } from "react";
import CodeBlock from "@/components/ui/CodeBlock";
import Tabs from "@/components/ui/Tabs";

const NPM = `npm i trama-ui

// app/layout.tsx
import "trama-ui/styles.css";

// cualquier página
import { Hero, FeatureGrid, Footer } from "trama-ui";`;

const COPY = `# desde este repo: copia el código a tu proyecto
npm run kit:export -- ../mi-web --only Hero,PricingSection,Footer

// app/layout.tsx
import "@/components/ui/styles/kit.css";
import { fontVariables } from "@/lib/ui/fonts";`;

const THEME = `<main style={{
  "--bg": "#000", "--fg": "#ededed", "--mut": "#8a8a8a",
  "--acc": "#ff3b3b", "--acc2": "#8a8a8a",
  "--card": "transparent", "--ln": "rgba(255,255,255,.14)", "--r": "0px",
}}>
  <Hero variant="minimal" title="Tu producto" subtitle="" />
</main>`;

const STEPS: [string, string, string][] = [
  [NPM, "tsx", "terminal · layout.tsx"],
  [COPY, "bash", "kit:export"],
  [THEME, "tsx", "page.tsx"],
];

/** Pestañas de «Empezar» en la portada: npm, copia del código o tema, con su bloque de código. */
export default function StartSteps() {
  const [step, setStep] = useState(0);
  const [code, lang, file] = STEPS[step];
  return (
    <div className="tr-start__steps">
      <Tabs items="npm, Copiar el código, Tema" content="" variant="minimal" onChange={(i) => setStep(i)} />
      <CodeBlock code={code} language={lang} filename={file} variant="minimal" />
    </div>
  );
}
