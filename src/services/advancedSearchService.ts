import { Product } from '@/types/product';
import { productService } from './productService';

/**
 * Serviço de pesquisa avançada otimizado
 * Usa cache inteligente e busca eficiente
 */
class AdvancedSearchService {
  private cache = new Map<string, { results: Product[]; timestamp: number }>();
  private readonly CACHE_TTL = 60000; // 1 minuto

  /**
   * Busca produtos por nome ou marca
   */
  async searchProducts(query: string): Promise<Product[]> {
    // Sanitizar entrada
    const sanitizedQuery = this.sanitizeQuery(query);
    if (!sanitizedQuery || sanitizedQuery.length < 1) {
      return [];
    }

    // Verificar cache
    const cacheKey = sanitizedQuery.toLowerCase();
    const cached = this.getCachedResult(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Buscar todos os produtos usando o productService existente
      const allProducts = await productService.getAllProducts();
      
      // Filtrar localmente por nome e marca
      const filteredProducts = this.filterProducts(allProducts, sanitizedQuery);
      
      // Ordenar por relevância
      const sortedResults = this.sortByRelevance(filteredProducts, sanitizedQuery);
      
      // Cache do resultado
      this.setCacheResult(cacheKey, sortedResults);
      
      return sortedResults;
    } catch (error) {
      console.error('Erro na busca de produtos:', error);
      throw new Error('Falha na busca. Tente novamente.');
    }
  }

  /**
   * Filtrar produtos por consulta
   */
  private filterProducts(products: Product[], query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    
    return products.filter(product => {
      // Verificar se produto está visível e ativo
      if (!product.is_visible || product.status !== 'active') {
        return false;
      }

      // Buscar em nome e marca
      const nameMatch = product.name?.toLowerCase().includes(lowerQuery);
      const brandMatch = product.brand?.toLowerCase().includes(lowerQuery);
      
      return nameMatch || brandMatch;
    });
  }

  /**
   * Ordenar por relevância
   */
  private sortByRelevance(products: Product[], query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    
    return products.sort((a, b) => {
      // Pontuação de relevância
      const scoreA = this.calculateRelevanceScore(a, lowerQuery);
      const scoreB = this.calculateRelevanceScore(b, lowerQuery);
      
      if (scoreA !== scoreB) {
        return scoreB - scoreA; // Maior score primeiro
      }
      
      // Desempate: produtos em destaque primeiro
      if (a.is_featured !== b.is_featured) {
        return a.is_featured ? -1 : 1;
      }
      
      // Desempate final: mais recente primeiro
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  /**
   * Calcular score de relevância
   */
  private calculateRelevanceScore(product: Product, query: string): number {
    let score = 0;
    const name = product.name?.toLowerCase() || '';
    const brand = product.brand?.toLowerCase() || '';
    
    // Coincidência exata no nome (maior peso)
    if (name === query) score += 100;
    else if (name.startsWith(query)) score += 80;
    else if (name.includes(query)) score += 40;
    
    // Coincidência exata na marca
    if (brand === query) score += 90;
    else if (brand.startsWith(query)) score += 70;
    else if (brand.includes(query)) score += 30;
    
    // Bônus para produtos em destaque
    if (product.is_featured) score += 10;
    
    return score;
  }

  /**
   * Sanitizar query de entrada
   */
  private sanitizeQuery(query: string): string {
    if (!query || typeof query !== 'string') return '';
    
    return query
      .trim()
      .replace(/[^\w\s\-\.]/g, '') // Remove caracteres especiais
      .substring(0, 50); // Limita tamanho
  }

  /**
   * Obter resultado do cache
   */
  private getCachedResult(key: string): Product[] | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > this.CACHE_TTL;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.results;
  }

  /**
   * Salvar resultado no cache
   */
  private setCacheResult(key: string, results: Product[]): void {
    // Limitar tamanho do cache
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      results,
      timestamp: Date.now()
    });
  }

  /**
   * Limpar cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Estatísticas do cache
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Instância singleton
export const advancedSearchService = new AdvancedSearchService();