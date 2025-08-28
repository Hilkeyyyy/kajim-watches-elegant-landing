import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorHandler, type AppError } from '@/utils/errorHandler';

/**
 * Hook para tratamento unificado de erros com feedback visual
 */
export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((error: any, context?: string) => {
    console.error('Error occurred:', error, 'Context:', context);
    
    // Não mostrar erro genérico para operações que funcionam
    if (error?.message?.includes('Success') || 
        error?.code === 'SUCCESS' ||
        context?.includes('success')) {
      return null;
    }
    
    const appError = errorHandler.handleError(error, context);
    
    // Mostra toast com erro apenas para erros reais
    toast({
      variant: "destructive",
      title: "Erro",
      description: errorHandler.getFriendlyMessage(appError),
      duration: 5000,
    });

    return appError;
  }, [toast]);

  const handleSuccess = useCallback((message: string) => {
    toast({
      title: "Sucesso",
      description: message,
      duration: 3000,
    });
  }, [toast]);

  const handleWarning = useCallback((message: string) => {
    toast({
      title: "Atenção",
      description: message,
      duration: 4000,
    });
  }, [toast]);

  return {
    handleError,
    handleSuccess,
    handleWarning,
    getErrorStats: errorHandler.getErrorStats.bind(errorHandler),
    clearErrors: errorHandler.clearErrors.bind(errorHandler)
  };
};