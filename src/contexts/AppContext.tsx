import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { storage, type CartItem } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';
import { parsePrice, formatPrice, calculateItemTotal } from '@/utils/priceUtils';
import { logCartAction, logFavoriteAction, logStorageAction } from '@/utils/auditLogger';

// Estados da aplicação
interface AppState {
  cart: CartItem[];
  favorites: string[];
  isLoading: boolean;
  lastUpdated: number;
}

// Ações do reducer
type AppAction =
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'SET_FAVORITES'; payload: string[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_TIMESTAMP' }
  | { type: 'ADD_TO_CART'; payload: { product: Omit<CartItem, 'quantity'>; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_FAVORITE'; payload: { productId: string; productName: string } };

// Estado inicial
const initialState: AppState = {
  cart: [],
  favorites: [],
  isLoading: true,
  lastUpdated: Date.now(),
};

// Reducer otimizado
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.payload, lastUpdated: Date.now() };
    
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload, lastUpdated: Date.now() };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'UPDATE_TIMESTAMP':
      return { ...state, lastUpdated: Date.now() };

    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingIndex = state.cart.findIndex(item => item.id === product.id);
      
      let newCart: CartItem[];
      if (existingIndex >= 0) {
        newCart = [...state.cart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + quantity
        };
      } else {
        newCart = [...state.cart, { ...product, quantity }];
      }
      
      return { ...state, cart: newCart, lastUpdated: Date.now() };
    }

    case 'REMOVE_FROM_CART': {
      const newCart = state.cart.filter(item => item.id !== action.payload);
      return { ...state, cart: newCart, lastUpdated: Date.now() };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        const newCart = state.cart.filter(item => item.id !== id);
        return { ...state, cart: newCart, lastUpdated: Date.now() };
      }
      
      const newCart = state.cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      return { ...state, cart: newCart, lastUpdated: Date.now() };
    }

    case 'CLEAR_CART':
      return { ...state, cart: [], lastUpdated: Date.now() };

    case 'TOGGLE_FAVORITE': {
      const { productId } = action.payload;
      const newFavorites = state.favorites.includes(productId)
        ? state.favorites.filter(id => id !== productId)
        : [...state.favorites, productId];
      
      return { ...state, favorites: newFavorites, lastUpdated: Date.now() };
    }

    default:
      return state;
  }
}

// Context
interface AppContextType {
  // Estado
  cart: CartItem[];
  favorites: string[];
  isLoading: boolean;
  
  // Ações do carrinho
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Ações dos favoritos
  toggleFavorite: (productId: string, productName: string) => void;
  isFavorite: (productId: string) => boolean;
  
  // Totais (memoizados)
  getTotalItems: () => number;
  getCartTotal: () => string;
  getItemTotal: (priceString: string, quantity: number) => string;
  getFavoritesCount: () => number;
  
  // WhatsApp
  sendCartToWhatsApp: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Provider
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { toast } = useToast();

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [cart, favorites] = await Promise.all([
          storage.getCart(),
          storage.getFavorites()
        ]);
        
        dispatch({ type: 'SET_CART', payload: cart });
        dispatch({ type: 'SET_FAVORITES', payload: favorites });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar dados salvos. Usando dados padrão.',
          variant: 'destructive',
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadInitialData();
  }, [toast]);

  // Sincronizar com localStorage quando state muda
  useEffect(() => {
    if (!state.isLoading) {
      storage.setCart(state.cart);
    }
  }, [state.cart, state.isLoading]);

  useEffect(() => {
    if (!state.isLoading) {
      storage.setFavorites(state.favorites);
    }
  }, [state.favorites, state.isLoading]);

  // Sincronização entre abas
  useEffect(() => {
    const unsubscribeCart = storage.onStorageChange<CartItem[]>('kajim-cart', (cart) => {
      dispatch({ type: 'SET_CART', payload: cart });
    });

    const unsubscribeFavorites = storage.onStorageChange<string[]>('kajim-favorites', (favorites) => {
      dispatch({ type: 'SET_FAVORITES', payload: favorites });
    });

    return () => {
      unsubscribeCart();
      unsubscribeFavorites();
    };
  }, []);

  // Ações do carrinho (memoizadas)
  const addToCart = useCallback((product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
    logCartAction('add', product.id, quantity);
    toast({
      title: 'Adicionado ao carrinho',
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  }, [toast]);

  const removeFromCart = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    logCartAction('remove', productId);
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
    logCartAction('update_quantity', productId, quantity);
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    logCartAction('clear');
  }, []);

  // Ações dos favoritos (memoizadas)
  const toggleFavorite = useCallback((productId: string, productName: string) => {
    const isCurrentlyFavorite = state.favorites.includes(productId);
    dispatch({ type: 'TOGGLE_FAVORITE', payload: { productId, productName } });
    logFavoriteAction(isCurrentlyFavorite ? 'remove' : 'add', productId);
    
    toast({
      title: isCurrentlyFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos',
      description: `${productName} foi ${isCurrentlyFavorite ? 'removido da' : 'adicionado à'} sua lista de favoritos.`,
    });
  }, [state.favorites, toast]);

  const isFavorite = useCallback((productId: string) => {
    return state.favorites.includes(productId);
  }, [state.favorites]);

  // Totais memoizados
  const getTotalItems = useMemo(() => {
    return () => state.cart.reduce((total, item) => total + item.quantity, 0);
  }, [state.cart]);

  const getCartTotal = useMemo(() => {
    return () => {
      const total = state.cart.reduce((total, item) => {
        return total + calculateItemTotal(item.price, item.quantity);
      }, 0);
      return formatPrice(total);
    };
  }, [state.cart]);

  const getItemTotal = useCallback((priceString: string, quantity: number) => {
    return formatPrice(calculateItemTotal(priceString, quantity));
  }, []);

  const getFavoritesCount = useMemo(() => {
    return () => state.favorites.length;
  }, [state.favorites]);

  // WhatsApp (corrigido com número real)
  const sendCartToWhatsApp = useCallback(() => {
    if (state.cart.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione produtos ao carrinho antes de enviar.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const currentDate = new Date().toLocaleString('pt-BR');
      let message = 'Olá, gostaria de saber mais sobre estes produtos:\n\n';

      state.cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `Quantidade: ${item.quantity}\n`;
        message += `Preço: ${item.price}\n`;
        message += `Total: ${getItemTotal(item.price, item.quantity)}\n\n`;
      });

      message += `Total do pedido: ${getCartTotal()}\n`;
      message += `Data/Hora do pedido: ${currentDate}`;

      const whatsappUrl = `https://wa.me/5586988388124?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: 'Pedido enviado',
        description: 'Seu pedido foi enviado para o WhatsApp!',
      });
    } catch (error) {
      console.error('Erro ao enviar pedido para WhatsApp:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao enviar pedido. Tente novamente.',
        variant: 'destructive',
      });
    }
  }, [state.cart, toast, getItemTotal, getCartTotal]);

  const contextValue: AppContextType = {
    // Estado
    cart: state.cart,
    favorites: state.favorites,
    isLoading: state.isLoading,
    
    // Ações
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleFavorite,
    isFavorite,
    
    // Totais
    getTotalItems,
    getCartTotal,
    getItemTotal,
    getFavoritesCount,
    
    // WhatsApp
    sendCartToWhatsApp,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook customizado
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
};