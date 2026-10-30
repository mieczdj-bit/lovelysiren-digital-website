# Pass 005 reconciliation verification — October 30, 2026

Result: contract proposal prepared; current-source incompatibilities reproduced. No runtime implementation changed, no live settings changed, no deployment or migration performed. RTA checkout remains on its original main commit with its pre-existing untracked assets intact; only remote refs were fetched. Website work is isolated on `lsd-account-rta-contracts-005` from Pass 004 commit bc38faf.

## Results

- 7 compatibility cases plus parent: 8/8 passed against real local Firebase Auth/RTDB emulators and an isolated in-memory PGlite database executing the pinned RTA migrations.
- Existing website unit suite: 47/47 passed (`node --test tests/*.test.js`).
- All 25 extracted source files matched committed SHA-256 pins; `git diff --check` passed.
- No website or RTA production code, public pages, rules, account flags or Firebase settings changed.

Compatibility cases cover: real emulator password token/UID preservation; injected RTA Google-provider gate rejection; competing stable RTA UUID creation; company minor eligibility; real RTA purchase repository owner preservation/replay rejection/FK mismatch with unmapped canonical ID; two-device limit and twenty-minute expiry; disabled-user resolution/heartbeat gap; Admin rejection of disabled account. Play transport uses synthetic responses only. RTA production JWT/JWK verification is not exercised: provider testing uses its existing injected verifier seam, not a forged real-project token. No Google Play or live database service is called.

The suite creates/removes only its uniquely prefixed emulator Auth user and `contractReconciliation005/<uid>` RTDB fixture; it does not clear all users, change company controls or enable registration. SQL is in memory. Existing registration tests are independent; no shared controls were changed by this task.

## Reproduce

Start the existing demo Firebase emulators using the repository's emulator instructions. Node, website dependencies, and RTA development dependencies (PGlite/jose) must already be installed. The RTA checkout must contain the pinned commit; no checkout switch is needed.

```powershell
$env:RTA_SOURCE_REPO='C:\path\to\RoadTripArcade'
$env:FIREBASE_AUTH_EMULATOR_HOST='127.0.0.1:19099'
$env:FIREBASE_DATABASE_EMULATOR_HOST='127.0.0.1:19000'
node scripts/prepare-contract-source.cjs
node --test --test-timeout=60000 tests/shared-contracts.emulator.mjs
node --test tests/*.test.js
git diff --check
```

The extraction helper reads pinned git blobs, verifies hashes and writes only ignored `work/` files. Tests refuse missing/non-loopback emulator host settings. They import pure RTA account/purchase helpers, never its live SQL initialization module or real Play transport. An unavailable npm shell shim was bypassed by running the package's exact Node test command directly.

## Limits and next gate

These passing tests include expected-conflict assertions. They do not mean shared production compatibility passed. No identity-resolution endpoint, shared lease authority, canonical ownership adapter or deletion coordinator was built. No trusted RTA game-data deletion worker was found, so no real deletion compatibility test can honestly pass yet. Contract tests for future service authentication, binding concurrency, cross-product lease fencing, lifecycle races and deletion retry/retention must be implemented against the eventual real adapters; a mock-only green test would not close these blockers.

Review `shared-account-v1.md` for all four proposed interfaces and `source-conflicts.md` for concrete blockers. Approvals needed before the next implementation: common contracts and errors; trusted service transport/IAM; lease storage and slot policy; per-account binding plan; deletion worker/retention contract. Pass 004 Privacy approval, Firebase activation and production deployment remain separately gated. No first real account is activated by this work.

## Producer clarification incorporated — October 30, 2026

Producer confirms the trusted RTA deletion service does not exist: **PLANNED / NOT IMPLEMENTED / NOT DEPLOYED / RELEASE BLOCKER**. RT-017 was blocked by client deletion rules and introduced no partial handler. RT-038B links and mailbox operations are not deletion-service evidence. The contract now records the historical rule blockers with producer attribution and the required service acceptance criteria. No further completed-handler search is needed. This follow-up changes documentation only; previous test results remain historical results for the unchanged code. Documentation diff validation passed; no runtime retest, live change or deployment was needed.
