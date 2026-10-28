# LovelySiren Digital
# Website Privacy Policy — Approval Draft

**Status:** Executive Producer approval required. Not published or effective.
**Effective Date:** To be assigned when approved and published.
**Proposed document identifier:** website-privacy-v1.0

## 1. Scope and current availability

LovelySiren Digital operates the website at https://lovelysirendigital.com/. This policy describes website and company-account processing. Individual games, including Road Trip Arcade, have separate product processing and must provide their own applicable privacy disclosures. This policy does not replace those disclosures.

Company-account registration is currently closed. The account functions described below apply when those functions are made available through an approved controlled test or subsequent release. A local emulator preview uses synthetic test data and does not send real verification or reset emails.

The website currently provides public studio and product information and support and deletion-request information. Browsing public pages does not require a LovelySiren Account. Company accounts are not currently connected to game purchases or entitlement migration.

## 2. Who operates the website

LovelySiren Digital is a Virginia sole proprietorship operating under a registered trade name.

LovelySiren Digital
5600 Whitmell School Rd
Dry Fork, VA 24549
United States

Contact: lovelysirenstudios@gmail.com

## 3. Information you provide

When authorized account registration is available, we process:

- A display name selected by you. It need not be your legal name. Your private website profile does not automatically update a game's player name.
- An email address for sign-in, verification, account recovery and necessary account communications.
- An optional telephone number, if you choose to provide one. The current account implementation stores it privately and does not verify it, use it for telephone authentication or recovery, or send SMS messages. Providing it is not consent to marketing calls or texts. Future marketing consent must be requested separately.
- A date of birth transiently to determine whether you meet the independent company-account registration requirement of age 18 or older. The server makes the decision. Complete date of birth and exact age are not retained in account records; an adult eligibility result is stored for eligible registrations. Ineligible applicants do not receive an account or a permanent LovelySiren ID. Limited security counters may still be processed as described below.
- Password credentials used with Firebase Authentication. In the controlled registration design, a password passes transiently over the approved HTTPS account API to Firebase Authentication. Website account-profile records do not store the password, and the application does not log it. Passwords used for later sign-in or recovery are handled through Firebase Authentication. Do not send passwords or verification codes to support.
- Your agreement to the actual published Website Terms and applicable Privacy Policy, including their versions, document hashes and server acceptance timestamp. Website acceptance does not constitute acceptance of Road Trip Arcade Terms.
- Information you choose to send to support, including the contents of email and the information needed to handle your request.

We do not request a child's profile or a parent-managed company account in this account release. The company-account age restriction does not determine whether a child can use a game's eligible guest features.

## 4. Identifiers and private account records

Firebase Authentication assigns an authentication user identifier. The trusted account backend associates that identifier with a permanent LovelySiren ID and a private profile. These identifiers are distinct from your email address and from a game's friendly Player ID.

Private records include account state, display name, optional phone number, adult eligibility result, verification-related state, creation and update times, policy-acceptance history and identity mappings. Account and registration operations also use expiring invitation and grant records, an email-derived reservation key and throttling records. Hashing a value is a security measure; it does not necessarily make the information anonymous.

A LovelySiren ID by itself does not authorize access. Account-profile access requires authorized authentication, completed setup and verified email. Where renewed policy acceptance is required, affected account operations remain restricted until acceptance is recorded.

This account implementation does not migrate or grant Road Trip Arcade purchases, change its Player IDs or read/write its gameplay and purchase records. Any future connection of those systems requires separate implementation and disclosures.

## 5. Authentication, Google and email operations

We use Google Firebase Authentication and Realtime Database for approved company-account services. Verification and password-reset requests use Firebase's email-action services. Verification links and reset links contain sensitive action codes; protect them like account credentials. Password-reset responses are designed not to reveal whether an email address has an account.

Google sign-in and linking remain disabled in the current public configuration. If enabled following approval, Google provides authentication identifiers and relevant account information such as an email address. Linking is tied to an authenticated existing account and requires appropriate verification. Matching email addresses do not automatically merge accounts or purchases. Review Google's privacy disclosures when using its services.

No phone-based sign-in, promotional SMS, Apple authentication or public player chat is implemented by the website account flow described here.

## 6. Technical information and local storage

Hosting and service providers receive technical request information necessary to deliver and secure the website, such as IP address, browser and device information, request timing and network information. The account API uses hashed IP-derived and email-derived keys and expiring counters to limit abuse. Application code avoids logging raw request bodies, passwords, birth dates and authentication tokens. Hosting and Firebase infrastructure may maintain their own operational and security logs under their applicable settings.

When account services are enabled, Firebase's browser persistence stores authentication session information locally so a session can be restored after a refresh. Signing out ends the application's current authenticated session. Local presentation and cooldown state may also be stored in browser session storage. These features are not advertising consent and do not authorize access by themselves.

## 7. Why we process information

