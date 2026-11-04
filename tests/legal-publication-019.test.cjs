const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n/g, '\n');
const sha = (value) => crypto.createHash('sha256').update(value.replace(/\r\n/g, '\n'), 'utf8').digest('hex');
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
const htmlText = (html) => decode(html.replace(/<br\s*\/?\s*>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/\s+([.,;:!?])/g, '$1').trim());
const markdownText = (md) => md.replace(/^\s*(?:-|\d+\.)\s+/gm, '').replace(/^#{1,6}\s+/gm, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1').replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1').replace(/\s+/g, ' ').trim();
const article = (html) => html.match(/<article class="legal-reading">([\s\S]*?)<\/article>/)?.[1];

test('published legal pages render the approved Pass 017 text with only final publication metadata', () => {
  const pairs = [
    ['legal/website-privacy/v1.1/source.md', 'privacy.html'],
    ['legal/rta-privacy/v1.1/source.md', 'games/road-trip-arcade-privacy.html'],
    ['legal/account-data-deletion/v1.0/source.md', 'delete-account.html'],
  ];
  for (const [sourcePath, pagePath] of pairs) {
    const source = read(sourcePath);
    const page = read(pagePath);
    assert.ok(article(page), `${pagePath} has a legal article`);
    assert.equal(htmlText(article(page)), markdownText(source), `${pagePath} matches its publication source`);
    assert.doesNotMatch(page, /noindex,nofollow|Local review preview|RTA release-status review note|NOT APPROVED|NOT PUBLISHED|\[(?:SET ON APPROVED PUBLICATION|REPLACE EXISTING PLACEHOLDER)/i);
  }
  assert.match(read('privacy.html'), /Effective date:<\/strong> 2026-11-04/);
  assert.match(read('games/road-trip-arcade-privacy.html'), /Effective date:<\/strong> 2026-11-04/);
  assert.match(read('delete-account.html'), /Published:<\/strong> 2026-11-04/);
});

test('registry and publication record match final source and served HTML hashes', () => {
  const registry = JSON.parse(read('legal/policy-versions.json'));
  const record = JSON.parse(read('legal/publication-records/2026-11-04.json'));
  for (const item of [registry.websitePrivacy, registry.rtaPrivacy, registry.accountDataDeletion]) {
    assert.equal(item.status, 'published');
    assert.equal(item.publicationApproved, true);
    assert.equal(item.publishedDate, '2026-11-04');
    assert.equal(item.contentSha256, sha(read(item.source)));
    const page = item.documentId === 'website-privacy-v1.1' ? 'privacy.html' : item.documentId === 'rta-privacy-v1.1' ? 'games/road-trip-arcade-privacy.html' : 'delete-account.html';
    assert.equal(item.publishedHtmlSha256, sha(read(page)));
  }
  assert.deepEqual(record.documents.map((x) => x.documentId), ['website-privacy-v1.1', 'rta-privacy-v1.1', 'account-data-deletion-v1.0']);
  assert.equal(record.publicationDate, '2026-11-04');
  assert.equal(record.termsPreserved.documentId, 'website-terms-v1.0');
  assert.equal(registry.websiteTerms.effectiveDate, '2026-10-28');
});

test('historical combined policy is preserved and RTA deletion limits remain explicit', () => {
  const registry = JSON.parse(read('legal/policy-versions.json'));
  const archive = read('legal/archive/privacy-2026-10-05.html');
  const unwrapped = archive
    .replace('<base href="../../"><meta name="robots" content="noindex,nofollow"><link rel="canonical" href="https://lovelysirendigital.com/legal/archive/privacy-2026-10-05.html"><style>.archive-policy-banner{max-width:960px;margin:18px auto;padding:14px 20px;border:1px solid #9b7a2e;border-radius:12px;background:#fff7d8;color:#315367}</style>', '')
    .replace('<aside class="archive-policy-banner"><strong>Historical combined Privacy Policy — effective October 5, 2026.</strong> This version is retained as a historical record and was superseded by separate Website &amp; Account Privacy and Road Trip Arcade Privacy policies effective November 4, 2026.</aside>', '');
  assert.equal(sha(unwrapped), registry.archivedCombinedPrivacy.originalContentSha256);
  assert.match(archive, /noindex,nofollow/);
  const rta = read('games/road-trip-arcade-privacy.html');
  assert.match(rta, /Complete automatic removal of all online RTA records is not currently available\./);
  assert.doesNotMatch(rta, /RTA B2.{0,60}(?:live|available|deployed)/i);
});

test('Terms v1.0 wording, account gate, navigation, and legal links are preserved', () => {
  const publishedTerms = execFileSync('git', ['show', 'origin/main:terms.html'], { cwd: root, encoding: 'utf8' });
  assert.equal(article(read('terms.html')), article(publishedTerms));
  assert.equal(read('legal/website-terms/v1.0/index.html'), execFileSync('git', ['show', 'origin/main:legal/website-terms/v1.0/index.html'], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n'));
  const home = read('index.html');
  assert.match(home, /Account Management/);
  assert.match(home, /Sign-in and registration are unavailable/);
  assert.doesNotMatch(home, /href="account\/(?:create|sign-in)\.html/);
  for (const file of ['index.html', 'about.html', 'studio.html', 'games/road-trip-arcade.html', 'terms.html', 'privacy.html', 'games/road-trip-arcade-privacy.html', 'delete-account.html', 'support.html', 'account/index.html', 'account/sign-in.html']) {
    const text = read(file);
    assert.match(text, /Website (?:&amp;|&) Account Privacy|Website Privacy/);
    assert.match(text, /Road Trip Arcade Privacy|RTA Privacy/);
    assert.match(text, /Account(?: &amp;| &) Data Deletion|Account deletion information/);
  }
});
