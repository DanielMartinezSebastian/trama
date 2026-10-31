"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import styles from "./product.module.css";

type Version = "materia" | "ritual" | "esencial";
const WebGLStage = dynamic(() => import("./WebGLStage"), { ssr: false, loading: () => <div className={styles.loading}>Preparando escena…</div> });
const versions: { id: Version; name: string; tag: string }[] = [
  { id: "materia", name: "MATERIA", tag: "WebGL · Floema" },
  { id: "ritual", name: "RITUAL", tag: "WebGL · Magic Bottle" },
  { id: "esencial", name: "ESENCIAL", tag: "Sin WebGL · Longbow" },
];

function BuyPanel({ compact = false }: { compact?: boolean }) {
  const [color, setColor] = useState("Pino");
  const [added, setAdded] = useState(false);
  const colors = ["Pino", "Carbón", "Arena"];
  return <div className={`${styles.buyPanel} ${compact ? styles.buyCompact : ""}`}>
    <div className={styles.priceRow}><span>SONDA 01 / Altavoz portátil</span><strong>349 €</strong></div>
    <p className={styles.buySub}>Envío gratuito · 30 días para probarlo</p>
    <div className={styles.colorSelect} role="group" aria-label="Color del producto">{colors.map((c, i) => <button key={c} type="button" onClick={() => { setColor(c); setAdded(false); }} aria-pressed={color === c} className={`${styles.swatch} ${color === c ? styles.swatchOn : ""}`}><i style={{ background: ["#23473c", "#282a28", "#d2c4a8"][i] }} />{c}</button>)}</div>
    <button type="button" className={styles.buyButton} onClick={() => setAdded(true)}>{added ? `SONDA ${color} añadida ✓` : "Añadir a la cesta · 349 €"}<span aria-hidden="true">↗</span></button>
    {added && <p className={styles.cartNote} role="status">Tu selección está lista. El checkout de esta demo es ficticio; no se realiza ningún pago.</p>}
  </div>;
}

function ModeNav({ current }: { current: Version }) {
  return <nav className={styles.modeNav} aria-label="Comparar direcciones de diseño">{versions.map((v) => <Link key={v.id} href={`/producto/${v.id}`} aria-current={current === v.id ? "page" : undefined} className={current === v.id ? styles.modeActive : ""}><b>{v.name}</b><small>{v.tag}</small></Link>)}</nav>;
}

function Frame({ current, children }: { current: Version; children: ReactNode }) {
  return <main className={`${styles.page} ${styles[current]}`}><div className={styles.demoRibbon}>ESTUDIO DE PRODUCTO · DEMO FICTICIA <span>01 / 03</span></div><header className={styles.topbar}><Link href="/producto/materia" className={styles.brand}>SONDA<span>®</span></Link><div className={styles.topMeta}><span>Escucha el espacio</span><a href="#comprar">Comprar <b>↗</b></a></div></header><ModeNav current={current} />{children}<footer className={styles.disclaimer}>Producto, especificaciones y precio ficticios. Esta experiencia es una demo; no se aceptan pagos.</footer></main>;
}

function MatterPage() {
  return <Frame current="materia"><section className={styles.matterHero}><div className={styles.matterCopy}><p className={styles.eyebrow}>SONDA 01 · OBJETO ACÚSTICO PORTÁTIL</p><h1>El sonido<br/><em>toma forma.</em></h1><p className={styles.deck}>Un objeto hecho para durar. Metal recuperado, tejido de alto rendimiento y una escena sonora que llena la habitación.</p><a className={styles.textLink} href="#materiales">Explorar cómo está hecho <span>↓</span></a><BuyPanel /></div><div className={styles.matterScene}><WebGLStage scene="matter" /><div className={styles.stageCaption}><span>01 — CARCASA DE ALUMINIO RECUPERADO</span><span>ARRASTRA PARA EXPLORAR</span></div><div className={styles.orbitLabel}>01 / 03<br/>MATERIALES</div></div><div className={styles.verticalNote}>DISEÑADO PARA QUEDARSE · ENSAMBLADO PARA REPARARSE</div></section><section id="materiales" className={styles.materialStrip}><p>01 / HECHO CON INTENCIÓN</p><h2>Menos piezas.<br/>Mejor sonido.</h2><div className={styles.materialFacts}><article><b>01</b><h3>Aluminio recuperado</h3><p>Una carcasa mecanizada para resonar con claridad y volver al ciclo de materiales.</p></article><article><b>02</b><h3>Tejido reparable</h3><p>La funda acústica se retira y sustituye sin herramientas especiales.</p></article><article><b>03</b><h3>Sonido amplio</h3><p>Dos radiadores laterales llenan el espacio con graves equilibrados.</p></article></div><div className={styles.bottomBuy} id="comprar"><BuyPanel compact /></div></section></Frame>;
}

