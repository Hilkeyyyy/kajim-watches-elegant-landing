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

  return `KAJIM RELÓGIOS – Confirmação de Interesse

Prezados,

Tenho interesse no seguinte produto:

⌚ Produto: ${product.name}
🏷️ Marca: ${product.brand}
💰 Preço: ${formatPrice(typeof product.price === 'number' ? product.price : parsePrice(product.price))}
📦 Categoria: ${product.category || 'Classic'}
🎯 Modelo: ${product.name}

📸 Imagem do produto:
${imageUrl}

📅 Data da consulta: ${currentDate} às ${currentTime}

Gostaria de receber mais informações sobre este relógio, bem como detalhes sobre as condições de compra.

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
        : 'Imagem não disponível';
      const brand =
        (item as any).brand ||
        ((item as any).product && (item as any).product.brand) ||
        (item as any).brand_name ||
        (() => {
          const n = ((item as any).name as string) || '';
          const candidates = [
            'Rolex','TAG Heuer','Omega','Seiko','Casio','Citizen','Tissot','Audemars Piguet',
            'Patek Philippe','Cartier','Hublot','Breitling','IWC','Longines','Orient','Breguet','Panerai'
          ];
          const match = candidates.find(b => n.toLowerCase().startsWith(b.toLowerCase()));
          if (match) return match;
          return n.split(' ').slice(0, 2).join(' ').trim() || 'Marca indisponível';
        })();

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
    .map((it) => `${it.index}️⃣ ⌚ Produto: ${it.name}
🏷️ Marca: ${it.brand}
💰 Preço Unitário: ${formatPrice(it.unitPrice)}
📊 Quantidade: ${it.quantity}
💵 Subtotal: ${formatPrice(it.subtotal)}

📸 Imagem do produto:
${it.imageUrl}

───────────────────────────────────
`)
    .join('\n');

  const computedTotalValue = enrichedItems.reduce((sum, it) => sum + it.subtotal, 0);

  return `KAJIM RELÓGIOS – Confirmação de Interesse

Prezados,

Tenho interesse nos seguintes produtos:

${itemsList}

📊 Quantidade total de itens: ${totalItems}
💰 Valor total estimado: ${formatPrice(computedTotalValue)}

📅 Data da consulta: ${currentDate} às ${currentTime}

Gostaria de receber mais informações sobre os produtos listados, bem como detalhes sobre as condições de compra.

Atenciosamente,
${userName}`;
};