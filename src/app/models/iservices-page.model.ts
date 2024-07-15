import { IService } from './iservice.model';
import { IPagination } from "./ipagination.model";

export interface IServicesPage {
  services: IService[];
  pagination?: IPagination;
}
