// Only supported Firebase browser SDK exports. No database/admin SDK is bundled.
export { initializeApp, getApps } from 'firebase/app';
export { getAuth, connectAuthEmulator, setPersistence, browserLocalPersistence, onIdTokenChanged,
 signInWithEmailAndPassword, GoogleAuthProvider,
 signInWithPopup, signOut, sendEmailVerification, sendPasswordResetEmail,
 reload, applyActionCode, getIdTokenResult, validatePassword, linkWithPopup,
 reauthenticateWithCredential, EmailAuthProvider, reauthenticateWithPopup
} from 'firebase/auth';
