import { StoreContextService } from '../../../store/store-context.service';
import { Component, OnInit, inject } from '@angular/core';
import { IService } from '../../../models/iservice.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { UsersService } from '../../../services/api/users.service';

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
  emptyList = false
  emptyListMessage: string = 'No hay servicios para mostrar'

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
      next: (data: IService[]) => {
        this.servicesList = data

        if (this.servicesList.length === 0) {
          this.emptyList = true
        }

        this.waiting = false
      },
      error: (error: any) => {
        console.log(error)
        this.errorMessage = 'Hubo un error cargando los datos y no se pueden registrar servicios.'
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
