export class SessionStorage {
  private static instance: SessionStorage;
  private storage: Map<string, any>;

  private constructor() {
    this.storage = new Map();
  }

  static getInstance(): SessionStorage {
    if (!SessionStorage.instance) {
      SessionStorage.instance = new SessionStorage();
    }
    return SessionStorage.instance;
  }

  set(key: string, value: any): void {
    this.storage.set(key, value);
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to persist to localStorage:', error);
    }
  }

  get<T>(key: string): T | null {
    const value = this.storage.get(key);
    if (value !== undefined) {
      return value as T;
    }

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.storage.set(key, parsed);
        return parsed as T;
      }
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
    }

    return null;
  }

  remove(key: string): void {
    this.storage.delete(key);
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }

  clear(): void {
    this.storage.clear();
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }
}

export const sessionStorage = SessionStorage.getInstance();
