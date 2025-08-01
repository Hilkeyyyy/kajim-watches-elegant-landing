import { storage } from '@/utils/storage';
import { auditLogger } from '@/utils/auditLogger';

interface HealthCheck {
  storage: boolean;
  audit: boolean;
  localStorage: boolean;
  timestamp: number;
}

export const performHealthCheck = async (): Promise<HealthCheck> => {
  const results: HealthCheck = {
    storage: false,
    audit: false,
    localStorage: false,
    timestamp: Date.now(),
  };

  try {
    // Teste de storage
    const testCart = await storage.getCart();
    results.storage = Array.isArray(testCart);
  } catch {
    results.storage = false;
  }

  try {
    // Teste de audit
    auditLogger.log('health_check', { test: true });
    const logs = auditLogger.getLogs();
    results.audit = logs.length > 0;
  } catch {
    results.audit = false;
  }

  try {
    // Teste de localStorage
    const testKey = 'health_check_test';
    localStorage.setItem(testKey, 'test');
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    results.localStorage = retrieved === 'test';
  } catch {
    results.localStorage = false;
  }

  return results;
};

export const createSystemBackup = async (): Promise<string> => {
  try {
    const [cart, favorites] = await Promise.all([
      storage.getCart(),
      storage.getFavorites(),
    ]);

    const logs = auditLogger.getLogs();
    const healthCheck = await performHealthCheck();

    const backup = {
      version: '1.0',
      timestamp: Date.now(),
      data: {
        cart,
        favorites,
      },
      meta: {
        logs: logs.slice(-50), // Últimos 50 logs
        healthCheck,
      },
    };

    return JSON.stringify(backup, null, 2);
  } catch (error) {
    throw new Error(`Erro ao criar backup: ${error}`);
  }
};

export const restoreSystemBackup = async (backupString: string): Promise<boolean> => {
  try {
    const backup = JSON.parse(backupString);
    
    if (!backup.version || !backup.data) {
      throw new Error('Formato de backup inválido');
    }

    // Restaurar dados
    if (backup.data.cart) {
      storage.setCart(backup.data.cart);
    }
    
    if (backup.data.favorites) {
      storage.setFavorites(backup.data.favorites);
    }

    auditLogger.log('system_restore', { 
      backupTimestamp: backup.timestamp,
      itemsRestored: {
        cart: backup.data.cart?.length || 0,
        favorites: backup.data.favorites?.length || 0,
      }
    });

    return true;
  } catch (error) {
    auditLogger.log('system_restore_error', { error: error?.toString() });
    return false;
  }
};

export const getSystemStats = async () => {
  const [cart, favorites] = await Promise.all([
    storage.getCart(),
    storage.getFavorites(),
  ]);

  const logs = auditLogger.getLogs();
  const healthCheck = await performHealthCheck();

  return {
    cart: {
      itemCount: cart.length,
      totalQuantity: cart.reduce((sum, item) => sum + item.quantity, 0),
    },
    favorites: {
      count: favorites.length,
    },
    system: {
      logsCount: logs.length,
      lastHealthCheck: healthCheck,
      storageSize: JSON.stringify({ cart, favorites }).length,
    },
  };
};