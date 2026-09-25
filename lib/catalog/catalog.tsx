"use client";

import type { CatalogEntry } from "./schema";
import { contenido } from "./entries/contenido";
import { datos } from "./entries/datos";
import { feedback } from "./entries/feedback";
import { fondos } from "./entries/fondos";
import { galerias } from "./entries/galerias";
import { formularios } from "./entries/formularios";
import { interaccion } from "./entries/interaccion";
import { navegacion } from "./entries/navegacion";
import { overlays } from "./entries/overlays";
import { pixel } from "./entries/pixel";
import { secciones } from "./entries/secciones";
import { tarjetas } from "./entries/tarjetas";
import { texto } from "./entries/texto";
import { transiciones } from "./entries/transiciones";

/**
 * Catálogo de componentes: una lista por categoría en `entries/`. Para añadir un componente, crea su
 * entrada en la categoría que corresponda (ver docs/02-guia-de-componentes.md §9).
 */
export const catalog: CatalogEntry[] = [...fondos, ...texto, ...tarjetas, ...interaccion, ...transiciones, ...datos, ...navegacion, ...formularios, ...feedback, ...galerias, ...secciones, ...contenido, ...overlays, ...pixel];

export const getEntry = (id: string) => catalog.find((e) => e.id === id);
