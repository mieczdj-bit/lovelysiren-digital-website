# First real account approval and isolation package — Pass009

**Current readiness: NOT READY.** Node22 local compatibility is now verified; the Privacy, operations, infrastructure and dependency-verification approvals below are not. No real account, invitation, email, cloud setting or cleanup was created/executed in this pass.

## Independent company-only isolation evidence

Missing company-side game links, a new email, a participant assurance, a successful sign-out or an Auth disable are NOT absence proofs. No RTA inventory response was invented or installed.

For a later, separately authorized test, responsible operators/RTA Producer must establish:

1. The actual shared Firebase project and UID, Auth provider bindings/creation provenance, canonical ID and reservation/consent/profile records. Prefer a genuinely new dedicated adult test identity with no pre-existing account. Check reuse/previous UIDs and conflicts through authorized records; never infer ownership or transfer game data by email matching.
2. An independently reviewed complete inventory of RTA stores and references for that verified subject, including its Firebase user/Player-ID claims/lookups, history/suggestions, friends/invitations/presence, multiplayer/session records, and SQL identity aliases/mailbox/device/promo/purchase ownership where applicable. This is a checklist to verify against RTA's actual current schema, not authority to scan users, game tables or receipts now. No raw purchase tokens or unrelated user data belongs in the company report.
3. Coverage of legacy Firebase-issuer/UID identities and verified bindings to local SQL IDs; an empty canonical-ID query is insufficient. Resolve which guest/install identities are actually owned and which are unrelated; do not sweep guest records by email/device guesses.
4. Authenticated provenance for each read-only result: store/schema/version, narrowly bound UID/alias predicate, capture time, responsible reviewer and opaque evidence reference, plus producer attestation that all relevant record classes were covered. A metadata/API failure is unknown, never “none.” Least-privilege read-only approval is separate from delete authority.
5. A trusted fence against new product ownership/writes between inventory and verified closure, with expiration and lifecycle/operation binding. A manual snapshot only describes one instant. Pass005's pinned RTA verifier did not perform current disabled/revocation checks; its Producer must verify current behavior. Until resolved, Auth disablement alone cannot establish product isolation or a fence.

No such real trusted inventory/fence adapter is implemented. A producer-reviewed manual read-only audit could contribute evidence, but the current coordinator does not accept an operator-supplied `none` boolean and this pass creates no manual proof bypass. If comprehensive isolation and fencing cannot be independently established, retain the blocker and do not execute cleanup. RTA trusted deletion API remains **PLANNED / NOT IMPLEMENTED / NOT DEPLOYED / RELEASE BLOCKER**.

## Operator-reviewed recovery/cleanup procedure

Maintain an access-controlled inventory outside Git/Hosting: exact authorized UID/canonical ID, temporary/reservation references and expiry, profile/lifecycle revision, acceptance versions/hashes/server times, Auth provider/generation information, intended scope, product evidence, retention decision/holds, operation/effect IDs and partial status. No password, token, action code or invitation secret is recorded in reports.

- Incomplete registration: reconcile exact reservation/grants/Auth/profile/mappings. Reuse stable reservation; no delete-and-recreate shortcut. A provisioning marker may represent an in-flight RPC after expiry.
- Unverified credentials: verify real mail/action in the later authorized test; inventory stalled records. Do not claim verification or orphan removal occurred locally.
- Containment: exact Auth disable/revocation requires separate operator authority and shared-product impact review. It is not deletion or proof all products enforce revocation.
- Request handling: verify scope/identity. Current normal request requires recent verified owner auth plus trusted backend permission. If the owner cannot reauthenticate, escalate to independent support verification/dual review; no email override or new administrator-originated deletion API is implemented.
- Existing authorized operation: an authorized worker may resume durable ownership after Auth stops working, subject to current permissions, product proof, retention and terminal-effect reconciliation. Cancel/hold does not reactivate the account.
- Ambiguous RPC: preserve pending/unresolved intent, stop replacement workers and obtain independently verified terminal evidence. Auth absence/presence or a timeout alone is insufficient. No real terminal verifier is available; remain blocked rather than marking success.
- Cleanup: only under fresh explicit scope/retention/authority after isolation is proven. Inventory company profile/temporary records/reservations/consent/minimal tombstone, product references and provider/support retention. The current real-company cleanup path remains disabled and blocked. No production deletion is authorized by this document.
- Completion: independently verify company minimization and approved retained evidence, Auth outcome, product outcomes/fence and every required step; publish honest partial/blocked status on failure. No completion merely from disablement, sign-out, an email or one removed record. Retention exceptions remain disclosed and reviewed.

