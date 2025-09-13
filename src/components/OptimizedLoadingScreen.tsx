import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface OptimizedLoadingScreenProps {
  variant?: 'page' | 'carousel' | 'card' | 'minimal';
  className?: string;
}

/**
 * Tela de carregamento otimizada com skeletons fluidos
 * Previne layout shifts e melhora UX
 */
export const OptimizedLoadingScreen: React.FC<OptimizedLoadingScreenProps> = ({
  variant = 'page',
  className
}) => {
  const renderPageSkeleton = () => (
    <div className="space-y-8">
      {/* Hero skeleton */}
      <Skeleton className="w-full h-96 rounded-lg" />
      
      {/* Category carousel skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-32 rounded-lg flex-shrink-0" />
          ))}
        </div>
      </div>
      
      {/* Products grid skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCarouselSkeleton = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-72 space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderCardSkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-full" />
    </div>
  );

  const renderMinimalSkeleton = () => (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
      </div>
    </div>
  );

  const skeletonMap = {
    page: renderPageSkeleton,
    carousel: renderCarouselSkeleton,
    card: renderCardSkeleton,
    minimal: renderMinimalSkeleton
  };

  return (
    <div className={cn(
      'animate-pulse',
      variant === 'page' && 'container mx-auto px-4 py-8',
      variant === 'carousel' && 'w-full',
      variant === 'card' && 'w-full max-w-sm',
      className
    )}>
      {skeletonMap[variant]()}
    </div>
  );
};