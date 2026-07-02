import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { loadLocal, saveLocal, deleteLocal } from '../lib/storage';

interface AuthUser {
  name: string;
  email: string;
  isGuest: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  signInWithGoogle: () => void;
  continueAsGuest: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  signInWithGoogle: () => {},
  continueAsGuest: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadLocal<AuthUser>('authUser'));

  function signInWithGoogle() {
    // NOTE: this is a placeholder. Real "Sign in with Google" requires:
    // 1. A Google Cloud project + OAuth Client ID (console.cloud.google.com)
    // 2. Adding that Client ID here and loading Google's identity script
    // 3. Registering your live domain as an authorized origin
    // This demo version just simulates a signed-in guest so the UI flow works
    // end-to-end — swap this function's body once you have a real Client ID.
    const fakeUser: AuthUser = { name: 'Student', email: 'signed-in@example.com', isGuest: false };
    setUser(fakeUser);
    saveLocal('authUser', fakeUser);
  }

  function continueAsGuest() {
    const guest: AuthUser = { name: 'Guest', email: '', isGuest: true };
    setUser(guest);
    saveLocal('authUser', guest);
  }

  function signOut() {
    setUser(null);
    deleteLocal('authUser');
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, continueAsGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
