import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { IUser } from '../../models/iuser.model';
import { StoreContextService } from '../../store/store-context.service';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  private _httpClient = inject(HttpClient)
  private _storeContextService = inject(StoreContextService)
  private _base = inject(BaseService)
  private fullEndpoint = ''

  constructor() {
    this.fullEndpoint = this._base.URL
  }

  public signUp(userPostData: IUser): Observable<IUser> {
    const userParams = { user: userPostData }

    return this._httpClient.post<IUser>(`${this.fullEndpoint}/signup.json`, userParams)
  }

  public logIn(userPostData: IUser): Observable<any> {
    const userParams = { user: userPostData }

    return this._httpClient.post<any>(
      `${this.fullEndpoint}/login.json`,
      userParams,
      { observe: 'response' },
    )
  }

  public logOut(): Observable<any> {
    const jwtToken: string = this._storeContextService.getUser().token || ''

    const httpHeaders: HttpHeaders = new HttpHeaders({
      Authorization: jwtToken
    });

    return this._httpClient.delete<any>(
      `${this.fullEndpoint}/logout.json`,
      { headers: httpHeaders }
    )
  }
}
