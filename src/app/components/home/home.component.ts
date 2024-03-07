import { Component, inject } from '@angular/core';
import { IService } from '../../models/iservice.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { ServicesService } from '../../services/api/services.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  servicesList: IService[] = []
  message: string = ''
  errorMessage: string = ''
  waiting: boolean = true
  waitingMessage: string = 'Descargando servicios. Espere un momento por favor.'

  private _apiServicesService = inject(ServicesService)
  private _route = inject(ActivatedRoute)

  constructor() {
  }

  ngOnInit(): void {
    this._apiServicesService.getAllServices().subscribe({
        next: (data: IService[]) => {
          this.servicesList = data
          this.waiting = false
        },
        error: (error: any) => {
          console.log(error)
          this.errorMessage = 'Parece que hay un error y por ahora no podemos mostrar servicios.'

          this.waiting = false
        }
      })

    this._route.params.subscribe({
      next: (params: Params) => {
        this.message = params['message']
      }
    })
  }
}
