import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  getItem<T>(key: string): T | null {
    const item = sessionStorage.getItem(key) || localStorage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as any;
    }
  }

  setItem(key: string, value: any, rememberMe: boolean = false): void {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (rememberMe) {
      localStorage.setItem(key, stringValue);
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, stringValue);
      localStorage.removeItem(key);
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
    sessionStorage.clear();
  }
}
