import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
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
  private slotsSubject = new BehaviorSubject<IAppointmentSlot[]>([]);
  public slots$ = this.slotsSubject.asObservable();

  constructor() {
    const endpoint = 'appointment_slots';
    this.fullEndpoint = `${this.base.URL}/${endpoint}`;
  }

  public getSlotById(slotId: number): Observable<IApiSuccessResponse<IAppointmentSlot>> {
    return this.httpClient.get<IApiSuccessResponse<IAppointmentSlot>>(`${this.fullEndpoint}/${slotId}`);
  }

  // Crear un nuevo slot
  public createSlot(slotData: any): Observable<IApiSuccessResponse<IAppointmentSlot>> {
    return this.httpClient.post<IApiSuccessResponse<IAppointmentSlot>>(`${this.fullEndpoint}`, slotData);
  }

  // Actualizar un slot (duración, horario, cupo)
  public updateSlot(slotId: number, slotData: any): Observable<IApiSuccessResponse<IAppointmentSlot>> {
    return this.httpClient.patch<IApiSuccessResponse<IAppointmentSlot>>(
      `${this.fullEndpoint}/${slotId}`,
      slotData
    );
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
  
  public loadSlots(): void {
    this.httpClient.get<IApiSuccessResponse<IAppointmentSlot[]>>(`${this.fullEndpoint}.json`)
      .subscribe({
        next: (response) => this.setSlots(response.data),
        error: (error) => console.error('Error cargando slots:', error)
      });
  }

  public loadSlotsForMonth(month: number, year: number): void {
    this.httpClient.get<IApiSuccessResponse<IAppointmentSlot[]>>(`${this.fullEndpoint}/for_month/${year}/${month}.json`)
      .subscribe({
        next: (response) => this.setSlots(response.data),
        error: (error) => console.error('Error cargando slots por mes:', error)
      });
  }
 
  // Setear and obtener slots desde el BehaviorSubject del este servicio
  public setSlots(slots: IAppointmentSlot[]): void {
    this.slotsSubject.next(slots);
  }

  public getSlotsSnapshot(): IAppointmentSlot[] {
    return this.slotsSubject.getValue();
  }

  // Quita un slot del estado local
  public removeSlotFromState(slotId: number): void {
    const filtered = this.getSlotsSnapshot().filter(slot => slot.id !== slotId);
    this.setSlots(filtered);
  }

  // Reemplaza un slot en el estado local por uno actualizado (ej: toggle suspend/resume)
  public updateSlotInState(updatedSlot: IAppointmentSlot): void {
    const slots = this.getSlotsSnapshot().map(slot =>
      slot.id === updatedSlot.id ? updatedSlot : slot
    );
    this.setSlots(slots);
  }

  public getHighlightedDates(): Date[] {
    const slots = this.getSlotsSnapshot();
    const uniqueDates = new Set<string>();

    for (const slot of slots) {
      const date = new Date(slot.starting);
      const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      uniqueDates.add(normalized.toISOString());
    }

    return Array.from(uniqueDates).map(dateStr => new Date(dateStr));
  }
}
