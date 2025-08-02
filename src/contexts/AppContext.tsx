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
  dataLoaded: boolean; // Nova flag para controlar carregamento inicial
}

// Ações do reducer
type AppAction =
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'SET_FAVORITES'; payload: string[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA_LOADED'; payload: boolean }
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
  dataLoaded: false,
  lastUpdated: Date.now(),
};

// Reducer otimizado com logs
function appReducer(state: AppState, action: AppAction): AppState {
  console.log('🔄 AppReducer - Ação:', action.type, action);
  
  switch (action.type) {
    case 'SET_CART':
      console.log('📦 SET_CART - Novo carrinho:', action.payload);
      return { ...state, cart: action.payload, lastUpdated: Date.now() };
    
    case 'SET_FAVORITES':
      console.log('❤️ SET_FAVORITES - Novos favoritos:', action.payload);
      return { ...state, favorites: action.payload, lastUpdated: Date.now() };
    
    case 'SET_LOADING':
      console.log('⏳ SET_LOADING:', action.payload);
      return { ...state, isLoading: action.payload };
    
    case 'SET_DATA_LOADED':
      console.log('✅ SET_DATA_LOADED:', action.payload);
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
      
      console.log('🛒 ADD_TO_CART - Produto adicionado:', { product: product.name, quantity, newCartLength: newCart.length });
      return { ...state, cart: newCart, lastUpdated: Date.now() };
    }

    case 'REMOVE_FROM_CART': {
      const newCart = state.cart.filter(item => item.id !== action.payload);
      console.log('🗑️ REMOVE_FROM_CART - Produto removido:', action.payload);
      return { ...state, cart: newCart, lastUpdated: Date.now() };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        const newCart = state.cart.filter(item => item.id !== id);
        console.log('📉 UPDATE_QUANTITY - Quantidade zerada, removendo:', id);
        return { ...state, cart: newCart, lastUpdated: Date.now() };
      }
      
      const newCart = state.cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      console.log('🔢 UPDATE_QUANTITY - Quantidade atualizada:', { id, quantity });
      return { ...state, cart: newCart, lastUpdated: Date.now() };
    }

    case 'CLEAR_CART':
      console.log('🧹 CLEAR_CART - Carrinho limpo');
      return { ...state, cart: [], lastUpdated: Date.now() };

    case 'TOGGLE_FAVORITE': {
      const { productId } = action.payload;
      const isCurrentlyFavorite = state.favorites.includes(productId);
      const newFavorites = isCurrentlyFavorite
        ? state.favorites.filter(id => id !== productId)
        : [...state.favorites, productId];
      
      console.log('💝 TOGGLE_FAVORITE:', {
        productId,
        wasAlreadyFavorite: isCurrentlyFavorite,
        newFavoritesCount: newFavorites.length,
        newFavorites
      });
      
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

  // Carregar dados iniciais com melhor tratamento de erros
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('🚀 Carregando dados iniciais...');
        const [cart, favorites] = await Promise.all([
          storage.getCart(),
          storage.getFavorites()
        ]);
        
        console.log('📊 Dados carregados:', {
          cart: cart.length + ' itens no carrinho',
          favorites: favorites.length + ' favoritos',
          favoritesArray: favorites
        });
        
        dispatch({ type: 'SET_CART', payload: cart });
        dispatch({ type: 'SET_FAVORITES', payload: favorites });
        dispatch({ type: 'SET_DATA_LOADED', payload: true });
      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar dados salvos. Usando dados padrão.',
          variant: 'destructive',
        });
        // Mesmo com erro, marcar como carregado para não travar a UI
        dispatch({ type: 'SET_DATA_LOADED', payload: true });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadInitialData();
  }, [toast]);

  // Sincronizar com localStorage quando state muda (apenas após carregamento inicial)
  useEffect(() => {
    if (state.dataLoaded && !state.isLoading) {
      console.log('💾 Salvando carrinho no localStorage:', state.cart.length + ' itens');
      storage.setCart(state.cart);
    }
  }, [state.cart, state.isLoading, state.dataLoaded]);

  useEffect(() => {
    if (state.dataLoaded && !state.isLoading) {
      console.log('💾 Salvando favoritos no localStorage:', state.favorites.length + ' itens', state.favorites);
      storage.setFavorites(state.favorites);
    }
  }, [state.favorites, state.isLoading, state.dataLoaded]);

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
    const result = state.favorites.includes(productId);
    console.log('🔍 isFavorite check:', { productId, result, favorites: state.favorites });
    return result;
  }, [state.favorites]);

  // Totais memoizados com logs
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
    return () => {
      const count = state.favorites.length;
      console.log('📊 getFavoritesCount called:', {
        count,
        favorites: state.favorites,
        dataLoaded: state.dataLoaded,
        isLoading: state.isLoading
      });
      return count;
    };
  }, [state.favorites, state.dataLoaded, state.isLoading]);

  // WhatsApp (mantém código existente)
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
