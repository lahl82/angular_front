import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { IApiSuccessResponse } from '../../models/iapi-success-response.model';
import { IAppointmentSlot } from '../../models/iappointment-slot.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentSlotsService {

  private httpClient = inject(HttpClient);
  private base = inject(BaseService);
  private fullEndpoint = '';

  constructor() {
    const endpoint = 'appointment_slots';
    this.fullEndpoint = `${this.base.URL}/${endpoint}`;
  }

  // Obtener todos los slots
  public getSlots(): Observable<IApiSuccessResponse<IAppointmentSlot[]>> {
    return this.httpClient.get<IApiSuccessResponse<IAppointmentSlot[]>>(`${this.fullEndpoint}.json`);
  }

  getSlotById(slotId: number): Observable<IApiSuccessResponse<IAppointmentSlot>> {
    return this.httpClient.get<IApiSuccessResponse<IAppointmentSlot>>(`${this.fullEndpoint}/${slotId}`);
  }

  // Crear un nuevo slot
  public createSlot(slotData: any): Observable<IApiSuccessResponse<IAppointmentSlot>> {
    return this.httpClient.post<IApiSuccessResponse<IAppointmentSlot>>(`${this.fullEndpoint}`, slotData);
  }

  // Actualizar servicios permitidos
  public updateSlotServices(slotId: number, serviceIds: number[]): Observable<IApiSuccessResponse<IAppointmentSlot>> {
    return this.httpClient.patch<IApiSuccessResponse<IAppointmentSlot>>(
      `${this.fullEndpoint}/${slotId}/update_services`,
      { service_ids: serviceIds }
    );
  }

  // Eliminar un slot
  public deleteSlot(slotId: number): Observable<IApiSuccessResponse<null>> {
    return this.httpClient.delete<IApiSuccessResponse<null>>(`${this.fullEndpoint}/${slotId}`);
  }

  // Suspender o reanudar un slot
  public toggleSlotState(slotId: number, action: 'suspend' | 'resume'): Observable<IApiSuccessResponse<IAppointmentSlot>> {
    return this.httpClient.patch<IApiSuccessResponse<IAppointmentSlot>>(
      `${this.fullEndpoint}/${slotId}/${action}`,
      {}
    );
  }
}
