import { useEffect, useCallback } from 'react';
import { productService } from '@/services/productService';

/**
 * Hook para prefetch inteligente de produtos
 * Melhora a performance percebida pelo usuário
 */
export const useProductPrefetch = () => {
  const prefetchProducts = useCallback(async () => {
    try {
      await productService.prefetchProducts();
    } catch (error) {
      console.warn('Prefetch de produtos falhou:', error);
    }
  }, []);

  // Prefetch automático no mount
  useEffect(() => {
    // Delay pequeno para não afetar o carregamento inicial
    const timer = setTimeout(prefetchProducts, 100);
    return () => clearTimeout(timer);
  }, [prefetchProducts]);

  // Prefetch em eventos de interação
  useEffect(() => {
    const handleUserInteraction = () => {
      prefetchProducts();
    };

    // Prefetch em hover na navegação
    const navLinks = document.querySelectorAll('nav a, [data-nav-link]');
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', handleUserInteraction, { once: true });
    });

    // Prefetch em scroll
    let scrollTimer: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(handleUserInteraction, 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true, once: true });

    return () => {
      navLinks.forEach(link => {
        link.removeEventListener('mouseenter', handleUserInteraction);
      });
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, [prefetchProducts]);

  return {
    prefetchProducts,
    getCacheStats: productService.getCacheStats.bind(productService),
    invalidateCache: productService.invalidateCache.bind(productService)
  };
};