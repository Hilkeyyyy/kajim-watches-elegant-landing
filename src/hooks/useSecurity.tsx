import { useCallback } from 'react';
import DOMPurify from 'dompurify';
import { logSecurityEvent } from '@/utils/auditLogger';

export const useSecurity = () => {
  // Sanitizar HTML com configuração rigorosa
  const sanitizeHtml = useCallback((content: string, allowedTags?: string[]) => {
    const defaultAllowedTags = ['p', 'br', 'strong', 'em', 'u', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    
    try {
      const sanitized = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: allowedTags || defaultAllowedTags,
        ALLOWED_ATTR: ['class'],
        FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'link', 'style']
      });

      // Log se conteúdo foi modificado (possível tentativa de XSS)
      if (sanitized !== content) {
        logSecurityEvent('content_sanitized', {
          original_length: content.length,
          sanitized_length: sanitized.length,
          timestamp: Date.now()
        });
      }

      return sanitized;
    } catch (error) {
      logSecurityEvent('sanitization_error', { error: error.message });
      return ''; // Retornar string vazia em caso de erro
    }
  }, []);

  // Validar entrada de texto para prevenir ataques
  const validateTextInput = useCallback((input: string, maxLength: number = 1000) => {
    if (!input || typeof input !== 'string') return false;
    
    // Verificar tamanho
    if (input.length > maxLength) {
      logSecurityEvent('input_too_long', { length: input.length, max: maxLength });
      return false;
    }

    // Verificar por scripts maliciosos
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(input)) {
        logSecurityEvent('dangerous_pattern_detected', { pattern: pattern.toString() });
        return false;
      }
    }

    return true;
  }, []);

  // Verificar se usuário tem permissões administrativas
  const checkAdminPermission = useCallback((userRole: string) => {
    return userRole === 'admin';
  }, []);

  // Validar upload de arquivos
  const validateFileUpload = useCallback((file: File) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      logSecurityEvent('invalid_file_type', { type: file.type, name: file.name });
      return { isValid: false, error: 'Tipo de arquivo não permitido' };
    }

    if (file.size > maxSize) {
      logSecurityEvent('file_too_large', { size: file.size, name: file.name });
      return { isValid: false, error: 'Arquivo muito grande' };
    }

    return { isValid: true };
  }, []);

  return {
    sanitizeHtml,
    validateTextInput,
    checkAdminPermission,
    validateFileUpload
  };
};