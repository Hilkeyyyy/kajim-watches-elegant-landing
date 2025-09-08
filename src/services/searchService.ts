import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { debounce } from '@/utils/debounce';

interface SearchCache {
  [key: string]: {
    data: Product[];
    timestamp: number;
    ttl: number;
  };
}

/**
 * Serviço otimizado de busca de produtos
 */
class SearchService {
  private cache: SearchCache = {};
  private pendingSearches = new Map<string, Promise<Product[]>>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  private isCacheValid(key: string): boolean {
    const cached = this.cache[key];
    return cached && (Date.now() - cached.timestamp) < cached.ttl;
  }

  private setCache(key: string, data: Product[]): void {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
      ttl: this.CACHE_TTL
    };
  }

  private getCacheKey(term: string, limit: number): string {
    return `search:${term.toLowerCase().trim()}:${limit}`;
  }

  async searchProducts(searchTerm: string, limit: number = 8): Promise<Product[]> {
    const trimmedTerm = searchTerm.trim();
    
    if (!trimmedTerm || trimmedTerm.length < 2) {
      return [];
    }

    const cacheKey = this.getCacheKey(trimmedTerm, limit);

    // Verificar cache primeiro
    if (this.isCacheValid(cacheKey)) {
      return this.cache[cacheKey].data;
    }

    // Verificar se já há uma busca pendente
    if (this.pendingSearches.has(cacheKey)) {
      return this.pendingSearches.get(cacheKey)!;
    }

    // Realizar nova busca
    const searchPromise = this.performSearch(trimmedTerm, limit);
    this.pendingSearches.set(cacheKey, searchPromise);

    try {
      const results = await searchPromise;
      this.setCache(cacheKey, results);
      return results;
    } catch (error) {
      console.error('Erro na busca de produtos:', error);
      throw error;
    } finally {
      this.pendingSearches.delete(cacheKey);
    }
  }

  private async performSearch(searchTerm: string, limit: number): Promise<Product[]> {
    try {
      const { data, error } = await supabase.rpc('search_products_json', {
        search_term: searchTerm,
        result_limit: limit
      });

      if (error) throw error;

      if (!data || !Array.isArray(data)) {
        return [];
      }

      return data.map((item: any): Product => ({
        id: item.id,
        name: item.name || '',
        brand: item.brand || '',
        description: item.description || '',
        price: item.price || '0',
        original_price: item.original_price ?? item.price ?? '0',
        image: item.image,
        images: item.images || [],
        features: item.features || [],
        status: item.status || 'active',
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
    } catch (rpcError) {
      console.warn('RPC search failed, using fallback query:', rpcError);

      const safeTerm = searchTerm.replace(/[,%_]/g, ' ').trim();

      const { data: rows, error: qError } = await supabase
        .from('products')
        .select('id,name,brand,description,price,original_price,image_url,images,features,status,created_at,updated_at,is_visible')
        .eq('is_visible', true)
        .eq('status', 'active')
        .or(`name.ilike.%${safeTerm}%,brand.ilike.%${safeTerm}%,description.ilike.%${safeTerm}%`)
        .limit(limit);

      if (qError) {
        console.error('Fallback search failed:', qError);
        throw new Error('Erro ao buscar produtos');
      }

      if (!rows || !Array.isArray(rows)) return [];

      const termLower = searchTerm.toLowerCase();
      const sorted = [...rows].sort((a: any, b: any) => {
        const an = (a.name || '').toLowerCase();
        const bn = (b.name || '').toLowerCase();
        const ab = (a.brand || '').toLowerCase();
        const bb = (b.brand || '').toLowerCase();
        const aStarts = an.startsWith(termLower) ? 0 : ab.startsWith(termLower) ? 1 : 2;
        const bStarts = bn.startsWith(termLower) ? 0 : bb.startsWith(termLower) ? 1 : 2;
        if (aStarts !== bStarts) return aStarts - bStarts;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      return sorted.map((item: any): Product => ({
        id: item.id,
        name: item.name || '',
        brand: item.brand || '',
        description: item.description || '',
        price: item.price != null ? String(item.price) : '0',
        original_price: item.original_price != null ? String(item.original_price) : (item.price != null ? String(item.price) : '0'),
        image: item.image_url,
        images: item.images || [],
        features: item.features || [],
        status: item.status || 'active',
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
    }
  }

  // Debounced search para uso em tempo real
  debouncedSearch = debounce(
    (searchTerm: string, callback: (results: Product[]) => void, limit?: number) => {
      this.searchProducts(searchTerm, limit)
        .then(callback)
        .catch(error => {
          console.error('Erro na busca com debounce:', error);
          callback([]);
        });
    },
    300
  );

  clearCache(): void {
    this.cache = {};
    this.pendingSearches.clear();
  }

  getCacheStats() {
    return {
      cacheSize: Object.keys(this.cache).length,
      pendingSearches: this.pendingSearches.size
    };
  }
}

export const searchService = new SearchService();