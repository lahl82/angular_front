import { Injectable } from '@angular/core';
import { IUser } from '../models/iuser.model';

@Injectable({
  providedIn: 'root'
})
export class StoreContextService {

  getUser(): IUser {
    const ls: string = localStorage.getItem('user') || '{}'
    const res: IUser = JSON.parse(ls)

    return res
  }

  setUser(user: IUser) {
    localStorage.setItem('user', JSON.stringify(user))
  }

  constructor() { }
}
