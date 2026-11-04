# Road Trip Arcade — Privacy Policy

**Executive Producer and RTA Producer review draft — NOT APPROVED, NOT PUBLISHED, NOT EFFECTIVE**
Proposed document ID: `rta-privacy-v1.1`
Effective date and approved content hash: **not assigned**.
The existing combined policy at `/privacy.html` remains the published disclosure until a separately approved transition replaces it.

## 1. Scope and evidence limits

This proposed policy is for Road Trip Arcade (RTA), a LovelySiren Digital game. It is separate from the website and LovelySiren Account policy. It preserves the kinds of disclosures in the currently published combined policy while clarifying known development limitations. The published baseline has an effective date of October 5, 2026. Available code evidence is from earlier development snapshots, including the Pass 005 pinned source at RTA commit `048c0138f7c99a2bc8c59a317ff87ca74afbd7c2`; it is not evidence of the current RTA branch, current release build, deployed Firebase configuration, SDK inventory or store declaration.

Before this wording is approved, the RTA Producer must compare every statement to current source, shipped app/build, Firebase rules/data, actual SDKs, Google Play configuration and support/deletion operations. Where a feature's status is uncertain, this draft says it may apply or marks it for release verification rather than asserting that it is live.

## 2. Publisher and contact

LovelySiren Digital operates as a Virginia sole proprietorship under a registered trade name.

LovelySiren Digital, 5600 Whitmell School Rd, Dry Fork, VA 24549, United States

