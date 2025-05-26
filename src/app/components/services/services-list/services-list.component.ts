import { StoreContextService } from '../../../store/store-context.service';
import { Component, OnInit, inject } from '@angular/core';
import { IService } from '../../../models/iservice.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { UsersService } from '../../../services/api/users.service';
import { IApiSuccessResponse } from '../../../models/iapi-success-response.model';
import { IServicesPage } from '../../../models/iservices-page.model';
import { formatApiError } from '../../../utils/error-handler';

@Component({
  selector: 'services-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.css'
})
export class ServicesListComponent implements OnInit {

  servicesList: IService[] = []
  message: string = ''
  errorMessage: string = ''
  waiting: boolean = true
  waitingMessage: string = 'Descargando servicios. Espere un momento por favor.'
  emptyListMessage: string = 'No hay servicios asociados al usuario'

  private _apiUsersService = inject(UsersService)
  private _storeContextService = inject(StoreContextService)
  private _route = inject(ActivatedRoute)

  constructor() {
  }

  ngOnInit(): void {
    const userId: number = Number(this._storeContextService.getUser()?.id)

    if (isNaN(userId)) {
      console.log('sesion no iniciada')
      this.errorMessage = 'Debe iniciar sesión primero.'
      this.waiting = false

      return
    }

    this._apiUsersService.getServicesByUserId(userId).subscribe({
      next: (response: IApiSuccessResponse<IServicesPage>) => {
        this.servicesList = response.data.services

        this.waiting = false
      },
      error: (err: any) => {
        this.waiting = false;
        this.errorMessage = formatApiError(err);
        console.error('Error recibido desde API:', err);
      }
    })

    this._route.queryParams.subscribe({
      next: (params: Params) => {
        this.message = params['message'] || '';
      }
    });
  }

  get hasServices(): boolean {
    return this.servicesList?.length > 0;
  }

  get emptyList(): boolean {
    return this.servicesList?.length === 0;
  }
}
