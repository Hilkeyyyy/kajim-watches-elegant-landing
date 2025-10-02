import { supabase } from '@/integrations/supabase/client';
import { formatPrice, parsePrice } from './priceUtils';

// Remover emojis problemáticos - usar apenas texto
const TEXT_SYMBOLS = {
  header: '===',
  separator: '---',
  bullet: '>',
  total: 'TOTAL:'
};

// Remover função de encoding - não é mais necessária

// Remover função de formatação - não é mais necessária

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
  const refNumber = `REF${Date.now().toString().slice(-8)}`;
  
  const imageUrl = product.image 
    ? (product.image.startsWith('http') ? product.image : `${window.location.origin}${product.image}`)
    : 'Sem imagem';

  const price = typeof product.price === 'number' ? product.price : parsePrice(product.price);

  const message = `*KAJIM RELOGIOS - Consulta de Produto*

Referencia: ${refNumber}

*Produto:* ${product.name}
*Marca:* ${product.brand || 'A definir'}
*Valor:* ${formatPrice(price)}

Link da imagem: ${imageUrl}

Solicitante: ${userName}

Gostaria de mais informacoes sobre este produto.

Obrigado!`;

  return message;
};

/**
 * Gera mensagem do WhatsApp para carrinho de compras
 */
export const generateCartWhatsAppMessage = async (cartItems: any[], totalItems: number, totalValue: number): Promise<string> => {
  const userName = await getUserName();
  const refNumber = `PED${Date.now().toString().slice(-8)}`;

  // Enriquecer items com cálculos
  const enrichedItems = cartItems.map((item, index) => {
    const unitPrice = typeof item.price === 'number' ? item.price : parsePrice(item.price);
    const quantity = Number(item.quantity) || 1;
    const subtotal = unitPrice * quantity;
    const imageSrc = item.image || item.image_url;
    const imageUrl = imageSrc
      ? (imageSrc.startsWith('http') ? imageSrc : `${window.location.origin}${imageSrc}`)
      : 'Sem imagem';
    
    // DEBUG: Verificar o que está vindo no item
    console.log('Item do carrinho:', {
      name: item.name,
      brand: item.brand,
      itemCompleto: item
    });
    
    return {
      index: index + 1,
      name: item.name,
      brand: item.brand || 'Marca nao informada',
      unitPrice,
      quantity,
      subtotal,
      imageUrl,
    };
  });

  const itemsList = enrichedItems
    .map((it) => `*${it.index}. ${it.name}*
*Marca:* ${it.brand}
Valor: ${formatPrice(it.unitPrice)} x ${it.quantity} = ${formatPrice(it.subtotal)}
Imagem: ${it.imageUrl}`)
    .join('\n\n');

  const computedTotalValue = enrichedItems.reduce((sum, it) => sum + it.subtotal, 0);

  const message = `*KAJIM RELOGIOS - Orcamento*

Referencia: ${refNumber}
Solicitante: ${userName}

*PRODUTOS:*

${itemsList}

${TEXT_SYMBOLS.separator}
*RESUMO DO PEDIDO:*
Total de items: ${totalItems}
Valor total: ${formatPrice(computedTotalValue)}

Gostaria de mais informacoes sobre disponibilidade e formas de pagamento.

Obrigado!`;

  return message;
};