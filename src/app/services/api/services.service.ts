import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IService } from '../../models/iservice.model';
import { BaseService } from './base.service';
import { IApiSuccessResponse } from '../../models/iapi-success-response.model';
import { IServicesPage } from './../../models/iservices-page.model';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private httpClient = inject(HttpClient)
  private base = inject(BaseService)
  private fullEndpoint = ''

  constructor() {
    let endpoint = 'services'

    this.fullEndpoint = `${this.base.URL}/${endpoint}`
  }

  public getServicesPage(currentPage: number, searchCriteria: string, perPage: number = 10): Observable<IApiSuccessResponse<IServicesPage>> {
    let searchParameter: string = ''
    let pageParameter: string = `page=${Number(currentPage)}`
    let perPageParameter: string = `&per_page=${Number(perPage)}`

    if (searchCriteria !== '') {
      searchParameter = `&search_value=${encodeURIComponent(searchCriteria)}`
    }

    return this.httpClient.get<IApiSuccessResponse<IServicesPage>>(`${this.fullEndpoint}.json?${pageParameter + perPageParameter + searchParameter}`)
  }

  public getService(id: number): Observable<IApiSuccessResponse<IService>> {
    return this.httpClient.get<IApiSuccessResponse<IService>>(`${this.fullEndpoint}/${id}.json`)
  }

  public postService(servicePostData: any): Observable<IService> {
    //const serviceParams = { service: servicePostData }
    return this.httpClient.post<IService>(`${this.fullEndpoint}`, servicePostData)
  }
  // Servicios del usuario actual completos (paginados con imagen principal)
  public getMyServices(): Observable<IApiSuccessResponse<IServicesPage>> {
    return this.httpClient.get<IApiSuccessResponse<IServicesPage>>(`${this.fullEndpoint}/mine`);
  }

  // Servicios del usuario actual basicos (sin paginación ni imagenes)
  public getMyBasicServices(): Observable<IApiSuccessResponse<IService[]>> {
    return this.httpClient.get<IApiSuccessResponse<IService[]>>(`${this.fullEndpoint}/basic_mine`);
  }
}
