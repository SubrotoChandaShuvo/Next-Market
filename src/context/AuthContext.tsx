'use client';

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Map Firebase User to our App User model
  const mapFirebaseUser = (fbUser: FirebaseUser): User => ({
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Member',
    photoURL: fbUser.photoURL || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces`,
  });

  useEffect(() => {
    let isSubscribed = true;

    // 1. Handle Google redirect result (after signInWithRedirect returns)
    getRedirectResult(auth)
      .then((result) => {
        if (!isSubscribed) return;
        if (result?.user) {
          const mapped = mapFirebaseUser(result.user);
          setUser(mapped);
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mapped));
          }
        }
      })
      .catch((err) => {
        console.warn('getRedirectResult notice:', err?.message);
      });

    // 2. Listen to real Firebase onAuthStateChanged
    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (fbUser) => {
          if (!isSubscribed) return;
          if (fbUser) {
            const mapped = mapFirebaseUser(fbUser);
            setUser(mapped);
            if (typeof window !== 'undefined') {
              localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mapped));
            }
          } else {
            // Check if there is a local persisted session (for mock / offline dev credentials)
            if (typeof window !== 'undefined') {
              const localUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
              if (localUser) {
                try {
                  setUser(JSON.parse(localUser));
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
          console.warn('Firebase onAuthStateChanged notice (fallback mode active):', error.message);
          if (typeof window !== 'undefined') {
            const localUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
            if (localUser) {
              try {
                setUser(JSON.parse(localUser));
              } catch {
                setUser(null);
              }
            }
          }
          setLoading(false);
        }
      );

      return () => {
        isSubscribed = false;
        unsubscribe();
      };
    } catch {
      if (typeof window !== 'undefined') {
        const localUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (localUser) {
          try {
            setUser(JSON.parse(localUser));
          } catch {
            setUser(null);
          }
        }
      }
      setLoading(false);
    }
  }, []);

  const signInWithEmail = async (email: string, pass: string): Promise<void> => {
    setLoading(true);
    try {
      // Try Firebase real auth first
      const credential = await signInWithEmailAndPassword(auth, email, pass);
      const mapped = mapFirebaseUser(credential.user);
      setUser(mapped);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mapped));
      }
    } catch (fbErr: unknown) {
      const authError = fbErr as { code?: string; message?: string };
      console.warn('Firebase signIn notice:', authError?.code || authError?.message);
      // Graceful fallback for mock/demo testing when API key is demo
      if (
        authError?.code === 'auth/invalid-api-key' ||
        authError?.code === 'auth/network-request-failed' ||
        authError?.code === 'auth/api-key-not-valid' ||
        !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('Dummy')
      ) {
        const mockUser: User = {
          uid: 'user_' + Math.random().toString(36).substring(2, 9),
          email,
          displayName: email.split('@')[0],
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
        };
        setUser(mockUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockUser));
        }
      } else {
        throw fbErr;
      }
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName: string): Promise<void> => {
    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, pass);
      if (displayName) {
        await updateProfile(credential.user, { displayName });
      }
      const mapped = mapFirebaseUser(credential.user);
      mapped.displayName = displayName || mapped.displayName;
      setUser(mapped);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mapped));
      }
    } catch (fbErr: unknown) {
      const authError = fbErr as { code?: string; message?: string };
      console.warn('Firebase signUp notice:', authError?.code || authError?.message);
      if (
        authError?.code === 'auth/invalid-api-key' ||
        authError?.code === 'auth/network-request-failed' ||
        authError?.code === 'auth/api-key-not-valid' ||
        !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('Dummy')
      ) {
        const mockUser: User = {
          uid: 'user_' + Math.random().toString(36).substring(2, 9),
          email,
          displayName: displayName || email.split('@')[0],
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
        };
        setUser(mockUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockUser));
        }
      } else {
        throw fbErr;
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      // signInWithRedirect avoids popup-blocked errors in production browsers
      await signInWithRedirect(auth, googleProvider);
      // Page will redirect to Google and come back — getRedirectResult() in useEffect handles the result
    } catch (fbErr: unknown) {
      const authError = fbErr as { code?: string; message?: string };
      console.warn('Firebase Google Auth notice:', authError?.code || authError?.message);
      if (
        authError?.code === 'auth/invalid-api-key' ||
        authError?.code === 'auth/network-request-failed' ||
        authError?.code === 'auth/api-key-not-valid' ||
        authError?.code === 'auth/operation-not-allowed' ||
        !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('Dummy')
      ) {
        // Fallback demo mode
        const mockUser: User = {
          uid: 'google_user_demo_123',
          email: 'alex.demo@example.com',
          displayName: 'Alex Demo',
          photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
        };
        setUser(mockUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockUser));
        }
      } else {
        throw fbErr;
      }
    }
  };

  const demoLogin = async (role: 'seller' | 'buyer' = 'seller'): Promise<void> => {
    setLoading(true);
    const mockUser: User = {
      uid: role === 'seller' ? 'seller_subroto_001' : 'buyer_jordan_002',
      email: role === 'seller' ? 'subroto@nextmarket.com' : 'jordan@nextmarket.com',
      displayName: role === 'seller' ? 'Subroto Chanda' : 'Jordan Lee',
      photoURL:
        role === 'seller'
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces'
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    };
    setUser(mockUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockUser));
    }
    setLoading(false);
  };

  const logout = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // Ignored
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        logout,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
