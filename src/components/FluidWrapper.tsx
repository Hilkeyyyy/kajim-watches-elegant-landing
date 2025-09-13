import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface FluidWrapperProps {
  children: React.ReactNode;
  className?: string;
  enableParallax?: boolean;
  smoothEntry?: boolean;
}

/**
 * Wrapper para máxima fluidez e performance
 * Aplica otimizações GPU e efeitos suaves
 */
export const FluidWrapper: React.FC<FluidWrapperProps> = ({
  children,
  className,
  enableParallax = false,
  smoothEntry = true
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!smoothEntry || !wrapperRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
      }
    );

    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, [smoothEntry]);

  useEffect(() => {
    if (!enableParallax) return;

    const handleScroll = () => {
      if (!wrapperRef.current) return;
      
      const scrolled = window.pageYOffset;
      const rect = wrapperRef.current.getBoundingClientRect();
      const speed = rect.top * 0.1;
      
      wrapperRef.current.style.transform = `translateY(${speed}px)`;
    };

    const throttledScroll = throttle(handleScroll, 16); // 60fps
    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => window.removeEventListener('scroll', throttledScroll);
  }, [enableParallax]);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        'gpu-accelerated',
        smoothEntry && 'opacity-0 transition-opacity duration-700',
        className
      )}
    >
      {children}
    </div>
  );
};

// Utility function for throttling
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  let lastExecTime = 0;
  
  return (...args: Parameters<T>) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}