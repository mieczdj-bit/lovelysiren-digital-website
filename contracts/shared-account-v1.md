# Shared account contract proposal v1 — Pass 005

Status: proposed, review required; NOT an implemented or deployable API. No migration authorized.

Sources: website `bc38faf1953ac69eb0477e15ce54db0d2904dc81`; RTA `048c0138f7c99a2bc8c59a317ff87ca74afbd7c2`, including RT-038B foundation `dfb51f2f67925ea08b8eb385569c19fa7577103f`. Source hashes are in `rta-source-lock.json`.

## Identity resolution

The company backend alone allocates permanent `lsid_…` IDs. The canonical authentication key is `(firebaseProjectId, firebaseUid)`, using a verified Firebase ID token subject; it is neither an email nor a Google OAuth subject. Preserve all RTA UIDs, friendly Player IDs, guest identities and game records.

Proposed trusted operation `identity.resolve.v1`: request `{requestId, product:"rta", endUserIdToken}`; response `{version:1, lovelySirenId, firebaseProjectId, firebaseUid, accountState:"active", lifecycleRevision, resolvedAt}`. The caller must be an authenticated, allowlisted RTA service. Company verifies token issuer/audience/signature/expiry/revocation/disabled state, email verification, canonical inverse mappings, active lifecycle, adult eligibility and current approved website consent. RTA cannot supply an authoritative owner ID or email. Missing enrollment returns `registration-required` without allocating an ID; invalid proof returns `unauthenticated`; closed/disabled accounts return `account-unavailable`; stale consent returns `consent-required`. A Google game sign-in does not enroll a company account. Website 18+ remains independent of RTA guest/ad treatment.

Transport, service IAM and audience-bound assertion signing remain to be selected. Never expose service credentials to clients. Any assertion must expire within five minutes, include audience, subject, lifecycle revision and unique ID, and be checked against current lifecycle for sensitive writes. Tests of injected verification are not tests of production signing.

## Purchase ownership

RTA alone verifies Google Play, acknowledges purchases and decides Base/Theme entitlements. Keep raw receipts, purchase tokens, order IDs and product ledgers in RTA. Company receives only verified references, product/entitlement keys, status, verification time, canonical owner and provenance. Do not invent Theme SKUs.

Preserve existing SQL user UUIDs as product-local surrogate keys and their foreign keys. Proposed trusted binding record: `{version:1, lovelySirenId, rtaLocalUserId, firebaseProjectId, firebaseUid, verifiedAt, evidenceReference}` with unique local user and unique canonical owner within RTA. Bind only after both canonical resolution and proof of the existing RTA Firebase subject; never match by email or strip the `lsid_` prefix. Conflicting bindings return `ownership-conflict`, never transfer automatically. Existing ledger owners remain intact. New local projections must reference company identity rather than mint a second permanent company ID. Per-account binding implementation and retention need review; no bulk backfill.

Proposed `entitlement.read.v1` returns `{version:1, lovelySirenId, product:"rta", verifiedAt, entitlements:[{key,status,reference}]}` from RTA. Purchase writes require current requesting-device lease proof and current account lifecycle. RTA retains token-hash uniqueness and replay/owner checks. Guest promo attachment additionally requires the guest credential plus authenticated account ownership; an installation ID alone is insufficient.

## Shared device leases

Company owns one ledger across participating products. Reuse RT-038B's two-active-device limit, twenty-minute expiry, hashed opaque installation/session identifiers and server timestamps; heartbeat target five minutes. Do not start independent two-slot pools per product. Hosting/storage is undecided: the existing company RTDB backend has no SQL lease engine. Reuse policy, not an unapproved database deployment.

Proposed operations `lease.acquire.v1`, `lease.heartbeat.v1`, `lease.release.v1`: authenticated service and verified canonical subject; request includes requestId, product, deviceSessionId, platform and optional label. Acquire returns `{status:"active", leaseId, generation, expiresAt, activeCount}` or `{status:"limit", activeCount}`. Timestamps on the wire are ISO-8601 UTC. Heartbeat/release require matching owner, leaseId, generation and device; stale generations cannot renew or release a newer lease. Expired/closed accounts cannot renew. Product purchase checks must validate that exact live lease, not merely another device's active slot. No client controls owner, clock or expiry. Release is idempotent. Recovery and deletion remain reachable when slots are full.

Producer decisions remain: which website actions consume a slot, how apps share a logical installation without hardware fingerprinting, and storage/transport. These decisions must precede implementation.

## Deletion orchestration

Proposed `deletion.request.v1`: recent verified authentication, operationId, canonical subject, scope `company` or `rta-only`. Company coordinator records durable operation and increments lifecycle revision before work; closes new identity/lease/purchase writes and revokes leases. Trusted RTA worker receives `{version:1, operationId, scope, lovelySirenId, rtaLocalUserId, lifecycleRevision}`; it verifies caller and binding, applies approved retention policy, then returns a durable idempotent receipt `{operationId, product:"rta", status:"completed"|"blocked"|"retryable", completedAt?, retentionReferences:[]}`. Repeated IDs with different owners/scopes fail. Retry is safe; partial failure remains pending and must not be called completed.

For company scope, finalize company Auth/profile deletion only after every required product receipt and approved legal-retention handling. RTA-only removes approved RTA data/product links; it never deletes company Auth, permanent identity or other products. Release only that product's lease participation where appropriate. A disabled row, sign-out or mailbox deletion is not completed account deletion. Preserve minimal non-PII operation tombstones only under an approved retention policy.

**RTA trusted deletion API: PLANNED / NOT IMPLEMENTED / NOT DEPLOYED / RELEASE BLOCKER.**

The producer explicitly confirmed this status on October 30, 2026. There is no completed handler in RT-038B or another production-ready source to locate. RT-017 ended BLOCKED without a partial deletion implementation. The producer reports that client rules prevented complete deletion of `users/$uid` (required `newData.exists()`), effectively create-only `suggestions` and `finishedGames`, and `sessions` (deletion not permitted). This historical explanation is producer-supplied, not an additional independent audit of RT-017.

RT-038B account hooks, Manage Account/Delete Account website links and account-aware mailbox functionality do not implement account/game-data deletion. Mailbox deletion cannot substitute for it. Company backend also lacks a coordinator and approved deletion IAM. Worker tests must remain stubs until a real source implementation is supplied.

Before this release blocker can close, the RTA service needs authenticated trusted authority; an explicit inventory of affected data paths and ownership selectors; server-side privileges capable of deleting eligible records blocked by client rules; idempotent retries; partial-failure reporting; approved retention exceptions; and completion verification across every affected record class. Do not loosen client rules as an assumed workaround. `Delete RTA Data` invokes that product service and preserves the company account. `Delete LovelySiren Account` invokes the company coordinator, which calls the RTA service as one required product-specific step. Neither flow may claim success after partial deletion. This clarification authorizes documentation only, not service implementation or deployment.

## Compatibility gate

Current implementations are NOT compatible with this proposal. Review concrete conflicts in `source-conflicts.md`. Emulator tests characterize existing code and policy reuse; passing expected-conflict assertions does not authorize deployment. Required next approvals: both teams accept contract/version/errors; choose trusted transport, lease storage and slot policy; approve per-account bindings, deletion/retention/IAM; authorize separately scoped adapters and their end-to-end tests. Existing Pass 004 privacy and account activation approvals remain separate. No live configuration, rules, identity, entitlements or deletion changes are included here.
