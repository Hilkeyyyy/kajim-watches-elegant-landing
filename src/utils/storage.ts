import { z } from 'zod';
import { logStorageAction, logSecurityEvent } from './auditLogger';

// Schemas de validação
const CartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.string(),
  image: z.string(),
  quantity: z.number().positive(),
});

const CartDataSchema = z.array(CartItemSchema);
const FavoritesDataSchema = z.array(z.string());

export interface StorageItem<T> {
  data: T;
  timestamp: number;
  version: string;
}

export type CartItem = z.infer<typeof CartItemSchema>;

class OptimizedStorage {
  private static instance: OptimizedStorage;
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private readonly STORAGE_VERSION = '1.0';
  private readonly DEBOUNCE_DELAY = 300;
  private namespace: string = 'guest';

  static getInstance(): OptimizedStorage {
    if (!OptimizedStorage.instance) {
      OptimizedStorage.instance = new OptimizedStorage();
    }
    return OptimizedStorage.instance;
  }

  public setNamespace(ns: string | null) {
    this.namespace = ns || 'guest';
  }

  public getKey(base: 'cart' | 'favorites') {
    return `kajim-${this.namespace}-${base}`;
  }
  private validate<T>(data: unknown, schema: z.ZodSchema<T>): T | null {
    try {
      return schema.parse(data);
    } catch {
      return null;
    }
  }

  private async safeGet<T>(key: string, schema: z.ZodSchema<T>): Promise<T | null> {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) {
        logStorageAction('get_empty', key, true);
        return null;
      }

      const parsed = JSON.parse(stored) as StorageItem<T>;
      
      // Validar versão e dados
      if (parsed.version !== this.STORAGE_VERSION) {
        localStorage.removeItem(key);
        logSecurityEvent('version_mismatch', { key, version: parsed.version });
        return null;
      }

      const result = this.validate(parsed.data, schema);
      logStorageAction('get', key, result !== null);
      return result;
    } catch (error) {
      console.warn(`Erro ao recuperar ${key} do localStorage:`, error);
      localStorage.removeItem(key);
      logSecurityEvent('storage_corruption', { key, error: error?.toString() });
      return null;
    }
  }

  private async safeSet<T>(key: string, data: T): Promise<void> {
    try {
      const storageItem: StorageItem<T> = {
        data,
        timestamp: Date.now(),
        version: this.STORAGE_VERSION,
      };
      
      localStorage.setItem(key, JSON.stringify(storageItem));
      logStorageAction('set', key, true);
      
      // Notificar outras abas
      window.dispatchEvent(new CustomEvent(`storage-${key}`, { detail: data }));
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error);
      logStorageAction('set', key, false);
    }
  }

  private debouncedSet<T>(key: string, data: T): void {
    const existingTimer = this.debounceTimers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      this.safeSet(key, data);
      this.debounceTimers.delete(key);
    }, this.DEBOUNCE_DELAY);

    this.debounceTimers.set(key, timer);
  }

  // Métodos específicos para carrinho
  async getCart(): Promise<CartItem[]> {
    return (await this.safeGet(this.getKey('cart'), CartDataSchema)) || [];
  }

  setCart(cart: CartItem[]): void {
    this.debouncedSet(this.getKey('cart'), cart);
  }

  // Métodos específicos para favoritos
  async getFavorites(): Promise<string[]> {
    return (await this.safeGet(this.getKey('favorites'), FavoritesDataSchema)) || [];
  }

  setFavorites(favorites: string[]): void {
    this.debouncedSet(this.getKey('favorites'), favorites);
  }

  // Backup e restore
  async createBackup(): Promise<string> {
    const cart = await this.getCart();
    const favorites = await this.getFavorites();
    
    const backup = {
      cart,
      favorites,
      timestamp: Date.now(),
      version: this.STORAGE_VERSION,
    };

    return JSON.stringify(backup);
  }

  async restoreBackup(backupData: string): Promise<boolean> {
    try {
      const backup = JSON.parse(backupData);
      
      if (backup.version !== this.STORAGE_VERSION) {
        throw new Error('Versão do backup incompatível');
      }

      const cart = this.validate(backup.cart, CartDataSchema);
      const favorites = this.validate(backup.favorites, FavoritesDataSchema);

      if (cart) await this.safeSet(this.getKey('cart'), cart);
      if (favorites) await this.safeSet(this.getKey('favorites'), favorites);

      return true;
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      return false;
    }
  }

  // Limpeza
  clearAll(): void {
    localStorage.removeItem(this.getKey('cart'));
    localStorage.removeItem(this.getKey('favorites'));
    // Remover chaves legadas
    localStorage.removeItem('kajim-cart');
    localStorage.removeItem('kajim-favorites');
  }

  // Listener para sincronização entre abas
  onStorageChange<T>(key: string, callback: (data: T) => void): () => void {
    const eventHandler = (event: Event) => {
      const customEvent = event as CustomEvent<T>;
      callback(customEvent.detail);
    };

    window.addEventListener(`storage-${key}`, eventHandler);
    
    // Retorna função de cleanup
    return () => window.removeEventListener(`storage-${key}`, eventHandler);
  }
}

export const storage = OptimizedStorage.getInstance();