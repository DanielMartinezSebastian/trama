/** Contrato de exports compartido por el empaquetador y las referencias de consumo. */
export const OPTIONAL_PEER_COMPONENTS = new Set(["RetroCanvas", "RetroFX", "RetroShapes", "RetroModel", "DeviceMockup3D", "Logo3D", "DistortImage", "ObjectStage", "ExplorableCanvas", "TypeField", "Porthole", "ToyDrive", "ChapterStage", "CrossCluster", "EngravedMap", "GravureCanvas", "ThornEmblem"]);
export const OPTIONAL_PEERS = { three: ">=0.170", "@react-three/fiber": ">=9" };

export const PACKAGE_EXPORTS = {
  ".": { types: "./dist/index.d.ts", default: "./dist/index.js" },
  "./styles.css": "./dist/components/ui/styles/kit.css",
  "./fonts": { types: "./dist/lib/ui/fonts.d.ts", default: "./dist/lib/ui/fonts.js" },
  "./tokens": { types: "./dist/lib/ui/tokens.d.ts", default: "./dist/lib/ui/tokens.js" },
  "./icons/phosphor": { types: "./dist/lib/ui/icons-phosphor.d.ts", default: "./dist/lib/ui/icons-phosphor.js" },
  "./icons/phosphor-*": { types: "./dist/lib/ui/icons-phosphor-*.d.ts", default: "./dist/lib/ui/icons-phosphor-*.js" },
  "./icons/lucide": { types: "./dist/lib/ui/icons-lucide.d.ts", default: "./dist/lib/ui/icons-lucide.js" },
  "./assets/*": "./assets/*",
  "./*": { types: "./dist/components/ui/*.d.ts", default: "./dist/components/ui/*.js" },
  "./package.json": "./package.json",
};

/** Sigue exports exactos antes que patrones; no permite imports privados por accidente. */
export function resolvePublicExport(specifier: string, exports: Record<string, string | { types: string; default: string }> = PACKAGE_EXPORTS): { types?: string; default: string } {
  if (specifier !== "trama-ui" && !specifier.startsWith("trama-ui/")) throw new Error(`No es un import de Trama: ${specifier}`);
  const key = specifier === "trama-ui" ? "." : `.${specifier.slice("trama-ui".length)}`;
  let value = exports[key];
  if (!value) {
    const patterns = Object.keys(exports).filter((k) => k.includes("*")).sort((a, b) => b.length - a.length);
    for (const pattern of patterns) {
      const [start, end] = pattern.split("*");
      if (!key.startsWith(start) || !key.endsWith(end)) continue;
      const match = key.slice(start.length, end ? -end.length : undefined);
      if (!match || match.includes("..")) continue;
      const target = exports[pattern];
      value = typeof target === "string" ? target.replace("*", match) : { types: target.types.replace("*", match), default: target.default.replace("*", match) };
      break;
    }
  }
  if (!value) throw new Error(`Import no exportado: ${specifier}`);
  return typeof value === "string" ? { default: value } : value;
}
