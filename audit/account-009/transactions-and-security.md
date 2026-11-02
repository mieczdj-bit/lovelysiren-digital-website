# Pass009 transaction and worker review — November 2, 2026

Source/local tests only. No production migration, permissions or deployment. Baseline: Pass008 `9aa486892105d54c2c109def84d8de63ce66eb5f`.

## Transaction impact and implemented changes

| Operation | Current atomic scope | Finding / decision |
|---|---|---|
| Registration preparation | Company namespace | Email reservation, invitation/config and target lifecycle must agree. Retained; splitting current flat indexes without a protocol could enroll a closing UID |
| Provisioning lease | Company namespace | Couples grant/control/lifecycle before an external Auth create. Retained. In-flight provisioning still blocks closure until reconciled |
| Completion | Company namespace | Final profile, consent history, grant/reservation/invitation and closing fence must commit consistently. Retained |
| Profile/verification activation | profiles/{uid} | Already narrow. Preserved expected owner/state/revision checks |
| Consent acceptance | Company namespace | Acceptance/history and lifecycle/policy gate need atomicity with current schema. Retained |
| Provider grants | Company namespace | Ownership/lifecycle and grant updates coupled. Retained |
| Lifecycle/request/finalization/cleanup | Company namespace | Cross-index owner pointer, profile/revision and cleanup record set must agree. Retained |
| Deletion step/product/effect-result journal | deletionOperations/{operationId} | Narrowed. Validates exact owner/scope/revision/lease, active state and interruption; cannot alter lifecycle/lease/ownership or create effect intents |
| Destructive external-effect dispatch | Company namespace + external RPC | Broad atomic authorization/intent remains mandatory. Narrow journal only records results; it is never authorization for an Auth/product mutation |

Unrelated users' registrations/consent/lifecycle still contend at the broad boundary and transfer company data; operation-only journaling removes some unnecessary broad writes, not all scalability limits. New safety intents add other necessary broad checks. No claim is made that total workflow traffic/cost or throughput improved by a measured factor.

Demonstration: a synthetic namespace snapshot was 404,323 bytes; the largest observed journal callback input was 1,676 bytes during ten concurrent journal updates and ten independent profile updates. This is serialized fixture/callback size, NOT measured wire transfer, Firebase billing or a load benchmark. Evidence JSON is committed separately. Three batches of six distinct concurrent emulator registrations and concurrent consent/profile/closing writes preserved canonical ownership and revisions.

### Consistency defects corrected

1. A transaction's first SDK callback may see partial/stale local data. Early validation abort could falsely reject a valid concurrent invitation. Validation now operates on a clone and returns the untouched original on failure, forcing the server compare-and-swap to confirm that failure or supply current data for retry. No partially modified candidate is returned. This is a transaction, not an unprotected read/write replacement.
2. Local set/update may explicitly cancel overlapping SDK transactions. Only `set`/`overriddenBySet` cancellation is retried, at most four attempts with short bounded delays. Arbitrary network/acknowledgement failures are not blindly replayed. Durable request IDs and caller status/retry handling remain necessary.
3. Identical concurrent deletion requests within one coordinator coalesce only AFTER each caller's backend/owner authentication. Results are cloned per caller; the database transaction remains the ownership/idempotency authority. Different processes/instances still rely on server transactions. Contention/storage failures may require a bounded retry of the SAME ID; no unlimited success/scale guarantee is made.

### Authoritative read integration

Overlapping emulator operations exposed cache-sensitive SDK get results while transaction queries were active. Account, identity and deletion-status reads now use fresh-reader.js: read-only GET, pinned project/database origin and namespace, existing Admin credential bearer token, timeout, redirect refusal and no cached fallback. Only the exact guarded demo loopback uses the emulator owner token. Database Auth variable overrides are rejected. Resolver lookups still never write. SDK transaction warm-up get calls were removed; the transaction protocol validates state itself.

