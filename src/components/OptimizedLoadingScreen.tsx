import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

interface OptimizedLoadingScreenProps {
  message?: string;
  showProgress?: boolean;
}

export const OptimizedLoadingScreen: React.FC<OptimizedLoadingScreenProps> = ({ 
  message = 'Carregando...', 
  showProgress = false 
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (showProgress) {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 95 ? 95 : prev + 1));
      }, 50);

      return () => clearInterval(interval);
    }
  }, [showProgress]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background flex items-center justify-center p-4">
      <Card className="p-8 text-center bg-card/80 backdrop-blur-xl border border-border/20 shadow-2xl">
        <div className="space-y-6">
          {/* Logo ou ícone */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full animate-pulse"></div>
          </div>

          {/* Spinner animado */}
          <div className="flex justify-center">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
            </div>
          </div>

          {/* Mensagem */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">{message}</h3>
            {showProgress && (
              <div className="w-48 mx-auto">
                <div className="bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};