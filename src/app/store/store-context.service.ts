import { Injectable } from '@angular/core';
import { IUser } from '../models/iuser.model';

@Injectable({
  providedIn: 'root'
})
export class StoreContextService {
  searchCriteria = ''

  constructor() { }

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

  getCurrentPage(key: string): number {
    const value = localStorage.getItem(`currentPage_${key}`);
    const page = value ? Number(JSON.parse(value)) : 1;

    return page > 0 ? page : 1;
  }

  setCurrentPage(key: string, page: number): void {
    localStorage.setItem(`currentPage_${key}`, JSON.stringify(Number(page)));
  }
}
