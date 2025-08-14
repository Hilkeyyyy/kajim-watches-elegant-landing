import React from 'react';

/**
 * Componente otimizado para melhorar performance
 */
export const PerformanceOptimizer = React.memo(({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    let linkElement: HTMLLinkElement | null = null;
    
    try {
      // Preload crítico com verificação de segurança
      linkElement = document.createElement('link');
      linkElement.rel = 'preload';
      linkElement.href = '/api/products';
      linkElement.as = 'fetch';
      
      if (document.head) {
        document.head.appendChild(linkElement);
      }
    } catch (error) {
      console.warn('PerformanceOptimizer: Erro ao criar preload', error);
    }

    return () => {
      // Cleanup seguro para evitar removeChild error
      try {
        if (linkElement && document.head && document.head.contains(linkElement)) {
          document.head.removeChild(linkElement);
        }
      } catch (error) {
        console.warn('PerformanceOptimizer: Erro no cleanup', error);
      }
    };
  }, []);

  return <>{children}</>;
});

PerformanceOptimizer.displayName = "PerformanceOptimizer";