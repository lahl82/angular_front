import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocumentComponent } from './document/document.component';
import { CommonModule } from '@angular/common';
import { IUser } from '../../models/iuser.model';
import { Router } from '@angular/router';
import { SessionsService } from '../../services/api/sessions.service';
import { IApiSuccessResponse } from '../../models/iapi-success-response.model';
import { ISignUpResponse } from '../../models/isignup-response.model';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { formatApiError } from '../../utils/error-handler';
import { finalize } from 'rxjs/operators';
import { ToastService } from '../../services/ui/toast/toast.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    DocumentComponent,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup
  activeUser: IUser = {}
  documentTypes: string[] = ['Cédula', 'Pasaporte']
  documentNameTypeSelected?: string
  showDocument: boolean = false
  errorMessage: string = ''
  waiting: boolean = false
  waitingMessage: string = 'Salvando datos. Espere un momento'
  dni: string = ''

  private formBuilder = inject(FormBuilder)
  private sessionsService = inject(SessionsService)
  private router = inject(Router)
  private toast = inject(ToastService)

  constructor() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      documentType: [''],
      email: ['', [Validators.email, Validators.required]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      wantsToOfferServices: [false],
      businessName: ['']
    })
  }

  ngOnInit(): void {
    // this.activeUser = this.storeContextService.getUser()

    // if (this.activeUser.secondName != null && String(this.activeUser.secondName).length < 3) {
    //   this.registerForm.get('secondName')?.setValidators([Validators.required, Validators.minLength(3)])
    //   this.registerForm.get('secondName')?.clearValidators()
    //   this.registerForm.get('secondName')?.updateValueAndValidity()
    // } else {
    //   this.registerForm.get('secondName')?.disable()
    // }

    // this.registerForm.patchValue(this.activeUser)

    // this.registerForm.get('name')?.disable()
    // this.registerForm.get('document')?.disable()

    this.registerForm.valueChanges.subscribe(value => {
      console.log(value)
    })

    this.registerForm.get('documentType')?.valueChanges.subscribe(value => {
      this.showDocument = value != ''
      this.documentNameTypeSelected = this.documentTypes[value]
    })
  }

  ngOnDestroy(): void {
  }

  send() {
    if (this.registerForm.invalid) return;

    this.waiting = true

    const userData = this.prepareDataToPost()

    this.sessionsService.signUp(userData)
    .pipe(finalize(() => this.waiting = false))
    .subscribe({
        next: (response: HttpResponse<IApiSuccessResponse<ISignUpResponse>>) => {
          const user = response?.body?.data?.user;
          const message = response?.body?.message || 'Registro creado';

          this.toast.showSuccess(message);
          console.log('Registro creado:', user);

          this.router.navigate(['login']);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = formatApiError(error);
          console.error('Error al registrar usuario:', error);
        }
      })
  }

  prepareDataToPost(): IUser {
    let userData: IUser = {}

    userData['name'] = this.registerForm.value['name'];
    userData['last_name'] = this.registerForm.value['lastName'];
    userData['address'] = this.registerForm.value['address'];
    userData['phone'] = this.registerForm.value['phone'];
    userData['password'] = this.registerForm.value['password'];
    userData['document_type'] = this.documentNameTypeSelected;
    userData['dni'] = this.dni;
    userData['email'] = this.registerForm.value['email'];
    userData['business_name'] = this.registerForm.value['businessName'];
    userData['wants_to_offer_services'] = this.registerForm.value['wantsToOfferServices'];

    return userData
  }

  formInvalid(): boolean {
    return this.registerForm.invalid
  }

  hasErrors(controlName: string, errorType: string) {
    return this.registerForm.get(controlName)?.hasError(errorType) && this.registerForm.get(controlName)?.touched
  }

  dniListener($event: any) {
    this.dni = $event
  }
}
