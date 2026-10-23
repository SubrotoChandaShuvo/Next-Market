'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LogIn,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Sparkles,
  UserCheck,
} from 'lucide-react';

export default function LoginPage() {
  const { signInWithEmail, signInWithGoogle, demoLogin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/products';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithEmail(email.trim(), password);
      router.push(redirectPath);
    } catch (err: unknown) {
      console.error('Login error:', err);
      const authErr = err as { code?: string; message?: string };
      if (authErr.code === 'auth/invalid-credential' || authErr.code === 'auth/wrong-password') {
        setErrorMsg('Invalid email or password. Please verify and try again.');
      } else if (authErr.code === 'auth/user-not-found') {
        setErrorMsg('No user account found with this email. Please register first.');
      } else {
        setErrorMsg(authErr.message || 'An error occurred while signing in. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      router.push(redirectPath);
    } catch (err: unknown) {
      console.error('Google Sign-in error:', err);
      const authErr = err as { message?: string };
      setErrorMsg(authErr.message || 'Google sign-in could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (role: 'seller' | 'buyer') => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await demoLogin(role);
      router.push(redirectPath);
    } catch (err: unknown) {
      const authErr = err as { message?: string };
      setErrorMsg(authErr.message || 'Demo login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page-container" id="login-page-main">
      <div className="auth-card-box">
        <div className="auth-header">
          <div className="auth-icon-badge">
            <LogIn className="auth-badge-icon" aria-hidden="true" />
          </div>
          <span className="section-eyebrow">Authentication</span>
          <h1 className="auth-title" id="login-heading">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to manage your listings, view saved products, and place orders.
          </p>
        </div>

        {errorMsg && (
          <div className="auth-error-banner" role="alert" id="login-error-alert">
            <AlertCircle className="error-icon" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="auth-form" aria-labelledby="login-heading">
          {/* Email */}
          <div className="form-group">
            <label htmlFor="login-email-input" className="form-label">
              Email Address <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <Mail className="field-icon" aria-hidden="true" />
              <input
                type="email"
                id="login-email-input"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="form-input"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="login-password-input" className="form-label">
                Password <span className="required-star">*</span>
              </label>
            </div>
            <div className="input-with-icon">
              <Lock className="field-icon" aria-hidden="true" />
              <input
                type="password"
                id="login-password-input"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="form-input"
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary full-width btn-large"
            id="login-submit-btn"
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? 'Signing In...' : 'Sign In to Account'}</span>
            <ArrowRight className="btn-arrow-icon" aria-hidden="true" />
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        {/* Google Sign-in */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="btn-secondary full-width btn-social"
          id="google-signin-btn"
          disabled={isSubmitting}
        >
          <svg className="google-svg-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.96 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Sign In with Google</span>
        </button>

        {/* One-Click QA / Demo Logins */}
        <div className="demo-logins-box">
          <p className="demo-label">
            <Sparkles className="badge-sparkle" aria-hidden="true" /> QA Quick Test Accounts:
          </p>
          <div className="demo-buttons-row">
            <button
              type="button"
              onClick={() => handleQuickDemo('seller')}
              className="btn-outline btn-sm"
              id="demo-seller-btn"
            >
              <UserCheck className="btn-icon-xs" aria-hidden="true" />
              <span>Seller Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('buyer')}
              className="btn-outline btn-sm"
              id="demo-buyer-btn"
            >
              <UserCheck className="btn-icon-xs" aria-hidden="true" />
              <span>Buyer Demo</span>
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="auth-card-footer">
          <p className="auth-switch-text">
            Don't have an account yet?{' '}
            <Link
              href={`/register${redirectPath !== '/products' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
              className="auth-link-highlight"
              id="link-to-register"
            >
              Create free account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
