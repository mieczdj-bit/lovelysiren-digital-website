# Contact and communications contract — review only

November 2, 2026. Development source/local emulator only. No collection under an unapproved live disclosure, no sender and no production authorization.

## Ownership and storage

All paths below are under private `lovelySirenAccountsV1`, not RTA `users` or Player IDs. Existing account namespace client-deny rules apply; no rule changes were made. The HTTP entry verifies/revocation-checks the Firebase token; ownership derives exclusively from its server UID and both canonical mappings. Requests cannot choose a UID or LovelySiren ID. No contact values are logged or returned by the identity resolver.

| Path | Contents | Closure treatment |
|---|---|---|
| `profiles/{uid}` | Existing displayName/phone plus optional address `{street,line2,city,region,postalCode,country}` and contactRevision | Replace with existing minimal lifecycle tombstone; erase address/phone |
| `marketingPreferences/{uid}` | firebaseUid, lovelySirenId; independent email/sms/postal records; immutable action history; closure marker if retained | Explicit new marketingEvidence retention decision: erase, or retain minimized history with every channel off, no contact binding and closed marker |
| Channel record | selected, monotonic revision, status, wordingVersion, selectedAt or withdrawnAt, hash binding when selected, last request ID/expected revision | No sending capability; hashes remain private personal data, not anonymization |
| History | Channel, selected/withdrawn, timestamp, revision, wording version, expected revision, authenticated-settings-action evidence and lifecycle revision; automatic contact-change reason | No IP, DOB, raw token, user-agent, email, phone or address copied into history |

All address fields are optional, Unicode, length bounded and single-line; no US-only state/ZIP rules. A completely blank object removes the address. A preview postal candidate requires street/city/country, not postalCode/region; this is not universal deliverability validation. Future providers must apply country-specific requirements. Partial addresses remain editable but cannot qualify for a postal campaign.

## Existing profile contract

`POST profile/read` adds owner-only address and contactRevision. `profile/update` retains displayName and optional phone, adds address and expected contactRevision. Recent authentication is finite, not in the future beyond 30 seconds, and within five minutes. New contact edits require exact demo project/loopback plus test-fixture disclosure/config. Current Auth/HTTP credentials remain the existing account security boundary.

Contact updates atomically compare profile lifecycle/revision, canonical mappings, configuration and contactRevision. Phone changes withdraw SMS; address changes withdraw postal, including edits as well as removal. They never grant permission. Legacy narrow profile writes remain available only for revision-zero profiles; SMS/postal enrollment requires a versioned contact save first. Once versioned, older clients receive contact-refresh-required rather than overwriting new data or bypassing withdrawal. Root transactions are retained for cross-profile/consent consistency; Pass009 root-scale limitations still apply.

## Separate preference API

Protected routes: `POST preferences/read` with `{}`; `POST preferences/update` with:

```json
{"channel":"email","selected":true,"expectedRevision":0,"requestId":"pref_00000000-0000-4000-8000-000000000010","wordingVersion":"promotional-preferences-review-010"}
```

Response is `{wordingVersion,channels:{email,sms,postal}}`; each channel contains selected, revision, status, deliveryEligible. Missing records mean selected=false/revision=0. Every deliveryEligible is always false in this pass. SMS selection is only pending enrollment. Neither a selected email nor postal checkbox is campaign authorization.

The exact review wording version is synthetic fixture evidence, not legally approved SMS consent. Production cannot bypass the hard demo/loopback/test-fixture guard by merely setting the database flag. Client `contactPreferencesEnabled` is false in tracked configuration. No new environment activation flag or IAM grant was introduced.

Each channel update requires explicit action, recent authentication, exact channel revision and immutable server-derived ownership. Selecting requires current verified Auth email matching token email; email binding uses that actual address. SMS requires stored phone; postal requires usable stored address. Phone verification, reviewed express-consent language and provider activation do not exist yet. Withdrawing does not require a contact value and never changes other channels, account eligibility or game data.

Retries use the same request ID and original input. Persisted action replays return current state, never reapply old permission; mismatching reuse fails. Same-channel conflicting revisions return 409, so the caller reloads and reviews before another action. Independent channels can change concurrently. Even reaffirming off advances its revision to fence older opt-ins; repeated off actions retain only latest idempotency metadata, not redundant history. At 1,000 meaningful history records, new opt-ins stop for review; withdrawals remain available. No history is silently truncated. A failed/stale withdrawal is visibly unsuccessful and must be retried with refreshed state; no automatic consent-grant retry exists.

Possible errors include invalid-input/address, contact-required, contact-refresh-required, contact-changed, preference-changed, request-id-conflict, identity-conflict, account-unavailable/setup-required, verify-required, recent-login-required, configuration-changed, contact-preferences-inactive and preference-history-review-required. Existing API maps known sanitized errors; no raw Firebase payload is logged. Concurrent lifecycle closure or contact changes invalidate in-flight writes. UI confirms only server-confirmed saves and does not present a failed save as success.

## Future unsubscribe and delivery — design, not implemented

No provider, campaign export, subscription endpoint, mailing integration or delivery queue is implemented. Do not read selected alone to send. Any future sender needs explicit channel/program approval, live verified destination, current canonical ownership and lifecycle, policy/wording approval, latest revision and suppression state checked at dispatch. It must reject closed, missing, stale and pending states.

Email unsubscribe should use opaque purpose-limited tokens stored hashed, bound to account/channel, with replay-safe withdrawal and no sign-in requirement. Provider webhooks need verified signatures, replay protection and server-side destination/account binding. SMS STOP and other applicable unsubscribe requests must promptly suppress and cancel queued sends; verified opt-in and later re-enrollment require separately reviewed flows. Postal suppression similarly needs an authorized opt-out path. Withdrawal/suppression must be checked by every downstream list and cannot be overwritten by an old export or webhook. Essential verification/security/recovery flows remain separate. None of these future public endpoints is enabled here.

## Retention decisions still required

The Executive Producer/legal review must decide consent evidence purpose/minimum, retention/review/removal criteria, legal holds, suppression retention without retaining unnecessary destinations, provider logs/backups, international rights and handling of already exported delivery lists. No legal duration is asserted. Local deletion refuses old plans missing marketingEvidence; no default erasure or retention is inferred. Full RTA isolation/fence/deletion and terminal-proof blockers from Pass009 remain unchanged.
