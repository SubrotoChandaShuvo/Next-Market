'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import type { SortOption, FilterState } from '@/types';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Star,
  Tag,
  PackageX,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';

export default function ProductsPage() {
  const { products, isInitialized } = useProducts();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'featured',
  });

  // Read URL query parameter for category if navigated from home
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [searchParams]);

  // Combined Filtering and Sorting logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // 1. Search Query Match
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase().trim();
          const matchTitle = product.title.toLowerCase().includes(query);
          const matchDesc = product.description.toLowerCase().includes(query);
          const matchCat = product.category.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }

        // 2. Category Match
        if (filters.category !== 'all') {
          if (product.category.toLowerCase() !== filters.category.toLowerCase()) {
            return false;
          }
        }

        // 3. Price Filter (Min and Max)
        if (filters.minPrice !== '' && !isNaN(Number(filters.minPrice))) {
          if (product.price < Number(filters.minPrice)) return false;
        }
        if (filters.maxPrice !== '' && !isNaN(Number(filters.maxPrice))) {
          if (product.price > Number(filters.maxPrice)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // 4. Sorting
        switch (filters.sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'name-asc':
            return a.title.localeCompare(b.title);
          case 'name-desc':
            return b.title.localeCompare(a.title);
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'featured':
          default:
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
      });
  }, [products, filters]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      sortBy: 'featured',
    });
  };

  const isFilteringActive =
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.sortBy !== 'featured';

  const categoriesList = [
    { label: 'All Categories', value: 'all' },
    { label: 'Electronics', value: 'Electronics' },
    { label: 'Audio & Acoustics', value: 'Audio & Acoustics' },
    { label: 'Smart Wearables', value: 'Smart Wearables' },
    { label: 'Photography', value: 'Photography' },
  ];

  return (
    <main className="products-explore-page" id="products-page-main">
      <div className="section-container">
        {/* Page Header */}
        <div className="page-intro-header">
          <div>
            <span className="section-eyebrow">Marketplace Catalog</span>
            <h1 className="page-heading-title" id="products-page-title">
              Explore All Products
            </h1>
            <p className="page-heading-subtitle">
              Browse through authentic items from verified sellers with guaranteed protection.
            </p>
          </div>
          <div className="results-badge" id="results-count-badge">
            <Sparkles className="badge-icon" aria-hidden="true" />
            <span>
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        {/* Filter & Controls Panel */}
        <section className="filter-panel-card" aria-label="Product Search and Filter Controls">
          <div className="filter-inputs-grid">
            {/* Search Input */}
            <div className="filter-field search-field">
              <label htmlFor="search-input" className="filter-label">
                Search Products
              </label>
              <div className="input-with-icon">
                <Search className="field-icon" aria-hidden="true" />
                <input
                  type="text"
                  id="search-input"
                  name="search"
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  placeholder="Search by title, brand, or specs..."
                  className="filter-input-element"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="filter-field">
              <label htmlFor="category-select" className="filter-label">
                Category
              </label>
              <div className="input-with-icon">
                <Filter className="field-icon" aria-hidden="true" />
                <select
                  id="category-select"
                  name="category"
                  value={filters.category}
                  onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                  className="filter-select-element"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Range Fields */}
            <div className="filter-field price-range-group">
              <label htmlFor="min-price-input" className="filter-label">
                Price Range ($)
              </label>
              <div className="price-inputs-row">
                <input
                  type="number"
                  id="min-price-input"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minPrice: e.target.value === '' ? '' : Number(e.target.value),
                    }))
                  }
                  placeholder="Min"
                  min="0"
                  className="filter-input-element price-sub-input"
                  aria-label="Minimum price in dollars"
                />
                <span className="price-sep" aria-hidden="true">
                  –
                </span>
                <input
                  type="number"
                  id="max-price-input"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPrice: e.target.value === '' ? '' : Number(e.target.value),
                    }))
                  }
                  placeholder="Max"
                  min="0"
                  className="filter-input-element price-sub-input"
                  aria-label="Maximum price in dollars"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="filter-field">
              <label htmlFor="sort-select" className="filter-label">
                Sort By
              </label>
              <div className="input-with-icon">
                <ArrowUpDown className="field-icon" aria-hidden="true" />
                <select
                  id="sort-select"
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, sortBy: e.target.value as SortOption }))
                  }
                  className="filter-select-element"
                >
                  <option value="featured">Featured Picks</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Reset Button */}
            <div className="filter-field reset-field">
              <span className="filter-label-spacer" aria-hidden="true">
                &nbsp;
              </span>
              <button
                type="button"
                id="reset-filters-btn"
                onClick={handleResetFilters}
                className="btn-outline full-width reset-btn"
                disabled={!isFilteringActive}
                aria-label="Reset all search, category, price and sort filters"
              >
                <RotateCcw className="btn-icon" aria-hidden="true" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="category-pills-row" role="radiogroup" aria-label="Quick Category Filter">
            {categoriesList.map((cat) => (
              <button
                type="button"
                key={cat.value}
                id={`pill-cat-${cat.value.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                className={`category-pill-btn ${filters.category.toLowerCase() === cat.value.toLowerCase() ? 'active' : ''}`}
                onClick={() => setFilters((prev) => ({ ...prev, category: cat.value }))}
                role="radio"
                aria-checked={filters.category.toLowerCase() === cat.value.toLowerCase()}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Product Grid / Empty State */}
        {!isInitialized ? (
          <div className="loading-grid-state" id="products-loading-state" role="status" aria-live="polite">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="product-skeleton-card" aria-hidden="true" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state-card" id="empty-products-state" role="alert">
            <PackageX className="empty-state-icon" aria-hidden="true" />
            <h2 className="empty-state-title">No Matching Products Found</h2>
            <p className="empty-state-desc">
              We couldn't find any products matching your current filters. Try adjusting your search term,
              changing category, or broadening your price range.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn-primary"
              id="empty-state-reset-btn"
            >
              <RotateCcw className="btn-icon" aria-hidden="true" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="products-card-grid" id="products-grid-container">
            {filteredProducts.map((product) => (
              <article key={product.id} className="product-card" id={`product-item-${product.id}`}>
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
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="product-discount-tag">
                      Save ${product.originalPrice - product.price}
                    </span>
                  )}
                </div>

                <div className="product-info-body">
                  <div className="product-meta-row">
                    <div className="product-rating-row">
                      <Star className="star-icon" aria-hidden="true" />
                      <span className="rating-num">{product.rating}</span>
                      <span className="review-count">({product.reviewCount})</span>
                    </div>
                    <span className="product-stock-tag">
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>

                  <h2 className="product-card-title">
                    <Link href={`/products/${product.id}`} className="product-title-link">
                      {product.title}
                    </Link>
                  </h2>

                  <p className="product-card-desc">{product.description.substring(0, 85)}...</p>

                  <div className="product-price-action-row">
                    <div className="price-box">
                      <span className="current-price">${product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="original-price">${product.originalPrice}</span>
                      )}
                    </div>
                    <Link
                      href={`/products/${product.id}`}
                      className="btn-primary btn-sm"
                      id={`view-details-${product.id}`}
                    >
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
