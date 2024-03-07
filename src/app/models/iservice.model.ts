export interface IService {
  id?:              number
  title:            string
  description:      string
  images:           string
  service_type:     string
  price:            number
  aasm_state:       string
  service_type_id:  number
  user_id:          number;
  url?:             string;
}
