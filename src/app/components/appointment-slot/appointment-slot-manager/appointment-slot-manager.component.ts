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
    this.loadSlotsForSelectedDate();
  }

  loadSlots(): void {
    this.appointmentSlotsService.getSlots().subscribe({
      next: (response) => {
        this.slots = response.data;
        this.allSlots = response.data;
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

    const slotData = this.newSlotForm.value;

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

  isServiceLinkedToSlot(service: IService): boolean {
    // Aún no implementado
    return false;
  }

  toggleServiceForSlot(service: IService): void {
    // Aún no implementado
  }
}
