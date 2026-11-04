const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {AxeBuilder}=require('@axe-core/playwright');

(async()=>{
 const port=Number(process.env.POLICY_REVIEW_PORT||18766),base=`http://127.0.0.1:${port}/`;
 const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const context=await browser.newContext({viewport:{width:375,height:900}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const targets=['privacy.html','games/road-trip-arcade-privacy.html','delete-account.html','legal/archive/privacy-2026-10-05.html'];
 let viewportChecks=0,accessibilityChecks=0;
 for(const target of targets){
  const response=await page.goto(base+target,{waitUntil:'domcontentloaded'});
  assert.equal(response.status(),200,target);
  assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex,nofollow',target);
  assert.equal(await page.locator('h1').count(),1,target);
  for(const width of [320,375,768,1024,1440]){
   await page.setViewportSize({width,height:920});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${target} overflow at ${width}px`);
   viewportChecks++;
  }
  await page.setViewportSize({width:375,height:900});
  const violations=(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations;
  assert.deepEqual(violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],`${target} axe`);
  accessibilityChecks++;
 }
 await page.setViewportSize({width:1024,height:900});
 await page.goto(base+'privacy.html',{waitUntil:'domcontentloaded'});
 await page.locator('#site-nav').locator('details.dropdown').filter({hasText:'Information'}).locator('summary').click();
 await page.locator('#site-nav').getByRole('link',{name:'Road Trip Arcade Privacy',exact:true}).click();
 assert.ok(page.url().endsWith('/games/road-trip-arcade-privacy.html'));
 await page.goto(base+'delete-account.html',{waitUntil:'domcontentloaded'});
 assert.equal(await page.getByRole('link',{name:'lovelysirenstudios@gmail.com'}).getAttribute('href'),'mailto:lovelysirenstudios@gmail.com');
 assert.ok((await page.locator('main').innerText()).includes('both'));
 await page.goto(base+'legal/archive/privacy-2026-10-05.html',{waitUntil:'domcontentloaded'});
 assert.ok((await page.locator('main').innerText()).includes('October 5, 2026'));
 assert.deepEqual(errors,[]);
 console.log(`PASS ${viewportChecks} viewport checks and ${accessibilityChecks} page accessibility scans; policy navigation, deletion request details, archive date and no JavaScript errors.`);
 await context.close();await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