function RitualPage() {
  const [chapter, setChapter] = useState(0);
  const chapters = [{ n: "01", title: "TÓCALA", text: "Gira el objeto. Descubre la luz que marca el pulso." }, { n: "02", title: "ESCÚCHALA", text: "Una escena estéreo que cambia con la habitación." }, { n: "03", title: "LLÉVATELA", text: "Un gesto y el sonido se viene contigo." }];
  return <Frame current="ritual"><section className={styles.ritualHero}><div className={styles.ritualIntro}><p className={styles.eyebrow}>UN OBJETO. TU PROPIO RITUAL.</p><h1>El sonido<br/><span>se enciende.</span></h1><p>Un pequeño gesto abre un espacio enorme.</p><button type="button" className={styles.exploreButton} onClick={() => setChapter((chapter + 1) % chapters.length)}>Explorar gesto <span>↗</span></button></div><div className={styles.ritualCanvas}><WebGLStage scene="ritual" chapter={chapter} /><div className={styles.ripple} /><div className={styles.canvasInstruction}>MUEVE EL CURSOR · GIRA SONDA</div><div className={styles.sceneIndex}>{chapters[chapter].n}<span> / 03</span></div></div><aside className={styles.ritualChapter}><span>{chapters[chapter].n} / GESTO</span><h2>{chapters[chapter].title}</h2><p>{chapters[chapter].text}</p><div className={styles.chapterDots}>{chapters.map((c, i) => <button key={c.n} onClick={() => setChapter(i)} aria-label={`Ver capítulo ${c.n}`} aria-pressed={i === chapter} />)}</div></aside></section><section className={styles.ritualBuy} id="comprar"><div><p className={styles.eyebrow}>EL OBJETO COMPLETO</p><h2>Hazlo parte<br/>de tu mundo.</h2><p>24 h de batería · resistente al agua · funda intercambiable</p></div><BuyPanel compact /></section></Frame>;
}

function EssentialPage() {
  const [image, setImage] = useState("hero");
  const [faq, setFaq] = useState<number | null>(null);
  const questions = [["¿Cuánto dura la batería?", "Hasta 24 horas de reproducción en esta ficha ficticia."], ["¿Se puede usar al aire libre?", "La demo imagina protección IP67 para que puedas llevarla contigo."], ["¿Cuándo llega?", "En este ejemplo, el envío sería gratuito y se estimaría en 2–3 días laborables."]];
  return <Frame current="esencial"><section className={styles.essentialHero}><div className={styles.productGallery}><div className={`${styles.productImage} ${image === "hero" ? styles.imageHero : styles.imageLife}`} role="img" aria-label={image === "hero" ? "Altavoz SONDA en primer plano sobre piedra oscura" : "Dos personas escuchan SONDA al atardecer junto al mar"} /><div className={styles.galleryNav}><button onClick={() => setImage("hero")} aria-pressed={image === "hero"}>01 <span>OBJETO</span></button><button onClick={() => setImage("life")} aria-pressed={image === "life"}>02 <span>EN USO</span></button></div><span className={styles.galleryCount}>2 IMÁGENES ORIGINALES</span></div><div className={styles.productDetail}><p className={styles.eyebrow}>SONDA 01 / ALTAVOZ PORTÁTIL</p><h1>Que el sonido<br/>te encuentre.</h1><p className={styles.detailLead}>Precisión de estudio. Libertad para llevarla donde sucede la vida.</p><div className={styles.rating}>★★★★★ <span>4,9 · 126 reseñas de ejemplo</span></div><BuyPanel /><div className={styles.assurances}><span>↗ Envío gratuito</span><span>↻ 30 días de prueba</span><span>◉ 2 años de garantía</span></div><div className={styles.details}><div><span>BATERÍA</span><b>24 h</b></div><div><span>RESISTENCIA</span><b>IP67</b></div><div><span>PESO</span><b>820 g</b></div></div></div></section><section className={styles.essentialStory}><p className={styles.eyebrow}>HECHA PARA IR CONTIGO</p><h2>Pequeña en forma.<br/><i>Inmensa en presencia.</i></h2><div className={styles.storyPhoto} role="img" aria-label="Personas compartiendo música en un mirador costero al anochecer" /><p className={styles.photoCaption}>EL MEJOR LUGAR PARA ESCUCHAR ES DONDE ESTÁS.</p></section><section className={styles.faq}><p className={styles.eyebrow}>ANTES DE LLEVARLA</p><h2>Preguntas claras.</h2>{questions.map(([q, a], i) => <div key={q} className={styles.faqItem}><button onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i}>{q}<span>{faq === i ? "−" : "+"}</span></button>{faq === i && <p>{a}</p>}</div>)}<div className={styles.bottomBuy} id="comprar"><BuyPanel compact /></div></section></Frame>;
}

export default function ProductWorld({ version }: { version: Version }) {
  if (version === "materia") return <MatterPage />;
  if (version === "ritual") return <RitualPage />;
  return <EssentialPage />;
}
