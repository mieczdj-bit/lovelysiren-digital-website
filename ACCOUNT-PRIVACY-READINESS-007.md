# Pass 007 — Website Privacy and controlled-test readiness

Preparation completed October 30, 2026 from Pass006 `221170faa824ccc56c9fafee2a4f8cee97c6785d`. Branch: `lsd-account-privacy-readiness-007`. This report is not approval to publish, deploy or activate anything.

## 1. Approval-ready policy

Customer copy: [drafts/website-account-privacy-v1.0.md](drafts/website-account-privacy-v1.0.md). Browser preview: **http://127.0.0.1:18765/drafts/website-privacy-review.html**. The existing localhost preview serves it. Proposed identifier is `website-privacy-v1.0`; effective date remains unassigned. The cover clearly separates approval status from the customer policy. The registry records a review draft hash only, publicationApproved false/status review/date null. No real acceptance has been recorded.

The prior draft remains unchanged at drafts/website-privacy-approval.md. [Section-by-section differences and factual/legal review questions](audit/account-007/privacy-review-and-transition.md) explain every editorial consolidation and the Pass006 identity-service disclosures; [exact textual comparison](audit/account-007/website-privacy-copy.diff) is retained. Internal emulator/pass/utility discussion was removed from customer copy; operational status, collection, security, provider, retention and deletion limitations remain.

## 2. Privacy/RTA transition and unresolved review

The existing public privacy.html, published Terms, CNAME, both RTA draft files and runtime/client flags remain byte-preserved from Pass006 (normalized LF comparison). The game policy's proposed future URL is still absent and is not described as published. Preferred transition waits for independently approved game disclosure, verifies its live URL and coordinates links before replacing the old combined policy. A separately approved old-disclosure archive/link transition is an alternative; no silent loss of game disclosures is permitted.

Producer review still needs business/contact confirmation; optional-phone necessity; applicable rights/complaint obligations; data minimization/retention/holds and provider logs/backups. RTA Producer must verify newer age/ad/purchase/SQL identity/lease/mailbox processing and the unimplemented deletion service against the release build. No RTA-specific ad, purchase or child-privacy claims were adopted as company-account guarantees.

## 3. Policy-version and acceptance readiness

Terms remain published `website-terms-v1.0`, October28, hash `963bac3c70804f34e9aa184149b46c714d720e37ba6181529744d7d465ef44de`. Website Privacy is NOT published. [Exact inactive transition template](staging/account-007-policy-transition.review.json) leaves future published Privacy hash/date/status null and all gates off. After separate approval/publication, archive immutable source, assign actual effective date, verify deployed wording/canonical URLs and normalized source hash, then update registry and trusted/client metadata. Draft hash cannot authorize real consent. Existing legal builder still refuses Privacy publication; a later reviewed publication change is required.

Current backend supports the identifiers, strict metadata checks, server acceptance times/hashes/history and subsequent material-policy renewal. No backend or identity runtime code was modified; no Pass006 identity suite was rerun.

## 4. Firebase and separate function boundaries

[Controlled staging plan and exact Executive Producer gates](audit/account-007/controlled-staging-plan.md) update Pass004 evidence without live reinspection. Required approvals remain: billing account/Blaze and cost monitoring; necessary API enablement followed by real function inventory; least-privilege runtime/platform IAM; fresh-live-rule-derived namespace fragment; shared Auth email/password and exact staging domain/config; registration-only deployment; static preview channel; published policy approval; and exact single invitation/test window/activation.

The registration candidate contains only lovelysirenAccountsApi, explicitly bound to the proposed dedicated runtime identity, minInstances0/maxInstances2/us-central1/256MiB/timeout30/Node22. The generated entry removes private identity imports/export; identity source files are not copied. No Firebase deployment configuration/upload is executed or supplied as an executable action. Runtime identity and endpoint availability still require actual approved creation/inventory; neither is assumed to exist.

lovelysirenIdentityApi is a separate deployment/activation decision. Its environment gate, control gate and caller allowlist remain off/empty; the first registration test cannot authorize it. Google linking and public registration remain off. A preview URL is publicly accessible and is not a security boundary. Shared Auth provider enablement can allow direct credential creation; invitation gates protect company enrollment, not every Firebase Auth operation.

## 5. Staging artifact and runtime checks

`node scripts/prepare-staging-007.cjs` generates only a unique ignored local review folder. Its public/ has exactly 53 files: 51 explicitly allowlisted existing public files plus two copies of the existing Google icon to resolve old nested Terms-history relative image paths. Published page bytes are not rewritten. A SHA-256 manifest verifies each source/output. Private rules/backups, audits, source-control data, environments/secrets, drafts, tests/scripts, backend and node_modules are excluded from public/. The registration backend is a separate sibling folder. Client flags remain off and old public Privacy is preserved; this artifact must not be activated without the later policy/config approvals and a fresh review.

No local Node22 was found in inspected tool/cache/user-manager locations. Available Codex Node24 and Program Files Node26 are not substitutes for Node22 verification. No software was installed or global Node setup changed. Offline original-package discovery and isolated-candidate syntax checks passed under Node24.22.1. Required remaining work: approved Node22 clean locked dependency install, ESM/function discovery, sole account export/options verification, focused backend compatibility and actual staging startup before activation. Functions use native ESM; there is no separate transpilation build command.

## 6. Support, retention and deletion blockers

[Operator procedure](audit/account-007/operator-procedure.md) covers interrupted/unverified registrations, expired invites, recovery, compromise containment, exact test-data inventory, verified access/correction/deletion requests, dry-run/apply separation, lawful retention, partial failure, retry and escalation. Existing helper can remove only four expired temporary groups under explicit apply authority. It cannot remove permanent accounts, Auth, reservations, consent history or RTA data. No live cleanup was run.

**Real account test remains NOT READY.** Approve retention/tombstone handling, provider log/backup verification and a demonstrably narrow, verified company-only support/manual cleanup procedure (or implement trusted deletion) before real collection. Existing RTA linkage adds the unimplemented product-deletion blocker. Disabling/revoking is containment, not deletion. RTA trusted deletion API remains **PLANNED / NOT IMPLEMENTED / NOT DEPLOYED / RELEASE BLOCKER**; company coordinator is also unfinished.

## 7. Targeted verification

- `node --test --test-timeout=60000 tests/privacy-readiness-007.test.js tests/legal-policy.test.js`: **12/12 passed**. Covers legal structure/copy/hash/status, protected-source preservation, version/approval controls, bundle allowlist/manifest/links, registration-only package and offline Node24 discovery; existing legal publication checks run only in an isolated ignored test copy.
- `node tests/privacy-preview-007.cjs`: **375px and 1440px passed**, all 12 policy sections, separate approval notice, no horizontal overflow or console/page errors. Screenshot visually reviewed; address hard-break rendering corrected and preview checks rerun. Uses already-installed Chrome; no browser downloaded.
- Both preparation scripts passed syntax checks and `git diff --check` passed. The initial static audit found the two existing icon paths; explicit staging-only aliases resolved them. No UI/site regression suite, live Firebase test or Pass006 resolver retest was run.

No website deployment, legal publication, cloud API/billing/IAM/provider/domain/rule update, real invitation, account activation, RTA source change, purchase change, deletion or production merge occurred. All completed artifacts are preparation only; the approval gates above remain outstanding.
