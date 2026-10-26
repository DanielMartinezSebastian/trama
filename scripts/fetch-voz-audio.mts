/** Archivo sonoro de Voyager, NASA/dominio público, con atribución comprobada en Commons. */
import { mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const title = "Voyager Golden Record - Greetings In 55 Languages.mp3";
const params = new URLSearchParams({ action: "query", format: "json", titles: `File:${title}`, prop: "imageinfo", iiprop: "url|mime|size|extmetadata" });
const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`);
if (!response.ok) throw new Error(`Commons ${response.status}`);
const metadata = await response.json() as any;
const info = (Object.values(metadata.query.pages)[0] as any).imageinfo?.[0];
if (info?.mime !== "audio/mpeg" || info.size > 10_000_000 || !/^public domain$/i.test(info.extmetadata.LicenseShortName.value)) throw new Error("La grabación no supera la comprobación de licencia y formato");
const audio = await fetch(info.url);
if (!audio.ok) throw new Error(`Audio ${audio.status}`);
mkdirSync(".cache/voz", { recursive: true });
mkdirSync("public/audio/voyager", { recursive: true });
writeFileSync(".cache/voz/saludos-original.mp3", Buffer.from(await audio.arrayBuffer()));
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", ".cache/voz/saludos-original.mp3", "-ac", "1", "-b:a", "96k", "public/audio/voyager/saludos.mp3"]);
writeFileSync("public/audio/voyager/credito.json", JSON.stringify({ title, author: "NASA", license: "Public domain", source: info.descriptionurl }, null, 2) + "\n");
console.log("Saludos originales de Voyager descargados y comprimidos; NASA, dominio público.");
