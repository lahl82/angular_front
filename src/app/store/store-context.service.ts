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
    const cleanedToken = user.token?.replace(/^Bearer\s+/i, '');
    const userToStore = { ...user, token: cleanedToken };

    localStorage.setItem('user', JSON.stringify(userToStore));
  }

  getCurrentPage(key: string): number {
    const value = localStorage.getItem(`currentPage_${key}`);
    const page = value ? Number(JSON.parse(value)) : 1;

    return page > 0 ? page : 1;
  }

  setCurrentPage(key: string, page: number): void {
    localStorage.setItem(`currentPage_${key}`, JSON.stringify(Number(page)));
  }

  getToken(): string | null {
    const user = this.getUser();
    return user && user.token ? user.token : null;
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  isTokenExpired(): boolean {
    const token = this.getToken();

    if(!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;

      if(exp) {
        const now = Math.floor(Date.now() / 1000);
        return exp < now;
      }
    } catch (e) {
      console.error('Error al decodificar el token: ', e);
      return true;
    }

    return false;
  }
}
