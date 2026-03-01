import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { IApiSuccessResponse } from '../../models/iapi-success-response.model';
import { IAppointmentSlotAvailable } from '../../models/iappointment-slot-available.model';
import { IAppointment } from '../../models/iappointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  private httpClient = inject(HttpClient);
  private base = inject(BaseService);
  private servicesEndpoint = '';
  private appointmentsEndpoint = '';

  constructor() {
    this.servicesEndpoint = `${this.base.URL}/services`;
    this.appointmentsEndpoint = `${this.base.URL}/appointments`;
  }

  public getMyAppointments(): Observable<IApiSuccessResponse<IAppointment[]>> {
    return this.httpClient.get<IApiSuccessResponse<IAppointment[]>>(`${this.appointmentsEndpoint}`);
  }

  public getSlotsForService(serviceId: number): Observable<IApiSuccessResponse<IAppointmentSlotAvailable[]>> {
    return this.httpClient.get<IApiSuccessResponse<IAppointmentSlotAvailable[]>>(
      `${this.servicesEndpoint}/${serviceId}/appointment_slots`
    );
  }

  public createAppointment(slotId: number, serviceId: number): Observable<IApiSuccessResponse<IAppointment>> {
    return this.httpClient.post<IApiSuccessResponse<IAppointment>>(
      `${this.appointmentsEndpoint}`,
      { appointment_slot_id: slotId, service_id: serviceId }
    );
  }
}
