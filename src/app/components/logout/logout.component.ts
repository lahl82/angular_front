import { Component, OnInit, inject } from '@angular/core';
import { SessionsService } from '../../services/api/sessions.service';
import { Router } from '@angular/router';
import { StoreContextService } from '../../store/store-context.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IApiSuccessResponse } from '../../models/iapi-success-response.model';
import { ILogoutResponse } from '../../models/ilogout-response.model';
import { formatApiError } from '../../utils/error-handler';
import { ToastService } from '../../services/ui/toast/toast.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit {
  private sessionsService = inject(SessionsService);
  private storeContextService = inject(StoreContextService);
  private router = inject(Router);
  private toast = inject(ToastService);

  waitingMessage: string = 'Cerrando la Sesión. Espere un momento...';

  ngOnInit(): void {
    this.logout();
  }

  logout() {
    this.sessionsService.logOut().subscribe({
      next: (response: HttpResponse<IApiSuccessResponse<ILogoutResponse>>) => {
        const message = response?.body?.message ?? 'Sesión finalizada';

        this.storeContextService.logout();

        this.toast.showSuccess(message);
        console.log('Sesión finalizada:', message);
        
        this.router.navigate(['home']);
      },
      error: (error: HttpErrorResponse) => {
        this.storeContextService.logout();
        const message = formatApiError(error);

        this.toast.showError(message);
        console.error('Error al cerrar sesión:', error);

        this.router.navigate(['home']);
      }
    });
  }
}
