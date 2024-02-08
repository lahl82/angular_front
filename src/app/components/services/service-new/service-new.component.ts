import { ImageUploadComponent } from './image-upload/image-upload.component';

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocumentComponent } from '../../register/document/document.component';
import { ServiceTypesService } from '../../../services/api/service-types.service';
import { StoreServiceTypesService } from '../../../store/store-service-types.service';
import { IServiceTypes } from '../../../models/iservice-types.model';

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
  serviceImageLoaded: any = null

  private _apiServiceTypesService = inject(ServiceTypesService)
  private _storeServiceTypesService = inject(StoreServiceTypesService)
  private form = inject(FormBuilder)

  constructor() {
    this.serviceNewForm = this.form.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', Validators.required],
      serviceType: ['', Validators.required],
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
    console.log('componente destruido')
  }

  formInvalid(): boolean {
    return this.serviceNewForm.invalid || this.serviceImageLoaded == null
  }

  send() {
    this.serviceNewForm.value.image = this.serviceImageLoaded.fileSource
    console.log(this.serviceNewForm)
    console.log(this.serviceImageLoaded)
    debugger
  }

  hasErrors(controlName: string, errorType: string) {
    return this.serviceNewForm.get(controlName)?.hasError(errorType) && this.serviceNewForm.get(controlName)?.touched
  }

  imageLoadedListener($event: any) {
    this.serviceImageLoaded = $event
  }
}

