
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
  const [isFocused, setIsFocused] = useState(false);

  // Converte número para formato brasileiro (a partir de string numérica: 12500.90)
  const formatToBrazilian = (numValue: string): string => {
    if (!numValue) return '';
    const num = parseFloat(numValue);
    if (isNaN(num)) return '';

    if (type === 'currency') {
      return num.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
      });
    } else if (type === 'integer') {
      return Math.round(num).toLocaleString('pt-BR');
    } else {
      return num.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  };

  // Normaliza a entrada do usuário para string numérica em formato US (ponto como decimal)
  // Regras: vírgula SEMPRE decimal, ponto SEMPRE milhar
  const normalizeToNumericString = (input: string): string => {
    if (!input) return '';

    if (type === 'integer') {
      const digits = input.replace(/\D/g, '');
      if (!digits) return '';
      const intVal = parseInt(digits, 10);
      return isNaN(intVal) ? '' : String(intVal);
    }

    // Mantém apenas dígitos, pontos e vírgulas
    let cleaned = input.replace(/[^\d.,]/g, '');
    // Remove todos os pontos (milhar)
    cleaned = cleaned.replace(/\./g, '');

    // Se houver vírgula, a última é o separador decimal
    const parts = cleaned.split(',');
    if (parts.length > 1) {
      const decimal = parts.pop() as string; // pode ser vazio
      const integer = parts.join('');
      return integer + '.' + decimal; // permite '12.' enquanto digita
    }

    // Sem vírgula: apenas parte inteira
    return cleaned; // já sem pontos
  };

  // Atualiza display quando valor externo mudar e o input não estiver focado
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatToBrazilian(value));
    }
  }, [value, type, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Permite digitação livre mas restringe caracteres
    const allowed = raw.replace(/[^\d.,]/g, '');
    setDisplayValue(allowed);

    const normalized = normalizeToNumericString(allowed);
    onChange(normalized);
  };

  const handleBlur = () => {
    setIsFocused(false);
    const normalized = normalizeToNumericString(displayValue);
    onChange(normalized);
    setDisplayValue(formatToBrazilian(normalized));
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <Input
      id={id}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
    />
  );
};
