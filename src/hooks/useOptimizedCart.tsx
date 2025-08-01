import { useApp } from '@/contexts/AppContext';

// Hook otimizado que mantém compatibilidade com a API anterior
export const useOptimizedCart = () => {
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
  };
};

// Alias para compatibilidade
export const useCart = useOptimizedCart;