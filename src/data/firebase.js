// Lazy Firebase initializer. This module statically imports the Firebase SDK,
// so it must ONLY be reached through a dynamic import() that is gated behind
// `isFirebaseEnabled` — that keeps the SDK out of the main bundle (and out of
// the app entirely) until a config is provided.
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

let _services = null;

export const getFirebase = () => {
  if (!_services) {
    const app = initializeApp(firebaseConfig);
    _services = { app, auth: getAuth(app), db: getFirestore(app) };
  }
  return _services;
};
