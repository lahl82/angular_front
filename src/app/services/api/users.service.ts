import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { IApiSuccessResponse } from '../../models/iapi-success-response.model';
import { IServicesPage } from '../../models/iservices-page.model';
import { IService } from '../../models/iservice.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private httpClient = inject(HttpClient)
  private base = inject(BaseService)
  private fullEndpoint = ''

  constructor() {
    let endpoint = 'users'

    this.fullEndpoint = `${this.base.URL}/${endpoint}`
  }

  // Servicios de un usuario (paginados)
  public getServicesByUserId(userId: number): Observable<IApiSuccessResponse<IServicesPage>> {
    return this.httpClient.get<IApiSuccessResponse<IServicesPage>>(`${this.fullEndpoint}/${userId}/services`);
  }

  // Servicios de un usuario (sin paginación)
  public getAllServicesByUserId(userId: number): Observable<IApiSuccessResponse<IService[]>> {
    return this.httpClient.get<IApiSuccessResponse<IService[]>>(`${this.fullEndpoint}/${userId}/basic_services`);
  }
}
