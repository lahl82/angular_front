import { Component, OnInit, inject } from '@angular/core';
import { SessionsService } from '../../services/api/sessions.service';
import { Router } from '@angular/router';
import { StoreContextService } from '../../store/store-context.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit {
  private _apiSessionsService = inject(SessionsService)
  private _storeContextService = inject(StoreContextService)

  private _router = inject(Router)

  waitingMessage: string = 'Cerrando la Sesión. Espere un momento...'

  ngOnInit(): void {
    this.logout()
  }

  logout() {
    this._apiSessionsService.logOut().subscribe({
        next: () => {
          this._storeContextService.setUser({})

          this._router.navigate(['home', { message: 'Sesión finalizada' }])
        },
        error: (error: any) => {
          this._router.navigate(['home', { message: 'No se pudo cerrar la Sesión' }])
          console.log(error)
        }
      })
  }
}
