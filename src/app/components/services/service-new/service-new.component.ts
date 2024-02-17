import { ServicesService } from './../../../services/api/services.service';
import { ImageUploadComponent } from './image-upload/image-upload.component';

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocumentComponent } from '../../register/document/document.component';
import { ServiceTypesService } from '../../../services/api/service-types.service';
import { StoreServiceTypesService } from '../../../store/store-service-types.service';
import { IServiceTypes } from '../../../models/iservice-types.model';
import { IService } from '../../../models/iservice.model';
import { StoreContextService } from '../../../store/store-context.service';

@Component({
  selector: 'app-service-new',
  standalone: true,
  imports: [DocumentComponent, ImageUploadComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './service-new.component.html',
  styleUrl: './service-new.component.css'
})
export class ServiceNewComponent implements OnInit, OnDestroy {

  serviceNewForm: FormGroup
  serviceTypes: IServiceTypes[] = []
  serviceImageBase64Loaded: any = null

  private _apiServicesService = inject(ServicesService)
  private _apiServiceTypesService = inject(ServiceTypesService)
  private _storeServiceTypesService = inject(StoreServiceTypesService)
  private _storeContextService = inject(StoreContextService)

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

    this._apiServiceTypesService.getAllServiceTypes().subscribe((data: IServiceTypes[]) => {
      this._storeServiceTypesService.setServiceTypes(data)
      this.serviceTypes = data
    })
  }

  ngOnDestroy(): void {
    console.log('component destroyed')
  }

  formInvalid(): boolean {
    return this.serviceNewForm.invalid || this.serviceImageBase64Loaded == null
  }

  send() {
    const userId: number = Number(this._storeContextService.getUser()?.id)

    let formData: any = new FormData()

    Object.keys(this.serviceNewForm.controls).forEach(formControlName => {
      formData.append(formControlName, this.serviceNewForm.get(formControlName)?.value)
    })

    formData.append('user_id', userId)
    formData.append('data', this.serviceImageBase64Loaded)

    this._apiServicesService.postService(formData)
      .subscribe((data: IService) => {
        console.log(`Returned:${data}`)
      })
  }

  hasErrors(controlName: string, errorType: string) {
    return this.serviceNewForm.get(controlName)?.hasError(errorType) && this.serviceNewForm.get(controlName)?.touched
  }

  imageBase64LoadedListener($event: any) {
    this.serviceImageBase64Loaded = $event
  }
}
