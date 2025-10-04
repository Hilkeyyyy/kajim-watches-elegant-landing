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
  
  const imageUrl = product.image 
    ? (product.image.startsWith('http') ? product.image : `${window.location.origin}${product.image}`)
    : '';

  const price = typeof product.price === 'number' ? product.price : parsePrice(product.price);
  const brandName = product.brand ? product.brand.toUpperCase() : 'A DEFINIR';

  const message = `KAJIM RELOGIOS

CONSULTA DE PRODUTO

 Cliente: ${userName}

PRODUTO SELECIONADO
 • Nome: ${product.name}
 • Marca: ${brandName}
 • Valor: ${formatPrice(price)}
 • Ver produto:
 ${imageUrl}


• Mensagem:
 Gostaria de receber mais informacoes sobre este produto.

• Atenciosamente,
 ${userName}`;

  return message;
};

/**
 * Gera mensagem do WhatsApp para carrinho de compras
 */
export const generateCartWhatsAppMessage = async (cartItems: any[], totalItems: number, totalValue: number): Promise<string> => {
  const userName = await getUserName();
  const refNumber = `PED${Date.now().toString().slice(-8)}`;

  // Enriquecer items com cálculos e buscar marca do banco se necessário
  const enrichedItems = await Promise.all(
    cartItems.map(async (item, index) => {
      const unitPrice = typeof item.price === 'number' ? item.price : parsePrice(item.price);
      const quantity = Number(item.quantity) || 1;
      const subtotal = unitPrice * quantity;
      const imageSrc = item.image || item.image_url;
      const imageUrl = imageSrc
        ? (imageSrc.startsWith('http') ? imageSrc : `${window.location.origin}${imageSrc}`)
        : '';
      
      // Se não tem marca no item, buscar do banco de dados
      let brand = item.brand;
      if (!brand || brand === 'Marca não informada') {
        try {
          const { data: product } = await supabase
            .from('products')
            .select('brand')
            .eq('id', item.id)
            .single();
          
          if (product?.brand) {
            brand = product.brand;
          }
        } catch (error) {
          console.error('Erro ao buscar marca do produto:', error);
        }
      }
      
      return {
        index: index + 1,
        name: item.name,
        brand: brand || 'Sem marca',
        unitPrice,
        quantity,
        subtotal,
        imageUrl,
      };
    })
  );

  // Formatar lista de produtos seguindo o formato especificado
  const itemsList = enrichedItems
    .map((it) => {
      const brandName = it.brand ? it.brand.toUpperCase() : 'SEM MARCA';
      const productLines = [
        `${it.index}. ${it.name}`,
        ` • Marca: ${brandName}`,
        ` • Valor unitario: ${formatPrice(it.unitPrice)}`,
        ` • Quantidade: ${it.quantity} un`,
        ` • Subtotal: ${formatPrice(it.subtotal)}`
      ];
      
      if (it.imageUrl) {
        productLines.push(` • Ver produto:\n ${it.imageUrl}`);
      }
      
      return productLines.join('\n');
    })
    .join('\n\n');

  const computedTotalValue = enrichedItems.reduce((sum, it) => sum + it.subtotal, 0);

  // Mensagem formatada conforme especificação
  const message = `KAJIM RELOGIOS

CONSULTA DE ORCAMENTO

 Cliente: ${userName}

PRODUTOS SELECIONADOS

${itemsList}


RESUMO DO PEDIDO
 • Itens: ${totalItems}
 • Total: ${formatPrice(computedTotalValue)}


• Mensagem:
 Gostaria de informacoes sobre disponibilidade e formas de pagamento.

• Atenciosamente,
 ${userName}`;

  return message;
};