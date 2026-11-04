# RTA Producer handoff — canonical LovelySiren identity (Pass 013)

**Status:** implementation contract proposal for RTA review. Website Pass 013 is local-only; no RTA code, binding records, customer data, purchases, rules or production services changed.

## Authority and identity model

- Company backend alone allocates and resolves permanent `lsid_…` LovelySiren IDs.
- RTA keeps its existing Firebase UID, Google provider identity, SQL `internal_lovelysiren_users.id` UUID, friendly Player ID, guest state, game records, purchase ledger and foreign keys.
- Identify an authenticated person by the verified `(Firebase project ID, Firebase UID)` pair. Never bind using email, Google `sub`, Player ID, or by stripping/renaming an `lsid_` prefix.
- A UID without a company account remains an RTA user. Resolver `404 registration-required` is a normal unlinked state: preserve gameplay and records, offer explicit company enrollment only where appropriate, and do not retry as registration or mint a company ID locally.
- A successful resolver response is point-in-time identity lookup only. It is not purchase, entitlement, lease, deletion, or durable lifecycle authority.

## Company enrollment for a pre-existing RTA Google user

The website controlled path uses `POST registration/google/prepare` followed by `POST registration/google/complete`. Preparation requires a single-use invitation that is explicitly bound to the existing Firebase UID and email; Admin Auth must confirm that UID is enabled, email-verified and already bound to `google.com`. Completion separately verifies the user ID token, Google sign-in provider, matching UID/email and current Admin Auth binding. Only then does the company backend allocate one canonical ID and profile. The invitation is for explicit adult eligibility and current website Terms/Privacy consent; no company enrollment happens through ordinary RTA sign-in.

RTA must not implement these account-creation operations itself. Producer/operator invitation issuance must use a UID selected from an authorized RTA record review, not an email search used to transfer ownership. Existing Google accounts retain their Firebase UID, Player ID, SQL UUID and records byte-for-byte. If Auth cannot prove the same UID and provider, stop and reconcile; do not create a second identity.

## RTA server adapter: requested shape

Call the deployed company `identity.resolve.v1` endpoint from RTA's trusted server only. Authenticate the service with an audience-bound, short-lived Google service-account ID token whose numeric `sub`, exact email, audience and product are on the company allowlist. Forward the requesting user's Firebase ID token separately as `endUserIdToken`. Never send a service credential to a browser, Android client, or Firebase client. Company verifies/revocation-checks the user token and the RTA service token independently. Use HTTPS and no-store; do not log token/body values.

On `200`, validate response version, request ID, project ID, UID, canonical ID, active state and lifecycle revision. Only after the existing RTA local identity and Firebase subject are independently proven may RTA create a one-to-one binding. Proposed binding (not yet agreed or implemented): `{version, lovelySirenId, rtaLocalUserId, firebaseProjectId, firebaseUid, verifiedAt, evidenceReference}` with uniqueness on both `lovelySirenId` and `rtaLocalUserId`; no reassignment or automatic conflict repair. Keep the existing SQL UUID as a local surrogate and preserve every existing foreign key. Do not bulk-backfill users or transfer purchase ownership.

For email/password company users, Firebase ID tokens are supported by the company resolver, but RTA's current Google-only verifier/client is not. RTA must implement a reviewed provider-neutral server verifier and a proper company sign-in UI before password users can use RTA account-dependent operations. Do not relax the Google-only validator with email claims or add a placeholder client.

## Concrete RTA paths to reconcile

Pinned source basis: RTA commit `048c0138f7c99a2bc8c59a317ff87ca74afbd7c2`; file hashes in `contracts/rta-source-lock.json`. These are files for the RTA team to change in its own approved task; none changed here.

