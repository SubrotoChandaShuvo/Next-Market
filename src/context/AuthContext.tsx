'use client';

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  demoLogin: (role?: 'seller' | 'buyer') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'next_market_auth_user';
const GOOGLE_REDIRECT_PENDING = 'next_market_google_redirect_pending';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const mapFirebaseUser = (fbUser: FirebaseUser): User => ({
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Member',
    photoURL:
      fbUser.photoURL ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
  });

  const persistUser = (mapped: User) => {
    setUser(mapped);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mapped));
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    let unsubscribeFn: (() => void) | undefined;

    const initialize = async () => {
      // ── Step 1: Check for pending Google redirect ──────────────────────
      // We only call getRedirectResult when we know a redirect was triggered,
      // using a localStorage flag set before signInWithRedirect is called.
      const hasPendingRedirect =
        typeof window !== 'undefined' &&
        localStorage.getItem(GOOGLE_REDIRECT_PENDING) === '1';

      if (hasPendingRedirect) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(GOOGLE_REDIRECT_PENDING);
        }
        try {
          const result = await getRedirectResult(auth);
          if (!isSubscribed) return;
          if (result?.user) {
            persistUser(mapFirebaseUser(result.user));
          }
        } catch (err: unknown) {
          const e = err as { message?: string };
          console.warn('getRedirectResult error:', e?.message);
        }
      }

      if (!isSubscribed) return;

      // ── Step 2: Register ongoing auth state listener ───────────────────
      try {
        unsubscribeFn = onAuthStateChanged(
          auth,
          (fbUser) => {
            if (!isSubscribed) return;
            if (fbUser) {
              persistUser(mapFirebaseUser(fbUser));
            } else {
              // Fallback: try localStorage (covers demo login & offline mode)
              if (typeof window !== 'undefined') {
                const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
                if (stored) {
                  try {
                    setUser(JSON.parse(stored));
                  } catch {
                    setUser(null);
                    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
                  }
                } else {
                  setUser(null);
                }
              } else {
                setUser(null);
              }
            }
            setLoading(false);
          },
          (error) => {
            console.warn('onAuthStateChanged error:', error.message);
            // Fallback to localStorage on Firebase error
            if (typeof window !== 'undefined') {
              const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
              if (stored) {
                try {
                  setUser(JSON.parse(stored));
                } catch {
                  setUser(null);
                }
              }
            }
            setLoading(false);
          }
        );
      } catch {
        // Firebase init failed — use localStorage
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
          if (stored) {
            try {
              setUser(JSON.parse(stored));
            } catch {
              setUser(null);
            }
          }
        }
        setLoading(false);
      }
    };

    initialize();

    return () => {
      isSubscribed = false;
      unsubscribeFn?.();
    };
  }, []);

  // ── Email Sign In ──────────────────────────────────────────────────────
  const signInWithEmail = async (email: string, pass: string): Promise<void> => {
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, pass);
      persistUser(mapFirebaseUser(credential.user));
    } catch (fbErr: unknown) {
      const authError = fbErr as { code?: string; message?: string };
      const isDemoKey =
        !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('Dummy');
      if (
        authError?.code === 'auth/invalid-api-key' ||
        authError?.code === 'auth/network-request-failed' ||
        isDemoKey
      ) {
        persistUser({
          uid: 'demo_' + Math.random().toString(36).substring(2, 9),
          email,
          displayName: email.split('@')[0],
          photoURL:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
        });
      } else {
        throw fbErr;
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Email Sign Up ──────────────────────────────────────────────────────
  const signUpWithEmail = async (
    email: string,
    pass: string,
    displayName: string
  ): Promise<void> => {
    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, pass);
      if (displayName) await updateProfile(credential.user, { displayName });
      const mapped = mapFirebaseUser(credential.user);
      mapped.displayName = displayName || mapped.displayName;
      persistUser(mapped);
    } catch (fbErr: unknown) {
      const authError = fbErr as { code?: string; message?: string };
      const isDemoKey =
        !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('Dummy');
      if (
        authError?.code === 'auth/invalid-api-key' ||
        authError?.code === 'auth/network-request-failed' ||
        isDemoKey
      ) {
        persistUser({
          uid: 'demo_' + Math.random().toString(36).substring(2, 9),
          email,
          displayName: displayName || email.split('@')[0],
          photoURL:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
        });
      } else {
        throw fbErr;
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Google Sign In ─────────────────────────────────────────────────────
  const signInWithGoogle = async (): Promise<void> => {
    setLoading(true);
    try {
      // Primary: signInWithPopup (instant, works when not blocked)
      const credential = await signInWithPopup(auth, googleProvider);
      persistUser(mapFirebaseUser(credential.user));
    } catch (fbErr: unknown) {
      const authError = fbErr as { code?: string; message?: string };

      if (
        authError?.code === 'auth/popup-blocked' ||
        authError?.code === 'auth/popup-closed-by-user'
      ) {
        // Fallback: redirect flow when popup is blocked
        // Set a flag so getRedirectResult knows to check on return
        if (typeof window !== 'undefined') {
          localStorage.setItem(GOOGLE_REDIRECT_PENDING, '1');
        }
        // This navigates away — no code runs after this line
        await signInWithRedirect(auth, googleProvider);
        return; // unreachable, but satisfies TS
      }

      if (
        authError?.code === 'auth/operation-not-allowed' ||
        authError?.code === 'auth/invalid-api-key' ||
        !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('Dummy')
      ) {
        // Demo fallback
        persistUser({
          uid: 'google_demo_123',
          email: 'alex.demo@example.com',
          displayName: 'Alex Demo',
          photoURL:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
        });
      } else {
        throw fbErr;
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Demo Login ─────────────────────────────────────────────────────────
  const demoLogin = async (role: 'seller' | 'buyer' = 'seller'): Promise<void> => {
    setLoading(true);
    persistUser({
      uid: role === 'seller' ? 'seller_subroto_001' : 'buyer_jordan_002',
      email: role === 'seller' ? 'subroto@nextmarket.com' : 'jordan@nextmarket.com',
      displayName: role === 'seller' ? 'Subroto Chanda' : 'Jordan Lee',
      photoURL:
        role === 'seller'
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces'
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    });
    setLoading(false);
  };

  // ── Logout ─────────────────────────────────────────────────────────────
  const logout = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // ignored
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      localStorage.removeItem(GOOGLE_REDIRECT_PENDING);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, logout, demoLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
