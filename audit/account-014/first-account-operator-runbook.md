# Pass 014 — First controlled LovelySiren Account operator runbook

**Preparation only. Do not execute until the Executive Producer approves both policies, the staging project/host/IAM/rules, one test journey, one adult tester, exact activation window and shutdown owner.** No test account or invitation was created in Pass 014. Use synthetic/local emulators for rehearsal; production RTA/customer data must never be used as test data.

## Preflight common to either journey

1. Confirm the staging candidate commit and manifest; confirm the one registration function is in the approved region/codebase, running as the reviewed runtime identity, and has no identity resolver, contact, marketing, deletion, maintenance or Hosting export.
2. Confirm the approved HTTPS staging host, exact backend/client origin, email-action URL and Auth authorized domain. Verify the current Auth providers and RTA integrations are unchanged. Confirm the exact privacy/terms versions, source hashes and served page links match the approved values.
3. Confirm the candidate points only to the separately provisioned account-only RTDB instance via `ACCOUNT_DATABASE_URL`; verify its reviewed root rules and the scoped `lovelysiren-account-service` override. Confirm with read-only inspection that the RTA default database URL and rules are unchanged and inaccessible to the account runtime. Test denied access for a normal client/foreign identity before the account journey.
4. Independently verify the adult tester and choose exactly one path below. For existing RTA Google: the RTA Producer verifies the actual existing Firebase UID, `google.com` provider and affected RTA data inventory through authorized records; the tester confirms which Google account they will select. A matching email alone is insufficient.
5. Generate one invitation privately only now. Use the existing operator helper with the approved test email; for the existing Google journey include the independently verified UID. Keep its output under ignored `work/test-activation`, deliver the code out-of-band, and never place it in a ticket, source file, shell transcript, screenshot or report. Configure only the exact staging origin and one invitation.
6. Start the account API with a smoke check while all gates are closed. Confirm it is inactive. Then apply only the approved account service + registration gates; set Google enrollment true only for the existing-Google test. Public/open registration stays off. Identity resolver, contact, marketing and deletion stay off.

## Path A — new invited email/password account

1. Tester opens the staging Account page, completes the age gate, reviews both approved published policies and accepts them. Use a private email controlled by the tester and a unique password manager-generated password. The code asks for age but persists only the adult result.
2. Tester enters the invitation, display name and email/password. The operator verifies that one Firebase Auth UID and one canonical `lsid_` were created; do not log tokens, password, full DOB or invitation. The profile is available only after email verification.
3. Tester opens the verification email and returns only to the staging HTTPS page. Confirm verification, successful sign-in, own Account Settings read and a permitted display-name/phone update. Optional contact details may be left empty. No mailing address/marketing functions are part of this candidate.
4. Sign out, sign back in, verify the same Firebase UID and same canonical ID. Run password recovery with the same test email and confirm the generic response and staging reset URL. Use the link once and verify account access remains to the same ID.
5. Confirm that policies shown and accepted remain current. Confirm the invitation is consumed and cannot create another account. No RTA profile, Player ID, game, purchase or entitlement record is written by this flow.

## Path B — explicit enrollment of an existing RTA Google identity

1. RTA Producer privately supplies the verified existing Firebase UID and records which RTA datasets/identity fields must remain unchanged. Separately verify the matching Google provider, enabled Auth user and verified email. Never use an email search as the ownership check.
2. Bind the one-use website invitation to that exact UID and normalized email. The adult tester enters their own current age and approved policy acceptance on the staging page. The Google prepare operation validates the invitation and existing Auth provider before the Google popup.
3. Tester selects only the already verified invited Google account. If the displayed Google account/UID is uncertain, cancel; do not try other identities. The backend must return the same UID, verified email and `google.com` provider, then create exactly one company mapping/profile. Check that a second/repeated completion returns the same `lsid_`.
4. Read/update Account Settings, sign out/sign in and confirm the same RTA Firebase UID and canonical company ID. Do not change RTA Player ID, SQL UUID, game progress, friends, suggestions, sessions, purchases or leases. RTA Producer verifies the exact pre/post state through the approved RTA-side check.
5. If a different/new Google account is accidentally selected, the company enrollment must reject it and sign out. It may still create an Auth identity for that newly selected Google user. Stop; privately reconcile Auth users and do not delete or retry until the Producer/operator has an approved resolution.

The password path and existing-Google path have different identity semantics; do not switch the same invitation or tester between them during the window.

## Stop, recovery and closeout

- **Email link expired/not received:** use the approved resend/recovery action once, confirm its URL remains staging, check provider delivery and time. Do not create a second invitation or account to work around uncertainty.
- **Interrupted password provisioning / unknown response:** close registration gates; record the test reference and exact Firebase UID privately if known; inspect only that UID, invitation/grant/reservation and company namespace entry. Do not repeat credential creation until the current state is reconciled. Do not delete an unexpected Auth user.
- **Google mismatch or duplicate:** close Google/registration gates immediately; retain both Auth and RTA data; reconcile the invited UID, selected UID and company mappings privately. Do not link by email or assign an ID to the other user.
- **Missing/duplicate canonical mapping, stale policy, unexplained 401/403/409/503, wrong origin, unexpected write or inability to verify:** stop and keep gates closed. Preserve logs only if sanitized and authorized. Escalate; no manual RTDB edits, purchases, migrations or deletion.
- **Any RTA sentinel changed:** stop all writes and involve the RTA Producer. Do not “repair” from website source or restore a broad DB backup.
- **Shutdown:** set `ACCOUNT_TEST_API_ENABLED=false`/unset; set account `serviceEnabled`, `registrationEnabled` and `googleEnrollmentEnabled` false; disable the single invite; verify registration/completion return inactive. Keep identity resolver, contact, marketing and deletion off. Confirm protected profile calls fail while closed. Preserve the test account and company record pending an approved retention/reconciliation decision; disabling access is not deletion.
- Reconcile the one expected Auth user, company profile/mappings, policy history and temporary records. Run only approved bounded cleanup against expired scoped records after the window. No company deletion or RTA data deletion is authorized by this runbook.

### Account/Google interface used by the candidate

- Password preparation/provision/completion: `registration/prepare` → `registration/provision` → `registration/complete`; email verification through Firebase Auth.
- Existing Google: `registration/google/prepare` → Google sign-in → `registration/google/complete`.
- Account read/update: `profile/read`, `profile/update`; authenticated Firebase ID token required.
- Recovery: Firebase Authentication's configured email reset action.

All routes are behind the inactive account service/API gate and policy controls until a separately approved test window.
