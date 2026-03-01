import { IAppointmentSlot } from './iappointment-slot.model';

export interface IAppointmentSlotAvailable extends IAppointmentSlot {
  current_requests: number;
}
