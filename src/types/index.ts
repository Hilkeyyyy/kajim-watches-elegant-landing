
export interface Product {
  id: string;
  name: string;
  brand: string;
  model?: string;
  price: number;
  description?: string;
  image_url?: string;
  images: string[];
  
  // Especificações técnicas
  movement?: string;
  caliber?: string;
  case_diameter?: string;
  case_material?: string;
  water_resistance?: string;
  crystal?: string;
  dial_color?: string;
  strap_material?: string;
  features: string[];
  
  // Status
  status: 'active' | 'inactive' | 'out_of_stock';
  is_visible: boolean;
  is_featured: boolean;
  stock_quantity: number;
  
  created_at: string;
  updated_at: string;
}

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
