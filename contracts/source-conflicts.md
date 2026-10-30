# Concrete source conflicts — inspect before implementation

Pinned revisions and hashes: see shared-account-v1.md and rta-source-lock.json. Runtime sources are unchanged in Pass 005.

| Boundary | Existing source evidence | Required reconciliation |
|---|---|---|
| Permanent ID allocation | RTA `server/lib/lovelysiren-account.ts::resolveLovelySirenUser` passes random UUIDs into migration 0003 `resolve_lovelysiren_google_identity`; website `functions/src/accounts.js::identity` allocates `lsid_` IDs in RTDB | Stop product-side company allocation through a reviewed adapter; retain SQL UUID as local surrogate and existing FKs |
| Authentication | RTA `verifyGoogleFirebaseIdToken` permits only `google.com`; website supports password accounts. RTA uses jose JWT checks, without Admin revoked/disabled lookup | Provider-neutral Firebase subject resolution, current lifecycle/revocation checks; do not activate placeholder email-auth client |
| Eligibility/consent | RTA resolver creates accounts after Google token alone; website completion requires adult eligibility, invitation and approved policy | Explicit company enrollment, no implicit game sign-in enrollment |
| State | SQL resolver can return an existing disabled/deleted user's ID; heartbeat does not join active user state | Enforce lifecycle on each sensitive operation |
| Purchase foreign keys | Migration 0003 purchases/promos/mailbox/leases reference internal_lovelysiren_users.id | Verified binding preserving local keys; no destructive key replacement |
| Guest ownership | attachVerifiedGuestPromos takes installationId only | Require proven guest credential before attachment |
| Lease authority | RTA SQL lease pool is product-local; company has no lease service | One company authority, selected storage and adapter |
| Current device | verifyGooglePlayPurchase counts any active owner lease; account/entitlements accepts deviceSessionId without checking live lease | Validate requesting device's live proof |
| Stale lease actions | Release identifies owner/device only; delayed release can invalidate a renewed session | Generation/fencing extension; legacy compatibility reviewed before schema changes |
| Deletion | Inspected routes include mailbox deletion, but no trusted game-data deletion worker/coordinator | Specify and implement worker under later approval; don't infer deletion from status enum |

No production blockers have been patched. Test fixtures must not be imported by production entry points. Production Firebase, SQL and Google Play must never be contacted by this reconciliation suite.
