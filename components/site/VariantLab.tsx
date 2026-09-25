"use client";

import { useState } from "react";
import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import CodeBlock from "@/components/ui/CodeBlock";
import Progress from "@/components/ui/Progress";
import Select from "@/components/ui/Select";
import Tabs from "@/components/ui/Tabs";
import TextField from "@/components/ui/TextField";
import Toggle from "@/components/ui/Toggle";
import { INTENTS, type Intent } from "@/components/ui/intent";
import { VARIANTS, type Variant } from "@/components/ui/variants";

/** Mismo acento que la web salvo en las variantes que piden su propio color para lucirse. */
const ACCENTS: Partial<Record<Variant, string>> = { neon: "#ff2fd0", retro: "#ffb000", terminal: "#39ff88" };

/**
 * Banco de pruebas de la portada: las mismas piezas del kit pintadas con la variante y la intención que se elijan, y el código
 * que las produce. Enseña en un vistazo las dos props que comparten todos los componentes.
 */
export default function VariantLab() {
  const [variant, setVariant] = useState<Variant>("minimal");
  const [intent, setIntent] = useState<Intent>("accent");
  const acc = ACCENTS[variant];
  const fieldIntent = intent === "accent" || intent === "neutral" ? undefined : intent;

  const code = `<Button label="Desplegar" variant="${variant}" intent="${intent}" />
<Badge text="${intent}" variant="${variant}" intent="${intent}" dot />
<TextField label="Correo" variant="${variant}"${fieldIntent ? ` intent="${fieldIntent}"` : ""} />
<Alert title="Aviso" variant="${variant}" intent="${intent}" />`;

  return (
    <div className="tr-lab">
      <div className="tr-lab__controls">
        <div className="tr-lab__group" role="radiogroup" aria-label="Variante">
          <p className="tr-label">variant</p>
          <div className="tr-chips">
            {VARIANTS.map((v) => (
              <button key={v} type="button" role="radio" aria-checked={v === variant} className={`tr-chip ${v === variant ? "is-on" : ""}`} onClick={() => setVariant(v)}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="tr-lab__group" role="radiogroup" aria-label="Intención">
          <p className="tr-label">intent</p>
          <div className="tr-chips">
            {INTENTS.map((k) => (
              <button key={k} type="button" role="radio" aria-checked={k === intent} className={`tr-chip ${k === intent ? "is-on" : ""}`} onClick={() => setIntent(k)}>
                {k}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tr-lab__body">
        <div className="tr-lab__stage ui-stage" style={acc ? ({ "--acc": acc } as React.CSSProperties) : undefined}>
          <div className="tr-lab__row">
            <Button label="Desplegar" variant={variant} intent={intent} />
            <Button label="Cancelar" variant={variant} intent={intent} emphasis="ghost" />
            <Badge text={intent} variant={variant} intent={intent} dot />
            <Badge text="v1.0" variant={variant} intent="neutral" />
          </div>
          <div className="tr-lab__grid">
            <TextField label="Correo" placeholder="tu@correo.com" variant={variant} intent={fieldIntent} hint={fieldIntent ? `intent="${fieldIntent}"` : "Te respondemos en 24 h"} />
            <Select label="Plan" options="Básico, Pro, Equipo" defaultValue="Pro" variant={variant} />
          </div>
          <Alert title="Sensor desplegado" message="El primer informe llegará en menos de cinco minutos." variant={variant} intent={intent} />
          <div className="tr-lab__grid">
            <Progress value={64} label="Sincronizando" showValue variant={variant} />
            <Toggle label="Modo estricto" defaultChecked variant={variant} />
          </div>
          <Tabs items="Resumen, Actividad, Ajustes" content={"Todo en orden: 0 incidencias abiertas.\n3 despliegues esta semana.\nPermisos, claves y webhooks."} variant={variant} />
        </div>
        <CodeBlock code={code} language="tsx" filename="page.tsx" variant="minimal" className="tr-lab__code" />
      </div>
    </div>
  );
}
