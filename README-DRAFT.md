# LovelySiren Digital — Homepage V3 (seaside pastels)

## Contents
- `index.html`: redesign with navigation **Home | Games | Apps | About | Support | Information**, an account dropdown, one featured game, and the mascot.
- `assets/`: supplied RTA banner, official RTA icon, mascot, and current cropped hero image.
- `account/index.html`: public account-management landing page, including a discoverable path to account deletion information.
- `account/sign-in.html`: transparent placeholder; **no authentication is connected**.
- `games/road-trip-arcade.html`: introductory product page.
- `about.html`, `styles.css`, `site.js`: supporting site assets.

## Deploy with Codex (recommended)
1. Clone or update `mieczdj-bit/lovelysiren-digital-website` and create branch `homepage-redesign-v3` from the current default branch.
2. Copy all files from this ZIP into repository root (preserve relative paths).
3. Keep existing `privacy.html`, `support.html`, `delete-account.html`, `CNAME`, and any publishing configuration. Do **not** delete or overwrite them.
4. Check homepage links, desktop/mobile menus, images, and all existing legal/support/deletion links. Review account landing page using `/account/` and `/account/index.html`.
5. Commit and push the branch. Review preview or pull request, then merge when ready. **Merging into `main` may deploy GitHub Pages automatically.**

## Intentional limitations
- Hero uses an inward crop of the original porthole image, NOT a true porthole-free reconstruction. Final approved frameless art still needed.
- Auth dropdown entries are navigation only; Google and native LovelySiren authentication are not live. Do not present them as working auth.
- Footer links: Support, Privacy, Account Management. **Account deletion** remains accessible through Account Management and via the existing direct URL for compliance.
- Terms of Service and Disclaimers are shown as unlinked, not-yet-published Information-menu items rather than dead links.
- This draft includes only one featured game; expand to three as approved products become available.
- No admin dashboard, entitlements, or production account backend is deployed by these files.
