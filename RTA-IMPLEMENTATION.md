# Road Trip Arcade product page — October 26, 2026

Implemented a concise product briefing using the existing Seaside Pastels system, header/account navigation, and footer. Includes seven games, family/private-play copy, learning extras, Free advertising disclosure, intended U.S. $6.99 one-time Base pricing and limits, private multiplayer/Trip Seeds, planned December 14 Android launch, and passenger safety information. No store URL, checkout, authentication, or admin functionality was added.

Five supplied screenshots were copied unchanged into assets/rta with descriptive PNG names. Lossless WebP derivatives at the original dimensions are used for thumbnails; enlargement opens the original PNG in a native modal dialog. Without dialog support or JavaScript, image links remain usable. Escape/Close returns focus to the invoking link.

Verification:
- RTA page checked at 320, 375, 768, 1024, and 1440 pixels.
- All images decoded; no page overflow or JavaScript errors.
- All five screenshots opened by keyboard at each width; Close/Escape and focus restoration passed.
- Mobile navigation and desktop Games dropdown passed.
- axe-core WCAG 2 A/AA and 2.1 AA: zero detected violations in page and open-dialog states at all five widths.
- Site regression: nine page URLs and 100 local link/resource requests passed; homepage menus and signed-out deletion access passed across six widths.
- Desktop and narrow mobile screenshots visually reviewed.
- Homepage, shared styles/scripts, CNAME, and existing account/support/privacy/deletion files unchanged.

Source mapping:
- Screenshot 2026-10-26 075342.png → game-selection
- Screenshot 2026-10-26 075403.png → music-wheel
- Screenshot 2026-10-26 075442.png → scavenger-hunt
- Screenshot 2026-10-26 075534.png → license-plate-hunt
- Screenshot 2026-10-26 075544.png → state-information

Release date and younger-player advertising protections remain planned. Final store prices may vary. Automated checks do not replace a full assistive-technology audit.
