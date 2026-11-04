# LSD-ACCOUNT-014 — First account launch preparation

**Status: preparation complete; first real account is NOT READY.** Base branch `lsd-account-rta-readiness-013`, verified SHA `7ab6d4b138b36df9c3377223edeeefeab33283e0`; new branch `lsd-account-first-launch-014`. No live Firebase/Hosting call, policy publication, invitation, account, RTA operation, branch merge or deployment was performed.

## Deliverables

- [Website & Account Privacy v1.1 review draft](drafts/website-account-privacy-014-review.md): covers adult account eligibility, password/existing Google authentication, permanent IDs, verification/recovery, optional contact fields, three off-by-default marketing channels, SMS inactive, contact form data handling, providers, retention and separate company/game deletion. No effective date or approved hash.
- [Separate RTA Privacy v1.1 review draft](drafts/road-trip-arcade-privacy-014-review.md): preserves the current published combined disclosure baseline and calls out advertising, Google/Firebase, gameplay, multiplayer, Play, device/diagnostic, family and deletion claims that need current RTA Producer evidence.
- [Review-only policy preview builder](scripts/prepare-privacy-review-014.cjs): creates an ignored, `noindex` local site copy with `/privacy.html` proposed as Website & Account Privacy, `/games/road-trip-arcade-privacy.html` proposed as RTA privacy, and the existing published combined page retained for side-by-side review. The live page/navigation and static allowlist are unchanged.
- [Retention and support decision sheet](audit/account-014/retention-and-support-decisions.md): summarizes each data class, purpose/controller, review trigger, unresolved question and safe minimum recommendation. No statutory period invented.
- [Registration-only candidate builder](scripts/prepare-account-candidate-014.cjs): reproducibly packages email/password private-invitation registration and Pass 013's explicitly UID-bound existing-RTA-Google enrollment. It removes identity resolver, contact delivery, marketing preference APIs, mailing-address storage/update, deletion, maintenance, and Hosting deployment. Client/API/policy gates are all off. Candidate output is local under ignored `work/` and includes a file hash manifest.
- [Firebase staging procedure](audit/account-014/firebase-staging-approval-and-operations.md) and [first-account operator runbook](audit/account-014/first-account-operator-runbook.md): separate read-only inspection from authorized writes, detail candidate API/billing/identity/domain/rule gates, and distinguish new password users from existing RTA Google users.
- [Updated RTA handoff](contracts/rta-integration-handoff-014.md): preserves `identity.resolve.v1` as read-only and requires the RTA Producer to inspect current RTA source before adapting it. No RTA source was available/checked in this repository; Pass 013's pinned revision is historical evidence only.
- [Significant discoveries and cross-project risks](audit/account-014/discoveries-and-risks.md) and [focused test results](audit/account-014/test-results.md).

## Confirmed preparation findings

1. **Pass 013 baseline is verified.** Origin fetch resolved to the requested SHA, and the new branch was created from that exact commit.
2. **Rules review helper defect fixed.** Pass 013 added expiry indexes for Google grants and reservations, but the earlier strict safe merger rejected these new expected groups. Pass 014 adds both to its expected allowlist while continuing to reject inherited root grants, unexpected paths and conflicting account namespace changes. The helper can only prepare an offline candidate from a verified live backup; no live rules were read or written here.
3. **Policy approvals remain a hard gate.** Website Privacy is still a draft; RTA disclosures are still covered by the currently published combined page. The registry's privacy version/hash are unapproved/null for consent. No date/hash was fabricated and no legal file in the public allowlist changed.
4. **The candidate now requires an isolated company-account RTDB instance.** It rejects the shared default RTA database and configures the Admin SDK with `databaseAuthVariableOverride` set to `lovelysiren-account-service`, so database rules can constrain the registration runtime. The isolated instance has not been created, its rules have not been deployed, and the runtime effective IAM access has not been independently proven. Treat those as deployment blockers.
5. **RTA privacy evidence is stale for current claims.** Available source-lock findings concern the older pinned Pass 005 RTA commit. Current RTA source/build, deployed rules/SDKs and current operational deletion/billing configuration were not inspected. The draft preserves broad published disclosures but labels individual feature assertions for RTA Producer confirmation.
6. **RTA deletion remains a release blocker.** The trusted product inventory/fencing/deletion API remains planned, not implemented or deployed. Neither the Website Account candidate nor the page link can perform or promise full RTA deletion.

## Readiness decision

The candidate is **reproducible but not deployable/activatable yet**. Remaining blockers: Executive Producer approval/publication of both privacy documents and transition preserving RTA coverage; named retention/support decisions and legal review; fresh authorized Firebase Auth/domain/function/rules/billing/IAM/hosting inventory; approved billing/API budget; creation and independent least-privilege verification of the isolated account RTDB and runtime; approved HTTPS staging host and exact email action URLs; verified unchanged Firebase Google provider; one adult and one selected test journey; current RTA UID/data ownership evidence for the Google path; one private invitation generated only in the approved window; and post-test reconciliation. Contact, marketing sending, resolver, deletion, public registration and production deployment remain inactive and separately gated.

## Commands for local review (Node 22)

```powershell
$node = '.\work\node22-009\node-v22.23.4-win-x64\node.exe'
& $node .\scripts\prepare-privacy-review-014.cjs
& $node .\scripts\prepare-account-candidate-014.cjs
```

The first command reports a review-only preview directory under ignored `work/`; serve that `public` directory locally to review the proposed navigation. The second builds a Functions-only registration candidate with all controls disabled. Neither command contacts Firebase or deploys anything. See the operator and staging documents before any separately authorized live test.
