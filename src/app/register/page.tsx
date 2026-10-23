'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  UserPlus,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function RegisterPage() {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/products';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signUpWithEmail(email.trim(), password, name.trim());
      router.push(redirectPath);
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('This email address is already registered. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters.');
      } else {
        setErrorMsg(err.message || 'An error occurred while creating your account.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      router.push(redirectPath);
    } catch (err: any) {
      console.error('Google Sign-up error:', err);
      setErrorMsg(err.message || 'Google account creation could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page-container" id="register-page-main">
      <div className="auth-card-box">
        <div className="auth-header">
          <div className="auth-icon-badge">
            <UserPlus className="auth-badge-icon" aria-hidden="true" />
          </div>
          <span className="section-eyebrow">Get Started</span>
          <h1 className="auth-title" id="register-heading">Create Free Account</h1>
          <p className="auth-subtitle">
            Join Next Market to buy verified hardware or list your own inventory.
          </p>
        </div>

        {errorMsg && (
          <div className="auth-error-banner" role="alert" id="register-error-alert">
            <AlertCircle className="error-icon" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="auth-form" aria-labelledby="register-heading">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="register-name-input" className="form-label">
              Full Name <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <UserIcon className="field-icon" aria-hidden="true" />
              <input
                type="text"
                id="register-name-input"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Subroto Chanda"
                required
                className="form-input"
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="register-email-input" className="form-label">
              Email Address <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <Mail className="field-icon" aria-hidden="true" />
              <input
                type="email"
                id="register-email-input"
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
            <label htmlFor="register-password-input" className="form-label">
              Password (min 6 characters) <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <Lock className="field-icon" aria-hidden="true" />
              <input
                type="password"
                id="register-password-input"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="form-input"
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="register-confirm-password-input" className="form-label">
              Confirm Password <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <Lock className="field-icon" aria-hidden="true" />
              <input
                type="password"
                id="register-confirm-password-input"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="form-input"
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary full-width btn-large"
            id="register-submit-btn"
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? 'Creating Account...' : 'Complete Free Registration'}</span>
            <ArrowRight className="btn-arrow-icon" aria-hidden="true" />
          </button>
        </form>

        <div className="auth-divider">
          <span>or sign up with</span>
        </div>

        {/* Google Sign-up */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="btn-secondary full-width btn-social"
          id="google-signup-btn"
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
          <span>Sign Up with Google</span>
        </button>

        {/* Footer Navigation */}
        <div className="auth-card-footer">
          <p className="auth-switch-text">
            Already have an account?{' '}
            <Link
              href={`/login${redirectPath !== '/products' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
              className="auth-link-highlight"
              id="link-to-login"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
