export interface IAppointmentSlot {
  id: number;
  starting: string; // ISO8601
  duration: number;
  max_requests: number;
  state: string;
  company_id: number;
  service_ids: number[];
}
