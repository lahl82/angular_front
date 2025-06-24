import { Component, OnInit, inject, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppointmentSlotsService } from '../../../services/api/appointment-slots.service';
import { IAppointmentSlot } from '../../../models/iappointment-slot.model';
import { IService } from '../../../models/iservice.model';
import { ServicesService } from '../../../services/api/services.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule, MatCalendar} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { ToastService } from '../../../services/ui/toast/toast.service';
import {  getTimeOnly,
          combineDateAndTime,
          formatDateForDatetimeLocal,
          getDateOnly,
          formatLongDate,
          isDateInPast,
          isDateTimeInPast
       } from '../../../utils/date-utils';

@Component({
  selector: 'app-appointment-slot-manager',
  standalone: true,
  imports: [CommonModule,
            RouterModule,
            ReactiveFormsModule,
            MatDatepickerModule,
            MatNativeDateModule,
            MatFormFieldModule,
            MatInputModule,
            MatIconModule,
            MatTooltipModule,
            MatButtonModule,
          ],
  templateUrl: './appointment-slot-manager.component.html',
  styleUrl: './appointment-slot-manager.component.css'
})
export class AppointmentSlotManagerComponent implements OnInit {
  @ViewChild('calendar') calendar!: MatCalendar<Date>;

  availableServices: IService[] = [];
  
  errorMessage: string = '';
  waiting: boolean = true;

  slots: IAppointmentSlot[] = [];
  allSlots: IAppointmentSlot[] = [];
  selectedSlot: IAppointmentSlot | null = null;
  
  showModal: boolean = false;
  slotForm: FormGroup;

  editMode = false;
  editingSlot: IAppointmentSlot | null = null;
   
  selectedDate: Date = new Date();
  viewDate: Date = new Date();
  highlightedDates: Date[] = [];
  calendarReady: boolean = false;

  // Utilidades de fecha que se usan solo en el template
  public getDateOnly = getDateOnly;

  private appointmentSlotsService = inject(AppointmentSlotsService);
  private servicesService = inject(ServicesService);
  private formBuilder = inject(FormBuilder);
  private toast = inject(ToastService)

  getDateClass = (date: Date | null): string => {
    if (!date) return '';

    return this.highlightedDates.some(d =>
      d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate()
    ) ? 'highlighted-date' : '';
  }

