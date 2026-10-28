# Account Legal 003 — content review and controlled test handoff

Status as of October 28, 2026: IMPLEMENTED and TESTED LOCALLY. NOT DEPLOYED TO STAGING. NOT LIVE IN PRODUCTION. Public registration remains disabled. No live Firebase settings, rules, functions, users or purchases were changed.

Branch: `lsd-account-legal-003`, based on `0a4a7b54522b434899a9ff0964053bab1549d7a4`. Production remains `8c18fc4ff20d660051a8a8b0c07219b7b4a6839a`.

## Review pages and version status

| Document | Local Chrome preview | Status |
| --- | --- | --- |
| Website Terms | http://127.0.0.1:18765/terms.html | Version 1.0 / `website-terms-v1.0`; content approval pending; no effective date yet |
| Website Terms history | http://127.0.0.1:18765/legal/website-terms/index.html | No published versions yet; candidate archive prepared |
| Website Privacy proposal | http://127.0.0.1:18765/drafts/website-privacy-review.html | Full replacement draft for approval; published Privacy unchanged |
| RTA Terms | http://127.0.0.1:18765/drafts/road-trip-arcade-terms-review.html | Version 1.0 / `rta-terms-v1.0`; separate release review; not operative |

Intended final Website Terms URL: https://lovelysirendigital.com/terms.html. It has NOT been published by this pass. The actual publication date will be assigned only when the approved version is published; no backdated effective date has been invented. Future RTA URL: https://lovelysirendigital.com/games/road-trip-arcade-terms.html; deliberately not activated.

## Website Terms review

All 26 supplied sections and their substantive wording are preserved. The only source-document change is the explicitly approved full business mailing address in section 26. The untouched supplied documents are retained alongside the canonical sources for comparison. No LLC or corporation designation was added.

Review findings for the Executive Producer:

1. The effective date is the only explicit publication placeholder. It will be replaced with the actual approved publication date, version 1.0 retained, and the dated source/hash/HTML archived.
2. Section 1 identifies the registered trade name, not the proprietor personally. Virginia's assumed-name statute requires registration of a fictitious name; the SCC explains that an individual can conduct business under one and that an LLC/Corp suffix is not required. Those sources do not settle whether this particular consumer contract should additionally name the proprietor. Please confirm the correct contracting-party description against the registration and obtain appropriate legal review if needed. No personal name was guessed. Sources: [Virginia Code §59.1-69](https://law.lis.virginia.gov/vacode/title59.1/chapter5/section59.1-69/), [Virginia SCC fictitious-name guidance](https://www.scc.virginia.gov/businesses/business-faqs/fictitious-names/).
3. Section 3's independent account rule is now approved at 18+. It is separate from RTA guest gameplay and children's advertising/privacy safeguards. No child or parent-managed account system was introduced.
4. Sections 4–7 describe supported/authorized account functionality, not a promise that account services are currently available. The development pages clearly show their status; the legal-only publication must preserve production's unavailable sign-in presentation. Purchases and game entitlements are not yet attached to website accounts.
5. Section 8 allows necessary account communications. Verification/reset have been tested only with synthetic emulator action links. Real delivery, security-alert operations and material-policy notification procedures still need an operator-approved production plan. No automatic notification service is claimed to be running.
6. Website advertising and affiliate wording in section 11 permits potential activity; the reviewed website currently loads no advertising or analytics SDK. Do not carry app/AdMob processing into a website policy as if the website currently performs it.
7. Section 17 accurately permits a verified support request when automated deletion is unavailable. The existing deletion page currently provides the contact email and says detailed app instructions will be available before release. There is no implemented automatic company-account deletion. Establish a verified manual handling procedure for any controlled real test and complete the separate end-to-end deletion work before RTA release.
8. Sections 20–25 retain consumer-rights savings clauses, non-retroactivity, no mandatory arbitration/class-action waiver, and Virginia law subject to mandatory protections. No additional waivers or liability promises were inserted. This implementation review is not a legal enforceability opinion.

Final content approval is still needed because Task 003 calls the supplied text an authoritative draft and section 14 authorizes publication only after final content review. The review is concrete: the full local page, source, version identifier, approved address and these findings are ready.

## Website Privacy review

The October 5 published policy describes applications and RTA services; it is insufficient as the account-specific policy for opening company registration. It does not adequately describe display names, optional private/unverified phone numbers, transient DOB screening, permanent company identity mappings, server policy histories, controlled invitations/grants, session persistence or the website's actual deletion limitations.

