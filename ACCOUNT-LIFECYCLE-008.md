# Pass008 — Account lifecycle and deletion foundation

Development/local testing completed from Pass007 `206b7cfb82cc63a1e135a28557e4d85cacde7f55`, branch `lsd-account-lifecycle-008`. No production authorization or activation is implied.

## Implemented lifecycle

`functions/src/lifecycle.js` defines pendingVerification, active, disabled, closing, deletionBlocked and deleted, their valid transitions, revision validation and transactional write guards. Disabled covers company suspension; it is separate from the Firebase Auth disabled flag. Legacy revision is 0; initial new registration writes 0. Actual authorization-state transitions increment once. Same-state requests are idempotent. Closing/blocked/deleted cannot be restored to active through this foundation.

Before this pass, verified-profile activation could read pending then update active after a concurrent closure. Profile edits, consent and provider-grant writes had similar read/write gaps. `accounts.js` now compares state/owner/revision and uses atomic company transactions for multi-record changes. Preparation/provision/completion also recheck controls and lifecycle; in-flight provisioning blocks closure until reconciled, not merely until its lease expires. Consent/history and provider writes cannot recreate closed profile data. Normal registration, verification, profile editing and acceptance were smoke-tested through the changed paths, without rebuilding their UI/authentication flows.

`identity.js` now names deletionBlocked explicitly and continues denying all non-active states. `index.js` recognizes structured lifecycle errors; the existing two function exports remain unchanged. No deletion function is exported or reachable from the frontend.

## Implemented coordinator and safety boundary

`functions/src/deletion.js` implements a durable operation under the private company namespace, atomic owner pointer and closing revision, immutable operation owner/scope, steps, dependency/retention status, server timestamps, sanitized errors, attempts/backoff, bounded failure history, worker leases and completion verification. Same authorized operation ID returns the existing operation; other owners/scopes or a second operation for the same closing account conflict.

All new privileged lifecycle/deletion service methods hard-refuse production. Both SDK apps, database URL, demo project and loopback emulator hosts are checked; there is no production-enable switch. Backend authorization is a required injected permission verifier with no permissive default. Request/transition additionally use real Firebase verification with revocation/current-user checks, server-derived UID/mappings and recent verified owner authentication. Local authority/product fixtures are explicitly synthetic; a production operator/service authorization adapter is not installed.

Company-only is a supported local path only after comprehensive trusted product inventory proves no dependencies. Missing company links are never evidence. Verified product ownership blocks company-only without company cleanup or shared Auth removal. Company-wide mode requires trusted product erasure/receipt verification and post-erasure absence. Default RTA inventory/deletion is unavailable and blocks, even when the company has no product link.

The local successful sequence is reviewed retention → verified product dependencies → exact Auth disable/revoke → atomic company minimization → fresh product checks → exact shared Auth removal → verified company/Auth/product outcome → deleted/completed. Auth/product calls are outside RTDB transactions and checked/retried rather than represented as one atomic cross-service transaction. Shared UID generation checks and irreversible company tombstones protect against detectable stale/recreated identities; Auth timestamps/CAS and out-of-band UID reuse remain explicit limitations.

Company cleanup removes bound temporary registration/link records, reservations/invitations and unnecessary lifecycle events; strips profile contact/name/eligibility fields; minimizes mapping/claim records; and preserves an approved deleted marker. Consent evidence follows the reviewed erase/minimize choice. Security counters/support/logs/backups/product transactions have separate retention decisions; completed does not mean every record everywhere was erased.

## Recovery and retained decisions

Missing/expired retention approval, active hold, unknown dependencies, invalid receipts and lifecycle conflict cannot complete. Operation states distinguish pending, in-progress, blocked, retryable and completed. Each failure leaves company access restricted; partial cleanup is not undone by reactivation. Worker retries resume with durable ownership authorization even after Auth is disabled/deleted; an old user token cannot start a new operation. Fresh trusted worker authority remains mandatory.

The transactional lease lasts at most 60 seconds; writes/finalization require its current token. Stale workers cannot overwrite a newer completion. Interrupted/acknowledgement-lost requests are recovered by the same ID, not a new account or operation. Partial Auth failure after company minimization stays retryable; retained evidence/tombstones permit resume. Completion requires all verified steps and markers, not a lone completed field. No raw exception/token/email/password is stored in failure reports. No automatic retry scheduler or production cleanup is enabled.

