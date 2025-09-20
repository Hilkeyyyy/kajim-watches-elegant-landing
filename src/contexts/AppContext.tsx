import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo, memo } from 'react';
import { storage, type CartItem } from '@/utils/storage';
import { useNotifications } from '@/hooks/useNotifications';
import { errorHandler } from '@/utils/errorHandler';
import { parsePrice, formatPrice, calculateItemTotal } from '@/utils/priceUtils';
import { logCartAction, logFavoriteAction, logStorageAction } from '@/utils/auditLogger';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Interface para produtos que podem ser adicionados ao carrinho
interface AddToCartProduct {
  id?: string;
  product_id?: string;
  name?: string;
  price?: string;
  image?: string;
  image_url?: string;
  brand?: string;
}

// Estados da aplicação
interface AppState {
  cart: CartItem[];
  favorites: string[];
  isLoading: boolean;
  lastUpdated: number;
  dataLoaded: boolean; // Nova flag para controlar carregamento inicial
}

// Ações do reducer
type AppAction =
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'SET_FAVORITES'; payload: string[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA_LOADED'; payload: boolean }
  | { type: 'UPDATE_TIMESTAMP' }
  | { type: 'ADD_TO_CART'; payload: { product: CartItem; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_FAVORITE'; payload: { productId: string; productName: string } };

// Estado inicial
const initialState: AppState = {
  cart: [],
  favorites: [],
  isLoading: true,
  dataLoaded: false,
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
    
    case 'SET_DATA_LOADED':
      return { ...state, dataLoaded: action.payload };
    
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
      const isCurrentlyFavorite = state.favorites.includes(productId);
      const newFavorites = isCurrentlyFavorite
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
  dataLoaded: boolean;
  
  // Ações do carrinho
  addToCart: (product: AddToCartProduct, quantity?: number) => void;
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
  const { notifySuccess, notifyError, notifyCartAction, notifyFavoriteAction } = useNotifications();
  const { user } = useAuth();

  // Carregar dados iniciais e quando o usuário mudar (dados por usuário)
  useEffect(() => {
    storage.setNamespace(user?.id ?? null);

    const loadInitialData = async () => {
      try {
        const [cart, favorites] = await Promise.all([
          storage.getCart(),
          storage.getFavorites()
        ]);
        
        dispatch({ type: 'SET_CART', payload: cart });
        dispatch({ type: 'SET_FAVORITES', payload: favorites });
        dispatch({ type: 'SET_DATA_LOADED', payload: true });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        notifyError('Erro ao carregar dados salvos', 'Usando dados padrão.');
        dispatch({ type: 'SET_DATA_LOADED', payload: true });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadInitialData();
  }, [notifyError, user?.id]);

  // Sincronizar com localStorage usando debouncing otimizado
  useEffect(() => {
    if (!state.dataLoaded || state.isLoading) return;
    
    const timeoutId = setTimeout(() => {
      storage.setCart(state.cart);
    }, 300); // Debounce de 300ms
    
    return () => clearTimeout(timeoutId);
  }, [state.cart, state.isLoading, state.dataLoaded]);

  useEffect(() => {
    if (!state.dataLoaded || state.isLoading) return;
    
    const timeoutId = setTimeout(() => {
      storage.setFavorites(state.favorites);
    }, 300); // Debounce de 300ms
    
    return () => clearTimeout(timeoutId);
  }, [state.favorites, state.isLoading, state.dataLoaded]);

  // Sincronização entre abas (ajustada para namespace do usuário)
  useEffect(() => {
    const cartKey = storage.getKey('cart');
    const favKey = storage.getKey('favorites');

    const unsubscribeCart = storage.onStorageChange<CartItem[]>(cartKey, (cart) => {
      dispatch({ type: 'SET_CART', payload: cart });
    });

    const unsubscribeFavorites = storage.onStorageChange<string[]>(favKey, (favorites) => {
      dispatch({ type: 'SET_FAVORITES', payload: favorites });
    });

    return () => {
      unsubscribeCart();
      unsubscribeFavorites();
    };
  }, [user?.id]);
  
  // Ações do carrinho (memoizadas)
  const addToCart = useCallback((product: AddToCartProduct, quantity: number = 1) => {
    try {
      // Criar CartItem completo
      const fullCartItem: CartItem = {
        id: product.id || product.product_id || `cart_${Date.now()}`,
        name: product.name || 'Produto',
        price: product.price || 'R$ 0,00',
        image: product.image || product.image_url || '',
        brand: product.brand || 'Marca não informada',
        quantity: 0 // será sobrescrito pelo reducer
      };
      
      dispatch({ type: 'ADD_TO_CART', payload: { product: fullCartItem, quantity } });
      logCartAction('add', fullCartItem.id, quantity);
      notifyCartAction('add', fullCartItem.name);
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho:', error);
      // Não mostrar toast de erro para evitar mensagens "algo deu errado" quando tudo funcionou
    }
  }, [notifySuccess, notifyError, notifyCartAction]);

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
    notifyFavoriteAction(isCurrentlyFavorite ? 'remove' : 'add', productName);
  }, [state.favorites, notifyFavoriteAction]);

  const isFavorite = useCallback((productId: string) => {
    return state.favorites.includes(productId);
  }, [state.favorites]);

  // Totais memoizados
  const getTotalItems = useMemo(() => {
    return () => {
      const total = state.cart.reduce((total, item) => total + item.quantity, 0);
      return total;
    };
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

  const getFavoritesCount = useCallback(() => {
    return state.favorites.length;
  }, [state.favorites]);

  // WhatsApp com novo template
  const sendCartToWhatsApp = useCallback(async () => {
    if (state.cart.length === 0) {
      notifyError('Carrinho vazio', 'Adicione produtos ao carrinho antes de enviar.');
      return;
    }

    try {
      // Importar a função utilitária dinamicamente
      const { generateCartWhatsAppMessage } = await import('@/utils/whatsappUtils');
      
      const totalValue = getCartTotal();
      const totalItems = getTotalItems();
      
      const message = await generateCartWhatsAppMessage(state.cart, totalItems, parseFloat(totalValue.toString()));
      const whatsappUrl = `https://wa.me/559181993435?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
      notifySuccess('Pedido enviado', 'Seu pedido foi enviado para o WhatsApp!');
    } catch (error) {
      console.error('Erro ao enviar pedido para WhatsApp:', error);
      notifyError('Erro ao enviar pedido', 'Tente novamente.');
    }
  }, [state.cart, notifySuccess, notifyError, getItemTotal, getCartTotal]);

  // Memoizar o contexto para evitar re-renders desnecessários
  const contextValue = useMemo<AppContextType>(() => ({
    // Estado
    cart: state.cart,
    favorites: state.favorites,
    isLoading: state.isLoading,
    dataLoaded: state.dataLoaded,
    
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
  }), [
    state.cart, 
    state.favorites, 
    state.isLoading, 
    state.dataLoaded,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleFavorite,
    isFavorite,
    getTotalItems,
    getCartTotal,
    getItemTotal,
    getFavoritesCount,
    sendCartToWhatsApp
  ]);

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
