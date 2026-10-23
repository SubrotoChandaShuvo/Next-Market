import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDummyKeyForDevelopmentTesting12345',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'next-market-demo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'next-market-demo',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'next-market-demo.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '100000000001',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:100000000001:web:abcdef1234567890',
};

// Initialize Firebase safely
let app: FirebaseApp;
let auth: Auth;
const googleProvider = new GoogleAuthProvider();

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  console.warn('Firebase initialization error, operating with local fallback:', error);
  // Re-attempt minimal initialization
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig, 'next-market-fallback');
  auth = getAuth(app);
}

export { app, auth, googleProvider };
