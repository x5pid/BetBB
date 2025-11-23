import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { API_URL } from '../../tokens';
import { Email, NewPassword, RegisterPayload } from '../models/auth.model';
import { RequestHandlerService } from './request-handler.service';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { ErrorResponse } from '../models/error.model';
import { TokenService } from './token.service';

export interface AccessToken {
  access_token: string;
  expires_in: number;
}

export interface AccessTokenWithExpiration extends AccessToken {
  expire: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _http = inject(HttpClient);
  private readonly _apiUrl = inject(API_URL);
  private _requestHandler = inject(RequestHandlerService);
  private _tokenService = inject(TokenService);

  private readonly _token = this._requestHandler.createRequestState<AccessTokenWithExpiration>();
  token = this._token?.state;
  readonly isAuthenticated = computed(() => !!this._token.state.data());

  private readonly _registration = this._requestHandler.createRequestState();
  registration = this._registration?.state;

  private readonly _forgotPassword = this._requestHandler.createRequestState();
  forgotPassword = this._forgotPassword?.state;

  private readonly _newPassword = this._requestHandler.createRequestState();
  newPassword = this._newPassword?.state;

  constructor() {
    const token = this._tokenService.getToken();
    if(token) this._token.updateData(token);
  }

  login(email: string, password: string){
    const body = new URLSearchParams({ username: email, password });

    const $req = this._http.post<AccessToken>(`${this._apiUrl}/login`, body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    }).pipe(map(a => this.addExpirationToToken(a)));

    const options = {
      onSuccess: (token: AccessTokenWithExpiration) => {
        if(token) this._tokenService.setToken(token);
      },
      onError: (err: ErrorResponse) => {
        this._tokenService.removeToken();
        return null;
      }
    };
    this._token.run($req,options);
  }

  private addExpirationToToken(a: AccessToken): AccessTokenWithExpiration {
    const expireAt = Date.now() + a.expires_in * 1000;  // expires_in est en secondes, donc on multiplie par 1000 pour avoir les millisecondes
    return { ...a, expire: expireAt };
  }

  refreshToken(): Observable<AccessTokenWithExpiration> {
    return this._http.post<AccessToken>(`${this._apiUrl}/token/refresh`, {}, { withCredentials: true })
    .pipe(map(a => {
      const token = this.addExpirationToToken(a);
      this._token.updateData(token);
      this._tokenService.setToken(token);
      return token;
    }));
  }

  logout() {
    this._token.reset();
    this._tokenService.removeToken();
  }

  register(payload: RegisterPayload) {
    const req$ = this._http.post(`${this._apiUrl}/register`, payload);
    this._registration.run(req$);
  }

  forgetPassword(email: Email) {
    const req$ = this._http.post(`${this._apiUrl}/forgot-password`, email);
    this._forgotPassword.run(req$);
  }

  resetPassword(newPassword: NewPassword) {
    const req$ = this._http.post(`${this._apiUrl}/reset-password`, newPassword);
    this._newPassword.run(req$);
  }

}
