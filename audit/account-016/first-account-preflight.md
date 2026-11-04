# Pass 016 — First Real Account Preflight

**State:** Development and local/emulator verification only. No Firebase settings, production hosting, DNS, billing, rules, user records, invitations, or email were changed. Public registration remains disabled.

## Repository and preserved work

- Starting branch: `lsd-account-policy-integration-015` at `5d508eb3f192d7920404b2a5d036744fcb78ef13`.
- Synchronized approved `origin/main` at `a407de16f8885900d4f73907a496e51bac48b30f`, which publishes Website Terms v1.0. Terms are not reverted to the earlier draft.
- Working branch: `lsd-account-first-real-account-016`.
- The Pass 015 account implementation, policy drafts, inactive controls, and legal archive are retained. The local change to the Pass 007 preservation test updates its Terms baseline to the approved main commit; the previous check incorrectly required the older draft-era `terms.html`.

## Live Firebase inspection

Read-only inventory of project `road-trip-arcade` completed using the existing authenticated CLI session on 2026-11-04. Sanitized output is under ignored `work/firebase-review-004/`; exact deployed RTA rules backup and manifest are outside Git under `Documents/private-config-backups/`.

| Area | Verified finding | Account-test consequence |
|---|---|---|
| Project | Active project `road-trip-arcade` (`64562967612`) | This remains a shared RTA project. |
| Auth | Google provider enabled. Email/password and anonymous providers report `null` in live config. Verification and password-reset templates are configured using Firebase's default method. | Invited email/password is not ready; enabling it is a live Auth setting change. No email delivery guarantee was established. |
| Authorized domains | `localhost`, `road-trip-arcade.firebaseapp.com`, `road-trip-arcade.web.app` | No LovelySiren staging hostname is authorized. |
| RTDB | Only `road-trip-arcade-default-rtdb` exists, in `us-central1`; `lovelySirenAccountsV1` is absent from deployed rules. Root read/write are denied. | Dedicated account database still needs creation and separate rules review. Never point the account runtime at the RTA default. |
| Rules backup | Exact live rules captured read-only; SHA-256 `21eb68a441f784821421e232afd5141fd9c20a6f1cfc3f38536f0128c9c6b9f6`. | Backup is private, not committed. No live rules changed. |
| Functions | v1/v2 function inventory requests returned HTTP 403 because Cloud Functions API is disabled. | Deployed function names/configuration could not be confirmed; do not infer that none exist. |
| Hosting | One site `road-trip-arcade` at `road-trip-arcade.web.app`; no staging site found. | A staging hostname/site and authorized domain remain necessary; no production site was used. |
| Billing | Cloud Billing is not linked (`billingEnabled:false`). | Cloud Functions deployment and secondary RTDB creation are blocked on a billing decision. |
| APIs | Firebase/Auth/RTDB/Hosting/Storage/Service Usage/Logging APIs enabled. Cloud Functions, Cloud Build, Artifact Registry, Cloud Run, Eventarc and IAM APIs disabled. | Backend deployment needs an approved API-enablement plan. No API was enabled. |
| Runtime identity / IAM | Only `firebase-adminsdk-fbsvc@road-trip-arcade.iam.gserviceaccount.com` was listed; it has Auth Admin, RTDB Admin and Service Account Token Creator bindings. Proposed `lovelysiren-accounts-staging@road-trip-arcade.iam.gserviceaccount.com` is absent. | Do not reuse the broad default SDK identity. Create/review a dedicated least-privilege runtime identity only after approval. |
| Account controls | `lovelySirenAccountsV1/controls/config.json` is absent. | No live account service or registration controls are active. |

The summary lists service-account identities and roles only; human IAM member identities and customer records were not included. Live rules were read for backup and hashed, not displayed in the committed report.

## Code and test preparation

- Account Functions source already includes invitation-based email/password and explicit existing-Google enrollment routes, server-issued canonical IDs, policy/eligibility gates, lifecycle checks, a dedicated-database guard, and the `ACCOUNT_TEST_API_ENABLED` backend gate. It refuses the RTA default database URL.
- `staging/account-014-controls.review.json` remains review-only and all service, registration, Google enrollment/linking, identity, contact, marketing, and deletion flags remain false. Privacy acceptance remains `null`; it cannot authorize a real account until an approved and actually published Privacy version/hash exists.
- Local Node 22.23.4 was installed in ignored `work/` using the project's pinned checksum; locked root and Functions dependencies were installed. Java 21 was found in the existing local Android tool directory and used only in a process-local environment for emulator testing.
- Emulator rules were composed with the exact captured RTA rules as the parent and the account namespace rules as a child. This tests the separation locally; it does not change deployed rules.
- Corrected a stale Terms baseline assertion to compare against approved synchronized main (`a407de16`). Fixed the emulator runner to launch the local preview server itself, select a free loopback port, bind the exact origin into the emulator-only config, and shut down its child process. The client accepts emulator mode only for that explicitly configured `127.0.0.1` origin and isolated `demo-road-trip-arcade` project.
- Verification: `pnpm test` on pinned Node 22.23.4 — **79 passed, 0 failed**. Firebase Auth/Functions/RTDB emulator integration — **26 passed, 0 failed**; includes invitation/eligibility/policy rejection, credential provisioning, concurrency/idempotency, verification action, profile edit, password recovery, sign-out/re-login, revocation/disabled-user checks, and RTA rule/record preservation. Browser emulator journey passed with no external requests or JavaScript errors; it exercised stable-ID display after reload, policy reacceptance, profile update, sign-out/sign-in, and recovery request. These tests do not prove real email delivery or live infrastructure behavior.

