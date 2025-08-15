import React from 'react';

/**
 * Componente otimizado para melhorar performance COM PROTEÇÃO TOTAL CONTRA removeChild
 */
export const PerformanceOptimizer = React.memo(({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    const cleanupTasks: Array<() => void> = [];
    
    try {
      // Múltiplas verificações de segurança DOM
      if (!document?.head) {
        console.warn('PerformanceOptimizer: document.head não disponível');
        return;
      }

      // Preload crítico com proteção total
      const linkElement = document.createElement('link');
      linkElement.rel = 'preload';
      linkElement.href = '/api/products';
      linkElement.as = 'fetch';
      linkElement.setAttribute('data-performance-optimizer', 'true');
      
      // Verificação dupla antes de inserir
      if (document.head && !document.head.querySelector('[data-performance-optimizer="true"]')) {
        document.head.appendChild(linkElement);
        
        // Registrar cleanup seguro
        cleanupTasks.push(() => {
          try {
            // Verificação tripla antes de remover
            if (linkElement && 
                linkElement.parentNode && 
                linkElement.parentNode === document.head && 
                document.head.contains(linkElement)) {
              document.head.removeChild(linkElement);
            }
          } catch (cleanupError) {
            // Falha silenciosa - elemento provavelmente já foi removido
            console.debug('PerformanceOptimizer: Elemento já removido ou inacessível');
          }
        });
      }
    } catch (error) {
      console.warn('PerformanceOptimizer: Erro durante inicialização', error);
    }

    // Cleanup robusto
    return () => {
      cleanupTasks.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          console.debug('PerformanceOptimizer: Cleanup task failed silently');
        }
      });
    };
  }, []);

  return <>{children}</>;
});

PerformanceOptimizer.displayName = "PerformanceOptimizer";