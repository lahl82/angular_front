import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { IUser } from '../../models/iuser.model';
import { StoreContextService } from '../../store/store-context.service';
import { IApiSuccessResponse } from '../../models/iapi-success-response.model';
import { HttpResponse } from '@angular/common/http';
import { ILoginResponse } from '../../models/ilogin-response.model';
import { ILoginPayload } from '../../models/ilogin-payload.model';
import { ISignUpResponse } from '../../models/isignup-response.model';
import { ISignUpPayload } from '../../models/isignup-payload.model';
import { ILogoutResponse } from '../../models/ilogout-response.model';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  private httpClient = inject(HttpClient)
  private storeContextService = inject(StoreContextService)
  private base = inject(BaseService)
  private fullEndpoint = ''

  constructor() {
    this.fullEndpoint = this.base.URL
  }

  public signUp(userPostData: IUser):  Observable<HttpResponse<IApiSuccessResponse<ISignUpResponse>>> {
    const userParams: ISignUpPayload = { user: userPostData }

    return this.httpClient.post<IApiSuccessResponse<ISignUpResponse>>(
      `${this.fullEndpoint}/signup.json`,
      userParams,
      { observe: 'response' },
    )
  }

  public logIn(userPostData: IUser): Observable<HttpResponse<IApiSuccessResponse<ILoginResponse>>> {
    const userParams: ILoginPayload = { user: userPostData };

    return this.httpClient.post<IApiSuccessResponse<ILoginResponse>>(
      `${this.fullEndpoint}/login.json`,
      userParams,
      { observe: 'response' },
    )
  }

  public logOut(): Observable<HttpResponse<IApiSuccessResponse<ILogoutResponse>>> {
    const jwtToken: string = this.storeContextService.getUser().token || '';

    const httpHeaders: HttpHeaders = new HttpHeaders({
      Authorization: jwtToken
    });

    return this.httpClient.delete<IApiSuccessResponse<ILogoutResponse>>(
      `${this.fullEndpoint}/logout.json`,
      {
        headers: httpHeaders,
        observe: 'response'
      }
    );
  }
}
