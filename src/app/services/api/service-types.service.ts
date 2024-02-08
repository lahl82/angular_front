import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { IServiceTypes } from '../../models/iservice-types.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceTypesService {

  private _httpClient = inject(HttpClient)
  private _base = inject(BaseService)

  private fullEndpoint = ''

  constructor() {
    let endpoint = 'service_types'

    this.fullEndpoint = `${this._base.URL}/${endpoint}`
  }

  public getAllServiceTypes(): Observable<IServiceTypes[]> {
    return this._httpClient.get<IServiceTypes[]>(this.fullEndpoint)
  }
}
