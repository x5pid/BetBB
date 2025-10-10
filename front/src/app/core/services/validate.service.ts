import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../tokens';

@Injectable({ providedIn: 'root' })
export class ValidationService {

  private _http = inject(HttpClient);
  private readonly _apiUrl = inject(API_URL);

  constructor() {}

  validateEmail(email: string): Observable<{ valid: boolean }> {
    return this._http.post<{ valid: boolean }>(`${this._apiUrl}/validate/email`, { email });
  }

  validateUsername(username: string): Observable<{ valid: boolean }> {
    return this._http.post<{ valid: boolean }>(`${this._apiUrl}/validate/username`, { username });
  }

  validatePassword(password: string): Observable<{ valid: boolean }> {
    return this._http.post<{ valid: boolean }>(`${this._apiUrl}/validate/password`, { password });
  }
}
