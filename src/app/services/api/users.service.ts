import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { IService } from '../../models/iservice.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private _httpClient = inject(HttpClient)
  private _base = inject(BaseService)
  private fullEndpoint = ''

  constructor() {
    let endpoint = this.constructor.name.slice(1, -7).toLowerCase()

    this.fullEndpoint = `${this._base.URL}/${endpoint}`
  }

  public getServicesByUserId(userId: number): Observable<IService[]> {
    return this._httpClient.get<IService[]>(`${this.fullEndpoint}/${userId}/services`)
  }
}
