# Pass 013 — significant discoveries and cross-project risks

## Confirmed source defects fixed here

- **Google enrollment path was incomplete:** the create page's Google action called password-oriented registration; no explicit company enrollment for an existing RTA Google UID existed. Added UID-bound prepare/completion APIs, Admin Auth provider checks, a dedicated disabled-by-default `googleEnrollmentEnabled` gate, and emulator coverage. No email-only merge or RTA data write occurs.
- **Unexpected method could reserve registration:** the password preparation route checked `method` after writing a reservation. It now rejects non-password methods before rate-limit/reservation state is written.
- **Verification recheck could return stale `checking` state:** refreshed Firebase token events raced the explicit account reconciliation. The browser smoke test reproduced a successfully verified/active profile that did not route to the dashboard. The client now waits for the latest reconciliation to settle; the actual browser journey then passed.
- **Existing browser smoke assertions were stale:** the Account Settings UI says “Save Contact Information” / “Contact information saved,” while its automated check expected retired “Save Profile” wording. The focused smoke test now targets the current UI copy and passes.
- **New temporary Google grants were not in bounded expiry cleanup:** maintenance previously knew only password grants, link grants, throttles and invitations. Google enrollment grants/reservations are now covered by the existing bounded, dry-run-first cleanup helper.
- **Required expiration indexes were missing:** the emulator rejected cleanup queries for the new Google records until their `expiresAt` indexes were added to both the proposed account namespace rule patch and isolated emulator rules. These are not deployed live rules.

## Confirmed cross-project conflicts (RTA source is pinned, unchanged)

Pass 005's `contracts/source-conflicts.md` and `contracts/rta-source-lock.json` pin the actual RTA source at commit `048c0138f7c99a2bc8c59a317ff87ca74afbd7c2`. Findings are reproduced in `contracts/rta-integration-handoff-013.md`: product-side canonical ID allocation through `resolveLovelySirenUser`; Google-only verifier without Admin revocation/disabled checks; unavailable email-auth client; activation/lease/entitlement/Play verification paths tied to the product-local identity; purchase/promo/mailbox/lease FKs on the local SQL UUID; per-product lease pool and stale-release risks; guest promo attachment based on installation ID. These are confirmed source findings, not a claim that a live service was probed this pass.

## Potential risks that still require evidence/approval

- Firebase Google popup can create a new Auth record for a different, previously unseen Google account. This implementation rejects the mismatched UID and signs it out before company enrollment, but does not delete that Auth record or infer it is safe to do so. A real test must use the exact UID/provider-bound private invitation and include unexpected Auth identities in its authorized reconciliation.
- Invited Google UID selection and the completeness/currentness of the RTA record inventory require an authorized RTA operator and evidence. No invitation or live UID was used here.
- Identity resolution emulator tests use an injected offline service-token verifier, not Google signing-key distribution, deployed HTTPS, runtime IAM, service-account revocation or actual RTA platform forwarding.
- Shared Firebase billing, API enablement, current live Auth/domains/functions/rules, service principal/IAM, policy publication, sender/domain setup and support/retention procedures are not verified/approved by this pass.
- Website Privacy has no approved current version/hash in the readiness record. Do not activate account enrollment or identity resolution against the test policy fixture.
- RTA trusted inventory/fencing/deletion is unimplemented. A fresh email, missing company mapping, Auth disablement or passing synthetic fixture does not prove absence/erasure of game or purchase data. RTA deletion remains a release blocker.
- Existing RTA service's provider-neutral password path, company/RTA one-to-one binding, lifecycle checks across leases/purchases, shared device lease service, and deletion orchestration remain RTA/joint follow-on work; this branch does not change RTA or its customer records.
