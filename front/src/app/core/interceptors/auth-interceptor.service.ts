import { inject, Injectable, signal } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, switchMap, catchError, BehaviorSubject, filter, take, timeout } from 'rxjs';
import { AccessToken, AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { ApiError } from '../models/error.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private _authService= inject(AuthService);
  private refreshInProgress = signal(false);
  private refreshTokenSubject = signal<string | null>(null);

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this._authService.token.data()?.access_token;
    const cloned = token ? this.addAuthHeader(req, token) : req;

    return next.handle(cloned).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addAuthHeader(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  if (!this.refreshInProgress()) {
    this.refreshInProgress.set(true);
    this.refreshTokenSubject.set(null);

    return this._authService.refreshToken().pipe(
      switchMap((res :AccessToken) => {
        this.refreshInProgress.set(false);
        this.refreshTokenSubject.set(res.access_token);
        return next.handle(this.addAuthHeader(req, res.access_token));
      }),
      catchError((err: ApiError) => {
        this.refreshInProgress.set(false);
        this._authService.logout();
        return throwError(() => err);
      })
    );
  } else {
    return toObservable(this.refreshTokenSubject).pipe(
      filter(token => !!token),
      take(1),
      timeout(5000),
      switchMap(token => next.handle(this.addAuthHeader(req, token!)))
    );
  }
}

}
