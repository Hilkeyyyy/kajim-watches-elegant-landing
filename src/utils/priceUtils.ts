export const parsePrice = (priceString: string): number => {
  // Remove "R$", spaces, dots (thousand separators), and convert comma to dot
  const cleanPrice = priceString
    .replace(/R\$|\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  
  return parseFloat(cleanPrice) || 0;
};

export const formatPrice = (price: number): string => {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const calculateItemTotal = (priceString: string, quantity: number): number => {
  const unitPrice = parsePrice(priceString);
  return unitPrice * quantity;
};