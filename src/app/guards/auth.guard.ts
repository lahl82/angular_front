// src/app/guards/auth.guard.ts
import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StoreContextService } from '../store/store-context.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private storeContextService = inject(StoreContextService);
  private router = inject(Router);

  canActivate(): boolean {
    if (this.storeContextService.isTokenExpired()) {
        this.storeContextService.logout();
        
        this.router.navigate(['/login']);
        
        return false;
    }

    return true;
  }
}
