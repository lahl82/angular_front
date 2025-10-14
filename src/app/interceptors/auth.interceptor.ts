import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { StoreContextService } from '../store/store-context.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '../services/ui/toast/toast.service';
import { BYPASS_AUTH, SUPPRESS_SESSION_EXPIRED } from './auth.context';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storeContextService = inject(StoreContextService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const token = storeContextService.getToken();
  // leer marca en requests para saltar auth interceptor
  const bypass = req.context.get(BYPASS_AUTH);
  // leer marca en requests para suprimir aviso de sesión expirada. Caso logout con token vencido
  const suppressSessionExpired = req.context.get(SUPPRESS_SESSION_EXPIRED);

  // Si no hay token o la solicitud está marcada para omitir la autenticación, no modificar la solicitud

  const authReq = (!bypass && token)
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401 && !bypass && !suppressSessionExpired) {
        if(token) {
          console.warn('Token expirado. Cerrando sesión automáticamente...');
          storeContextService.logout();
          toastService.showWarning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          router.navigate(['/home']);
        }
      }

      return throwError(() => error);
    })
  );
};
