import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AppointmentsService } from '../../../services/api/appointments.service';
import { StoreContextService } from '../../../store/store-context.service';
import { ToastService } from '../../../services/ui/toast/toast.service';
import { IAppointmentSlotAvailable } from '../../../models/iappointment-slot-available.model';
import { IAppointment } from '../../../models/iappointment.model';
import { formatApiError } from '../../../utils/error-handler';

@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './appointment-booking.component.html',
  styleUrl: './appointment-booking.component.css'
})
export class AppointmentBookingComponent implements OnInit {
  @Input({ required: true }) serviceId!: number;

  private appointmentsService = inject(AppointmentsService);
  private storeContextService = inject(StoreContextService);
  private toastService = inject(ToastService);

  slots: IAppointmentSlotAvailable[] = [];
  bookedAppointment: IAppointment | null = null;
  bookingSlotId: number | null = null;
  loadingSlots = false;
  errorMessage = '';

  get isLoggedIn(): boolean {
    return !this.storeContextService.isTokenExpired();
  }

  ngOnInit(): void {
    this.loadSlots();
  }

  loadSlots(): void {
    this.loadingSlots = true;
    this.errorMessage = '';
    this.appointmentsService.getSlotsForService(this.serviceId).subscribe({
      next: (response) => {
        this.slots = response.data;
        this.loadingSlots = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = formatApiError(error);
        this.loadingSlots = false;
      }
    });
  }

  book(slot: IAppointmentSlotAvailable): void {
    this.bookingSlotId = slot.id;
    this.bookedAppointment = null;
    this.appointmentsService.createAppointment(slot.id, this.serviceId).subscribe({
      next: (response) => {
        this.bookedAppointment = response.data;
        this.bookingSlotId = null;
        this.toastService.showSuccess('¡Cita apartada exitosamente!');
        this.loadSlots();
      },
      error: (error: HttpErrorResponse) => {
        this.bookingSlotId = null;
        this.toastService.showError(formatApiError(error));
        this.loadSlots();
      }
    });
  }

  isSlotFull(slot: IAppointmentSlotAvailable): boolean {
    return slot.current_requests >= slot.max_requests;
  }

  remainingSpots(slot: IAppointmentSlotAvailable): number {
    return slot.max_requests - slot.current_requests;
  }
}
