# Account 004 — policy-version matrix

Verified October 30, 2026 against fetched main and public HTTPS responses; publication evidence is `production-verification.json`.

| Document | Current / intended URL | Display version | Effective date | Stable backend identifier | Publication / acceptance status |
| --- | --- | --- | --- | --- | --- |
| Website Terms | https://lovelysirendigital.com/terms.html | 1.0 | October 28, 2026 | website-terms-v1.0 | LIVE IN PRODUCTION, source/archive/registry match. May be pinned in a future approved test; no real acceptance recorded by this pass |
| Existing combined Privacy | https://lovelysirendigital.com/privacy.html | No explicit version in existing page | October 5, 2026 | No approved company-account privacy ID | LIVE IN PRODUCTION, preserved. Does not adequately cover the new website account processing and cannot stand in for approval of the proposed account policy |
| Website & Account Privacy proposal | Local `/drafts/website-privacy-review.html`; intended eventual canonical `/privacy.html` after separate approval | 1.0 draft | Not assigned, not effective | website-privacy-v1.0 (proposed) | IMPLEMENTED review-only source/page, noindex. Not on main/public; cannot be accepted for real registration |
| RTA Terms | Local `/drafts/road-trip-arcade-terms-review.html`; future `/games/road-trip-arcade-terms.html` | 1.0 release-review | Not assigned | rta-terms-v1.0 | Separate, not operative, not included in website acceptance |
| RTA Privacy proposal | Local `/drafts/road-trip-arcade-privacy-review.html`; future `/games/road-trip-arcade-privacy.html` | 1.0 release-review | Not assigned | rta-privacy-v1.0 | IMPLEMENTED draft in 004; no standalone published game policy verified; game currently links the old combined policy |
| Synthetic emulator fixtures | Loopback `/drafts/emulator-policy-fixture.html` | Synthetic emulator-only versions | Fixture metadata, not legal publication | emulator-terms-v1 / emulator-privacy-v1 and synthetic renewal versions | TESTED IN EMULATOR only. Test-fixture status rejected outside the demo runtime; not agreement to legal drafts |

## Backend configuration

`account/config.js` now pins the already published `website-terms-v1.0`, leaves `privacyVersion: null`, `approved: false`, feature enabled false, registration false/mode closed, Google false. Updating a known Terms ID does not open an account service. `staging/accounts-controls.review.json` pins the exact Terms source SHA-256 `963bac3c70804f34e9aa184149b46c714d720e37ba6181529744d7d465ef44de`, date, canonical URL and stable identifier, but keeps service/registration/Google gates off and Privacy metadata null. The inactive invitation-plan helper uses this reviewed template instead of an old duplicate policy object.

The backend's `termsVersion`/`privacyVersion` fields and document `.version` are stable acceptance identifiers, not just a display string like `1.0`. The review template also supplies `displayVersion` for clarity. Different agreements never share an identifier. SHA-256 covers the normalized canonical source; it is not confused with the delivered HTML hash (header/formatting can differ). The published version's source/archive may not be silently rewritten.

Server validation requires exact current approved website-kind versions, valid nonfuture real calendar effective dates, canonical Terms/Privacy URLs and source hashes. It rejects RTA kinds, missing/false consent, stale versions, review statuses and non-demo fixtures. Preparation, provisioning and completion validate policies independently of browser claims. Registered acceptance includes server time and source hashes; durable version-pair history is separate from game consent.

A material-policy renewal gate requires a verified own account and an affirmative unchecked checkbox. The browser submits the versions actually reviewed; the server rejects a changed/stale pair. Existing history and the same LovelySiren ID survive reacceptance. A browser can edit its controls but cannot cause the backend to accept unapproved versions or allocate an ID to an underage/uninvited applicant.

Authenticated follow-up verified that account controls and the account data namespace are absent. There is no deployed trusted account policy configuration to match yet; the inactive local review templates are not live settings. See authenticated-inspection.md for the captured settings/rules and API/billing/provider prerequisites. A published, approved account Privacy version and matching trusted cloud configuration remain blockers to real registration.
