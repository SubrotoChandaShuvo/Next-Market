import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="not-found-page" id="not-found-main" role="alert">
      <div className="section-container">
        <div className="not-found-card">
          <div className="not-found-code">404</div>
          <h1 className="not-found-title">Page Not Found</h1>
          <p className="not-found-desc">
            The page you are looking for does not exist, has been removed, or is temporarily unavailable.
          </p>
          <div className="not-found-actions">
            <Link href="/" className="btn-primary" id="404-btn-home">
              <Home className="btn-icon" aria-hidden="true" />
              <span>Return Home</span>
            </Link>
            <Link href="/products" className="btn-secondary" id="404-btn-products">
              <ShoppingBag className="btn-icon" aria-hidden="true" />
              <span>Browse Products</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
