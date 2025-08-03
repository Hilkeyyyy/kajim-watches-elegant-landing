
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';

interface BrazilianNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  type?: 'currency' | 'decimal' | 'integer';
}

export const BrazilianNumberInput = ({
  value,
  onChange,
  placeholder,
  className,
  disabled,
  id,
  type = 'decimal'
}: BrazilianNumberInputProps) => {
  const [displayValue, setDisplayValue] = useState('');

  // Converte número para formato brasileiro
  const formatToBrazilian = (numValue: string): string => {
    if (!numValue) return '';
    
    const num = parseFloat(numValue);
    if (isNaN(num)) return '';

    if (type === 'currency') {
      return num.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
      });
    } else if (type === 'integer') {
      return Math.round(num).toLocaleString('pt-BR');
    } else {
      return num.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
  };

  // Converte formato brasileiro para número
  const parseFromBrazilian = (braValue: string): string => {
    if (!braValue) return '';
    
    // Remove símbolos de moeda e espaços
    let cleaned = braValue.replace(/[R$\s]/g, '');
    
    // Se for integer, remove vírgulas e pontos decimais
    if (type === 'integer') {
      cleaned = cleaned.replace(/[.,]/g, '');
      const num = parseInt(cleaned);
      return isNaN(num) ? '' : num.toString();
    }
    
    // Para decimal e currency
    // Substitui pontos por nada (separador de milhares)
    // e vírgula por ponto (separador decimal)
    const parts = cleaned.split(',');
    if (parts.length <= 2) {
      if (parts.length === 2) {
        // Tem vírgula decimal
        const integerPart = parts[0].replace(/\./g, '');
        const decimalPart = parts[1];
        cleaned = integerPart + '.' + decimalPart;
      } else {
        // Só parte inteira
        cleaned = parts[0].replace(/\./g, '');
      }
    }
    
    const num = parseFloat(cleaned);
    return isNaN(num) ? '' : num.toString();
  };

  // Atualiza display quando value muda
  useEffect(() => {
    setDisplayValue(formatToBrazilian(value));
  }, [value, type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
    
    // Converte para número e chama onChange
    const numericValue = parseFromBrazilian(inputValue);
    onChange(numericValue);
  };

  const handleBlur = () => {
    // Reformata ao perder foco
    setDisplayValue(formatToBrazilian(value));
  };

  return (
    <Input
      id={id}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
    />
  );
};
