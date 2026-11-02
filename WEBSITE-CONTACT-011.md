# Pass011 — Contact Us form

Prepared November 2, 2026. Base: Pass010 `8fa4ef4e81d22fea0f3c3e67fcd59e140ecf27f1`. Branch: `lsd-website-contact-011`. Local/source-only; no production deployment or activation.

## Implemented

support.html now has a Seaside Pastels Contact Us form with required name, email, product and message, the five requested categories, and conditional product/subject fields for Other and Billing/Purchases. It has keyboard/mobile support, submission/success/failure announcements, pending input protection, and the original support-mailbox fallback. No account or email application is needed to submit through an activated service. The tracked live configuration remains inactive and says so plainly.

A separate contact handler/store/delivery module and inactive dedicated Functions entry are prepared. Account Functions exports, auth source, marketing preferences, purchases and RTA source are untouched. The support handler accepts anonymous contact requests with validation, verified bot boundary and shared persistent quotas; account tokens are neither needed nor used as support ownership proof.

## Delivery and safeguards

[Delivery activation checklist](audit/contact-011/delivery-activation.md) records the exact sender, fixed Gmail recipient, provider/credential/domain requirements, bot-verification setup, namespace/runtime isolation and separate collection/deployment gates.

- Recipient is fixed to lovelysirenstudios@gmail.com; From is a server-configured verified company identity, with visitor address only in Reply-To. No Cc/Bcc, attachments, HTML, arbitrary recipient or visitor autoresponder.
- Configurable transport interface plus concrete **Resend candidate adapter**, tested with injected HTTP stubs only. No provider approval, key, account activation or email request was made. Production entry is hard inactive; later activation requires reviewed wiring and independent gates, not a browser flag.
- Field/body limits, multiline Unicode support, header-injection defense, honeypot, shared pre-bot IP/email/global quotas and server-verified bot boundary. Origin/CORS are supplementary; spoofing Origin cannot bypass bot/quota checks.
- HMAC-keyed fingerprints, counts, timestamps and status only in the anti-abuse store. No raw message/contact/IP/token logging or durable message copy there. Real messages will necessarily reach the chosen provider/mailbox only after approval.
- Durable leases/deduplication prevent overlapping sends. Success requires provider acceptance AND durable accepted-state acknowledgement, not final inbox delivery. Definite nonacceptance allows delayed retry; timeouts/unknown transport/expired pending work stay unresolved without automatic resend. Secret rotation, unknown-record reconciliation, physical retention cleanup and operational monitoring remain reviewed live-launch prerequisites.
- No marketing consent or account/billing/deletion authority is inferred. Sensitive work needs independent identity/purchase verification.

## Privacy and cross-project findings

[Review-only Privacy addition](drafts/contact-form-privacy-011-review.md) covers support-message processing, email/bot providers, anti-abuse metadata, no promotional consent, retention and identity-verification limits. No published Privacy, Terms, legal registry, approval hash or CNAME changed.

[Significant Discoveries and Cross-Project Risks](audit/contact-011/security-and-risks.md) distinguishes the confirmed mailto-only access limitation and demonstrated ambiguous-delivery/acknowledgement-loss behavior from potential distributed-spam, broad-Admin-privilege and downstream mailbox/provider risks. Future account/game mail jobs must use their own reviewed ownership, delivery and idempotency contracts; this pass does not allege or change an RTA implementation defect.

## Focused tests

Actual existing portable **Node22.23.4**, no global software or PATH changes:

- **14 contact backend/emulator cases passed** (Node reporter15 including parent): successful real local HTTP request; required/category/conditional fields; invalid/oversized/multiline Unicode input; header injection; bot rejection; shared limits across service instances; duplicate/concurrent requests; definite failure/delayed retry; unknown/expired work; durable acknowledgement loss; fixed envelope; stubbed concrete provider request/acceptance/errors; malformed/oversized/method/Origin checks; no raw anti-abuse PII or marketing records.
- **Five browser widths passed:**320,375,768,1024,1440; no horizontal overflow, axe WCAG A/AA violations, JS errors or external requests. Actual local mock HTTP backend tested conditional fields, required validation, keyboard navigation, pending-provider state, acceptance-only success, rejection/data preservation and inactive default. Mobile screenshot visually inspected.
- **Two affected static/package checks passed:** explicit public allowlist contains required support assets; internal links resolve; account-only review package still excludes the contact entry and privileged identity/deletion sources. No unrelated account/RTA/full historic suites ran.
- Dedicated contact package: isolated clean locked npm installation, native ESM/function discovery, sole inactive contact export, real HTTP503 and zero initialized Admin apps passed. No account source is packaged. Syntax and staged whitespace checks passed.

Reproduce with local demo Database emulator on127.0.0.1:19000 and isolated Node22: `node scripts/test-contact-011.cjs`. Package check: `node scripts/check-contact-011.cjs`. Scoped synthetic fixture roots are individually cleaned; no global emulator reset or real customer records were accessed. Dependency manifests/locks are unchanged.

Chrome preview: [http://127.0.0.1:18771/support.html](http://127.0.0.1:18771/support.html), **mock delivery only**, no email sent. Start/restart with isolated Node22 `scripts/contact-preview-011.mjs` while the local demo Database emulator runs. The persistent loopback preview keeps a local HMAC key under ignored work/contact-011 and uses a demo-only namespace. Use synthetic data. Review logs/screenshots/packages under ignored work/ are not deployment artifacts.

## Files and remaining blockers

Changed: support.html and staging/account-007-static-allowlist.json (three explicit new public assets).

Added: support/{config.js,form.js,contact.css}; functions/src/contact-entry.js; functions/src/contact/{submission.js,store.js,adapters.js}; scripts/{contact-preview-011.mjs,prepare-contact-011.cjs,check-contact-011.cjs,test-contact-011.cjs}; tests/{contact-011.emulator.mjs,browser-contact-011.mjs}; this report; audit/contact-011/{delivery-activation.md,security-and-risks.md}; drafts/contact-form-privacy-011-review.md.

Live blockers: EP approval of provider/plan/costs, sender/domain and server-only secrets; actual domain verification/DNS readiness; real bot provider/widget/server verification and replay protection; final Privacy/support retention approval/publication; reviewed least-privilege dedicated runtime/private store/rules and deployment wiring; controlled real acceptance/inbox/failure tests and operational reconciliation. No production backend/website deployment, live Firebase/billing/API/credential/DNS changes, real email, legal publication, public registration, RTA/purchase change or production merge occurred.
