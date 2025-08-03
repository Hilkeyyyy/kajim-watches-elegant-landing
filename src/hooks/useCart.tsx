import { useApp } from '@/contexts/AppContext';

/**
 * Hook unificado para gerenciar carrinho de compras
 * Única API oficial para operações de carrinho
 */
export const useCart = () => {
  const appContext = useApp();

  return {
    cartItems: appContext.cart,
    addToCart: appContext.addToCart,
    removeFromCart: appContext.removeFromCart,
    updateQuantity: appContext.updateQuantity,
    clearCart: appContext.clearCart,
    getTotalItems: appContext.getTotalItems,
    sendCartToWhatsApp: appContext.sendCartToWhatsApp,
    getCartTotal: appContext.getCartTotal,
    getItemTotal: appContext.getItemTotal,
    isLoading: appContext.isLoading,
  };
};

// Compatibilidade com nome antigo (deprecated)
export const useOptimizedCart = useCart;