import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { IService } from '../../../models/iservice.model';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../../../services/api/services.service';
import { HttpErrorResponse } from '@angular/common/http';
import { formatApiError } from '../../../utils/error-handler';
import { finalize } from 'rxjs/operators';
import { IApiSuccessResponse } from '../../../models/iapi-success-response.model';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.css'
})
export class ServiceDetailComponent  implements OnInit{

  serviceId?: number
  service?: IService
  private activatedRoute = inject(ActivatedRoute)
  private servicesService = inject(ServicesService)

  waiting: boolean = true
  errorMessage: string = ''
  color?: string

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params: Params) => {
        this.serviceId = Number(params['serviceId'])

        this.servicesService.getService(this.serviceId)
        .pipe(finalize(() => this.waiting = false))
        .subscribe({
          next: (response: IApiSuccessResponse<IService>) => {
            this.service = response.data;
            this.color = this.service?.price as number > 5 ? 'red' : ''
          },
          error: (error: HttpErrorResponse) => {
            this.errorMessage = formatApiError(error);
            console.error('Error recibiendo detalle de servicio desde API:', error);
          }
        })
      }
    })
  }
}
