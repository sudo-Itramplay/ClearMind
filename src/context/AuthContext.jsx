import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isFirebaseEnabled, AUTH_METHOD } from '../data/firebaseConfig';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

// When Firebase isn't configured, this provider reports `enabled: false` and
// `ready: true` synchronously, so every consumer falls straight through to the
// local-storage path — the app behaves exactly as it did before any sync.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(!isFirebaseEnabled);

  useEffect(() => {
    if (!isFirebaseEnabled) return;
    let unsub = () => {};
    (async () => {
      const { getFirebase } = await import('../data/firebase');
      const { onAuthStateChanged } = await import('firebase/auth');
      unsub = onAuthStateChanged(getFirebase().auth, (u) => {
        setUser(u);
        setReady(true);
      });
    })();
    return () => unsub();
  }, []);

  const signIn = useCallback(async () => {
    if (!isFirebaseEnabled) return;
    const { getFirebase } = await import('../data/firebase');
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
    if (AUTH_METHOD === 'google') {
      await signInWithPopup(getFirebase().auth, new GoogleAuthProvider());
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!isFirebaseEnabled) return;
    const { getFirebase } = await import('../data/firebase');
    const { signOut: fbSignOut } = await import('firebase/auth');
    await fbSignOut(getFirebase().auth);
  }, []);

  return (
    <AuthCtx.Provider value={{ enabled: isFirebaseEnabled, ready, user, signIn, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
};
