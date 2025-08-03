import React from 'react';

/**
 * Componente otimizado para melhorar performance
 */
export const PerformanceOptimizer = React.memo(({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    // Preload crítico
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = '/api/products';
    link.as = 'fetch';
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  return <>{children}</>;
});

PerformanceOptimizer.displayName = "PerformanceOptimizer";