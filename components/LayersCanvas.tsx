"use client";

import AsciifyCanvas from "@/components/AsciifyCanvas";
import TextmodeCanvas from "@/components/TextmodeCanvas";

/**
 * Las dos librerías apiladas: asciify-engine (Studio) como fondo y textmode.js encima.
 * La capa superior se fusiona con `mix-blend-mode: screen`, así el negro no tapa nada.
 */
export default function LayersCanvas({ slug }: { slug: string }) {
  return (
    <>
      <AsciifyCanvas slug={slug} />
      <TextmodeCanvas slug={slug} overlay />
    </>
  );
}
