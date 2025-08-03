
import { useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';
import { parsePrice } from '@/utils/priceUtils';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar carrinho do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      setItems([]);
    }
  }, []);

  // Salvar no localStorage sempre que items mudar
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.product_id === product.id);
      
      if (existingItem) {
        // Atualizar quantidade
        return currentItems.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Adicionar novo item - converter preço string para number
        const priceAsNumber = typeof product.price === 'string' 
          ? parsePrice(product.price) 
          : product.price;
          
        const newItem: CartItem = {
          id: `cart_${Date.now()}`,
          product_id: product.id,
          name: product.name,
          price: priceAsNumber,
          image_url: product.image || product.images[0] || '',
          quantity
        };
        return [...currentItems, newItem];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(currentItems => currentItems.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.product_id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    items,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount
  };
};
