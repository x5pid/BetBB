import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {

  constructor() {}

  // Enregistre une donnée dans le localStorage
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  // Récupère une donnée depuis le localStorage
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  // Supprime une donnée du localStorage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Vérifie si une clé existe dans le localStorage
  containsKey(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  // Supprime toutes les données du localStorage
  clear(): void {
    localStorage.clear();
  }
}