  constructor() {
    this.slotForm = this.formBuilder.group({
      starting: ['', Validators.required],
      duration: [0, [Validators.required, Validators.min(1)]],
      max_requests: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadSlotsForViewedMonth();
    this.loadAvailableServices();

    this.appointmentSlotsService.slots$.subscribe(slots => {
      this.allSlots = slots;
      this.loadSlotsForSelectedDate();
      this.updateHighlightedDates();
    });
  }

  onDateChange(date: Date | null): void {
    if (!date) { return; }

    this.selectedDate = date;

    const formattedDate = formatDateForDatetimeLocal(date);
    this.selectedSlot = null;

    this.slotForm.patchValue({ starting: formattedDate });

    this.loadSlotsForSelectedDate();
  }

  loadSlotsForViewedMonth(): void {
    const month = this.viewDate.getMonth() + 1;
    const year = this.viewDate.getFullYear();

    this.appointmentSlotsService.loadSlotsForMonth(month, year);
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

  get isCalendarReady(): boolean {
    return this.calendarReady;
  }

  get formattedSelectedDate(): string {
    return formatLongDate(this.selectedDate);
  }

// ===================INICIO LOGICA DEL MODAL CREACION EDICION SLOT======================= //

  openCreateSlotModal(): void {
    if (this.isSelectedDateInPast()) {
      const message = 'No se pueden crear turnos en fechas pasadas.';
      this.toast.showError(message);
      return;
    }
    
    this.editMode = false;
    this.editingSlot = null;
    this.slotForm.reset({
      starting: '',
      duration: 0,
      max_requests: 1
    });
    this.showModal = true;
  }

  openEditSlotModal(slot: IAppointmentSlot): void {
    if (this.isSelectedDateInPast()) {
      const message = 'No se pueden editar turnos en fechas pasadas.';
      this.toast.showError(message);
      return;
    }

    this.editMode = true;
    this.editingSlot = slot;
    this.slotForm.setValue({
      starting: getTimeOnly(slot.starting),
      duration: slot.duration,
      max_requests: slot.max_requests
    });
    this.showModal = true;
  }

  createOrUpdateSlot(): void {
    if (this.editMode && this.editingSlot) {
      this.updateSlot();
    } else {
      this.createSlot();
    }
  }

  createSlot(): void {
    if (this.slotForm.invalid) {
      return;
    }

    const time = this.slotForm.get('starting')?.value;
    const datetime = combineDateAndTime(this.selectedDate, time);
    const fullDate = new Date(datetime);

    if (this.isStartingInPast(fullDate)) {
      alert('No se puede crear un turno en una hora pasada.');
      return;
    }

    const slotData = {
      ...this.slotForm.value,
      starting: fullDate,
    };

    this.appointmentSlotsService.createSlot(slotData).subscribe({
      next: (response) => {
        const updatedSlots = [
          ...this.appointmentSlotsService.getSlotsSnapshot(),
          response.data
        ];

        this.appointmentSlotsService.setSlots(updatedSlots);

        this.closeSlotModal();
      },
      error: (error) => {
        console.error('Error creando slot:', error);
      }
    });
  }

  updateSlot(): void {
    if (!this.editingSlot || this.slotForm.invalid) return;

    const time = this.slotForm.get('starting')?.value;

    const updatedData = {
      ...this.slotForm.value,
      starting: combineDateAndTime(this.selectedDate, time)
    };

    this.appointmentSlotsService.updateSlot(this.editingSlot.id, updatedData).subscribe({
      next: (response) => {
        const updatedSlot = response.data;

        // Reemplazamos el slot en el estado local
        const updatedSlots = this.appointmentSlotsService.getSlotsSnapshot().map(slot =>
          slot.id === updatedSlot.id ? updatedSlot : slot
        );

        this.appointmentSlotsService.setSlots(updatedSlots);

        // Si justo ese slot estaba seleccionado, lo actualizamos también
        if (this.selectedSlot?.id === updatedSlot.id) {
          this.selectedSlot = updatedSlot;
        }

        this.closeSlotModal();
      },
      error: (error) => {
        console.error('Error actualizando slot:', error);
      }
    });
  }

  closeSlotModal(): void {
    this.showModal = false;
    this.editMode = false;
    this.editingSlot = null;
    this.slotForm.reset();
  }
// ====================FIN LOGICA DEL MODAL CREACION EDICION SLOT========================= //

  toggleSlotState(slot: IAppointmentSlot): void {
    const action = slot.state === 'active' ? 'suspend' : 'resume';

    this.appointmentSlotsService.toggleSlotState(slot.id, action).subscribe({
      next: (response) => this.appointmentSlotsService.updateSlotInState(response.data),
      error: (error) => {
        console.error('Error cambiando estado del slot:', error);
      }
    });
  }

  deleteSlot(slot: IAppointmentSlot): void {
    if (confirm('¿Seguro que deseas eliminar este turno?')) {
      this.appointmentSlotsService.deleteSlot(slot.id).subscribe({
        next: () => this.appointmentSlotsService.removeSlotFromState(slot.id),
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

  isSelectedDateInPast(): boolean {
    return isDateInPast(this.selectedDate);
  }

  isStartingInPast(starting: Date): boolean {
    return isDateTimeInPast(starting);
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

  updateHighlightedDates(): void {
    this.highlightedDates = [...this.appointmentSlotsService.getHighlightedDates()];

    this.refreshCalendarView();
  }

  isSlotInPast(slot: IAppointmentSlot): boolean {
    return new Date(slot.starting) < new Date();
  }

  goToPreviousMonth(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
    this.triggerSlotReload();
  }

  goToNextMonth(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
    this.triggerSlotReload();
  }

  triggerSlotReload(): void {
    this.loadSlotsForViewedMonth()

    this.refreshCalendarView();
  }

  private refreshCalendarView(): void {
    this.calendarReady = false;
    setTimeout(() => {
      this.calendarReady = true;
    }, 0);
  }
}
