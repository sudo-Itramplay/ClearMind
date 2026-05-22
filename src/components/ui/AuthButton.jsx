import React from 'react';
import { useAuth } from '../../context/AuthContext';

// Sign-in / sign-out control. Renders nothing until Firebase is configured,
// so the local-only app is visually unchanged.
const AuthButton = () => {
  const { enabled, ready, user, signIn, signOut } = useAuth();
  if (!enabled) return null;

  if (!ready) {
    return <div className="auth-btn auth-btn-loading" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <button className="auth-btn" onClick={signIn} aria-label="Sign in to sync">
        Sign in
      </button>
    );
  }

  const name = user.displayName || user.email || 'Account';
  return (
    <button className="auth-btn" onClick={signOut} aria-label={`Signed in as ${name} — sign out`} title={name}>
      <span className="auth-dot" aria-hidden="true" />
      Sign out
    </button>
  );
};

export default AuthButton;
