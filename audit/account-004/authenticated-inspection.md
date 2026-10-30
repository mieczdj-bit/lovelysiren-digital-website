# Pass 004 — authenticated Firebase inspection and controlled-test proposal

**Inspected October 30, 2026 using the Executive Producer's existing authenticated Firebase CLI session. All production operations were read-only. No live deployment, API/provider/billing change, invitation, account creation or registration activation occurred.**

This report supersedes the earlier “CLI authentication required / no live backup” findings. It does not turn the Privacy drafts into approved policies or authorize the proposed changes below.

## Verified findings

| Area | Direct live result |
| --- | --- |
| Project | `road-trip-arcade`, display name **Road Trip Arcade**, state ACTIVE; existing project, not a new identity system |
| RTDB | `https://road-trip-arcade-default-rtdb.firebaseio.com`, ACTIVE, us-central1 |
| Google sign-in | Enabled; client configuration present. OAuth secret was not requested or saved |
| Email sign-in | Returned `signIn: {}` with no enabled email/password configuration. Email/password must be explicitly enabled before the proposed password test; no provider was changed |
| Anonymous/phone | No enabled configuration returned by the selected sign-in fields; do not enable them for this test |
| Authorized domains | `localhost`, `road-trip-arcade.firebaseapp.com`, `road-trip-arcade.web.app`. The company production domain and any new preview hostname are not currently listed |
| Email privacy | `enableImprovedEmailPrivacy: true` — preserve it |
| Blocking functions | Empty configuration; no registered blocking function shown |
| Password policy | No custom `passwordPolicyConfig` returned. Do not describe the account backend's 15–128 rule as an already-enforced cloud policy |
| Verification/reset mail | Firebase DEFAULT delivery; English; sender local part/reply-to `noreply`; default subjects use `%APP_NAME%`; action handler `https://road-trip-arcade.firebaseapp.com/__/auth/action`. Templates exist; actual delivery and return flow have not been tested |
| Cloud Functions | Both v1 and v2 inventory GETs returned 403 with **SERVICE_DISABLED** for `cloudfunctions.googleapis.com`. This is an API-state blocker, not proof of missing operator permissions or proof that no old Functions exist |
| Billing | `billingEnabled: false` |
| Hosting | Existing site `road-trip-arcade`; only the `live` channel was listed, URL `https://road-trip-arcade.web.app`. No account preview channel is present |
| Web app | Existing ACTIVE **Road Trip Arcade Web**, app ID `1:64562967612:web:b4cb8249d29d6155997f39`; reuse within the same project is proposed, without Analytics initialization |
| IAM | Authenticated operator has a project Owner binding. Narrow read-only permission checks confirmed Functions create/get/list/update, Service Usage get/enable, project IAM update, Auth config update/user create/get and service-account create/actAs. No new Owner grant is needed or proposed |
| Proposed runtime identity | Lookup of `lovelysiren-accounts-test@road-trip-arcade.iam.gserviceaccount.com` returned 404; it is not a verified existing runtime identity |
| Account namespace | Absent in deployed rules and in the database's shallow root-key response; account controls are absent. No individual customer record was read |

Some API fields omit unset/default-false values; absence is recorded rather than represented as an explicit returned false property. Provider configuration and the existence of templates are not a successful registration or email-delivery test.

### API prerequisites

Direct Service Usage reads returned:

- DISABLED: Cloud Functions, Cloud Run, Cloud Build, Artifact Registry, Eventarc and IAM APIs.
- ENABLED: Identity Toolkit, Firebase Hosting, Pub/Sub, Cloud Storage and Service Usage.
- Cloud Asset API is also disabled, so it was not used as a workaround for the blocked Functions inventory.

