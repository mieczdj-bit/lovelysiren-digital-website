# Company lifecycle and deletion foundation — Pass 008

Development/local testing only. No deletion endpoint, trigger, scheduler or frontend action exists. `functions/src/deletion.js` refuses construction or privileged calls unless both SDK apps and the configured database URL identify `demo-road-trip-arcade`, FUNCTIONS_EMULATOR is true, and Auth/RTDB hosts are exactly the guarded loopback ports. There is deliberately no production-enable flag. Production use requires new source/security review, not changing an environment switch.

## Lifecycle model

| State | Meaning | Allowed successors |
|---|---|---|
| pendingVerification | Registered company profile awaiting verified access | active, disabled, closing |
| active | Eligible for normal protected company operations | disabled, closing |
| disabled | Company suspension; not necessarily a Firebase Auth disable | active or pendingVerification after trusted review; closing |
| closing | Closure authorization recorded; protected company writes blocked | deletionBlocked, deleted |
| deletionBlocked | Closure incomplete, including recoverable failures | closing on authorized worker retry |
| deleted | Verified closure with approved retained markers/evidence | none |

Registration initializes lifecycleRevision 0. Legacy missing revision is read as 0; malformed/overflow revisions fail closed. Every actual state transition increments the revision once inside a transaction. Same-state calls do not increment. Existing verified-profile activation now increments revision; display/phone-only edits do not. No transition out of closing/deletionBlocked/deleted restores ordinary account privileges. The development transition method requires both trusted backend authority and recent verified owner authentication; restoration additionally checks adult result/current published policy versions/hashes. It is not an administrator override for an Auth-disabled owner.

Account writes compare expected owner, canonical ID, state and revision. Registration preparation, provisioning lease, completion, consent/history and provider grant operations use company-namespace transactions where multi-path consistency matters. Profile edits and verification activation use profile transactions. Validation failures abort via undefined and are returned after the transaction; callbacks do not throw during Firebase asynchronous retries. The namespace is warmed before multi-path transactions to avoid validating a partial local cache. Transaction callbacks contain no external Auth/product calls or random side effects.

Closing cannot race past a grant still marked provisioning, even if its time lease has expired: interrupted credential creation requires reconciliation, not an assumption that expiry stopped an external RPC. No new grant/provision/completion or provider-completion write is authorized once the target company profile closes. Existing throttles and read-only responses are not general authorization tokens. Firebase client sign-in/link/reset actions outside the company API remain provider operations until Auth is disabled; this pass does not claim company flags alone block every Firebase API.

The identity resolver explicitly rejects disabled, closing, deletionBlocked and deleted states. No RTA data, guest/local gameplay code or existing product authorization was modified. RTA does not yet honor company lifecycle fences; do not infer its leases/purchases are revoked by these source changes.

## Development service interface

`createDeletionCoordinator({db,auth,projectId,authorizeBackend,products,clock})` exposes server-library methods only:

- `transition({state,expectedRevision}, credentials)` — permission lifecycle:transition.
- `request({operationId,scope}, credentials)` — permission deletion:request plus recent owner token.
- `reviewRetention({operationId,plan}, credentials)` — permission deletion:review.
- `advance({operationId}, credentials)` — permission deletion:execute.
- `status({operationId}, credentials)` — permission deletion:inspect; private operator view.

credentials contains backendCredential and, for transition/request, endUserIdToken. Backend authorization is a required injected verifier returning a verified principal and an explicit permission set. There is no permissive default. Local tests use synthetic authorities; no production auth adapter is installed. Future implementations must verify independent service identity/audience/scopes, never trust a client role/permission list or a Firebase user token alone. Pass006 identity lookup authorization does not automatically grant deletion authority.

Owner proof uses Admin verifyIdToken(token,true), current Auth user, pinned project/UID/issuer, supported provider, verified/current email and auth_time within five minutes (not future). UID/canonical owner comes from those checks and verified mappings, never an email lookup or client-selected UID. Request fields other than operationId/scope are rejected. Operations are keyed by a 16–100-character opaque ID. Scope is company or company-only. Pass005 rta-only remains a product operation and is intentionally not implemented here.

An owner/operation/scope tuple is immutable. Same authorized request returns the existing operation; another owner or scope with that ID conflicts. A second ID for the same closing owner conflicts via deletionByUid. Request and closing state/revision/pointer commit atomically. The record includes server timestamps, proof reference/principal, owner IDs, Auth creation-time fingerprint, steps, products, retention reviews, attempt/backoff data and current worker lease. No raw credentials, DOB, email, password, support message or freeform exception is stored.

The trusted worker resumes durable owner authorization; it does not require an already revoked/deleted user's token on every step. An invalid token cannot originate a request. Expiry/revocation after an authorized request is not automatic cancellation of that request. Worker permission is freshly verified per advance; retention/dependency/lifecycle checks still apply. A cancellation/urgent-hold service during an active worker is not implemented; review updates are locked while its lease is live. This remains a production-readiness gap.

## Company versus product versus shared Auth

