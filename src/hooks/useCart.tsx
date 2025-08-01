import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { parsePrice, formatPrice, calculateItemTotal } from "@/utils/priceUtils";

export interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedCart = localStorage.getItem("kajim-cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const saveCart = (items: CartItem[]) => {
    localStorage.setItem("kajim-cart", JSON.stringify(items));
    setCartItems(items);
  };

  const addToCart = (product: { id: string; name: string; price: string; image: string }, quantity: number = 1) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      const updatedItems = cartItems.map(item =>
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      saveCart(updatedItems);
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      };
      saveCart([...cartItems, newItem]);
    }

    toast({
      title: "Adicionado ao carrinho",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  const removeFromCart = (productId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== productId);
    saveCart(updatedItems);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    saveCart(updatedItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    const total = cartItems.reduce((total, item) => {
      return total + calculateItemTotal(item.price, item.quantity);
    }, 0);
    return formatPrice(total);
  };

  const getItemTotal = (priceString: string, quantity: number) => {
    return formatPrice(calculateItemTotal(priceString, quantity));
  };

  const sendCartToWhatsApp = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    const currentDate = new Date().toLocaleString('pt-BR');
    let message = "Olá, gostaria de saber mais sobre estes produtos:\n\n";

    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `Quantidade: ${item.quantity}\n`;
      message += `Preço: ${item.price}\n`;
      message += `Imagem: ${item.image}\n\n`;
    });

    message += `Data/Hora do pedido: ${currentDate}`;

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    sendCartToWhatsApp,
    getCartTotal,
    getItemTotal
  };
};