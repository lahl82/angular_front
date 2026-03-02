import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AppointmentsService } from '../../services/api/appointments.service';
import { ToastService } from '../../services/ui/toast/toast.service';
import { IAppointment } from '../../models/iappointment.model';
import { formatApiError } from '../../utils/error-handler';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-appointments.component.html',
  styleUrl: './my-appointments.component.css'
})
export class MyAppointmentsComponent implements OnInit {

  private appointmentsService = inject(AppointmentsService);
  private toastService = inject(ToastService);

  appointments: IAppointment[] = [];
  waiting = true;
  errorMessage = '';
  cancelingId: number | null = null;

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.waiting = true;
    this.errorMessage = '';
    this.appointmentsService.getMyAppointments().subscribe({
      next: (response) => {
        this.appointments = response.data;
        this.waiting = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = formatApiError(error);
        this.waiting = false;
      }
    });
  }

  cancel(apt: IAppointment): void {
    if (!confirm(`¿Confirmas que deseas cancelar tu cita de "${apt.service_name}"? Esta acción no se puede deshacer.`)) return;

    this.cancelingId = apt.id;
    this.appointmentsService.cancelAppointment(apt.id).subscribe({
      next: () => {
        this.cancelingId = null;
        this.toastService.showSuccess('Cita cancelada exitosamente.');
        this.loadAppointments();
      },
      error: (error: HttpErrorResponse) => {
        this.cancelingId = null;
        this.toastService.showError(formatApiError(error));
      }
    });
  }

  canCancel(apt: IAppointment): boolean {
    return apt.state === 'active';
  }

  stateLabel(state: string): string {
    const labels: Record<string, string> = {
      active: 'Confirmada',
      arrived: 'Llegó',
      attended: 'Atendida',
      with_pending_info: 'Info pendiente',
      finished: 'Finalizada',
      missed: 'No asistió',
      user_canceled: 'Cancelada por ti',
      seller_canceled: 'Cancelada por el servicio'
    };
    return labels[state] ?? state;
  }

  stateClass(state: string): string {
    const classes: Record<string, string> = {
      active: 'bg-success',
      arrived: 'bg-info',
      attended: 'bg-primary',
      with_pending_info: 'bg-warning text-dark',
      finished: 'bg-secondary',
      missed: 'bg-danger',
      user_canceled: 'bg-danger',
      seller_canceled: 'bg-danger'
    };
    return classes[state] ?? 'bg-secondary';
  }
}
