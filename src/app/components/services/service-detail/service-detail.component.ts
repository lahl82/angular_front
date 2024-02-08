import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { IService } from '../../../models/iservice.model';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../../../services/api/services.service';

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
  private _route = inject(ActivatedRoute)
  private _apiService = inject(ServicesService)

  loading: boolean = true
  color?: string

  ngOnInit(): void {
    // setTimeout(() => {
    //   this._route.params.subscribe(params => {
    //     this.serviceId = params['serviceId']

    //     this.service = this.servicesList.find(service => service.id === Number(this.serviceId))
    //     this.color = this.service?.price as number > 5?'red':''
    //   })
    //   this.loading = false
    // }, 1500)

    this._route.params.subscribe({
      next: (params: Params) => {
        this.serviceId = Number(params['serviceId'])

        this._apiService.getService(this.serviceId).subscribe({
          next: (data: IService) => {
            this.service = data
            this.color = this.service?.price as number > 5 ? 'red' : ''
            this.loading = false
          },
          error: (error: any) => {
            console.log(`Salio mal la cosa: ${error.message}`)
            console.log(error)
            this.loading = false
          }
        })
      }
    })
  }
}
