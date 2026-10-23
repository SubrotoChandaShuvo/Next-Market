'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import RouteGuard from '@/components/RouteGuard';
import {
  PlusCircle,
  Image as ImageIcon,
  DollarSign,
  Tag,
  Layers,
  FileText,
  Boxes,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function AddProductPage() {
  const { user } = useAuth();
  const { addProduct } = useProducts();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Electronics',
    image: '',
    stock: '10',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  const sampleImages = [
    { label: 'Laptop Pro', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80' },
    { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' },
    { label: 'Smartwatch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80' },
    { label: 'Camera Cinema', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80' },
  ];

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Product title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.price || Number(formData.price) <= 0) errors.price = 'Price must be greater than $0';
    if (!formData.image.trim()) errors.image = 'Image URL is required';
    if (!formData.stock || Number(formData.stock) <= 0) errors.stock = 'Stock must be at least 1 unit';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);

    try {
      const created = addProduct({
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        category: formData.category,
        image: formData.image.trim(),
        stock: Number(formData.stock),
        sellerId: user?.uid || 'user_demo',
        sellerName: user?.displayName || 'Verified Merchant',
        sellerEmail: user?.email || 'seller@nextmarket.com',
        featured: false,
      });

      setSuccessId(created.id);

      // Redirect to newly created product details
      setTimeout(() => {
        router.push(`/products/${created.id}`);
      }, 1200);
    } catch (err) {
      console.error('Failed to create product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RouteGuard>
      <main className="add-product-page" id="add-product-main">
        <div className="section-container">
          <div className="form-card-container">
            <div className="form-header">
              <div className="form-icon-wrap">
                <PlusCircle className="form-heading-icon" aria-hidden="true" />
              </div>
              <span className="section-eyebrow">Seller Inventory Central</span>
              <h1 className="form-title" id="add-product-heading">
                List a New Product
              </h1>
              <p className="form-subtitle">
                Publish your product on the Next Market catalog. Your listing will immediately appear
                in the marketplace, search filters, and your management dashboard.
              </p>
            </div>

            {successId && (
              <div className="success-banner" role="status" aria-live="polite" id="add-success-banner">
                <CheckCircle2 className="success-icon" aria-hidden="true" />
                <div>
                  <h3 className="success-banner-title">Product Listed Successfully!</h3>
                  <p className="success-banner-text">
                    Redirecting you to the live product detail page...
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="product-form" aria-labelledby="add-product-heading">
              {/* Product Title */}
              <div className="form-group">
                <label htmlFor="product-title-input" className="form-label">
                  Product Title <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <Tag className="field-icon" aria-hidden="true" />
                  <input
                    type="text"
                    id="product-title-input"
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., NovaTech Quantum Mechanical Keyboard"
                    className={`form-input ${formErrors.title ? 'input-error' : ''}`}
                    aria-describedby={formErrors.title ? 'title-error' : undefined}
                    aria-invalid={!!formErrors.title}
                  />
                </div>
                {formErrors.title && (
                  <p className="field-error-text" id="title-error" role="alert">
                    {formErrors.title}
                  </p>
                )}
              </div>

              {/* Category & Stock in 2 cols */}
              <div className="form-row-2col">
                <div className="form-group">
                  <label htmlFor="product-category-input" className="form-label">
                    Category <span className="required-star">*</span>
                  </label>
                  <div className="input-with-icon">
                    <Layers className="field-icon" aria-hidden="true" />
                    <select
                      id="product-category-input"
                      name="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="form-select"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Audio & Acoustics">Audio & Acoustics</option>
                      <option value="Smart Wearables">Smart Wearables</option>
                      <option value="Photography">Photography</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="product-stock-input" className="form-label">
                    Available Stock (Units) <span className="required-star">*</span>
                  </label>
                  <div className="input-with-icon">
                    <Boxes className="field-icon" aria-hidden="true" />
                    <input
                      type="number"
                      id="product-stock-input"
                      name="stock"
                      min="1"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className={`form-input ${formErrors.stock ? 'input-error' : ''}`}
                      aria-describedby={formErrors.stock ? 'stock-error' : undefined}
                      aria-invalid={!!formErrors.stock}
                    />
                  </div>
                  {formErrors.stock && (
                    <p className="field-error-text" id="stock-error" role="alert">
                      {formErrors.stock}
                    </p>
                  )}
                </div>
              </div>

              {/* Price & Original Price in 2 cols */}
              <div className="form-row-2col">
                <div className="form-group">
                  <label htmlFor="product-price-input" className="form-label">
                    Price ($ USD) <span className="required-star">*</span>
                  </label>
                  <div className="input-with-icon">
                    <DollarSign className="field-icon" aria-hidden="true" />
                    <input
                      type="number"
                      id="product-price-input"
                      name="price"
                      min="1"
                      step="any"
                      placeholder="e.g., 299"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className={`form-input ${formErrors.price ? 'input-error' : ''}`}
                      aria-describedby={formErrors.price ? 'price-error' : undefined}
                      aria-invalid={!!formErrors.price}
                    />
                  </div>
                  {formErrors.price && (
                    <p className="field-error-text" id="price-error" role="alert">
                      {formErrors.price}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="product-original-price-input" className="form-label">
                    Original Price ($ Optional)
                  </label>
                  <div className="input-with-icon">
                    <DollarSign className="field-icon" aria-hidden="true" />
                    <input
                      type="number"
                      id="product-original-price-input"
                      name="originalPrice"
                      min="1"
                      step="any"
                      placeholder="e.g., 349 (to show discount)"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Image URL & Quick Sample Presets */}
              <div className="form-group">
                <label htmlFor="product-image-input" className="form-label">
                  Image URL <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <ImageIcon className="field-icon" aria-hidden="true" />
                  <input
                    type="url"
                    id="product-image-input"
                    name="image"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className={`form-input ${formErrors.image ? 'input-error' : ''}`}
                    aria-describedby={formErrors.image ? 'image-error' : undefined}
                    aria-invalid={!!formErrors.image}
                  />
                </div>
                {formErrors.image && (
                  <p className="field-error-text" id="image-error" role="alert">
                    {formErrors.image}
                  </p>
                )}

                <div className="presets-row">
                  <span className="presets-label">Quick Image Presets:</span>
                  {sampleImages.map((sample) => (
                    <button
                      type="button"
                      key={sample.label}
                      className="preset-btn"
                      onClick={() => setFormData({ ...formData, image: sample.url })}
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="product-description-input" className="form-label">
                  Full Description <span className="required-star">*</span>
                </label>
                <div className="input-with-icon textarea-wrap">
                  <textarea
                    id="product-description-input"
                    name="description"
                    rows={4}
                    placeholder="Provide detailed product specifications, condition, warranty, and features..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`form-textarea ${formErrors.description ? 'input-error' : ''}`}
                    aria-describedby={formErrors.description ? 'description-error' : undefined}
                    aria-invalid={!!formErrors.description}
                  />
                </div>
                {formErrors.description && (
                  <p className="field-error-text" id="description-error" role="alert">
                    {formErrors.description}
                  </p>
                )}
              </div>

              {/* Form Actions */}
              <div className="form-actions-row">
                <button
                  type="submit"
                  className="btn-primary btn-large"
                  id="btn-submit-product"
                  disabled={isSubmitting}
                >
                  <Sparkles className="btn-icon" aria-hidden="true" />
                  <span>{isSubmitting ? 'Publishing Listing...' : 'Publish Product to Marketplace'}</span>
                  <ArrowRight className="btn-arrow-icon" aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </RouteGuard>
  );
}
