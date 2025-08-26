import React, { useEffect, useState, useMemo } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  threshold?: number;
  debounceMs?: number;
}

export const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  children,
  threshold = 30, // 30fps threshold
  debounceMs = 100
}) => {
  const [isOptimized, setIsOptimized] = useState(false);
  const [frameRate, setFrameRate] = useState(60);

  useEffect(() => {
    let rafId: number;
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measurePerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setFrameRate(fps);
        
        // Ativar otimizações se FPS estiver baixo
        setIsOptimized(fps < threshold);
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      rafId = requestAnimationFrame(measurePerformance);
    };

    rafId = requestAnimationFrame(measurePerformance);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [threshold]);

  const optimizedChildren = useMemo(() => {
    if (!isOptimized) return children;
    
    // Apply performance optimizations when needed
    return React.cloneElement(children as React.ReactElement, {
      style: {
        ...((children as React.ReactElement).props?.style || {}),
        willChange: 'auto',
        transform: 'translateZ(0)', // Force hardware acceleration
      }
    });
  }, [children, isOptimized]);

  return <>{optimizedChildren}</>;
};