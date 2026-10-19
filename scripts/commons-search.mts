/**
 * Busca fotos en Wikimedia Commons con licencia que permite redistribuir (CC0, dominio público, CC BY) y las lista, sin
 * descargar nada. Uso: `npx tsx scripts/commons-search.mts "consulta" [n]`. Las de «misma licencia» (SA), «sin derivadas» (ND) y
 * «no comercial» (NC) se descartan.
 */
const q = process.argv[2] ?? "architecture";
const n = Number(process.argv[3] ?? 12);
const UA = "TramaUI-demo-images/1.0 (https://github.com/DanielMartinezSebastian/trama; demo assets)";
const params = new URLSearchParams({
  action: "query", format: "json", generator: "search", gsrsearch: `${q} filetype:bitmap`, gsrnamespace: "6", gsrlimit: "50",
  prop: "imageinfo", iiprop: "url|size|mime|extmetadata", iiurlwidth: "1600", origin: "*",
});
const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { headers: { "User-Agent": UA } });
const json = (await res.json()) as { query?: { pages: Record<string, any> } };
const OK = /^(cc0|cc-zero|public domain|pd|cc by \d|cc-by-\d)/i;
const out = Object.values(json.query?.pages ?? {})
  .map((p: any) => {
    const ii = p.imageinfo?.[0];
    const m = ii?.extmetadata ?? {};
    return { title: p.title as string, w: ii?.width as number, h: ii?.height as number, mime: ii?.mime as string, lic: (m.LicenseShortName?.value ?? "") as string, artist: String(m.Artist?.value ?? "").replace(/<[^>]+>/g, "").trim().slice(0, 40), thumb: ii?.thumburl as string };
  })
  .filter((x) => x.mime === "image/jpeg" && x.w >= 2400 && OK.test(x.lic) && !/\b(sa|nd|nc)\b/i.test(x.lic))
  .slice(0, n);
for (const x of out) console.log(`${x.title.replace("File:", "").slice(0, 70).padEnd(70)} ${x.w}x${x.h} ${x.lic.padEnd(12)} ${x.artist}`);
console.log(`— ${out.length} candidatos para «${q}»`);
