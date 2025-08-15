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
    const { lastProductsFetch, products, loadingProducts } = get();

    // Cache inteligente - evitar múltiplas requisições simultâneas
    if (loadingProducts && !force) {
      console.log('useAdminDataStore - Fetch já em andamento, aguardando...');
      return products;
    }

    // Cache temporal robusto
    if (!force && lastProductsFetch && now - lastProductsFetch < 30_000 && products.length > 0) {
      console.log('useAdminDataStore - Usando dados do cache (30s)', { count: products.length });
      return products;
    }

    console.log('useAdminDataStore - Fazendo fetch de products', { force, cached: products.length });
    set({ loadingProducts: true });
    
    try {
      // Verificação de abort antes da requisição
      if (signal?.aborted) {
        throw new Error('Request aborted before start');
      }

      let query = supabase.from('products').select('*').order('created_at', { ascending: false });
      
      // AbortController integrado com timeout
      const timeoutId = setTimeout(() => {
        if (signal && !signal.aborted) {
          console.warn('useAdminDataStore - Fetch timeout, cancelando');
          // Não podemos abortar um signal externo, mas logamos
        }
      }, 10000); // 10s timeout

      const { data, error } = await query;
      clearTimeout(timeoutId);

      // Verificar abort após resposta
      if (signal?.aborted) {
        console.log('useAdminDataStore - Request was aborted');
        return get().products; // Retornar dados existentes
      }

      if (error) {
        console.error('useAdminDataStore - Error fetching products:', error);
        throw error;
      }

      const list = data || [];
      console.log('useAdminDataStore - Products fetched successfully:', list.length);
      set({ products: list, lastProductsFetch: now });
      return list;
    } catch (error: any) {
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        console.log('useAdminDataStore - Fetch foi cancelado');
        return get().products; // Retornar dados existentes em caso de abort
      }
      
      console.error('useAdminDataStore - Erro ao buscar produtos:', error);
      // Manter produtos existentes em caso de erro
      return get().products;
    } finally {
      set({ loadingProducts: false });
    }
  },

  prefetchProducts: () => {
    const controller = new AbortController();
    const { loadingProducts, lastProductsFetch } = get();
    
    // Não prefetch se já carregando ou cache muito recente
    if (loadingProducts) {
      console.log('useAdminDataStore - Prefetch cancelado: fetch em andamento');
      return;
    }
    
    const now = Date.now();
    if (lastProductsFetch && now - lastProductsFetch < 10_000) {
      console.log('useAdminDataStore - Prefetch cancelado: cache recente');
      return;
    }
    
    console.log('useAdminDataStore - Iniciando prefetch');
    get().fetchProducts({ force: false, signal: controller.signal }).catch((error) => {
      if (error.name !== 'AbortError') {
        console.warn('useAdminDataStore - Prefetch error:', error);
      }
    });
    
    // auto-cancel after 5s para prefetch
    setTimeout(() => {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    }, 5000);
  },

  clear: () => set({ products: [], lastProductsFetch: undefined })
}));
