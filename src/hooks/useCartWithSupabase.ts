import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { CartItem, Product } from '@/types';
import { parsePrice, formatPrice } from '@/utils/priceUtils';
import { useToast } from '@/hooks/use-toast';

export const useCartWithSupabase = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Carregar carrinho do Supabase ou localStorage
  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);
      
      if (user) {
        // Usuário logado: buscar do Supabase
        const { data: cartItems, error } = await supabase
          .from('cart_items')
          .select(`
            id,
            product_id,
            quantity,
            products!inner(
              id,
              name,
              price,
              image_url,
              brand
            )
          `)
          .eq('user_id', user.id);

        if (error) {
          console.error('Erro ao carregar carrinho do Supabase:', error);
          loadFromLocalStorage();
          return;
        }

        // Converter dados do Supabase para formato CartItem
        const formattedItems: CartItem[] = (cartItems || []).map(item => ({
          id: item.id,
          product_id: item.product_id,
          name: item.products.name,
          price: item.products.price,
          image_url: item.products.image_url || '',
          quantity: item.quantity
        }));

        setItems(formattedItems);
      } else {
        // Usuário não logado: carregar do localStorage
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho do localStorage:', error);
      setItems([]);
    }
  };

  const saveToLocalStorage = (cartItems: CartItem[]) => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Erro ao salvar carrinho no localStorage:', error);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    try {
      setLoading(true);

      if (user) {
        // Usuário logado: salvar no Supabase
        const { data: existingItem } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', product.id)
          .maybeSingle();

        if (existingItem) {
          // Atualizar quantidade
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity: existingItem.quantity + quantity })
            .eq('id', existingItem.id);

          if (error) throw error;
        } else {
          // Criar novo item
          const { error } = await supabase
            .from('cart_items')
            .insert({
              user_id: user.id,
              product_id: product.id,
              quantity
            });

          if (error) throw error;
        }

        // Recarregar carrinho
        await loadCart();
      } else {
        // Usuário não logado: usar localStorage
        const priceAsNumber = typeof product.price === 'string' 
          ? parsePrice(product.price) 
          : product.price;
          
        setItems(currentItems => {
          const existingItem = currentItems.find(item => item.product_id === product.id);
          
          let newItems;
          if (existingItem) {
            newItems = currentItems.map(item =>
              item.product_id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            const newItem: CartItem = {
              id: `cart_${Date.now()}`,
              product_id: product.id,
              name: product.name,
              price: priceAsNumber,
              image_url: product.image_url || product.image || '',
              quantity
            };
            newItems = [...currentItems, newItem];
          }
          
          saveToLocalStorage(newItems);
          return newItems;
        });
      }

      toast({
        title: "Produto adicionado",
        description: `${product.name} foi adicionado ao carrinho!`
      });
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar produto ao carrinho",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      setLoading(true);

      if (user) {
        // Usuário logado: remover do Supabase
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;
        await loadCart();
      } else {
        // Usuário não logado: remover do localStorage
        setItems(currentItems => {
          const newItems = currentItems.filter(item => item.product_id !== productId);
          saveToLocalStorage(newItems);
          return newItems;
        });
      }
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover produto do carrinho",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    try {
      setLoading(true);

      if (user) {
        // Usuário logado: atualizar no Supabase
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;
        await loadCart();
      } else {
        // Usuário não logado: atualizar no localStorage
        setItems(currentItems => {
          const newItems = currentItems.map(item =>
            item.product_id === productId
              ? { ...item, quantity }
              : item
          );
          saveToLocalStorage(newItems);
          return newItems;
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar quantidade",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);

      if (user) {
        // Usuário logado: limpar do Supabase
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
      }
      
      // Limpar localStorage também
      localStorage.removeItem('cart');
      setItems([]);
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      toast({
        title: "Erro",
        description: "Erro ao limpar carrinho",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const sendCartToWhatsApp = () => {
    const message = items
      .map(
        (item) =>
          `${item.name} - Qtd: ${item.quantity} - ${formatPrice(item.price * item.quantity)}`
      )
      .join('\n');
    
    const total = formatPrice(getTotal());
    const fullMessage = `🛒 *Pedido KAJIM Watches*\n\n${message}\n\n💰 *Total: ${total}*\n\nGostaria de finalizar esta compra!`;
    
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(fullMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return {
    items,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    sendCartToWhatsApp
  };
};