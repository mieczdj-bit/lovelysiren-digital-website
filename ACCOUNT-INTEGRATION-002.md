# Account Integration 002 — implementation and approval handoff

**Status: implemented and tested in local Firebase emulators; NOT deployed to live Firebase or the production website. The first real inbox-backed account is NOT ready until the approvals/configuration below are completed.**

Based on Framework 001 commit `58ad49e`, on branch `lsd-account-integration-002`. Current production and the published Privacy/account-deletion pages are unchanged.

## 1. Permanent identity and mapping

Use the existing project's Realtime Database, under one new server-only namespace: `lovelySirenAccountsV1`. This is not another Firebase project/database and does not replace the game's identity records.

| Path inside the namespace | Purpose |
| --- | --- |
| `identityClaims/{firebaseUid}` | Durable, backend-generated provisional company ID for interrupted-allocation recovery. |
| `uidByIdentity/{lovelySirenId}` | Immutable reservation of that ID for its Firebase UID. |
| `identityByUid/{firebaseUid}` | Canonical immutable `{ lovelySirenId, createdAt }` mapping. |
| `profiles/{firebaseUid}` | Private company profile: same canonical ID, chosen display name, optional phone, adult eligibility result, approved acceptance versions/time, registration-grant hash, lifecycle state and server timestamps. No full DOB or password. |
| `policyHistory/{firebaseUid}/{versionDigest}` | Trusted document versions and acceptance timestamp, written idempotently. |
| `registrationReservations/{emailDigest}` | One stable test credential UID for an explicitly approved invitation; supports retry without resetting a password. This is an enrollment guard, not an ownership lookup. |
| `testInvitations`, `registrationGrants`, `linkGrants`, `throttles`, `controls` | Admin-only test authorization, short-lived hashed capabilities, quotas and reviewed configuration. |

New company IDs are `lsid_` followed by a backend `crypto.randomUUID()`. The backend transactionally fixes a UID's candidate, reserves the inverse mapping, then finalizes the canonical mapping. Simultaneous requests, collisions, interrupted reservations and profile-creation failure recover the same owned ID; no browser allocator is used. Reading a profile never allocates an ID. An ID string alone grants no purchases, unlocks, or admin privileges.

**RTA compatibility:** the backend never writes `users`, `playerIds`, `playerIdClaims`, existing entitlements, sessions, game progress or ad-age records. Existing RTA accounts are reconciled only through an explicit invitation with a verified existing UID and normal authenticated ownership. There is no bulk migration or email-based merge. Website display-name edits currently change only the private company profile, preserving the game's existing token/display-name rule invariant; synchronizing game display names is a separately coordinated future pass.

## 2. Actual backend implementation

- `functions/src/accounts.js`: trusted registration validation, invitations, persistent throttles, secure grants, controlled credential provisioning, atomic identity mapping/reconciliation, profile reading/editing, verified-email access checks, verification authorization and Google-link grants.
- `functions/src/index.js`: a Firebase second-generation HTTPS function named `lovelysirenAccountsApi`, explicit origin checks, ID-token validation with revocation/disabled-user checks, request limits, neutral errors and no body/password/token logging. The standalone functions package includes a deployable npm lockfile with no local workspace links. Target runtime is Node 22; local Functions Emulator used the installed Node 24 host and reported that runtime difference.
- `functions/src/maintenance.js`: bounded dry-run/default cleanup of expired grants, invitations and throttle counters. It cannot delete identities, profiles, policy history, reservations, game data or purchases. No scheduler was deployed; approve a cleanup frequency before real test storage is enabled.
- `firebase.functions.json`: functions/emulator configuration only; no production database-rules deployment target.
- `firebase/account-namespace.patch.json`: reviewable **merge fragment**, not a complete production rules file. It denies all direct client reads/writes within the namespace and adds expiry indexes. Never deploy the emulator deny-all fixture over the game's rules.
- Frontend adapter now uses `registration/prepare` → `registration/provision` → Firebase email/password sign-in → `registration/complete`. It no longer invokes the browser create-user API. It uses the existing website pages and icons.

The private provisioning endpoint receives the password transiently over HTTPS, after an authorized grant, and passes it to Firebase Admin user creation. It never stores or logs it. A retry can recover a credential created before a transport failure by its pre-reserved UID; it never changes an existing password or adopts an account by email. An explicitly existing RTA UID follows `sign-in-existing` instead, with no provisioning/reset operation.

## 3. Controlled test security and state machine

Both a server environment gate (`ACCOUNT_TEST_API_ENABLED`) and trusted database configuration must permit **controlled-test** mode. All committed browser flags remain disabled/closed. A backend-held invitation requires a 256-bit random secret (only its hash is stored), an exact allowlisted email digest, expiry, optional explicitly reviewed existing UID, approved policy versions and server-validated adult eligibility. Origin checks are additional protection, not authorization.