Tests exercise actual demo GETs and stubbed production URL/token/error handling; no production request or IAM grant was made. Actual deployed runtime OAuth/scopes/least-privilege access remains a staging gate. This fixes the observed integration behavior, not a blanket claim about all SDK caching. See [REST authentication](https://firebase.google.com/docs/database/rest/auth) and [Admin Credential](https://firebase.google.com/docs/reference/admin/node/firebase-admin.app.credential).

### Proposed future schema — not implemented

Consider a versioned per-UID aggregate containing profile/lifecycle, consent history, registration/provider grants and owner deletion pointer. Keep a separately governed canonical-ID uniqueness registry and email/UID reservation authority. Agree on claim/intention/finalization, interrupted enrollment, immutable tombstones, legacy reads and source-of-truth rules before migration. A multi-path update alone does not conditionally fence lifecycle and is not a substitute for a transaction. Review compatibility, rollback, retention and cross-service ownership before any V2 schema/write switch. No copy, migration or RTA ID change is performed here.

## Deletion security findings

| Finding | Pass009 result |
|---|---|
| Legal hold could be refused while a worker lease was live | Fixed: active hold and explicit interrupt revoke the lease, restrict the profile and persist blocked/interruption state atomically |
| Cancel during external work had no durable path | Added development-only interrupt(kind cancel/legal-hold), separate resume permission/reference, unique interruption ID and expected-revision binding, plus interruption history. A stale resume cannot release a newer hold even when the already-blocked profile revision is unchanged. Cancellation stops progress; it does not restore an account or undo deletion |
| A timed-out/failed RPC could still finish after a replacement worker started | Durable effect intent before Auth/product mutations. Unacknowledged effect blocks replacement execution; lease expiry alone is insufficient |
| Ambiguous Auth deletion was automatically retryable | Now blocked pending independently verified terminal reconciliation. Current Auth absence/presence alone is insufficient to prove a prior RPC drained/cancelled |
| Hold review after partial cleanup used JSON key-order equality | Fixed semantic category comparison; a reordered equivalent plan cannot prevent an emergency hold |
| Retention expired during external work | Rechecked before effects/cleanup/completion; acknowledged containment is recorded, but further erasure is blocked until fresh review |
| Stale results/changed owners | Narrow journal and root commit checks fence state, owner, scope, revision and lease; reconciliation binds original effect/owner/generation and rechecks proof freshness at commit |
| Legacy attempted operations lack effect intents | Blocked as legacy-execution-review-required; no blind upgrade/retry. Fresh never-attempted operations can adopt intent-v1 |
| Auth UID recreated within timestamp granularity or between read/delete | NOT solved. SDK metadata uses a coarse creation-time fingerprint and Auth lacks this worker's compare-and-delete fence. Prohibit UID reuse; review out-of-band writes and provider/runtime guarantees before live deletion |
| RPC already dispatched when a hold arrives | NOT retractable by a database flag. Tests deliberately demonstrate a late Auth effect while the operation remains blocked, never falsely complete. Production transport/fencing/cancellation remains a release gate |

## New private development interfaces

All retain the Pass008 hard demo-project/loopback checks and have NO Functions/frontend export. New permissions are application verifier scopes, not live IAM grants.

- interrupt({operationId,kind,reference,expectedRevision},credentials): deletion:interrupt; can stop a live worker without an unavailable owner's token; never originates a new owner request.
- resume({operationId,reference,interruptionId,expectedRevision},credentials): deletion:resume; requires interruption, no unresolved effect and valid no-hold retention; keeps profile restricted until normal worker processing resumes.
- reconcileExternal({operationId,effectId},credentials): deletion:reconcile plus REQUIRED independently verifying server adapter. Proof binds operation/scope/UID/canonical ID/effect/kind/original lease/revision/Auth creation fingerprint, terminal outcome, opaque reference and fresh times. Caller cannot supply a trusted boolean/proof in request fields.

`verifyExternalResolution` has no default implementation. Tests use explicit synthetic terminal proofs. There is no real Firebase RPC cancellation/drain verifier, no real RTA adapter, and no manual “mark success” route. An expired worker with no destructive intent can be recovered; one with an unresolved intent stays blocked. Results acknowledge transport completion separately from product erasure/absence verification. No RTA integration is proven by fixtures.

An already authorized request can be resumed by a trusted operator after Auth is disabled, using durable verified ownership. A user who cannot reauthenticate cannot originate a new deletion request through this API; independent support recovery/dual approval remains a separate review. No email-match ownership override or administrator reactivation is added.

References: [Firebase transactions](https://firebase.google.com/docs/database/admin/save-data), [Admin Auth operations](https://firebase.google.com/docs/auth/admin/manage-users). Installed SDK metadata/transaction behavior was also inspected locally. Root-scale performance, immutable Auth generation, real proof transports and bounded operational retry/monitoring remain explicit production gaps.
