# Account 004 — Privacy, Firebase Security and First Real Account Preparation

**October 30, 2026. IMPLEMENTED locally and TESTED IN EMULATOR; controlled real registration is BLOCKED. No production deployment, Privacy publication, live Firebase write, real account creation or real email-delivery test occurred. Public registration remains disabled.**

Development branch: `lsd-account-privacy-firebase-004`, starting from Account 003 `dc59bb6`. Production remains `a407de16f8885900d4f73907a496e51bac48b30f`. This handoff supplements the earlier 003/publication reports; historical draft statements in those reports are not current deployment claims.

## A. Privacy audit

The Producer's finding is confirmed: the live and main-branch `/privacy.html` still contain the October 5, 2026 combined app/services policy. The full website/account policy was prepared on Account Legal 003 under `drafts/website-privacy-approval.md` and `drafts/website-privacy-review.html`; it was NOT published under another tested URL, deployed separately or incorporated into main. All remote branch privacy-file listings, live HTTP statuses and source comparisons are recorded in `audit/account-004/production-verification.json`.

The 22-category inventory in `audit/account-004/privacy-data-inventory.md` covers every requested category: names/email/phone, transient DOB and adult result, Firebase and company IDs, Google/provider state, credentials/verification/recovery, sessions/profile/attempts, abuse counters and hashed identifiers, consent, support, analytics/advertising/storage and infrastructure logs/backups. Each row identifies source behavior, purpose, processing/storage/provider, access, retention/deletion and published-policy mismatch. It separates currently operational static hosting/support from development-only account services and unverified provider configuration.

Main gaps in the existing public policy: website email/password accounts, optional private unverified phone, minimized DOB handling, immutable company identity, private profile/state, policy history, invitations/reservations/grants, session persistence and actual closure limitations are insufficiently described. No website analytics/ad SDK was found or activated. Provider/hosting operational logs and privileged access cannot be inferred completely from source.

The full Website & Account Privacy draft was updated for incomplete registrations, durable reservation/orphan reconciliation and actual provider login-attempt processing (no custom login-history table). Both privacy drafts now have distinct explicit draft IDs/versions/status in local legal metadata and on review pages. Historical Integration 002 review pages are marked superseded so they cannot be mistaken for the canonical proposal or the published Terms. Public `privacy.html` is preserved byte-for-byte.

RTA audit: no complete standalone RTA policy was found in the reviewed website branches or tracked local RTA files. The game still links to the combined `/privacy.html`. A separate draft now exists at `drafts/road-trip-arcade-privacy-approval.md`, rendered at http://127.0.0.1:18765/drafts/road-trip-arcade-privacy-review.html. The proposed final `/games/road-trip-arcade-privacy.html` is NOT published or activated. Existing disclosures have not disappeared.

The RTA draft is grounded in read-only source at game commit `93a58797de4385af2a5d994468ef057592709a11`: guest/local saves, Google/Firebase identity/Player IDs, cloud history/suggestions, friends/private sessions and appropriate shared lookup data, Android rewarded AdMob settings, technical/provider data, retention and deletion. It explicitly flags unresolved release configuration: banner is currently a preview, billing adapter is not live, entitlement enforcement is false, and complete game-specific age/audience/consent/deletion safeguards are not verified. An unused WebRTC helper is not described as an active network flow. No RTA gameplay code was modified. Source hashes and unchanged tracked status are in `rta-source-evidence.json`.

Review the two full drafts locally:

- Website/account: http://127.0.0.1:18765/drafts/website-privacy-review.html
- RTA: http://127.0.0.1:18765/drafts/road-trip-arcade-privacy-review.html

Neither draft is operative or acceptable as real registration consent. RTA release needs approved standalone public/in-game/store links and a checked Data Safety/audience declaration. Supplier guidance is cited narrowly in the inventory; no SDK/version/settings or legal-compliance guarantee was invented.

## B. Retention and cleanup

`audit/account-004/retention-and-cleanup.md` gives the full proposed schedule, current behavior, closure dependencies and approval decisions. It distinguishes permanent/durable mappings and active profiles from expiring capabilities, security counters, consent evidence, reservations, external Auth/logs/support and legally retained records. It does not invent a mandatory or permanent retention period for regulated/durable records.

The existing 15-minute registration and five-minute linking authorization lifetimes are retained. Expired or malformed/missing expiry records fail closed in capability validation before cleanup. A proposed 24-hour first-test invitation window and hourly bounded temporary cleanup are review suggestions, not activated policies/jobs. Physical cleanup delay does not extend authorization.

Safe corrections:

- Replaced query-then-bulk-delete with bounded per-record transactions that recheck current expiry. A concurrently renewed invitation/counter survives a stale scan.
- Kept dry-run default and fixed allowlist of four temporary groups. Default cap100/group (400 total), hard max500/group; invalid options rejected before database access.
- Made partial failure/retry idempotent, without touching identity/profile/history/reservation/control or RTA/purchase paths. Cold transaction cache misses are handled through server compare-and-swap rather than incorrectly aborting deletion.
- Left malformed/unindexed records for authorized inspection rather than deleting unknown data. Capability validation does not authorize them.