We use website/account information to deliver requested account services; establish eligibility; authenticate and verify access; maintain a stable account identity; update your private profile; send necessary verification and recovery messages; record policy acceptance; respond to support and privacy requests; prevent abuse; investigate security problems; and comply with applicable legal obligations.

We do not use an optional telephone number to enroll you in an SMS campaign. We do not currently operate website advertising or analytics SDKs in the reviewed website source. Road Trip Arcade's advertising and diagnostics are separate product processing.

## 8. Providers and disclosures

The public website is hosted through GitHub Pages using the LovelySiren Digital custom domain. Approved account services use Google Firebase. Email you send to our Gmail support address is processed through that email service. These providers process information in connection with their services and their own applicable terms and privacy policies.

We may disclose information as reasonably needed to operate these services, respond to your authorized requests, protect rights and security, comply with valid legal obligations, or carry out a lawful business transfer subject to applicable protections. We do not describe private account profiles as public content.

Providers may process information in the United States and other locations where they operate. Applicable safeguards and rights depend on the service and relevant law. This draft does not promise a particular data region that has not been verified in the deployed configuration.

## 9. Website advertising, affiliate links and analytics

The reviewed public website source does not currently load advertising, affiliate-tracking or analytics SDKs. This statement concerns the website, not a game's advertising services or ordinary hosting/security logs. If website advertising, affiliate tracking or analytics is introduced, we will review the actual processing, update the applicable disclosures and obtain consent where required before introducing that processing. A link to an external site is subject to that site's own practices.

## 10. Retention and security

We retain account information for as long as reasonably necessary for the services you use, account administration, security, dispute resolution and applicable legal obligations. The exact operational retention schedule must be approved before controlled real-account testing; this draft does not promise that records are deleted after an unverified fixed period.

Registration grants expire after 15 minutes; provider-link grants expire after 5 minutes. Invitation expiry is configured for the authorized test. Security-counter records have expiry timestamps. Expiry prevents use of a temporary authorization record but does not itself erase the stored record. Cleanup must be run and monitored under the approved operating procedure. The current cleanup utility is bounded and requires an explicit apply step; no production cleanup schedule is active.

Stable identity mappings, account profiles, acceptance history and registration reservations are not automatically deleted by the temporary-record cleanup utility. Provider logs, backups and retained records may have different retention periods. We will document approved retention and deletion handling before real testing and production activation.

We use access restrictions and other reasonable security measures, but no electronic transmission or storage method can be guaranteed completely secure. Protect your email account and credentials, keep your device secure and contact us about suspected compromise.

## 11. Access, correction and deletion requests

When enabled, verified account holders can view their own account information and edit the supported profile fields. You may contact lovelysirenstudios@gmail.com about access, correction, deletion or other privacy requests. We may request reasonable verification before releasing information or performing a sensitive change. Do not include a password in a request.

Deletion information is available at https://lovelysirendigital.com/delete-account.html. Automated company-account deletion is not implemented in the current account release. A request does not produce an automatic deletion or a guarantee that every associated record has already been erased. Support must verify scope and identity and coordinate the applicable process.

Deleting a company-wide LovelySiren Account is distinct from deleting an individual game's data. The effects on game access, lawful purchase records and platform entitlements must be addressed under the applicable product terms, legal obligations and verified request scope. Some information may need to be retained for lawful purposes such as security, fraud prevention, transaction records or dispute resolution. We will explain applicable limitations when responding.

The end-to-end account deletion workflow and its treatment of permanent identifiers, authentication records, linked providers and associated game records must be completed before Road Trip Arcade's release. This policy does not represent that unfinished workflow as operational.

## 12. Privacy rights

Depending on applicable law and your circumstances, you may have rights to request access, correction, deletion, portability or restrictions on certain processing, and other rights or complaint options. Contact us to submit a request or ask about an applicable response or appeal. We will assess requests under the law that applies; the existence of a Virginia address alone does not establish that every provision of a particular privacy statute applies to the business.

Nothing in this policy limits non-waivable rights under applicable law. We do not promise a response period, appeal procedure or regulatory coverage that has not been reviewed against the applicable requirements.

## 13. Children and separate game safeguards

Independent company-account registration is restricted to users age 18 and older. We do not operate a child-account or parent-managed-account system in this pass. If you believe a child has supplied personal information through an unauthorized account, contact us.

Games intended for family use require their own audience, guest-play, age-screening, advertising and child-privacy review. This website account restriction does not substitute for those protections and does not make a separate game an adults-only product.

## 14. Changes and contact

When approved for publication, this policy will display its actual effective date and stable version. We will update it when website/account processing changes and provide appropriate notice where required. Material changes affecting account rights may require renewed acceptance of the applicable published policies; acceptance history is maintained separately from product agreements.

For privacy and account questions, contact LovelySiren Digital at lovelysirenstudios@gmail.com or the business address above. Support information: https://lovelysirendigital.com/support.html.
