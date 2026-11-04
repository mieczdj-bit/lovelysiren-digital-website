# LovelySiren Digital — Internal Privacy, Retention & Support Procedure

**Operational document, not a public Privacy Policy.**  
**Version:** 1.0 proposed  
**Owner:** Executive Producer or an expressly designated human operator  
**Status:** FOR EXECUTIVE PRODUCER ADOPTION; not an assertion that all automation currently exists.

## A. Operating principles

1. Collect only data needed for an active feature. Keep the company's `lsid_` distinct from Firebase UID, RTA Player ID, product-local SQL identity and purchase ownership.
2. Treat a customer's identity, a purchase, a game account, a company account and a device as separate claims requiring the appropriate independent proof. No email-only identity merging or ownership transfer.
3. Default email/SMS/postal promotional settings to **off**; consent for one channel never activates another. No promotional sender until unsubscribe/suppression and necessary channel-specific safeguards are functioning.
4. Do not use a privacy notice as evidence that a backend operation exists. Never claim deletion, refund, recovery, ownership transfer, or verified account closure until the relevant operation and records are independently confirmed.
5. Limit access to the human operator and specifically authorized backend services, using the minimum needed permissions. Do not email passwords, private keys, one-time codes or full payment credentials. Never put real personal data, private rule backups, customer correspondence or credentials in Git.
6. Review applicable law, holds, provider settings and actual release code before imposing deletion or retention actions. Preserve unresolved operations rather than guessing their outcome.

## B. Data inventory and working review schedule

These are **proposed business review targets** for a low-volume launch, not statutory claims and not automatic deletion promises. The operator adopts or revises them before collecting real customer data. A "review" means assess purpose, lawful basis, current status, holds, necessary evidence and safe deletion ability; it does not authorize blind removal.

| Data class | Minimum / reason | Working review trigger | Custodian and action |
|---|---|---|---|
| Active LovelySiren Account | Firebase Auth UID/email, `lsid_`, chosen display name, adult result, status and necessary times | Account change; verified privacy request; annual purpose review | Company-account operator; erase unnecessary optional fields, preserve verified ownership and active entitlements |
| Optional phone / mailing address | Only if voluntarily supplied for a currently disclosed purpose | On edit/withdrawal; at each annual account review | Company-account operator; remove from active profile when supported, reconcile consent eligibility |
| Permanent identity mapping / non-reassignment marker | Minimum UID↔`lsid_` and necessary status linkage | On verified closure; after product ownership disputes/holds settle | Company-account operator; minimize only through an approved, product-aware process; never recycle an ID |
| Adult eligibility | Retain adult/not-eligible outcome rather than full DOB | When eligibility state no longer needed; closure | Company-account operator; do not persist unnecessary birth dates |
| Terms/Privacy acceptance | Document version, content digest, server acceptance time and necessary account reference | Policy renewal; verified closure; dispute/hold expiration | Company-account operator; review whether minimized evidence must remain |
| Invitations, grants, reservations | Short-lived authorization hashes, bound subject, expiry/state | Expiry; weekly queue inspection during controlled tests; 30-day post-resolution removal review | Company-account operator; reconcile unknown provisioning before deletion; existing 15-min grant expiry is NOT data erasure |
| Unverified/incomplete Firebase Auth identities | Minimum record to reconcile an attempted registration | 30 days after a failed/incomplete enrollment, then recurrent review | Company-account operator; only delete after exact UID and RTA ownership inventory prove the operation is safe |
| Abuse/rate-limit records | Expiring keyed counters and sanitized event facts | Weekly exception check; 90-day routine review for settled nonessential evidence | Security/operator; preserve active incidents and provider-required evidence |
| Support correspondence | Necessary request/contact/message and minimal case disposition | On case closure; 12-month review after closure | Support operator; remove unneeded details/attachments and apply holds. Gmail/provider retention may differ |
| Account-access/privacy request cases | Verified request scope, opaque case ID, minimal authorization and action receipts | When completed; 24-month evidence review | Support/operator; minimize contact data after required review/hold ends |
| Marketing consent / suppression | Channel, wording version, selection/withdrawal time, minimal destination linkage | On withdrawal/destination change; annual review; 24-month review after last activity | Marketing operator; no sending until suppression provider and audience exclusions work |
| Contact-form anti-abuse/delivery states | Keyed request/rate-limit IDs, timestamps, acceptance/retry state, no duplicate message body | Weekly inspection of unresolved deliveries; 30-day review of settled metadata | Support/operator; resolve uncertain provider acceptance before removing retry evidence |
| RTA game state, player/friend/session records | Feature-required data tied to authenticated product identifiers | Session completion, saved-game expiration, owner request, published child-data schedule | RTA product operator; verify current path/class and authority before a product delete |
| RTA purchase/entitlement evidence | Minimum store/transaction proof needed for entitlement, refund, fraud or dispute handling | Refund/ownership change; relevant legal/platform review | RTA product operator; no automatic transfer or blanket purge |
| Provider logs and backups | Service-generated records necessary for security/recovery | Document each provider's actual defaults at activation; quarterly configuration/access review | Human operator; record retention, access and restoration behavior; no promise of instant backup purging |
| Deletion operations / tombstones | Minimal verified owner/scope, operation ID, effect status, proof/hold and necessary timestamps | Each unresolved effect until resolved; annual post-completion review | Product/company deletion operator; no terminal status without independent proof |

