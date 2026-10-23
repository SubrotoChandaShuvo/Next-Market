'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  PlusCircle,
  FolderKanban,
  User as UserIcon,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Close dropdown on outside click or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="navbar-header" id="main-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link href="/" className="navbar-brand" id="brand-logo" aria-label="Next Market Home">
          <div className="brand-icon-wrapper">
            <ShoppingBag className="brand-icon" aria-hidden="true" />
          </div>
          <span className="brand-text">
            Next<span className="brand-highlight">Market</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation" id="desktop-navigation">
          <Link
            href="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            id="nav-home-link"
          >
            Home
          </Link>
          <Link
            href="/products"
            className={`nav-link ${isActive('/products') ? 'active' : ''}`}
            id="nav-products-link"
          >
            Explore Market
          </Link>
          <Link
            href="/add-product"
            className={`nav-link ${isActive('/add-product') ? 'active' : ''}`}
            id="nav-add-product-link"
          >
            Add Product
          </Link>
          <Link
            href="/manage-products"
            className={`nav-link ${isActive('/manage-products') ? 'active' : ''}`}
            id="nav-manage-products-link"
          >
            Manage Products
          </Link>
        </nav>

        {/* Desktop Auth Controls */}
        <div className="desktop-auth-actions" id="desktop-auth-actions">
          {loading ? (
            <div className="auth-skeleton-btn" aria-hidden="true" />
          ) : user ? (
            <div className="user-dropdown-wrapper" ref={dropdownRef}>
              <button
                type="button"
                className="user-profile-button"
                id="user-menu-button"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                aria-label="User account menu"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <div className="avatar-wrapper">
                  <Image
                    src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'}
                    alt={user.displayName || 'User profile'}
                    width={34}
                    height={34}
                    className="user-avatar-img"
                    unoptimized
                  />
                </div>
                <span className="user-name-label">{user.displayName || 'My Account'}</span>
                <ChevronDown className={`chevron-icon ${dropdownOpen ? 'rotated' : ''}`} aria-hidden="true" />
              </button>

              {/* Authenticated Dropdown Menu */}
              {dropdownOpen && (
                <div
                  className="dropdown-card"
                  role="menu"
                  id="user-dropdown-menu"
                  aria-labelledby="user-menu-button"
                >
                  <div className="dropdown-header">
                    <p className="dropdown-display-name">{user.displayName || 'Verified Member'}</p>
                    <p className="dropdown-email">{user.email}</p>
                    <span className="dropdown-badge">
                      <Sparkles className="badge-icon" aria-hidden="true" /> Verified Seller
                    </span>
                  </div>

                  <div className="dropdown-divider" role="separator" />

                  <Link
                    href="/manage-products"
                    className="dropdown-item"
                    role="menuitem"
                    id="dropdown-manage-link"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FolderKanban className="item-icon" aria-hidden="true" />
                    <span>Manage My Products</span>
                  </Link>

                  <Link
                    href="/add-product"
                    className="dropdown-item"
                    role="menuitem"
                    id="dropdown-add-link"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <PlusCircle className="item-icon" aria-hidden="true" />
                    <span>List New Product</span>
                  </Link>

                  <Link
                    href="/profile"
                    className="dropdown-item"
                    role="menuitem"
                    id="dropdown-profile-link"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <UserIcon className="item-icon" aria-hidden="true" />
                    <span>My Account Profile</span>
                  </Link>

                  <div className="dropdown-divider" role="separator" />

                  <button
                    type="button"
                    className="dropdown-item logout-item"
                    role="menuitem"
                    id="dropdown-signout-btn"
                    onClick={handleLogout}
                  >
                    <LogOut className="item-icon" aria-hidden="true" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons-group">
              <Link href="/login" className="btn-secondary" id="nav-login-btn">
                <LogIn className="btn-icon" aria-hidden="true" />
                <span>Log In</span>
              </Link>
              <Link href="/register" className="btn-primary" id="nav-register-btn">
                <UserPlus className="btn-icon" aria-hidden="true" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-menu-toggle-btn"
          id="mobile-menu-toggle"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation-drawer"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {mobileMenuOpen ? <X className="toggle-icon" aria-hidden="true" /> : <Menu className="toggle-icon" aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" id="mobile-navigation-drawer">
          <nav className="mobile-nav-links" aria-label="Mobile Navigation">
            <Link
              href="/"
              className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
              id="mobile-link-home"
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`mobile-nav-link ${isActive('/products') ? 'active' : ''}`}
              id="mobile-link-products"
            >
              Explore Market
            </Link>
            <Link
              href="/add-product"
              className={`mobile-nav-link ${isActive('/add-product') ? 'active' : ''}`}
              id="mobile-link-add"
            >
              Add Product
            </Link>
            <Link
              href="/manage-products"
              className={`mobile-nav-link ${isActive('/manage-products') ? 'active' : ''}`}
              id="mobile-link-manage"
            >
              Manage Products
            </Link>
          </nav>

          <div className="mobile-drawer-auth">
            {user ? (
              <div className="mobile-user-card">
                <div className="mobile-user-info">
                  <Image
                    src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'}
                    alt={user.displayName || 'User'}
                    width={40}
                    height={40}
                    className="mobile-avatar"
                    unoptimized
                  />
                  <div>
                    <div className="mobile-name">{user.displayName || 'Member'}</div>
                    <div className="mobile-email">{user.email}</div>
                  </div>
                </div>
                <div className="mobile-actions-stack">
                  <Link href="/profile" className="btn-secondary full-width" id="mobile-profile-link">
                    <UserIcon className="btn-icon" aria-hidden="true" /> View Profile
                  </Link>
                  <button
                    type="button"
                    className="btn-danger full-width"
                    id="mobile-signout-btn"
                    onClick={handleLogout}
                  >
                    <LogOut className="btn-icon" aria-hidden="true" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="mobile-auth-stack">
                <Link href="/login" className="btn-secondary full-width" id="mobile-login-link">
                  <LogIn className="btn-icon" aria-hidden="true" /> Log In
                </Link>
                <Link href="/register" className="btn-primary full-width" id="mobile-register-link">
                  <UserPlus className="btn-icon" aria-hidden="true" /> Create Free Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