No scheduled cleanup function or cloud trigger was created/deployed. A scheduler, durable retention periods, manual closure protocol, log/backup rules and post-test orphan reconciliation all need operational/Executive Producer approval.

## C. Policies and eligibility

Full version matrix: `audit/account-004/policy-version-matrix.md`.

- Published Website Terms: 1.0, October 28, 2026, `website-terms-v1.0`, source SHA-256 `963bac3c70804f34e9aa184149b46c714d720e37ba6181529744d7d465ef44de`. Main, live page, source/archive and registry agree.
- Current combined Privacy: October 5, no stable approved company-account version identifier. It cannot silently serve as approved consent to the new account processing.
- Website Privacy proposal: draft1.0 / `website-privacy-v1.0`, no effective date/publication approval.
- RTA Privacy proposal: draft1.0 / `rta-privacy-v1.0`, no effective date/publication approval; separate from RTA Terms and website consent.
- Local client now pins actual published Terms ID while Privacy version remains null/approval false. Reviewed backend/client templates in `staging/` are entirely inactive; the offline invitation-plan helper uses those controls, avoiding stale duplicate versions.

Server checks independently enforce current approved website-kind versions/hashes, valid nonfuture calendar dates, exact consent, URLs and trusted acceptance time. February 31 and malformed metadata are rejected. Real runtime rejects draft/game/emulator fixtures. Existing unchecked registration/renewal checkboxes and exact reviewed-version submission remain; stale or missing consent is denied and history/immutable ID preserved. Published Terms alone do not open registration.

18+ DOB-first screening remains neutral, authoritative on the server and repeated at preparation. Invalid/future/minor dates cannot create a permanent company ID or protected profile. Only adult-category result is retained; complete DOB/exact age are not written into grants/profiles/history. This does not alter the game's guest or ad-age systems. No child/parent-managed accounts were added.

The registration-only kill switch now covers prepare, provision AND completion, including outstanding grants. Existing verified profile reads need not be interrupted by closing registration; the broader service/API gates can disable the whole new service. Unknown Firebase credentials do not get a company profile/ID merely by signing in.

## D. Firebase review

**BLOCKED: no active Firebase CLI default session.** The project-list attempt did not authenticate, a bounded retry timed out, and the credential-aware read-only helper independently reported `interactive-cli-login-required` without displaying credentials. The Executive Producer was asked to authenticate privately. No real project/user/provider settings were changed or customer records enumerated.

Actual live providers, authorized domains, mail templates/sender/delivery, password policy, enumeration protection, deployed Functions/runtime, rules, IAM, billing/quota prerequisites, log/backup settings, Hosting sites and trusted controls remain UNVERIFIED. The Firebase project/database identity is established in local RTA/website source, not claimed authenticated from cloud. A cached local rules file is NOT a live backup.

Prepared tools:

- `scripts/firebase-readonly-review.cjs`: reads allowlisted metadata endpoints using the existing CLI-managed session; first backs up actual deployed rules with project/database/time/hash if authorized; sanitized summaries only. Raw provider secrets, IAM principal lists and tokens are not printed. Private results/backups stay under ignored `work/firebase-review-004/`.
- `scripts/prepare-account-rules-review.cjs`: requires the genuine live-backup manifest/hash; rejects inherited root grants/conflicting namespace/unexpected patch; prepares only an offline namespace delta and expiry indexes while preserving unrelated paths. It does not deploy.
- Existing named-function configuration and inactive `staging/*.review.json` pin safe gates and actual Terms metadata; unverified Privacy/app/origin/endpoint values remain unset.

Because no deployed-rules backup exists yet, no actual live rules candidate has been generated or proposed as ready to deploy. The existing namespace fragment is a design/local test artifact only. The helper's safety guards were tested with fixtures. No provider/IAM/billing changes are guessed or applied.

Local compatibility tests combine the READ-ONLY existing RTA rules with the private namespace and preserve RTA identity/purchase sentinels. Shared-project admin/IAM/Auth/quota risk remains: invitation checks protect company ID/profile authorization but do not independently stop all direct provider Auth credential creation if the existing provider allows it. Do not globally change RTA sign-in as a shortcut.

## E. Actual tests and limitations

