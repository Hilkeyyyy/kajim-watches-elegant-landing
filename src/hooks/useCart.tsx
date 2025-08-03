import { useApp } from '@/contexts/AppContext';

/**
 * Hook unificado para gerenciar carrinho de compras
 * Única API oficial para operações de carrinho
 */
export const useCart = () => {
  const {
    cart: cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getCartTotal,
    getItemTotal,
    sendCartToWhatsApp,
    isLoading,
  } = useApp();

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    sendCartToWhatsApp,
    getCartTotal,
    getItemTotal,
    isLoading,
  };
};

// Compatibilidade com nome antigo (deprecated)
export const useOptimizedCart = useCart;