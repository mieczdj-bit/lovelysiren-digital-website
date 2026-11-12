const { chromium } = require('playwright');

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:18766';
const widths = [320, 375, 768, 1024, 1440];
const routes = [
  '/', '/company.html', '/support.html', '/privacy.html', '/terms.html',
  '/legal/website-terms/index.html', '/legal/website-terms/v1.0/index.html', '/legal/website-terms/v1.1/index.html',
  '/delete-account.html', '/games/road-trip-arcade-privacy.html',
  '/about.html', '/studio.html', '/games/road-trip-arcade.html',
  '/account/index.html', '/account/sign-in.html',
];

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : { channel: 'chrome' }),
  });
  const errors = [];
  let checks = 0;
  try {
    const page = await browser.newPage();
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => {
      if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    for (const route of routes) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        const response = await page.goto(`${base}${route}`, { waitUntil: 'load' });
        await page.evaluate(() => {
          for (const image of document.images) image.loading = 'eager';
          window.scrollTo(0, document.body.scrollHeight);
        });
        try {
          await page.waitForFunction(() => [...document.images].filter((img) => img.getAttribute('src')).every((img) => img.complete), null, { timeout: 10000 });
        } catch {
          const pending = await page.locator('img[src]').evaluateAll((images) => images.filter((img) => !img.complete).map((img) => img.src));
          throw new Error(`${route} image load timeout at ${width}px: ${pending.join(', ')}`);
        }
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
    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    await page.locator('details.account > summary').click();
    await page.locator('details.account a[href="account/index.html"]').click();
    if (!page.url().endsWith('/account/index.html')) throw new Error('Account menu did not navigate to Account Management');
    checks++;
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    await page.locator('#mobile-button').click();
    await page.locator('nav.navigation details.dropdown > summary').filter({ hasText: 'Information' }).click();
    await page.locator('nav.navigation a[href="company.html"]').click();
    if (!page.url().endsWith('/company.html')) throw new Error('Mobile Information menu did not navigate to Company Information');
    checks++;
    await page.goto(`${base}/privacy.html`, { waitUntil: 'networkidle' });
    await page.keyboard.press('Tab');
    if (!(await page.evaluate(() => document.activeElement?.classList.contains('skip')))) throw new Error('Skip link is not first keyboard stop');
    checks++;
    if (errors.length) throw new Error(`Browser errors: ${errors.join(' | ')}`);
    console.log(`PASS ${checks} route/viewport, navigation, contact and keyboard checks; no missing assets or failed responses`);
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error.stack || error); process.exitCode = 1; });
