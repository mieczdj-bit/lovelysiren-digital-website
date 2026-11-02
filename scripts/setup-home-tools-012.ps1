# Workspace-local tools only. No admin rights, global installs or live services.
$ErrorActionPreference = 'Stop'
$toolRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../work/home-tools-012'))
New-Item -ItemType Directory -Force -Path $toolRoot | Out-Null
$version = '22.23.4'
$archive = Join-Path $toolRoot "node-v$version-win-x64.zip"
$url = "https://nodejs.org/dist/v$version/node-v$version-win-x64.zip"
$expected = 'cbc74b5e0982c9dbb41525fd8fb5dcd32fbee237863f7829072f4639a1ce5f20'
if (!(Test-Path -LiteralPath $archive)) { Invoke-WebRequest -Uri $url -OutFile $archive }
if ((Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash.ToLowerInvariant() -ne $expected) { throw 'Node archive checksum mismatch; stop and review the download.' }
$nodeDir = Join-Path $toolRoot "node-v$version-win-x64"
$nodeExe = Join-Path $nodeDir 'node.exe'
if (!(Test-Path -LiteralPath $nodeExe)) { Expand-Archive -LiteralPath $archive -DestinationPath $toolRoot }
if ((& $nodeExe --version) -ne "v$version") { throw 'Unexpected Node version' }
# This PowerShell process only; no system/user environment or installation changes.
$env:PATH = $nodeDir + ';' + $env:PATH
$npmCli = Join-Path $nodeDir 'node_modules/npm/bin/npm-cli.js'
& $nodeExe $npmCli install --prefix $toolRoot --no-package-lock --ignore-scripts --no-audit --no-fund pnpm@11.25.0
if ($LASTEXITCODE -ne 0) { throw 'Workspace pnpm installation failed' }
Write-Output 'Ready: Node22.23.4 on this session PATH; workspace pnpm11.25.0 installed.'
Write-Output 'From repository root: node work/home-tools-012/node_modules/pnpm/bin/pnpm.cjs install --frozen-lockfile'
