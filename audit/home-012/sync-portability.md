# Pass012 sync and portability verification

November 2, 2026. Source-only handoff on lsd-website-contact-011; base70d8bdbaef78d2f728c92c9c0f8392ad50dc435e. No main push, merge, deployment, live settings, registration, delivery or legal publication.

## Source and branch audit

Initial development and production worktrees were clean. origin was fetched and its repository URL verified. No local commits were absent from all remote-tracking branches. All development branch tips (including every Pass001–011 branch and earlier website/RTA website branches) are ancestors of the current development branch. Production main and its older publication branch retain separate publication commits; their Terms content is incorporated in development, with newer development-only account/navigation markup. No unrelated merge or new production push was needed.

| Local branch | Audited tip | Upstream | Ancestor of development | Commits absent from all remotes |
|---|---|---|---|---|
|homepage-redesign-v3|325aa6a4036d|origin/homepage-redesign-v3|True|0|
|lovelysiren-site-icons|66496f5c0ee3|origin/lovelysiren-site-icons|True|0|
|lsd-account-canonical-identity-006|221170faa824|origin/lsd-account-canonical-identity-006|True|0|
|lsd-account-contact-preferences-010|8fa4ef4e81d2|origin/lsd-account-contact-preferences-010|True|0|
|lsd-account-framework-001|58ad49e63bd1|origin/lsd-account-framework-001|True|0|
|lsd-account-integration-002|0a4a7b54522b|origin/lsd-account-integration-002|True|0|
|lsd-account-legal-003|dc59bb6c96ec|origin/lsd-account-legal-003|True|0|
|lsd-account-lifecycle-008|9aa486892105|origin/lsd-account-lifecycle-008|True|0|
|lsd-account-preflight-009|327905023c65|origin/lsd-account-preflight-009|True|0|
|lsd-account-privacy-firebase-004|bc38faf1953a|origin/lsd-account-privacy-firebase-004|True|0|
|lsd-account-privacy-readiness-007|206b7cfb82cc|origin/lsd-account-privacy-readiness-007|True|0|
|lsd-account-rta-contracts-005|0a027348777a|origin/lsd-account-rta-contracts-005|True|0|
|lsd-website-contact-011|70d8bdbaef78|origin/lsd-website-contact-011|True|0|
|main|a407de16f888|origin/main|False|0|
|publish-website-terms-v1|061ff11931bf|origin/main|False|0|
|rta-base-copy|1d94cfca7818|origin/rta-base-copy|True|0|
|rta-base-theme-packs|ad2bda78c564|origin/rta-base-theme-packs|True|0|
|rta-product-page|27c4e3a43dda|origin/rta-product-page|True|0|
|rta-scattered-gallery|78a94f9e7eb9|origin/rta-scattered-gallery|True|0|
|rta-specific-game-limits|2c918288385f|origin/rta-specific-game-limits|True|0|

The publication branch tracks origin/main and has no unpushed work; its commit is already on origin/main. No old branch was deleted, rewritten or force-pushed. After this handoff commit, only the current development branch needs a normal push. Its final SHA and GitHub equality are reported in the completion message.

## Coverage through Pass011

- Website/homepage/RTA product artwork, styling/navigation and supporting pages are tracked.
- Pass001 account frontend,002 authenticated backend/config/tests,003 legal source/versioning and004 inspection/security reports/templates are included. Private live-rule backups and credentials intentionally are not.
- Pass005 shared contracts and006 canonical identity/service-auth source/tests are included; RTA trusted deletion remains an explicit release blocker.
- Pass007 review/staging scripts,008 lifecycle/deletion foundation,009 transaction/concurrency/Node22 source/tests/reports are included.
- Pass010 optional contacts/promotional preference records/UI/review text and011 Contact Us handler/store/provider/bot interfaces/static files/tests are included. All live gates remain inactive.

## Portability corrections

Fresh frozen pnpm installation initially failed because Functions declared google-auth-library11.3.1 but the workspace importer omitted that direct dependency. Regeneration added only three importer lines; resolved package versions and integrity entries did not change. Frozen workspace installation and independent Functions npm ci then passed.

Removed the original user's absolute RTA rules path from emulator preparation. RTA_RULES_PATH is now optional/explicit; a supplied invalid path fails. Default home tests use isolated company rules and do not claim RTA compatibility. Added BROWSER_EXECUTABLE overrides to the remaining four browser tools that lacked them; default standard Windows Chrome remains. Runtime/product logic did not change.

Added checksum-pinned workspace-only Node22.23.4/pnpm11.25.0 PowerShell bootstrap and HOME-DEVELOPMENT-SETUP.md. Java21, Chrome, Git and editor installation/sign-in remain independent tools. No binaries or global environment changes are committed. Windows long-path limitations favor a short home checkout and repository-local core.longpaths; ignored dependency trees need not be recursively enumerated.

## Focused verification and private information

A fresh GitHub clone, with only the reviewed portability patch applied, installed all pinned workspace dependencies and245 Functions dependencies using actual Node22.23.4. The public auth bundle rebuilt without a tracked content change. Static/account/contact review packages generated from source; Firebase CLI15.34.1 loaded. Two affected static/package/link checks passed. The installed browser override and local preview use synthetic demo fixtures. Fresh-clone emulator startup passed with independent Java21 and host Node22 on the documented loopback ports. A browser check started before the demo Database was ready timed out; it was rerun after the emulator ready signal. Always wait for all emulators ready before tests. Full historic/security suites were not rerun.

The Node bootstrap itself downloaded and verified the official pinned archive and installed the pinned workspace tool. Existing independent Java21 is used for emulator startup, not copied into source; the home computer must install Java itself. The actual second computer cannot be tested remotely from this checkout. Existing files under work/, node_modules/, private env files and debug logs remain ignored. git check-ignore confirms their representative paths. Tracked-source heuristic scan found no private-key/API-key/token patterns; inspection reports contain sanitized configuration summaries, not private backups/customer exports. Synthetic fixture passwords/invitations are explicitly local-only; no real invitation or credential was added. Existing .gitignore was preserved.

Commands and limitations: [HOME-DEVELOPMENT-SETUP.md](../../HOME-DEVELOPMENT-SETUP.md). No uncommitted source or outstanding local branch work may be left after the final push. Ignored recreated tools/dependencies/test artifacts and local authentication are intentionally not synchronized.
