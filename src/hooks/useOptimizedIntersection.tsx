import { useEffect, useRef, useState, useCallback } from 'react';

interface UseOptimizedIntersectionOptions {
  threshold?: number;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
  triggerOnce?: boolean;
}

/**
 * Hook otimizado para Intersection Observer
 * Previne re-renders desnecessários e melhora performance
 */
export const useOptimizedIntersection = (
  options: UseOptimizedIntersectionOptions = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '50px 0px -50px 0px',
    freezeOnceVisible = false,
    triggerOnce = true
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const cleanupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Skip if already triggered and triggerOnce is enabled
    if (hasTriggered && triggerOnce) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        
        setIsIntersecting(isVisible);
        
        if (isVisible && !hasTriggered) {
          setHasTriggered(true);
          
          // Cleanup if triggerOnce is enabled
          if (triggerOnce) {
            cleanupObserver();
          }
        }
        
        // Freeze observation if freezeOnceVisible is enabled
        if (isVisible && freezeOnceVisible) {
          cleanupObserver();
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current.observe(element);

    return cleanupObserver;
  }, [threshold, rootMargin, freezeOnceVisible, triggerOnce, hasTriggered, cleanupObserver]);

  return {
    elementRef,
    isIntersecting,
    hasTriggered
  };
};