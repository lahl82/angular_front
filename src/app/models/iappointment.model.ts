export interface IAppointment {
  id: number;
  state: string;
  appointment_slot_service_id: number;
  user_id: number;
  starting: string;
  service_id: number;
  service_name: string;
  duration: number;
}
