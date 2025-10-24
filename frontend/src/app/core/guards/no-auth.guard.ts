import { inject, Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class NotPermissionsService {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    if (!this._authService.isAuthenticated())
      return true;

    this._router.navigate(['/bet']);
    return false;
  }
}

export const NotAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(NotPermissionsService).canActivate(route, state);
};
