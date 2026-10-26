# LovelySiren Account framework 001

Status: development branch only; account services and registration are disabled. This is a working UI/service framework with isolated tests, not live customer authentication.

## Pages and files

- `account/create.html`: requested registration fields, validation, unchecked policy acceptance and Google option. Missing Terms and unapproved eligibility keep the checkbox and registration buttons disabled.
- `account/sign-in.html`: Welcome Back, email/password, neutral error/loading states, recovery, Google and creation links.
- `account/forgot-password.html`: Firebase reset adapter and neutral confirmation only after a successful SDK call. Unavailable services never claim mail was sent.
- `account/verify-email.html`: resend/recheck actions and cooldown; a sent-email message appears only after a successful send. Firebase user reload and token email-verification claim are both checked; no browser flag grants access.
- `account/index.html`: signed-out account/deletion access, pending-verification/setup state, verified own-profile dashboard, sign-out and future device/purchase descriptions.
- `account/settings.html`: protected profile editing and Connected Sign-In Methods, password reauthentication before Google linking, Apple clearly marked Future.
- `account/{service,validation,ui,nav,config}.js`, `account/account.css`: modular plain JavaScript and Seaside Pastels forms. No frontend framework or client database was added.
- `account/vendor/firebase-auth.js`: checked-in, minified Firebase browser bundle built from pinned Firebase 12.19.0 (the RTA project version). It initializes only if reviewed config enables services. No analytics/database/admin SDK, secrets, or runtime fixture session is included.
- Homepage/RTA changes are limited to adding Create Account in the existing account menu and loading the session-aware navigation module. Shared CSS adds account-menu name truncation/sign-out styling only. Approved art, RTA product copy/gallery, palette and layouts are preserved.
- `backend-contract/`: proposed authenticated endpoint boundary, findings, and a tested reference server validator. Nothing here is deployed.

## Implemented service capabilities versus operational status

Code is implemented for Firebase-supported persistent auth/restoration, email/password sign-in/creation, secure email verification/recheck, resend with local plus required server throttling, neutral password recovery, Google popup sign-in, explicit linking after password reauthentication, token-backed own-profile viewing/editing, and sign-out. Errors, duplicate-submit protection, validation and accessible UI states work locally.

These Firebase-backed actions are NOT operational in the saved configuration and were NOT exercised against real customer accounts. No real email/reset messages, live provider links, customer credentials, database writes, security-rule changes or RTA source edits occurred. Firebase functions were tested using injected SDK/backend doubles, and stateful UI was tested with browser request interception confined to the test harness. Browser fixtures have no activation hook in product code.

Device management, purchases/unlocks, account deletion execution, cloud saves, rewards, and admin privileges are not implemented. Existing public deletion instructions remain accessible without sign-in. No fake data populates a signed-in production profile.

## Known integration blockers

1. RTA currently uses Firebase UID internally and friendly Player IDs in RTDB. No approved provider-independent company LovelySiren ID mapping was found. Do not invent or copy its allocator into this website.
2. No trusted website backend URL/endpoint implementation or deploy access was available. Existing RTDB rules reject the new fields and are not a substitute for eligibility/policy/identity backend functions.
3. Terms are unpublished; the current October 5 Privacy Policy needs review for native registration, display name, eligibility/DOB processing, optional phone, policy acceptance, retention and rights. Published documents were preserved.
4. Final age/child-account rules are unapproved. Registration is closed to everyone; the reference validator demonstrates an adults-only rule only when an explicit approved policy is supplied.
5. Providers, authorized domains, password policy, enumeration protection, email templates/continuation URLs and provider-linking behavior need Firebase Console/security review. Do not treat the existing client config as proof of production readiness.

The backend-contract README describes required Executive Producer/backend-owner inputs without requesting plaintext secrets. The next pass should approve the canonical identity/data contract and policies, implement trusted endpoints in the existing Firebase project, verify rules and grant workflows in emulators, then perform explicit isolated-account end-to-end QA before requesting production activation approval.

## Verification and reproduction

- 34 Node tests: registration field/date/password/phone/acceptance validation; trusted policy versions/time and DOB minimization; no SDK/network when disabled; existing project/origin/HTTPS restrictions; verified-token and own-profile isolation; rejected eligibility before credential creation; grant ordering; safe reset and resend; provider conflicts/reauthentication; restoration, sign-out and editing scope.
- Browser: all six account pages at 320/375/768/1024/1440 (30 page/viewport combinations), zero detected WCAG A/AA axe violations; inline errors, future-date/password/phone checks, no Terms dead link, closed-registration/verification state, signed-out deletion route and Firebase bundle imports. No external requests or JavaScript errors in disabled configuration.
- Isolated browser fixtures: signed-in navigation/profile restoration, safe text rendering, long username mobile layout, profile-edit feedback, linking reauth prompt, signed-out settings protection and verification cooldown/recheck.
- Site regression: homepage menus/mobile behavior and existing resources are checked separately; production is unchanged. Nine page URLs and 216 local link/resource checks passed, along with the five-width RTA regression.

Install pinned dev dependencies using `pnpm install --frozen-lockfile`. Run `pnpm test`, `pnpm build:auth`, `pnpm test:browser`, and `pnpm test:states`. Browser scripts expect the local site at `http://127.0.0.1:18765/` and Chrome at its standard Windows path (override BROWSER_EXECUTABLE if needed). ACCOUNT_QA_OUTPUT selects screenshot output; by default it is ignored `work/account-qa`. Only the test harness serves simulated auth modules; runtime config stays disabled. Browser/axe tests do not replace production Firebase integration or an assistive-technology audit.

Firebase implementation references: [password auth](https://firebase.google.com/docs/auth/web/password-auth), [persistence](https://firebase.google.com/docs/auth/web/auth-state-persistence), [Auth API verification/linking](https://firebase.google.com/docs/reference/js/auth), [Google branding](https://developers.google.com/identity/branding-guidelines).

Do not merge this branch or activate registration on production before separate security/integration review and approval.
