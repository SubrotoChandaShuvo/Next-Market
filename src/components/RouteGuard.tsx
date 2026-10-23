'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // Preserve target redirect path
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(redirectUrl);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div
        className="guard-loading-container"
        role="status"
        aria-live="polite"
        id="guard-loading-state"
      >
        <div className="guard-loading-box">
          <Loader2 className="guard-spinner" aria-hidden="true" />
          <h2 className="guard-heading">Verifying Authentication</h2>
          <p className="guard-text">Checking your Next Market credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="guard-blocked-container"
        role="alert"
        aria-live="assertive"
        id="guard-blocked-state"
      >
        <div className="guard-blocked-box">
          <ShieldAlert className="guard-alert-icon" aria-hidden="true" />
          <h2 className="guard-heading">Protected Page</h2>
          <p className="guard-text">Please sign in to access this page. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
