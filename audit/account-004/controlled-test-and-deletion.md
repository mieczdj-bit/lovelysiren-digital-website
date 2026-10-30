# Account 004 — controlled test deployment and deletion handoff

## Readiness and requested scope

Controlled real registration is BLOCKED. This pass authorizes no cloud deployment or policy publication. Local implementation and emulator/browser results do not create a real account or prove email delivery.

The exact later approval request is: authorize only the reviewed `lovelysirenAccountsApi` function and `lovelySirenAccountsV1` namespace controls/rule delta for one Executive Producer invitation on an approved HTTPS staging origin, with email/password, verified-email own-profile operations and published website policy IDs. Google linking, public registration, production GitHub Pages changes, RTA migrations, purchase/entitlement changes, scheduled cleanup and deletion-backend deployment remain excluded. The live configuration inventory, backed-up rules delta, selected staging site/domain and final Privacy version must be attached before this request can be executed. These unresolved bindings must not be filled with guessed live values.

## Firebase facts and access limitations

Directly verified public website: published Terms and old October 5 Privacy. Local source identifies project `road-trip-arcade`, database host `road-trip-arcade-default-rtdb.firebaseio.com`, existing RTA Google/Firebase integration, proposed new private account namespace and named API. Those are source facts, not authenticated cloud verification.

The Firebase CLI project-list attempt did not authenticate; the bounded retry timed out. The read-only review helper then directly checked the existing CLI session in memory and found no active default login. It did not print tokens or request passwords. No deployed rules backup was possible, no actual live namespace patch was generated, and provider/domain/email/password-policy/enumeration/IAM/billing/functions/log/hosting settings remain UNVERIFIED. The Executive Producer has been asked to authenticate privately; if they do so, rerun the read-only helper and update this report before approval.

`scripts/firebase-readonly-review.cjs` uses only existing CLI-managed authentication and metadata GET calls, plus the read-only IAM getIamPolicy POST. It does not enumerate customer Auth users or database profiles. It records allowlisted provider/config summaries, not raw OAuth secrets or IAM member addresses. It first backs up the actual deployed rules and capture manifest/hash, if access permits. Output is private and ignored under `work/firebase-review-004/`. A failure is recorded as BLOCKED, not treated as a favorable setting. Pagination flags require follow-up rather than claiming an incomplete list is complete.

`scripts/prepare-account-rules-review.cjs` requires that actual live backup manifest, exact approved project/database and matching hash. It refuses broad/inherited root grants, a conflicting existing account namespace or an unexpected patch. It prepares an offline candidate containing only the private namespace denial and four expiry indexes; every unrelated rule path is preserved. It does not deploy anything. The local RTA rules used for emulator compatibility are not a live rules backup.

## Activation gates to resolve before a real test

1. Executive Producer authenticates Firebase CLI interactively on this computer. Use `node node_modules/firebase-tools/lib/bin/firebase.js login` from the website checkout if no global Firebase command is installed. Enter credentials only in the provider's private browser flow, never in chat or source. No service-account key is requested.
2. Rerun authenticated read-only inventory and actual deployed rules backup. Confirm project/database/app identity; Email/Password/Google provider state; authorized and email-return domains; verification/reset templates/sender; password policy and email-enumeration protection; current Functions and runtime/dependencies; inherited rules; relevant IAM/service identities; billing/quota prerequisites; log/backup retention; available Hosting sites. Do not make changes merely to discover settings.
3. Approve the final Website & Account Privacy wording and operational retention/manual request procedures, then separately authorize its publication. Preserve old game disclosures by an approved transition and provide the standalone game policy before game release. Resolve version/date/hash and actual canonical URL before enabling account policy approval.
4. Select an existing or separately approved dedicated Firebase Hosting staging site/channel without overwriting the production/default game site. Record the exact returned HTTPS URL; preview URLs are public, so invitations/backend gates remain required. No staging URL is assigned or live in this pass. The only current account preview is synthetic localhost at http://127.0.0.1:18766/account/create.html, never the real test URL.
5. Present the resulting named function/rules/config/provider-domain/IAM/billing diff, risks and exact staging URL to the Executive Producer for approval. No unscoped `firebase deploy`, wholesale rule replacement, or global provider disablement is permitted.

## Named function and configuration proposal

Use existing `firebase.functions.json`, codebase `lovelysiren-accounts`, only exported HTTPS function `lovelysirenAccountsApi`, us-central1, 256MiB, 30 seconds, maximum two instances; runtime target Node 22. Local tests use host Node 24 with a documented emulator warning, so Node 22 deployment/runtime verification remains a staging check. The emulator-only PATH/discovery timeout fixes do not change the function's production timeout or activation gates.

Expected public API route after an approved deployment is the named function URL provided by Firebase; the conventional project route would be `https://us-central1-road-trip-arcade.cloudfunctions.net/lovelysirenAccountsApi/`, but it is NOT claimed deployed or verified. Pin the actual returned endpoint and the exact approved staging origin in client/server configuration. Include max body/type validation, Origin restrictions, bearer verification with revocation checking, invitation and private profile ownership checks. CORS and a preview URL are not authorization.

Review deployment prerequisites before suggesting permission changes: dedicated/least-privilege runtime identity with necessary Auth/RTDB permissions, approved deployment identity with only required Functions/build/service-account permissions, actual enabled APIs and billing/quota/cost effects. Do not grant Owner/Editor by default. Firebase Admin bypasses client RTDB rules; a new namespace does not isolate project-wide privileged IAM, Auth, billing or quotas from RTA.

