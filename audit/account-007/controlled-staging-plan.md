# Pass 007 controlled-test readiness and Executive Producer approvals

Status: NON-DEPLOYMENT PREPARATION COMPLETE; REAL ACCOUNT TEST NOT READY. All proposed live actions below need explicit authorization. No live Firebase call or setting change was made in Pass 007. Pass 004 inspection is dated evidence, not a freshly reverified inventory.

## Approval gates in execution order

| Gate | Executive Producer decision / verification required |
|---|---|
| Policy and operations | Approve website Privacy wording, preserved RTA transition and later publication; approve applicable retention/holds, log/backup inventory and verified support/manual cleanup procedure. No real collection until these blockers close |
| Billing | Select billing account and authorize Blaze for road-trip-arcade; approve spending expectations, responsible monitor and alert thresholds/recipients. No account number, amount or free-tier guarantee is invented |
| APIs | Authorize only needed Functions, Run, Build, Artifact Registry and IAM prerequisites; approve Eventarc only if current gen2 tooling requires it despite no event trigger. Review actual Service Usage requirements before enabling; preserve already-enabled Auth/Hosting/Storage/PubSub/Service Usage |
| Inventory | After authorized API enablement, inspect BOTH v1/v2 functions, Cloud Run services, regions, names, runtimes, codebases and shared dependencies; resolve conflicts before deploying. Pass 004 SERVICE_DISABLED 403 did not establish either endpoint name is free |
| Runtime IAM | Approve/create candidate lovelysiren-accounts-test@road-trip-arcade.iam.gserviceaccount.com and explicit function binding; no keys, Owner/Editor or default broad runtime fallback. Review minimum Auth create/get and RTDB get/update permissions, deployer actAs and platform service identities. RTDB IAM is not namespace-only; Admin bypasses client rules. No role broadening on failure |
| Rules | Separately approve only account namespace deny/index fragment based on freshly recaptured LIVE rules hash. Abort on drift. Preserve all RTA siblings; never deploy old local game/emulator rules or the private backup wholesale |
| Auth | Approve shared-project email/password enablement and supported 15–128 password-policy enforcement without forced existing-user upgrade; preserve Google, enumeration protection and existing domains. Do not enable anonymous/phone/email-link or website Google linking. Document provider enablement allows direct Auth credential requests outside the invitation flow; invitations restrict company profiles/IDs, not all Firebase Auth credential creation |
| Registration deployment | Approve ONLY the isolated account package/function below, with API gate false, inactive controls and no invitation. Verify Node22 and actual endpoint before any activation |
| Static preview | Approve only public allowlisted bundle to a NEW lovelysiren-account-test preview channel on existing Hosting site; proposed 7-day expiry needs approval. Never upload repository root or overwrite live channel/custom domain. Assigned URL does not exist until authorized creation |
| Origin and email | Review generated exact HTTPS hostname, then approve Auth-domain addition and exact CORS/client/continue-URL allowlists. Preserve default Firebase email handlers/templates unless branding changes separately approved. Verify actual verification/reset delivery and account page return behavior during the authorized test; do not claim delivery today |
| Single invitation and activation | Only after preceding gates: select one consenting adult tester privately; check existing Auth UID/ownership without automatic email merge or RTA migration; approve exact invitation/expiry/test window. Keep invitation disabled until final activation approval. Enable only registration API/client/controlled service/registration and published policy gates required for that test |
| Identity resolver | NOT part of first registration test. Separate audience/principal/IAM/fresh-token/Node22/deployment/activation approval and tests from Pass006 are required later |

Do not generate real invitation secrets in this pass. The older plan helper is not run and its default window is not an approved window. An optional second test user or real revocation test needs separate scope.

## Costs, monitoring and security

Potential costs: gen2 Run/Functions invocation/compute/network, builds, stored deployment artifacts, RTDB reads/writes/storage/bandwidth, Hosting transfer/storage, Auth applicable usage and provider email limits, logs/exports/monitoring. Shared RTA traffic may contribute; no actual estimate can be established without approved region/traffic/configuration. Review current pricing before activation; maxInstances2/minInstances0 and bounded tests reduce exposure but are not a hard cost cap.