**Children's information:** If a parent reports a child's information or the operator detects child personal information in a support message that was not needed, restrict access and unrelated use immediately. Seek only the minimum data needed to respond or verify parental authority. Review for deletion promptly; target resolution or a documented exception within **30 days of case closure**. For child-directed game features, a specific retention timeframe by data class must be set and published before the feature launches, rather than assuming the general adult-account schedule applies.

## C. Support mailbox and privacy request handling

**Contact:** `lovelysirenstudios@gmail.com`. A public Contact Us form is not an approved identity-verification channel. When Resend/Turnstile are activated later, update the actual provider and subprocessors in the public policy first.

1. **Intake.** Create a private case reference and note the received date, request type, product scope (RTA, company, both, or other), known user-supplied identifier, necessary communications and due/review date. Do not paste support mail into Git or public issues.
2. **Acknowledge and triage.** Aim to review new privacy/deletion messages within two business days while the studio is low-volume. This is an internal service target, not a statement of a universal legal deadline. Track legally required deadlines separately when applicable.
3. **Verify.** For sensitive account changes, prefer recent authenticated ownership of the exact Firebase UID and relevant product identity. For a lost-account case, use a carefully documented alternate proof process and human review. An email address, Player ID, receipt screenshot, or possession of a company ID alone is not sufficient to bind another person's data. Never request password, one-time code, raw Google Play purchase token or complete card number.
4. **Determine scope.** Distinguish company-account data, RTA product/game records, local-device data, marketing preferences, and external provider/transaction records. Identify whether a child or parent request requires special handling. Check for pending operations/holds and for account-provider conflicts.
5. **Act only with trusted authority.** Access, correction, export, deletion or disablement requires approved product/company service mechanisms. Where the necessary trusted RTA inventory/fence/deletion API is absent, keep the request open and report the technical limitation; do not circumvent client security rules or erase by guessed email/device IDs.
6. **Document proof.** For every step, record an opaque operation ID, exact subject/service, resulting status, reviewer and sanitized receipt. Mark "completed" only when company and all affected product operations have independently confirmed it. For partial, ambiguous or refused requests, explain what remains and why; keep an escalation and follow-up date.
7. **Close and review.** Suppress optional marketing on appropriate verified withdrawal; preserve minimal necessary evidence under active disputes/legal holds. On case closure apply the scheduled review targets and avoid indefinitely retaining full correspondence without a purpose.

