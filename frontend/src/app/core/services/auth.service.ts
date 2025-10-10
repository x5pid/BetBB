import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { API_URL } from '../../tokens';
import { RegisterPayload } from '../models/auth.model';
import { RequestHandlerService } from './request-handler.service';
import { Observable, shareReplay, tap } from 'rxjs';

export interface AccessToken {
  access_token: string;
  expires_in: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _http = inject(HttpClient);
  private readonly _apiUrl = inject(API_URL);
  private _requestHandler = inject(RequestHandlerService);

  private readonly _token = this._requestHandler.createRequestState<AccessToken>();
  token = this._token?.state;
  readonly isAuthenticated = computed(() => !!this._token.state.data());

  private readonly _registration = this._requestHandler.createRequestState();
  registration = this._registration?.state;

  login(email: string, password: string){
    const body = new URLSearchParams({ username: email, password });
    const $req = this._http.post<AccessToken>(`${this._apiUrl}/login`, body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    });
    this._token.run($req);
  }

  refreshToken(): Observable<AccessToken> {
    return this._http.post<AccessToken>(`${this._apiUrl}/token/refresh`, {}, { withCredentials: true }).pipe(
      tap((res) => this._token.updateData(res)));
  }

  logout() {
    this._token.reset();
  }

  register(payload: RegisterPayload) {
    const req$ = this._http.post(`${this._apiUrl}/register`, payload);
    this._registration.run(req$);
  }

}
