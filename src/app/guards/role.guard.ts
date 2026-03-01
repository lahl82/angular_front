import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StoreContextService } from '../store/store-context.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private storeContextService = inject(StoreContextService);
  private router = inject(Router);

  canActivate(): boolean {
    if (this.storeContextService.isTokenExpired()) {
      this.storeContextService.logout();
      this.router.navigate(['/login']);
      return false;
    }

    if (!this.storeContextService.isBusinessOwner()) {
      this.router.navigate(['']);
      return false;
    }

    return true;
  }
}
