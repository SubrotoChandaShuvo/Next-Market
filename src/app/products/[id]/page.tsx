'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  PackageX,
  Heart,
  ShoppingCart,
  UserCheck,
  Sparkles,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const { getProductById, isInitialized } = useProducts();
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const productId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const product = getProductById(productId);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  // 1. Loading State while local storage initializes
  if (!isInitialized) {
    return (
      <main className="product-detail-page" id="product-detail-main">
        <div className="section-container">
          <div className="product-detail-skeleton" id="product-loading-skeleton" role="status" aria-live="polite">
            <div className="skeleton-image-box" />
            <div className="skeleton-text-box">
              <div className="skeleton-line line-lg" />
              <div className="skeleton-line line-md" />
              <div className="skeleton-line line-sm" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // 2. Invalid ID Error State (Requirement 7)
  if (!product) {
    return (
      <main className="product-detail-page" id="product-detail-main">
        <div className="section-container">
          <div className="invalid-product-card" id="product-not-found-card" role="alert">
            <div className="invalid-icon-wrap">
              <PackageX className="invalid-icon" aria-hidden="true" />
            </div>
            <h1 className="invalid-title" id="not-found-heading">Product Not Found</h1>
            <p className="invalid-desc">
              We couldn't locate any product matching ID <code className="code-id">{productId || 'unknown'}</code>.
              The item may have been removed, sold out, or the link may be mistyped.
            </p>
            <div className="invalid-actions-row">
              <Link href="/products" className="btn-primary" id="btn-back-to-products">
                <ArrowLeft className="btn-icon" aria-hidden="true" />
                <span>Browse All Products</span>
              </Link>
              <Link href="/" className="btn-secondary" id="btn-back-to-home">
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // 3. Valid Product Detail View
  return (
    <main className="product-detail-page" id="product-detail-main">
      <div className="section-container">
        {/* Breadcrumb Navigation */}
        <nav className="detail-breadcrumb" aria-label="Breadcrumb" id="product-breadcrumb">
          <Link href="/" className="breadcrumb-link">
            Home
          </Link>
          <span className="breadcrumb-separator" aria-hidden="true">
            /
          </span>
          <Link href="/products" className="breadcrumb-link">
            Products
          </Link>
          <span className="breadcrumb-separator" aria-hidden="true">
            /
          </span>
          <Link
            href={`/products?category=${encodeURIComponent(product.category)}`}
            className="breadcrumb-link"
          >
            {product.category}
          </Link>
          <span className="breadcrumb-separator" aria-hidden="true">
            /
          </span>
          <span className="breadcrumb-current" aria-current="page">
            {product.title}
          </span>
        </nav>

        {/* Main Product Showcase Grid */}
        <div className="detail-showcase-grid">
          {/* Left Column: Image */}
          <div className="detail-image-column">
            <div className="detail-main-image-wrap">
              <Image
                src={product.image}
                alt={product.title}
                width={650}
                height={500}
                className="detail-product-img"
                priority
                unoptimized
              />
              <span className="detail-category-badge">{product.category}</span>
            </div>
          </div>

          {/* Right Column: Info & Actions */}
          <div className="detail-info-column">
            <div className="detail-meta-top">
              <span className="detail-stock-badge">
                <CheckCircle2 className="badge-icon-sm" aria-hidden="true" />
                {product.stock > 0 ? `In Stock (${product.stock} units available)` : 'Out of Stock'}
              </span>
              <div className="detail-rating-pill">
                <Star className="star-icon" aria-hidden="true" />
                <span className="rating-value">{product.rating}</span>
                <span className="reviews-text">({product.reviewCount} customer reviews)</span>
              </div>
            </div>

            <h1 className="detail-title" id="product-detail-title">
              {product.title}
            </h1>

            {/* Price Box */}
            <div className="detail-price-box">
              <span className="detail-price">${product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="detail-original-price">${product.originalPrice}</span>
                  <span className="detail-discount-chip">
                    Save ${product.originalPrice - product.price} (
                    {Math.round(
                      ((product.originalPrice - product.price) / product.originalPrice) * 100
                    )}
                    % off)
                  </span>
                </>
              )}
            </div>

            <p className="detail-description">{product.description}</p>

            {/* Seller Information Card */}
            <div className="detail-seller-card" id="seller-info-card">
              <div className="seller-avatar-icon">
                <UserCheck className="seller-icon" aria-hidden="true" />
              </div>
              <div className="seller-details">
                <div className="seller-badge-row">
                  <span className="seller-label">Verified Merchant</span>
                  <span className="seller-guarantee">
                    <Sparkles className="badge-sparkle" aria-hidden="true" /> Top Rated
                  </span>
                </div>
                <h3 className="seller-name">{product.sellerName}</h3>
                <p className="seller-contact">{product.sellerEmail}</p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="detail-trust-row">
              <div className="trust-pill">
                <Truck className="trust-icon" aria-hidden="true" />
                <span>Express Insured Shipping</span>
              </div>
              <div className="trust-pill">
                <ShieldCheck className="trust-icon" aria-hidden="true" />
                <span>Escrow Buyer Guarantee</span>
              </div>
              <div className="trust-pill">
                <RotateCcw className="trust-icon" aria-hidden="true" />
                <span>30-Day Free Returns</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="detail-actions-group">
              <button
                type="button"
                className={`btn-primary btn-large ${addedToCart ? 'btn-success' : ''}`}
                id="btn-add-to-cart"
                onClick={handleAddToCart}
                aria-label="Add product to shopping cart"
              >
                <ShoppingCart className="btn-icon" aria-hidden="true" />
                <span>{addedToCart ? 'Added to Cart ✓' : 'Add to Shopping Cart'}</span>
              </button>

              <button
                type="button"
                className={`btn-secondary btn-icon-only ${isWishlisted ? 'wishlisted' : ''}`}
                id="btn-wishlist"
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Save to wishlist"
              >
                <Heart className={`btn-icon ${isWishlisted ? 'heart-filled' : ''}`} aria-hidden="true" />
              </button>
            </div>

            {addedToCart && (
              <div className="cart-feedback-toast" role="status" aria-live="polite" id="cart-toast-msg">
                <CheckCircle2 className="toast-icon" aria-hidden="true" />
                <span>"{product.title}" has been added to your shopping cart!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
