import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private _token = signal<string | null>(null);
  readonly isAuthenticated = computed(() => !!this._token());

  private _timer: any = null;
  readonly refreshToken = signal(false);

  constructor() {
    const saved = localStorage.getItem('access_token');
    if (saved) {
      this._token.set(saved);
    }
  }

  setToken(token: string | null, expiresIn: number | null = null) {
    this._token.set(token);
    if (token && expiresIn) {
      localStorage.setItem('access_token', token);
      this.scheduleTokenRefresh(expiresIn);
    } else {
      this.clearRefreshTimer();
      localStorage.removeItem('access_token');
    }
  }

  token(): string | null {
    return this._token();
  }

  private scheduleTokenRefresh(expiresIn: number) {
    const refreshInMs = (expiresIn - 30) * 1000;
    if (refreshInMs <= 0) return;

    this.clearRefreshTimer();
    this._timer = setTimeout(() => {
      this.refreshToken.set(true);
    }, refreshInMs);
  }

  private clearRefreshTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }
}
