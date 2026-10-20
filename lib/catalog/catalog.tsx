"use client";

import type { CatalogEntry } from "./schema";
import { comercio } from "./entries/comercio";
import { contenido } from "./entries/contenido";
import { datos } from "./entries/datos";
import { feedback } from "./entries/feedback";
import { fondos } from "./entries/fondos";
import { formulas } from "./entries/formulas";
import { ronda3 } from "./entries/ronda3";
import { ronda5 } from "./entries/ronda5";
import { galerias } from "./entries/galerias";
import { formularios } from "./entries/formularios";
import { interaccion } from "./entries/interaccion";
import { movimiento } from "./entries/movimiento";
import { scroll } from "./entries/scroll";
import { navegacion } from "./entries/navegacion";
import { overlays } from "./entries/overlays";
import { producto } from "./entries/producto";
import { pixel } from "./entries/pixel";
import { secciones } from "./entries/secciones";
import { tarjetas } from "./entries/tarjetas";
import { texto } from "./entries/texto";
import { webgl } from "./entries/webgl";
import { transiciones } from "./entries/transiciones";

/**
 * Catálogo de componentes: una lista por categoría en `entries/`. Para añadir un componente, crea su
 * entrada en la categoría que corresponda (ver docs/02-guia-de-componentes.md §9).
 */
export const catalog: CatalogEntry[] = [...fondos, ...texto, ...tarjetas, ...interaccion, ...transiciones, ...datos, ...navegacion, ...formularios, ...feedback, ...galerias, ...secciones, ...contenido, ...overlays, ...pixel, ...movimiento, ...scroll, ...webgl, ...producto, ...comercio, ...formulas, ...ronda3, ...ronda5];

export const getEntry = (id: string) => catalog.find((e) => e.id === id);
