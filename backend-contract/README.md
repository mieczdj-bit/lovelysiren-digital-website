# Account backend contract — NOT DEPLOYED

This is a proposed website service boundary, not a new account database or a claim that these endpoints exist. The RTA repository remains untouched. The existing `road-trip-arcade` Firebase project is mandatory. No Firestore client, direct Realtime Database writer, or Admin SDK is used in the public website.

## Identity findings and unresolved decision

Read-only review of `RoadTripArcade/src/lib/firebase/{config,client,account,profile,player-id}.ts`, `firebase/database.rules.json`, and `FIREBASE_ACCOUNT_FOUNDATION.md` found:

- Firebase Auth UID is currently the RTA internal authentication identity.
- Realtime Database `users/{uid}` stores `{ displayName, playerId, createdAt }`.
- `playerIds/{lowercasePlayerId}` owns immutable UID reservations; `playerIdClaims/{uid}` supports interrupted allocation.
- Friendly Player IDs use the approved animal-name/four-digit model. Existing code allocates them through RTDB transactions protected by rules. This website does not replicate that allocator.
- Current rules reject extra profile fields and constrain displayName to the token name. Phone, age category, Terms acceptance, and a company-wide provider-independent LovelySiren ID do not fit that schema unchanged.
- No approved, deployed company-wide LovelySiren ID mapping, website account API, age/policy backend, or Firestore account schema was located. The source review does not establish which rules/providers are deployed in Firebase Console.

Before integration, the producer/backend owner must decide how existing UID/Player ID records map to the permanent LovelySiren ID. Preserve existing ownership and purchases. Do not relabel email, Firebase UID, guest IDs or Player ID as the company identifier without explicit architecture approval. Do not create a competing ownership collection from this proposal.

## Transport and authorization requirements

All endpoints below are HTTPS POST, JSON, `Cache-Control: no-store`, with explicit website/development CORS origins. Authenticated endpoints receive a Firebase ID token in `Authorization: Bearer ...`. They must verify issuer/audience for `road-trip-arcade`, expiration/revocation where required, UID, and email verification for protected profile/provider operations. A client UID, age category, policy timestamp, or “approved” flag is never authority. Limit request sizes, allowlist fields, rate-limit abuse, and never log tokens, passwords, full DOB, or reset links.

The browser's hidden sections are convenience only. Every backend read/update must scope to the verified token identity and enforce canonical ownership. Firebase Auth alone grants no administration access.

| Relative endpoint | Request | Required trusted behavior |
| --- | --- | --- |
| `registration/prepare` (unauthenticated) | `method`, displayName, birthDate, email, optional phone, `accepted: true`, termsVersion, privacyVersion | Rate-limit; validate real DOB against server time and approved adult eligibility policy; reject minors while rules are unapproved; validate name/email/international phone; require current published approved document versions. Discard DOB/exact age after eligibility evaluation. Issue a short-lived, single-use opaque `registrationGrant` bound to expected normalized email/method and the validated payload. No credentials or user-selected ID are accepted. |
| `registration/complete` | `{ registrationGrant }` plus Firebase token | Verify token, atomically consume grant, require token email/provider match the grant, record server time/document versions/age category, resolve existing approved LovelySiren identity idempotently. No email-based account/purchase merge. Return success only after trusted setup is recorded. Unverified credentials must remain restricted. |
| `profile/read` | `{}` plus verified token | Resolve only caller's canonical account, enforce policy/eligibility completion and return the allowlisted own profile described below. Never allocate a new ID as a side effect of merely reading this page. |
| `profile/update` | displayName, phone string or null plus verified token | Validate fields again; update only caller's allowed private fields, preserve canonical IDs/purchases, handle displayName consistency with existing RTA rules/Auth token model. Null phone means remove the optional value; never creates SMS/marketing consent. Sensitive changes require recent authentication. |
| `verification/authorize` | `{}` plus token (unverified allowed) | Enforce persisted server cooldown/quotas per UID and abuse controls before the SDK sends mail. Permit only the caller's unverified identity. Firebase quotas also apply; browser cooldown is not a security boundary. |
| `providers/google/prepare` | `{}` plus verified, recently reauthenticated token | Validate `auth_time`, capture exact existing UID/canonical ID and provider state, issue an expiring one-use `linkGrant`. Never identify the target by supplied email. |
| `providers/google/complete` | `{ linkGrant }` plus refreshed token | Verify same UID and existing canonical account, check actual linked Google provider, atomically consume the grant, preserve ownership and audit the authorized link. Fail conflicts rather than merging accounts or purchases. |

`profile/read` response (proposed website view, not a database schema):

```json
{
  "profile": {
    "firebaseUid": "verified caller UID",
    "lovelySirenId": "existing server-resolved canonical identity",
    "displayName": "Captain",
    "phone": null,
    "accountStatus": "active"
  }
}
```

401 causes sign-out; 403 means setup/access is unavailable; 429 is throttled. Other failures are generic temporary service errors. Return no existence-sensitive messages or another user's profile. Backend response identity is checked again by the browser; only allowlisted fields are exposed in state.

## Server reference implementation

`registration-policy.js` is a tested, pure reference validator for the future backend. It is not mounted, does not assign identity, and has no Firebase credentials. Its policy argument must come from trusted server configuration, and its clock from the server. There is deliberately no approved policy in this repository; unknown policy rejects everyone. The reference supports adults only (an approved minimum of at least 18); it does not establish final legal eligibility rules or implement parental-consent flows. Its result has age category and server-stamped policy versions, not DOB/exact age. The backend must still implement safe grant storage, token checks, idempotency, App Check/abuse controls as appropriate, and transactional canonical identity resolution.

Frontend preflight alone cannot stop direct Firebase Auth sign-ups. Before activation, review project signup settings and Identity Platform blocking-function/controlled-onboarding options so eligibility constraints are enforced server-side, and ensure incomplete Firebase credential records have no app/account privileges. Do not assume browser feature flags prevent unauthorized Auth API access. Google may create credentials on first login and has provider-specific automatic trust/link behavior: review that project behavior with the RTA owner before enabling Google, preserve existing canonical bindings, and never implement email-based merge logic.

## Firebase/hosting work still required

- Confirm/reuse the existing web app configuration already present in RTA; no new Firebase project is needed. Public Web API keys are client config, not Admin credentials. They are intentionally not activated in this branch.
- Backend owner deployment access and an approved API URL. Keep any Admin credentials only in managed server credentials, never in this repository or a browser bundle.
- Confirm email/password and Google providers, authorized production/dev domains, email-enumeration protection, approved Firebase password policy, verification/reset templates and quotas.
- Verification/reset use Firebase-hosted action handling and a continuation to `https://lovelysirendigital.com/account/verify-email.html`. Confirm allowed URLs/templates with the project owner before enabling.
- Approve Terms and account-specific Privacy changes, document versions, adult eligibility/child-account policy, DOB minimization, private optional-phone storage/retention, and independent future consent preferences.
- Extend the existing project's server data access and RTDB security rules only after identity/storage coordination; test own-user isolation, revoked/unverified access, immutable IDs, server-only policy/age data, provider conflicts, interrupted registration, and concurrency in emulators. No Firestore rules were added because no approved Firestore account system exists.
- Registration must remain closed until all of these are resolved. Production activation needs separate user approval.
