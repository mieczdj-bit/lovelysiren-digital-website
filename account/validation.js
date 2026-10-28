export function normalizeEmail(value) { return String(value).trim(); }
export function validEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254; }
export function displayNameError(value) {
  const name = value.trim();
  if ([...name].length < 2 || [...name].length > 40) return 'Use a display name between 2 and 40 characters.';
  if (!/^[\p{L}\p{M}\p{N} ._'’-]+$/u.test(name)) return 'Use letters, numbers, spaces, apostrophes, periods, underscores or hyphens.';
  return '';
}
export function validBirthDate(value, today = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(0);date.setUTCFullYear(year,month-1,day);date.setUTCHours(0,0,0,0);
  const maximum = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  return year >= 1 && date.getUTCFullYear() === year && date.getUTCMonth()+1 === month && date.getUTCDate() === day && value <= maximum;
}
export function normalizePhone(value) { return value.trim().replace(/[\s().-]/g, ''); }
export function validPhone(value) { return !value.trim() || /^\+[1-9]\d{6,14}$/.test(normalizePhone(value)); }
export function registrationErrors(values, today = new Date()) {
  const errors = {};
  const nameError = displayNameError(values.displayName || '');
  if (nameError) errors.displayName = nameError;
  if (!validBirthDate(values.birthDate || '', today)) errors.birthDate = 'Choose a real date of birth that is not in the future.';
  if (!validEmail(normalizeEmail(values.email || ''))) errors.email = 'Enter a valid email address.';
  if (!validPhone(values.phone || '')) errors.phone = 'Use an international number beginning with + and its country code, or leave this optional field blank.';
  if ((values.password || '').length < 15 || (values.password || '').length > 128) errors.password = 'Use 15 to 128 characters. Spaces and password-manager passphrases are welcome.';
  if (values.password !== values.confirmPassword) errors.confirmPassword = 'The passwords do not match.';
  if (!values.accepted) errors.accepted = 'Accept the published Terms of Service and Privacy Policy to continue.';
  return errors;
}
export function friendlyError(error, action = 'signin') {
  const code = String(error?.code || '');
  if (code === 'service/not-ready') return 'Account services are not available yet. Please try again after launch.';
  if (code === 'service/registration-retry') return 'We could not complete this test registration. Try again with the same invitation, or sign in using your existing account.';
  if (code === 'service/registration-denied') return 'This test registration is not authorized. Check your invitation and eligibility information, or contact support.';
  if (code === 'service/invitation-required') return 'Enter the test invitation code issued for your account.';
  if(code==='service/policy-required')return 'Please review the updated Website Terms and Privacy Policy in Account Settings.';
  if (code === 'service/policy-pending') return 'Registration is closed until the published policies and controlled account service are ready.';
  if (code === 'service/setup-required') return 'Your sign-in is recognized, but account setup is not complete. Full account access is unavailable.';
  if (code === 'service/verify-required') return 'Please verify your email before opening your account.';
  if (code === 'service/resend-limited') return 'Please wait before requesting another verification email.';
  if (code === 'auth/network-request-failed' || error instanceof TypeError || error?.name === 'TimeoutError' || error?.name === 'AbortError') return 'We could not reach account services. Check your connection and try again.';
  if (code === 'auth/too-many-requests') return 'Too many attempts. Please wait and try again later.';
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return 'Google sign-in was cancelled. You can try again.';
  if (code === 'auth/popup-blocked') return 'Allow the Google sign-in popup, then try again.';
  if (code === 'auth/account-exists-with-different-credential' || code === 'auth/credential-already-in-use') return 'This sign-in method could not be connected. Sign in using your existing method; accounts will not be merged automatically.';
  if (code === 'auth/requires-recent-login') return 'Please sign in again before making this change.';
  if (code === 'auth/weak-password' || code === 'auth/password-does-not-meet-requirements') return 'Choose a stronger password that meets the account password policy.';
  if (code === 'auth/operation-not-allowed' || code === 'auth/unauthorized-domain') return 'This sign-in option is temporarily unavailable.';
  if (action === 'register') return 'We could not complete registration. Please try again or return to sign in.';
  return "We couldn't sign you in. Check your email and password, then try again.";
}
