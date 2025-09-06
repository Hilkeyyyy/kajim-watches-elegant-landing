import { useCallback } from 'react';
import DOMPurify from 'dompurify';
import { logSecurityEvent } from '@/utils/auditLogger';
import { supabase } from '@/integrations/supabase/client';

export const useSecurity = () => {
  // Log security events to both client and database
  const logSecurityEventEnhanced = useCallback(async (eventType: string, details: any = {}, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium') => {
    // Client-side logging (immediate)
    logSecurityEvent(eventType, details);
    
    // Server-side logging (persistent) for high/critical events
    if (severity === 'high' || severity === 'critical') {
      try {
        await supabase.rpc('log_security_event', {
          p_event_type: eventType,
          p_details: details,
          p_severity: severity
        });
      } catch (error) {
        console.error('Failed to log security event to database:', error);
      }
    }
  }, []);

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
        const details = {
          original_length: content.length,
          sanitized_length: sanitized.length,
          timestamp: Date.now()
        };
        logSecurityEvent('content_sanitized', details);
        // Log critical XSS attempts to database
        logSecurityEventEnhanced('content_sanitized', details, 'high');
      }

      return sanitized;
    } catch (error) {
      logSecurityEvent('sanitization_error', { error: error.message });
      return ''; // Retornar string vazia em caso de erro
    }
  }, [logSecurityEventEnhanced]);

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
        const details = { 
          pattern: pattern.toString(),
          input_length: input.length,
          timestamp: Date.now()
        };
        logSecurityEvent('dangerous_pattern_detected', details);
        // Log critical injection attempts to database
        logSecurityEventEnhanced('dangerous_pattern_detected', details, 'critical');
        return false;
      }
    }

    return true;
  }, [logSecurityEventEnhanced]);

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
    validateFileUpload,
    logSecurityEventEnhanced
  };
};