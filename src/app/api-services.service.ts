import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IService } from './models/iservice.model';

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  private _httpClient = inject(HttpClient)

  private baseURL = 'http://localhost:3001/services'

  constructor() { }

  public getAllServices(): Observable<IService[]> {
    return this._httpClient.get<IService[]>(this.baseURL)
  }

  public getService(id: number): Observable<IService> {
    return this._httpClient.get<IService>(`${this.baseURL}/${id}`)
  }
}
