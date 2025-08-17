interface AuditLogEntry {
  timestamp: number;
  action: string;
  details: any;
  sessionId: string;
}

class AuditLogger {
  private static instance: AuditLogger;
  private sessionId: string;
  private logs: AuditLogEntry[] = [];

  private constructor() {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  log(action: string, details: any = {}): void {
    const entry: AuditLogEntry = {
      timestamp: Date.now(),
      action,
      details,
      sessionId: this.sessionId,
    };

    this.logs.push(entry);
    
    // Manter apenas os últimos 100 logs para não sobrecarregar a memória
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }

    // Log crítico também no console para desenvolvimento
    if (action.includes('error') || action.includes('security')) {
      console.warn('Audit Log:', entry);
    }
  }

  getLogs(): AuditLogEntry[] {
    return [...this.logs];
  }

  getLogsForSession(sessionId?: string): AuditLogEntry[] {
    const targetSessionId = sessionId || this.sessionId;
    return this.logs.filter(log => log.sessionId === targetSessionId);
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const auditLogger = AuditLogger.getInstance();

// Funções específicas para diferentes tipos de ações
export const logCartAction = (action: string, productId?: string, quantity?: number) => {
  auditLogger.log(`cart_${action}`, { productId, quantity });
};

export const logFavoriteAction = (action: string, productId: string) => {
  auditLogger.log(`favorite_${action}`, { productId });
};

export const logStorageAction = (action: string, key: string, success: boolean) => {
  auditLogger.log(`storage_${action}`, { key, success });
};

export const logSecurityEvent = (event: string, details: any) => {
  auditLogger.log(`security_${event}`, details);
};

export const logAdminAction = (action: string, productId?: string, details?: any) => {
  auditLogger.log(`admin_${action}`, { productId, ...details });
};

export const logRoleChange = (targetUserId: string, oldRole: string, newRole: string) => {
  auditLogger.log('role_update', { targetUserId, oldRole, newRole });
};