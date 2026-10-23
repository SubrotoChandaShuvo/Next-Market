'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import RouteGuard from '@/components/RouteGuard';
import type { Product } from '@/types';
import {
  FolderKanban,
  PlusCircle,
  Trash2,
  ExternalLink,
  AlertTriangle,
  PackageX,
  CheckCircle2,
  X,
  RotateCcw,
} from 'lucide-react';

export default function ManageProductsPage() {
  const { user } = useAuth();
  const { products, deleteProduct, resetToDefaults } = useProducts();

  // Show products created by this user or user's manageable inventory
  // If the user has specific products with their sellerId, show those, plus demo items if none yet
  const userProducts = products.filter(
    (p) => p.sellerId === user?.uid || p.sellerEmail === user?.email || p.sellerId === 'seller_subroto_001'
  );

  // Fallback to all products if specific user has no assigned mock items
  const displayProducts = userProducts.length > 0 ? userProducts : products;

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const confirmDelete = () => {
    if (productToDelete) {
      const deletedTitle = productToDelete.title;
      deleteProduct(productToDelete.id);
      setProductToDelete(null);
      setFeedbackMessage(`"${deletedTitle}" was deleted successfully.`);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  return (
    <RouteGuard>
      <main className="manage-products-page" id="manage-products-main">
        <div className="section-container">
          {/* Header */}
          <div className="manage-header-row">
            <div>
              <div className="eyebrow-with-icon">
                <FolderKanban className="eyebrow-icon" aria-hidden="true" />
                <span>Seller Inventory Dashboard</span>
              </div>
              <h1 className="page-heading-title" id="manage-page-title">
                Manage My Products
              </h1>
              <p className="page-heading-subtitle">
                Track live inventory, inspect product performance, or remove discontinued listings.
              </p>
            </div>
            <div className="manage-header-actions">
              <Link href="/add-product" className="btn-primary" id="btn-add-new-listing">
                <PlusCircle className="btn-icon" aria-hidden="true" />
                <span>Add New Product</span>
              </Link>
            </div>
          </div>

          {/* Feedback Toast */}
          {feedbackMessage && (
            <div className="feedback-banner" role="status" aria-live="polite" id="manage-feedback-toast">
              <CheckCircle2 className="feedback-icon" aria-hidden="true" />
              <span>{feedbackMessage}</span>
            </div>
          )}

          {/* Product Inventory Table or Empty State */}
          {displayProducts.length === 0 ? (
            <div className="empty-state-card" id="empty-manage-state" role="alert">
              <PackageX className="empty-state-icon" aria-hidden="true" />
              <h2 className="empty-state-title">No Products in Inventory</h2>
              <p className="empty-state-desc">
                You haven't listed any products yet, or all items were removed. Start selling today to reach
                thousands of verified buyers.
              </p>
              <div className="empty-actions-row">
                <Link href="/add-product" className="btn-primary" id="btn-empty-add-product">
                  <PlusCircle className="btn-icon" aria-hidden="true" />
                  <span>List Your First Product</span>
                </Link>
                <button
                  type="button"
                  onClick={resetToDefaults}
                  className="btn-secondary"
                  id="btn-restore-defaults"
                >
                  <RotateCcw className="btn-icon" aria-hidden="true" />
                  <span>Restore Demo Catalog</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="manage-table-wrapper" id="inventory-table-container">
              <table className="manage-table" aria-label="My Listed Products">
                <thead>
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Category</th>
                    <th scope="col">Price</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Rating</th>
                    <th scope="col" className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayProducts.map((item) => (
                    <tr key={item.id} id={`manage-row-${item.id}`}>
                      <td className="product-title-cell">
                        <div className="manage-product-meta">
                          <Image
                            src={item.image}
                            alt=""
                            width={54}
                            height={44}
                            className="manage-thumb-img"
                            unoptimized
                          />
                          <div>
                            <Link
                              href={`/products/${item.id}`}
                              className="manage-table-title-link"
                              id={`title-link-${item.id}`}
                            >
                              {item.title}
                            </Link>
                            <span className="manage-id-chip">ID: {item.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="category-pill-sm">{item.category}</span>
                      </td>
                      <td className="price-cell">
                        <span className="table-price">${item.price}</span>
                      </td>
                      <td>
                        <span
                          className={`stock-badge-sm ${item.stock > 0 ? 'in-stock' : 'out-of-stock'}`}
                        >
                          {item.stock > 0 ? `${item.stock} in stock` : 'Sold Out'}
                        </span>
                      </td>
                      <td>
                        <span className="rating-badge-sm">★ {item.rating}</span>
                      </td>
                      <td className="actions-cell text-right">
                        <div className="table-actions-group">
                          <Link
                            href={`/products/${item.id}`}
                            className="btn-table-action btn-view-action"
                            id={`view-action-${item.id}`}
                            aria-label={`View detail page for ${item.title}`}
                          >
                            <ExternalLink className="action-icon" aria-hidden="true" />
                            <span>View</span>
                          </Link>
                          <button
                            type="button"
                            className="btn-table-action btn-delete-action"
                            id={`delete-action-${item.id}`}
                            aria-label={`Delete ${item.title}`}
                            onClick={() => setProductToDelete(item)}
                          >
                            <Trash2 className="action-icon" aria-hidden="true" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal (Requirement 9 & 14) */}
        {productToDelete && (
          <div
            className="modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            id="delete-confirm-modal"
          >
            <div className="modal-dialog-box">
              <div className="modal-header">
                <div className="modal-danger-icon-wrap">
                  <AlertTriangle className="danger-modal-icon" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="modal-title" id="delete-dialog-title">
                    Confirm Product Deletion
                  </h2>
                  <p className="modal-subtitle">
                    This action cannot be undone. Are you sure you want to proceed?
                  </p>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setProductToDelete(null)}
                  aria-label="Close deletion dialog"
                >
                  <X className="close-icon" aria-hidden="true" />
                </button>
              </div>

              <div className="modal-body">
                <p className="modal-warning-text">
                  You are about to delete <strong>"{productToDelete.title}"</strong> (ID:{' '}
                  <code>{productToDelete.id}</code>). It will be permanently removed from all catalog
                  listings, detail pages, and search queries.
                </p>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  id="btn-cancel-delete"
                  onClick={() => setProductToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-danger"
                  id="btn-confirm-delete"
                  onClick={confirmDelete}
                >
                  <Trash2 className="btn-icon" aria-hidden="true" />
                  <span>Yes, Delete Product</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </RouteGuard>
  );
}
