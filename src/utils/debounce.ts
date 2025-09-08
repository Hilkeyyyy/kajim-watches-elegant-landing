/**
 * Utilitário de debounce otimizado para performance
 */

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  } as unknown) as T;
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let lastCall = 0;
  
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func.apply(null, args);
    }
  }) as T;
}

/**
 * Debounce especializado para storage com cache em memória
 */
export class StorageDebouncer {
  private timeouts = new Map<string, ReturnType<typeof setTimeout>>();
  private cache = new Map<string, any>();
  
  debounce<T>(key: string, value: T, saveFunc: (value: T) => void, delay = 300) {
    // Atualizar cache imediatamente para leitura rápida
    this.cache.set(key, value);
    
    // Cancelar timeout anterior
    const existingTimeout = this.timeouts.get(key);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    
    // Agendar nova gravação
    const timeoutId = setTimeout(() => {
      saveFunc(value);
      this.timeouts.delete(key);
    }, delay);
    
    this.timeouts.set(key, timeoutId);
  }
  
  getFromCache<T>(key: string): T | undefined {
    return this.cache.get(key);
  }
  
  clear() {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
    this.cache.clear();
  }
}

export const storageDebouncer = new StorageDebouncer();