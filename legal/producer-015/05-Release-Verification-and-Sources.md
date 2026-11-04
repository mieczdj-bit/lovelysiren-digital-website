# Producer Verification Notes — LSD-ACCOUNT-015

**This document is internal only. Never publish it as part of a public Privacy Policy.**

## Basis for the document set

The package is derived from the LovelySiren website Pass 014 development branch (`lsd-account-first-launch-014`, verified head `5c9a4d8020670f5923ece9b100eb14f9d8c53ff9`), its two policy review drafts and retention sheet, the current `privacy.html`, `delete-account.html`, `support.html`, `account/config.js`, website Terms v1.0, Pass 013 RTA identity handoff, and the Executive Producer's decisions: independent adult-only LovelySiren Account; RTA remains a family-capable game; Google-first; optional email/password; separate permanent company ID; off-by-default promotional channels; no email-based account merging; RTA owns purchase entitlements.

No inspection of the **current RTA release branch/build** was available through the website repository. Accordingly the RTA policy is a complete proposed text, **not independently verified against current RTA SDKs/rules/settings**. Its family/ad/privacy and deletion claims are a release verification item, not permission to assert technical behavior that hasn't been tested.

## Current external primary requirements consulted (2026-11-04)

1. **Google Play User Data Policy — privacy disclosures, retention and deletion:** https://support.google.com/googleplay/android-developer/answer/10144311
2. **Google Play account-deletion details:** https://support.google.com/googleplay/android-developer/answer/13327111
3. **Google Play Families Policy:** https://support.google.com/googleplay/android-developer/answer/9893335
4. **Google Play target audience and age configuration:** https://support.google.com/googleplay/android-developer/answer/9867159
5. **Google Play Privacy Policy / listing requirements:** https://support.google.com/googleplay/android-developer/answer/9859455
6. **FTC COPPA Rule / children's privacy guidance:** https://www.ftc.gov/business-guidance/privacy-security/childrens-privacy and https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions
7. **FTC CAN-SPAM business guide:** https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business
8. **Virginia Consumer Data Protection Act scope** (thresholds mean coverage should not simply be assumed for a small studio, although other duties may apply): https://law.lis.virginia.gov/vacode/title59.1/chapter53/section59.1-576/

## Facts requiring current, product-specific verification before release

- RTA target age bands and whether under-13 users are actually included. If so, verify neutral age screening, parental consent and the treatment of account creation, suggestions, friend/player ID features, game data and advertising. For child personal data, specify actual **retention timeframes by data class** and review methods, as required when applicable; the current draft does not invent them.
- RTA's current Android build: all actual SDK dependencies and initialization; Play Billing, AdMob format settings (banner, rewarded), child/unknown-age treatment, advertising/cross-promotions, purchases, refund/restore, cookies/ad identifiers and permissions.
- RTA's present Firebase and SQL data classes (suggestions, friendships, game progress, multiplayer and session history), retention, backups, deletion authorization and current IAM/rules.
- The existing published **RTA Terms** link and all app/Play/site legal links. Do not overwrite Website Terms v1.0.
- Exact customer-facing status of any active website/account/marketing/contact functionality when the policy actually becomes effective. For optional providers, do not publish a claim that they are active until integration and settings are confirmed.
- Confirm LovelySiren business postal address and desired publication of it. It is already on drafts and business records.
- Ensure neither public document includes internal audit terms such as "Pass 014," branch names, "pinned revision," "producer verification," or source file paths. Public deletion page may honestly explain pending/limited capabilities; do not disguise that as completed deletion.

## Concrete release blockers (not solvable by policy wording alone)

- **RTA trusted data deletion** remains unimplemented. A functional external deletion-request email/page helps users ask, but is not actual erasure of user data. Implement trusted inventory, fence, product-specific deletion with proof, user-visible in-app request access and appropriate retention before claiming Google Play account deletion compliance.
- **Company production registration** requires approved published Website Privacy, actual policy hash, controlled infrastructure, dedicated account RTDB/rules, least-privilege runtime, Auth/domain settings, billing/API authorization and one approved test invitation. First real account is NOT READY as of this package.
- **Account identity resolver and RTA adapter** are separate from first registration deployment. Registrar and resolver must point to the same authoritative company account RTDB; there must be no self-allocation fallback in RTA.
- **Marketing SMS and support form email** remain inactive; provider selections Resend and Turnstile are intentional but account/DNS/API/billing/deployment actions are separately gated.

## Editorial decisions applied by Producer

- Kept separate Website and RTA policy scopes while preserving a plan to archive the October 5, 2026 combined policy.
- Preserved explicit distinction between adult-only company registration and family-capable RTA gameplay.
- Included specific user-data categories and named established providers rather than abstract "third parties." Future Resend/Turnstile operations are described conditionally.
- Avoided claiming the RTA deletion implementation works, or that a web link, signed-out user, local app deletion or OAuth account is sufficient proof of deletion.
- Kept user-facing copy readable, removed audit commentary and detailed internal risk classifications from the public policies.
- Supplied a suggested **internal** review schedule that does not pretend to be an implemented automatic purge or statutory limit.

## Publication condition

The documents have `Effective date: [SET ON APPROVED PUBLICATION]` markers. They **must not be publicly served in this unfinished form**. The implementation pass may create local preview HTML and test link paths and preservation. A later explicit EP authorization should name the final wording, effective date, exact publication targets, product confirmation and whether registration gates may subsequently be opened. Treat publication and first-account activation as separate approvals.
