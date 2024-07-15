import { Component, inject } from '@angular/core';
import { IService } from '../../models/iservice.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { ServicesService } from '../../services/api/services.service';
import { StoreContextService } from '../../store/store-context.service';
import { IServicesPage } from '../../models/iservices-page.model';

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
  currentPage = 1
  totalPages: number = 1

  private _apiServicesService = inject(ServicesService)
  private _route = inject(ActivatedRoute)
  private _storeContextService = inject(StoreContextService)

  ngOnInit(): void {
    this.fetchServicesPage()

    this._route.params.subscribe({
      next: (params: Params) => {
        this.message = params['message']
      }
    })
  }

  fetchServicesPage() {
    let searchCriteria: string = this._storeContextService.getSearchCriteria()

    this._apiServicesService.getServicesPage(this.currentPage, searchCriteria).subscribe({
        next: (data: IServicesPage) => {
          this.servicesList = data.services
          this.totalPages = Number(data.pagination?.total)
          this.updateCurrentPage(Number(data.pagination?.current_page))
          this.waiting = false
        },
        error: (error: any) => {
          console.log(error)
          this.errorMessage = 'Parece que hay un error y por ahora no podemos mostrar servicios.'

          this.waiting = false
        }
      })
  }

  pagesRange() {
    let arraySize = 10
    let firstValue = this.currentPage + 1 - ((this.currentPage % 10)?this.currentPage % 10:10)

    if (this.totalPages < 10) {
      arraySize = this.totalPages
    }

    if ((firstValue + arraySize) > this.totalPages) {
      arraySize = this.totalPages - firstValue + 1
    }


    let res = new Array(arraySize).fill(firstValue).map((n, index) => {
      return n + index
    })

    return res
  }

  changePage(pageNumber: number) {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this._storeContextService.setCurrentPage(pageNumber)

      this.fetchServicesPage()
    }
  }

  updateCurrentPage(currentPage: number) {
    if (currentPage == 0) {
      currentPage += 1
    }

    this.currentPage = currentPage
    this._storeContextService.setCurrentPage(currentPage)
  }
}
