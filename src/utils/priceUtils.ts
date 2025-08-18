export const parsePrice = (priceString: string): number => {
  if (!priceString || typeof priceString !== 'string') return 0;
  
  // Remove "R$", spaces and other currency symbols
  let cleaned = priceString.replace(/[R$\s€£¥]/g, '');
  
  // Brazilian format: 12.500,90 -> 12500.90
  // Handle cases with both dots and commas
  if (cleaned.includes(',') && cleaned.includes('.')) {
    // Check if comma is last (decimal separator)
    const lastCommaPos = cleaned.lastIndexOf(',');
    const lastDotPos = cleaned.lastIndexOf('.');
    
    if (lastCommaPos > lastDotPos) {
      // Comma is decimal: 12.500,90
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      // Dot is decimal: 12,500.90 (US format)  
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (cleaned.includes(',')) {
    // Only comma: treat as decimal separator
    const commaCount = (cleaned.match(/,/g) || []).length;
    if (commaCount === 1) {
      // Single comma = decimal separator: 12500,90
      cleaned = cleaned.replace(',', '.');
    } else {
      // Multiple commas = thousand separators: remove all
      cleaned = cleaned.replace(/,/g, '');
    }
  }
  // If only dots, keep as is (US format or decimal)
  
  const result = parseFloat(cleaned) || 0;
  // Round to 2 decimal places to avoid floating point issues
  return Math.round(result * 100) / 100;
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