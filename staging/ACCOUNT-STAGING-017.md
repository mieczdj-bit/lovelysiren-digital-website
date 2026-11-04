# Pass 017 — local review and no-cost staging preparation

This runbook prepares review artifacts only. It does not create Firebase resources, deploy, enable registration, publish policy, or activate billing. All generated files and local configuration belong under ignored `work/`.

## Local policy review

From the repository root in PowerShell, using Node 22:

```powershell
node scripts/prepare-privacy-review-017.cjs
node scripts/preview-local-review-017.cjs
```

The preview listens only on `127.0.0.1:18767`. Review `/privacy.html`, `/games/road-trip-arcade-privacy.html`, `/delete-account.html`, and `/legal/archive/privacy-2026-10-05.html`. Press Ctrl+C to stop. Do not deploy this artifact. The RTA B2 banner is an internal review annotation, outside Producer legal copy; it states that B2 is development-only and not verified deployed. Existing live customer language remains controlling.

## Build isolated staging candidates

```powershell
node scripts/prepare-account-staging-017.cjs
```

The command prints the ignored artifact directory. Its `firebase.account-017.json` has named but unbound `account-staging` Database and Hosting targets, serves only the existing public allowlist, sets `X-Robots-Tag: noindex, nofollow`, and includes the inactive account-only function candidate. It does not bind a target to a cloud resource. The separate deny-all rollback rules lock the isolated database; they do not delete its data. Current RTA default Database rules are not included as a deploy target.

## Publication record process

1. Obtain Executive Producer approval naming the exact policy document/version and reviewed source SHA-256. Keep the privacy and deletion pages in review status until then.
2. After approval, choose the actual publication date. Replace the pending effective-date placeholder only in the approved source and verify the source hash matches the approval.
3. Build the public legal page package in a separate publication change. Verify the published route, rendered bytes, links, accessibility and exact output hash. Archive that immutable version and update `legal/policy-versions.json` only in that separately approved change.
4. Update account policy acceptance to the same published version and exact approved content hash only after the published bytes have been verified. Keep Terms v1.0 unchanged.
5. Publication/deployment and account activation require their own explicit authorization. Do not infer approval from this local review.

## Cloud setup after the Producer returns

No cloud commands below have been run. They are contingent on separate approval, verified project access, confirmed no-cost plan eligibility, and the operator supplying resource IDs issued by Firebase. Do not run them while billing is postponed.

From the generated artifact directory (not the repository root), first confirm `firebase --version` and `firebase projects:list`. Do not change the project. Bind the targets only after approved resources exist. Use the printed artifact path:

```powershell
$Artifact = 'C:\path\printed\by\prepare-account-staging-017'
Set-Location $Artifact
$AccountDatabaseId = '<approved isolated database instance ID>'
$AccountHostingSiteId = '<approved dedicated Hosting site ID>'
firebase target:apply database account-staging $AccountDatabaseId --project road-trip-arcade
firebase target:apply hosting account-staging $AccountHostingSiteId --project road-trip-arcade
```

Firebase CLI writes target mappings to `.firebaserc`; keep that machine/resource-specific file local in `work/`, never commit it. Confirm the resolved database URL belongs to the dedicated LovelySiren account database and not the RTA default database. Configure the runtime service account and least-privilege IAM only after a reviewed security design and approval. Never place service credentials in browser code or Git.

Before any functions deploy, prepare a private, ignored `functions-account/.env.road-trip-arcade` with the exact isolated `ACCOUNT_DATABASE_URL`, `ACCOUNT_TEST_API_ENABLED=false`, `IDENTITY_RESOLVER_ENABLED=false`, and approved service caller settings. Do not put secrets in the file or commit it. The current candidate has service and public account gates off. A Google or email provider/domain change and any registration invitation require separate approval and operational checks.

After approvals, and only to the named staging resources, the following exact-target commands are the candidate commands:

```powershell
firebase deploy --only functions:lovelysirenAccounts014Api --config firebase.account-017.json --project road-trip-arcade
firebase deploy --only database:account-staging --config firebase.account-017.json --project road-trip-arcade
firebase hosting:channel:deploy account-staging-review --only account-staging --config firebase.account-017.json --project road-trip-arcade
```

The Hosting channel is a noindex review channel. It is not the public production site. Run the Functions command only after reviewing the generated candidate and exact isolated DB binding; keep API/registration/Google gates off until a controlled account test has separately been approved.

## Rollback

- Functions: preserve the exact last-known-good candidate artifact directory. From that artifact directory, redeploy its candidate using `firebase deploy --only functions:lovelysirenAccounts014Api --config firebase.account-017.json --project road-trip-arcade`.
- Database: from the Pass 017 artifact directory, run `firebase deploy --only database:account-staging --config firebase.account-017.rollback.json --project road-trip-arcade`. This applies deny-all rules to the same bound isolated instance. It blocks access but does not erase records. Retain the prior approved account rules artifact for deliberate recovery.
- Hosting review channel: first preserve an approved good version in a separate review channel, then clone that channel into the staging review channel. Never use `live` as source or target here.

```powershell
firebase hosting:channel:deploy account-staging-last-good --only account-staging --config firebase.account-017.json --project road-trip-arcade
$Source = "${AccountHostingSiteId}:account-staging-last-good"
$Target = "${AccountHostingSiteId}:account-staging-review"
firebase hosting:clone $Source $Target --project road-trip-arcade
```

The clone syntax and preview-target syntax follow the Firebase CLI deploy-target and Hosting multisite documentation. Confirm the exact CLI version and channel/version IDs during the approved staging session.
- Record the deployed artifact hash and inspect service state after rollback. No Pass017 rollback command has been executed.

## Remaining human/cloud decisions

- Executive Producer approval of final Website Privacy, RTA Privacy and Account & Data Deletion content, exact versions and actual publication date.
- Post-vacation approval and confirmation of whether the selected Firebase plan/resources are genuinely no-cost; no billing is authorized by this pass.
- Exact isolated database and Hosting site IDs, creation owner, runtime service account/IAM grant, email provider/domain settings and authorized-domain values.
- Controlled first-account tester, invitation procedure, test window and rollback owner.
- RTA B2 deployment verification and RTA Producer sign-off; no website copy here implies B2 is live.
