import { StoreContextService } from '../../../store/store-context.service';
import { Component, OnInit, inject } from '@angular/core';
import { IService } from '../../../models/iservice.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { ServicesService } from '../../../services/api/services.service';
import { IApiSuccessResponse } from '../../../models/iapi-success-response.model';
import { IServicesPage } from '../../../models/iservices-page.model';
import { formatApiError } from '../../../utils/error-handler';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

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

  private servicesService = inject(ServicesService)
  private storeContextService = inject(StoreContextService)
  private activatedRoute = inject(ActivatedRoute)

  constructor() {
  }

  ngOnInit(): void {
    const userId: number = Number(this.storeContextService.getUser()?.id)

    if (isNaN(userId)) {
      console.log('sesion no iniciada')
      this.errorMessage = 'Debe iniciar sesión primero'
      this.waiting = false

      return
    }

    this.servicesService.getMyServices()
    .pipe(finalize(() => this.waiting = false))
    .subscribe({
      next: (response: IApiSuccessResponse<IServicesPage>) => {
        this.servicesList = response.data.services
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = formatApiError(error);
        console.error('Error recibiendo listado de servicios del usuario desde API:', error);
      }
    })

    this.activatedRoute.queryParams.subscribe({
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
