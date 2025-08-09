
export type { Product } from './product';

export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  is_featured: boolean;
  sort_order: number;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

export interface ProductFilters {
  brand?: string;
  price_min?: number;
  price_max?: number;
  features?: string[];
  is_featured?: boolean;
  search?: string;
}
