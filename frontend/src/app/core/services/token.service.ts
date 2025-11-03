import { inject, Injectable } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import { AccessTokenWithExpiration } from "./auth.service";

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private  localStorageService = inject(LocalStorageService);
  private tokenKey = 'auth_token';
  private expireKey = 'token_expire';
  private expireInKey = 'token_expire_in';

  setToken(token: AccessTokenWithExpiration): void {
    const { access_token,expires_in, expire } = token;
    // Stockage du token et de l'expiration dans localStorage
    this.localStorageService.setItem(this.tokenKey, access_token);
    this.localStorageService.setItem(this.expireKey, String(expire));
    this.localStorageService.setItem(this.expireInKey, String(expires_in));
  }

  getToken(): AccessTokenWithExpiration | null {
    const token = this.localStorageService.getItem(this.tokenKey);
    const expire = this.localStorageService.getItem(this.expireKey);
    const expiresIn = this.localStorageService.getItem(this.expireInKey);

    if (!token || !expire || !expiresIn) {
      return null;
    }

    const expiresNumber = parseInt(expire, 10);
    const expiresInNumber = parseInt(expiresIn, 10);
    const currentTime = new Date().getTime();

    // Vérifier si le token est expiré
    if (currentTime > expiresNumber) {
      this.removeToken(); // Supprimer le token expiré
      return null;
    }

    return {
      access_token: token,
      expire: expiresNumber,
      expires_in : expiresInNumber
    };
  }

  removeToken(): void {
    // Suppression du token et de l'expiration dans localStorage
    this.localStorageService.removeItem(this.tokenKey);
    this.localStorageService.removeItem(this.expireKey);
    this.localStorageService.removeItem(this.expireInKey);
  }
}
