// ─────────────────────────────────────────────────────────────────────────
// Firebase config — PASTE YOUR VALUES HERE, then rebuild/redeploy.
//
// Get them from: Firebase console → Project settings → Your apps → Web app →
// "SDK setup and configuration" → Config. Copy each field below.
//
// Until apiKey AND projectId are filled in, the whole app stays in LOCAL-ONLY
// mode (localStorage, no sign-in) — identical to how it works today. Filling
// these in turns on cloud sign-in + cross-device sync automatically.
// (These values are safe to commit: Firebase web keys are public by design;
//  security comes from Authentication + the Firestore rules.)
// ─────────────────────────────────────────────────────────────────────────
export const firebaseConfig = {
  apiKey: "AIzaSyCkpv3Y_qWzkdWhHDFrCKSnKSxAj65hIdM",

  authDomain: "clearmind-506b0.firebaseapp.com",

  projectId: "clearmind-506b0",

  storageBucket: "clearmind-506b0.firebasestorage.app",

  messagingSenderId: "723667203560",

  appId: "1:723667203560:web:d770f017cb1966efb2605d",
};

// Which sign-in method to use. Enable the matching provider in the Firebase
// console under Authentication → Sign-in method.
//   "google" — one-tap Google sign-in (recommended)
export const AUTH_METHOD = "google";

export const isFirebaseEnabled = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
);
