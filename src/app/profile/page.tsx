'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import RouteGuard from '@/components/RouteGuard';
import {
  Mail,
  ShieldCheck,
  FolderKanban,
  PlusCircle,
  LogOut,
  Calendar,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { products } = useProducts();
  const router = useRouter();

  const userProducts = products.filter(
    (p) => p.sellerId === user?.uid || p.sellerEmail === user?.email || p.sellerId === 'seller_subroto_001'
  );

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <RouteGuard>
      <main className="profile-page" id="profile-page-main">
        <div className="section-container">
          <div className="profile-container">
            {/* Profile Hero Header Card */}
            <div className="profile-card">
              <div className="profile-header-content">
                <div className="profile-avatar-large-wrap">
                  <Image
                    src={user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces'}
                    alt={user?.displayName || 'User profile'}
                    width={100}
                    height={100}
                    className="profile-avatar-large"
                    unoptimized
                  />
                  <span className="profile-verified-badge" aria-label="Verified User">
                    <ShieldCheck className="verified-icon" aria-hidden="true" />
                  </span>
                </div>

                <div className="profile-identity-info">
                  <div className="profile-badges-row">
                    <span className="user-role-chip">Verified Marketplace Seller</span>
                    <span className="user-level-chip">
                      <Sparkles className="badge-sparkle-sm" aria-hidden="true" /> Level 2 Merchant
                    </span>
                  </div>
                  <h1 className="profile-name" id="profile-user-name">
                    {user?.displayName || 'Merchant Account'}
                  </h1>
                  <p className="profile-email">
                    <Mail className="profile-icon-sm" aria-hidden="true" />
                    <span>{user?.email}</span>
                  </p>
                  <p className="profile-joined">
                    <Calendar className="profile-icon-sm" aria-hidden="true" />
                    <span>Member since October 2026 &bull; User ID: {user?.uid.substring(0, 12)}...</span>
                  </p>
                </div>

                <div className="profile-signout-wrap">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn-danger btn-sm"
                    id="profile-signout-btn"
                  >
                    <LogOut className="btn-icon" aria-hidden="true" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="profile-stats-row">
                <div className="profile-stat-box">
                  <span className="stat-value">{userProducts.length}</span>
                  <span className="stat-desc">Active Listings</span>
                </div>
                <div className="stat-border-line" aria-hidden="true" />
                <div className="profile-stat-box">
                  <span className="stat-value">4.9 / 5.0</span>
                  <span className="stat-desc">Merchant Rating</span>
                </div>
                <div className="stat-border-line" aria-hidden="true" />
                <div className="profile-stat-box">
                  <span className="stat-value">100%</span>
                  <span className="stat-desc">Dispatch Rate</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="profile-actions-grid">
              <Link href="/manage-products" className="profile-action-card" id="profile-action-manage">
                <div className="action-icon-box">
                  <FolderKanban className="card-action-icon" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="card-action-title">Manage Inventory</h3>
                  <p className="card-action-desc">
                    View, inspect, and remove your {userProducts.length} live product listings.
                  </p>
                </div>
              </Link>

              <Link href="/add-product" className="profile-action-card" id="profile-action-add">
                <div className="action-icon-box">
                  <PlusCircle className="card-action-icon" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="card-action-title">List New Product</h3>
                  <p className="card-action-desc">
                    Publish another item to reach thousands of marketplace shoppers.
                  </p>
                </div>
              </Link>

              <Link href="/products" className="profile-action-card" id="profile-action-explore">
                <div className="action-icon-box">
                  <ShoppingBag className="card-action-icon" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="card-action-title">Explore Catalog</h3>
                  <p className="card-action-desc">
                    Browse trending technology and premium electronics from other verified sellers.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </RouteGuard>
  );
}
