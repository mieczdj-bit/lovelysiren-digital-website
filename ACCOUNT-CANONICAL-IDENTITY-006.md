# Pass 006 — Canonical Identity Service

Completed in development October 30, 2026. Base `0a02734`; branch `lsd-account-canonical-identity-006`. No production merge, cloud deployment, IAM/API/billing change, rule edit, registration activation, legal publication, RTA modification, purchase change or migration.

## Implementation

`POST {serviceBaseUrl}/identity.resolve.v1` is exported as private HTTPS function `lovelysirenIdentityApi` in `functions/src/index.js`. It is disabled unless the new `IDENTITY_RESOLVER_ENABLED` environment flag is exactly true. It additionally requires company controlled-test config with `identityResolutionEnabled: true`; neither existing controls nor public client flags were changed.

`functions/src/identity.js` implements the read-only resolver, structured error/state model and shared HTTP handler. It checks the Firebase token with revocation enabled, server-derived UID/project/provider, current Auth account/email verification, finalized forward/inverse ownership mappings, active lifecycle, adult profile eligibility and current approved policy versions/content hashes/acceptance time. It never calls the existing allocator or registration backend and has no write path. Missing company accounts explicitly return `404 registration-required` with `accountState: missing-company-account`. Repeated and concurrent requests return the same existing ID, without reservations or new identities.

Scoped rereads detect changes to profile, mappings or controls while resolving and return `409 resolution-changed`. This is a point-in-time lookup, not a globally atomic downstream authorization. Missing legacy lifecycle revision is reported as 0; later lifecycle writers must introduce atomic revision updates. No lifecycle writer, company assertion issuer, binding service, lease service or deletion service was added.

`functions/src/identity-service-auth.js` implements the separate trusted service boundary using Google Auth Library's OIDC verification. It requires a configured audience and static product allowlist matching both numeric service-account subject and verified email. Tokens must be unexpired, not future-issued, issued within five minutes and have encoded lifetime at most one hour. Firebase user credentials alone never authorize the service. Cloud IAM invocation remains private, with no new live grants. No service credential is embedded in a client. `functions/runtime.env.example` documents disabled configuration only.

`functions/package.json` and its lockfile explicitly pin `google-auth-library` 11.3.1 (already present transitively in the previous lockfile). npm also refreshed its gcp-metadata dependency from 9.2.2 to 9.2.3. Existing Firebase package versions remain unchanged. No website/browser dependencies or bundles changed.

## Focused verification

Command: `node scripts/test-identity-006.cjs`, with existing local Auth, RTDB and Functions emulators running on ports 19099, 19000 and 19501 for `demo-road-trip-arcade`.

- 11/11 focused unit cases passed.
- 9/9 emulator cases passed; Node also counts their parent test, reporting 10/10.
- Unit coverage includes read-only repeatability/concurrency, both supported providers, wrong project/tenant/unsupported providers, missing and conflicting mappings, state/eligibility, verification, policy versions/hashes/time, invalid/revoked credentials, lifecycle races, request validation, service claim/time/audience checks, signature failures and key-service outages.
- Emulator coverage uses real password and Google Firebase emulator identities, real Admin revocation/disabled checks, exact scoped company profiles/mappings, twenty concurrent resolutions, no-account RTA preservation, stale consent, inverse conflicts and unauthorized services. Service assertions are actually RSA-signed with ephemeral test keys and checked by Google Auth Library's offline certificate verifier through an injected test seam. No production path accepts those test keys; there is no runtime test-auth bypass.
- The actual exported Functions emulator endpoint returned `503 not-ready` with `Cache-Control: no-store` under its unchanged default environment. Successful resolver tests exercise the same shared handler in process with real emulator Auth/DB and offline service certificates; they do not prove cloud IAM or live Google key retrieval.
- Tests isolate config under a unique fixture path through an injected DB reader; global company controls are never enabled. Unique Auth users, company records and synthetic RTA sentinel records are removed afterward. Existing real RTA data is untouched. No global Auth/DB reset occurs.
- Revocation test initially exposed Firebase's one-second revocation timestamp granularity; it now waits 1.1 seconds before actual Admin revocation, then verifies rejection. It does not fabricate revocation state.
- Syntax checks for all new/changed function modules and `git diff --check` passed. Host Node is 24.22.1; configured cloud target remains Node 22. Node 22 staging validation remains required. Unrelated UI/site suites were not rerun.

New test files: `tests/identity-fixtures.mjs`, `tests/identity-resolver.test.js`, `tests/identity-resolver.emulator.mjs`; focused runner: `scripts/test-identity-006.cjs`.

## RTA integration and next approval

See `contracts/rta-identity-integration-006.md` for endpoint/version, service/user credentials, examples, error states, bounded retry behavior, old Google users, canonical binding and security restrictions. RTA must replace independent company-ID allocation through a reviewed adapter, preserve its local UUID/FKs/UID/Player ID/guest data, and bind canonical identity only with verified ownership. Its Google-only gate, purchase/device lifecycle gaps and deletion blocker remain unchanged. Resolver success grants no purchase or lease rights.

Before controlled staging: approve exact HTTPS audience, caller principal(s), least-privilege IAM and fresh-token acquisition/forwarding; approve actual published Privacy and policy config; authorize invited test profiles and disabled-by-default enablement separately; test Node 22 and real platform IAM/Google signature trust. No public registration is required for lookup. Production deployment, RTA adapter/bindings, migrations and all later identity/lease/entitlement/deletion changes require separate scope and approval. Trusted RTA deletion API remains **PLANNED / NOT IMPLEMENTED / NOT DEPLOYED / RELEASE BLOCKER**.
