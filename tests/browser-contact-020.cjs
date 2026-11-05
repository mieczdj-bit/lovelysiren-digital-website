const { chromium } = require('playwright');

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:18766';
const widths = [320, 375, 768, 1024, 1440];
const routes = [
  '/', '/company.html', '/support.html', '/privacy.html', '/terms.html',
  '/delete-account.html', '/games/road-trip-arcade-privacy.html',
  '/about.html', '/studio.html', '/games/road-trip-arcade.html',
  '/account/index.html', '/account/sign-in.html',
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  let checks = 0;
  try {
    const page = await browser.newPage();
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => {
      if (response.status() >= 400 && !response.url().endsWith('/account/nav.js')) errors.push(`${response.status()} ${response.url()}`);
    });
    for (const route of routes) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        const response = await page.goto(`${base}${route}`, { waitUntil: 'load' });
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForFunction(() => [...document.images].filter((img) => img.getAttribute('src')).every((img) => img.complete), null, { timeout: 5000 });
        await page.evaluate(() => window.scrollTo(0, 0));
        if (!response || !response.ok()) throw new Error(`${route} returned ${response?.status()}`);
        const data = await page.evaluate(() => ({
          width: document.documentElement.clientWidth,
          scroll: document.documentElement.scrollWidth,
          main: document.querySelectorAll('main').length,
          h1: document.querySelectorAll('h1').length,
          brokenImages: [...document.images].filter((img) => img.getAttribute('src') && (!img.complete || img.naturalWidth === 0)).map((img) => img.src),
        }));
        if (data.scroll > width) throw new Error(`${route} horizontal overflow at ${width}px: ${data.scroll}px`);
        if (data.main !== 1 || data.h1 < 1) throw new Error(`${route} missing semantic main/heading at ${width}px`);
        if (data.brokenImages.length) throw new Error(`${route} broken images: ${data.brokenImages.join(', ')}`);
        checks++;
      }
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    await page.getByText('Information', { exact: true }).click();
    await page.locator('nav.navigation a[href="company.html"]').click();
    if (!page.url().endsWith('/company.html')) throw new Error('Information menu did not navigate to Company Information');
    checks++;
    const companyMailto = await page.locator('a[href^="mailto:"]').evaluateAll((links) => links.map((a) => a.getAttribute('href')));
    for (const email of ['contact', 'support', 'suggestions', 'developers', 'privacy']) {
      if (!companyMailto.includes(`mailto:${email}@lovelysirendigital.com`)) throw new Error(`Company page missing ${email} mailto link`);
    }
    checks++;
    await page.goto(`${base}/privacy.html`, { waitUntil: 'networkidle' });
    await page.keyboard.press('Tab');
    if (!(await page.evaluate(() => document.activeElement?.classList.contains('skip')))) throw new Error('Skip link is not first keyboard stop');
    checks++;
    if (errors.length) throw new Error(`Browser errors: ${errors.join(' | ')}`);
    console.log(`PASS ${checks} route/viewport, navigation, contact and keyboard checks; only the pre-existing absent account/nav.js request was excluded`);
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error.stack || error); process.exitCode = 1; });
