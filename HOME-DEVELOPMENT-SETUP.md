# Home development setup — Windows PowerShell

Current development branch: **lsd-website-contact-011**. Includes all website/company-account development through Pass011 plus this Pass012 handoff. Production remains separate. Do not merge/push main, deploy Firebase/Hosting, publish legal drafts, enable public registration or activate contact/marketing delivery.

## 1. Clone or safely update

Install Git for Windows independently. Use your own normal GitHub sign-in/credential manager for pushes; never put credentials in source files or clone URLs. Run in PowerShell:

```powershell
$ErrorActionPreference = 'Stop'
$repoDir = Join-Path $env:USERPROFILE 'source\lovelysiren-digital-website'
if (!(Test-Path -LiteralPath $repoDir)) {
    New-Item -ItemType Directory -Force -Path (Split-Path $repoDir) | Out-Null
    git clone --branch lsd-website-contact-011 https://github.com/mieczdj-bit/lovelysiren-digital-website.git $repoDir
    if ($LASTEXITCODE -ne 0) { throw 'Clone failed' }
}
Set-Location $repoDir
git config --local core.longpaths true
if (git status --porcelain) { throw 'Commit or preserve local changes before switching/pulling' }
git fetch origin
if ($LASTEXITCODE -ne 0) { throw 'Fetch failed' }
git show-ref --verify --quiet refs/heads/lsd-website-contact-011
if ($LASTEXITCODE -eq 0) { git switch lsd-website-contact-011 }
else { git switch --track origin/lsd-website-contact-011 }
if ($LASTEXITCODE -ne 0) { throw 'Switch failed' }
git pull --ff-only origin lsd-website-contact-011
if ($LASTEXITCODE -ne 0) { throw 'Pull needs review; do not force/reset or merge automatically' }
git status --short --branch
git log -1 --oneline
```

Use a short checkout path to reduce Windows path-length problems; core.longpaths above affects only this repository. Do not enumerate ignored node_modules/work trees to assess missing source.

Do not use a ZIP/shallow clone for continued development: historical test baselines and other remote branches are useful. The verified canonical Git remote is the URL above. Older main/legal publication commits are preserved separately; development already includes the published Terms content plus its newer navigation. No production merge is needed to resume development.

## 2. Isolated Node22 and pinned dependencies

