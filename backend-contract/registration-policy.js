// Reference validation for the existing Firebase project's future trusted backend.
// This is NOT a deployed endpoint and must never be used as a browser eligibility authority.
import {registrationErrors} from '../account/validation.js';
export function validateRegistrationPreparation(input, approvedPolicy, serverNow = new Date()) {
  const reject=reason=>{throw Object.assign(new Error(reason),{code:reason});};
  if(!approvedPolicy?.approved || !Number.isInteger(approvedPolicy.minimumAge) || approvedPolicy.minimumAge<18 ||
     !approvedPolicy.termsVersion || !approvedPolicy.privacyVersion)reject('policy-not-approved');
  if(input.termsVersion!==approvedPolicy.termsVersion || input.privacyVersion!==approvedPolicy.privacyVersion || input.accepted!==true)reject('policy-acceptance-required');
  // Passwords never enter this endpoint. Firebase Authentication handles credentials separately.
  if('password' in input || 'confirmPassword' in input)reject('credentials-not-accepted');
  const errors=registrationErrors({...input,phone:input.phone||'',password:'validation placeholder only',confirmPassword:'validation placeholder only'},serverNow);
  if(Object.keys(errors).length)reject('invalid-registration-fields');
  const [year,month,day]=input.birthDate.split('-').map(Number);
  let age=serverNow.getUTCFullYear()-year;
  if(serverNow.getUTCMonth()+1<month || (serverNow.getUTCMonth()+1===month && serverNow.getUTCDate()<day))age--;
  if(age<approvedPolicy.minimumAge)reject('not-eligible');
  // Return no DOB or exact age. Backend must bind an expiring, single-use grant to this approved payload.
  return {
    displayName:input.displayName.trim(),expectedEmail:input.email.trim(),
    ...(input.phone?{phone:input.phone.trim().replace(/[\s().-]/g,'')}:{}),
    ageCategory:'adult',policyAcceptance:{termsVersion:approvedPolicy.termsVersion,privacyVersion:approvedPolicy.privacyVersion,acceptedAt:serverNow.toISOString()}
  };
}
