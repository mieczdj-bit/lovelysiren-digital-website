# Controlled-account operator procedure — proposed, not authority to act

No live cleanup is authorized or performed. Company deletion coordinator is incomplete; RTA trusted deletion API is PLANNED / NOT IMPLEMENTED / NOT DEPLOYED / RELEASE BLOCKER. This procedure is an approval artifact, not a substitute for those services.

## Preconditions and inventory

Assign a responsible support/security operator and an independent reviewer. Approve a narrow test window, adult participant, consent documents, recovery route, request verification, retention/holds and manual cleanup scope before collecting real data. Prefer a new company-only test identity with no RTA records; prove that condition through separately authorized checks. If tester already has RTA identity or purchases, preserve them and stop any cleanup until the cross-product dependency is resolved. Do not auto-merge by email.

Keep an access-controlled inventory outside Git/public Hosting: approved Firebase UID, canonical ID if created, exact company record paths, status/verification, invitation/reservation keys, grant expiries, consent document versions/hashes/times, permitted provider bindings, relevant support case reference and cleanup/hold decisions. Inventory actual records only under authorized scope; do not dump unrelated users. Never include password, action codes or raw invitation/service/user tokens in reports.

## Supported operations and limits

| Situation | Current supported behavior / proposed operator handling |
|---|---|
| Incomplete registration | Provision/complete retries use stable reserved UID and canonical allocator; inspect only authorized grant/reservation/Auth/profile/mappings. Existing-account flow must never reset another user's password. Stop after inconsistency; do not delete reservation to “start over” and create an orphan |
| Unverified credential | Profile remains pending; verified own-profile path can activate only after real Auth verification. Controlled test must prove email delivery/action. Review stalled pending records after the approved window; no automatic orphan deletion exists |
| Expired invitation/grant | Server rejects expired authorization. Invitation renewal/replacement is a fresh live authorization, not assumed. Registration grant lifetime15m and linking5m remain as implemented. Existing local helper's default invitation duration is not an approved operating window |
| Temporary cleanup | Existing maintenance helper supports dry-run and bounded per-record transactional removal of expired registrationGrants/linkGrants/throttles/testInvitations ONLY. No schedule is deployed. Later authorized operator must review candidate dry-run, expiry recheck, scope and apply approval; retain sanitized counts, verify retry/renewal behavior and stop on partial failure |
| Recovery | Firebase reset/action flow exists; controlled test must prove real delivery and return. Verify domain/action URLs, avoid email enumeration, never request passwords or issue manual ownership reassignment by matching email |
| Compromise | With explicit incident authority, disable exact Auth user/revoke refresh tokens and block company gates/invitation as needed; verify containment. Runtime candidate lacks Auth update/delete permissions, so a separately authorized operator is required. Never claim disabled means deleted; assess shared UID/RTA impact before action |
| Access/correction | Require reasonable verified ownership; export only allowlisted own fields/necessary scope. Existing self-service supports display name/phone edits and phone removal; email/UID/company-ID edits and provider detach are not general profile features. Privileged correction requires an approved plan, no game-name overwrite |
| Company-only deletion request | No coordinator. Verify scope and retention exceptions; prepare exact Auth/profile/history/reservation/mapping/temporary-record inventory and reviewed order, ownership preconditions, preservation/tombstone decision, backup/log treatment and completion criteria. Do NOT run ad hoc deletes. Current role excludes Auth delete; widening it requires approval |
| RTA-only or company-wide request with game data | RTA worker is absent; do not attempt client-rule bypass/partial deletes. Escalate as blocked, preserve company account for RTA-only request, disclose incomplete status. Company-wide completion requires trusted product receipts or a separately approved equivalent verified procedure; no such procedure is claimed complete here |

## Verification, failure and retention

Track each request as received → identity/scope verified → holds reviewed → approved plan → in progress → verified complete OR blocked/partial. Do not mark complete because a request email was sent, login stopped, one record disappeared or sign-out succeeded. Distinguish local storage, Auth, RTDB, support mail, provider logs/backups and product SQL records.

Before authorized manual cleanup, review lawfully necessary minimal policy/ownership evidence, non-reassignment tombstones, fraud/security/dispute records, support mail and provider backup/log handling. Approve minimum fields, justification, retention review/removal criterion and responsible reviewer; no arbitrary legal period is imposed here. Do not assume “permanent ID” authorizes retaining identifiable mappings forever.

For an approved company-only cleanup, require a dry-run inventory, exact ownership assertions, least-privilege operator access, reviewed dependency/order plan, idempotent per-step journal and independent post-action absence/retention checks. If any step fails, preserve journal and evidence, stop unsafe follow-ons, report partial status, contain compromised access if authorized, retry only verified safe steps and escalate to Executive Producer/support. Do not remove shared Auth or IDs before confirming downstream ownership/records. This describes required design/review; no new cleanup implementation is provided.

## Issues blocking the first real account

Real testing remains blocked until category-specific retention and minimal identity/consent tombstone handling are approved; provider logs/backups/access/retention are verified; support ownership checks and accountable response/escalation are approved; and a narrow company-only manual cleanup plan can be independently verified or a trusted company deletion implementation exists. A participant's willingness is not a substitute for those controls.

RTA integration/deletion is not required merely to prepare website code. A demonstrably isolated company-only controlled test may proceed only after its own approved support/cleanup gates; any existing RTA linkage makes unimplemented product deletion an additional blocker. Neither that possibility nor this document authorizes real testing now. End-to-end company/product deletion remains a release blocker regardless of a successful registration test.
