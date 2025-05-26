import { Component, OnInit, inject } from '@angular/core';
import { SessionsService } from '../../services/api/sessions.service';
import { Router } from '@angular/router';
import { StoreContextService } from '../../store/store-context.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IApiSuccessResponse } from '../../models/iapi-success-response.model';
import { ILogoutResponse } from '../../models/ilogout-response.model';
import { IApiErrorResponse } from '../../models/iapi-error-response.model';
import { formatApiError } from '../../utils/error-handler';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit {
  private _apiSessionsService = inject(SessionsService);
  private _storeContextService = inject(StoreContextService);
  private _router = inject(Router);

  waitingMessage: string = 'Cerrando la Sesión. Espere un momento...';

  ngOnInit(): void {
    this.logout();
  }

  logout() {
    this._apiSessionsService.logOut().subscribe({
      next: (response: HttpResponse<IApiSuccessResponse<ILogoutResponse>>) => {
        const message = response.body?.message ?? 'Sesión finalizada';
        this._storeContextService.setUser({});
        this._router.navigate(['home'], { queryParams: { message } });

        console.log('Sesión cerrada exitosamente:', message);
      },
      error: (error: HttpErrorResponse) => {
        this._storeContextService.setUser({});
        const message = formatApiError(error);

        this._router.navigate(['home'], { queryParams: { message } });

        console.error('Error al cerrar sesión:', error);
      }
    });
  }
}
