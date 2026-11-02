# Contact delivery configuration and activation review

Source only, November 2, 2026. NO services, DNS, credentials, live Firebase, deployments or email have been configured. No provider selection or spend is approved by this document.

## Architecture and isolation

Static support.html loads only support/{config.js,form.js,contact.css}; public config contains routing/site-key fields only and enabled=false. Browser requests a separate contact endpoint without an account or Authorization token. No email app is required after separately approved form activation. The fallback mailbox remains visible now.

`functions/src/contact-entry.js` exports only lovelysirenContactApi and is hard inactive. It does not import the account index, initialize an Admin app, or attach account/marketing/game privileges. `scripts/prepare-contact-011.cjs` creates a dedicated ignored review package with the contact entry/modules and existing locked dependencies. It is not added to the account deployment codebase or main Functions export. Registration-only packaging remains independent. No backend routing/configuration is deployed.

Future runtime wiring must explicitly instantiate the store, bot verifier and delivery adapter under a separately approved least-privilege identity. A proposed dedicated namespace `lovelySirenContactV1` must be private, client-denied and inaccessible to browser database clients; a dedicated database may be preferable because ordinary RTDB Admin access is broad. Review actual IAM/rules rather than assuming a path string scopes Admin privileges. No account Auth create/update/delete capability is needed. Preserve all RTA rules/source/data and existing accounts codebase. No live namespace or rules were created.

## Concrete provider candidate: Resend — NOT approved or configured

A server-only `createResendAdapter` implements the documented JSON send API, with injected fetch for offline tests. No SDK install or API key provisioning is performed. EP may choose another provider using the narrower `createDeliveryAdapter` transport contract instead.

Required server configuration after approval:

| Item | Exact intended value / decision |
|---|---|
| Fixed support recipient | lovelysirenstudios@gmail.com; never browser-selectable; no Cc/Bcc or visitor autoresponder |
| Company sender candidate | support@lovelysirendigital.com, or separately approved company subdomain sender matching the adapter allowlist; not claimed verified today |
| Mail API | Fixed HTTPS POST https://api.resend.com/emails, redirects refused, ten-second timeout |
| Secret | Approved server secret-manager binding for a sending-only API key restricted to the verified sending domain; no browser key, repository key, Gmail password or mailbox OAuth token |
| Request envelope | from=verified company sender, to=[fixed Gmail mailbox], reply_to=validated visitor address, subject=fixed category label, text=plain-text message; no HTML, attachments, tracking, arbitrary recipients or templates |
| Duplicate key | Durable HMAC content fingerprint in Idempotency-Key; stable server-only HMAC secret/version with reviewed rotation/retention |
| Acceptance | Successful HTTP response plus valid provider receipt ID, followed by durable accepted-status acknowledgement. Not a delivery guarantee |
| Errors | Explicit 400/401/403/422/429 nonacceptance allows a delayed retry. Timeout/network/5xx/malformed success/unknown response remains uncertain; no automatic resend |

Before a real request: EP approves provider/account/plan and any costs, provider data safeguards, sender and secret handling; authorized operator adds/verifies the company-owned sending domain/subdomain in the provider dashboard and its exact supplied DNS records. Verify required domain ownership and SPF/DKIM configuration; review DMARC/alignment and existing DNS records without overwriting the website CNAME/MX or shared SPF configuration. Obtain dashboard-confirmed sender/domain readiness. Do not invent DNS values or claim Gmail ownership verifies the company domain.

Official references used for the candidate contract: [send API](https://resend.com/docs/api-reference/emails/send-email), [idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys), [verified domains](https://resend.com/docs/dashboard/domains/introduction), [API-key scope](https://resend.com/docs/api-reference/api-keys/create-api-key). Provider idempotency retention is currently documented as 24 hours; this implementation still blocks ambiguous results rather than relying on unlimited provider deduplication. Recheck the current contract at activation.

## Bot integration boundary

`createBotVerifier` accepts only a trusted server verification function, never a client verified boolean. Real integration still requires provider selection/approval, public site key, server secret, exact permitted hostname and support_contact action, expiry/one-use validation and replay protection, reviewed widget loading/privacy/accessibility and fail-closed unavailable behavior. Bind challenge/attempt context as supported by the chosen provider. No bot vendor call, secret, widget or credential is configured here. Public Origin/CORS are supplementary, not authentication. Mock fixture verification is accepted only in the guarded demo loopback preview and must never be transplanted into live wiring.

## Deployment/activation boundaries — approvals still required

1. Approve Privacy/support retention/provider/bot copy and operational recovery; publish legal changes only under separate authorization.
2. Approve cloud prerequisites/cost limits, dedicated function/codebase, runtime identity and narrowly reviewed store rules/IAM/secret bindings. Inspect current live inventory under a separate authorized pass.
3. Verify live bot widget/server response/replay and real sender-domain readiness. Validate trusted proxy/IP handling; do not trust arbitrary forwarded client IP headers.
4. Wire the currently inactive contact entry to approved adapters with independent service and collection/Privacy gates; review that account, Auth, billing and game access are excluded. Deploy only after explicit approval, which this pass does not grant.
5. Approve controlled real delivery to the company mailbox, authenticated provider receipts/operational monitoring, rejection/timeout recovery and downstream inbox/bounce tests. Provider acceptance alone is not final inbox delivery.
6. Only after checks and explicit approval set the public endpoint/site key and activate the form; preserve fallback and separate support ownership verification. Public registration/marketing remain unaffected.

No live credential generation, DNS changes, APIs/billing, policy publication, account activation or real delivery occurred.
