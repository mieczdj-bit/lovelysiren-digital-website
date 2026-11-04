# Pass 013 focused test results

**Runtime:** Node 22.23.4; Auth, RTDB and Functions emulators on loopback using `demo-road-trip-arcade`. The database was isolated from RTA records; tests created disposable synthetic emulator accounts and RTA sentinels, then removed their scoped data. No production Firebase request, live account, or real-world email was used.

## Passed

- `node --test tests/service.test.js` — **28/28** account-client/service unit cases, including controlled Google enrollment ordering/kill switch and email-verification token-listener reconciliation.
- `node --test tests/accounts.emulator.mjs` — **26/26** top-level/subtests. Covers password registration/provisioning, actual emulator verification/recovery/sign-out, settings and policy refresh, canonical-ID concurrency, explicit existing-Google UID enrollment, wrong-UID rejection, concurrent/repeated grant completion, the integrated `identity.resolve.v1` result using a test-injected service-token verifier, disabled/missing feature gates, and preservation of RTA UID/Player ID/game/purchase sentinels. Cleanup includes the new Google grant/reservation groups.
- `scripts/test-identity-006.cjs` — **20 cases** across unit and emulator resolver suites: read-only/stable IDs, missing company account, Google/password subject validation, revoked/disabled users, lifecycle/policy/mapping conflicts, injected trusted-service token checks, unauthorized callers and closed HTTP gate.
- `scripts/test-preflight-009.cjs` — **63 cases** across transaction/fresh-reader, lifecycle, Pass 008 deletion foundation, Pass 009 concurrency/preflight and identity resolver suites. Product and terminal-proof adapters remain explicit fixtures.
- `node tests/browser-emulator.cjs` — **PASS** actual browser against local site and Firebase emulators: adult-first invitation, password creation, verification action, dashboard/persistence, policy renewal, Settings edit, sign-out/re-login and password-recovery request. No external requests or browser JavaScript errors.
- `node --check` on changed JavaScript sources/tests and JSON parsing of account rule templates — **PASS**.

The first focused runs exposed a stale Settings button assertion and missing `.indexOn: expiresAt` for the new expiring Google records. Both the test expectation and review/emulator rule templates were corrected; the final affected runs passed with those templates loaded. This is a source proposal only. No production rules were changed.

The resolver emulator uses a test-only injected signed-token verifier; it does not prove deployed Google key discovery, Cloud IAM, HTTPS ingress, current live settings or real RTA caller forwarding. Those remain staged/approval-only checks.
