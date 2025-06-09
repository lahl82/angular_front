import { Component, inject } from '@angular/core';
import { IService } from '../../models/iservice.model';
import { CommonModule, NgIf } from '@angular/common';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { ServicesService } from '../../services/api/services.service';
import { StoreContextService } from '../../store/store-context.service';
import { IServicesPage } from '../../models/iservices-page.model';
import { IApiSuccessResponse } from '../../models/iapi-success-response.model';
import { formatApiError } from '../../utils/error-handler';
import { PaginatorComponent } from '../shared/paginator/paginator.component';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { PriceDisplayComponent } from '../shared/price-display/price-display.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf, PaginatorComponent, PriceDisplayComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  servicesList: IService[] = []
  message: string = ''
  errorMessage: string = ''
  emptyListMessage: string = 'No hay servicios asociados para mostrar'
  waitingMessage: string = 'Descargando servicios. Espere un momento por favor.'

  waiting: boolean = true
  
  totalPages: number = 1
  perPage: number = 10
  perPageOptions: number[] = [5, 10, 20, 50]
  totalCount: number = 0;
  isMobile: boolean = false;

  private servicesService = inject(ServicesService)
  private activatedRoute = inject(ActivatedRoute)
  private storeContextService = inject(StoreContextService)
  
  private readonly PAGE_KEY = 'public_services';

  ngOnInit(): void {
    this.checkScreen();
    this.updateCurrentPage(1);
    this.fetchServicesPage();
    
    // Detectar cambios de tamaño de pantalla
    window.addEventListener('resize', () => this.checkScreen());

    this.activatedRoute.queryParams.subscribe({
      next: (params: Params) => {
        this.message = params['message'] || '';
      }
    });
  }

  checkScreen(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  fetchServicesPage() {
    let searchCriteria: string = this.storeContextService.getSearchCriteria()

    this.servicesService.getServicesPage(this.getCurrentPage(), searchCriteria, this.perPage)
    .pipe(finalize(() => this.waiting = false))
    .subscribe({
        next: (response: IApiSuccessResponse<IServicesPage>) => {
          const currentPage = Number(response.data.pagination?.current_page || 1);
          this.totalPages = Number(response.data.pagination?.total_pages || 1);
          this.totalCount = Number(response.data.pagination?.total_count || 0);

          this.updateCurrentPage(currentPage);

          this.servicesList = response.data.services
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = formatApiError(error);
          console.error('Error recibido desde API:', error);
        }
      })
  }

  onPageChange(pageNumber: number) {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.updateCurrentPage(pageNumber);

      this.fetchServicesPage()
    }
  }

  onPerPageChange(value: number) {
    this.perPage = value;
    this.updateCurrentPage(1); // reset al inicio
    this.fetchServicesPage();
  }

  getCurrentPage(): number {
    return this.storeContextService.getCurrentPage(this.PAGE_KEY);
  }

  updateCurrentPage(page: number) {
    this.storeContextService.setCurrentPage(this.PAGE_KEY, page);
  }

  getShortDescription(service: IService): string {
    if (!service.description) return '';
    
    return service.description.length > 40
      ? `${service.description.slice(0, 40)}...`
      : service.description;
  }

  get hasServices(): boolean {
    return this.servicesList?.length > 0;
  }

  get emptyList(): boolean {
    return this.servicesList?.length === 0;
  }
}
