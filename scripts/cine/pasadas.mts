/**
 * La cadena de render leída desde la API gráfica (docs/34 §2): con las pasadas de un fotograma (gancho gl.js: destino,
 * tamaño, llamadas y triángulos de cada una) reconoce las técnicas por su forma, sin saber el motor. Es lo que se hizo a
 * ojo con Active Theory (Hydra, sin three) y Chartogne-Taillet.
 *   - simulación en la GPU: pasadas que se alternan entre dos destinos del mismo tamaño (ida y vuelta);
 *   - pirámide (bloom, desenfoque): tres o más pasadas seguidas que reducen ancho y alto a la mitad;
 *   - destellos anamórficos: tres o más que reducen solo el ancho (o solo el alto);
 *   - escena: la pasada con más triángulos; composición: lo que se pinta en pantalla;
 *   - mapas auxiliares: pasadas cuadradas pequeñas sueltas (sombras, ruido, LUT, texturas generadas);
 *   - partículas: más de 50 000 puntos dibujados.
 */
export type PasadaGL = { destino: string; w: number; h: number; calls: number; tris: number };
export type FotogramaGL = { calls: number; tris: number; instancias: number; puntos: number; lineas: number; pasadas: PasadaGL[] };
export type Tecnica = { tipo: "escena" | "composicion" | "simulacion" | "piramide" | "anamorfico" | "auxiliar" | "particulas" | "pasada"; texto: string; pasadas: number };

export function leerPasadas(f: FotogramaGL): Tecnica[] {
  const p = f.pasadas;
  const usada = new Array(p.length).fill(false);
  const out: Tecnica[] = [];
  const tam = (x: PasadaGL) => `${x.w}×${x.h}`;

  // escena: la de más triángulos
  let ie = -1;
  p.forEach((x, i) => {
    if (x.destino !== "pantalla" && (ie < 0 || x.tris > p[ie].tris)) ie = i;
  });
  if (ie >= 0 && p[ie].tris > 1000) {
    usada[ie] = true;
    out.push({ tipo: "escena", texto: `escena a ${tam(p[ie])} con ${p[ie].calls} llamadas y ${p[ie].tris.toLocaleString("es")} triángulos`, pasadas: 1 });
  }

  // cadenas de reducción: pirámide (ancho y alto a la mitad) o anamórfica (solo uno)
  for (let i = 0; i < p.length; i++) {
    if (usada[i]) continue;
    for (const modo of ["piramide", "anamorfico"] as const) {
      let j = i;
      const pasos = [i];
      while (j + 1 < p.length) {
        const a = p[j], b = p[j + 1];
        const mw = b.w * 2 >= a.w - 1 && b.w * 2 <= a.w + 1, mh = b.h * 2 >= a.h - 1 && b.h * 2 <= a.h + 1;
        const ok = modo === "piramide" ? mw && mh : (mw && b.h === a.h) || (mh && b.w === a.w);
        // en una pirámide de bloom hay a veces dos pasadas por nivel (horizontal y vertical): se admiten repetidas
        if (ok) pasos.push(++j);
        else if (b.w === a.w && b.h === a.h && modo === "piramide" && j + 2 < p.length) pasos.push(++j);
        else break;
      }
      const niveles = new Set(pasos.map((k) => tam(p[k]))).size;
      if (niveles >= 3) {
        pasos.forEach((k) => (usada[k] = true));
        const a = p[pasos[0]], z = p[pasos[pasos.length - 1]];
        out.push(
          modo === "piramide"
            ? { tipo: "piramide", texto: `pirámide de ${niveles} niveles de ${tam(a)} a ${tam(z)} (bloom o desenfoque)`, pasadas: pasos.length }
            : // la dirección es la que más se reduce (una cadena puede empezar bajando el alto una vez y seguir por el ancho)
              { tipo: "anamorfico", texto: `reducción ${z.w / a.w < z.h / a.h ? "horizontal" : "vertical"} de ${tam(a)} a ${tam(z)} en ${niveles} niveles (destellos anamórficos)`, pasadas: pasos.length },
        );
        break;
      }
    }
  }

  // simulación: destinos del mismo tamaño que se alternan (A, B, A, B…)
  const porTam = new Map<string, number[]>();
  p.forEach((x, i) => {
    if (!usada[i] && x.destino !== "pantalla") porTam.set(tam(x), [...(porTam.get(tam(x)) ?? []), i]);
  });
  for (const [t, idx] of porTam) {
    const destinos = idx.map((i) => p[i].destino);
    let alternos = 0;
    for (let k = 2; k < destinos.length; k++) if (destinos[k] === destinos[k - 2] && destinos[k] !== destinos[k - 1]) alternos++;
    if (alternos >= 2) {
      idx.forEach((i) => (usada[i] = true));
      out.push({ tipo: "simulacion", texto: `simulación en la GPU a ${t}: ${idx.length} pasadas de ida y vuelta entre ${new Set(destinos).size} destinos`, pasadas: idx.length });
    }
  }

  // composición y mapas auxiliares
  const pant = p.filter((x, i) => !usada[i] && x.destino === "pantalla");
  if (pant.length) {
    p.forEach((x, i) => x.destino === "pantalla" && (usada[i] = true));
    out.push({ tipo: "composicion", texto: `composición en pantalla a ${tam(pant[0])} (${pant.reduce((s, x) => s + x.calls, 0)} llamadas)`, pasadas: pant.length });
  }
  const aux = p.filter((x, i) => !usada[i] && x.w === x.h && x.w <= 1024);
  if (aux.length) {
    p.forEach((x, i) => !usada[i] && x.w === x.h && x.w <= 1024 && (usada[i] = true));
    out.push({ tipo: "auxiliar", texto: `${aux.length} mapas cuadrados auxiliares (${[...new Set(aux.map(tam))].join(", ")}: sombras, ruido, LUT o texturas generadas)`, pasadas: aux.length });
  }
  const resto = p.filter((_, i) => !usada[i]);
  if (resto.length) out.push({ tipo: "pasada", texto: `${resto.length} pasadas más a pantalla completa o fracciones (${[...new Set(resto.map(tam))].slice(0, 6).join(", ")}): posprocesado`, pasadas: resto.length });
  if (f.puntos > 50_000) out.push({ tipo: "particulas", texto: `${f.puntos.toLocaleString("es")} puntos por fotograma (partículas${Math.sqrt(f.puntos) % 1 === 0 ? `: ${Math.sqrt(f.puntos)}², una textura de simulación` : ""})`, pasadas: 0 });
  return out;
}
