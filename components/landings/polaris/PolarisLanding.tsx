"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import GuideFrame from "@/components/ui/GuideFrame";
import Button from "@/components/ui/Button";
import "./polaris.css";

type Expedition = { id: string; title: string; kind: string; year: string; location: string; image: string; alt: string; note: string; index: string };
const expeditions: Expedition[] = [
  { id: "marea-cero", title: "Marea cero", kind: "Terreno", year: "2026", location: "Plataforma Nansen · 74° S", image: "/images/polaris/ice-shelf.webp", alt: "Investigadora ante una grieta de hielo azul en una plataforma polar", note: "Una grieta de dos kilómetros cambia de forma cada hora. El equipo registra su pulso térmico y la deriva de la plataforma.", index: "01" },
  { id: "debajo-del-azul", title: "Debajo del azul", kind: "Instrumentación", year: "2025", location: "Fosa de Linde · 68° S", image: "/images/polaris/sensor-beneath-ice.webp", alt: "Dos especialistas bajan un sensor luminoso dentro de una profunda grieta glaciar", note: "Una red de sensores mide las corrientes que recorren el hielo por dentro, lejos de la luz y de la señal satelital.", index: "02" },
  { id: "noche-clara", title: "Noche clara", kind: "Terreno", year: "2025", location: "Campamento Aurora · 71° S", image: "/images/polaris/aurora-camp.webp", alt: "Tres personas avanzan sobre una cresta bajo una aurora boreal y junto a una estación polar", note: "Durante seis noches, tres estaciones sincronizan el movimiento de la nieve con la actividad de la aurora.", index: "03" },
];
const filters = ["Todo", "Terreno", "Instrumentación"];

function IceShader({ src, reduced }: { src: string; reduced: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const gl = el.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl) return;
    const vertex = `attribute vec2 p; varying vec2 vUv; void main(){ vUv=p*.5+.5; gl_Position=vec4(p,0.,1.); }`;
    const fragment = `precision highp float;
      varying vec2 vUv; uniform sampler2D uImage; uniform vec2 uResolution; uniform vec2 uImageSize;
      uniform vec2 uPointer; uniform float uTime; uniform float uScroll;
      float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      void main(){
        vec2 uv=vUv; float canvasAspect=uResolution.x/uResolution.y; float imageAspect=uImageSize.x/uImageSize.y;
        if(canvasAspect>imageAspect){ uv.y=(uv.y-.5)*imageAspect/canvasAspect+.5; }
        else { uv.x=(uv.x-.5)*canvasAspect/imageAspect+.5; }
        float t=uTime*.18; vec2 p=vUv;
        float field=sin(p.x*10.+t)*cos(p.y*8.-t*.7)+sin((p.x+p.y)*14.-t*.5);
        float lens=exp(-distance(p,uPointer)*8.0);
        vec2 warp=vec2(cos(p.y*9.+t),sin(p.x*8.-t))*0.0045 + (p-uPointer)*lens*.018;
        warp += vec2(field*.002, -field*.003) * (0.5+uScroll*.7);
        vec2 coord=clamp(uv+warp,vec2(.001),vec2(.999));
        float split=.0015+uScroll*.001;
        vec3 col=vec3(texture2D(uImage,coord+vec2(split,0.)).r,texture2D(uImage,coord).g,texture2D(uImage,coord-vec2(split,0.)).b);
        float grain=(hash(floor(p*uResolution*.5)+floor(uTime*24.))-.5)*.025;
        float frost=smoothstep(.74,.97,field*.12 + sin((p.x-p.y)*9.+t)*.12 + uScroll*.12);
        col += grain + frost*vec3(.045,.095,.12);
        col *= 1.02 - .14*distance(p,vec2(.5));
        gl_FragColor=vec4(col,1.);
      }`;
    const compile = (type: number, source: string) => { const shader = gl.createShader(type); if (!shader) return null; gl.shaderSource(shader, source); gl.compileShader(shader); return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null; };
    const vs = compile(gl.VERTEX_SHADER, vertex), fs = compile(gl.FRAGMENT_SHADER, fragment);
    if (!vs || !fs) return;
    const program = gl.createProgram(); if (!program) return; gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, "p"); gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const texture = gl.createTexture(); if (!texture) return; gl.bindTexture(gl.TEXTURE_2D, texture); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    const locations = { resolution: gl.getUniformLocation(program,"uResolution"), imageSize: gl.getUniformLocation(program,"uImageSize"), pointer: gl.getUniformLocation(program,"uPointer"), time: gl.getUniformLocation(program,"uTime"), scroll: gl.getUniformLocation(program,"uScroll") };
    let pointer: [number,number]=[.52,.5], scroll=0, raf=0, start=performance.now(), lastFrame=0, imageWidth=1800, imageHeight=1200;
    const image = new Image(); image.src=src; image.onload=()=>{ imageWidth=image.naturalWidth; imageHeight=image.naturalHeight; gl.bindTexture(gl.TEXTURE_2D,texture); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image); el.dataset.ready="true"; draw(); };
    const size = () => { const rect=el.getBoundingClientRect(), dpr=Math.min(window.devicePixelRatio||1,1.5); el.width=Math.max(1,Math.floor(rect.width*dpr)); el.height=Math.max(1,Math.floor(rect.height*dpr)); gl.viewport(0,0,el.width,el.height); draw(); };
    const draw = () => { gl.useProgram(program); gl.uniform2f(locations.resolution,el.width,el.height); gl.uniform2f(locations.imageSize,imageWidth,imageHeight); gl.uniform2f(locations.pointer,pointer[0],pointer[1]); gl.uniform1f(locations.time,(performance.now()-start)/1000); gl.uniform1f(locations.scroll,scroll); gl.drawArrays(gl.TRIANGLES,0,3); };
    const tick=()=>{const now=performance.now();if(now-lastFrame>33){draw();lastFrame=now;}if(!reduced)raf=requestAnimationFrame(tick);};
    const move=(event:PointerEvent)=>{const r=el.getBoundingClientRect();pointer=[(event.clientX-r.left)/r.width,1-(event.clientY-r.top)/r.height];if(reduced)draw();};
    const onScroll=()=>{scroll=Math.min(1,window.scrollY/1000);if(reduced)draw();};
    const observer=new ResizeObserver(size);observer.observe(el);size();el.addEventListener("pointermove",move);window.addEventListener("scroll",onScroll,{passive:true});if(!reduced)raf=requestAnimationFrame(tick);
    return()=>{cancelAnimationFrame(raf);observer.disconnect();el.removeEventListener("pointermove",move);window.removeEventListener("scroll",onScroll);gl.deleteTexture(texture);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);gl.deleteBuffer(buffer);};
  }, [src,reduced]);
  return <canvas className="polaris-shader" ref={canvas} aria-hidden="true" />;
}