Registration grants progress `prepared → provisioning (leased) → provisioned → completed`. A credential record alone receives no company identity/profile or account API access. Setup requires the grant bound to the same authenticated Firebase UID/email; protected profile/link operations additionally require verified email. Profile state is pending verification until confirmed. Duplicate completion and failure recovery are idempotent; conflicts never transfer ownership.

The code does **not** claim to globally prevent direct Firebase Auth credential creation. Standard Auth clients may still call signup if that provider permits it. Such credentials cannot obtain this company's protected namespace, canonical IDs, profiles or purchase entitlements without the server invitation/setup flow. Shared RTA provider/rule behavior is not changed. If the producer requires global pre-creation restrictions, separately inspect supported project features and their impact; do not assume Identity Platform blocking functions or disable signups in a way that breaks RTA. This pass proposes controlled provisioning and deny-by-default account services, not a post-creation trigger pretending to stop creation.

Phone numbers are private and optional, not verified phone ownership or SMS/marketing consent. Full DOB is discarded after the server eligibility result. Email/network hashes are indexes/abuse controls, **not a claim of anonymization**. Capabilities expire after 15 minutes (registration) or five minutes (linking); physical cleanup is a separate, implemented maintenance step requiring an approved schedule/retention policy.

## 4. Emulator evidence

- **36 Framework/unit tests passed**, including controlled provisioning, no browser allocator, no live calls while disabled, identity/profile allowlisting, private-field minimization, Google conflict handling and a regression for token refresh racing the profile-edit UI.
- **18 actual emulator tests passed** (one parent scenario plus 17 subtests): unauthorized/bad-invitation/underage/stale-consent rejection; permitted credential creation; six simultaneous completions; immutable ID retries; verification action; unverified denial; own-profile edits; forbidden identity fields; duplicate registration; incorrect password; password-reset action; sign-out/re-login; cross-account/direct RTDB denial; disabled provider gate; interrupted identity recovery; Google link/duplicate-provider conflict; forced ID collision; lost provisioning response; bounded cleanup; kill switch/CORS; explicit existing-RTA reconciliation; and failure after canonical allocation.
- **Actual website + SDK + Functions/Auth/RTDB Emulator browser flow passed**, without mocked services: invitation form, provisioning, verification-pending, applying the emulator's action code, verified dashboard, refresh persistence, display-name/phone editing, sign-out, signing in again with the same ID, and a password-recovery request. Browser network was restricted to loopback, with no external requests.
- Existing RTA rules were read from the local RTA checkout and merged only into ignored local emulator fixtures. Tests confirmed the added namespace is inaccessible through client REST, while existing friendly IDs and profile fixtures remain unchanged. This does not certify the current **deployed** rules, which could not be inspected without Firebase authentication.
- The Auth Emulator does not implement `getPasswordPolicy`. In explicitly loopback/demo-project mode only, the frontend uses the proposed 15–128-character rule, which the real backend also enforces. Real-project mode retains Firebase `validatePassword`; its console policy and real behavior still require a controlled live test. No test was marked as a real inbox delivery or real Google OAuth popup.
- All six account pages passed 30 viewport/accessibility scans (320/375/768/1024/1440); isolated state fixtures and the homepage/RTA suite passed, including nine URLs and 222 local link/resource checks. Unrelated public pages and artwork are unchanged.
- The first emulator failures were fixed: transaction callbacks aborting before initial data load, and a token-refresh/UI-state race incorrectly blocking profile editing. The final emulator run has no failed tests.

Emulators use the virtual local ID `demo-road-trip-arcade`; no cloud project was created. The real deployment target remains `road-trip-arcade`. No service-account key was created, copied into browser code, or committed.

## 5. Draft policies and age approval

- `drafts/terms-of-service.md` and `drafts/terms-review.html`: proposed Terms, including registration/responsibility, proposed 18+ eligibility, acceptable use, purchases/Base updates versus Theme Packs, ownership/linking, suspension, deletion, limitations/contact and open legal-entity/jurisdiction decisions.
- `drafts/privacy-account-changes.md` and `drafts/privacy-review.html`: proposed account-data additions, transient credential provisioning, private phone, DOB minimization, provider/verification records, identifiers, acceptance history, security metadata, retention/deletion and child/guest-policy separation.

These documents are **not approved, effective or published**. Production registration is not enabled using them. The emulator fixture's versions (`emulator-terms-v1`, `emulator-privacy-v1`) are explicitly disposable test approvals and do not represent producer approval of the draft. Published `privacy.html` is untouched. The proposed 18+ policy is enforced by server validation in local tests; it is not active in the real project. RTA guest/game/ad-age policies are unchanged.

## 6. Real Firebase status and exact producer/owner actions

A read-only `firebase projects:list --json` attempt returned **“Failed to authenticate, have you run firebase login?”** No current live provider, domain, template, enumeration or password-policy state is asserted.

Before a real registration:

