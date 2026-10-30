# Pass 007 Privacy review and transition

Approval package only. No effective date or publication authorization. Proposed identifier `website-privacy-v1.0`. Clean source: `drafts/website-account-privacy-v1.0.md`; preview: `drafts/website-privacy-review.html`. The former `drafts/website-privacy-approval.md` is retained unchanged as the previous review source. This review covers website/company-account processing, not RTA release approval.

## Exact changes from the previous draft

| Previous section | New section | Change |
|---|---|---|
| Draft heading/status/date/id/version | Preview cover and registry | Removed review metadata from policy body; cover explicitly says NOT PUBLISHED OR EFFECTIVE, no assigned date; registry stays review/unapproved |
| 1 Scope/current availability | 1 | Removed synthetic-emulator discussion; retained registration closed, browsing without account and no purchase integration |
| 2 Operator | 2 | Preserved Virginia sole proprietorship/trade name, complete mailing address and Gmail contact; added support link here |
| 3 Provided information | 3 | Rephrased programming details into customer language; kept every collection category, adult-only result, no retained full DOB/exact age, optional phone restrictions, transient registration password and incomplete-registration disclosure |
| 4 Identifiers | 4 | Added Pass 006's prepared-but-unavailable identity lookup, verified eligibility/consent/state checks and no lookup enrollment; retained separation from Player IDs and purchases |
| 5 Authentication | 5 | Rephrased conditional email/password and Google availability; kept verification/reset sensitivity, no Google password, no email-based merges, no phone/Apple/chat features |
| 6 Technical/local storage | 6 | Removed need-to-verify/development-report phrasing; retained provider technical logs, no custom login history, local session restoration and cooldown state; added independent backend-service authorization and explicit sign-out-is-not-deletion |
| 7 Purposes + 9 Website advertising | 7 | Consolidated uses and website-only no current ads/affiliate/analytics statement; preserved future disclosure/consent where required and game separation |
| 8 Providers | 8 | Preserved GitHub Pages, Firebase and Gmail; added conditional Firebase Hosting preview processing and provider links; retained sharing, geography limits and no absolute region claim |
| 10 Retention/security | 9 | Removed proposed operational approval timing, utility implementation and scheduling detail; preserved actual 15m/5m capability lifetimes, expiry-versus-erasure, no active automatic cleanup, durable records/logs/backups and qualified security statement |
| 11 Requests | 10 | Removed internal game-release deadline; explicitly states both automated company and trusted RTA deletion are unavailable; clarifies RTA-only requests do not delete company account and partial deletion cannot be called complete |
| 12 Rights | 10 | Consolidated qualified applicable rights and contact/appeal language; removed internal legal-review commentary, with no new statute coverage, response deadline or guarantee |
| 13 Children | 11 | Replaced “in this pass” with customer-facing limits; explicitly permits eligible children to use supported game guest features subject to product rules; no new game advertising/child-safeguard claims |
| 14 Updates/contact | 12 | Removed approval-process instructions; retained actual published version/date, appropriate notice and separate website/game acceptance |

Full exact textual diff is in `website-privacy-copy.diff`. Reproduce with `git diff --no-index drafts/website-privacy-approval.md drafts/website-account-privacy-v1.0.md` (exit 1 means differences, not failure). No earlier source was destroyed.

## Source verification and review questions

Reviewed account/config.js, service.js, ui.js; functions/src/accounts.js, index.js, maintenance.js, identity.js and identity-service-auth.js; Pass 004 inventory/retention/version matrix and authenticated inspection; Pass 005 confirmed deletion boundary; Pass 006 report. Current account and Google flags remain off. No RTA implementation was changed or independently reapproved.

Executive Producer must verify the business/trade-name description and existing contact address remain correct; decide optional-phone business need/data minimization; approve support identity verification and necessary retention categories/holds; verify provider log/backup access and retention before real collection; and review applicable privacy-rights/complaint/appeal requirements for actual business reach. No legal certification, statute applicability, fixed response period, region or universal deletion period is asserted. Unresolved retention/deletion operations are blockers to real testing even though the customer copy is ready for wording review.

