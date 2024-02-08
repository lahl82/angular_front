import { Injectable } from '@angular/core';
import { IServiceTypes } from '../models/iservice-types.model';

@Injectable({
  providedIn: 'root'
})
export class StoreServiceTypesService {

  serviceTypes: IServiceTypes[] = []

  constructor() {
  }

  getServiceTypes(): IServiceTypes[] {
    return this.serviceTypes
  }

  setServiceTypes(serviceTypes: IServiceTypes[]) {
    this.serviceTypes = serviceTypes
  }
}