Set approved project/service budget alerts, responsible recipients and daily spend/error/quota review during the test window; review artifact retention and log retention/costs. [Google's alerts-only budgets do not automatically cap spending](https://docs.cloud.google.com/billing/docs/how-to/budgets). No automated billing detach is proposed: it could disrupt shared RTA services. Service disablement and incident escalation need an accountable operator, not a spending guarantee.

Do not log passwords, DOB, raw bodies, invitations, action codes, user/service tokens or private profiles. Restrict logs/sinks and operator access; preserve necessary sanitized request IDs/errors only. Do not put private keys, Admin credentials or secrets in client bundles, Git or preview files. Public Firebase client settings are not an invitation/access-control substitute. Review API restrictions and mail quotas without exposing keys in reports.

## Registration versus identity deployment boundary

Prepared local artifact: `node scripts/prepare-staging-007.cjs` produces a unique ignored `work/staging-007-*/` folder; it never contacts Firebase. public/ contains 51 explicit allowlisted current static files plus two explicit aliases of the existing Google icon (53 files total), with OFF client config and OLD public privacy. The link audit found old relative image references in the two nested Terms-history pages. These byte-identical icon aliases resolve those references in the staging bundle without modifying any published Terms or live page. Backend source is in a sibling functions-account/, never public/. There is no runnable Firebase deployment config or upload command in this pass.

Registration candidate exports **only lovelysirenAccountsApi**. The generator removes both identity imports and its export/configuration block; identity.js and identity-service-auth.js are not copied. It binds the candidate dedicated runtime service account, minInstances0/maxInstances2, us-central1/256MiB/timeout30/Node22. Candidate SA creation, permissions and deployment are unapproved. Locked package dependencies are retained for reproducibility, including the unused direct Google Auth library; dependency presence does not export the private resolver. No triggers, scheduler, device/deletion/purchase function or Hosting rewrite is included.

During an eventual authorized deployment, create a reviewed Firebase config pointing at this isolated source and target only the inventoried named registration function/codebase; do not use broad `firebase deploy`, repository-root Hosting, automatic function deletion or --force. Verify discovered exports and runtime/IAM diff before execution; [Firebase supports named function deployment](https://firebase.google.com/docs/functions/manage-functions). No command was run here. Even an accidental all-functions selection against this isolated source cannot create the identity endpoint; live existing-function deletion prompts must still be rejected.

Future identity deployment must use its separately reviewed package/selector and private invoker; keep IDENTITY_RESOLVER_ENABLED false, identityResolutionEnabled false and IDENTITY_SERVICE_CALLERS empty for the first registration test. Do not grant resolver invoker permissions. The website account API is browser-facing and requires its exact Origin plus Auth/invitation/policy gates; public invocation policy for that endpoint needs explicit review, independently of the private resolver's IAM.

## Inactive-to-test configuration sequence

1. Inactive baseline: ACCOUNT_TEST_API_ENABLED=false; IDENTITY_RESOLVER_ENABLED=false; IDENTITY_SERVICE_CALLERS=[]; controls serviceEnabled=false, registrationEnabled=false, identityResolutionEnabled=false, googleLinkingEnabled=false; mode controlled-test; origins empty; policy approved=false; Privacy null. Client enabled/registration/Google/policy approved false, mode closed. All current tracked runtime/client flags remain unchanged.
2. Following separately approved legal publication, verify actual Terms/Privacy source hashes/dates/URLs and install only approved metadata as described in account-007-policy-transition.review.json. Never use a review hash or synthetic policy.
3. Deploy registration candidate and inactive static preview only after their gate approvals. Inspect endpoint result and export inventory; verify private resolver was not created or activated.
4. Approve generated hostname and exact email-return URLs; prepare reviewed private client config for the preview artifact only. No production account/config.js changes. Prepare one disabled invitation, no automatic existing-user link.
5. Final window approval may set client enabled/registrationEnabled true, registrationMode controlled-test, policies approved true and exact firebase public app/origin/backend values; server serviceEnabled/registrationEnabled/policy.approved true, correct controlled-test mode/origin, API env gate true, one invitation enabled with approved expiry. Google, identity and unrelated switches stay false. Controlled invitations and backend authorization are mandatory; never describe this as public registration.
6. Test credential provisioning, stable identity, real verification mail/action, own profile/edit/phone removal, persistence, sign-out/re-login and recovery; inventory only authorized UID. Record actual results and sanitized evidence. Stop on any policy, ownership, mail, storage exposure or IAM failure.

Static review bundle is intentionally NOT activation-ready: it serves the old current policy and inactive config. Rebuild/review later only after the approved public policy transition and exact configuration changes; do not activate this draft artifact as-is.

## Rollback and disablement

Immediate approved containment: switch ACCOUNT_TEST_API_ENABLED false; serviceEnabled and registrationEnabled false; disable the exact invitation and preview client. This blocks company account operations, including already issued grant completion under existing server gates. Keep resolver and Google off. A client switch alone is insufficient. Sign-out/disable/revocation is containment, not deletion.

Provider-enabled direct Auth operations may remain possible despite application gates; any project-wide provider disablement, credential revocation or domain removal needs separate review for RTA impact. Do not disable existing Google or remove shared domains. Preserve pre-change config/rules privately; restore only the approved minimal diff after checking concurrent RTA changes, not a stale full backup. A rollback does not erase already created Auth/company records or proof of consent. Handle them under the approved inventory/retention/manual procedure.

Rollback of staged code/channel is separate from data cleanup; no live function/domain deletion, old version rollout, log purge or production record removal is authorized by this document.

## Node22 finding

No suitable Node22 was found in the inspected available locations. Active Codex runtime is 24.22.1; cached prior runtimes are 24.19.0/24.22.1; Program Files Node is 26.13.0. No nvm/fnm/Volta installation was found at the inspected standard user locations. No software was installed and no global setup changed.

Node24 syntax/package discovery can detect local preparation defects but is NOT Node22 success. Before deployment, run clean `npm ci --ignore-scripts` against the locked functions package in an approved Node22 environment, load/discover both original function exports without live network access, load the isolated account-only entry and confirm sole export/options, and run focused backend/package compatibility checks. Repeat the controlled staging startup/HTTP gate checks on actual Node22 before activation. There is no separate Functions transpilation/build script; this is native ESM JavaScript. Any future dependency or source adjustment needs targeted retesting.
