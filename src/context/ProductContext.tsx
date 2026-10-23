'use client';

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Product, Category, FilterState } from '@/types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-all',
    name: 'All Categories',
    iconName: 'LayoutGrid',
    slug: 'all',
    itemCount: 8,
    description: 'Explore our complete marketplace selection',
  },
  {
    id: 'cat-electronics',
    name: 'Electronics',
    iconName: 'Laptop',
    slug: 'electronics',
    itemCount: 3,
    description: 'Premium laptops, displays, and high-performance computing',
  },
  {
    id: 'cat-audio',
    name: 'Audio & Acoustics',
    iconName: 'Headphones',
    slug: 'audio',
    itemCount: 2,
    description: 'Studio monitors, wireless ANC headphones, and earbuds',
  },
  {
    id: 'cat-wearables',
    name: 'Smart Wearables',
    iconName: 'Watch',
    slug: 'wearables',
    itemCount: 2,
    description: 'Next-gen smartwatches and advanced biometric trackers',
  },
  {
    id: 'cat-photography',
    name: 'Photography',
    iconName: 'Camera',
    slug: 'photography',
    itemCount: 1,
    description: 'Mirrorless 4K cameras, prime lenses, and gimbals',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-101',
    title: 'AuraStudio Noise-Cancelling Headphones Pro',
    description: 'Flagship wireless headphones featuring hybrid active noise cancellation, custom 40mm beryllium drivers, 45-hour battery life, and ultra-plush memory foam earcups.',
    price: 349,
    originalPrice: 399,
    category: 'Audio & Acoustics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 128,
    stock: 24,
    sellerId: 'seller_subroto_001',
    sellerName: 'Subroto Chanda',
    sellerEmail: 'subroto@nextmarket.com',
    createdAt: '2026-10-15T10:00:00Z',
    featured: true,
    tags: ['ANC', 'Wireless', 'Audiophile'],
  },
  {
    id: 'prod-102',
    title: 'Zenith UltraBook Pro 16 M-Edition',
    description: 'Ultra-thin titanium chassis laptop powered by a 12-core processor, 32GB unified memory, 1TB NVMe Gen4 SSD, and a stunning 120Hz Liquid Retina display.',
    price: 1899,
    originalPrice: 2099,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 94,
    stock: 12,
    sellerId: 'seller_subroto_001',
    sellerName: 'Subroto Chanda',
    sellerEmail: 'subroto@nextmarket.com',
    createdAt: '2026-10-16T14:30:00Z',
    featured: true,
    tags: ['Laptop', 'Workstation', 'Productivity'],
  },
  {
    id: 'prod-103',
    title: 'Chronos Titanium GPS Smartwatch S3',
    description: 'Aerospace-grade titanium housing with sapphire crystal face. Features dual-frequency GNSS navigation, ECG monitoring, and 14-day extended battery mode.',
    price: 499,
    originalPrice: 549,
    category: 'Smart Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 65,
    stock: 18,
    sellerId: 'seller_subroto_001',
    sellerName: 'Subroto Chanda',
    sellerEmail: 'subroto@nextmarket.com',
    createdAt: '2026-10-17T09:15:00Z',
    featured: true,
    tags: ['Smartwatch', 'Fitness', 'Titanium'],
  },
  {
    id: 'prod-104',
    title: 'Lumina 4K Mirrorless Cinema Camera',
    description: 'Full-frame 33MP sensor capable of 4K 120fps recording in 10-bit 4:2:2 internal ProRes. Exceptional low-light ISO sensitivity and dual card slots.',
    price: 2199,
    originalPrice: 2399,
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 42,
    stock: 8,
    sellerId: 'seller_demo_002',
    sellerName: 'Visual Arts Supply',
    sellerEmail: 'contact@visualarts.com',
    createdAt: '2026-10-18T16:00:00Z',
    featured: true,
    tags: ['Camera', 'Cinema', '4K'],
  },
  {
    id: 'prod-105',
    title: 'Verve Precision Ergonomic Mechanical Keyboard',
    description: 'Hot-swappable tactile switches, gasket-mounted sound dampening, CNC anodized aluminum case, and customizable per-key RGB backlighting.',
    price: 189,
    originalPrice: 219,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewCount: 88,
    stock: 35,
    sellerId: 'seller_subroto_001',
    sellerName: 'Subroto Chanda',
    sellerEmail: 'subroto@nextmarket.com',
    createdAt: '2026-10-19T11:20:00Z',
    featured: false,
    tags: ['Mechanical', 'Ergonomic', 'RGB'],
  },
  {
    id: 'prod-106',
    title: 'HyperPod Mini Hi-Fi Smart Speaker',
    description: 'Omnidirectional high-excursion woofer with dual passive radiators, room calibration acoustics, and multi-room audio synchronization.',
    price: 129,
    originalPrice: 149,
    category: 'Audio & Acoustics',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviewCount: 110,
    stock: 40,
    sellerId: 'seller_demo_002',
    sellerName: 'Visual Arts Supply',
    sellerEmail: 'contact@visualarts.com',
    createdAt: '2026-10-20T13:45:00Z',
    featured: false,
    tags: ['Speaker', 'SmartHome', 'HiFi'],
  },
  {
    id: 'prod-107',
    title: 'Horizon Curved Ultrawide Display 34-Inch',
    description: 'WQHD 3440x1440 IPS panel with 1800R curvature, 165Hz refresh rate, 98% DCI-P3 color gamut, and 90W USB-C single cable power delivery.',
    price: 749,
    originalPrice: 829,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 52,
    stock: 15,
    sellerId: 'seller_subroto_001',
    sellerName: 'Subroto Chanda',
    sellerEmail: 'subroto@nextmarket.com',
    createdAt: '2026-10-21T08:30:00Z',
    featured: false,
    tags: ['Monitor', 'Ultrawide', 'USB-C'],
  },
  {
    id: 'prod-108',
    title: 'Pulse BioBand Fitness Tracker Core',
    description: 'Continuous heart rate, sleep staging, VO2 max estimation, and skin temperature sensor in a lightweight waterproof silicone band with 10-day battery.',
    price: 99,
    originalPrice: 119,
    category: 'Smart Wearables',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80',
    rating: 4.4,
    reviewCount: 77,
    stock: 50,
    sellerId: 'seller_demo_002',
    sellerName: 'Visual Arts Supply',
    sellerEmail: 'contact@visualarts.com',
    createdAt: '2026-10-22T12:00:00Z',
    featured: false,
    tags: ['Fitness', 'Wearable', 'Waterproof'],
  },
];

const LOCAL_STORAGE_PRODUCTS_KEY = 'next_market_products';

interface ProductContextType {
  products: Product[];
  categories: Category[];
  isInitialized: boolean;
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => Product;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  resetToDefaults: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  // Safe initial state that matches SSR perfectly
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isInitialized, setIsInitialized] = useState(false);

  // Hydration-safe client initialization
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        } else {
          localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
        }
      } else {
        localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      }
    } catch (e) {
      console.warn('Could not read products from local storage:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const addProduct = (
    productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>
  ): Product => {
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now().toString(),
      createdAt: new Date().toISOString(),
      rating: 5.0,
      reviewCount: 1,
    };

    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn('Failed to persist added product:', e);
        }
      }
      return updated;
    });

    return newProduct;
  };

  const deleteProduct = (id: string): void => {
    setProducts((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn('Failed to persist product deletion:', e);
        }
      }
      return updated;
    });
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find((p) => p.id === id);
  };

  const resetToDefaults = (): void => {
    setProducts(INITIAL_PRODUCTS);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        isInitialized,
        addProduct,
        deleteProduct,
        getProductById,
        resetToDefaults,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