From the repository root, use the included bootstrap. If Windows policy blocks scripts, review it first and permit it for this PowerShell process only:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
& .\scripts\setup-home-tools-012.ps1
if ($LASTEXITCODE -ne 0) { throw 'Review tool setup failure before continuing' }
node --version
node .\work\home-tools-012\node_modules\pnpm\bin\pnpm.cjs install --frozen-lockfile
if ($LASTEXITCODE -ne 0) { throw 'Locked workspace install failed; do not bypass the lockfile' }
npm.cmd --prefix .\functions ci --ignore-scripts --no-audit --no-fund
if ($LASTEXITCODE -ne 0) { throw 'Locked Functions install failed' }
node .\scripts\build-auth.cjs
```

Bootstrap downloads official Windows-x64 **Node22.23.4**, verifies its pinned SHA256, extracts under ignored work/home-tools-012 and installs pnpm11.25.0 there. It changes PATH only for this PowerShell process, not global Node or system settings. Root pnpm-lock.yaml covers the workspace; Functions also has its independently verified package-lock.json. Both frozen installs are tested. Do not delete/regenerate lockfiles to hide an install error. Workspace allowBuilds restrictions are intentional. No global pnpm/Corepack setup is required.

In **each new terminal**, select the workspace Node before running scripts:

```powershell
$repoDir = Join-Path $env:USERPROFILE 'source\lovelysiren-digital-website'
Set-Location $repoDir
$env:PATH = (Join-Path (Get-Location).Path 'work\home-tools-012\node-v22.23.4-win-x64') + ';' + $env:PATH
node --version # Must report v22.23.4.
```

The bootstrap target is Windows x64. ARM Windows must either support the x64 runtime or use a separately verified official Node22 ARM distribution/checksum; no untested ARM instructions are claimed here. Internet access is needed for official Node and npm packages. A Windows home-computer run itself cannot be proven from this machine.

## 3. Tools installed separately

- Java **21** JRE/JDK: install independently from your approved vendor and make java available in the new terminal. Verify `java -version` reports21. If you use JAVA_HOME, set it to your actual installed Java21 directory and put its bin on this session PATH. No Java binary is committed or automatically installed. This computer's optional sibling tools/jre21 directory is not needed when Java21 is installed normally.
- Google Chrome: install independently for the browser tests. The standard system install is the default. For a different installation, set its actual path in each test terminal, e.g. `$env:BROWSER_EXECUTABLE = Join-Path $env:LOCALAPPDATA 'Google\Chrome\Application\chrome.exe'` **only if that file exists**. All browser scripts now allow the override. Browser tests use the installed browser, so no Playwright browser download is required for these documented commands.
- Git and your preferred editor/Writer/Codex installation and sign-in are separate from the repository. No machine session/authentication is transferred by Git.

## 4. Isolated emulators and website previews

Terminal1, repository root, Node22 selected and Java21 on PATH:

```powershell
java -version
node .\scripts\run-emulators.cjs
```

The existing script generates ignored work/firebase.emulators.json, local test rules and functions/.env.local; it starts **demo-road-trip-arcade**, bound only to127.0.0.1: Auth19099, Database19000, Functions19501, hub19400, logging19450. No Firebase CLI login or live project permissions are needed for these demo-only flows. Wait for **All emulators ready** before previews/tests; starting tests while the Database is unavailable can time out. Stop with Ctrl+C. Never substitute the real project ID or deploy the generated files. Local fixtures do not authorize production policies or accounts.

RTA rules are optional and no longer default to another user's absolute path. Without RTA_RULES_PATH, only isolated company rules are generated; **this does not prove RTA-rule compatibility**. If a later authorized test needs RTA rules, set RTA_RULES_PATH to your independently obtained authorized local source file before starting emulators. An explicit invalid path now fails rather than silently claiming coverage. Do not fetch/copy private live database backups or modify RTA from this task.

Terminal2, Node22 selected:

```powershell
node .\scripts\contact-preview-011.mjs
```

Open **http://127.0.0.1:18771/** for the website and **http://127.0.0.1:18771/support.html** for Contact Us. This loopback server serves the explicit static allowlist and a **mock** contact endpoint; no email is sent. Use synthetic information. It generates an ignored local-only HMAC key and demo contact records. It does not need live email/bot credentials and does not activate account registration. No cloud account or customer data is copied.

Optional existing account preview, in another terminal with Node22:

```powershell
node .\scripts\account-emulator-preview.cjs
```

Open http://127.0.0.1:18766/account/index.html. Accounts initially remain signed out/unprovisioned; no real identity is created. Local account-registration exercises require separately running `node scripts/seed-emulator-preview.cjs` against the running demo emulators and using its **explicit synthetic** invitation. This is optional, changes only local demo controls, and is not needed for website/contact review. Pass010 preferences are exercised by its scoped emulator/browser fixture tests; the older18766 preview does not enable those controls. Do not manually turn production flags on to emulate those fixtures.

## 5. Focused checks and continued work

With demo emulators running, use Node22 from the repo root:

```powershell
node .\scripts\test-contact-011.cjs
```

For offline packaging/tool checks (no live email/Firebase calls):

```powershell
node .\scripts\check-contact-011.cjs
node .\scripts\prepare-staging-007.cjs
```

When changing the relevant account areas later, choose their existing focused runners rather than repeatedly running every suite:

```powershell
node .\scripts\test-contact-010.cjs   # Contact information/preferences + affected account checks.
node .\scripts\test-preflight-009.cjs # Transaction/lifecycle/identity security checks.
node .\scripts\check-node22-009.cjs   # Clean full/registration-only package compatibility.
```

Some older visual suites expect the18765 legal-review server from earlier work and private historical-inspection tests intentionally require unavailable private evidence. They are not the home bootstrap/smoke test. Do not copy backups or fabricate evidence to make those pass. No full historical/security regression is required simply to move computers.

Open the cloned folder in your editor/Writer/Codex. Have the next session read this handoff, WEBSITE-CONTACT-011.md, ACCOUNT-CONTACT-PREFERENCES-010.md, ACCOUNT-PREFLIGHT-009.md and the linked contracts/approval restrictions before editing. All canonical source, tests, public config templates and reports are in Git; ignored generated artifacts are recreated. Give the agent the actual home checkout path, not this computer's old path.

Before continuing or pushing:

```powershell
git status --short --branch
git fetch origin
git pull --ff-only origin lsd-website-contact-011
# Review and commit only intended source changes; do not blindly add ignored artifacts.
git push origin lsd-website-contact-011
```

If home and office diverge, stop for an ordinary reviewed integration; never force-push. Do not push main, deploy, activate delivery/marketing/registration, publish policy drafts or change RTA.

## 6. Public templates versus private files

Tracked public/inactive configuration: account/config.js, support/config.js, functions/runtime.env.example, firebase.functions.json, firebase/account-namespace*.json, staging/*.review.json and the static allowlist. They contain no live mail/bot/Admin credentials. The runtime template stays off; do not treat it as approved activation instructions.

Ignored/private/recreated: .env*, functions/.env.local, work/, node_modules/, debug logs, tool runtimes, emulator databases, private inspection backups, real invitations and service credentials. Keep existing .gitignore unchanged. Never send secrets through Git, even to move computers. Live Firebase CLI authentication, IAM/API/billing access and provider credentials are neither required nor transferred for this local setup. Source-only pushes to the development branch are authorized; live changes remain separately gated.
