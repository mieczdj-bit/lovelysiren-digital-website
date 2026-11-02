# Pass009 — Account hardening and first-account preflight

Prepared November 2, 2026 from Pass008 `9aa486892105d54c2c109def84d8de63ce66eb5f`. Branch `lsd-account-preflight-009`. Source/local testing only; no production deployment or activation is authorized or performed.

## Database transaction review and changes

Broad namespace transactions remain for registration preparation/provision/completion, consent/history, provider grants, lifecycle ownership pointers and deletion cleanup/finalization. With the existing flat UID/email/canonical indexes, a narrower read-then-update shortcut would sacrifice consistency. The [review and proposed V2 aggregate](audit/account-009/transactions-and-security.md) records each operation's cost/conflict impact and the schema/protocol decisions required before further narrowing. No schema or RTA migration occurred.

Implemented safe reductions: operation-only step/product/effect-result journaling at deletionOperations/{operationId}, immutable owner/scope/revision/lease checks, and coalescing identical in-process deletion requests AFTER independent authentication. Defensive result copies prevent shared response mutation. Cross-instance idempotency is still adjudicated transactionally in the database, not by the in-memory optimization.

The concurrency review also found false validation against the SDK's incomplete/stale first callback. Mutators now work on clones; a failed validation submits the untouched original for server CAS confirmation instead of aborting prematurely or returning partial mutations. Explicit local set/update cancellation has a bounded four-attempt retry; ambiguous network errors are not blindly replayed. Storage/contention errors still require bounded same-ID recovery, not an unlimited-success promise.

Account, identity and deletion-status reads now use a pinned, authenticated, read-only server GET rather than the SDK active-query cache. No cached fallback is accepted; writes retain CAS/lifecycle safeguards. Transaction warm-up reads were removed. Local tests cover this integration; production OAuth/IAM access still needs controlled staging verification.

Fixture evidence: 400 KB of unrelated data was added; journal inputs stayed under 2KB during ten journal and ten profile writes. Exact serialized sizes are in [transaction-evidence.json](audit/account-009/transaction-evidence.json). These are callback/snapshot sizes, not actual wire/billing measurements or proof total deletion traffic improved. Safety dispatch intents add necessary broad checks. Namespace-wide scaling/transfer/contention remains a future schema gate.

## Actual Node22 verification

**PASS locally on Node 22.23.4**, using an official portable Windows x64 ZIP extracted ONLY under ignored work/. SHA-256 was checked against the official distribution checksum. No global/system Node installation or PATH was changed. The normal system Node remained 26.13.0.

Clean locked `npm ci --ignore-scripts --no-audit --no-fund` installations passed in isolated copies of both the full Functions package and the registration-only candidate. Native ESM loading, lifecycle helper behavior, full registration/private-identity discovery, identity private-invoker metadata and actual local HTTP 503 disabled behavior passed. The isolated registration package discovered only lovelysirenAccountsApi and excluded identity/deletion/journal source. Firebase emulators also reported host Node22. Source-level lifecycle/security/concurrency and affected identity tests ran against the clean installed package with that same portable runtime.

[Node22 evidence](audit/account-009/node22-evidence.json) pins version, archive checksum and results. Reproduce with a verified portable Node22 distribution using `node scripts/check-node22-009.cjs`. That script refuses another major version and uses the distribution's own npm. Local compatibility is not actual cloud Build/Run/IAM startup, HTTPS access or real email delivery; those remain separately approved staging checks. Compatibility copies contain probes/install artifacts and must not be deployed.

## Deletion hardening and remaining security gaps

Implemented development-only fixes:

- Emergency legal hold/cancellation atomically persists interruption, restricts lifecycle, increments actual state revision and revokes a live lease. An active hold is no longer refused solely because the worker is running or equivalent category keys are ordered differently.
- Every Auth/product mutation has a durable external-effect intent before dispatch. Lease expiry or an ambiguous failure cannot authorize an overlapping destructive retry. Unresolved intents remain blocked.
- Separate trusted interrupt/resume/reconcile scopes; resume binds the exact interruption ID and lifecycle revision; terminal reconciliation needs a verified server adapter, bound effect/owner/lease/generation/reference/freshness evidence and a commit-time recheck. Caller-supplied booleans, an Auth lookup or a timeout are insufficient. No real terminal verifier is supplied.
- Narrow journal cannot change lifecycle/ownership/lease or create effect authority. Stale results cannot finalize; completion rejects interruption/unresolved effects. Previously attempted legacy operations without intent metadata require explicit review.
- Retention expiry blocks further erasure; containment/completed effects are recorded honestly. Existing safe registration, activation race, consent, disabled-account and revision protections remain.

**Not solved or claimed live:** a dispatched RPC cannot always be recalled; Firebase Auth creation metadata is not an atomic generation/CAS token; out-of-band UID recycling can still race provider operations. Tests deliberately demonstrate an already-issued Auth effect completing after a hold while the operation stays blocked. Real terminal-proof transports, UID non-reuse enforcement, cross-product fencing, production authorization/IAM, runtime budgets/retry/dead-letter monitoring and administrator-originated support recovery remain approval/design gates. No production deletion endpoint or expanded registration delete permission was introduced.