`ACCOUNT_TEST_API_ENABLED` must remain false/unset until the approved window. Trusted controls from `staging/accounts-controls.review.json` start `serviceEnabled:false`, `registrationEnabled:false`, mode controlled-test, Google false, origins empty, policy approval false. `staging/client-config.review.json` is also inactive with unverified app/endpoint/origin settings unset. Emulator `.env.local` is never a source of approved live configuration. No production control mutation occurs in this pass.

Pin actual published Website Terms ID/date/source hash; Privacy remains null until separately approved/published. Never use old combined policy as if it were the approved account policy, and never substitute synthetic fixtures for real consent. Server and browser must agree on actual published versions before a real submit.

## Invitation, identity and provider risk

The Executive Producer supplies the first test email privately after deployment approval. The offline helper creates an inactive hashed-email invitation plan with random 256-bit secret under ignored work/. Do not hardcode or commit a real email/secret. Propose a 24-hour first-test invitation expiry, subject to approval. Inspect whether the exact chosen email already belongs to an existing Firebase UID through an approved private operator process; don't create a duplicate, migrate game records or merge accounts merely on an email match.

Only the trusted invitation flow may provision the company profile and permanent ID. An unrelated Firebase credential cannot automatically read private account services or acquire purchases. The registration-only kill switch now also rejects outstanding grants at provision/completion, while existing authorized profile reads can remain available; the service/API gate disables the whole new service.

Important shared-project limitation: when a Firebase Auth provider permits direct client credential creation, company invitation checks alone do not prevent all project-level Auth credential creation through Google's public API. They do prevent company profile/ID authorization. Inspect actual provider/Identity Platform anti-abuse/blocking options and decide whether any additional compatible control is necessary; such changes may affect RTA and need separate approval. Google OAuth linking remains off until separately reviewed and approved. No new second identity system/project is introduced.

## First real account sequence after approval

Open only the exact approved HTTPS staging registration URL; it will be supplied after site/channel assignment and verification. The current localhost URL is emulator-only and cannot create a real account.

Use the existing DOB-first neutral screen, then display name, selected email, optional phone, private browser-entered password and the unchecked consent checkbox for published Website Terms/Privacy. Enter the private invitation code through the form. Confirm actual Auth user and canonical UID-to-LovelySiren-ID mapping in an authorized private operator check. Receive a genuine Firebase verification email; follow it; verify protected profile access stays blocked before verification and works after it.

View the permanent ID, edit display name and optional phone (including removal), refresh to restore the session, sign out, sign back in and confirm the same ID. Request a real password-reset email and finish it privately; confirm unchanged identity and access. Exercise network/error states without claiming success. After separate authorization, use a second disposable test account to verify cross-account isolation and revoked/disabled behavior. Never use customer accounts for failure tests. Google linking/conflict tests follow their separate approval.

No password is requested in chat. No email delivery or account creation is claimed until those exact live steps pass.

## Monitoring, maintenance and rollback

During the approved test window, monitor API denied/error/rate-limit counts, authorized invitation use, expected namespace writes, Auth creation, actual verification/reset delivery, quotas and cost. Establish an operator and response contact. Do not dump raw request bodies, passwords, complete DOB, bearer/action codes, invitation secrets or profile contents into logs.

Hourly temporary cleanup is proposed, not activated; default max100 candidates/group and dry-run remain. Review/apply only under the approved operator process. No scheduled function is added. Reconcile incomplete credentials/reservations manually after the test; cleanup does not delete permanent identity or game purchases.

Emergency stop: set registration off to stop prepare/provision/complete, disable outstanding invitations, and if needed turn off service/API environment gate and serve the closed staging client. Verify backend denial. Do not disable RTA's shared provider globally as a shortcut. Restore the prior named-function revision and exact backed-up rules only if required, preserving unrelated project paths. Do not delete the entire namespace/database/project or roll back live gameplay/purchases.

## Deletion integration checklist and launch blocker

- Keep signed-out support/deletion information reachable. The current page is a contact/pre-release notice, not a finished automated workflow.
- Verify requester identity and explicitly choose company-account closure versus RTA-only data/local-save removal. Do not interpret a suspension, sign-out or disabled Auth record as completed deletion.
- Inventory and reconcile permanent ID claims, forward/inverse mappings, profile/grant references, reservations and linked provider/Auth UID before removing anything. Decide minimum necessary no-reassignment tombstones versus deletion; do not orphan references.
- Enumerate applicable game-owned records through a separately authorized deletion design: users, Player ID claims/lookup, friend edges/invites/presence, sessions/sessionPlay, finished history, suggestions, local caches and future purchase verification/entitlement records. Preserve lawful transaction/consumer rights and handle shared-session records without deleting other players' data.
- Revoke relevant sessions and remove actual Auth/provider records as required; document local offline caches, device copies, logs/backups and legal holds separately. No blanket immediate-erasure promise.
- Maintain minimal access-restricted request/decision evidence according to an approved retention basis; disclose completion and actual exceptions accurately.
- Test retry/idempotency, partial failure, shared-game separation and purchase/restoration effects with authorized synthetic/test data. Never fix orphaning by assigning a deleted ID to a different owner.

CRITICAL RELEASE BLOCKER: end-to-end account/game deletion and its lawful retention/ownership dependencies remain incomplete. This pass prepares the integration checklist and preserves the existing request resources; it does not implement or deploy a replacement RTA deletion system.
