# Pass010 — Contact information and promotional preferences

November 2, 2026. Base Pass009 `327905023c65cbeadf32d2ffad6d19ea120823bd`. Branch `lsd-account-contact-preferences-010`. Source and isolated local testing only. No production deployment, merge, real customer access, provider purchase or marketing delivery.

## Features implemented

Account Settings retains display name, account email, optional phone and Connected Sign-In Methods. Adds six optional international mailing fields, removal by blanking fields, and three independent off-by-default promotional choices. Styled in existing Seaside Pastels, keyboard accessible and responsive. No in-game promotional toggle. Privacy promise distinguishes no sale/independent third-party marketing from trusted delivery processors.

Contact saves and preference saves are separate authenticated operations. Server-confirmed success only; conflicts require reload/review. Production client flag remains false; backend new features require exact demo/loopback plus synthetic disclosure configuration. No new production marketing collection can be enabled just by setting a database preference flag. The registration form and game data remain unchanged.

## Data, consent and security

[Data/API/deletion contract](audit/account-010/data-and-consent-contract.md) documents profile address/contactRevision, separate marketingPreferences/{uid}, server-derived UID/canonical ownership, per-channel revisions, request-id retries, minimal affirmative/withdrawal evidence and destination hash binding. New contact updates retain recent-auth, policy, mapping and lifecycle guards; cross-record changes remain atomic. Legacy zero-revision updates preserve narrow transactions; versioned contacts reject older writes. Missing records never imply consent.

Phone/address changes atomically withdraw the corresponding channel. A stale request cannot silently restore an earlier grant; mismatched revisions return conflict, and failed withdrawal is not reported successful. Exact persisted request retries return current state rather than applying old permission. Redundant off actions still fence old grants but avoid growing redundant history. A history review limit blocks further grants, never withdrawal. Current verified Auth email is checked against the token before opt-in, and email binding cannot silently move to a changed address. All sending eligibility remains false. SMS is only pending enrollment, without phone verification or legally operative SMS consent.

Development-only deletion now explicitly requires marketingEvidence retention approval, erases private contacts and either erases preferences/history or minimizes retained evidence with every channel off and closure marked. Old plans missing this category fail closed. RTA services, rules, ownership, purchases and mailbox are untouched; its trusted inventory/fence/deletion and real terminal-proof blockers remain.

## Policy review and approvals

[Separate proposed Privacy copy](drafts/website-account-privacy-contact-010-review.md) revises Pass007 language for optional mailing collection, independent programs, consent/withdrawal evidence, delivery processors, no sale/independent marketing, opt-out and retention. It is REVIEW ONLY: no operative effective date, publication, approved registry/hash or policy acceptance for real customers. Original Pass007 draft and published Terms/Privacy remain unchanged.

[Approvals and Significant Discoveries and Cross-Project Risks](audit/account-010/approval-and-risks.md) distinguishes confirmed source gaps from potential risks. Confirmed: unversioned contact overwrite, new consent data outside the old deletion inventory, and non-finite recent-auth arithmetic in directly invoked backend fixtures. Fixes are exercised by stale/concurrent, Auth-time and deletion tests. Potential: cross-service Auth/destination races, downstream suppression, root transaction scaling and provider/legal obligations; these are not claimed solved by an inactive checkbox or hash.

Before any sending: approve final policy/program/wording, provider safeguards, verified destination, jurisdiction/age review, unsubscribe/suppression and queue/exports, operational recovery and retention. SMS additionally needs verified phone ownership, express-consent disclosure review, STOP/help and re-enrollment processing. Postal requires country-specific deliverability checks. No delivery/unsubscribe provider endpoints are implemented in this pass; the contract contains the future design. Basic first-account staging prerequisites from Pass009 still apply separately; no identity/deletion/public-registration activation is authorized.

## Focused verification

Actual isolated portable **Node 22.23.4**, no global installation/PATH change:

- 12 new contact/preference emulator cases: entry/edit/removal, international validation, independent defaults/choices, evidence, retries, concurrency, stale authorization/contact changes, current email/verification, missing/expired/future auth_time, canonical ownership, disabled/closing accounts, inactive live gate and both erase/minimize retention paths.
- 60 affected Pass009/008/006 transaction/lifecycle/registration/policy/worker/identity cases passed. Four emulator parent tests are additional Node reporter entries across the new and affected suites.
- 34 affected client service/validation cases passed; existing registration/login/provider/profile behavior preserved.
- 2 strict public-policy/config-preservation and registration-package isolation checks passed. Baseline configuration is byte-preserved except the explicitly asserted new false flag. Package contains the new nonprivileged contact dependency and excludes private identity/deletion/journal source.
- Five browser widths (320/375/768/1024/1440): no horizontal overflow, axe WCAG A/AA violations or JavaScript errors; keyboard selection, independent controls and confirmed/rejected-save behavior passed. Visual snapshots inspected, including 320px. Browser uses an explicitly synthetic service fixture; server behavior is verified separately with real local emulators, not claimed end-to-end provider delivery.
- Clean locked installs, native ESM/discovery and disabled HTTP behavior passed for full Functions and registration-only candidate on Node22. No live OAuth/IAM/runtime/deployment claim. Dependency manifests/locks unchanged.
- Syntax and staged whitespace checks passed. No unrelated homepage/RTA gameplay/full historic suite. Scoped fixture users/trees cleaned individually; no global emulator clear.

Reproduce with local demo emulators running: `node scripts/test-contact-010.cjs` using isolated Node22. Browser requires the existing local Chrome install. Clean package check: `node scripts/check-node22-009.cjs`. Ignored local artifacts: work/contact-010 (logs/screenshots), unique staging/node22 review artifacts. No test artifacts are deployment candidates.

## Changed files

- Backend: functions/src/contact-preferences.js (new), accounts.js, index.js, deletion.js.
- Frontend: account/settings.html, ui.js, service.js, validation.js, config.js, account.css.
- Packaging: scripts/prepare-staging-007.cjs adds required contact dependency; scripts/test-contact-010.cjs (new).
- Tests: tests/contact-preferences-010.emulator.mjs and browser-contact-010.cjs (new); lifecycle-008.emulator.mjs and preflight-009-fixtures.mjs add explicit marketingEvidence fixture decisions; privacy-readiness-007.test.js recognizes only the new inactive config flag.
- Review documents: this report, audit/account-010/data-and-consent-contract.md, audit/account-010/approval-and-risks.md and drafts/website-account-privacy-contact-010-review.md.

Recommended next step: review the contact/program Privacy changes and retention/suppression decisions with the Executive Producer/legal reviewer; resolve Pass009 first-account isolation/infrastructure gates before separately approving controlled staging. Keep marketing collection and all delivery inactive until explicit approval and missing verification/provider controls exist.
