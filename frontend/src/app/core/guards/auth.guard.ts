import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStore } from '../services/auth.store';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private _router = inject(Router);
  private _storeToken = inject(AuthStore);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    if (this._storeToken.isAuthenticated())
      return true;

    this._router.navigate(['/login']);
    return false;
  }
}

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(PermissionsService).canActivate(route, state);
};
