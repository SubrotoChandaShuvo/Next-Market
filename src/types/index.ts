export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  stock: number;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  createdAt: string;
  featured?: boolean;
  tags?: string[];
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  slug: string;
  itemCount: number;
  description: string;
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'newest';

export interface FilterState {
  search: string;
  category: string;
  minPrice: number | '';
  maxPrice: number | '';
  sortBy: SortOption;
}
