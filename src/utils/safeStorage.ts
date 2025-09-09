export class SafeStorage implements Storage {
  private memory = new Map<string, string>();

  get length(): number {
    try {
      return typeof window !== 'undefined' && window.localStorage
        ? window.localStorage.length
        : this.memory.size;
    } catch {
      return this.memory.size;
    }
  }

  clear(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      } else {
        this.memory.clear();
      }
    } catch {
      this.memory.clear();
    }
  }

  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return this.memory.get(key) ?? null;
    } catch {
      return this.memory.get(key) ?? null;
    }
  }

  key(index: number): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.key(index);
      }
      return Array.from(this.memory.keys())[index] ?? null;
    } catch {
      return Array.from(this.memory.keys())[index] ?? null;
    }
  }

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      } else {
        this.memory.delete(key);
      }
    } catch {
      this.memory.delete(key);
    }
  }

  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      } else {
        this.memory.set(key, value);
      }
    } catch {
      this.memory.set(key, value);
    }
  }
}

export const safeLocalStorage: Storage = new SafeStorage();