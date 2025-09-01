import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  renderCount: number;
  avgRenderTime: number;
  lastRenderTime: number;
  slowRenders: number;
  memoryUsage?: number;
}

/**
 * Hook para monitorar performance de componentes
 */
export const usePerformanceMonitor = (componentName: string, threshold = 16) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    avgRenderTime: 0,
    lastRenderTime: 0,
    slowRenders: 0
  });
  
  const renderStartTime = useRef<number>();
  const totalRenderTime = useRef(0);

  useEffect(() => {
    const renderTime = performance.now() - (renderStartTime.current || 0);
    
    setMetrics(prev => {
      const newRenderCount = prev.renderCount + 1;
      totalRenderTime.current += renderTime;
      const newAvgRenderTime = totalRenderTime.current / newRenderCount;
      const newSlowRenders = renderTime > threshold ? prev.slowRenders + 1 : prev.slowRenders;
      
      // Log slow renders in development
      if (process.env.NODE_ENV === 'development' && renderTime > threshold) {
        console.warn(
          `🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms ` +
          `(threshold: ${threshold}ms)`
        );
      }
      
      return {
        renderCount: newRenderCount,
        avgRenderTime: newAvgRenderTime,
        lastRenderTime: renderTime,
        slowRenders: newSlowRenders,
        memoryUsage: (performance as any).memory?.usedJSHeapSize
      };
    });
  });

  // Mark render start
  renderStartTime.current = performance.now();

  return {
    metrics,
    isPerformant: metrics.avgRenderTime < threshold,
    getPerformanceGrade: () => {
      if (metrics.avgRenderTime < 8) return 'A';
      if (metrics.avgRenderTime < 12) return 'B';
      if (metrics.avgRenderTime < 16) return 'C';
      return 'D';
    }
  };
};