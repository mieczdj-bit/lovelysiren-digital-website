# Pass 015 — Focused verification record

**Scope:** local review preview only. No public policy, production account setting, Firebase service, email provider, or RTA source was changed.

## Results

- All six ZIP source documents match the tracked copies byte-for-byte by SHA-256.
- `node --test tests/policy-integration-015.test.cjs`: 3 passed. This covers Producer-copy fidelity, preservation of the October 5 combined policy, preview noindex/local links/internal-document exclusion, document identities, and account-gate state.
- `node tests/browser-policy-015.cjs`: passed 20 overflow checks across 320, 375, 768, 1024, and 1440 px for the Website Privacy, RTA Privacy, deletion, and archived-policy pages; 4 axe-core WCAG 2/2.1 A/AA page scans; policy navigation; deletion-request link/details; archive date; and zero JavaScript page errors.
- `node scripts/prepare-account-candidate-014.cjs`: candidate built locally; `activation:false`, Hosting target absent. Existing candidate remains separate and unmodified in source.
- `node scripts/prepare-policy-publication-015.cjs`: local checklist generated with null effective dates/hashes and publication approval false. Gate values are recorded as closed-gate checks; each checked control is disabled in source.
- `node --check` passed for the Pass 015 scripts and tests. Git's whitespace checker flags intentional trailing spaces in Producer-authored Markdown (hard line breaks); those source documents were kept byte-for-byte identical to the ZIP.
- `git diff` against Pass 014 confirms the existing `privacy.html`, `delete-account.html`, `terms.html`, `legal/policy-versions.json`, `CNAME`, and `account/config.js` are unchanged.

## Local review

After starting `scripts/serve-policy-review-015.cjs` with Node 22, open `http://127.0.0.1:18766/`. The review site is generated only under ignored `work/` output and is noindex. It is not a publication artifact.

## Remaining approval and release work

- Executive Producer approval is required for final wording, actual effective dates, publication hashes, policy registry values, public page publication, and every SOP adoption/owner assignment.
- RTA Producer must reconcile the source-level deletion implementation and confirm the actual release build, migration/runtime configuration, test results, retention exceptions, and public request path. RTA remains a release blocker until independently verified.
- No RTA build/tests or live services were run. See `rta-release-verification.md` for specific source evidence and confirmations required.