## Three separate deployment/activation boundaries

| Capability | First registration test scope | Required controls |
|---|---|---|
| lovelysirenAccountsApi | Only candidate eligible for separate first-test approval | Registration-only package; exact approved origin; backend API/service/controlled-registration/policy gates and ONE invitation; no public registration |
| lovelysirenIdentityApi | EXCLUDED | No deployment/invoker grant; IDENTITY_RESOLVER_ENABLED false, identityResolutionEnabled false, caller allowlist empty |
| Deletion coordinator | EXCLUDED | No exported function/route; demo-only hard guard remains. No deletion IAM, worker dispatch, cleanup, effect reconciler or interruption endpoint in registration package |

Registration-only package includes accounts.js/lifecycle.js/fresh-reader.js/maintenance.js and locked dependencies. It excludes identity.js, identity-service-auth.js, deletion.js and operation-journal.js. Public/ is the approved static allowlist, not repository root: no audits, drafts, backend, environments, fixtures or node_modules. Node22 compatibility probe copies contain test probes/install artifacts and are NOT deployment artifacts; rebuild and review a clean candidate if deployment is later approved. Website Google linking and game integration stay off. Existing RTA Google Auth settings must not be disabled as a shortcut.

## Exact future approval sequence — not executed

1. **Website Privacy publication:** approve final wording and an RTA-disclosure-preserving transition; assign actual publication/effective date, immutable version/archive and verified published source hash. No draft hash may authorize consent. Terms v1.0 remain unchanged.
2. **Operational support/retention:** approve category decisions, legal holds, accountable verification/recovery/cleanup and provider logs/backups. Resolve company-only isolation/terminal-proof blockers; otherwise real testing remains not ready.
3. **Blaze/APIs:** select billing account, approve expected billable services/budget alerts/monitor and exact API prerequisites. Alerts are not a hard cap. No blanket API enable or shared-project billing kill switch.
4. **Function inventory:** after separately approved API enablement, inspect both generations/regions/codebases/services. SERVICE_DISABLED in Pass004 was not proof that names are available. Stop on conflicts.
5. **Least-privilege runtime:** approve/create and explicitly bind registration identity and required Auth create/get + RTDB get/update permissions; review shared-database reach. No Auth delete/update expansion for registration, keys or Owner/Editor grant. Validate fresh read-only REST access using that runtime credential and approved OAuth scopes/IAM without widening privileges. Private resolver/deletion identities are separate later decisions.
6. **Node22:** local locked installs, discovery, lifecycle, package isolation and disabled HTTP checks now PASS on 22.23.4. Separately verify the actual approved staging build/runtime startup; local success is not a cloud deployment or mail-delivery result.
7. **Minimal rules:** recapture live rules under approved read scope; compare against approved backup hash; add only required private account namespace/index fragment after review. Preserve concurrent RTA rules; never upload stale full local/emulator rules.
8. **Controlled HTTPS staging:** approve only registration deployment and a new exact preview channel/origin/expiry. Keep environment API and client/server gates inactive during deployment; inspect sole export/endpoint/domain before activation. Never overwrite live Hosting/custom domain.
9. **Auth email/password:** approve shared-project provider/password/enumeration configuration, exact authorized hostname, CORS and email return URLs; preserve existing providers/domains. Provider enablement may permit direct Auth credential creation outside company invitations, so approve quotas/monitoring and containment impact.
10. **One private invitation:** after all gates close, privately select one adult test identity and exact window, check UID/isolation, approve invitation and only controlled registration/policy/client gates. Identity/deletion/public registration/Google linking remain off. No real invitation secret generated here.
11. **Real verification/recovery:** authorize and prove actual email/action/return, stable UID/canonical ID, own profile/edit/phone removal, persistence, sign-out/re-login and password reset. Record sanitized outcomes and inventory; apply separately approved shutdown/retention/support procedure. Stop on critical ownership/security failures.

Pass004 cloud inspection is dated evidence and was not repeated live. All actual policy/provider/domain/billing/API/IAM/rules/deployment changes still need the relevant approvals; this checklist authorizes none of them. See prior Pass007 staging/operator reports for preserved kill-switch, rollback and cost details.
