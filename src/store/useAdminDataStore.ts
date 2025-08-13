import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url?: string;
  status?: string;
  stock_quantity?: number;
  badges?: string[];
  is_visible?: boolean;
  is_featured?: boolean;
  created_at?: string;
}

interface AdminDataState {
  products: Product[];
  loadingProducts: boolean;
  lastProductsFetch?: number;
  fetchProducts: (opts?: { force?: boolean; signal?: AbortSignal }) => Promise<Product[]>;
  prefetchProducts: () => void;
  clear: () => void;
}

export const useAdminDataStore = create<AdminDataState>((set, get) => ({
  products: [],
  loadingProducts: false,
  lastProductsFetch: undefined,

  fetchProducts: async (opts) => {
    const { force = false, signal } = opts || {};
    const now = Date.now();
    const { lastProductsFetch, products } = get();

    if (!force && lastProductsFetch && now - lastProductsFetch < 60_000 && products.length > 0) {
      return products;
    }

    set({ loadingProducts: true });
    try {
      let query = supabase.from('products').select('*').order('created_at', { ascending: false });
      // @ts-ignore - postgrest-js supports abortSignal in v2 via chain method
      if (signal && typeof (query as any).abortSignal === 'function') {
        // @ts-ignore
        query = (query as any).abortSignal(signal);
      }
      const { data, error } = await query;
      if (error) throw error;
      const list = data || [];
      set({ products: list, lastProductsFetch: now });
      return list;
    } finally {
      set({ loadingProducts: false });
    }
  },

  prefetchProducts: () => {
    const controller = new AbortController();
    get().fetchProducts({ force: false, signal: controller.signal }).catch(() => {});
    // auto-cancel after 3s to avoid leaks
    setTimeout(() => controller.abort(), 3000);
  },

  clear: () => set({ products: [], lastProductsFetch: undefined })
}));
