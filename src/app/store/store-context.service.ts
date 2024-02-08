import { Injectable } from '@angular/core';
import { IUser } from '../models/iuser.model';

@Injectable({
  providedIn: 'root'
})
export class StoreContextService {

  user: IUser = {}

  getUser(): IUser {
    return this.user
  }

  setUser(user: IUser) {
    this.user = user
  }

  constructor() { }
}
