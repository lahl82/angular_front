import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IService } from '../../models/iservice.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private _httpClient = inject(HttpClient)
  private _base = inject(BaseService)
  private fullEndpoint = ''

  constructor() {
    let endpoint = this.constructor.name.slice(1, -7).toLowerCase()

    this.fullEndpoint = `${this._base.URL}/${endpoint}`
  }

  public getAllServices(): Observable<IService[]> {
    return this._httpClient.get<IService[]>(`${this.fullEndpoint}.json`)
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