Email: [lovelysirenstudios@gmail.com](mailto:lovelysirenstudios@gmail.com)
Support: [lovelysirendigital.com/support.html](https://lovelysirendigital.com/support.html)

## 3. Guest play and information on your device

Depending on the game mode and features used, RTA may store settings, game selections, seeds, boards, progress, daily allowances, saved or finished games and other game state locally so the game can work or resume. Locally stored information may remain until removed through in-game controls, device/app-data settings or another applicable method. Clearing local data or uninstalling can remove local progress; it does not necessarily remove remote account data. Device backup/restore behavior must be confirmed for each shipped platform.

Guest play can be available without a LovelySiren Account. Game guest identity and eligibility are managed by RTA and are distinct from an adult company account. The current rules for who may use guest features must be verified against the shipped game and applicable audience settings.

## 4. Sign-in and game identity

When account features are offered and you choose them, RTA may use Google Sign-In and Firebase Authentication. Google and Firebase can process authentication identifiers and associated Google account information, such as email address and profile display name; LovelySiren Digital does not receive your Google password.

RTA maintains its own Firebase UID, friendly Player ID and product-specific identity records. Player ID lookup/friend features may expose a game display name and the information needed to find that game identity. A game's identity, a company's permanent LovelySiren ID and the user's email address are different identifiers. Matching emails do not automatically merge identities, transfer game data or assign purchases. Any future company-account connection must preserve RTA's existing identity and purchase ownership and be disclosed before it operates.

## 5. Gameplay, multiplayer and suggestions

Firebase Realtime Database or other configured game services may store the data needed for signed-in features, which can include a player profile, Player ID claim, friend relationship/invitation, presence, private-session state, game setup, progress, results and finished-game history. The exact record classes and synchronization rules depend on the current app version and feature. Information visible to an invited player may include the Player ID/display name, session membership or gameplay content needed to play together.

Supported private multiplayer or matching Trip Seed features may coordinate participants and game content. The game is not represented here as providing public matchmaking or public player chat unless the RTA Producer verifies that those features are present. An unused networking library or code helper is not by itself proof that a transport is active.

Suggestions or feedback may include the text you submit, game/category context, Firebase UID, Player ID and server time. A draft may remain on-device if offline or submission fails. Do not submit a password, payment-card number or another person's sensitive information.

## 6. Advertising and AdMob

The published policy describes banner and optional rewarded advertising. Earlier RTA development evidence includes an Android AdMob dependency and rewarded-video flow, while a web banner was only a placeholder in the reviewed source. This draft therefore preserves disclosure that advertising may be used, but the Producer must verify which ad formats, SDK versions, consent/age treatment and personalized/nonpersonalized settings actually ship on each platform.

An advertising provider may process device/network information, advertising or app identifiers, ad interactions and diagnostics to deliver, measure and protect advertising under its own disclosures. A nonpersonalized or child-directed request setting does not prove that no technical data is processed. Do not claim that no data is transmitted before an ad, or that a setting alone satisfies children/family requirements, without current release evidence.

## 7. Purchases and Google Play

Google Play services may process store, purchase and payment information when the app offers products. RTA is responsible for its game-side purchase verification, Base/Theme entitlement decisions and gameplay effects. Google Play handles payment details under its terms. LovelySiren Account does not currently establish purchase ownership or entitlements.

Earlier reviewed development code had an entitlement/cache framework but did not prove a live verified-billing adapter. The Producer must verify the actual billing library and backend, product IDs, purchase tokens/order references, ownership binding, restore/refund handling, relevant fraud controls and retention before claiming that paid purchases can be completed, restored or linked. Do not treat a local cache as proof of a valid purchase. No prices, paid add-ons or operational billing capability are created by this draft.

## 8. Device, diagnostics and service providers

Firebase, Google Sign-In, Google Play and any configured ad provider can receive information needed to provide their functions. These services may process IP/network information, device/app version and identifiers, request timing, account/game data and diagnostics according to their configuration and own privacy disclosures. Earlier source review found an Internet permission and Firebase/Google/AdMob dependencies; that evidence does not establish the SDKs or initialization present in the current release.

Before publication, verify the merged app manifest, platform permissions, dependency tree, SDK initialization, technical logs, Firebase rules, service accounts, Google Play Data Safety entries, store links and provider settings. This draft does not claim that analytics, crash reporting, precise location, contacts access or any other unverified service is active, and it makes no absolute “no tracking” or single-region storage promise.

## 9. Use, sharing, retention and security

Information is used as needed to provide game features, authenticate players, preserve or synchronize applicable game state, operate private play and friend features, handle suggestions/support, deliver configured ads or verified purchases, prevent abuse, secure services and meet applicable obligations. Other participants receive only the information necessary for the multiplayer or friend feature they use. Providers process data for their services and under their own terms. Information may also be disclosed for an authorized request, security, valid legal process or a lawful business transfer subject to applicable safeguards.

Local data, account records, game history, suggestions, purchase records, provider logs and backups may have different retention. No universal retention period is promised. Earlier reviewed code included a bounded client-assisted cleanup path for eligible terminal session data after a 30-day threshold; this is not proof that all session metadata, history, backups or provider logs are removed after 30 days. Current source, deployed rules, actual cleanup operation and retention decisions require Producer verification.

Reasonable safeguards are used, but no electronic system can be guaranteed completely secure. Providers may process information in the United States or other locations where they operate; no single storage region is promised here.

## 10. Children and families

RTA is intended to support family play, but a company's 18+ account rule does not establish that game access is adults-only or prove that child protections are complete. The RTA Producer must verify the current target audience, age/consent flow, guest eligibility, AdMob treatment, platform Families configuration, data disclosures and parental/child privacy handling for each release. No claim that parental consent, age screening or all applicable children/family requirements are complete is made by this review draft.

## 11. Requests and deletion limitations

Contact [lovelysirenstudios@gmail.com](mailto:lovelysirenstudios@gmail.com) about an access, correction, deletion or other privacy request. We may need to verify identity and request scope before changing or disclosing account or game data. Never send a password or verification code. Rights and response obligations depend on applicable law and circumstances; no unreviewed response deadline is promised.

Local save removal, RTA game-data deletion and company-wide LovelySiren Account deletion are separate. The published site provides an account-deletion information page, but that link is not itself a trusted RTA data-deletion service. The RTA trusted deletion API is **PLANNED / NOT IMPLEMENTED / NOT DEPLOYED / RELEASE BLOCKER**. A request, sign-out, account disablement or mailbox deletion must not be described as completed game-data deletion. A future company-wide deletion must coordinate the RTA operation and all affected products. Purchase records, platform entitlements, legal holds, provider logs or backups may require separately reviewed treatment. We will describe partial or unresolved handling honestly; no complete or immediate deletion promise is made here.

## 12. Changes and release approval

This policy should be published as a standalone RTA policy only after separate RTA and Executive Producer approval, verification against current source and the shipped build, assignment of an actual effective date/version, and coordination of all app/store/privacy links. Until then, the currently published combined policy remains in place. Accepting a website policy does not accept RTA Terms or this draft.

### RTA Producer evidence required before approval

- Current branch/commit and shipped platform builds; Firebase rules, authentication providers and actual service accounts.
- Current data-path inventory for game progress, sessions, suggestions, friendships, Player ID lookup and local/device data.
- Current advertising SDK/version/configuration and child/consent handling per platform.
- Google Play Billing implementation, server verification, ownership records, refunds/restores and Data Safety declarations.
- Actual Firebase/Google provider logs, backups and retention behavior.
- A complete trusted RTA inventory/fencing/deletion implementation and tested handling for partial failures.
- Current account/company-ID adapter status and all app, store and website policy URLs.
