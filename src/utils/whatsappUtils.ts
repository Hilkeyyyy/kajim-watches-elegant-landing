import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from './priceUtils';

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
      .eq('user_id', user.id)
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

  const imageUrl = product.image ? `${window.location.origin}${product.image}` : 'Imagem não disponível';

  return `🏪 KAJIM RELÓGIOS – Confirmação de Interesse

Prezados,

Tenho interesse no seguinte produto:

⌚ Produto: ${product.name}

🏷️ Marca: ${product.brand}

💰 Preço: ${formatPrice(parseFloat(product.price))}

📦 Categoria: ${product.category || 'Classic'}

📱 Modelo: ${product.name}

🔗 Link da Imagem: ${imageUrl}


📅 Data da consulta: ${currentDate} às ${currentTime}

Gostaria de receber mais informações sobre este relógio, bem como detalhes sobre as condições de compra.

Atenciosamente,
${userName} ✨`;
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

  const itemsList = cartItems
    .map((item, index) => {
      const unitPrice = parseFloat(item.price);
      const subtotal = unitPrice * item.quantity;
      const imageUrl = item.image ? `${window.location.origin}${item.image}` : 'Imagem não disponível';
      const itemNumber = index + 1;
      
      return `${itemNumber}️⃣ ⌚ Produto: ${item.name}

🏷️ Marca: ${item.brand || 'N/A'}

💰 Preço Unitário: ${formatPrice(unitPrice)}

📊 Quantidade: ${item.quantity}

💵 Subtotal: ${formatPrice(subtotal)}

🔗 Link da Imagem: ${imageUrl}


`;
    })
    .join('\n');

  return `🏪 KAJIM RELÓGIOS – Confirmação de Interesse

Prezados,

Tenho interesse nos seguintes produtos:

${itemsList}

📊 Quantidade total de itens: ${totalItems}
💰 Valor total estimado: ${formatPrice(totalValue)}

📅 Data da consulta: ${currentDate} às ${currentTime}

Gostaria de receber mais informações sobre os produtos listados, bem como detalhes sobre as condições de compra.

Atenciosamente,
${userName} ✨`;
};