1. `server/lib/lovelysiren-account.ts::resolveLovelySirenUser` and migration `migrations/0003_lovelysiren_accounts_mailbox.sql`: replace its role as company-ID allocator with a product-local SQL identity lookup plus verified company resolution/binding. Preserve `internal_lovelysiren_users.id` and dependent data; no rename-in-place.
2. `src/routes/lovelysiren/account/activate.ts`: bind only after exact existing Firebase UID and RTA local account ownership are verified. No email-only lookup/merge.
3. `src/routes/lovelysiren/account/lease.ts`: company resolution alone grants no lease. Reconcile product-local two-slot lease pool with the future shared lease contract, live device proof, generation fencing and disabled lifecycle checks.
4. `src/routes/lovelysiren/account/entitlements.ts` and `src/routes/verifyGooglePlayPurchase.ts`: keep Play verification, receipt/order/token data and all entitlement decisions in RTA. Replace only identity ownership resolution; preserve ledger owners, token-hash replay checks and local FKs. Verify that the specific current device lease is valid before purchase writes.
5. `src/lib/lovelysiren-email-auth.ts` and `src/lib/firebase/account.ts`: current email/password product path is unavailable; RTA's `verifyGoogleFirebaseIdToken` accepts only `google.com`. Add provider-neutral Firebase verification with issuer/audience/signature/expiry/revocation/disabled checks before supporting company password accounts.
6. `src/lib/entitlements.ts`, `src/lib/entitlement-cache.ts`, `src/lib/multiplayer/resolution.ts` and `src/lib/multiplayer/service.ts`: inspect all identity assumptions/caches and make lifecycle/conflict/expiry behavior explicit before relying on resolved company IDs.

These paths are not permission to change RTA source. Pass 005 also records confirmed defects: existing disabled/deleted SQL user resolution and lease heartbeat do not consistently enforce lifecycle; stale release lacks generation fencing; guest promo attachment accepts installation ID without proven guest credential. Each needs an RTA-owned compatibility test and a separately reviewed implementation.

## Response and retry handling

Use the structured errors in `contracts/rta-identity-integration-006.md`:

- `404 registration-required`: keep RTA identity/data; no local allocation or automatic enrollment.
- `401 unauthenticated` / `403 email-verification-required`: refresh or reauthenticate the end user; stop privileged operation until valid.
- `403 service-not-authorized`: treat as caller configuration/security failure; do not retry the same service credential blindly.
- `403 account-unavailable`, `eligibility-required`, or `428 consent-required`: deny company-linked operation; route to supported company account flow or support. Never accept policy on the user's behalf.
- `409 resolution-changed` or transient `503`: bounded jittered exponential retry using a new service assertion; never loop indefinitely or cache a positive result as permanent authority.
- `503 identity-conflict`: stop, preserve all local data and escalate for ownership reconciliation.

When resolution is temporarily down, RTA's existing guest/game identity and non-account gameplay remain governed by existing RTA rules; never fall back to minting a second company ID. Treat disablement/revocation as a company-linked authorization failure on each sensitive RTA operation. A successful earlier lookup cannot override a later closed account.

## Required joint tests before any RTA adapter ships

Use disposable emulators and synthetic RTA fixtures first. Cover: same Google UID from Auth to RTA local record to canonical ID; missing company account without data loss; one-to-one binding uniqueness; mismatched UID/email/provider and conflicting bindings; email/password token after RTA verifier support; revoked/disabled and closing lifecycle; service-token audience/subject/expiry/revocation; resolver timeout and bounded retry; existing SQL foreign keys, Player ID, games, purchases and promos unchanged; no fallback ID mint; and company deletion blocked until RTA's trusted inventory/fence/deletion operation exists. These prove adapter behavior only; they do not authorize migration or production rollout.

## Not in this handoff

No purchase/entitlement migration, company/RTA device lease service, deletion handler, RTA data backfill, RTA source change, production service principal/IAM, cloud deploy or live account test. RTA trusted deletion is **PLANNED / NOT IMPLEMENTED / NOT DEPLOYED / RELEASE BLOCKER**.
