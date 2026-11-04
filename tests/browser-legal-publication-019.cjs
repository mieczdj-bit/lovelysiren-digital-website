const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');

const root = path.resolve(__dirname, '..');
const pages = [
  '/', '/about.html', '/studio.html', '/games/road-trip-arcade.html', '/terms.html',
  '/privacy.html', '/games/road-trip-arcade-privacy.html', '/delete-account.html',
  '/support.html', '/account/index.html', '/account/sign-in.html',
];
const legalPages = ['/privacy.html', '/games/road-trip-arcade-privacy.html', '/delete-account.html'];
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };

(async () => {
  const server = http.createServer((req, res) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname); }
    catch { res.writeHead(400).end(); return; }
    if (pathname === '/') pathname = '/index.html';
    const target = path.resolve(root, `.${pathname}`);
    if (!target.startsWith(root + path.sep) || ['.git', 'functions', 'node_modules', 'work'].some((part) => target.slice(root.length + 1).startsWith(part + path.sep))) { res.writeHead(403).end(); return; }
    let bytes;
    try { bytes = fs.readFileSync(target); } catch { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    res.end(bytes);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await context.newPage();
  const failures = [];
  const consoleErrors = [];
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  try {
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 960 });
      for (const route of pages) {
        const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
        if (!response || response.status() !== 200) failures.push(`${route} returned HTTP ${response?.status()}`);
        if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) failures.push(`${route} overflows at ${width}px`);
        if (['/', '/about.html', '/studio.html', '/games/road-trip-arcade.html'].includes(route)) {
          for (const image of await page.locator('img').all()) {
            if (!(await image.isVisible())) continue;
            await image.scrollIntoViewIfNeeded();
            const loaded = await image.evaluate((img) => img.complete && img.naturalWidth > 0 || new Promise((resolve) => {
              img.addEventListener('load', () => resolve(true), { once: true });
              img.addEventListener('error', () => resolve(false), { once: true });
              setTimeout(() => resolve(false), 5000);
            }));
            if (!loaded) failures.push(`${route} image failed: ${image.getAttribute('src')}`);
          }
        }
      }
    }

    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 960 });
      for (const route of legalPages) {
        await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
        const violations = (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations;
        if (violations.length) failures.push(`${route} accessibility ${width}px: ${violations.map((v) => v.id).join(', ')}`);
      }
    }

    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    await page.getByText('Information', { exact: true }).click();
    for (const href of ['privacy.html', 'games/road-trip-arcade-privacy.html', 'delete-account.html', 'terms.html']) {
      if (!(await page.locator(`a[href="${href}"]`).count())) failures.push(`Information menu missing ${href}`);
    }
    if (await page.locator('a[href="account/create.html"], a[href="account/sign-in.html"]').count()) failures.push('homepage exposes a sign-in or registration action');
    if (!(await page.getByText('Sign-in and registration are unavailable').count())) failures.push('homepage account gate notice missing');

    await page.goto(`${base}/games/road-trip-arcade-privacy.html`, { waitUntil: 'networkidle' });
    if (!(await page.getByText(/Complete automatic removal of all online RTA records is not currently available/).count())) failures.push('RTA deletion limitation is not visible');
    await page.goto(`${base}/privacy.html`, { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: 'view the archived policy' }).click();
    if (!page.url().endsWith('/legal/archive/privacy-2026-10-05.html')) failures.push('historical archive link failed');
    if (consoleErrors.length) failures.push(`browser errors: ${consoleErrors.join('; ')}`);
    assert.deepEqual(failures, []);
    console.log(`Pass 019 local browser check passed: ${pages.length * 5} page/viewport checks, ${legalPages.length * 2} accessibility checks, links, visible images and disabled account gate.`);
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => { console.error(error); process.exit(1); });