## D. Deletion and interrupted-registration safety

- **RTA trusted deletion is currently unimplemented.** Before public release or a claimed successful RTA-linked company closure, the RTA team must implement authenticated inventory, a write/ownership fence, server-side deletion of eligible records, idempotent retries and verified completion across Firebase/SQL and affected providers. Do not weaken client rules or treat an in-app menu link as deletion.
- **Company deletion is not production ready.** Account profile, current Auth providers, canonical mappings, product bindings, purchases, device leases, marketing evidence, backups and legal holds must be inventoried before a deletion can be described as complete. Keep unresolved terminal effects blocked and reviewable.
- **Interrupted password registration** can leave a Firebase Auth credential after provisioning. Reconcile only the exact authorized UID and intent; do not delete and recreate blindly.
- **Unexpected Google sign-in** can create an Auth record unrelated to the invited RTA UID. Do not delete it without checking provider binding and RTA-related ownership.
- **Refunds/chargebacks** are not authorized by a deletion request or by an account identifier alone. RTA owns purchase verification and entitlement handling.
- **Backups/provider data:** identify actual deletion/expiry behavior and supported removal requests per provider; do not claim backups were purged without evidence.

## E. Marketing rules before sending

**Email:** Require accurate sender/subject, appropriate ad identification, a valid postal address, working unsubscribe method, timely opt-out processing, and verified subscriber/audience eligibility. The operator must monitor the sending provider's suppression ledger and failed/queued jobs. Transactional verification/recovery email is not automatically marketing.

**SMS:** Inactive. Do not activate without reviewed express consent, number ownership verification, sender/carrier registration if applicable, STOP/HELP handling, and a suppression/consent history mechanism.

**Postal:** Do not send unless an address has an independently approved purpose and the user chose the channel. Remove eligibility when the address is withdrawn.

**RTA child/unknown-age users:** Any monetization or cross-promotion must follow the declared audience and platform Families/ad rules; website marketing preferences are not permission to target a child inside the game.

## F. First-account staging operations

1. Approve the public Website Privacy copy, the separate RTA policy transition and matching Terms version; publish only with explicit EP authorization and capture a hash of the actual final public policy content.
2. Obtain a fresh **read-only** live inventory of Firebase Auth providers, domains, Functions, every RTDB instance and rules, IAM/billing/API/Hosting; this needs separate EP authorization before access.
3. Decide on a dedicated account-only database, exact runtime identity/rules and budget; independent isolation tests must prove the service cannot access RTA's default database before an account is created.
4. Start with one separate invited adult **password** account for a controlled real test (no existing RTA UID), then separately authorize an invited **existing RTA Google UID** test after RTA ownership inventory and provider verification.
5. Keep general registration and Google enrollment otherwise closed. Test sign-in, email verification, recovery, stable canonical ID, approved policy acceptance and Account Settings. If permitted, test the trusted resolver separately; it is not part of the registration-only candidate.
6. Confirm an exact post-test inventory and close all test gates. Never delete a test record or claim cleanup finished when its product ownership is unknown.

## G. Publication and release requirements

- Publish exact approved text with an actual effective date, stable version/document ID, immutable archive of the superseded combined privacy page, and verified content hash used by account-acceptance controls.
- RTA's game policy must be a publicly accessible HTML page, linked inside RTA and at the Google Play listing when applicable. Confirm the Data safety form matches the *released* SDKs, requests, data flows and retention.
- If the released game offers in-app account creation or an external account-creation link, provide a discoverable in-app deletion request path and a functional external deletion-request resource. Receiving a request alone does not complete deletion.
- Verify RTA's declared target audience, neutral age treatment where appropriate, COPPA/parental notices and actual ad SDK/settings before a child-accessible public build. For children's data, identify feature-specific collection/retention/deletion timeframes in the final notice.
- This document supplies operational recommendations; no current code, API or email service becomes active merely because the words appear in a policy.