1. **Review and approve** the Terms, account Privacy changes, legal-entity/contact/jurisdiction decisions, invitation-only 18+ test policy, data retention and transient password provisioning design. Publish approved final policy URLs/immutable version IDs through a separately authorized process; do not overwrite the published Privacy Policy with a draft.
2. **Approve a limited test deployment plan** for the existing `road-trip-arcade` project: only this named HTTPS function, the new deny-by-default namespace fragment merged into the exact current rules, bounded cleanup, and a dedicated restricted staging/preview origin. No website `main` merge, bulk user migration, RTA source edit, entitlement grant, or public registration is included. Review managed backend IAM and existing Cloud Functions/billing prerequisites before changing anything.
3. Have the backend owner **authenticate Firebase CLI/Console interactively** (never paste admin tokens, service-account JSON or passwords into chat). Confirm the selected project is `road-trip-arcade`. Inspect the existing live rules and back them up; compare the namespace-only merge with emulator-tested rules without changing any legacy paths. Do not deploy `firebase/account-namespace-emulator.rules.json` as the whole live ruleset.
4. In **Firebase Console → Authentication**, inspect email/password and Google providers, authorized domains (`lovelysirendigital.com` and the specifically approved staging origin), email enumeration protection, password policy and verification/reset templates. Keep existing RTA providers intact. Proposed password policy is a minimum 15/max 128-character passphrase policy; align console/backend/client before testing. Do not change global signup controls without RTA impact review.
5. Approve a **real staging website and email continuation destination**. Production currently does not contain these new account pages, so pointing a real email at an undeployed `/account/verify-email.html` is insufficient. An existing-project Hosting preview channel or another approved HTTPS staging origin can serve the development branch without changing GitHub Pages production; that deployment also requires approval. Approve its authorized domain and Firebase-hosted action handler/templates. Verification returns to the deployed verify page; recovery returns to sign-in.
6. Provide the **one authorized producer email** and, only if an existing RTA account is to be reused, its verified owned Firebase UID. `scripts/plan-test-activation.cjs --email ... [--existing-uid ...]` creates an offline review plan and a private invitation file under ignored `work/test-activation/`; it contacts no service and leaves every enable/approval flag false. Never send the user's password to this agent. Issue the invitation only through the producer's approved private channel.
7. After the exact deployment/configuration is approved, deploy **only** `lovelysirenAccountsApi` using the functions-only configuration and the explicit existing project. Install the reviewed namespace rule fragment, managed credentials and invitation/config records. Set approved document versions/origins, enable only the controlled test API and email/password path, and keep Google disabled until its real OAuth/linking review passes. The frontend staging config must match those reviewed settings; the committed default remains closed.
8. The producer opens staging, supplies their invitation, chosen display name, DOB, optional phone and **their own password in the browser**, accepts the approved policies, and submits. Confirm real inbox verification, verified dashboard, persistent refresh, profile edit, logout/login and real reset email. Then perform a second isolated-account cross-user test and provider-conflict test if Google is approved. Never use customer accounts to simulate failures.
9. Record results and apply the reviewed temporary-data cleanup/retention plan. Keep public registration disabled. Production activation or any `main` merge needs a further explicit approval.

## 7. Local review and reproduction

The ordinary local site remains at `http://127.0.0.1:18765/`, with account services closed. The disposable SDK/emulator preview uses `http://127.0.0.1:18766/account/create.html`; it is labeled local testing and sends no real email. Use only throwaway details/passwords. A seeded synthetic preview address is `producer-preview@example.test` with local-only invitation `local-emulator-only-producer-invitation`. Verification/reset actions are issued by the Auth Emulator, not a real inbox. Local emulator data is disposable; clearing it is not a test of real-world account deletion or production ID durability.

Install pinned workspace dependencies with `pnpm install --frozen-lockfile` (functions package is included). Java 21 and Node are required for the emulator suite. Commands:

- `pnpm test` — Framework/unit tests.
- `pnpm build:auth` — reproducible browser Firebase bundle.
- `pnpm emulators` — prepares ignored local rules, including an optional `RTA_RULES_PATH` read-only source, and starts **only local** Auth/RTDB/Functions emulators using the demo ID.
- `pnpm preview:emulator` — loopback website with emulator-only configuration.
- `pnpm test:emulators` — actual backend and browser end-to-end tests (the previous two processes must be running).
- `node scripts/seed-emulator-preview.cjs` — restores the synthetic preview invitation/config after tests, without touching a cloud project or changing an existing completed preview account.
- `pnpm test:browser` and `pnpm test:states` — Framework responsive/accessibility and isolated-state regression tests at the ordinary local preview. Full homepage/RTA regression is run separately.

The staging, rules and real-account approval boundaries come from Task 002 section 12. This pass stops there deliberately: backend deployment/configuration approval and policy approval are still outstanding. **No real test account or real verification email has been created.**

Final verification rerun: October 28, 2026. The 36 unit tests, 18 backend emulator tests, and actual SDK browser flow passed. No cloud deployment or real verification-email delivery occurred.