Retention recommendations and remaining legal decisions are in [retention-and-runtime-review.md](audit/account-008/retention-and-runtime-review.md); full method/state/product/error contracts are in [account-lifecycle-deletion-008.md](contracts/account-lifecycle-deletion-008.md). The company-only scope extends Pass005; rta-only remains the product's separate responsibility.

## Focused verification

- `node scripts/test-lifecycle-008.cjs`: **3/3 unit cases; 19/19 emulator cases passed** (Node reports 20 including their parent).
- Cases cover authorized/unauthorized state changes, revisions and stale writes, recent authentication/verification, concurrent duplicate requests, owner/scope conflicts, legal/retention blocks, default unavailable RTA, company-only isolation, pending/retryable/forged receipts, minimized local cleanup, interrupted DB acknowledgement, partial Auth failure/retry, read-to-write activation race, guarded registration/consent/provider paths, detectable Auth recreation, provisioning reconciliation, concurrent/expired workers and invalid completion markers.
- `node scripts/test-identity-006.cjs`: **11 unit cases and 9 emulator cases passed** (plus parent). Relevant rerun because identity state handling changed; includes no-account/Google/password/revocation checks and the actual exported emulator endpoint remaining disabled.
- Targeted Pass007 preservation/package checks: **2/2 passed**. Current public Privacy/Terms/CNAME, RTA drafts, inactive client/controls and service authenticator remain preserved; registration-only package includes the newly required lifecycle helper and excludes deletion/identity modules. The historical preservation test now permits the explicitly authorized Pass008 runtime edits rather than freezing them to Pass006.
- Syntax and diff whitespace checks passed. No unrelated UI, visual, legal or full registration regression suite was run. No dependency changed.
- Tests use isolated fixture subtrees and uniquely named synthetic Auth users, removed individually. No global users/database clear or emulator restart occurred. Follow-up inspection found zero remaining Pass008 fixture groups. A synthetic sibling game sentinel survived; the coordinator's DB wrapper rejects access outside its company namespace. No real RTA paths or SQL database were read/deleted by the coordinator.

Successful product responses are mocks. They demonstrate company orchestration behavior, NOT completed RTA integration. Host remains Node24; Node22 verification from Pass007 is still outstanding. No cloud/billing/API/rules/provider/IAM/Hosting/legal change, real company identity creation, live deletion, RTA source change, purchase migration or production merge occurred.

## Exact source files changed

- New: functions/src/lifecycle.js; functions/src/deletion.js; scripts/test-lifecycle-008.cjs; tests/lifecycle-008.test.js; tests/lifecycle-008.emulator.mjs.
- Updated: functions/src/accounts.js; functions/src/identity.js; functions/src/index.js; scripts/prepare-staging-007.cjs; tests/privacy-readiness-007.test.js.
- Contracts/reports: contracts/account-lifecycle-deletion-008.md; contracts/shared-account-v1.md (development-status addendum); audit/account-008/retention-and-runtime-review.md; ACCOUNT-LIFECYCLE-008.md.

## Remaining gaps and recommended next pass

Real company-only closure remains NOT READY. RTA trusted inventory/fencing, verified legacy binding and deletion API are absent: **PLANNED / NOT IMPLEMENTED / NOT DEPLOYED / RELEASE BLOCKER**. No missing-link shortcut is allowed. A company-only keep-shared-Auth alternative is not implemented. Company-wide closure cannot bypass product blockers.

Approve actual retention/holds/minimization and support/log/backup handling; implement real trusted product proof/receipt transports; review independent operator/worker auth and least-privilege deletion IAM without adding delete rights to registration. Also resolve production worker cancellation/urgent holds, paused external RPC/UID-generation races, namespace transaction contention/size, bounded retry/monitoring and administrator recovery when an owner cannot reauthenticate. These are development limitations, not finished production controls.

Recommended Pass009: review retention and controlled execution security; reconcile the authoritative RTA inventory/fence/receipt contract with its Producer; validate Node22 and a production-isolated worker package in local/controlled staging only after separate authorization. RTA team must supply its actual trusted services. Preserve all Pass007 Privacy/billing/API/provider/domain/staging/activation gates; this pass does not approve the first real account or closure.
