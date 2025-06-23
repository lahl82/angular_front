import { ServicesService } from './../../../services/api/services.service';
import { ImageUploadComponent } from './image-upload/image-upload.component';

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServiceTypesService } from '../../../services/api/service-types.service';
import { StoreServiceTypesService } from '../../../store/store-service-types.service';
import { IServiceTypes } from '../../../models/iservice-types.model';
import { IService } from '../../../models/iservice.model';
import { IApiSuccessResponse } from '../../../models/iapi-success-response.model';
import { StoreContextService } from '../../../store/store-context.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { formatApiError } from '../../../utils/error-handler';
import { finalize } from 'rxjs/operators';
import { ToastService } from '../../../services/ui/toast/toast.service';

@Component({
  selector: 'app-service-new',
  standalone: true,
  imports: [ImageUploadComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './service-new.component.html',
  styleUrl: './service-new.component.css'
})
export class ServiceNewComponent implements OnInit, OnDestroy {

  serviceNewForm: FormGroup
  serviceTypes: IServiceTypes[] = []
  serviceImagesBase64Loaded: any[] = [null, null, null, null]
  serviceImagesBase64Touched: boolean = false

  waiting: boolean = true
  waitingMessage: string = 'Cargando datos. Por favor espere un momento'
  errorMessage: string = ''

  private servicesService = inject(ServicesService)
  private serviceTypesService = inject(ServiceTypesService)
  private storeServiceTypesService = inject(StoreServiceTypesService)
  private storeContextService = inject(StoreContextService)
  private router = inject(Router)
  private toast = inject(ToastService)

  private form = inject(FormBuilder)

  constructor() {
    this.serviceNewForm = this.form.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', Validators.required],
      service_type_id: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    // this.serviceNewForm.patchValue(this.activeUser)

    // this.serviceNewForm.valueChanges.subscribe(value => {
    //   console.log(value)
    // })

    // this.serviceNewForm.get('documentType')?.valueChanges.subscribe(value => {

    // })

    this.serviceTypesService.getAllServiceTypes()
    .pipe(finalize(() => this.waiting = false))
    .subscribe({
      next: (data: IServiceTypes[]) => {
        this.storeServiceTypesService.setServiceTypes(data)
        this.serviceTypes = data
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = formatApiError(error);
        this.toast.showError(this.errorMessage);
        console.error('Error descargando tipos de servicio desde API:', error);
      }
    })
  }

  ngOnDestroy(): void {
    console.log('component destroyed')
  }

  formInvalid(): boolean {
    return this.serviceNewForm.invalid || this.imagesEmpty()
  }

  imagesEmpty(): boolean {
    return this.serviceImagesBase64Loaded.toString() === ',,,'
  }

  imagesInvalid(): boolean {
    return this.imagesEmpty() && this.serviceImagesBase64Touched
  }

  send() {
    this.waiting = true
    this.waitingMessage = 'Salvando datos. Espere un momento'

    let formData: any = new FormData()

    Object.keys(this.serviceNewForm.controls).forEach(formControlName => {
      formData.append(formControlName, this.serviceNewForm.get(formControlName)?.value)
    })

    this.serviceImagesBase64Loaded.forEach((image, i) => {
      if (this.serviceImagesBase64Loaded[i]) {
        formData.append('data[]', this.serviceImagesBase64Loaded[i])
      }
    })

    this.servicesService.postService(formData)
      .pipe(finalize(() => this.waiting = false))
      .subscribe({
        next: (response: IApiSuccessResponse<IService>) => {
          const message = response?.message || 'Servicio creado';
          
          this.toast.showSuccess(message);
          console.log(`Servicio creado: ${message}`)

          this.router.navigate(['services-list']);
        },
        error: (error: HttpErrorResponse) => {
          const message:string = formatApiError(error);
          this.toast.showError(message);
          console.error('Error creando el servicio en API:', error);

          this.router.navigate(['services-list']);
        }
      })
  }

  hasErrors(controlName: string, errorType: string) {
    return this.serviceNewForm.get(controlName)?.hasError(errorType) && this.serviceNewForm.get(controlName)?.touched
  }

  imageBase64LoadedListener($event: any, index: number) {
    if (!this.serviceImagesBase64Touched) {
      this.serviceImagesBase64Touched = true
    }

    this.serviceImagesBase64Loaded[index] = $event
  }
}
