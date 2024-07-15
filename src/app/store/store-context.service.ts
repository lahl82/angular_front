import { Injectable } from '@angular/core';
import { IUser } from '../models/iuser.model';

@Injectable({
  providedIn: 'root'
})
export class StoreContextService {
  searchCriteria = ''

  setSearchCriteria(searchCriteria: string) {
    this.searchCriteria = searchCriteria
  }

  getSearchCriteria(): string {
    return this.searchCriteria
  }

  getUser(): IUser {
    const ls: string = localStorage.getItem('user') || '{}'
    const res: IUser = JSON.parse(ls)

    return res
  }

  setUser(user: IUser) {
    localStorage.setItem('user', JSON.stringify(user))
  }


  getCurrentPage(): number {
    const lsCurrentPage: string = localStorage.getItem('currentPage') || '1'
    const currentPage: number = JSON.parse(lsCurrentPage)

    return currentPage
  }

  setCurrentPage(currentPage: number) {
    localStorage.setItem('currentPage', JSON.stringify(Number(currentPage)))
  }

  constructor() { }
}
