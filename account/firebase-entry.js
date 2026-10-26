// Only supported Firebase browser SDK exports. No database/admin SDK is bundled.
export { initializeApp, getApps } from 'firebase/app';
export { getAuth, setPersistence, browserLocalPersistence, onIdTokenChanged,
 signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider,
 signInWithPopup, signOut, sendEmailVerification, sendPasswordResetEmail,
 reload, getIdTokenResult, validatePassword, linkWithPopup,
 reauthenticateWithCredential, EmailAuthProvider, reauthenticateWithPopup
} from 'firebase/auth';
