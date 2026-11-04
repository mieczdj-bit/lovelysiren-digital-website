# Pass 015 — Producer retention/SOP adoption checklist

**Internal operating review only.** Source: `legal/producer-015/04-Internal-Data-Retention-and-Support-SOP.md`. None of these recommendations creates an automatic cleanup job, deletion service, marketing process, support-email delivery provider, or new data collection. The Executive Producer must adopt or revise each target and assign a named human owner before real account or support records are handled under it.

## Decisions for Executive Producer adoption

| Proposed business target from Producer SOP | Decision and owner needed |
|---|---|
| Acknowledge new privacy/deletion mail within two business days | Adopt/revise; name the support operator and backup. This is an internal service target, not a legal deadline. |
| Review invitations/grants weekly during controlled testing; review unresolved ones 30 days after resolution | Adopt/revise; name the company-account operator. Confirm unknown provisioning before removal. Expiration is not erasure. |
| Review settled, nonessential abuse/security evidence at 90 days | Adopt/revise; name the security/operator reviewer and define incident/hold exceptions. |
| Review incomplete Auth identities 30 days after failed enrollment | Adopt/revise; name the account operator. Require exact UID and RTA ownership reconciliation before any removal. |
| Review active-account purpose, optional phone/address, adult eligibility and identity mappings annually | Adopt/revise; name the account-data owner. Do not retain full birth dates or recycle permanent IDs. |
| Review support correspondence 12 months after case closure | Adopt/revise; name the mailbox/case custodian and define hold/attachment handling. |
| Review access/privacy-request evidence after completion and at 24 months | Adopt/revise; name the privacy-case reviewer; define minimized evidence and legal-hold exceptions. |
| Review marketing consent/suppression after withdrawal/address changes and annually; 24-month review after last activity | Adopt/revise; name a marketing owner. No promotional sender or schedule is active. |
| Inspect unresolved contact delivery weekly and settled anti-abuse metadata after 30 days | Adopt/revise only when the form backend is approved; name the support operator. No provider delivery or automatic cleanup is active. |
| Review provider log/backup access and configuration quarterly | Adopt/revise; name each provider owner and obtain actual default retention/export/restore facts first. |
| Specify child-data retention periods by class before child-accessible game features launch | RTA Producer/legal/platform decision; this is a release requirement when applicable, not an adopted time period. |

## Facts still unknown or capability not implemented

- Actual Gmail mailbox access, case workflow, attachment handling, and mailbox-retention controls have not been inspected. The website contact form's server delivery remains inactive; Resend/Turnstile remain future provider choices, not active services.
- Actual Firebase, Cloud, GitHub, SQL-host, app-store, and backup log/retention settings and deletion behavior require provider-by-provider inventory. No blanket deletion or backup purge is authorized.
- Scheduled account cleanup, marketing dispatch/suppression, support-message delivery, and company-wide deletion orchestration remain inactive. Do not create them from this SOP.
- RTA source now contains a scoped deletion endpoint and focused test source (see the RTA verification report), but production deployment, current environment/migration state, production access control, and complete user-facing access are not established here. RTA deletion remains a release blocker pending independent verification.
- Neither a request receipt nor a partial product result proves company-wide or all-product deletion. Report completed, pending, refused, or retained portions separately and only with verified evidence.

This checklist records decisions needed; it does not modify account controls, policies, providers, or product data.
