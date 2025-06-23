import { UserRole } from './user-role.enum';
import { ICompany } from './icompany.model';

export interface IUser {
  id?: number;
  name?: string;
  last_name?: string;
  address?: string;
  phone?: string;
  document_type?: string;
  dni?: string;
  email?: string;
  password?: string;
  token?: string;
  roles?: UserRole[];
  business_name?: string;
  wants_to_offer_services?: boolean;
  company?: ICompany;
}
