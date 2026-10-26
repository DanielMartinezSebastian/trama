import { chromium } from "playwright";
import { mkdirSync,writeFileSync } from "node:fs";
import { chromiumPath } from "./chromium-path.mts";
const out=".refs3d/negocios-reestudio/referencias";
mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:chromiumPath()});
const refs=[['skulpt','https://www.skulptfitness.nl'],['tracksmith','https://www.tracksmith.com'],['lando','https://landonorris.com'],['pangram','https://pangrampangram.com'],['balls','https://ballsbarbershop.com.ua'],['bluetit','https://bluetitlondon.com'],['ilcolorista','https://ilcolorista.salon'],['alice','https://www.alicehairart.se']].filter(([name])=>!process.argv[2] || process.argv.slice(2).includes(name));
const results:unknown[]=[];
try { for (let i=0;i<refs.length;i+=2) await Promise.all(refs.slice(i,i+2).map(async([name,url])=>{
 const page=await browser.newPage({viewport:{width:1440,height:960}});
 try { const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000}); await page.waitForTimeout(3500);
 const before=await page.evaluate(()=>({title:document.title,h1:[...document.querySelectorAll('h1')].map(x=>x.textContent?.trim()).slice(0,3),fonts:[...document.fonts].map(x=>x.family),canvas:document.querySelectorAll('canvas').length,headings:[...document.querySelectorAll('h1,h2')].slice(0,12).map(x=>({text:x.textContent?.trim(),font:getComputedStyle(x).fontFamily,size:getComputedStyle(x).fontSize})),height:document.documentElement.scrollHeight}));
 await page.screenshot({path:`${out}/${name}-inicio.png`}); await page.mouse.wheel(0,900); await page.waitForTimeout(1800); await page.screenshot({path:`${out}/${name}-scroll.png`});
 results.push({name,url,status:response?.status(),...before});
 }catch(error){results.push({name,url,error:String(error)});}finally{await page.close();}
 })); }finally{await browser.close();}
writeFileSync(`${out}/sonda${process.argv[2] ? '-'+process.argv.slice(2).join('-') : ''}.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify(results.map((x:any)=>({name:x.name,status:x.status,title:x.title,error:x.error})),null,2));
