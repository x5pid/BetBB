import { inject, Injectable } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import { AccessToken } from "./auth.service";

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private  localStorageService = inject(LocalStorageService);
  private tokenKey = 'auth_token';
  private expiresKey = 'token_expires_in';

  setToken(token: AccessToken): void {
    const { access_token, expires_in } = token;
    // Stockage du token et de l'expiration dans localStorage
    this.localStorageService.setItem(this.tokenKey, access_token);
    this.localStorageService.setItem(this.expiresKey, String(expires_in));
  }

  getToken(): AccessToken | null {
    const token = this.localStorageService.getItem(this.tokenKey);
    const expiresIn = this.localStorageService.getItem(this.expiresKey);

    if (!token || !expiresIn) {
      return null;
    }

    const expiresInNumber = parseInt(expiresIn, 10);
    const currentTime = new Date().getTime();

    // Vérifier si le token est expiré
    if (currentTime > expiresInNumber) {
      this.removeToken(); // Supprimer le token expiré
      return null;
    }

    return {
      access_token: token,
      expires_in: expiresInNumber,
    };
  }

  removeToken(): void {
    // Suppression du token et de l'expiration dans localStorage
    this.localStorageService.removeItem(this.tokenKey);
    this.localStorageService.removeItem(this.expiresKey);
  }
}
