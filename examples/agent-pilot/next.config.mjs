/** Next debe transformar las llamadas next/font incluidas en trama-ui/fonts. */
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL(".", import.meta.url));
export default { transpilePackages: ["trama-ui"], devIndicators: false, turbopack: { root }, outputFileTracingRoot: root };