export default function PolarisLanding() {
  const [filter,setFilter]=useState("Todo");
  const [selected,setSelected]=useState<Expedition|null>(null);
  const [sent,setSent]=useState(false);
  const [reduced,setReduced]=useState(false);
  const trigger=useRef<HTMLButtonElement|null>(null);
  const closeButton=useRef<HTMLButtonElement|null>(null);
  const restoreFocus=useRef(false);
  const visible=expeditions.filter((item)=>filter==="Todo"||item.kind===filter);
  const closeExpedition=()=>{restoreFocus.current=true;setSelected(null);};
  useEffect(()=>{const m=window.matchMedia("(prefers-reduced-motion: reduce)");const update=()=>setReduced(m.matches);update();m.addEventListener("change",update);return()=>m.removeEventListener("change",update);},[]);
  useEffect(()=>{if(!selected&&restoreFocus.current){restoreFocus.current=false;trigger.current?.focus();}},[selected]);
  useEffect(()=>{if(!selected)return;const prior=document.body.style.overflow;document.body.style.overflow="hidden";closeButton.current?.focus();const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape"){closeExpedition();}else if(e.key==="Tab"){e.preventDefault();closeButton.current?.focus();}};window.addEventListener("keydown",onKey);return()=>{document.body.style.overflow=prior;window.removeEventListener("keydown",onKey);};},[selected]);
  const frameStyle={"--polaris-orange":"#e75f3d","--polaris-paper":"#e9edf0","--bg":"#101821","--fg":"#f1f4f6","--mut":"#b8c1c9","--acc":"#e75f3d","--acc2":"#83cbd9","--card":"#18232c","--ln":"rgba(218,232,239,.2)"} as CSSProperties;
  return <GuideFrame guide="nocturno" textContrast className="polaris-frame" style={frameStyle}>
    <main className="polaris-site">
      <header className="polaris-header"><a className="polaris-mark" href="#inicio" aria-label="POLARIS, inicio"><span>POLARIS</span><i>◉</i></a><span className="polaris-coordinate">ARCHIVO DE CAMPO / ANTÁRTIDA</span><nav aria-label="Navegación principal"><a href="#expediciones">Expediciones</a><a href="#metodo">El método</a><a href="#contacto">Contacto <span>↗</span></a></nav></header>
      <section className="polaris-hero" id="inicio" aria-labelledby="polaris-title">
        <img className="polaris-hero-fallback" src="/images/polaris/ice-shelf.webp" alt="Una investigadora recorre una grieta glaciar iluminada de azul" />
        <IceShader src="/images/polaris/ice-shelf.webp" reduced={reduced}/>
        <div className="polaris-hero-shade" aria-hidden="true" />
        <div className="polaris-hero-meta"><span>ESTACIÓN MÓVIL 04</span><span>74° 18′ S / 112° 09′ O</span></div>
        <div className="polaris-hero-copy"><p className="polaris-kicker"><i/> CIENCIA DE CAMPO · RELATO INTERACTIVO</p><h1 id="polaris-title">El hielo<br/><em>también</em> recuerda.</h1><p>Un archivo vivo de las señales que la Antártida guarda bajo su superficie. Datos, imágenes y expediciones para acercarse a un territorio que cambia.</p><Button label="Abrir el archivo" href="#expediciones" variant="outline" emphasis="outline" glyph="↓" className="polaris-kit-button" /></div>
        <div className="polaris-hero-foot"><span>CAMPO ACTIVO · 06:42 UTC</span><span>DESPLÁZATE PARA DESCENDER</span><span>01 / 03</span></div>
        <div className="polaris-hero-signal" aria-hidden="true"><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/></div>
      </section>
      <section className="polaris-intro" id="metodo"><div className="polaris-section-index"><span>01</span><span>OBSERVAR / REGISTRAR / COMPARTIR</span></div><div className="polaris-intro-grid"><h2>Hay otro<br/>paisaje <em>debajo.</em></h2><div className="polaris-intro-copy"><p className="polaris-lede">No llegamos para conquistar el silencio. Llegamos a escuchar qué se mueve dentro de él.</p><p>POLARIS reúne a glaciólogas, oceanógrafos y artistas de datos en expediciones cortas y abiertas. Cada recorrido deja un registro comprensible: una imagen, una lectura y una pregunta nueva.</p><div className="polaris-stat-row"><div><b>−31°</b><span>TEMPERATURA<br/>EN SUPERFICIE</span></div><div><b>18<span>m</span></b><span>PROFUNDIDAD<br/>DEL SENSOR</span></div><div><b>06</b><span>NOCHES<br/>DE REGISTRO</span></div></div></div></div></section>
      <section className="polaris-feature"><div className="polaris-feature-image"><img src="/images/polaris/sensor-beneath-ice.webp" alt="Dos integrantes del equipo instalan un sensor luminoso dentro de una grieta" loading="lazy"/><span className="polaris-image-note">LECTURA 02 / SONDA DE ECO</span><span className="polaris-image-cross" aria-hidden="true">+</span></div><div className="polaris-feature-copy"><p className="polaris-kicker">UNA PREGUNTA, MUCHAS CAPAS</p><h2>¿A qué suena<br/>un glaciar?</h2><p>Una sonda desciende por la grieta y traduce el movimiento del agua en pulsos de luz. El patrón cambia cuando la corriente encuentra una cámara oculta.</p><a href="#expediciones" className="polaris-text-link">Ver la lectura completa <span>↗</span></a><div className="polaris-wave" aria-label="Representación visual de una lectura acústica"><svg viewBox="0 0 560 68" role="img"><path d="M0 36h44l10-9 10 22 12-36 15 48 13-29h25l11-13 12 28 12-17h24l9-8 12 19 10-32 12 50 12-32h31l12-12 11 27 11-15h34l11-9 10 18 13-30 12 45 12-22h34l11-10 13 18 10-15h42"/></svg><span>32.4 Hz · 14 FEB 2026</span></div></div></section>
      <section className="polaris-archive" id="expediciones"><div className="polaris-section-index"><span>02</span><span>REGISTRO ABIERTO · 2024—2026</span></div><div className="polaris-archive-heading"><div><p className="polaris-kicker">CUADERNOS DE CAMPO</p><h2>Expediciones<br/><em>en curso.</em></h2></div><p>Historias y mediciones recogidas por equipos que trabajan en el límite entre lo conocido y lo que todavía no tiene nombre.</p></div><div className="polaris-filters" role="group" aria-label="Filtrar expediciones">{filters.map((item)=><button key={item} onClick={()=>setFilter(item)} aria-pressed={filter===item}>{item}<sup>{item==="Todo"?"03":String(expeditions.filter(e=>e.kind===item).length).padStart(2,"0")}</sup></button>)}<span>{visible.length} cuadernos</span></div><div className="polaris-card-grid">{visible.map((item,index)=><button key={item.id} className={`polaris-card polaris-card-${index}`} onClick={(e)=>{trigger.current=e.currentTarget;setSelected(item);}} aria-label={`Abrir expedición: ${item.title}`}><span className="polaris-card-image"><img src={item.image} alt="" loading="lazy"/><i>{item.index} ↗</i></span><span className="polaris-card-data"><span>{item.kind.toUpperCase()} · {item.year}</span><b>{item.title}</b><small>{item.location}</small></span></button>)}</div></section>
      <section className="polaris-statement"><div className="polaris-orbit" aria-hidden="true"><span/><span/><span/><i>−74°</i></div><p className="polaris-kicker">UNA CIENCIA QUE SE PUEDE RECORRER</p><h2>No guardamos<br/>el descubrimiento.<br/><em>Lo abrimos.</em></h2><p>Los datos sin contexto se quedan lejos. Por eso cada medición viene acompañada de voces, imágenes y decisiones que cualquiera puede seguir.</p><Button label="Participar en la próxima salida" href="#contacto" variant="outline" emphasis="outline" glyph="↗" className="polaris-kit-button polaris-kit-button-light" /></section>
      <section className="polaris-contact" id="contacto"><div><p className="polaris-kicker">03 — EL PRÓXIMO REGISTRO EMPIEZA AQUÍ</p><h2>Trae una<br/><em>pregunta.</em></h2><p>Recibe el cuaderno de la próxima expedición o escríbenos para proponer una colaboración.</p></div><form onSubmit={(e)=>{e.preventDefault();setSent(true);}}><label>Tu correo<input type="email" required placeholder="nombre@ejemplo.com"/></label><label>¿Qué te interesa seguir?<select defaultValue="Cuaderno de campo"><option>Cuaderno de campo</option><option>Colaboración científica</option><option>Archivo visual</option></select></label><button type="submit">{sent?"Solicitud anotada ✓":"Pedir acceso al cuaderno ↗"}</button><small>{sent?"Confirmación de muestra. No se han enviado ni guardado tus datos.":"Formulario de demostración: no envía datos ni activa una suscripción."}</small></form></section>
      <footer className="polaris-footer"><a className="polaris-mark" href="#inicio">POLARIS<i>◉</i></a><span>ARCHIVO FICTICIO · CONTENIDO Y ARTE GENERADOS PARA ESTA DEMO</span><a href="#inicio">VOLVER A SUPERFICIE ↑</a><span>© 2026 · SIN DATOS REALES DE CAMPO</span></footer>
      {selected&&<div className="polaris-modal-backdrop" role="presentation" onMouseDown={(e)=>{if(e.target===e.currentTarget)closeExpedition();}}><section className="polaris-modal" role="dialog" aria-modal="true" aria-labelledby="expedition-title"><button ref={closeButton} className="polaris-modal-close" onClick={closeExpedition} aria-label="Cerrar ficha">×</button><img src={selected.image} alt={selected.alt}/><div><p className="polaris-kicker">{selected.kind.toUpperCase()} · {selected.year} · {selected.location}</p><h2 id="expedition-title">{selected.title}</h2><p>{selected.note}</p><small>RELATO Y EXPEDICIÓN FICTICIOS · NO SON DATOS CIENTÍFICOS REALES</small></div></section></div>}
    </main>
  </GuideFrame>;
}
