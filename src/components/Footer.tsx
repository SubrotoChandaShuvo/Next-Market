import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ShieldCheck, Truck, Headphones, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer" id="main-footer" role="contentinfo">
      {/* Footer Features Highlight Bar */}
      <div className="footer-top-bar">
        <div className="footer-container">
          <div className="footer-features-grid">
            <div className="feature-item">
              <Truck className="feature-icon" aria-hidden="true" />
              <div>
                <h4 className="feature-title">Nationwide Delivery</h4>
                <p className="feature-desc">Fast, insured transit with live GPS tracking</p>
              </div>
            </div>
            <div className="feature-item">
              <ShieldCheck className="feature-icon" aria-hidden="true" />
              <div>
                <h4 className="feature-title">Buyer Protection Guarantee</h4>
                <p className="feature-desc">100% money-back coverage for 30 days</p>
              </div>
            </div>
            <div className="feature-item">
              <Headphones className="feature-icon" aria-hidden="true" />
              <div>
                <h4 className="feature-title">Dedicated 24/7 Support</h4>
                <p className="feature-desc">Human assistance whenever you need it</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="footer-main-section">
        <div className="footer-container">
          <div className="footer-columns-grid">
            {/* Column 1: Brand Info */}
            <div className="footer-col brand-col">
              <Link href="/" className="footer-brand" id="footer-brand-logo" aria-label="Next Market Home">
                <ShoppingBag className="brand-icon" aria-hidden="true" />
                <span className="brand-text">
                  Next<span className="brand-highlight">Market</span>
                </span>
              </Link>
              <p className="footer-about-text">
                The modern marketplace connecting verified creators, manufacturers, and buyers.
                Buy with confidence, list with ease, and grow your digital business.
              </p>
            </div>

            {/* Column 2: Marketplace */}
            <div className="footer-col">
              <h3 className="footer-col-title">Marketplace</h3>
              <ul className="footer-links-list">
                <li>
                  <Link href="/products" className="footer-nav-link" id="footer-link-products">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=Electronics" className="footer-nav-link" id="footer-link-electronics">
                    Electronics & Tech
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=Audio+%26+Acoustics" className="footer-nav-link" id="footer-link-audio">
                    Audio & Acoustics
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=Smart+Wearables" className="footer-nav-link" id="footer-link-wearables">
                    Smart Wearables
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Seller Central */}
            <div className="footer-col">
              <h3 className="footer-col-title">Seller Hub</h3>
              <ul className="footer-links-list">
                <li>
                  <Link href="/add-product" className="footer-nav-link" id="footer-link-add-product">
                    List a Product
                  </Link>
                </li>
                <li>
                  <Link href="/manage-products" className="footer-nav-link" id="footer-link-manage-products">
                    Inventory Management
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="footer-nav-link" id="footer-link-profile">
                    Seller Profile
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="footer-nav-link" id="footer-link-register-seller">
                    Join as Merchant
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Account & Security */}
            <div className="footer-col">
              <h3 className="footer-col-title">Account</h3>
              <ul className="footer-links-list">
                <li>
                  <Link href="/login" className="footer-nav-link" id="footer-link-login">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="footer-nav-link" id="footer-link-register">
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="footer-nav-link" id="footer-link-account-settings">
                    Settings & Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <p className="copyright-text">
              &copy; {new Date().getFullYear()} Next Market Technologies Inc. All rights reserved.
            </p>
            <p className="built-with-text">
              Built with Next.js, TypeScript, and Firebase Auth with <Heart className="heart-icon" aria-hidden="true" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
