import assert from "node:assert/strict";
import { chromium } from "playwright";
import { chromiumPath } from "./chromium-path.mts";
const base=new URL(process.argv[2]??"http://localhost:3000");
assert(["localhost","127.0.0.1","[::1]"].includes(base.hostname));
const browser=await chromium.launch({executablePath:chromiumPath()});
try {
 const page=await browser.newPage({viewport:{width:1440,height:960},reducedMotion:"reduce"});const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto(new URL("/componentes#pricing-section",base).href,{waitUntil:"networkidle"});
 for(const variant of ["solid","minimal","editorial"]){await page.locator("#f-variant").selectOption(variant);for(const layout of ["grid","joined","list","carousel","menu","comparison"]){
  await page.locator("#f-layout").selectOption(layout);const section=page.locator(".ui-pricing");await section.waitFor();assert.equal(await section.count(),1);
  if(layout==="menu")assert.equal(await section.locator(".ui-pricing-menu__row").count(),3);
  else if(layout==="comparison"){assert.equal(await section.getByRole("table").count(),1);assert.equal(await section.getByRole("columnheader").count(),4);}
  else assert.equal(await section.locator(".ui-price").count(),3);
 }}
 const section=page.locator(".ui-pricing");await section.getByRole("button",{name:/Anual/}).click();assert.match(await section.innerText(),/290 €/);assert.match(await section.innerText(),/año/);assert.doesNotMatch(await section.innerText(),/equivale a/i);
 await page.setViewportSize({width:390,height:844});const scroll=section.locator(".ui-pricing-compare");assert.equal(await scroll.getAttribute("tabindex"),"0");assert(await scroll.evaluate(el=>el.scrollWidth>el.clientWidth));
 assert.deepEqual(errors,[]);console.log("✓ Catálogo: seis layouts × tres variantes, tabla semántica, pago anual y comparación desplazable en móvil");
} finally {await browser.close();}