Company-only performs company cleanup and Auth removal ONLY after every configured product authoritatively verifies no dependencies. RTA is always required even if products is empty. Missing company links prove nothing. Unknown/unavailable inventory blocks before cleanup. A verified existing product dependency also blocks company-only; a keep-shared-Auth alternative is not implemented.

Company scope requests product erasure only when a trusted inventory finds product ownership. It requires a separately verified completion receipt followed by fresh verified absence. It never reads game paths, SQL purchases or guest records itself. Products retain authority for eligible record inventory/deletion/retention. No automatic purchase forfeiture or entitlement migration is performed.

After approved retention and dependencies: disable/revoke exact Auth UID; atomically minimize eligible company records; refresh all product proofs before shared Auth removal; remove that Auth UID only; then verify Auth absence, company cleanup, mapping/tombstone integrity, product proofs and retention before committing deleted/completed. A profile record removal or disabled sign-in alone cannot finish the operation. Retained data is explicitly reported, not described as universally erased.

Cleanup removes owner-bound registration/link grants, reservations and associated invitation records; conflicting invitation ownership blocks. It removes unnecessary lifecycle events and profile contact/name/eligibility/registration fields; minimizes forward mapping/claim records; preserves the inverse mapping; and keeps a minimal UID/canonical-ID/deletion-operation/state/revision/time marker. Consent history is either erased or reduced to versions, hashes and acceptance time under the reviewed choice. Existing private grants may contain email; those records are removed by bound UID/reservation, not by email as ownership proof. Security counters, support, backups and product transaction references follow their explicit retained/external decisions, not an invented purge.

## Product adapter contract v1

This extends Pass005 with company-only and an explicit prerequisite inventory/fence. Each trusted adapter provides inventory(context), erase(context), verifyReceipt(rawReceipt,context). Context includes version, operationId, scope, Firebase project/UID, canonical ID and lifecycleRevision. The adapter must resolve any legacy RTA local surrogate through verified bindings, never mint an identity or match email. The missing local-ID binding is not fabricated by the coordinator.

Inventory returns those bound fields plus product, status none/present/unknown, capability authoritative-inventory-and-fence, checkedAt, expiresAt and opaque reference. Maximum proof lifetime/freshness is five minutes. “none” must cover all applicable Firebase/SQL/legacy identities and ownership, with a fence against new product bindings while closure is pending. An absent canonical company link or an empty single table is insufficient. A capability string is not cryptographic verification: the future adapter must authenticate the product service and verify the actual evidence. No such production adapter exists.

Verified receipts bind operationId/scope/UID/canonical ID/product/revision/reference and return completed, blocked, retryable or pending. verifyReceipt must validate trusted provenance/signature and any lawful-retention outcome before returning a normalized receipt; malformed or wrong-owner receipts block. Product response codes are persisted separately. Completed requires a post-erasure inventory proving absence; no service response is invented when a backend is absent. The test-only fixtureVerified field is never accepted from a client or by a production transport, because no such transport/route exists.

**RTA trusted deletion API: PLANNED / NOT IMPLEMENTED / NOT DEPLOYED / RELEASE BLOCKER.** Default inventory and deletion are unavailable. Company-only cannot finish against real RTA until trusted comprehensive absence verification and fencing exist, even for a newly created company account. Fixture completions are NOT completed RTA integration tests.

## Failures and recovery

Operation states: pending, in-progress, blocked, retryable, completed. Per-step and product states distinguish pending/blocked/retryable/completed. Missing retention/active hold/product uncertainty produces deletionBlocked. Unknown failures persist a sanitized worker-failed code, not raw errors. Last20 sanitized failure entries are retained with attempt counts; older entries are explicitly marked truncated. Retryable errors have a one-second notBefore floor; scheduling/bounded exponential retries/dead-letter monitoring are future work.

A transactional 60-second worker lease fences each durable update and cleanup step; an expired/replaced lease cannot finalize or overwrite a newer worker. Checks run before external effects and before commit. Interrupted company cleanup is atomic within RTDB; Auth/product steps are external, idempotent/rechecked and may require retry. Acknowledgement loss can leave a committed operation/lease; retry the same ID and wait for expiry where necessary. If even failure recording fails, return operation-persistence-unavailable; do not invent durable completion. Keep the operation restricted until verification succeeds.

Auth absence is rechecked and detectable UID recreation is blocked using the creation-time fingerprint. Firebase timestamps have second-level limitations and this is NOT compare-and-delete atomicity with Auth. Operators must never recycle UIDs. Out-of-band Auth recreation/concurrent privileged writes and new-product ownership races need stronger controlled-runtime contracts before live execution. Completion is a recorded point-in-time verification, not a promise against later privileged corruption.

Whole-company-namespace transactions simplify cross-index consistency for this foundation but read/contend across company records. Scaling, costs, schema isolation, inventory completeness, incident cancellation and Node22 validation remain review gates. No production deletion readiness is claimed.

References: [Firebase transaction behavior](https://firebase.google.com/docs/database/admin/save-data), [Admin user operations](https://firebase.google.com/docs/auth/admin/manage-users), [privileged database access](https://firebase.google.com/docs/database/admin/start).
