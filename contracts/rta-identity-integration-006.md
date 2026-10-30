# RTA integration package — identity.resolve.v1 (Pass 006)

Status: implemented in development; disabled and not deployed. Base: Pass 005 `0a02734`. No RTA source changes.

## Endpoint and trust

`POST {IDENTITY_SERVICE_BASE_URL}/identity.resolve.v1`, exported function `lovelysirenIdentityApi`, region `us-central1`. No production URL exists yet. Local exported-function URL: `http://127.0.0.1:19501/demo-road-trip-arcade/us-central1/lovelysirenIdentityApi/identity.resolve.v1`; default response is disabled (`503 not-ready`).

Two independent proofs are mandatory:

1. `Authorization: Bearer <Google-issued service-account OIDC ID token>`. The company verifies the signature using Google Auth Library, exact configured audience, Google issuer, verified email, numeric service-account subject AND matching email from a static product allowlist. No user or arbitrary Google account substitutes for an allowlisted service account. Tokens must be unexpired, issued no more than 300 seconds ago, not future-issued, and have lifetime at most 3600 seconds. Google OIDC tokens normally have a longer encoded lifetime than the five-minute acceptance window; this is a refinement of Pass 005's proposed assertion format, not a company-signed assertion. Obtain a newly issued service token; do not reuse a metadata/library cache past five minutes. Fresh-token minting/rotation must be proven in staging before integration is enabled.
2. `endUserIdToken`: Firebase ID token from the client, forwarded over HTTPS by the backend. Company calls Admin `verifyIdToken(token, true)` and reads current Auth user state. It derives Firebase UID from the verified token, pins project/audience/issuer, checks current email verification and email equality, rejects disabled/revoked users and tenant/anonymous/custom/unsupported providers. Password and Google Firebase providers are supported. Raw Google OAuth tokens and Firebase custom tokens are not accepted.

The function declares `invoker: private`, with no IAM grants made. Future staging must satisfy both platform invocation IAM and this application allowlist; neither replaces the other. Exact audience and platform token-forwarding behavior need validation against the selected staging function/Cloud Run URL. Browser Origin requests are rejected, and no CORS permission is emitted. Website server backends and future products can be separately allowlisted; browser/game clients never hold service credentials.

## Request

```http
POST /identity.resolve.v1
Authorization: Bearer <service-account-id-token>
Content-Type: application/json

{
  "version": 1,
  "requestId": "rta_resolution_0001",
  "product": "rta",
  "endUserIdToken": "<firebase-user-id-token>"
}
```

Only those four properties are allowed. requestId is 8–100 ASCII letters/digits/underscore/hyphen. Product must match the authenticated service's configured product. Body limit: 16 KiB. Client-selected UID, company ID, email, lifecycle, clock and policy overrides are rejected. Tokens and bodies must never be logged by the adapter or proxy.

## Success

```json
{
  "version": 1,
  "requestId": "rta_resolution_0001",
  "lovelySirenId": "lsid_11111111-1111-4111-8111-111111111111",
  "firebaseProjectId": "road-trip-arcade",
  "firebaseUid": "existing-firebase-uid",
  "accountState": "active",
  "lifecycleRevision": 0,
  "resolvedAt": "2026-10-30T12:00:00.000Z"
}
```

Lookup checks finalized forward and inverse mappings, matching profile ownership, active lifecycle, recorded adult eligibility and acceptance of BOTH current approved published policy versions AND content hashes with valid server acceptance time. Consent is checked even when the old UI's requiresReacceptance flag is false. No profile activation, registration, policy acceptance, identity repair or ID allocation occurs here. A pendingVerification profile must finish its existing website activation flow; lookup does not upgrade it. Service and controlled-test config gates must both permit resolution. Registration can remain disabled.

Legacy profiles with no lifecycleRevision return 0; malformed revisions fail closed. This response is a point-in-time lookup, not a signed durable authorization or purchase/lease/deletion credential. Scoped rereads detect in-flight profile, mapping or config changes and return retryable conflict. They are not a cross-service atomic transaction and cannot prevent closure immediately after a successful response. Consumers must not use cached resolution to bypass later product ownership/lifecycle authorization. Future lifecycle writers must increment revisions atomically; no such writer/service is implemented by Pass 006.

## Structured errors

```json
{
  "version": 1,
  "requestId": "rta_resolution_0001",
  "accountState": "missing-company-account",
  "error": {"code": "registration-required", "retryable": false}
}
```

