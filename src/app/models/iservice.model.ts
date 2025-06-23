export interface IService {
  id:               number;
  title:            string;
  description:      string;
  service_type_id:  number;
  service_type:     string;
  price:            number;
  state:            string;
  company_id:       number;
  url?:             string;
}
