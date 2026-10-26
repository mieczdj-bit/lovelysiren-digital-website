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

## Base updates and Theme Packs revision

Added the prominent Future Base Content Included callout, explicitly limited to standard Base library updates. Added the seven-game Free/Base comparison and a lavender Theme Packs section immediately after it, before Play Together. Theme Packs are optional, separately purchased, excluded from Base, and coming soon; no packs, prices, dates, or artwork were invented. An empty CSS grid supports approved future cards without publishing placeholders.

Expanded family copy for solo/group play and passenger-led verbal participation, with explicit driver attention/no-device-use limits. Restyled the existing screenshots as staggered travel-album frames without editing image content.

Verified at 320, 375, 768, 1024, and 1440 pixels: gallery keyboard opening, Close/Escape focus restoration, image decoding, menus, no horizontal overflow or JavaScript errors, and zero detected WCAG A/AA axe violations in both page and dialog states. Site regression passed nine URLs and 100 local link/resource checks. Desktop/mobile screenshots visually reviewed. Shared styles, homepage, account, support/legal files, production configuration, and gallery JavaScript unchanged.

## Exact game allowances correction

Removed the separate comparison table. The existing Free and Base boxes now each contain seven game bullets with the producer-supplied library sizes and daily allowances/unlimited Base play. Free Scavenger Hunt and Road Bingo describe ads to unlock more, following the owner's example. The Base Roadblock bullet includes rescue without a rewarded video. Additional Great Benefits and the future Base content callout follow the paid game list. Theme Packs remains immediately after the two boxes. Removed obsolete table styles. Five-width gallery/accessibility/keyboard tests and site regression passed.

## Scattered screenshot gallery

Replaced the orderly row with a deterministic scattered desktop/tablet arrangement: independent positions, varied rotations, black 10px image surrounds, an outer black outline with 10px light spacing and 20px bottom spacing, and varied playful HTML sticker captions. Hover/keyboard focus lifts and enlarges each card; reduced-motion preferences disable transitions. Mobile keeps an angled horizontal gallery with the scroll hint visible only on narrow screens.

Screenshot sidebars are removed from the rendered thumbnail and enlarged view using source-specific CSS display windows, preserving game pixels and original source files. Native enlargement, Escape/Close, alt descriptions and focus restoration remain intact. No screenshot artwork was regenerated.

Five-width RTA gallery/image/accessibility tests passed. Additional checks verified desktop galleries require no scrolling, rotated cards stay inside their gallery area, mobile-only hint visibility, and hover transforms. Site regression passed nine URLs and 100 link/resource checks. Gallery screenshots visually reviewed at desktop, hover, and narrow mobile sizes.

## Base naming and Play Together revision

Added “with ads to unlock more” to every Free game bullet with a per-day allowance, without duplicating the phrase on the first two games. Updated the paid title to “Unlock the Full Base Experience” and its price label to “Unlock Road Trip Arcade Base — $6.99,” retaining No Subscription. Moved Play Together immediately above the Free/Base boxes and used the supplied Private Multiplayer, Matching Trip Seeds, and No Strangers descriptions in three compact responsive cards. Theme Packs remains after the Free/Base boxes. Five-width RTA and site regression checks passed, including exact copy/order assertions, gallery/keyboard/accessibility checks, nine URLs and 100 local resources.
