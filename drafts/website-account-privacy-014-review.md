# LovelySiren Digital — Website & LovelySiren Account Privacy Policy

**Executive Producer review draft — NOT APPROVED, NOT PUBLISHED, NOT EFFECTIVE**
Proposed document ID: `website-privacy-v1.1`
Effective date and approved content hash: **not assigned**.
This review draft does not replace the currently published combined Privacy Policy.

## 1. Scope and availability

This draft covers the LovelySiren Digital website, contact form, and company-wide LovelySiren Account services. Public website pages can be viewed without an account. Account registration, Google enrollment, marketing preferences and account APIs remain closed in the public configuration. Features described as optional or conditional are not available unless separately approved and activated.

Road Trip Arcade (RTA) is a separate product with its own game identity, Player ID, gameplay, multiplayer, purchase and advertising data. This draft is not a replacement for RTA's game-specific privacy disclosures. A LovelySiren Account is not currently a sign-in requirement for RTA and is not currently connected to game progress or purchases.

## 2. Who we are and how to contact us

LovelySiren Digital is a Virginia sole proprietorship operating under a registered trade name.

LovelySiren Digital, 5600 Whitmell School Rd, Dry Fork, VA 24549, United States

Email: [lovelysirenstudios@gmail.com](mailto:lovelysirenstudios@gmail.com)
Support: [lovelysirendigital.com/support.html](https://lovelysirendigital.com/support.html)

## 3. Information used for a company account

When a controlled account service is available, the information can include:

- A display name and email address used for the account, verification, recovery and necessary account messages.
- A password credential when email/password sign-in is selected. The password is sent securely to Firebase Authentication and is not written to the company profile. We do not receive or store a Google password when an existing Google identity is explicitly enrolled.
- Date of birth entered for the 18-or-older eligibility check. The account backend retains an adult eligibility result, not the full birth date or exact age. An ineligible applicant is not assigned a company account or permanent LovelySiren ID.
- An optional phone number and, if separately offered, optional mailing address. These are private contact fields, not sign-in credentials. A phone number is not phone verification, account recovery, SMS enrollment or marketing consent.
- Acceptance records for the applicable published Website Terms and Privacy Policy, including version, document hash and server-recorded time. This does not accept a game's terms or privacy policy.
- Temporary invitation, registration, identity-binding and abuse-prevention records needed to make the controlled service work safely. An interrupted signup can leave an unverified Firebase Auth user or temporary/reserved account records; expiry is not proof that those records were erased.

Company accounts are intended only for people age 18 or older. Game guest eligibility and any child or family safeguards are governed separately by each game.

## 4. Authentication, permanent ID and account data

The account service uses Firebase Authentication and Firebase Realtime Database. A Firebase UID identifies the authentication account. After an authorized, policy-compliant registration or explicit enrollment, the company backend assigns one permanent `lsid_` LovelySiren ID and associates it with the Firebase UID and private account profile. The company backend alone creates and resolves that permanent company ID.

Email/password and Google are supported account methods in the code, but public service activation is currently off. Google enrollment for an existing RTA user requires a separately authorized invitation bound to that exact existing Firebase UID; email similarity alone never links identities. A user who selects a different Google account is rejected from company enrollment. Website account identity does not replace an RTA Firebase UID, RTA Player ID, product-local record, game progress or purchase record.

Account records can include display name, email/authentication state, adult eligibility result, optional contact fields when enabled, account lifecycle state, timestamps, consent history and identity associations. Account and security code uses limited, expiring invitations, grants, reservations and hashed abuse-prevention keys. Hashing does not necessarily make information anonymous. Ordinary identity lookup does not create an account. The RTA identity resolver is a separate inactive service and does not assign purchases, game entitlements or device leases.

## 5. Verification, recovery and sessions

Firebase handles email verification and password-reset actions. Verification and reset links contain sensitive action codes; protect them like credentials. Password recovery responses are designed not to disclose whether an address has an account. Verified email and completed account setup are required for protected profile access. Google enrollment uses the already verified Google identity and exact invited UID; it does not merge accounts by email.

When account service is offered, browser authentication state can be restored using Firebase's browser persistence. Limited presentation/cooldown state can be stored in browser session storage. Signing out ends the current authenticated session; it does not delete cloud records. Firebase and hosting providers may process IP address, browser/device, request timing and network details needed to provide and secure their services. Application logging is designed to avoid raw passwords, birth dates, tokens, and request bodies; provider logs are controlled separately by provider configuration.

## 6. Optional contact information and marketing choices

Phone and mailing address fields are optional and are not required to create an account. If enabled, you can edit or remove supported contact fields. A contact field may be used only for the purpose disclosed when it is collected; entering it does not authorize promotional contact.

Email, SMS and postal marketing are separate choices, each off by default. Account creation, policy acceptance, a support request, Google sign-in, a purchase or providing contact information does not opt you in. No promotional messages are being sent by the reviewed implementation. Marketing preferences and sending are inactive. If preferences are separately enabled, each channel can be withdrawn independently without closing the account.

SMS is not active. A phone number or pending preference is not an active SMS subscription. SMS would require separate approval, verified number, reviewed disclosures and delivery/STOP controls before any sending. Email preferences would not transfer to a changed or unverified address. Postal preference requires a usable address. Website preferences do not control in-game offers, which remain under each game's own disclosures and safeguards.

LovelySiren Digital does not sell customer contact information or provide it to other companies for their independent marketing. Trusted providers may process the minimum information needed to deliver an approved service on our behalf, subject to applicable safeguards.

## 7. Contact Us form

The website includes a contact form interface, but server delivery is currently disabled. While it is inactive, the support page provides the support email fallback. If the form is activated, we will process your name, email address, selected product, conditional product/subject detail and message to receive, protect, route and answer your support request. The form does not require a LovelySiren Account or an email application.

The form may use a separately approved email-delivery provider and bot-verification provider. Their actual identities, settings and data handling must be confirmed before activation. The form's server-side abuse controls are designed to retain limited keyed rate-limit/deduplication metadata rather than a second copy of message contents. Hosting/provider connection logs may be separate. Do not send passwords, verification codes, full payment-card details or unnecessary sensitive information.

Submitting a contact message never grants email, SMS or postal marketing consent. A support message does not prove account or purchase ownership and does not authorize account, billing, purchase or deletion changes. We independently verify identity and authority before sensitive action. A delivery provider's acceptance means it accepted the message for processing; it does not prove final inbox delivery.

## 8. Purposes, providers and sharing

Information is used to provide the feature requested; check adult eligibility; authenticate and verify access; maintain the stable company identity; support account settings and recovery; record policy acceptance; handle support/privacy requests; prevent abuse; investigate security incidents; and meet applicable legal obligations.

The public site is hosted through GitHub Pages using our custom domain. Firebase provides account authentication and database services when activated. Gmail processes email sent to the support mailbox. A separate approved staging host or contact-delivery/bot provider may process information only if later configured. No contact-delivery provider, marketing sender, or account staging service is claimed as active by this draft. Providers may process data in the United States or other locations where they operate; this draft does not promise a single data region.

We may disclose information as reasonably needed to provide services, respond to an authorized request, protect rights/security, comply with a valid legal obligation, or carry out a lawful business transfer subject to applicable protections. We do not provide customer data to other companies for their independent marketing. External sites and provider services have their own notices and terms.

## 9. Retention and security

Different data classes have different operational purposes. We retain information only as reasonably necessary for the service, account administration, security, support, dispute handling and applicable legal obligations. We do not promise one deletion period for all records, and no statutory retention period is established by this draft.

Registration authorization currently expires after 15 minutes and provider-link authorization after 5 minutes. Invitation and security records have configured expiry values. Expiry prevents further use; it does not erase the stored item. No production cleanup schedule is active. Profiles, permanent identity associations and policy history are not removed by temporary-record cleanup. Support mailbox contents, provider logs, backups and product purchase records may have separate access and retention practices. Retention, review and removal procedures need approval before real collection.

We use access restrictions and other reasonable safeguards, but no electronic transmission or storage method is completely secure. Protect your credentials, email account and devices, and contact us about suspected account compromise.

## 10. Privacy requests and deletion limits

Contact us at [lovelysirenstudios@gmail.com](mailto:lovelysirenstudios@gmail.com) to request access, correction, deletion or other rights that may apply. We may need reasonable independent verification before providing information or making a sensitive change. Do not send passwords or verification codes. We assess requests under applicable law; this draft does not promise a legal coverage determination or response deadline.

Automated LovelySiren Account deletion and the trusted RTA game-data deletion operation are not available. A request, sign-out, access disablement or local app removal does not establish that cloud data was erased. Company account data and RTA game data are distinct: deleting RTA data would not by itself delete the company account, and a company-wide request must coordinate with each affected product. RTA's trusted inventory/fencing/deletion service is not implemented, so a company deletion cannot currently be represented as complete for an RTA-linked user. Purchase records, platform entitlements, provider logs, backups, legal holds and other retention needs must be assessed; partial work will be described as partial or unresolved.

## 11. Children, changes and contact

Independent company-account registration is restricted to adults 18 or older; we do not offer a child or parent-managed company account. This does not make RTA or other games adults-only and does not replace their age, guest-play, advertising or child-privacy obligations. Contact us if you believe a child supplied information through an unauthorized company account.

If approved, the published policy will show an actual version and effective date. Material account-policy changes may require renewed acceptance. Website account consent is separate from game policy acceptance. For privacy or account questions, use the contact details in section 2.

---

### Executive Producer review notes (not policy terms)

- Confirm that the business identity and mailing address are current.
- Approve purpose/minimum fields and review/removal criteria for optional phone, address, support cases, logs, backups, invitations, policy evidence and permanent identity mappings.
- Confirm actual staging/email/bot providers and geographies before activating those services.
- Obtain professional legal review of rights, notices, contact processing, marketing language, and any applicable children/family obligations.
- No effective date/hash is assigned until wording is approved, publication is authorized and the exact published source is verified.
