import assert from "node:assert/strict";
import { mkdirSync,writeFileSync } from "node:fs";
import { chromium } from "playwright";
import { chromiumPath } from "./chromium-path.mts";
const base=new URL(process.argv[2]??"http://localhost:3000");
assert(["localhost","127.0.0.1","[::1]"].includes(base.hostname));
const out=".refs3d/negocios-reestudio/revision";mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:chromiumPath()});const errors:string[]=[];const checks:string[]=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:960},reducedMotion:"reduce"});const page=await context.newPage();page.on("pageerror",e=>errors.push(e.message));page.on("console",m=>{if(m.type()==="error")errors.push(m.text());});
 for(const width of [1440,390]){await page.setViewportSize({width,height:960});for(const slug of ["hebra","esparta","cadencia","forja"]){const paths=["",...(slug==="hebra"||slug==="esparta"?["servicios","equipo","reservar","mis-citas"]:["clases","planes","club","mi-ritmo"])];for(const path of paths){
 const response=await page.goto(new URL(`/sitios/${slug}${path?"/"+path:""}`,base).href,{waitUntil:"networkidle"});assert.equal(response?.status(),200);
 await page.locator('img').evaluateAll(imgs=>imgs.forEach(i=>{if(i instanceof HTMLImageElement)i.loading="eager";}));await page.waitForFunction(()=>Array.from(document.images).every(i=>i.complete));
 assert.equal(await page.locator('main h1').count(),1,`${slug}/${path}: h1`);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${slug}/${path} ${width}px overflow`);
 assert.equal(await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>i instanceof HTMLImageElement&&i.naturalWidth===0).length),0,`${slug}/${path}: images`);
 if(!path || path==="planes" || path==="servicios" || path==="reservar"){for(const section of await page.locator('main section').all())await section.scrollIntoViewIfNeeded();await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(100);await page.screenshot({path:`${out}/${slug}-${path||"inicio"}-${width}.png`,fullPage:true});}
 }}}
 checks.push("20 rutas en 1440/390 px: HTTP 200, imágenes cargadas, un h1 y sin desbordamiento");
 await page.goto(new URL('/sitios/hebra',base).href,{waitUntil:"networkidle"});await page.getByRole('button',{name:'Textura',exact:true}).click();assert.match(await page.locator('.hb-look-detail').innerText(),/rizos/);await page.getByRole('button',{name:'Color',exact:true}).click();assert.match(await page.locator('.hb-look-detail').innerText(),/luz/);
 await page.goto(new URL('/sitios/cadencia',base).href,{waitUntil:"networkidle"});await page.getByRole('button',{name:'3 días / semana',exact:true}).click();assert.match(await page.locator('.cd-week-card').innerText(),/Libre/);assert.equal(await page.locator('.cd-week-cells [data-active]').count(),3);
 checks.push("Hebra: índice conectado a servicios. Cadencia: frecuencia, agenda y plan de partida coherentes");
 await page.goto(new URL('/sitios/cadencia/planes',base).href,{waitUntil:"networkidle"});assert.equal(await page.getByRole('table',{name:'Comparación de planes'}).count(),1);assert.equal(await page.getByRole('columnheader').count(),4);assert.match(await page.getByRole('table').innerText(),/Clases al mes/);
 await page.goto(new URL('/sitios/forja/planes',base).href,{waitUntil:"networkidle"});assert.equal(await page.locator('.ui-pricing__grid--list .ui-price').count(),3);
 checks.push("Precios: comparación semántica en Cadencia y lista de cuotas en Forja");
 await context.close();
 const glContext=await browser.newContext({viewport:{width:1440,height:960},reducedMotion:"no-preference"});const gp=await glContext.newPage();gp.on('pageerror',e=>errors.push(e.message));gp.on('console',m=>{if(m.type()==='error')errors.push(m.text());});await gp.goto(new URL('/sitios/forja',base).href,{waitUntil:'networkidle'});await gp.locator('#el-hierro').scrollIntoViewIfNeeded();await gp.waitForSelector('.fj-barbell-stage[data-ready="3d"]',{timeout:30000});
 for(const [i,name]of ['Aprender','Trabajar','Recuperar'].entries()){await gp.getByRole('button',{name:new RegExp(name)}).click();assert.equal(await gp.locator('.fj-barbell-stage').getAttribute('data-phase'),String(i));await gp.waitForTimeout(600);await gp.locator('#el-hierro').screenshot({path:`${out}/forja-proceso-${i+1}-3d.png`});assert(await gp.locator('.fj-story-copy a').getAttribute('href'));}
 checks.push("Forja: WebGL real al servicio de tres capítulos, con explicación, resultado y enlace a la clase");await glContext.close();
 const fallback=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const fp=await fallback.newPage();fp.on('pageerror',e=>errors.push(e.message));await fp.goto(new URL('/sitios/forja',base).href,{waitUntil:'networkidle'});await fp.getByRole('button',{name:/Trabajar/}).click();assert.equal(await fp.locator('.fj-barbell-stage canvas').count(),0);assert.equal(await fp.locator('.fj-barbell-stage').getAttribute('data-phase'),'1');await fallback.close();checks.push("Sin movimiento: el relato y los controles siguen funcionando sin canvas");
 const noGL=await browser.newContext({viewport:{width:1440,height:960},reducedMotion:'no-preference'});await noGL.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,type:string,...args:unknown[]){if(type.startsWith('webgl'))return null;return Reflect.apply(original,this,[type,...args]);} as typeof original;});const np=await noGL.newPage();np.on('pageerror',e=>errors.push(e.message));await np.goto(new URL('/sitios/forja',base).href,{waitUntil:'networkidle'});await np.locator('#el-hierro').scrollIntoViewIfNeeded();await np.getByRole('button',{name:/Trabajar/}).click();assert.equal(await np.locator('.fj-barbell-stage canvas').count(),0);assert.equal(await np.locator('.fj-barbell-stage').getAttribute('data-phase'),'1');await noGL.close();checks.push('Sin WebGL: la sesión conserva sus capítulos y enlaces');
 assert.deepEqual(errors,[]);writeFileSync(`${out}/resultado.json`,JSON.stringify({base:base.href,checks,errors},null,2));console.log(checks.map(c=>`✓ ${c}`).join('\n'));
}finally{await browser.close();}