| HTTP | Code | Account state / adapter behavior |
|---|---|---|
| 400 | invalid-input | unknown; fix request, no blind retry |
| 401 | unauthenticated | unknown; obtain fresh user credentials or reauthenticate; no auto-enrollment |
| 403 | service-not-authorized | unknown; fix service credentials/allowlist/freshness; user token alone is insufficient |
| 403 | email-verification-required | email-verification-required; finish verification and refresh user token |
| 403 | account-unavailable | pendingVerification, disabled, closing, deleted or unavailable; block company integration |
| 403 | eligibility-required | eligibility-required; company onboarding required, independent of RTA guest/ad treatment |
| 404 | registration-required | missing-company-account; keep existing RTA identity/data and offer explicit company onboarding |
| 404/405 | not-found / method-not-allowed | unknown; correct endpoint/method |
| 409 | resolution-changed | unknown, retryable; reread with bounded backoff |
| 428 | consent-required | consent-required; send to approved website consent flow, never accept on user's behalf |
| 503 | identity-conflict | unknown, not automatically retryable; stop binding and report reconciliation issue |
| 503 | policy-pending | unknown, retryable; approved published policy configuration unavailable |
| 503 | not-ready / service-auth-not-configured / temporarily-unavailable | unknown, retryable; remain unavailable and alert operators after bounded retries |

All responses use `Cache-Control: no-store`; no error returns a canonical ID, email, raw token, mapping contents or internal exception. RequestId is echoed only after service authentication and request validation. Repeated requestId is a correlation value, not a reservation; repeated/concurrent lookup creates nothing. Resolution time can differ between retries. Retry 409/transient 503 with jittered exponential delay and a small finite attempt budget; never retry indefinitely. A new service token is needed after its freshness window. No positive or negative identity result should be persisted as authoritative forever.

## Required RTA adapter work (not included)

- Replace the paths that call `resolveLovelySirenUser` and implicitly mint a SQL UUID as a company identity. Pass 005 identified these in activation, lease, entitlement and Play verification routes. Do not simply rename the UUID or strip `lsid_`.
- Preserve existing Firebase UID, Player ID, guest identity, SQL local surrogate, all game records and purchase foreign keys. Existing Google users resolve using the SAME verified Firebase project/UID; email matching and Google OAuth-sub matching are forbidden.
- A user with no company account remains an existing RTA user/guest under existing eligibility rules. Offer explicit company enrollment without auto-registering or changing age/ad treatment. Company account creation remains 18+ and consent-gated.
- Create a separately reviewed one-to-one trusted binding between canonical company ID and existing RTA local ID only after verified subject and ownership proof. Conflicts must block binding. Pass 006 does not create that binding or migrate existing records.
- Keep Google Play verification, Base/Theme entitlement decisions and purchase ownership inside RTA. Resolver success grants no entitlement and no device lease. Current any-active-lease purchase check, local lease pools, guest promo ownership and lifecycle gaps remain Pass 005 blockers.
- Password Firebase tokens are now supported by company resolution. RTA's Google-only verifier and unavailable email-auth client remain unchanged and require a reviewed adapter before password users can traverse those RTA paths.
- No fallback local company allocator when the service is down or enrollment is missing. No client credentials, bulk migration or purchase transfer.
- Trusted RTA deletion API remains **PLANNED / NOT IMPLEMENTED / NOT DEPLOYED / RELEASE BLOCKER**. Existing website links are not evidence of deletion support.

## Subsequent controlled staging requirements

Review this boundary and its five-minute service-token freshness rule; choose exact audience and approved backend principal(s); validate fresh token acquisition and platform forwarding; approve least-privilege invocation and runtime read/Auth-check IAM separately. No IAM has been changed. Configure `IDENTITY_RESOLVER_ENABLED=true`, `IDENTITY_SERVICE_AUDIENCE=<reviewed HTTPS audience>`, and `IDENTITY_SERVICE_CALLERS=[{"subject":"<numeric-service-account-id>","email":"<service-account-email>","product":"rta"}]` only after staging authorization. Review RTDB controls with serviceEnabled, mode controlled-test and identityResolutionEnabled true, actual published and approved policies, invited test profiles and intact mappings. Keep registration off unless separately authorized. Current unapproved Privacy prevents successful live resolution; this pass does not publish it.

Before staging, deploy only by a separately authorized plan on Node 22; confirm invalid service/user credentials, revoked users, non-allowlisted principals and current policy/lifecycle failures on the real HTTPS endpoint. Emulator service tokens use ephemeral local signing keys through a test-only injected verifier, not Google's live key distribution or Cloud IAM. Emulator success does not satisfy this final cloud security check. Review quotas and abuse monitoring without logging credential bodies. RTA adapter, bindings, device leases and deletion remain later work; no production merge/activation is approved here.

References: [Firebase token verification](https://firebase.google.com/docs/auth/admin/verify-id-tokens), [revocation checks](https://firebase.google.com/docs/auth/admin/manage-sessions), [Google service-account ID tokens](https://docs.cloud.google.com/docs/authentication/token-types), [Google Auth Library](https://googleapis.dev/nodejs/google-auth-library/latest/).