## Privacy and deletion readiness

Producer-authored Pass 015 v1.1 source files remain untouched and their preview is generated under ignored `work/` with `noindex,nofollow`, a review banner, no effective date, and no approved content hashes. The archived combined policy is included in that local review package and remains unchanged. Do not copy preview output to `public/` or deploy it. Local review routes are `/privacy.html`, `/games/road-trip-arcade-privacy.html`, `/delete-account.html`, and `/legal/archive/privacy-2026-10-05.html`; intended public URLs are `https://lovelysirendigital.com/privacy.html`, `/games/road-trip-arcade-privacy.html`, `/delete-account.html`, and a non-public archive route unless approved otherwise. Current Website Terms v1.0 remains `https://lovelysirendigital.com/terms.html`, effective 2026-10-28, SHA-256 `963bac3c70804f34e9aa184149b46c714d720e37ba6181529744d7d465ef44de`.

The following SHA-256 values identify the exact producer-authored source bytes used for these review copies. They are not approval hashes and must not be used for account acceptance until publication is approved and the served bytes are verified:

| Candidate source | SHA-256 | Publication state |
|---|---|---|
| Website & Account Privacy v1.1 | `7fc8ced8dcbafdf290007eb8ef951ebef4a571f11c16c7368feb88850e79ec2c` | Not approved/published; effective date unset |
| Road Trip Arcade Privacy v1.1 | `dba29e8b7b0883f21f8d6883e3d91c74df95a2e6794c3cc12fdc751a74253f6f` | Not approved/published; effective date unset |
| Account & Data Deletion page | `eb78f1db77625813655c6163f280a56eac3d9eb28ed43d1774cc12d176baa319` | Review copy only; no published deletion service |
| Archived combined Privacy HTML | `031c533f94bcb34454db46393eb63ccf5e101cac66d17b93a7676caf6222ce1d` | Preserved archive; local copy is noindex |

Account acceptance remains Terms `website-terms-v1.0` plus Privacy `null`; it cannot accept an unpublished Privacy v1.1. No RTA policy agreement was substituted for Website/Account Privacy.

The RTA policy currently says complete automatic removal is not available. That statement remains accurate for the currently deployed game: the durable B2 implementation exists on development branch `rta-release-b2-durable-deletion-016` at `2b66fb7327ebedc174ed11a825fabc0b6c4456ac`, but is **not merged to RTA main, deployed, or live-verified**. Therefore the producer-authored source is preserved; do not publish language implying customers can use B2 yet. After RTA release evidence is approved, Producer review must update the RTA Privacy/deletion disclosures to describe the released request path, pending/partial/completed states, retained purchase/refund and anti-replay evidence, other-player preservation, and local saves. The B2 handoff states the public deletion page and privacy URL are not live-verified or updated.

No effective date was assigned. No new privacy wording, policy hash, publication registry value, or account acceptance version was invented. The current Terms v1.0 published registry remains authoritative; Terms alone do not satisfy the separate Privacy acceptance requirement.

## Remaining approvals and dependencies for one real invited account

1. Select/approve an adult test participant, exact email/password journey, accountable operator, and one-person test window. Invitation must be generated privately at activation, UID/account records must not enter Git/logs, and public registration must remain closed.
2. Approve exact Website & Account Privacy v1.1 and RTA Privacy v1.1 wording, release alignment, actual publication dates, publication URLs and content hashes. Review/archive and publish via a separately authorized website release before accepting consent.
3. Approve a staging hostname and site ID, create the isolated staging host, and add only that hostname to Firebase Auth authorized domains. Do not reuse the RTA production host.
4. Approve Cloud Billing plan, budget/alerts and spend cap. Official Firebase documentation says Cloud Functions require Blaze; deployment uses Cloud Build and Artifact Registry and can incur storage/runtime charges. Firebase's no-cost quotas do not guarantee zero spend. Blaze is also required for multiple RTDB instances, and secondary instances are disabled on downgrade to Spark. No reliable monthly estimate is possible before traffic/storage/deployment assumptions are set.
5. Approve required APIs and the minimal service identity/IAM. Functions inventory is currently unverified due API 403. Avoid the broad default SDK identity for company account data.
6. Approve creation of one isolated account RTDB instance, initial deny-by-default rules, exact URL, and independent read/write authorization tests. Keep the RTA default URL/rules unchanged.
7. Review/deploy only the account-only Function package and disabled client/config to staging; first verify disabled behavior. Then separately authorize opening the service and one UID-bound invitation for a short controlled window.
8. Enable email/password only if the chosen login path requires it, review action links and template behavior, and confirm email delivery by an authorized single-recipient test before the user window. No live email was sent.
9. After a real registration, inspect only the exact test UID and account path with authorization; verify email status, one stable `lsid_`, profile update, logout/login persistence and password recovery. Keep all other registration and linking paths closed.

No production or billable change is authorized by this preflight. The exact price depends on linked billing account rates, deployment artifact storage, runtime, database storage/download, logs and shared project traffic; the Producer must explicitly choose a spend ceiling before linking billing.
