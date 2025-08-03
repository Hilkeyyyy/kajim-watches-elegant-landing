import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

/**
 * Sistema unificado de notificações para toda a aplicação
 */
export const useNotifications = () => {
  const { toast } = useToast();

  const notifySuccess = useCallback((message: string, description?: string) => {
    toast({
      title: message,
      description,
      duration: 3000,
    });
  }, [toast]);

  const notifyError = useCallback((message: string, description?: string) => {
    toast({
      title: message,
      description,
      variant: "destructive",
      duration: 5000,
    });
  }, [toast]);

  const notifyWarning = useCallback((message: string, description?: string) => {
    toast({
      title: message,
      description,
      duration: 4000,
    });
  }, [toast]);

  const notifyInfo = useCallback((message: string, description?: string) => {
    toast({
      title: message,
      description,
      duration: 3000,
    });
  }, [toast]);

  // Notificações específicas do domínio
  const notifyCartAction = useCallback((action: 'add' | 'remove' | 'update', productName: string) => {
    const messages = {
      add: `${productName} adicionado ao carrinho`,
      remove: `${productName} removido do carrinho`,
      update: `Quantidade de ${productName} atualizada`
    };
    
    notifySuccess(messages[action]);
  }, [notifySuccess]);

  const notifyFavoriteAction = useCallback((action: 'add' | 'remove', productName: string) => {
    const messages = {
      add: `${productName} adicionado aos favoritos`,
      remove: `${productName} removido dos favoritos`
    };
    
    notifySuccess(messages[action]);
  }, [notifySuccess]);

  return {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    notifyCartAction,
    notifyFavoriteAction,
  };
};