## Company-only isolation, retention and first-account readiness

[First-account approval package](audit/account-009/first-account-approval.md) defines independent UID/store/legacy-binding evidence, authorized narrow read-only inventory, timestamp/provenance and a fence against new product ownership. A missing company link, a new email or Auth disablement is not proof of no game data. No RTA inventory response or manual `none` shortcut was invented. Trusted real product inventory/fence and deletion are still unavailable to this coordinator; safe real company-only cleanup remains blocked.

The operator procedure covers incomplete/unverified registration, stable mappings, consent evidence, containment, owner-verification/recovery, retention, unresolved effects and independently verified completion. A worker may resume an already authorized request after Auth becomes unavailable; someone who cannot reauthenticate cannot originate a new privileged request through a fabricated email/admin override.

[Executive Producer retention decision table](audit/account-009/retention-decisions.md) specifies minimum data, purpose, review/removal criterion, legal questions and implementation support for active profiles, identity/deleted markers, consent, temporary data, security, support, logs/backups, transaction references and operation/effect records. Every decision is unapproved. No statutory duration or automated cleanup was invented or activated.

**First real account: NOT READY.** The exact future sequence remains Privacy publication with RTA disclosure preservation; support/retention approval; Blaze/API prerequisites; fresh Functions inventory; least-privilege registration runtime; actual staging Node22 confirmation; minimal live-derived rules; controlled HTTPS staging; approved shared Auth email/password settings; one private invitation; real verification/recovery tests. These steps were not executed. Registration, identity resolution and deletion have separate deployment/activation boundaries; the first test excludes identity/deletion/public registration/Google linking/game integration.

RTA trusted deletion API remains **PLANNED / NOT IMPLEMENTED / NOT DEPLOYED / RELEASE BLOCKER**. Current configured inventory is unavailable. Pass005's pinned-source revocation/identity conflicts must be reverified and resolved by its Producer. This pass neither changes RTA source/data/purchases nor asserts current release compliance.

## Focused test results

- `scripts/test-preflight-009.cjs` on portable Node22: **8 new transaction/journal/read unit cases, 3 lifecycle unit cases, 19 affected lifecycle/deletion emulator cases, 10 new preflight emulator cases, 11 identity unit cases and 9 identity emulator cases passed** (60 cases; Node additionally counts three parent tests).
- New emulator cases cover three batches of six parallel registrations, concurrent profile/consent/closure, separate coordinator idempotency, narrow owner journals, active holds/cancel, late Auth effects, expired leases, retention expiry, binding-invalid terminal proof and legacy-worker blocking. Product services/proofs are explicitly synthetic; no completed RTA integration is claimed.
- Node22 clean package checks: **both packages passed** locked installation/ESM/discovery/lifecycle/disabled HTTP checks.
- Targeted preservation and registration-package checks: **2/2 passed**. Public Privacy/Terms/CNAME, RTA drafts, closed client/controls and service-auth code stayed protected. Identity and privileged deletion/journal source are absent from the registration candidate.
- Syntax and diff whitespace checks passed. No full website/visual/legal/RTA gameplay or historic registration regression suite was run. Affected backend smoke and security regressions were retained; corrections were tested locally under load/overlap.

No global test-user/database clear was used. Previously stopped local emulators were started with the demo project on loopback; scoped synthetic users/fixture trees were cleaned individually. No live Firebase inspection/change, real account, production IAM/API/billing/provider/rule/domain/deployment change, policy publication, purchase change or production merge occurred.

## Files changed and next pass

Runtime: functions/src/lifecycle.js; functions/src/deletion.js; functions/src/accounts.js and functions/src/identity.js (fresh-reader wiring); new functions/src/operation-journal.js and functions/src/fresh-reader.js.

Verification: scripts/prepare-staging-007.cjs (includes fresh-reader dependency); tests/identity-resolver.test.js and tests/identity-resolver.emulator.mjs (affected dependency coverage); scripts/check-node22-009.cjs; scripts/test-preflight-009.cjs; tests/preflight-009.test.js; tests/preflight-009.emulator.mjs; tests/preflight-009-fixtures.mjs; tests/lifecycle-008.emulator.mjs (updated stricter hold/ambiguous-effect expectations and explicit synthetic reconciliation).

Reports/contracts: ACCOUNT-PREFLIGHT-009.md; audit/account-009/{transactions-and-security.md,retention-decisions.md,first-account-approval.md,node22-evidence.json,transaction-evidence.json}; contracts/account-lifecycle-deletion-008.md (superseding addendum).

Recommended Pass010: obtain decisions on the prepared Privacy/retention/support package; reconcile authoritative RTA read-only inventory/fence and terminal-proof contracts with its Producer; review the remaining shared-Auth race/UID non-reuse and production worker authorization. Only then seek narrowly staged infrastructure/registration approvals in the documented sequence. Do not turn local Node22 success or mocked closure into permission to create the first real account.
