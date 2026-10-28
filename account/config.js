// Public client settings only. No Admin SDK or service-account credentials belong here.
// Both feature flags remain OFF until the documented integration/security review.
export const accountConfig = Object.freeze({
  enabled: false,
  registrationEnabled: false,
  registrationMode: 'closed',
  googleEnabled: false,
  firebase: { projectId: 'road-trip-arcade', authDomain: 'road-trip-arcade.firebaseapp.com' },
  backendBaseUrl: null,
  allowedOrigins: [],
  emailContinueUrl: 'https://lovelysirendigital.com/account/verify-email.html',
  emailContinueOrigins: ['https://lovelysirendigital.com'],
  policies: { termsUrl: null, termsVersion: null, privacyUrl: '../privacy.html', privacyVersion: null, approved: false },
  eligibilityApproved: false,
  resendCooldownSeconds: 60
});
