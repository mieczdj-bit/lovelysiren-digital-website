# Pass 013 — First account and RTA integration readiness

**Status:** Development implementation and isolated test work only. No live activation, account creation, production policy change, RTA source change or deployment. Starting point: Pass 012 `6b77dfc591a2f549ea1b689e4ab4469911db764a`; branch `lsd-account-rta-readiness-013`.

## Account journey review

The existing password journey remains invitation-only: approved adult and current policy acceptance are checked on the backend, the invited credential is provisioned, completion binds the server-derived Firebase UID, verification gates profile access, and identity allocation is transaction-safe and retryable. Sign-in/out, masked password recovery, verification/resend, profile settings and lifecycle controls already have focused emulator coverage. This pass did not redesign those screens or change their policy requirements.

The concrete missing flow was existing RTA Google enrollment. The prior Google button attempted the ordinary registration endpoint and could not finish enrollment; the existing Google functions only linked Google to an already-created company account. Also, the ordinary password prepare endpoint rejected a non-password method after writing its reservation. It now rejects that method before any reservation mutation.

## Controlled existing-Google enrollment added

Two account API routes implement an explicit, invite-bound path:

1. `POST registration/google/prepare` validates age, both accepted policy versions/hashes, registration and dedicated `googleEnrollmentEnabled` gates, rate limits and the single-use invitation. The invitation must name the existing Firebase UID. Admin Auth must confirm that exact UID is enabled, email-verified, has a `google.com` provider binding and the invited email. An active profile, existing canonical mapping, deletion marker or UID reservation blocks preparation. No company ID is allocated here.
2. The browser signs in with the selected Google account and submits the short-lived grant to `POST registration/google/complete` with its Firebase ID token. The server requires the same UID as the invitation, `google.com` as the token sign-in provider, verified matching email, and a fresh Admin Auth provider check. In one company-namespace transaction it creates the forward/inverse/claim mappings, adult active profile, policy history, completed grant and invitation consumption, so a failed transaction cannot leave this flow with an allocated ID but no profile. Same-grant retries return the same ID; a live concurrent completion lease returns retryable `409 retry-later`.

The flow never matches or links identities by email alone. A UID mismatch does not create a company profile or canonical ID. RTA `users`, Player ID claims, purchases, leases and game data are not written or migrated. Registration remains closed by default; the committed browser config and reviewed staging controls keep Google and registration disabled. Emulator fixtures explicitly turn the features on only inside the isolated demo project.

Firebase Google popup sign-in may create an Auth identity when a different, previously unseen Google account is selected. The backend will reject it unless it is the exact invited UID and the browser signs it out. No RTA record or company identity is created by that rejection. Before a real shared-project test, the operator must verify the invitation's UID/provider binding and warn the tester to choose only that existing Google account; unexpected Auth-user creation must be included in the scoped post-test reconciliation.

## Canonical resolver and integration boundary

Pass 006 `identity.resolve.v1` remains read-only. It independently validates an end-user Firebase ID token with revocation/disabled checks and a separate fresh audience-bound allowlisted Google service-account ID token. It checks verified email, adult category, active lifecycle, finalized forward/inverse mappings, current approved policy versions/hashes and server acceptance time. A missing company account returns `404 registration-required` / `missing-company-account`, without allocating an ID. Invalid/revoked credentials, stale consent, disabled/closing accounts, mapping conflicts and temporary failures fail closed. Resolution grants no purchase, lease, ownership binding or deletion authority.

Combined local coverage now creates/enrolls an existing Google UID and resolves that same UID to the newly assigned canonical ID. The resolver's separate service-auth tests continue to verify valid allowlisted caller success and reject user-token-only, wrong/expired/future/audience/signature/service assertions. This is emulator evidence, not Cloud IAM or live RTA compatibility evidence.

## RTA source-level findings and next implementation

The exact pinned RTA source evidence is Pass 005 `contracts/rta-source-lock.json` (RTA commit `048c0138f7c99a2bc8c59a317ff87ca74afbd7c2`; RT-038B foundation `dfb51f2f67925ea08b8eb385569c19fa7577103f`) and `contracts/source-conflicts.md`. See `contracts/rta-integration-handoff-013.md` for a producer-ready adapter plan.

No RTA repository files were edited. The remaining compatibility conflicts are confirmed in those pinned revisions: `server/lib/lovelysiren-account.ts::resolveLovelySirenUser` and migration `0003_resolve_lovelysiren_google_identity` mint product-local SQL UUIDs as permanent company identities; Firebase auth in `server/lib/lovelysiren-account.ts` accepts only Google and omits Admin revoked/disabled lookup; `src/lib/lovelysiren-email-auth.ts` is unavailable; activation, lease, entitlement and Play-verification routes consume the local account result; SQL purchases/promos/mailbox/leases retain foreign keys to `internal_lovelysiren_users.id`; the lease pool is product-local, lease actions lack current-device generation fencing, and guest promo attachment relies on installation ID. Existing disabled/deleted SQL users may still resolve or heartbeat. These require RTA-owned adapter and migration design; this pass does not declare compatibility.

RTA trusted account/game-data deletion remains **PLANNED / NOT IMPLEMENTED / NOT DEPLOYED / RELEASE BLOCKER**. No deletion handler, binding, device lease service or entitlement transfer is implied by this account onboarding work.

## First real account — not ready

An actionable approval and staging sequence is in `audit/account-013/first-real-account-checklist.md`. Highest blockers remain: final Privacy publication and RTA disclosure continuity; support/recovery/retention decisions; shared project billing and exact APIs; a fresh live Auth/domain/function/rules inventory; least-privilege runtime identity; approved staging host/email verification; explicit one-invitation account-registration and Google-enrollment activation; and a separately authenticated RTA service caller. The current live Privacy record has no approved published version in this repository's readiness package; until corrected, current-consent-based identity resolution cannot be live-ready.

The Pass 009 isolation requirements still apply. A new email is not evidence of no RTA data; use the exact verified UID, independently reviewed RTA inventory and ownership fence. No real invite, account, Firebase inspection, IAM/API/billing change, live service, policy publication or product migration was created/performed in this pass.

## Focused verification

Results and limitations are recorded in `audit/account-013/test-results.md` and `audit/account-013/discoveries-and-risks.md`. Local test commands run only against the demo Auth/RTDB/Functions emulators and Node 22. No full website visual or live integration test is claimed.
