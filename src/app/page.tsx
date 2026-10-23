'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useProducts } from '@/context/ProductContext';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Mail,
  Send,
  Laptop,
  Headphones,
  Watch,
  Camera,
  Layers,
} from 'lucide-react';

export default function HomePage() {
  const { products } = useProducts();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Take top 4 featured products
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
    }
  };

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'Electronics':
        return <Laptop className="cat-card-icon" aria-hidden="true" />;
      case 'Audio & Acoustics':
        return <Headphones className="cat-card-icon" aria-hidden="true" />;
      case 'Smart Wearables':
        return <Watch className="cat-card-icon" aria-hidden="true" />;
      case 'Photography':
        return <Camera className="cat-card-icon" aria-hidden="true" />;
      default:
        return <Layers className="cat-card-icon" aria-hidden="true" />;
    }
  };

  return (
    <main className="landing-page" id="landing-page-main">
      {/* SECTION 1: HERO SECTION */}
      <section id="landing-hero" className="landing-section hero-section" aria-label="Hero Introduction">
        <div className="section-container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles className="badge-sparkle-icon" aria-hidden="true" />
              <span>Next-Generation Online Marketplace</span>
            </div>
            <h1 className="hero-title" id="hero-main-title">
              Discover Quality Products from <span className="gradient-text">Verified Creators</span>
            </h1>
            <p className="hero-subtitle">
              Shop curated tech, premium audio, smart electronics, and photography gear.
              Enjoy instant checkout, transparent escrow, and 30-day money-back buyer security.
            </p>
            <div className="hero-cta-group">
              <Link href="/products" className="btn-primary btn-large" id="hero-explore-btn">
                <span>Explore Marketplace</span>
                <ArrowRight className="btn-arrow-icon" aria-hidden="true" />
              </Link>
              <Link href="/add-product" className="btn-outline btn-large" id="hero-sell-btn">
                <span>Start Selling</span>
              </Link>
            </div>
            <div className="hero-stats-row">
              <div className="stat-box">
                <span className="stat-number">25,000+</span>
                <span className="stat-label">Verified Listings</span>
              </div>
              <div className="stat-divider" aria-hidden="true" />
              <div className="stat-box">
                <span className="stat-number">99.8%</span>
                <span className="stat-label">Positive Feedback</span>
              </div>
              <div className="stat-divider" aria-hidden="true" />
              <div className="stat-box">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Buyer Protection</span>
              </div>
            </div>
          </div>

          <div className="hero-visual-card">
            <div className="visual-image-wrapper">
              <Image
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="Featured AuraStudio Pro Headphones preview"
                width={500}
                height={400}
                className="hero-product-img"
                priority
              />
              <div className="hero-floating-pill top-right">
                <TrendingUp className="pill-icon" aria-hidden="true" />
                <span>Trending Fast &bull; 4.9 Rating</span>
              </div>
              <div className="hero-floating-pill bottom-left">
                <ShieldCheck className="pill-icon" aria-hidden="true" />
                <span>Verified Direct Seller</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CATEGORY SHOWCASE */}
      <section id="landing-categories" className="landing-section categories-section" aria-label="Product Categories">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Browse by Department</span>
            <h2 className="section-title">Explore Trending Categories</h2>
            <p className="section-desc">Hand-picked collections organized for fast discovery and quality assurance.</p>
          </div>

          <div className="categories-grid">
            <Link
              href="/products?category=Electronics"
              className="category-card"
              id="cat-card-electronics"
            >
              <div className="cat-icon-box">{getCategoryIcon('Electronics')}</div>
              <h3 className="cat-title">Electronics & Workstations</h3>
              <p className="cat-count">High-performance laptops, screens & hardware</p>
              <span className="cat-action">
                Browse Collection <ArrowRight className="cat-arrow" aria-hidden="true" />
              </span>
            </Link>

            <Link
              href="/products?category=Audio+%26+Acoustics"
              className="category-card"
              id="cat-card-audio"
            >
              <div className="cat-icon-box">{getCategoryIcon('Audio & Acoustics')}</div>
              <h3 className="cat-title">Audio & Acoustics</h3>
              <p className="cat-count">Studio headphones, audiophile monitors & ANC</p>
              <span className="cat-action">
                Browse Collection <ArrowRight className="cat-arrow" aria-hidden="true" />
              </span>
            </Link>

            <Link
              href="/products?category=Smart+Wearables"
              className="category-card"
              id="cat-card-wearables"
            >
              <div className="cat-icon-box">{getCategoryIcon('Smart Wearables')}</div>
              <h3 className="cat-title">Smart Wearables</h3>
              <p className="cat-count">Biometric smartwatches, fitness trackers & rings</p>
              <span className="cat-action">
                Browse Collection <ArrowRight className="cat-arrow" aria-hidden="true" />
              </span>
            </Link>

            <Link
              href="/products?category=Photography"
              className="category-card"
              id="cat-card-photography"
            >
              <div className="cat-icon-box">{getCategoryIcon('Photography')}</div>
              <h3 className="cat-title">Photography & Cinema</h3>
              <p className="cat-count">Mirrorless cameras, prime lenses & gimbals</p>
              <span className="cat-action">
                Browse Collection <ArrowRight className="cat-arrow" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURED PRODUCTS */}
      <section id="landing-featured" className="landing-section featured-section" aria-label="Featured Products">
        <div className="section-container">
          <div className="section-header-row">
            <div>
              <span className="section-eyebrow">Spotlight Picks</span>
              <h2 className="section-title">Editor's Featured Selections</h2>
            </div>
            <Link href="/products" className="btn-secondary" id="featured-view-all-btn">
              <span>View All Products</span>
              <ArrowRight className="btn-icon" aria-hidden="true" />
            </Link>
          </div>

          <div className="products-card-grid">
            {featuredProducts.map((product) => (
              <article key={product.id} className="product-card" id={`featured-card-${product.id}`}>
                <div className="product-image-container">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={400}
                    height={280}
                    className="product-card-img"
                    unoptimized
                  />
                  <span className="product-category-tag">{product.category}</span>
                  {product.originalPrice && (
                    <span className="product-discount-tag">
                      Save ${product.originalPrice - product.price}
                    </span>
                  )}
                </div>
                <div className="product-info-body">
                  <div className="product-rating-row">
                    <Star className="star-icon" aria-hidden="true" />
                    <span className="rating-num">{product.rating}</span>
                    <span className="review-count">({product.reviewCount} reviews)</span>
                  </div>
                  <h3 className="product-card-title">
                    <Link href={`/products/${product.id}`} className="product-title-link">
                      {product.title}
                    </Link>
                  </h3>
                  <p className="product-card-desc">{product.description.substring(0, 85)}...</p>
                  <div className="product-price-action-row">
                    <div className="price-box">
                      <span className="current-price">${product.price}</span>
                      {product.originalPrice && (
                        <span className="original-price">${product.originalPrice}</span>
                      )}
                    </div>
                    <Link
                      href={`/products/${product.id}`}
                      className="btn-primary btn-sm"
                      id={`btn-view-${product.id}`}
                    >
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: WHY CHOOSE US / VALUE PROPOSITION */}
      <section id="landing-why-us" className="landing-section why-us-section" aria-label="Why Choose Next Market">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Trust & Integrity</span>
            <h2 className="section-title">Built for Modern Commerce</h2>
            <p className="section-desc">We eliminate friction and fraud with rigorous standards and dedicated guarantees.</p>
          </div>

          <div className="value-pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <ShieldCheck className="pillar-icon" aria-hidden="true" />
              </div>
              <h3 className="pillar-title">Escrow Buyer Protection</h3>
              <p className="pillar-text">
                Your payment is held safely until you receive and verify the item. 100% money-back coverage.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box">
                <CheckCircle2 className="pillar-icon" aria-hidden="true" />
              </div>
              <h3 className="pillar-title">Identity-Verified Sellers</h3>
              <p className="pillar-text">
                Every merchant undergoes strict credential verification before listing their products on Next Market.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box">
                <Zap className="pillar-icon" aria-hidden="true" />
              </div>
              <h3 className="pillar-title">Lightning-Fast Checkout</h3>
              <p className="pillar-text">
                One-click purchasing, instant invoice generation, and real-time shipment status notifications.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box">
                <RotateCcw className="pillar-icon" aria-hidden="true" />
              </div>
              <h3 className="pillar-title">Hassle-Free Returns</h3>
              <p className="pillar-text">
                30-day effortless return labels with automated refunds right back to your original payment method.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FLASH DEALS / PROMOTIONAL BANNER */}
      <section id="landing-flash-deals" className="landing-section flash-deals-section" aria-label="Limited Flash Deals">
        <div className="section-container">
          <div className="flash-banner-card">
            <div className="flash-content">
              <div className="flash-badge">
                <Clock className="flash-clock-icon" aria-hidden="true" />
                <span>Limited Time Seasonal Event</span>
              </div>
              <h2 className="flash-title">Up to 25% Off Flagship Computing & Audio</h2>
              <p className="flash-subtitle">
                Upgrade your creative desk setup today with certified premium hardware. Includes full warranty and complimentary courier shipping.
              </p>
              <div className="flash-cta-row">
                <Link href="/products" className="btn-primary btn-large" id="flash-deal-shop-btn">
                  <span>Shop Promotional Deals</span>
                  <ArrowRight className="btn-arrow-icon" aria-hidden="true" />
                </Link>
                <Link href="/register" className="btn-ghost btn-large" id="flash-deal-register-btn">
                  <span>Claim Merchant Coupon</span>
                </Link>
              </div>
            </div>
            <div className="flash-graphic-box" aria-hidden="true">
              <div className="discount-circle">
                <span className="discount-pct">25%</span>
                <span className="discount-label">OFF NOW</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: CUSTOMER TESTIMONIALS */}
      <section id="landing-testimonials" className="landing-section testimonials-section" aria-label="Customer Testimonials">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Real Experiences</span>
            <h2 className="section-title">Loved by Thousands of Buyers & Sellers</h2>
            <p className="section-desc">See what our community members say about trading on Next Market.</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="test-stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="test-star-icon" aria-hidden="true" />
                ))}
              </div>
              <p className="test-quote">
                "Finding high-end audio gear with genuine buyer protection used to be stressful. Next Market made the transaction flawless and delivery was blazing fast."
              </p>
              <div className="test-author-row">
                <div className="test-avatar-placeholder">MT</div>
                <div>
                  <h4 className="author-name">Marcus Taylor</h4>
                  <p className="author-role">Sound Engineer & Producer</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="test-stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="test-star-icon" aria-hidden="true" />
                ))}
              </div>
              <p className="test-quote">
                "As an independent hardware builder, listing my items on Next Market helped me reach verified buyers without hefty platform commissions. Outstanding experience!"
              </p>
              <div className="test-author-row">
                <div className="test-avatar-placeholder">SK</div>
                <div>
                  <h4 className="author-name">Sophia Kim</h4>
                  <p className="author-role">Custom Tech Artisan</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="test-stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="test-star-icon" aria-hidden="true" />
                ))}
              </div>
              <p className="test-quote">
                "The instant inventory management and transparent rating system give us complete confidence. Next Market has become our primary tech purchasing channel."
              </p>
              <div className="test-author-row">
                <div className="test-avatar-placeholder">DR</div>
                <div>
                  <h4 className="author-name">David Ramirez</h4>
                  <p className="author-role">Studio Director, PixelForge</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: NEWSLETTER / CTA */}
      <section id="landing-newsletter" className="landing-section newsletter-section" aria-label="Newsletter Subscription">
        <div className="section-container">
          <div className="newsletter-card">
            <div className="newsletter-icon-wrap">
              <Mail className="newsletter-icon" aria-hidden="true" />
            </div>
            <h2 className="newsletter-title" id="newsletter-heading">Stay Ahead of Market Drops</h2>
            <p className="newsletter-desc">
              Subscribe to our weekly dispatch for exclusive early drops, flash vouchers, and market insights. No spam, ever.
            </p>

            {newsletterSubmitted ? (
              <div className="newsletter-success-box" role="status" aria-live="polite" id="newsletter-success-msg">
                <CheckCircle2 className="success-icon" aria-hidden="true" />
                <span>Thank you! You are now subscribed to Next Market Weekly Drops.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="newsletter-form" aria-labelledby="newsletter-heading">
                <label htmlFor="newsletter-email-input" className="sr-only">
                  Email Address for Newsletter
                </label>
                <input
                  type="email"
                  id="newsletter-email-input"
                  name="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your personal or business email"
                  required
                  className="newsletter-input"
                />
                <button type="submit" className="btn-primary" id="newsletter-submit-btn">
                  <span>Subscribe</span>
                  <Send className="btn-icon" aria-hidden="true" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
