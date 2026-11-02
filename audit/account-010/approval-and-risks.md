# Pass010 approvals and cross-project risks

## Significant Discoveries and Cross-Project Risks

**CONFIRMED source gap: unversioned contact overwrites.** Existing profile updates checked lifecycle but did not compare contact changes. An old tab could overwrite newer phone/address details, undermining destination-bound permissions. New contactRevision CAS and atomic channel withdrawal prevent that. Emulator tests reject stale edits and pause selection between authorization/commit while contact or lifecycle changes. Legacy zero-revision writes remain narrow; once contacts are versioned, legacy writes stop. Any RTA/future client editing company contact details must adopt the contract; RTA source was not changed.

**CONFIRMED integration gap introduced by the new data category: closure inventory.** Pass009 knew only its previous profile/evidence fields. Leaving a new separate marketing record outside cleanup would retain active-looking choices after closure. Added explicit marketingEvidence decision, fail-closed legacy-plan rejection, contact erasure and evidence erasure/minimization. Emulator closure tests verify new data removal; broader affected lifecycle/lease/hold tests remain required. Future products adding private namespaces must update inventory and retention explicitly.

**CONFIRMED boundary hardening: recent-auth validation.** Prior profile update arithmetic could accept absent/non-finite auth_time in a directly invoked backend fixture. Real Firebase tokens normally provide this claim; this is not evidence of an observed production exploit. Contact changes now require a finite, recent, non-future authentication time. Tests reject missing/expired/future input. Similar trusted-claim checks should be reviewed in future clients/services without changing RTA here.

**POTENTIAL future delivery risk:** email/phone ownership can change outside the company profile transaction. An Auth lookup and RTDB write are not a cross-service atomic claim; this implementation never sends and reports every delivery eligibility false. Before activation, a sender must recheck current verified destination/ownership, enforce suppression and fence queues/exports; phone verification and Auth-change reconciliation need explicit design. Tests cover live emulator email changes and revoked credentials, not real provider delivery. Do not treat a stored hash or checkbox as verified ownership or legal SMS permission.

**POTENTIAL scale/operations risk:** preference/contact consistency currently uses the company root transaction. History opt-ins stop at 1,000 meaningful events; withdrawals remain available and redundant off-only history is avoided. This bounds opt-in evidence per account, not root-wide growth or customer traffic. Pass009 schema/retention/rate-limit/monitoring decisions remain future gates. No load/billing improvement or production throughput is claimed.

## Exact approval prerequisites

| Program / change | Required before collection/activation or sending |
|---|---|
| Policy and contact collection | EP/legal approval of review-only draft and final program copy; publish/version/hash only after separate authorization; preserve RTA disclosures; explicitly authorize the live collection boundary replacing demo-only guard |
| Email | Approved program, verified current account destination, purpose-specific consent version, provider/DPA/subprocessors, authenticated unsubscribe and suppression/queued-delivery tests, operational/security review and jurisdictional requirements |
| SMS | All above as applicable, reviewed express-consent disclosure and presentation, country/jurisdiction/age requirements, phone ownership verification, delivery provider, STOP/unsubscribe/help processing, sender registration where applicable, re-enrollment and evidence rules; no legally operative SMS disclosure is supplied here |
| Postal | Usable country-specific address, independent permission, provider safeguards, suppression/address-change tests, international handling and reviewed retention |
| Retention/deletion | Reviewed marketing evidence/suppression/hold/legal criteria, logs/backups and external-list cleanup; trusted RTA inventory/fence/deletion plus terminal proofs remain release blockers |
| Infrastructure | Pass009 Privacy/support/retention, least-privilege runtime, live rules review, approved HTTPS staging and actual runtime security checks; no blanket deployment authorization |

No messages, physical mail, purchases, provider accounts or billing/API/IAM changes were made. Existing published Terms and Privacy and original Pass007 legal draft/registry remain unchanged. The separate Pass010 review copy has no effective date or approval/hash suitable for real policy acceptance.
