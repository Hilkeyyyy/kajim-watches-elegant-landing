import { supabase } from '@/integrations/supabase/client';
import { formatPrice, parsePrice } from './priceUtils';

/**
 * Símbolos ASCII seguros para formatação
 */
const SAFE_SYMBOLS = {
  watch: '⌚',
  brand: '🏢',
  price: '💰',
  quantity: '📦',
  total: '💯',
  image: '🖼️',
  date: '📅',
  search: '❓',
  cart: '🛒',
  summary: '📊',
  bullet: '▸',
  check: '✓'
};

/**
 * Função para encoding seguro de mensagens WhatsApp
 */
const safeEncodeMessage = (message: string): string => {
  try {
    // Primeiro tenta encoding normal
    const encoded = encodeURIComponent(message);
    
    // Verifica se o encoding funcionou (não deve ter caracteres estranhos)
    const decoded = decodeURIComponent(encoded);
    if (decoded === message) {
      return encoded;
    }
    
    // Se falhou, remove emojis e tenta novamente
    const fallbackMessage = message.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
    return encodeURIComponent(fallbackMessage);
  } catch (error) {
    console.warn('Erro no encoding da mensagem WhatsApp:', error);
    // Fallback: remove todos os caracteres especiais
    const cleanMessage = message.replace(/[^\w\s\-.,!?:()]/g, '');
    return encodeURIComponent(cleanMessage);
  }
};

/**
 * Cria uma mensagem formatada com emojis seguros
 */
const createFormattedMessage = (content: string, useEmojis: boolean = true): string => {
  if (!useEmojis) {
    // Versão texto puro como fallback
    return content.replace(/[⌚🏷️💰📊💵📸📅🔍🛒📋⭐✅]/g, '');
  }
  return content;
};

/**
 * Busca o nome do usuário logado
 */
const getUserName = async (): Promise<string> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 'Cliente';

    // Primeiro tenta buscar no profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', user.id)
      .single();

    if (profile?.name) {
      return profile.name;
    }

    // Se não encontrou no profiles, usa o email ou metadata do user
    if (user.user_metadata?.name) {
      return user.user_metadata.name;
    }

    if (user.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }

    return 'Cliente';
  } catch (error) {
    console.error('Erro ao buscar nome do usuário:', error);
    return 'Cliente';
  }
};

/**
 * Gera mensagem do WhatsApp para produto individual
 */
export const generateProductWhatsAppMessage = async (product: any): Promise<string> => {
  const userName = await getUserName();
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const currentTime = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Verificar se a imagem já é uma URL completa ou um caminho relativo
  const imageUrl = product.image 
    ? (product.image.startsWith('http') ? product.image : `${window.location.origin}${product.image}`)
    : 'Imagem não disponível';

  const message = `Assunto: Confirmação de Interesse - KAJIM Relógios

Prezados(as),

Gostaria de manifestar meu interesse no seguinte produto:

• Produto: ${product.name}
• Marca: ${product.brand || 'Informe a marca do produto'}
• Preço Unitário: ${formatPrice(typeof product.price === 'number' ? product.price : parsePrice(product.price))}
• Quantidade: 1
• Subtotal: ${formatPrice(typeof product.price === 'number' ? product.price : parsePrice(product.price))}

• Imagem do produto:
${imageUrl}

• Data da consulta: ${currentDate} às ${currentTime}

• Solicito, por gentileza, mais informações sobre o produto mencionado, bem como detalhes sobre condições de compra e prazos de entrega.

Atenciosamente,
${userName}`;

  return message;
};

/**
 * Gera mensagem do WhatsApp para carrinho de compras
 */
export const generateCartWhatsAppMessage = async (cartItems: any[], totalItems: number, totalValue: number): Promise<string> => {
  const userName = await getUserName();
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const currentTime = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const enrichedItems = await Promise.all(
    cartItems.map(async (item, index) => {
      const unitPrice = typeof item.price === 'number' ? item.price : parsePrice(item.price);
      const quantity = Number(item.quantity) || 1;
      const subtotal = unitPrice * quantity;
      const imageSrc = (item as any).image || (item as any).image_url;
      const imageUrl = imageSrc
        ? (imageSrc.startsWith('http') ? imageSrc : `${window.location.origin}${imageSrc}`)
        : '[Link para a imagem]';
      
      // Melhor detecção de marca
      let brand = (item as any).brand || 
                  ((item as any).product && (item as any).product.brand) || 
                  (item as any).brand_name;
      
      if (!brand) {
        const productName = ((item as any).name as string) || '';
        const knownBrands = [
          'Rolex', 'TAG Heuer', 'Omega', 'Seiko', 'Casio', 'Citizen', 'Tissot', 
          'Audemars Piguet', 'Patek Philippe', 'Cartier', 'Hublot', 'Breitling', 
          'IWC', 'Longines', 'Orient', 'Breguet', 'Panerai'
        ];
        
        const detectedBrand = knownBrands.find(b => 
          productName.toLowerCase().includes(b.toLowerCase())
        );
        
        brand = detectedBrand || '[Informe a marca do produto]';
      }

      return {
        index: index + 1,
        name: (item as any).name,
        brand,
        unitPrice,
        quantity,
        subtotal,
        imageUrl,
      };
    })
  );

  const itemsList = enrichedItems
    .map((it) => `${it.index}. Produto: ${it.name}
• Marca: ${it.brand}
• Preço Unitário: ${formatPrice(it.unitPrice)}
• Quantidade: ${it.quantity}
• Subtotal: ${formatPrice(it.subtotal)}

• Imagem do produto:
${it.imageUrl}`)
    .join('\n\n');

  const computedTotalValue = enrichedItems.reduce((sum, it) => sum + it.subtotal, 0);

  const message = `Assunto: Confirmação de Interesse - KAJIM Relógios

Prezados(as),

Gostaria de manifestar meu interesse nos seguintes produtos:

${itemsList}

• Resumo do pedido:
• Quantidade total de itens: ${totalItems}
• Valor total estimado: ${formatPrice(computedTotalValue)}

• Data da consulta: ${currentDate} às ${currentTime}

• Solicito, por gentileza, mais informações sobre os produtos mencionados, bem como detalhes sobre condições de compra e prazos de entrega.

Atenciosamente,
${userName}`;

  return message;
};