import { z } from 'zod';

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

  static getInstance(): OptimizedStorage {
    if (!OptimizedStorage.instance) {
      OptimizedStorage.instance = new OptimizedStorage();
    }
    return OptimizedStorage.instance;
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
      if (!stored) return null;

      const parsed = JSON.parse(stored) as StorageItem<T>;
      
      // Validar versão e dados
      if (parsed.version !== this.STORAGE_VERSION) {
        localStorage.removeItem(key);
        return null;
      }

      return this.validate(parsed.data, schema);
    } catch (error) {
      console.warn(`Erro ao recuperar ${key} do localStorage:`, error);
      localStorage.removeItem(key);
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
      
      // Notificar outras abas
      window.dispatchEvent(new CustomEvent(`storage-${key}`, { detail: data }));
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error);
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
    return (await this.safeGet('kajim-cart', CartDataSchema)) || [];
  }

  setCart(cart: CartItem[]): void {
    this.debouncedSet('kajim-cart', cart);
  }

  // Métodos específicos para favoritos
  async getFavorites(): Promise<string[]> {
    return (await this.safeGet('kajim-favorites', FavoritesDataSchema)) || [];
  }

  setFavorites(favorites: string[]): void {
    this.debouncedSet('kajim-favorites', favorites);
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

      if (cart) await this.safeSet('kajim-cart', cart);
      if (favorites) await this.safeSet('kajim-favorites', favorites);

      return true;
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      return false;
    }
  }

  // Limpeza
  clearAll(): void {
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