- 47 unit/contract tests passed, including published Terms alignment, draft/privacy gate, strict dates, source preservation/archive behavior, privacy separation, read-only endpoint/redaction guards, rule-patch inherited-grant protection, transport/session/consent/error behavior and invalid cleanup options.
- 25 actual emulator tests passed (24 scenarios plus parent), covering invited registration, concurrent immutable allocation/retry/collision, existing RTA UID preservation, verified-only access, cross-account and direct-rule denial, password reset, provider conflicts, strict capability expiry before cleanup, registration kill switch, bounded dry-run cleanup, idempotent partial-failure retry, renewed-invitation race, preservation of permanent records/purchases and revoked/disabled credential denial. Synthetic malformed expiry records are denied for use and retained for safe inspection.
- Real browser/SDK/emulator/backend flow passed: age-first rejection/permitted registration, synthetic verification action, own profile, policy renewal, reload, optional phone/name edit, sign-out/re-login and recovery request, with no external network. No genuine email delivery was tested or claimed.
- 30 account-page and 30 legal-page viewport/accessibility scans passed at 320, 375, 768, 1024, 1440; keyboard TOC/menu/links, error labels, closed registration and separate noindex nonoperative drafts verified. Old public Privacy remains available; the future RTA privacy operative path remains absent. No default external requests or JavaScript errors.
- Existing isolated browser state regression passed. Site regression passed nine URLs, 227 local links/resources, six widths and dropdown/Escape/mobile behavior; RTA artwork/gallery/accessibility passed all five requested widths.
- Local Windows runner PATH casing/node discovery corrected. A bounded60s emulator function-discovery allowance handles slow cold imports, using the supported CLI setting; production function timeout is unchanged. Tests run host Node24 while deployment target is Node22; target-runtime verification remains a staging requirement.
- Initial cleanup failures found during emulator validation were fixed (transaction cold-cache handling). Final suites have no outstanding local failures. The remaining failures are access/deployment prerequisites, not hidden passing production tests.

No newly generated image or gameplay change occurred. Common styles, hero, mascot, RTA visuals/content, navigation/footer, published Privacy/Support/Deletion/CNAME and published Terms/source remain preserved. Draft legal generation adds review metadata only.

## F. First real account — explicit answers

1. **Ready? No.** Local code/tests are ready for review, not a live first registration.
2. **Exact blockers:** Website & Account Privacy approval/publication and operational retention/deletion handling; interactive Firebase authentication and live inventory/rules backup; actual reviewed namespace/IAM/provider/mail/domain/billing/staging configuration; explicit controlled deployment approval and verification.
3. **What Firebase settings must change?** Deploy the named new API/private namespace/config only after live comparison. Exact provider/domain/password/email/IAM/billing deltas cannot be responsibly specified as factual changes until inspection; preserve existing RTA settings. Start all new gates off. Pin actual published policy IDs/date/hashes, exact staging origin and returned function URL. Create only the approved invitation inside the agreed window.
4. **What needs approval?** The scoped function/rules/config/HTTPS staging deployment; any provider/domain/IAM/billing changes demonstrated necessary; policy publication; operational retention/cleanup and real test invitation/account. Public registration, RTA migrations/entitlements, Google linking and scheduler/deletion deployment are excluded.
5. **What must the Executive Producer supply?** Private local CLI login, final policy/operating decisions, selected test email through an approved private channel, exact-scope deployment approval and private browser-entered credentials. Never provide passwords/tokens/keys in chat or committed files.
6. **Test URL?** No real HTTPS staging URL exists/has been assigned in this pass. It must be chosen from inspected/approved Hosting options and recorded before approval. http://127.0.0.1:18766/account/create.html is emulator-only. http://127.0.0.1:18765/ remains the normal closed development preview.
7. **Steps?** After approvals: open exact approved HTTPS staging page; pass DOB screen; enter name/email/optional phone/private password/invitation; affirm published website policies; submit; privately confirm actual Auth UID and company ID; receive/follow REAL verification email; verify protected access; edit profile; reload; sign out/in; verify unchanged ID; complete REAL reset email; run authorized second-account separation and revoked/disabled checks. Google tests wait for separate approval. No account/email success is claimed before these live steps.

## Exact deployment approval request and deletion dependencies

The complete reviewable scope, unresolved bindings, monitoring, kill switch, rollback and closure integration checklist are in `audit/account-004/controlled-test-and-deletion.md`. The later approval request is limited to `lovelysirenAccountsApi` in project `road-trip-arcade` and `lovelySirenAccountsV1`, one Executive Producer invitation and a verified HTTPS staging origin, with email/password/verified own-profile operations and actual published website consent. Attach the real inventory/rules diff/staging URL/policy version before executing it. Do not treat this document or a reply to the CLI-login question as deployment authorization.

Critical game-release blocker remains the separate complete company/game deletion workflow. Disabling Auth is not deletion; permanent mappings, game Player IDs, shared sessions, purchases, history, local caches, legal holds and backups need coordinated handling. Existing signed-out request information stays accessible. No deletion rewrite or fake success button was introduced.

## G. Source control and status

Branch: `lsd-account-privacy-firebase-004`. Commit SHA and full changed-file list are attached to the delivered report and visible in GitHub. No merge/push to main and no production/Firebase deployment occurred. User-facing policy previews remain local review drafts.

Status summary:

| Area | Status |
| --- | --- |
| Data inventory, policy drafts, retention/controlled-deployment/deletion handoff, safe code corrections | IMPLEMENTED |
| Account/identity/privacy/cleanup/revocation tests | TESTED IN EMULATOR |
| Published Terms and old Privacy verification | Verified on main and public HTTPS website |
| Firebase cloud configuration/rules backup | BLOCKED — interactive CLI login required |
| Controlled account staging | NOT DEPLOYED TO STAGING |
| Published Terms from earlier authorized pass | LIVE IN PRODUCTION, unchanged |
| Revised Privacy policies / account API / public registration | NOT LIVE IN PRODUCTION; registration disabled |