`drafts/website-privacy-approval.md` is a full proposed Website Privacy Policy, rendered for review. It separates currently closed account services from enabled services, website processing from games, support/GitHub hosting from Firebase, and actual website behavior from future ads/analytics. It documents transient password handling through the controlled provisioning API, no profile password/DOB storage, adult eligibility only, no marketing/SMS consent, Google disabled, optional phone not used for recovery, server acceptance versions/hashes/time and the absence of automated deletion.

Approval decisions still required: the policy's final wording/effective date, real deployed provider/configuration details, operational retention schedule (including reservations, durable identities, logs and backups), a verified support/deletion process, material-policy notice procedure and applicable privacy-rights response procedure. The proposal explicitly does not invent fixed retention, absolute security, recovery or deletion guarantees. Some draft language calls out operational work still pending; resolve these points before approving it for publication or opening real registration.

VCDPA applicability must be assessed from actual processing/revenue and statutory exceptions; a Virginia address alone is insufficient. The statute includes thresholds of 100,000 consumers, or 25,000 plus over 50% of gross revenue from personal-data sales. We have not established those facts or claimed automatic applicability. [Virginia Consumer Data Protection Act, §59.1-576](https://law.lis.virginia.gov/vacodefull/title59.1/chapter53/).

No substantive changes were made to `privacy.html`, `support.html` or `delete-account.html`.

## RTA release review and Privacy changes

All 32 supplied RTA sections and the Free/Base content tables are preserved, with the same approved contact-address substitution. The draft uses supplied released-product wording rather than weakening launch features to “planned” promises. The review banner makes clear that this is proposed release configuration, not an operative agreement. It is not linked as the game's live Terms or used for website acceptance.

Before game release, verify against the actual build and store configuration:

- All seven games; Free libraries/allowances and rewarded-ad extensions: Scavenger Hunt and Bingo 50 / 4 per day; License Plate Hunt all 50 states / 2 trips; 20 Questions 50 / 5; ABC's 50 / 5; Music Wheel 40 / 5; Roadblock 500 words / 5.
- Base libraries: 106 for Scavenger/Bingo, all 50 states, 200 for 20 Questions, 100 for ABC's, 84 for Music Wheel, 2,500 Roadblock words and Base rescue without a rewarded video. Unlimited normal Base gameplay; no standard banners or routine rewarded-video requirements.
- One-time Base unlock target U.S. $6.99, actual localized Google Play configuration, no subscription, restoration behavior, refunds/platform obligations and durable ownership. Future standard Base library additions included; optional Theme Packs separate; no invented addition schedule.
- Actual supported private multiplayer games, seed behavior, no public matchmaking/chat, connectivity/offline limitations and driver-safe verbal-only participation.
- Company account integration versus guest data, verification/age restrictions, separate game consent, actual SDKs/identifiers, purchase tokens/records and data flows. No website-auth code should silently change the game's identity, purchases or guest access.
- Update the game's separate Privacy disclosures for AdMob/rewarded advertising, age/audience settings and child safeguards, Google Play/Firebase/Sign-in use, diagnostics actually shipped, multiplayer/session retention, local-device data, account linking and recovery, purchase data, deletion/retention and applicable rights. Verify behavior against the store Data Safety and Families declarations. Website 18+ registration is not a substitute for game child-privacy obligations.
- Complete and test the company-account/game-data deletion dependencies before release; disclose effects on player IDs, immutable company identity mappings, purchases/restoration, retained transaction/security records and backups. Do not change RTA deletion in this pass.

No game-build/store/SDK release audit was performed here. These are unresolved release gates, not verified launch claims.

## Age and acceptance implementation

- A neutral DOB-only step precedes name/email/phone/password collection in the enabled test flow. It permits dates of any age and sends no unrelated account fields. Its server endpoint returns an eligibility decision and only writes expiring abuse counters; no Auth account or ID is created.
- Authoritative age validation runs again during registration preparation. The account rule uses the server's UTC date. Ineligible applicants receive a neutral non-success message. The backend stores `ageCategory: adult`, never complete DOB or exact age.
- The existing checkbox remains unchecked and required. In default configuration it is disabled, with direct links to the marked Website Terms candidate and the unchanged actual Privacy page. No agreement is recorded while registration is closed.
- The backend requires approved, published website-specific Terms and Privacy metadata with exact configured version, effective date, URL and SHA-256. Draft, future, missing, mismatched and RTA document metadata are rejected. Provisioning and completion recheck current versions/hashes, so a previously issued grant cannot authorize registration against superseded policies.
- Backend acceptance records use trusted versions/hashes/time. They contain no RTA acceptance. `requiresReacceptance` gates protected profile operations; a verified account can review the current published documents and explicitly accept their exact reviewed versions in Account Settings. Older history remains, and the permanent ID is unchanged. If the configured version changes again before submission, the server rejects the stale consent rather than substituting an unseen version.
- Local tests use separately identified synthetic policy fixtures, permitted only in the demo emulator runtime. They do not record agreement to the supplied drafts. Production rejects fixture status.
- Default settings remain `enabled: false`, `registrationEnabled: false`, mode `closed`, Google disabled, policy approval false and versions null. Only the independent 18+ eligibility approval flag is now true.

## Version/archive workflow and legal-only publication scope

`legal/policy-versions.json` holds review status, independent identifiers, hashes and effective dates. `legal/sources/` preserves the original supplied documents. `legal/website-terms/v1.0/` contains the canonical candidate and HTML archive. The generator rejects modification of an already published version; future changes require a new version/source/archive entry.

After explicit content approval, use `scripts/prepare-website-terms-publication.cjs` with the actual publication date and approved review SHA-256. It prepares local dated files only; it does not push or deploy. The publication transition and immutable-archive rejection were tested in an isolated ignored copy, leaving the real candidate in review status.

IMPORTANT: this branch includes Framework 001/Integration 002 account work. Do NOT merge this whole branch into main to publish legal documents. Prepare a legal-only branch from current `origin/main` containing only approved Website Terms HTML/CSS/source/history and links in the existing production navigation/account information pages. Generate using `LEGAL_HEADER_REF=origin/main` so the new Terms page preserves production's current unavailable-account header; do not copy development registration links into it. Keep the homepage hero, RTA content/art, existing Privacy, Support, Deletion, CNAME and all auth functionality unchanged. Do not include RTA Terms or Privacy proposals as operative policies. Run the site/legal link checks on that exact publication branch, use a normal merge, then verify the live URL and date/version/HTTPS. That publication has not been attempted pending content approval.

## Firebase inspection findings

The read-only command `firebase projects:list --json` failed: “Failed to authenticate, have you run firebase login?” No real credentials were requested or exposed. Therefore deployed providers, domains, password policy, enumeration protection, email settings, database rules, Functions, IAM, billing, runtime/configuration and retention settings are UNVERIFIED. The actual deployed rules have NOT been backed up. Local RTA rules used by emulator tests are not a deployed-rules backup.

The Executive Producer may run interactive `firebase login` locally, then notify the developer to repeat read-only inspection. Do not paste a token, service-account key or password into chat. Before any live rule proposal, export the ACTUAL deployed rules, record project/database/timestamp/hash and keep a private backup; compare the full deployed snapshot to the proposed namespace-only merge. Abort if ancestors permit broad reads/writes that would defeat the child denial, or if unrelated paths change.

## Exact controlled deployment scope for later approval

Nothing below is approved or deployed merely by inclusion in this plan. Confirm actual inspection results and provide the exact diff, permissions and staging URL before approval:

1. Existing Firebase project `road-trip-arcade`; one named HTTPS function `lovelysirenAccountsApi`, codebase `lovelysiren-accounts`, us-central1, 256 MiB, 30-second timeout, at most two instances. Deploy only that named function, never an unscoped Functions deployment that could remove unrelated RTA functions. Confirm actual database URL, Node 22 support, service-account role needs, billing/quotas and API exposure before execution.
2. Existing RTDB, only `lovelySirenAccountsV1`. Start from the actual backed-up rules and merge the deny-client namespace plus four expiry indexes. Never deploy the emulator root rules or rewrite legacy `users`, `playerIds`, `playerIdClaims`, game data or purchases. Firebase Admin bypasses client rules, so review server paths and least-privilege IAM explicitly.
3. Trusted server config starts off. Later set `ACCOUNT_TEST_API_ENABLED`, service gate, controlled-test mode, exact approved HTTPS staging origin and invitation-only registration gate only within the approved test window. Google linking stays off. Populate exact published Website Terms/Privacy versions, effective dates, canonical URLs and content hashes; never copy emulator fixture metadata or accept drafts.
4. Serve account UI from a dedicated approved HTTPS staging site. GitHub Pages/custom-domain production hosting remains unchanged. A preview URL is not access control; CORS is not authorization. Invites and server checks remain mandatory.
5. Authorize only the Executive Producer's email as the first test invitation; short expiry and a random 256-bit invitation secret delivered privately, never committed. Inspect for an existing Auth UID first to avoid duplicate identities. Do not silently reconcile any existing RTA user. The offline plan helper writes an inactive review plan into ignored `work/` and makes no Firebase calls.
6. Review email/password provider state, authorized/continue domains, password policy and enumeration protection. Any provider/domain/policy change is shared-project scope and requires separate explicit approval; do not globally disable existing RTA sign-in. Check verification/reset templates, sender/reply-to and real deliverability privately. Google linking requires its own approved OAuth/provider-conflict test later.
7. Account operations are limited to controlled registration, verification authorization, own-profile view/edit, version-aware policy acceptance and the existing disabled-by-default Google-link boundary. No purchase/entitlement migration, public registration, private admin UI or fake Delete Account button.
8. Approve retention and cleanup operations before inserting real personal data. Temporary grants expire at 15 minutes, link grants at 5 minutes; expiration is not deletion. Review bounded cleanup dry-run output before applying; no deployed scheduler exists. Durable profiles, identity mappings, reservations and policy history need a separate retention/deletion decision. Infrastructure logs/backups must also be assessed.
9. Monitor function failures, denied requests/rate limits, invitation usage, Auth creation, namespace writes, email delivery and cost. Do not log raw passwords, DOB, tokens, invitation secrets or request bodies. Define an operator and test window before activation.
10. Roll back by disabling the namespace service/registration gates and API environment gate, disabling outstanding invitations, and restoring staging to closed configuration. Verify denial. Use the backed-up rules and prior named-function revision if rollback is needed; do not delete an entire project/database or roll back RTA data. Retain a secure audit of test UIDs/IDs and request consent for later test-account cleanup.

Shared-project risk requiring explicit acceptance: invitations prevent creation of LovelySiren profiles/IDs and protect account API access, but do not by themselves prevent direct credential creation through Firebase's public Auth API when a provider permits it. CORS does not solve this. Inspect the current provider/Identity Platform protections and decide on compatible server-side signup controls before claiming Auth-level invitation-only creation. Any blocking function/provider change could affect RTA and needs separate review. A private website namespace also does not isolate project-wide quotas, billing or privileged IAM from the game.

## First real account readiness and exact next actions

Real test registration is NOT READY. No real verification or reset email was sent by this pass.

1. Review the local Website Terms and the contracting-party/contact finding; approve final content for legal-only publication or provide edits. The actual publication date is set at that time.
2. Review/resolve the full Website Privacy proposal and operational retention/deletion/rights/notification decisions; separately approve publication. Website Terms publication alone does not open registration.
3. Authenticate interactively to Firebase, then permit the read-only inventory and deployed-rules backup. Supply no secrets to the developer/chat.
4. Review the resulting exact function/rules/IAM/provider/domain/config/staging changes and shared-project risks above; explicitly approve only the agreed controlled scope. Public registration remains closed.
5. After staging, policies and backend configuration pass verification, enter your own private credentials in the approved browser form. Test real inbox verification, verified sign-in, ID display, name/optional-phone edits, reload, sign-out/re-login, real password reset and unchanged ID. Use only the authorized test account. Google linking follows later approval. Document verified manual deletion handling; finish the separate deletion backend before game release.

## Validation and preserved work

- 43 unit/contract tests passed, including exact age boundary, leap dates, draft/game/fixture rejection, exact supplied legal-content preservation, server acceptance data, stale-reviewed-version handling, closed defaults, dated publication and immutable archives.
- 20 actual Firebase emulator tests passed (19 scenarios plus parent), including age-only screening, draft rejection before provisioning, renewed policy acceptance/history, concurrent IDs, cross-account denial, direct rules denial, recovery, conflicts and unchanged RTA sentinel records.
- Real browser + local SDK/emulator/backend flow passed: ineligible age screen, permitted invitation, credentials, verification action, session persistence, policy renewal UI, profile edits, sign-out/re-login and recovery request. These were synthetic local accounts and action links, not real email delivery.
- 25 legal-page scans: five pages at 320, 375, 768, 1024, 1440; no horizontal overflow or automated WCAG A/AA violations. All 26/32 section headings preserved, TOC keyboard/anchor checks, six account Terms navigation paths, unchecked/closed consent and review-only RTA status passed. Desktop/mobile screenshots were visually inspected.
- 30 account-page scans at those same widths passed; no default external requests or JavaScript errors. Existing state-fixture regression passed.
- Site regression: nine URLs and 227 local link/resource checks, dropdown keyboard/Escape/focus/mobile behavior and six widths passed. RTA gallery/images/accessibility regression passed at all five requested widths.
- Homepage hero, mascot, RTA content/artwork/pricing, shared main stylesheet, CNAME, live Privacy/Support/Deletion resources and game repository unchanged. Only existing Information Terms placeholders were linked on the development pages; production has not changed.
- No live Functions/rules/provider deployment, real account creation, RTA data migration, purchase change, production merge or deployment occurred.
