import React, { useState, useRef, useEffect, memo } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  loading?: 'lazy' | 'eager';
}

/**
 * Componente de imagem otimizado com lazy loading e intersection observer
 */
const LazyImage = memo<LazyImageProps>(({
  src,
  alt,
  className = '',
  placeholder = '/placeholder.svg',
  onLoad,
  loading = 'lazy'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img || loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(img);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px' // Carrega 50px antes da imagem aparecer
      }
    );

    observer.observe(img);

    return () => {
      observer.unobserve(img);
    };
  }, [loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const imageSrc = hasError ? placeholder : (isInView ? src : placeholder);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/20 animate-pulse" />
      )}
      
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        decoding="async"
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export { LazyImage };