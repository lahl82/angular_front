import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { StoreContextService } from '../store/store-context.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '../services/ui/toast/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storeContextService = inject(StoreContextService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const token = storeContextService.getToken();

  const authReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        console.warn('Token expirado. Cerrando sesión automáticamente...');
        storeContextService.logout();

        toastService.showWarning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        router.navigate(['/home']);
      }

      return throwError(() => error);
    })
  );
};
