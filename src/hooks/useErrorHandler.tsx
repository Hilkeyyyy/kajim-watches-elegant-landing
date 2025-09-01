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
    
    const toLower = (v: any) => (typeof v === 'string' ? v.toLowerCase() : '');
    const name = error?.name || '';
    const msg = toLower(error?.message || (typeof error === 'string' ? error : ''));
    const code = error?.code || '';
    const stack = toLower(error?.stack);

    // Ignorar erros nulos/abortados/transientes/navegação
    if (!error) return null;
    if (
      name === 'AbortError' ||
      code === 'ERR_CANCELED' ||
      msg.includes('abort') ||
      msg.includes('request aborted') ||
      msg.includes('the user aborted') ||
      msg.includes('err_canceled') ||
      msg.includes('resizeobserver') ||
      msg.includes('resizeobserver loop limit exceeded') ||
      msg.includes('loop completed with undelivered notifications') ||
      msg.includes('chunkloaderror') ||
      msg.includes('loading chunk') ||
      msg.includes('loading css chunk') ||
      msg.includes('stylesheet not loaded') ||
      (msg.includes('dynamic import') && msg.includes('failed')) ||
      (msg.includes('navigation') && msg.includes('cancel')) ||
      msg.includes('the operation was aborted') ||
      msg.includes('failed to fetch') ||
      msg.includes('network request failed') ||
      msg.includes('networkerror when attempting to fetch resource') ||
      msg.includes('non-error promise rejection') ||
      msg.includes('promise rejection') ||
      msg.includes('cannot update a component while rendering a different component') ||
      msg.includes('state update on an unmounted component') ||
      stack?.includes('resizeobserver')
    ) {
      return null;
    }

    // Ignorar mensagens que indicam sucesso aparente ou ações esperadas
    const ctx = toLower(context || '');
    if (
      msg.includes('sucesso') ||
      msg.includes('success') ||
      code === 'SUCCESS' ||
      ctx.includes('success') ||
      ctx.includes('cart') ||
      ctx.includes('carrinho')
    ) {
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