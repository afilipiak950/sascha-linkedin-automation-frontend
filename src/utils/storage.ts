class StorageService {
  private static instance: StorageService;
  private isClient: boolean;

  private constructor() {
    this.isClient = typeof window !== 'undefined';
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  public getItem(key: string): string | null {
    if (!this.isClient) return null;
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.warn('Storage access failed:', error);
      return null;
    }
  }

  public setItem(key: string, value: string): void {
    if (!this.isClient) return;
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Storage access failed:', error);
    }
  }

  public removeItem(key: string): void {
    if (!this.isClient) return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn('Storage access failed:', error);
    }
  }
}

export const storage = StorageService.getInstance(); 