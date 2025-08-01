import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  totalRenderTime: number;
  averageRenderTime: number;
}

export const PerformanceMonitor: React.FC<{ name: string; children: React.ReactNode }> = ({ 
  name, 
  children 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    totalRenderTime: 0,
    averageRenderTime: 0,
  });

  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      setMetrics(prev => {
        const newRenderCount = prev.renderCount + 1;
        const newTotalRenderTime = prev.totalRenderTime + renderTime;
        
        return {
          renderCount: newRenderCount,
          lastRenderTime: renderTime,
          totalRenderTime: newTotalRenderTime,
          averageRenderTime: newTotalRenderTime / newRenderCount,
        };
      });

      // Log performance issues
      if (renderTime > 16) { // More than one frame (60fps = 16.67ms per frame)
        console.warn(`Slow render detected in ${name}: ${renderTime.toFixed(2)}ms`);
      }
    };
  });

  // Only show metrics in development
  const showMetrics = process.env.NODE_ENV === 'development';

  return (
    <>
      {children}
      {showMetrics && (
        <div 
          style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px',
            fontSize: '10px',
            borderRadius: '4px',
            zIndex: 9999,
            fontFamily: 'monospace',
          }}
        >
          <div>{name}</div>
          <div>Renders: {metrics.renderCount}</div>
          <div>Last: {metrics.lastRenderTime.toFixed(2)}ms</div>
          <div>Avg: {metrics.averageRenderTime.toFixed(2)}ms</div>
        </div>
      )}
    </>
  );
};