The current Firebase CLI's gen2 deployment preparation would enable required APIs and generate relevant platform service identities; therefore even a “deployment preflight” is not treated as read-only permission to change this project. No deploy/enable command was run. Function deployment requires the Blaze plan according to [Firebase's deployment guide](https://firebase.google.com/docs/functions/get-started#deploy-functions-to-a-production-environment); billing approval and an account selection remain prerequisites. No cost estimate or automatic spending cap is promised.

## Deployed rules backup and comparison

Captured at `2026-10-30T13:02:02.912Z` from the authenticated rules API, not copied from a local game file.

- Backup: `work/firebase-review-004/backups/2026-10-30T13-02-02-912Z/deployed-database.rules.json`
- Manifest: same folder, `rules-backup-manifest.json`
- Size: **352,226 bytes**
- SHA-256: `21eb68a441f784821421e232afd5141fd9c20a6f1cfc3f38536f0128c9c6b9f6`
- Working offline candidate: `work/firebase-review-004/proposed-database.rules.json`

These files stay private in ignored `work/`; raw deployed rules and credentials are not committed into the public website repository. Sanitized capture metadata, difference paths and the small proposed namespace fragment are committed in `live-rules-comparison.json`. A final authenticated read confirmed the deployed rules still match the captured hash.

Root `.read` and `.write` are false; there is no root wildcard grant or existing `lovelySirenAccountsV1` rule. The offline candidate adds only:

```json
{
  "lovelySirenAccountsV1": {
    ".read": false,
    ".write": false,
    "registrationGrants": { ".indexOn": ["expiresAt"] },
    "linkGrants": { ".indexOn": ["expiresAt"] },
    "throttles": { ".indexOn": ["expiresAt"] },
    "testInvitations": { ".indexOn": ["expiresAt"] }
  }
}
```

Every pre-existing root and RTA child rule is structurally unchanged in this candidate. Existing user/Player ID, history, suggestions, friendship, invitation, presence, gameSessions and sessionPlay rules are preserved. The private namespace does not grant direct client access; the separately authorized backend uses its runtime identity.

**Important RTA conflict:** the cached local game rules differ from deployed rules at **41 semantic paths**. The preliminary count of 42 included an equal index array; the final semantic comparison excludes that formatting/comparison noise. Differences include local resolution/terminal/frozen-state rules that are not present in the live snapshot and changed multiplayer validation/write/read rules. They are unrelated game changes and must not be bundled into account testing. Do not deploy the local RTA file or emulator fixture as the production replacement.

The current account candidate has no sibling-rule conflict because it starts from the captured live rules and adds only the absent private namespace. Compatibility testing does not assert the local game's unrelated newer features are supported by the older deployed rules.

## Validation actually performed

The demo-only emulator suite was restarted with `RTA_RULES_PATH` pointing to the authenticated live backup. An equality assertion confirmed the loaded merged emulator rules exactly match the offline proposed production candidate. No test connected to the real database or Auth user pool.

- **47 unit/contract tests passed.**
- **25 emulator tests passed** against this actual-rule-based candidate, covering private client denial, cross-account protection, immutable identity/retry/collision, legacy RTA identity preservation, consent/eligibility, expiry/cleanup, kill switches and revoked/disabled credentials.
- Real browser + isolated SDK/emulator/backend registration, verification action, policy renewal, own-profile edits, session restoration, sign-out/re-login and recovery flow passed with no external network.
- Actual live account namespace remained absent and the live rules hash remained unchanged after testing. No real account or email-delivery claim is made.

Earlier full viewport/accessibility scans remain documented in Pass 004; no website presentation or account runtime source was changed in this inspection continuation. The local preview servers were restored; no staging or production host was changed.

## Exact changes proposed — all require later approval

Machine-readable review-only intent: `staging/live-inspection-proposal.review.json`. It is not consumed to activate the client/backend and grants no live authorization.

### 1. Billing and platform prerequisites

Obtain Executive Producer approval to attach the chosen billing account/enable Blaze and to enable exactly Cloud Functions, Cloud Build, Artifact Registry, Cloud Run, Eventarc and IAM APIs. Preserve already-enabled services. Include normal Google-managed service-identity provisioning associated with those approved APIs, and review the resulting bindings before service activation. No keys should be downloaded.

After API enablement is separately authorized and verified, repeat both Functions inventories and stop on any existing endpoint/name/codebase conflict before deploying. Existing Functions and their runtimes cannot yet be fully inventoried while their API is disabled. Do not claim that the name `lovelysirenAccountsApi` is free solely from today's 403 responses.

### 2. Email/password and password policy

Propose email configuration **enabled=true, passwordRequired=true** for the existing project, preserving Google sign-in and current duplicate-email/account behavior. Do not enable email-link, phone or anonymous sign-in. This is a shared Auth-project change and must be approved with RTA compatibility in mind.

Propose a cloud password policy of minimum15/maximum128, enforcement enabled, no mandatory character-class composition, and no forced upgrade of existing sign-ins. These values match the prepared company's local/backend rule; they are not active now. Validate supported console/Admin SDK settings and actual behavior under the approved change. Preserve enumeration protection, which is already enabled. [Firebase documents the supported policy controls](https://firebase.google.com/docs/auth/web/password-auth).

Preserve the existing default verification/reset handler and templates for the first test unless separately approved branding changes are requested. Expect the default project branding rather than assuming a new LovelySiren-branded mail stream is already configured. Pin action continue URLs to the actual approved staging account pages; do not send a reset or verification email during this inspection.

### 3. Dedicated runtime identity and named API

Propose service account `lovelysiren-accounts-test@road-trip-arcade.iam.gserviceaccount.com`, bound through the function's `serviceAccount` option, with no downloadable key and no Owner/Editor grant. A reviewable candidate custom runtime role is `projects/road-trip-arcade/roles/lovelysirenAccountTestRuntime` with:

- `firebaseauth.users.create`
- `firebaseauth.users.get`
- `firebasedatabase.instances.get`
- `firebasedatabase.instances.update`

Those permission names are supported by the inspected role metadata; real sufficiency for this runtime remains a controlled staging check. Do not silently widen permissions on failure. The candidate excludes Auth config/secret access, Auth user deletion and database create/delete/disable rights from the broad built-in admin roles. RTDB get/update privileges still have shared-database impact; IAM does not provide an account-path-only sandbox for this Admin SDK design. Namespace isolation also depends on reviewed backend paths, tests and private controls.

Keep named gen2 HTTPS function `lovelysirenAccountsApi`, codebase `lovelysiren-accounts`, us-central1, Node22, 256MiB, timeout30s, maxInstances2, minInstances0. No triggers, unrelated Functions, scheduler or deletion API. Only deploy the named reviewed function after inventory/name checks. Local tests still use Node24; verify Node22 build/runtime in approved staging.

### 4. Namespace and inactive configuration

Apply only the actual-backup-derived namespace fragment and four indexes after a fresh live-hash comparison. Abort if live rules changed; regenerate/review the candidate rather than overwriting concurrent RTA work. Preserve all existing game rule paths and records.

Create only the private controls required by this service, initially off. `staging/accounts-controls.review.json` remains off: service false, registration false, Google linking false, origins empty, approved policy false, actual published Terms ID/date/hash and Privacy null. The environment API gate remains unset/false until explicit controlled activation. No existing RTA identity/purchase record is migrated or assigned a company ID automatically.

### 5. HTTPS staging and origin

Propose the new **preview channel `lovelysiren-account-test` on the existing `road-trip-arcade` Hosting site**, with a seven-day expiry. The current live channel is not overwritten. This exact channel resource is absent today. Its hostname is assigned by Firebase only when an approved creation/deployment happens; no actual staging URL is fabricated now.

Bundle only public static account/site assets. Exclude work/backups, Git metadata, Functions, scripts/tests, node_modules, audit records, local environment files and review-only legal drafts. Reuse the verified ACTIVE project web app without adding Analytics or a competing identity system. Verify actual public client configuration/API restrictions when staging is prepared.

Record the generated HTTPS hostname before activation and add only that exact approved hostname to Firebase Auth's authorized domains, preserving the three existing entries. Set exact client/server Origin and email-return allowlists; no wildcard or unnecessary company production-domain activation. A preview URL remains public and is not authorization. [Firebase describes preview URLs as temporary publicly accessible URLs](https://firebase.google.com/docs/hosting/test-preview-deploy).

### 6. Policies and first invitation

Approve and publish the revised Website & Account Privacy Policy with its own version/date/hash before real consent. The old `/privacy.html` is still the October5 combined policy and RTA still links there; approve a transition that preserves access to current game disclosures rather than replacing them with website-only wording without a route to game disclosures. Website Terms `website-terms-v1.0` is already published and unchanged.

Only after all preceding checks/approvals: pin the actual published policy metadata, privately select the Executive Producer's email, check for an existing UID without migrating unrelated users, create the one authorized invitation (proposed24-hour window), then enable controlled gates for the agreed test. Keep public registration and website Google linking off. Do not merge accounts merely because emails match.

First test must prove real Firebase UID/company-ID binding, genuine verification email and action, verified profile access, edits/phone removal, session restoration, sign-out/re-login and genuine password reset. A second disposable account needs separate authorization for live cross-account/revocation checks. Real deletion/support handling and lawful retention decisions still need an approved procedure; the unfinished end-to-end deletion integration remains a game-release blocker.

## Approval boundary and current result

The authenticated inspection and rule backup are COMPLETE. The exact namespace candidate is prepared and locally tested. **Controlled real registration is still NOT READY**, because Privacy approval/publication, billing/API/provider/IAM/staging changes and explicit controlled deployment/activation approvals remain. Functions inventory is specifically blocked by the disabled API, not by the previous login problem.

Approval should be staged: first billing/API prerequisites (then repeat Functions inventory); then the named identity/function/rules/staging/provider settings; finally the exact generated origin, published policies and single invitation/window. A response approving only this inspection report does not authorize any of those live writes.

No production GitHub Pages change, live Firebase rule/provider/configuration update, billing attachment, real email, user migration, purchase change or public registration activation occurred in this continuation.
