import type { Ficha } from "@/lib/cine/schema";
import { bloom, bloomDesviado } from "./bloom";
import { cameraScroll } from "./cameraScroll";
import { hublot } from "./hublot";
import { bruno } from "./bruno";
import { plainSight } from "./plainSight";
import { lusion } from "./lusion";

/** Fichas que monta el banco en /lab/cine/[estudio] (docs/26). Una por estudio o calibración. */
export const ESTUDIOS: Record<string, Ficha> = { bloom, "bloom-desviado": bloomDesviado, "camera-scroll": cameraScroll, "plain-sight": plainSight, hublot, bruno, lusion };
