const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n/g, '\n');
const sha = (value) => crypto.createHash('sha256').update(value, 'utf8').digest('hex');

test('company information exposes only approved business details and purpose-specific email links', () => {
  const company = read('company.html');
  for (const address of [
    'contact@lovelysirendigital.com',
    'support@lovelysirendigital.com',
    'suggestions@lovelysirendigital.com',
    'developers@lovelysirendigital.com',
    'privacy@lovelysirendigital.com',
  ]) assert.match(company, new RegExp(`href="mailto:${address.replaceAll('.', '\\.')}"[^>]*>${address.replaceAll('.', '\\.')}<`));
  for (const detail of ['Independent game and application development and publishing studio', 'Virginia sole proprietorship operating under a registered trade name', 'Virginia, United States']) assert.ok(company.includes(detail));
  assert.doesNotMatch(company, /lovelysirenstudios@gmail\.com|Whitmell|Dry Fork|24549|\b\d{3}[- .]\d{3}[- .]\d{4}\b/i);
  for (const href of ['support.html', 'privacy.html', 'terms.html', 'delete-account.html']) assert.ok(company.includes(`href="${href}"`));
});

test('active revised legal artifacts have matching publication metadata and SHA-256 records', () => {
  const registry = JSON.parse(read('legal/policy-versions.json'));
  const record = JSON.parse(read('legal/release-candidates/lsd-web-020.json'));
  const current = [registry.websiteTerms, registry.websitePrivacy, registry.accountDataDeletion];
  const pages = {
    'website-terms-v1.1': 'terms.html',
    'website-privacy-v1.2': 'privacy.html',
    'account-data-deletion-v1.1': 'delete-account.html',
  };
  for (const item of current) {
    assert.equal(item.status, 'approved-pending-publication');
    assert.equal(item.publicationApproved, true);
    const source = read(item.source);
    const page = read(pages[item.documentId]);
    assert.equal(item.contentSha256, sha(source));
    assert.equal(item.publishedHtmlSha256, sha(page));
    assert.ok(record.documents.some((entry) => entry.documentId === item.documentId && entry.contentSha256 === item.contentSha256 && entry.publishedHtmlSha256 === item.publishedHtmlSha256));
  }
  assert.equal(registry.websiteTerms.priorVersion.documentId, 'website-terms-v1.0');
  assert.equal(registry.websitePrivacy.priorVersion.documentId, 'website-privacy-v1.1');
  assert.equal(registry.accountDataDeletion.priorVersion.documentId, 'account-data-deletion-v1.0');
  assert.equal(record.unchangedLegalDocument.documentId, 'rta-privacy-v1.1');
});

test('Website Terms v1.0 immutable artifacts remain identical to production main', () => {
  for (const file of ['legal/website-terms/v1.0/source.md', 'legal/website-terms/v1.0/index.html']) {
    const baseline = execFileSync('git', ['show', `origin/main:${file}`], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');
    assert.equal(read(file), baseline, `${file} is unchanged`);
  }
  assert.match(read('terms.html'), /website-terms-v1\.1/);
  assert.match(read('terms.html'), /End of Website Terms of Service — Version 1\.1/);
  assert.doesNotMatch(read('terms.html'), /lovelysirenstudios@gmail\.com|Whitmell School Rd|Dry Fork, VA 24549/);
});

test('current site contact links are correct and company navigation is consistent', () => {
  for (const file of ['support.html', 'privacy.html', 'delete-account.html', 'terms.html', 'index.html', 'about.html', 'studio.html', 'games/road-trip-arcade.html', 'account/index.html', 'account/sign-in.html']) {
    const html = read(file);
    assert.match(html, /href="(?:\.\.\/)?company\.html">Company Information<\/a>/, `${file} Information menu links to Company Information`);
  }
  assert.match(read('support.html'), /mailto:support@lovelysirendigital\.com/);
  assert.match(read('privacy.html'), /mailto:privacy@lovelysirendigital\.com/);
  assert.match(read('privacy.html'), /mailto:support@lovelysirendigital\.com/);
  assert.match(read('delete-account.html'), /mailto:privacy@lovelysirendigital\.com/);
  assert.match(read('terms.html'), /mailto:contact@lovelysirendigital\.com/);
  assert.match(read('terms.html'), /mailto:support@lovelysirendigital\.com/);
  assert.match(read('terms.html'), /mailto:privacy@lovelysirendigital\.com/);
  assert.match(read('index.html'), /Sign-in and registration are unavailable/);
});

test('RTA policy remains unchanged pending COPPA contact requirement resolution', () => {
  const record = JSON.parse(read('legal/release-candidates/lsd-web-020.json'));
  assert.match(read('games/road-trip-arcade-privacy.html'), /lovelysirenstudios@gmail\.com/);
  assert.match(record.notes.join(' '), /COPPA applicability and required nonresidential mailing\/phone contacts need factual resolution/);
  assert.match(read('games/road-trip-arcade-privacy.html'), /Complete automatic removal of all online RTA records is not currently available\./);
});
