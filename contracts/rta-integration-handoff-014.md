# RTA Producer handoff — current-source reconciliation required (Pass 014)

**No RTA source, data, rules, purchases, account bindings or IAM were changed.** The Pass 013 resolver contract remains the intended boundary proposal, not proof that current RTA is compatible.

## Canonical resolver contract preserved

`identity.resolve.v1` is a read-only company operation. It independently authenticates the end-user Firebase ID token and an allowlisted, audience-bound trusted service assertion from RTA's server. It returns the canonical company ID only for the same project/UID after verified email, active lifecycle, finalized UID↔ID mapping and current approved consent checks. Missing company enrollment is an explicit `404 registration-required`; no endpoint path creates an account. A successful lookup grants no purchase, entitlement, lease, migration, deletion or permanent RTA binding by itself.

Keep the existing RTA Firebase UID, local SQL UUID and foreign keys, Player ID, guest identity, progress, sessions, suggestions and purchase ownership. RTA retains exclusive Google Play verification and entitlement decisions. Never use email alone to bind accounts, mint a replacement RTA UUID, attach purchases, or fallback to a second company ID. Do not grant resolver IAM or turn the resolver on from this pass.

## Mandatory current-source inspection before adapter work

Pass 013 findings were pinned to RTA commit `048c0138f7c99a2bc8c59a317ff87ca74afbd7c2`. That revision is historical evidence only for current-source decisions. Before implementing, the RTA Producer must provide the current branch/commit and inspect these areas (names may have changed):

1. Firebase initialization/auth providers and token verification, including issuer/audience/signature, revocation, disabled account and provider-specific handling.
2. Current company/local identity resolution and activation routes, database migrations, uniqueness constraints and existing SQL UUID foreign-key consumers.
3. Google Play verification, purchase/token replay controls, entitlement and restore/cache paths.
4. Device leases, install/device evidence, generation fencing, stale release and account lifecycle checks.
5. Friend lookup, private multiplayer, invitations, mailbox, suggestions, guest conversion and all caches that may rely on a local/canonical ID.
6. Current deletion request UI, server authorities, data-path inventory, rules, retention exceptions, retry/status reporting and completion proof.
7. Current app/store privacy links, third-party SDKs, AdMob configuration, age/family handling, diagnostics and deployed rules/permissions.

Record each path/hash/behavior and concrete incompatibility against `contracts/shared-account-v1.md` and Pass 013's `contracts/rta-integration-handoff-013.md`. Then update the adapter proposal and tests for that commit. Do not copy old file paths mechanically, and do not modify or deploy RTA until the RTA Producer approves its own implementation task.

## Required RTA-owned adapter contract

RTA server forwards the requesting user's Firebase ID token separately to the HTTPS resolver, authenticating its own service principal server-to-server. Never send the service assertion to web/mobile clients. On success, independently verify local RTA account ownership before creating an immutable one-to-one local binding to the company ID. Keep the local UUID as an RTA surrogate. Define conflict response, timeout, bounded retry, cache expiry and lifecycle recheck for each sensitive operation. A `404` preserves all RTA state and does not trigger enrollment or local ID allocation.

Before an adapter can ship, pass disposable end-to-end tests for exact UID binding, no-account behavior, mismatched identity/provider, revoked/disabled/closing user, stale consent, resolver/service-token failure, one-to-one conflict, no retry loops, and byte-for-byte preservation of synthetic Player ID/game/purchase sentinels. Purchase verification and current-device lease checks remain RTA-owned. Company deletion stays blocked until the trusted RTA inventory/fencing/deletion API is implemented and its partial failures can be verified.

## Known cross-project blocker

The RTA trusted account/game-data deletion service remains **PLANNED / NOT IMPLEMENTED / NOT DEPLOYED / RELEASE BLOCKER** per the Producer's prior confirmation. Pass 014 prepares independent policies that state this limitation. Neither a visible Delete Account link, an RTA mailbox delete, a company profile deletion, nor an Auth disable action closes it.
