import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppointmentSlotsService } from '../../../services/api/appointment-slots.service';
import { IAppointmentSlot } from '../../../models/iappointment-slot.model';
import { IService } from '../../../models/iservice.model';
import { ServicesService } from '../../../services/api/services.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-appointment-slot-manager',
  standalone: true,
  imports: [CommonModule,
            RouterModule,
            ReactiveFormsModule,
            MatDatepickerModule,
            MatNativeDateModule,
            MatFormFieldModule,
            MatInputModule],
  templateUrl: './appointment-slot-manager.component.html',
  styleUrl: './appointment-slot-manager.component.css'
})
export class AppointmentSlotManagerComponent implements OnInit {
  slots: IAppointmentSlot[] = [];
  availableServices: IService[] = [];
  errorMessage: string = '';
  waiting: boolean = true;
  allSlots: IAppointmentSlot[] = [];

  showModal: boolean = false;

  newSlotForm: FormGroup;
  selectedDate: Date = new Date();
  selectedSlot: IAppointmentSlot | null = null;

  private appointmentSlotsService = inject(AppointmentSlotsService);
  private servicesService = inject(ServicesService);
  private formBuilder = inject(FormBuilder);

  constructor() {
    this.newSlotForm = this.formBuilder.group({
      starting: ['', Validators.required],
      duration: [0, [Validators.required, Validators.min(1)]],
      max_requests: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadSlots();
    this.loadAvailableServices();
  }

  onDateChange(event: any): void {
    const date: Date = event.value;
    this.selectedDate = date;

    const formattedDate = this.formatDateForDatetimeLocal(date);
    this.selectedSlot = null;

    this.newSlotForm.patchValue({ starting: formattedDate });

    this.loadSlotsForSelectedDate();
  }

  loadSlots(): void {
    this.appointmentSlotsService.getSlots().subscribe({
      next: (response) => {
        this.allSlots = response.data;
        this.loadSlotsForSelectedDate();
      },
      error: (error) => {
        console.error('Error cargando slots:', error);
      }
    });
  }

  loadSlotsForSelectedDate(): void {
    this.slots = this.allSlots.filter(slot => {
      const slotDate = new Date(slot.starting);
      return slotDate.toDateString() === this.selectedDate.toDateString();
    });
  }

  loadAvailableServices(): void {
    this.servicesService.getMyBasicServices().subscribe({
      next: (response) => {
        this.availableServices = response.data;
      },
      error: (error) => {
        console.error('Error cargando servicios:', error);
      }
    });
  }

  openCreateSlotModal(): void {
    this.showModal = true;
  }

  closeCreateSlotModal(): void {
    this.showModal = false;
    this.newSlotForm.reset({
      starting: '',
      duration: 0,
      max_requests: 1
    });
  }

  createSlot(): void {
    if (this.newSlotForm.invalid) {
      return;
    }

    const time = this.newSlotForm.get('starting')?.value;

    // Combina fecha y hora
    const datePart = this.getDateOnly(this.selectedDate);
    const startingDateTimeString = `${datePart}T${time}:00`; // segundos fijos en 00
    const startingDateTime = new Date(startingDateTimeString);

    const slotData = {
      ...this.newSlotForm.value,
      starting: startingDateTime.toISOString(),
    };

    this.appointmentSlotsService.createSlot(slotData).subscribe({
      next: () => {
        this.loadSlots();
        this.closeCreateSlotModal();
      },
      error: (error) => {
        console.error('Error creando slot:', error);
      }
    });
  }

  toggleSlotState(slot: IAppointmentSlot): void {
    const action = slot.state === 'active' ? 'suspend' : 'resume';
    this.appointmentSlotsService.toggleSlotState(slot.id, action).subscribe({
      next: () => this.loadSlots(),
      error: (error) => {
        console.error('Error cambiando estado del slot:', error);
      }
    });
  }

  deleteSlot(slot: IAppointmentSlot): void {
    if (confirm('¿Seguro que deseas eliminar este turno?')) {
      this.appointmentSlotsService.deleteSlot(slot.id).subscribe({
        next: () => this.loadSlots(),
        error: (error) => {
          console.error('Error eliminando slot:', error);
        }
      });
    }
  }

  toggleSlot(slot: IAppointmentSlot): void {
    if (this.selectedSlot && this.selectedSlot.id === slot.id) {
      // Si el slot ya está seleccionado, lo deseleccionamos
      this.selectedSlot = null;
    } else {
      // Si no está seleccionado, lo cargamos desde la API
      this.appointmentSlotsService.getSlotById(slot.id).subscribe({
        next: (response) => {
          this.selectedSlot = response.data;
        },
        error: (error) => {
          console.error('Error al cargar slot completo:', error);
        }
      });
    }
  }

  isServiceLinkedToSlot(service: IService): boolean {
    if (!this.selectedSlot || !this.selectedSlot.service_ids) return false;
    return this.selectedSlot.service_ids.includes(service.id);
  }

  toggleServiceForSlot(service: IService): void {
    if (!this.selectedSlot) return;

    const serviceIds = [...(this.selectedSlot.service_ids || [])];

    const index = serviceIds.indexOf(service.id);
    // Verificamos si el servicio ya está vinculado al slot
    if (index === -1) {
      // No está, lo agregamos
      serviceIds.push(service.id);
    } else {
      // Está, lo quitamos
      serviceIds.splice(index, 1);
    }

    // Llamada a la API
    this.appointmentSlotsService.updateSlotServices(this.selectedSlot.id, serviceIds).subscribe({
      next: (updatedSlot) => {
        this.selectedSlot = updatedSlot.data; // Actualizamos el slot local
      },
      error: (error) => {
        console.error('Error al actualizar los servicios:', error);
      }
    });
  }

  private formatDateForDatetimeLocal(date: Date): string {
    const pad = (n: number): string => n < 10 ? '0' + n : n.toString();

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Los meses empiezan en 0
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  getDateOnly(date: Date): string {
    const pad = (n: number): string => n < 10 ? '0' + n : n.toString();

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    return `${year}-${month}-${day}`;
  }
}
