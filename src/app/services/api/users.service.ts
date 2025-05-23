import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { IApiSuccessResponse } from '../../models/iapi-success-response.model';
import { IServicesPage } from '../../models/iservices-page.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private _httpClient = inject(HttpClient)
  private _base = inject(BaseService)
  private fullEndpoint = ''

  constructor() {
    let endpoint = 'users'

    this.fullEndpoint = `${this._base.URL}/${endpoint}`
  }

  public getServicesByUserId(userId: number): Observable<IApiSuccessResponse<IServicesPage>> {
    return this._httpClient.get<IApiSuccessResponse<IServicesPage>>(`${this.fullEndpoint}/${userId}/services`)
  }
}