## RTA dependencies requiring its Producer's verification

The RTA draft at drafts/road-trip-arcade-privacy-approval.md remains untouched/unapproved. Its Pass 004 source basis predates pinned Pass 005 RT-038B source: verify actual shipped age/ad treatment, banners/rewarded SDKs, Play purchase verification and Base/Theme ownership, newer SQL identity/lease/mailbox records, service providers and retention. The draft's statement that company architecture is merely being prepared and its deletion wording need reconciliation with the confirmed UNIMPLEMENTED trusted worker. Local 30-day session cleanup wording is not proof of live rules or comprehensive deletion. Exact installed build, Data Safety, children/guest disclosures and in-game/store links require RTA Producer approval; none of these claims is silently imported into company copy.

## Safe publication sequence — later authorization only

1. Keep existing privacy.html byte-for-byte until approved replacements and their routes are available. It remains the only current combined website/RTA disclosure target; old content cannot be replaced with company-only text and leave game users without disclosures.
2. Preferred: obtain separate RTA approval and publish its accurate standalone policy at `https://lovelysirendigital.com/games/road-trip-arcade-privacy.html`, verify actual HTTP 200/content, then coordinate website/company policy replacement and game/store link updates. That path is proposed and currently absent locally, not a published-page claim.
3. If company publication must precede RTA approval, require a separately approved transition: retain the complete old combined policy at a stable publicly reachable archive; show a prominent Road Trip Arcade disclosure link from privacy.html before/alongside the new company policy; preserve old scope/date and explain supersession precisely. The RTA Producer must verify that route remains accurate for existing game/store links. An archive URL alone is not permission to publish unapproved new game wording. No archive or replacement is published by this pass.
4. Archive the approved company source/version; assign the real publication/effective date, verify canonical URL and actual normalized source hash and delivered content. Preserve old disclosures and actual versions. Only then update registry metadata; obtain separate policy-control and controlled-test activation approval. If links or scope verification fails, stop the transition and leave the old public policy in place.

## Exact metadata and acceptance transition

`staging/account-007-policy-transition.review.json` pins published Terms and keeps Privacy date/hash/status null. Current trusted/client approval flags remain false. The registry's websitePrivacy contentSha256 identifies this REVIEW draft only and must never be copied as proof of published consent.

After approved publication, set registry websitePrivacy source to the immutable published source, status published, actual effectiveDate, publicationApproved true and contentSha256 computed from normalized LF published source; add a real archive entry to publishedVersions. Verify the deployed HTML contains the same wording, identifier/date and canonical URL; HTML-byte hash and source hash are distinct. The current legal generator intentionally refuses Privacy publication, so a separately reviewed publication change is still needed; do not bypass its guard.

Set trusted policy.documents.privacy to `{kind:"website-privacy",status:"published",version:"website-privacy-v1.0",displayVersion:"1.0",effectiveDate:<actual>,sha256:<verified published source>,url:"https://lovelysirendigital.com/privacy.html"}` and policy.privacyVersion to website-privacy-v1.0; retain actual Terms ID/date/hash/URL. Set client policies.privacyVersion and canonical privacy URL. These metadata writes alone do not authorize approval/activation. policy.approved and client policies.approved require separate sign-off; all service, registration, Google and resolver gates stay off until their own approvals.

Existing server code supports strict published kind/version/date/hash/URL validation, server-recorded acceptance and durable version-pair history. Material renewal uses policy.requiresReacceptance, policy status/read and affirmative accept endpoints; client submits versions actually reviewed and server rejects stale versions. Pass 006 additionally requires current hashes for every lookup; it remains disabled. Do not rewrite a published version's content under the same identifier; later material versions need a new ID, archived source/hash and an approved renewal plan. No real-user consent to this draft is recorded.
