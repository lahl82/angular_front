import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { IServiceTypes } from '../../models/iservice-types.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceTypesService {

  private httpClient = inject(HttpClient)
  private base = inject(BaseService)

  private fullEndpoint = ''

  constructor() {
    let endpoint = 'service_types'

    this.fullEndpoint = `${this.base.URL}/${endpoint}`
  }

  public getAllServiceTypes(): Observable<IServiceTypes[]> {
    return this.httpClient.get<IServiceTypes[]>(this.fullEndpoint)
  }
}
