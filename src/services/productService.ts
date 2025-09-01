/**
 * Serviço centralizado de produtos com cache inteligente
 * Otimizado para performance máxima
 */

import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { convertSupabaseToProduct, SupabaseProduct } from '@/types/supabase-product';

interface CachedData {
  data: Product[];
  timestamp: number;
  ttl: number;
}

interface ProductFilters {
  brand?: string;
  featured?: boolean;
  isNew?: boolean;
  onSale?: boolean;
  outOfStock?: boolean;
}

class ProductService {
  private cache = new Map<string, CachedData>();
  private readonly DEFAULT_TTL = 30000; // 30 segundos
  private readonly BACKGROUND_REFRESH_TTL = 10000; // 10 segundos
  private pendingRequests = new Map<string, Promise<Product[]>>();

  /**
   * Query consolidada única para buscar TODOS os produtos
   * Reduz múltiplas queries para uma única
   */
  async getAllProducts(forceRefresh = false): Promise<Product[]> {
    const cacheKey = 'all_products';
    
    // Verificar cache válido
    if (!forceRefresh && this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    // Evitar requests duplicados
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    const request = this.fetchAllProductsFromDB();
    this.pendingRequests.set(cacheKey, request);

    try {
      const products = await request;
      this.setCache(cacheKey, products);
      return products;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  /**
   * Fetch otimizado do banco com timeout
   */
  private async fetchAllProductsFromDB(): Promise<Product[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_visible', true)
        .eq('status', 'active')
        .order('sort_order', { ascending: true })
        .order('updated_at', { ascending: false })
        .abortSignal(controller.signal);

      if (error) throw error;

      return data?.map((item: SupabaseProduct) => convertSupabaseToProduct(item)) || [];
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Filtros client-side para performance
   */
  getFilteredProducts(products: Product[], filters: ProductFilters): Product[] {
    return products.filter(product => {
      if (filters.brand && product.brand !== filters.brand) return false;
      
      if (filters.featured && !product.is_featured && 
          !(product.badges || []).some(b => ['DESTAQUE', 'Destaque'].includes(b))) {
        return false;
      }
      
      if (filters.isNew) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const isNewProduct = new Date(product.created_at || '') > thirtyDaysAgo;
        const hasNewBadge = (product.badges || []).some(b => 
          ['NOVIDADE', 'Novidade', 'NOVO', 'Novo', 'LIMITADO', 'Limitado'].includes(b)
        );
        if (!isNewProduct && !hasNewBadge) return false;
      }
      
      if (filters.onSale) {
        const hasOfferBadge = (product.badges || []).some(b => 
          ['OFERTA', 'PROMOÇÃO', 'DESCONTO', 'Oferta', 'Promoção', 'Desconto'].includes(b)
        );
        const hasPriceReduction = product.original_price && 
          parseFloat(product.original_price.toString()) > parseFloat(product.price.toString());
        if (!hasOfferBadge && !hasPriceReduction) return false;
      }
      
      if (filters.outOfStock && (product.stock_quantity || 0) > 0) return false;

      return true;
    });
  }

  /**
   * APIs específicas usando cache global
   */
  async getFeaturedProducts(): Promise<Product[]> {
    const allProducts = await this.getAllProducts();
    return this.getFilteredProducts(allProducts, { featured: true }).slice(0, 30);
  }

  async getBrandProducts(brand: string): Promise<Product[]> {
    const allProducts = await this.getAllProducts();
    return this.getFilteredProducts(allProducts, { brand }).slice(0, 8);
  }

  async getNewProducts(): Promise<Product[]> {
    const allProducts = await this.getAllProducts();
    return this.getFilteredProducts(allProducts, { isNew: true }).slice(0, 30);
  }

  async getOffersProducts(): Promise<Product[]> {
    const allProducts = await this.getAllProducts();
    return this.getFilteredProducts(allProducts, { onSale: true }).slice(0, 30);
  }

  async getOutOfStockProducts(): Promise<Product[]> {
    const allProducts = await this.getAllProducts();
    return this.getFilteredProducts(allProducts, { outOfStock: true }).slice(0, 30);
  }

  /**
   * Busca de produto específico com cache otimizado
   */
  async getProduct(id: string): Promise<Product | null> {
    const allProducts = await this.getAllProducts();
    return allProducts.find(p => p.id === id) || null;
  }

  /**
   * Prefetch inteligente para melhor UX
   */
  async prefetchProducts(): Promise<void> {
    const cacheKey = 'all_products';
    
    // Só faz prefetch se cache está velho ou não existe
    if (!this.cache.has(cacheKey) || !this.isCacheValid(cacheKey, this.BACKGROUND_REFRESH_TTL)) {
      try {
        await this.getAllProducts(true);
      } catch (error) {
        console.warn('Prefetch failed:', error);
      }
    }
  }

  /**
   * Gerenciamento de cache otimizado
   */
  private isCacheValid(key: string, customTTL?: number): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    
    const ttl = customTTL || cached.ttl;
    return (Date.now() - cached.timestamp) < ttl;
  }

  private setCache(key: string, data: Product[], customTTL?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: customTTL || this.DEFAULT_TTL
    });
  }

  /**
   * Invalidação de cache
   */
  invalidateCache(pattern?: string): void {
    if (pattern) {
      Array.from(this.cache.keys())
        .filter(key => key.includes(pattern))
        .forEach(key => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }

  /**
   * Stats para monitoramento
   */
  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      cacheKeys: Array.from(this.cache.keys())
    };
  }
}

// Singleton para performance
export const productService = new ProductService();