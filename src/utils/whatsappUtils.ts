import { supabase } from '@/integrations/supabase/client';
import { formatPrice, parsePrice } from './priceUtils';

/**
 * Busca o nome do usuário logado
 */
const getUserName = async (): Promise<string> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return '[Nome do Usuário]';

    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', user.id)
      .single();

    return profile?.name || user.email?.split('@')[0] || '[Nome do Usuário]';
  } catch (error) {
    console.error('Erro ao buscar nome do usuário:', error);
    return '[Nome do Usuário]';
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

  return `Assunto: ⌚ Confirmação de Interesse – KAJIM Relógios

Prezados(as),

Gostaria de manifestar meu interesse no seguinte produto:

1️⃣ Produto: ${product.name}
🏷️ Marca: ${product.brand || 'Informe a marca do produto'}
💰 Preço Unitário: ${formatPrice(typeof product.price === 'number' ? product.price : parsePrice(product.price))}
📊 Quantidade: 1
💵 Subtotal: ${formatPrice(typeof product.price === 'number' ? product.price : parsePrice(product.price))}

📸 Imagem do produto:
${imageUrl}

📅 Data da consulta: ${currentDate} às ${currentTime}

🔍 Solicito, por gentileza, mais informações sobre o produto mencionado, bem como detalhes sobre condições de compra e prazos de entrega.

Atenciosamente,
${userName}`;
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
    .map((it) => `${it.index}️⃣ Produto: ${it.name}
🏷️ Marca: ${it.brand}
💰 Preço Unitário: ${formatPrice(it.unitPrice)}
📊 Quantidade: ${it.quantity}
💵 Subtotal: ${formatPrice(it.subtotal)}

📸 Imagem do produto:
${it.imageUrl}`)
    .join('\n\n');

  const computedTotalValue = enrichedItems.reduce((sum, it) => sum + it.subtotal, 0);

  return `Assunto: ⌚ Confirmação de Interesse – KAJIM Relógios

Prezados(as),

Gostaria de manifestar meu interesse nos seguintes produtos:

${itemsList}

📋 Resumo do pedido:
🛒 Quantidade total de itens: ${totalItems}
💰 Valor total estimado: ${formatPrice(computedTotalValue)}

📅 Data da consulta: ${currentDate} às ${currentTime}

🔍 Solicito, por gentileza, mais informações sobre os produtos mencionados, bem como detalhes sobre condições de compra e prazos de entrega.

Atenciosamente,
${userName}`;
};