# First real controlled account — approval checklist (Pass 013)

**Readiness: NOT READY.** This is an operator sequence, not authorization to activate a service or create an account.

## Close before requesting a one-person test window

- [ ] Executive Producer approves final Website Privacy text, actual publication date/version/hash and the transition that preserves the disclosed RTA processing. Publish separately under its own approval; a draft or test fixture cannot authorize consent. Website Terms v1.0 remains the reviewed published document.
- [ ] Approve support, owner verification/recovery, account retention, audit/log/backups and one-test cleanup/hold procedures. RTA trusted inventory/fence and trusted deletion remain unavailable; if the UID has RTA-owned records or absence cannot be proven, do not claim company-only isolation or cleanup completion.
- [ ] Approve shared Firebase billing account, budget/monitoring and the exact required APIs. No blanket API enablement or billing activation.
- [ ] Under separately approved read-only scope, recapture live Firebase Auth settings, authorized domains, deployed Functions by generation/region/codebase, current RTDB rules, project IDs and sender/verification configuration. Compare against the Pass 004 snapshots; those are dated evidence and may be stale. Stop on unknown function-name collisions or rules changes.
- [ ] Review least-privilege identities and exact Auth/RTDB operations for the controlled account API, identity resolver and any staging runtime. They are separate permissions. Do not grant Owner/Editor, enable resolver IAM, or publish static secrets.
- [ ] Approve an isolated HTTPS staging host/origin and expiry, email verification/recovery URLs and the Google provider's current shared-project state. Do not modify production domains or Auth settings. Existing RTA Google Auth must remain intact.
- [ ] Verify the candidate test adult's exact Firebase UID and existing Google provider binding from authorized RTA records; verify associated RTA identity/data status and independently bind the invite to that UID. No email-only match. Test invitation code must be generated privately at activation time, never put in Git/report.
- [ ] Approve `serviceEnabled`, controlled `registrationEnabled`, `googleEnrollmentEnabled` (only if testing the existing Google case), exact origin, policy control and exactly one invitation. Keep public registration off. Keep identity resolver activation a separate explicit decision; never assume this pass enables it.

## One-account execution after those approvals

1. Deploy only the reviewed staging candidate, with API/client feature flags closed; inspect service, host, static allowlist, runtime principal, database path and origins.
2. Activate only the agreed account journey and one private UID-bound invitation. For password testing, use a distinct invited synthetic/new identity. For existing RTA Google enrollment, use the exact existing Firebase UID/provider invitation. Do not run these two cases as though they share identity semantics.
3. Complete adult eligibility and explicit acceptance of the current published Terms and Privacy. Verify actual email or Google authentication, same stable Firebase UID, one canonical `lsid_` mapping, own Settings and sign-out/sign-in recovery. Confirm RTA UID, Player ID, SQL UUID, games, purchases and records are unchanged.
4. If identity service is separately approved, enable it only for the reviewed RTA service principal/audience. Verify allowed and unauthorized server calls, user revocation/disablement, current consent/lifecycle and missing-account behavior. Resolver success does not test RTA binding, purchases, leases or deletion.
5. Reconcile the exact test UID, grants, reservation, mapping, profile and Auth provider. If any RTA data exists, retain it unless an authorized RTA service/inventory supports the explicitly approved action. Do not run a company deletion and do not report deletion complete while the RTA trusted deletion API is unimplemented.
6. Close the test gates, retain only approved evidence and record any partial/unknown state. Stop on UID mismatch, conflicting mapping, policy mismatch, unexpected Auth user, provider failure, unexpected write or inability to verify the affected stores.

No step authorizes production merge, public registration, RTA account migration, purchase reassignment, deletion worker activation or production Firebase changes.
