import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IService } from '../../models/iservice.model';
import { IServicesPage } from './../../models/iservices-page.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private _httpClient = inject(HttpClient)
  private _base = inject(BaseService)
  private fullEndpoint = ''

  constructor() {
    let endpoint = 'services'

    this.fullEndpoint = `${this._base.URL}/${endpoint}`
  }

  public getServicesPage(currentPage: number, searchCriteria: string): Observable<IServicesPage> {


    let searchParameter: string = ''
    let pageParameter: string = `page=${Number(currentPage)}`

    if (searchCriteria !== '') {
      searchParameter = `&search=${searchCriteria}`
    }

    return this._httpClient.get<IServicesPage>(`${this.fullEndpoint}.json?${pageParameter + searchParameter}`)
  }

  public getServicesByUserId(id: number): Observable<IService[]> {
    return this._httpClient.get<IService[]>(`${this.fullEndpoint}/${id}.json`)
  }

  public getService(id: number): Observable<IService> {
    return this._httpClient.get<IService>(`${this.fullEndpoint}/${id}.json`)
  }

  public postService(servicePostData: any): Observable<IService> {
    //const serviceParams = { service: servicePostData }
    return this._httpClient.post<IService>(`${this.fullEndpoint}`, servicePostData)
  }
}
