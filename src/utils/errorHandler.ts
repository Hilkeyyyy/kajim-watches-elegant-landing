/**
 * Sistema unificado de tratamento de erros
 */

export type ErrorType = 
  | 'network'
  | 'authentication'
  | 'validation'
  | 'permission'
  | 'data'
  | 'unknown';

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
  timestamp: Date;
}

export class AppErrorHandler {
  private static instance: AppErrorHandler;
  private errorQueue: AppError[] = [];

  public static getInstance(): AppErrorHandler {
    if (!AppErrorHandler.instance) {
      AppErrorHandler.instance = new AppErrorHandler();
    }
    return AppErrorHandler.instance;
  }

  /**
   * Processa e classifica um erro
   */
  public handleError(error: any, context?: string): AppError {
    const appError = this.parseError(error);
    
    // Log do erro para debugging
    console.error(`[${context || 'App'}] Error:`, {
      type: appError.type,
      message: appError.message,
      code: appError.code,
      details: appError.details,
      originalError: error
    });

    // Adiciona à fila de erros para análise
    this.errorQueue.push(appError);
    
    // Mantém apenas os últimos 50 erros
    if (this.errorQueue.length > 50) {
      this.errorQueue.shift();
    }

    return appError;
  }

  /**
   * Classifica um erro bruto em AppError
   */
  private parseError(error: any): AppError {
    const timestamp = new Date();

    // Erro de rede
    if (error?.name === 'NetworkError' || error?.code === 'NETWORK_ERROR') {
      return {
        type: 'network',
        message: 'Erro de conexão. Verifique sua internet.',
        code: 'NETWORK_ERROR',
        details: error,
        timestamp
      };
    }

    // Erro de autenticação (Supabase)
    if (error?.message?.includes('JWT') || error?.message?.includes('auth')) {
      return {
        type: 'authentication',
        message: 'Sessão expirada. Faça login novamente.',
        code: 'AUTH_ERROR',
        details: error,
        timestamp
      };
    }

    // Erro de permissão
    if (error?.message?.includes('permission') || error?.code === 42501) {
      return {
        type: 'permission',
        message: 'Você não tem permissão para esta ação.',
        code: 'PERMISSION_DENIED',
        details: error,
        timestamp
      };
    }

    // Erro de validação
    if (error?.name === 'ValidationError' || error?.details?.some?.((d: any) => d.validation)) {
      return {
        type: 'validation',
        message: 'Dados inválidos. Verifique as informações.',
        code: 'VALIDATION_ERROR',
        details: error,
        timestamp
      };
    }

    // Erro de dados (Postgres/Supabase)
    if (error?.code?.startsWith?.('23') || error?.hint) {
      return {
        type: 'data',
        message: 'Erro ao processar dados. Tente novamente.',
        code: error.code || 'DATA_ERROR',
        details: error,
        timestamp
      };
    }

    // Erro desconhecido
    return {
      type: 'unknown',
      message: error?.message || 'Erro inesperado. Tente novamente.',
      code: 'UNKNOWN_ERROR',
      details: error,
      timestamp
    };
  }

  /**
   * Retorna mensagem amigável para o usuário
   */
  public getFriendlyMessage(error: AppError): string {
    switch (error.type) {
      case 'network':
        return 'Problema de conexão. Verifique sua internet e tente novamente.';
      case 'authentication':
        return 'Sua sessão expirou. Por favor, faça login novamente.';
      case 'permission':
        return 'Você não tem permissão para realizar esta ação.';
      case 'validation':
        return 'Algumas informações estão incorretas. Verifique os dados e tente novamente.';
      case 'data':
        return 'Erro ao salvar dados. Tente novamente em alguns instantes.';
      default:
        return 'Algo deu errado. Tente novamente ou entre em contato conosco.';
    }
  }

  /**
   * Obtém sugestões de ação para o usuário
   */
  public getActionSuggestions(error: AppError): string[] {
    switch (error.type) {
      case 'network':
        return [
          'Verifique sua conexão com a internet',
          'Recarregue a página',
          'Tente novamente em alguns instantes'
        ];
      case 'authentication':
        return [
          'Faça login novamente',
          'Limpe o cache do navegador se persistir'
        ];
      case 'permission':
        return [
          'Entre em contato com um administrador',
          'Verifique se você está logado na conta correta'
        ];
      case 'validation':
        return [
          'Verifique todos os campos obrigatórios',
          'Confirme se os dados estão no formato correto',
          'Tente com valores diferentes'
        ];
      case 'data':
        return [
          'Aguarde alguns instantes e tente novamente',
          'Verifique se não há conflitos nos dados',
          'Entre em contato conosco se persistir'
        ];
      default:
        return [
          'Recarregue a página',
          'Tente novamente em alguns instantes',
          'Entre em contato conosco se o problema persistir'
        ];
    }
  }

  /**
   * Obtém estatísticas dos erros
   */
  public getErrorStats() {
    const errorsByType = this.errorQueue.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<ErrorType, number>);

    return {
      total: this.errorQueue.length,
      byType: errorsByType,
      recent: this.errorQueue.slice(-10)
    };
  }

  /**
   * Limpa a fila de erros
   */
  public clearErrors() {
    this.errorQueue = [];
  }
}

// Instância singleton
export const errorHandler = AppErrorHandler.getInstance();